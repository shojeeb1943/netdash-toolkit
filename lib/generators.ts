// form-in, text-out tools: Linux commands and configs, SEO snippets, domain helpers, small security calculators.
// each definition is a field list plus one pure build(); nothing here touches the network.

export type GValue = string | number | boolean
export type GValues = Record<string, GValue>

export interface GField {
  id: string
  label: string
  type: "text" | "textarea" | "number" | "select" | "checkbox" | "date" | "password"
  value: GValue
  options?: { value: string; label: string }[]
  placeholder?: string
  hint?: string
}

export type GResult = string | { error: string }

export interface SerpPreview {
  title: string
  url: string
  description: string
}

export interface GDef {
  fields: GField[]
  outputLabel: string
  note?: string
  /** may be async (Web Crypto) */
  build: (v: GValues) => GResult | Promise<GResult>
  serp?: (v: GValues) => SerpPreview
  /** short notes shown under the result */
  help?: string[]
}

const s = (v: GValues, id: string) => String(v[id] ?? "").trim()
const b = (v: GValues, id: string) => v[id] === true
const n = (v: GValues, id: string) => Number(v[id])
const lines = (text: string) =>
  text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
const err = (error: string): { error: string } => ({ error })

// posix single-quote: safe for any string, including spaces and quotes
export function shellQuote(value: string): string {
  if (/^[A-Za-z0-9_@%+=:,./-]+$/.test(value)) return value
  return `'${value.replace(/'/g, `'\\''`)}'`
}

const HOST = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i
export const isDomain = (value: string) => HOST.test(value)
const isHostLike = (value: string) =>
  isDomain(value) || /^\d{1,3}(\.\d{1,3}){3}$/.test(value) || /^[0-9a-f:]+$/i.test(value)
const SYSNAME = /^[a-z_][a-z0-9_-]{0,31}\$?$/i

// ---------- Linux ----------

const PERM = ["r", "w", "x"] as const
const WHO = [
  ["u", "Owner"],
  ["g", "Group"],
  ["o", "Others"],
] as const

export function modeFromOctal(octal: string): { digits: number[]; special: number } | null {
  if (!/^[0-7]{3,4}$/.test(octal)) return null
  const padded = octal.padStart(4, "0")
  return { special: Number(padded[0]), digits: [1, 2, 3].map((i) => Number(padded[i])) }
}

export function symbolic(digits: number[], special = 0): string {
  return digits
    .map((d, i) => {
      const r = d & 4 ? "r" : "-"
      const w = d & 2 ? "w" : "-"
      let x = d & 1 ? "x" : "-"
      const bit = [4, 2, 1][i]
      if (special & bit) x = d & 1 ? (i === 2 ? "t" : "s") : i === 2 ? "T" : "S"
      return r + w + x
    })
    .join("")
}

function chmodBuild(v: GValues): GResult {
  let digits: number[]
  let special: number
  const octal = s(v, "octal")
  if (octal) {
    const parsed = modeFromOctal(octal)
    if (!parsed) return err("Octal must be 3 or 4 digits, each 0 to 7 (for example 755 or 2755).")
    digits = parsed.digits
    special = parsed.special
  } else {
    digits = WHO.map(([w]) => PERM.reduce((sum, p, i) => sum + (b(v, `${w}${p}`) ? 4 >> i : 0), 0))
    special = Number(v.special)
  }
  const code = `${special ? special : ""}${digits.join("")}`
  const sym = symbolic(digits, special)
  const classes = WHO.map(([w], i) => {
    const d = digits[i]
    return `${w}=${(d & 4 ? "r" : "") + (d & 2 ? "w" : "") + (d & 1 ? "x" : "")}`
  }).join(",")
  return [
    `Octal:     ${code}`,
    `Symbolic:  ${sym}`,
    `Listing:   -${sym}  (file)   d${sym}  (directory)`,
    "",
    `chmod ${code} file`,
    `chmod ${classes} file`,
    `chmod -R ${code} directory`,
  ].join("\n")
}

function umaskBuild(v: GValues): GResult {
  const raw = s(v, "umask")
  if (!/^[0-7]{3,4}$/.test(raw)) return err("Umask must be 3 or 4 octal digits, for example 022.")
  const mask = raw.slice(-3).split("").map(Number)
  const file = [6, 6, 6].map((d, i) => d & ~mask[i] & 7)
  const dir = [7, 7, 7].map((d, i) => d & ~mask[i] & 7)
  return [
    `umask ${raw}`,
    "",
    `New files:        ${file.join("")}  (${symbolic(file)})`,
    `New directories:  ${dir.join("")}  (${symbolic(dir)})`,
    "",
    "Files never get the execute bit from umask alone: the base mode for files is 666, for directories 777.",
  ].join("\n")
}

function chownBuild(v: GValues): GResult {
  const user = s(v, "user")
  const group = s(v, "group")
  const path = s(v, "path")
  if (!user && !group) return err("Enter a user, a group, or both.")
  for (const [name, value] of [
    ["User", user],
    ["Group", group],
  ] as const) {
    if (value && !SYSNAME.test(value) && !/^\d+$/.test(value))
      return err(`${name} must be a valid account name or a numeric id.`)
  }
  if (!path) return err("Enter a path.")
  const owner = `${user}${group ? `:${group}` : ""}`
  const flags = [b(v, "recursive") && "-R", b(v, "nodereference") && "-h", b(v, "verbose") && "-v"]
    .filter(Boolean)
    .join(" ")
  return `chown ${flags ? flags + " " : ""}${owner} ${shellQuote(path)}`
}

function scpBuild(v: GValues): GResult {
  const host = s(v, "host")
  const user = s(v, "user")
  const port = n(v, "port")
  const local = s(v, "local")
  const remote = s(v, "remote")
  if (!isHostLike(host)) return err("Enter a valid host name or IP address.")
  if (!Number.isInteger(port) || port < 1 || port > 65535) return err("Port must be 1 to 65535.")
  if (!local || !remote) return err("Enter both a local and a remote path.")
  const target = `${user ? user + "@" : ""}${host.includes(":") ? `[${host}]` : host}:${shellQuote(remote)}`
  const args = [
    "scp",
    port !== 22 && `-P ${port}`,
    s(v, "identity") && `-i ${shellQuote(s(v, "identity"))}`,
    b(v, "recursive") && "-r",
    b(v, "preserve") && "-p",
    b(v, "compress") && "-C",
  ].filter(Boolean)
  return v.direction === "download"
    ? [...args, target, shellQuote(local)].join(" ")
    : [...args, shellQuote(local), target].join(" ")
}

function rsyncBuild(v: GValues): GResult {
  const source = s(v, "source")
  const dest = s(v, "dest")
  const host = s(v, "host")
  const port = n(v, "port")
  if (!source || !dest) return err("Enter a source and a destination.")
  if (host && !isHostLike(host)) return err("Enter a valid host name or IP address.")
  if (!Number.isInteger(port) || port < 1 || port > 65535) return err("Port must be 1 to 65535.")
  const user = s(v, "user")
  const remote = host ? `${user ? user + "@" : ""}${host}:` : ""
  const flags = [
    b(v, "archive") && "-a",
    b(v, "compress") && "-z",
    b(v, "verbose") && "-v",
    b(v, "progress") && "--progress",
    b(v, "dry") && "-n",
    b(v, "delete") && "--delete",
    b(v, "human") && "-h",
  ].filter(Boolean) as string[]
  const parts = ["rsync", ...flags]
  if (host && port !== 22) parts.push("-e", shellQuote(`ssh -p ${port}`))
  for (const pattern of lines(s(v, "exclude"))) parts.push(`--exclude=${shellQuote(pattern)}`)
  const src = v.direction === "pull" ? remote + source : source
  const dst = v.direction === "pull" ? dest : remote + dest
  parts.push(shellQuote(src), shellQuote(dst))
  return parts.join(" ")
}

function nginxBuild(v: GValues): GResult {
  const domain = s(v, "domain").toLowerCase()
  const root = s(v, "root")
  if (!isDomain(domain)) return err("Enter a valid domain such as example.com.")
  if (!root.startsWith("/")) return err("Document root must be an absolute path.")
  const ssl = b(v, "ssl")
  const names = b(v, "www") ? `${domain} www.${domain}` : domain
  const out: string[] = []
  if (ssl) {
    out.push(
      "server {",
      "    listen 80;",
      "    listen [::]:80;",
      `    server_name ${names};`,
      "    return 301 https://$host$request_uri;",
      "}",
      ""
    )
  }
  out.push("server {")
  if (ssl) {
    out.push("    listen 443 ssl;", "    listen [::]:443 ssl;", "    http2 on;")
  } else {
    out.push("    listen 80;", "    listen [::]:80;")
  }
  out.push(`    server_name ${names};`, `    root ${root};`, "    index index.php index.html;")
  if (ssl) {
    out.push(
      `    ssl_certificate     /etc/letsencrypt/live/${domain}/fullchain.pem;`,
      `    ssl_certificate_key /etc/letsencrypt/live/${domain}/privkey.pem;`,
      "    ssl_protocols TLSv1.2 TLSv1.3;"
    )
  }
  out.push(`    client_max_body_size ${Math.max(1, n(v, "upload") || 1)}m;`)
  if (b(v, "gzip"))
    out.push(
      "    gzip on;",
      "    gzip_types text/plain text/css application/json application/javascript text/xml image/svg+xml;"
    )
  out.push("", "    location / {", "        try_files $uri $uri/ /index.php?$args;", "    }")
  if (b(v, "php")) {
    const sock = s(v, "socket") || "/run/php/php8.3-fpm.sock"
    out.push(
      "",
      "    location ~ \\.php$ {",
      "        include fastcgi_params;",
      "        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;",
      `        fastcgi_pass unix:${sock};`,
      "    }"
    )
  }
  if (b(v, "cache"))
    out.push(
      "",
      "    location ~* \\.(?:css|js|jpg|jpeg|png|gif|svg|webp|woff2?)$ {",
      "        expires 30d;",
      '        add_header Cache-Control "public, immutable";',
      "    }"
    )
  out.push("", "    location ~ /\\.(?!well-known) {", "        deny all;", "    }", "}")
  return out.join("\n")
}

function apacheBuild(v: GValues): GResult {
  const domain = s(v, "domain").toLowerCase()
  const root = s(v, "root")
  const email = s(v, "email")
  if (!isDomain(domain)) return err("Enter a valid domain such as example.com.")
  if (!root.startsWith("/")) return err("Document root must be an absolute path.")
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err("Enter a valid admin email.")
  const alias = b(v, "www") ? [`    ServerAlias www.${domain}`] : []
  const body = (port: number, ssl: boolean) =>
    [
      `<VirtualHost *:${port}>`,
      `    ServerName ${domain}`,
      ...alias,
      ...(email ? [`    ServerAdmin ${email}`] : []),
      `    DocumentRoot ${root}`,
      ...(ssl
        ? [
            "    SSLEngine on",
            `    SSLCertificateFile /etc/letsencrypt/live/${domain}/fullchain.pem`,
            `    SSLCertificateKeyFile /etc/letsencrypt/live/${domain}/privkey.pem`,
          ]
        : []),
      "",
      `    <Directory ${root}>`,
      "        Options -Indexes +FollowSymLinks",
      `        AllowOverride ${b(v, "override") ? "All" : "None"}`,
      "        Require all granted",
      "    </Directory>",
      ...(b(v, "php")
        ? [
            "",
            '    <FilesMatch "\\.php$">',
            '        SetHandler "proxy:unix:/run/php/php8.3-fpm.sock|fcgi://localhost"',
            "    </FilesMatch>",
          ]
        : []),
      "",
      `    ErrorLog \${APACHE_LOG_DIR}/${domain}-error.log`,
      `    CustomLog \${APACHE_LOG_DIR}/${domain}-access.log combined`,
      "</VirtualHost>",
    ].join("\n")
  if (!b(v, "ssl")) return body(80, false)
  const redirect = [
    "<VirtualHost *:80>",
    `    ServerName ${domain}`,
    ...alias,
    `    Redirect permanent / https://${domain}/`,
    "</VirtualHost>",
  ].join("\n")
  return `${redirect}\n\n${body(443, true)}`
}

function htaccessBuild(v: GValues): GResult {
  const out: string[] = []
  const rewrite: string[] = []
  if (b(v, "https"))
    rewrite.push(
      "RewriteCond %{HTTPS} off",
      "RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]"
    )
  if (v.www === "add")
    rewrite.push(
      "RewriteCond %{HTTP_HOST} !^www\\. [NC]",
      "RewriteRule ^ https://www.%{HTTP_HOST}%{REQUEST_URI} [L,R=301]"
    )
  if (v.www === "remove")
    rewrite.push(
      "RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]",
      "RewriteRule ^ https://%1%{REQUEST_URI} [L,R=301]"
    )
  if (rewrite.length) out.push("# redirects", "RewriteEngine On", ...rewrite, "")
  if (b(v, "noindex")) out.push("# no directory listings", "Options -Indexes", "")
  if (s(v, "error404")) out.push("# custom 404 page", `ErrorDocument 404 ${s(v, "error404")}`, "")
  if (b(v, "gzip"))
    out.push(
      "# compression",
      "<IfModule mod_deflate.c>",
      "    AddOutputFilterByType DEFLATE text/html text/plain text/css application/json application/javascript text/xml image/svg+xml",
      "</IfModule>",
      ""
    )
  if (b(v, "cache"))
    out.push(
      "# browser caching",
      "<IfModule mod_expires.c>",
      "    ExpiresActive On",
      '    ExpiresByType image/jpeg "access plus 1 year"',
      '    ExpiresByType image/png "access plus 1 year"',
      '    ExpiresByType image/webp "access plus 1 year"',
      '    ExpiresByType text/css "access plus 1 month"',
      '    ExpiresByType application/javascript "access plus 1 month"',
      "</IfModule>",
      ""
    )
  if (b(v, "headers"))
    out.push(
      "# security headers",
      "<IfModule mod_headers.c>",
      '    Header always set X-Content-Type-Options "nosniff"',
      '    Header always set X-Frame-Options "SAMEORIGIN"',
      '    Header always set Referrer-Policy "strict-origin-when-cross-origin"',
      "</IfModule>",
      ""
    )
  if (b(v, "protect"))
    out.push(
      "# protect sensitive files",
      '<FilesMatch "(^\\.|wp-config\\.php|\\.(ini|log|sql|bak)$)">',
      "    Require all denied",
      "</FilesMatch>",
      ""
    )
  return out.length ? out.join("\n").trimEnd() : err("Pick at least one option.")
}

// ---------- SEO / web ----------

function utmBuild(v: GValues): GResult {
  let url: URL
  try {
    url = new URL(s(v, "url"))
  } catch {
    return err("Enter a full URL starting with https://")
  }
  if (!/^https?:$/.test(url.protocol)) return err("Only http and https URLs are supported.")
  if (!s(v, "source") || !s(v, "medium") || !s(v, "campaign"))
    return err("Source, medium and campaign are required.")
  for (const key of ["source", "medium", "campaign", "term", "content"]) {
    const value = s(v, key)
    if (value) url.searchParams.set(`utm_${key}`, value)
  }
  return url.toString()
}

function robotsBuild(v: GValues): GResult {
  const agent = s(v, "agent") || "*"
  const out = [`User-agent: ${agent}`]
  const disallow = lines(s(v, "disallow"))
  const allow = lines(s(v, "allow"))
  for (const p of [...disallow, ...allow])
    if (!p.startsWith("/") && !p.startsWith("*")) return err(`Paths must start with /, got "${p}".`)
  if (!disallow.length && !allow.length) out.push("Disallow:")
  for (const p of disallow) out.push(`Disallow: ${p}`)
  for (const p of allow) out.push(`Allow: ${p}`)
  if (n(v, "delay") > 0) out.push(`Crawl-delay: ${n(v, "delay")}`)
  const sitemap = s(v, "sitemap")
  if (sitemap) {
    try {
      new URL(sitemap)
    } catch {
      return err("Sitemap must be a full URL.")
    }
    out.push("", `Sitemap: ${sitemap}`)
  }
  return out.join("\n")
}

const xmlEscape = (t: string) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

function sitemapBuild(v: GValues): GResult {
  const urls = lines(s(v, "urls"))
  if (!urls.length) return err("Enter at least one URL, one per line.")
  if (urls.length > 50000) return err("A sitemap file holds at most 50,000 URLs.")
  const priority = n(v, "priority")
  if (!(priority >= 0 && priority <= 1)) return err("Priority must be between 0 and 1.")
  for (const u of urls) {
    try {
      new URL(u)
    } catch {
      return err(`Not a valid URL: ${u}`)
    }
  }
  const lastmod = s(v, "lastmod")
  const body = urls.map((u) =>
    [
      "  <url>",
      `    <loc>${xmlEscape(u)}</loc>`,
      lastmod && `    <lastmod>${lastmod}</lastmod>`,
      v.changefreq !== "none" && `    <changefreq>${v.changefreq}</changefreq>`,
      `    <priority>${priority.toFixed(1)}</priority>`,
      "  </url>",
    ]
      .filter(Boolean)
      .join("\n")
  )
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...body,
    "</urlset>",
  ].join("\n")
}

function schemaBuild(v: GValues): GResult {
  const type = String(v.type)
  const name = s(v, "name")
  if (!name) return err("Enter a name or headline.")
  const base: Record<string, unknown> = { "@context": "https://schema.org", "@type": type }
  const url = s(v, "url")
  if (url) base.url = url
  const image = s(v, "image")
  if (image) base.image = image
  const description = s(v, "description")
  if (type === "FAQPage") {
    const pairs = lines(s(v, "faq")).map((l) => l.split("::").map((x) => x.trim()))
    if (!pairs.length || pairs.some((p) => p.length < 2 || !p[0] || !p[1]))
      return err('Enter one question per line as "Question :: Answer".')
    return wrapLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: pairs.map(([q, a]) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    })
  }
  if (type === "Article") {
    base.headline = name
    if (description) base.description = description
    if (s(v, "author")) base.author = { "@type": "Person", name: s(v, "author") }
    if (s(v, "published")) base.datePublished = s(v, "published")
  } else if (type === "Product") {
    base.name = name
    if (description) base.description = description
    if (s(v, "brand")) base.brand = { "@type": "Brand", name: s(v, "brand") }
    if (s(v, "price")) {
      base.offers = {
        "@type": "Offer",
        price: s(v, "price"),
        priceCurrency: s(v, "currency") || "USD",
        availability: "https://schema.org/InStock",
      }
    }
  } else {
    base.name = name
    if (description) base.description = description
    if (s(v, "logo")) base.logo = s(v, "logo")
    const same = lines(s(v, "sameAs"))
    if (same.length) base.sameAs = same
    if (s(v, "phone")) base.telephone = s(v, "phone")
    if (type === "LocalBusiness" && s(v, "address"))
      base.address = { "@type": "PostalAddress", streetAddress: s(v, "address") }
  }
  return wrapLd(base)
}

function wrapLd(data: unknown): string {
  return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2).replace(/</g, "\\u003c")}\n</script>`
}

const attr = (t: string) => t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")

function ogBuild(v: GValues): GResult {
  const title = s(v, "title")
  const url = s(v, "url")
  if (!title) return err("Enter a title.")
  try {
    new URL(url)
  } catch {
    return err("Enter the full page URL.")
  }
  const out = [
    `<meta property="og:type" content="${v.type}" />`,
    `<meta property="og:title" content="${attr(title)}" />`,
    s(v, "description") &&
      `<meta property="og:description" content="${attr(s(v, "description"))}" />`,
    `<meta property="og:url" content="${attr(url)}" />`,
    s(v, "image") && `<meta property="og:image" content="${attr(s(v, "image"))}" />`,
    s(v, "site") && `<meta property="og:site_name" content="${attr(s(v, "site"))}" />`,
    `<meta name="twitter:card" content="${v.card}" />`,
    `<meta name="twitter:title" content="${attr(title)}" />`,
    s(v, "description") &&
      `<meta name="twitter:description" content="${attr(s(v, "description"))}" />`,
    s(v, "image") && `<meta name="twitter:image" content="${attr(s(v, "image"))}" />`,
  ].filter(Boolean)
  return out.join("\n")
}

// measured with canvas in the browser; a character-count fallback keeps the logic testable under jsdom
export function measurePx(text: string, font: string): number {
  if (typeof document !== "undefined") {
    try {
      const ctx = document.createElement("canvas").getContext("2d")
      if (ctx) {
        ctx.font = font
        const w = ctx.measureText(text).width
        if (w > 0) return Math.round(w)
      }
    } catch {
      /* fall through */
    }
  }
  return Math.round(text.length * 9.5)
}

function lengthReport(
  label: string,
  text: string,
  font: string,
  maxPx: number,
  minChars: number,
  maxChars: number
): GResult {
  if (!text) return err(`Enter your ${label}.`)
  const px = measurePx(text, font)
  const verdict =
    px > maxPx
      ? "Too long: Google will probably cut it off with an ellipsis."
      : text.length < minChars
        ? "Short: you may be leaving room to say more."
        : "Good: fits in the search result."
  return [
    `Characters:   ${text.length}  (aim for ${minChars} to ${maxChars})`,
    `Pixel width:  ${px}px of about ${maxPx}px`,
    "",
    verdict,
  ].join("\n")
}

const TITLE_FONT = "20px Arial, sans-serif"
const DESC_FONT = "14px Arial, sans-serif"

export function truncateToPx(text: string, font: string, maxPx: number): string {
  if (measurePx(text, font) <= maxPx) return text
  let end = text.length
  while (end > 1 && measurePx(text.slice(0, end) + "...", font) > maxPx) end--
  return text.slice(0, end).trimEnd() + "..."
}

// ---------- domains ----------

export function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / 86_400_000)
}

function expiryBuild(v: GValues): GResult {
  const raw = s(v, "expiry")
  if (!raw) return err("Pick the expiry date from your registrar.")
  const expiry = new Date(`${raw}T00:00:00`)
  if (Number.isNaN(expiry.getTime())) return err("That is not a valid date.")
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const left = daysBetween(today, expiry)
  const lines2: string[] = [`Expires:  ${raw}`]
  if (left >= 0) {
    lines2.push(`Days left:  ${left}  (about ${(left / 30.4).toFixed(1)} months)`)
    lines2.push(
      `Renew by:  ${new Date(expiry.getTime() - 30 * 86_400_000).toISOString().slice(0, 10)}  (30 days before, a safe margin)`
    )
    lines2.push(
      left <= 30
        ? "Status: renew now."
        : left <= 90
          ? "Status: renewal window is open."
          : "Status: comfortable."
    )
  } else {
    lines2.push(`Expired ${-left} days ago.`)
    lines2.push(
      -left <= 45
        ? "Most registries keep an expired .com in a grace period of roughly 0 to 45 days; renewal is usually still at the normal price."
        : -left <= 75
          ? "Likely in the redemption period: restoring costs extra and takes a request to the registry."
          : "Likely past redemption: the name may be pending delete or already released."
    )
    lines2.push("These periods vary by registry and registrar: check yours.")
  }
  return lines2.join("\n")
}

function domainNameBuild(v: GValues): GResult {
  const keyword = s(v, "keyword")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
  if (!keyword) return err("Enter a keyword (letters, numbers and hyphens).")
  const split = (t: string) =>
    Array.from(
      new Set(
        t
          .split(/[,\n]/)
          .map((x) =>
            x
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "")
          )
          .filter(Boolean)
      )
    )
  const prefixes = split(s(v, "prefixes"))
  const suffixes = split(s(v, "suffixes"))
  const tlds = s(v, "tlds")
    .split(/[,\s]+/)
    .map((x) => x.replace(/^\./, "").toLowerCase())
    .filter((x) => /^[a-z]{2,24}$/.test(x))
  if (!tlds.length) return err("Enter at least one extension such as .com")
  const max = Math.max(3, n(v, "max") || 20)
  const sep = b(v, "hyphen") ? "-" : ""
  const names = [
    keyword,
    ...prefixes.map((p) => p + sep + keyword),
    ...suffixes.map((x) => keyword + sep + x),
    ...prefixes.flatMap((p) => suffixes.map((x) => p + sep + keyword + sep + x)),
  ].filter((name) => name.length <= max && !name.startsWith("-") && !name.endsWith("-"))
  const out = Array.from(new Set(names)).flatMap((name) => tlds.map((t) => `${name}.${t}`))
  if (!out.length) return err("Nothing fits the maximum length: raise it.")
  return (
    `${out.length} candidates` +
    (out.length > 300 ? " (showing 300)" : "") +
    "\n\n" +
    out.slice(0, 300).join("\n")
  )
}

function transferBuild(v: GValues): GResult {
  const domain = s(v, "domain").toLowerCase()
  if (!isDomain(domain))
    return err("Enter the domain you are transferring, for example example.com.")
  const out = [
    `Transfer checklist for ${domain}`,
    "",
    "Before you start",
    "[ ] The domain is at least 60 days old and was not transferred in the last 60 days (ICANN rule for most TLDs).",
    "[ ] Domain contact email is correct: the approval email goes there.",
    "[ ] Unlock the domain at the current registrar (remove clientTransferProhibited).",
    "[ ] Request the authorization (EPP) code and keep it private.",
    b(v, "dnssec")
      ? "[ ] DNSSEC is on: remove the DS record at the registrar before transferring, and re-add it at the new provider."
      : "[ ] Confirm DNSSEC is off (or plan to move DS records).",
    "[ ] Turn off WHOIS privacy only if the registrar requires it to receive the approval email.",
    "",
    "Protect your services",
    "[ ] Export every DNS record from the current provider (A, AAAA, CNAME, MX, TXT, SRV, CAA).",
    b(v, "dns")
      ? "[ ] DNS is hosted at the old registrar: recreate the zone at the new provider first and switch nameservers before or with the transfer."
      : "[ ] DNS is hosted elsewhere: nothing to move, just keep the nameservers unchanged.",
    b(v, "email")
      ? "[ ] Email runs on this domain: keep MX, SPF, DKIM and DMARC records unchanged during the move."
      : "[ ] No email on this domain: nothing to preserve.",
    "[ ] Lower DNS TTLs to 300 seconds a day or two before.",
    "",
    "Start the transfer",
    "[ ] Create the transfer at the new registrar, paste the authorization code.",
    "[ ] Approve the email from the old registrar if asked (otherwise it auto-approves in 5 to 7 days).",
    "[ ] Pay for the one-year extension that comes with the transfer.",
    "",
    "After it completes",
    "[ ] Check the domain shows as unlocked/locked as you want, and the expiry grew by one year.",
    "[ ] Verify the website, email send/receive and SSL certificate renewals.",
    "[ ] Turn WHOIS privacy and registrar lock back on; re-add the DS record if you use DNSSEC.",
    "[ ] Set auto-renew and a calendar reminder 30 days before expiry.",
  ]
  return out.join("\n")
}

// ---------- security ----------

export function passwordEntropy(password: string): { bits: number; pool: number } {
  let pool = 0
  if (/[a-z]/.test(password)) pool += 26
  if (/[A-Z]/.test(password)) pool += 26
  if (/\d/.test(password)) pool += 10
  if (/[ !-/:-@[-`{-~]/.test(password)) pool += 33
  if (/[^\x00-\x7F]/.test(password)) pool += 100
  return { pool, bits: pool ? Math.log2(pool) * password.length : 0 }
}

function humanTime(seconds: number): string {
  if (seconds < 1) return "less than a second"
  const units: [string, number][] = [
    ["years", 31_557_600],
    ["days", 86_400],
    ["hours", 3_600],
    ["minutes", 60],
    ["seconds", 1],
  ]
  if (seconds > 31_557_600 * 1e9) return "more than a billion years"
  for (const [name, size] of units)
    if (seconds >= size)
      return `${(seconds / size).toLocaleString("en-US", { maximumFractionDigits: 1 })} ${name}`
  return "less than a second"
}

function entropyBuild(v: GValues): GResult {
  const password = String(v.password ?? "")
  if (!password)
    return err("Type or paste a password. It is analysed in your browser and never sent anywhere.")
  const { bits, pool } = passwordEntropy(password)
  const half = Math.pow(2, bits) / 2
  const rating =
    bits < 40
      ? "Very weak"
      : bits < 60
        ? "Weak"
        : bits < 80
          ? "Reasonable"
          : bits < 100
            ? "Strong"
            : "Very strong"
  return [
    `Length:        ${password.length} characters`,
    `Character pool: ${pool}`,
    `Entropy:       ${bits.toFixed(1)} bits   (${rating})`,
    "",
    "Average time to guess by brute force:",
    `  online, 1,000 guesses/s:        ${humanTime(half / 1e3)}`,
    `  offline, 10 billion guesses/s:  ${humanTime(half / 1e10)}`,
    "",
    "This assumes every character is random. A dictionary word, a name or a keyboard pattern is far weaker than the number above.",
  ].join("\n")
}

async function sriBuild(v: GValues): Promise<GResult> {
  const content = String(v.content ?? "")
  if (!content) return err("Paste the exact contents of the script or stylesheet file.")
  const algo = String(v.algo)
  if (!["SHA-256", "SHA-384", "SHA-512"].includes(algo)) return err("Pick a hash algorithm.")
  const digest = await crypto.subtle.digest(algo, new TextEncoder().encode(content))
  let binary = ""
  new Uint8Array(digest).forEach((byte) => (binary += String.fromCharCode(byte)))
  const integrity = `${algo.toLowerCase().replace("-", "")}-${btoa(binary)}`
  const src = s(v, "src") || "https://example.com/file.js"
  const tag =
    v.kind === "css"
      ? `<link rel="stylesheet" href="${attr(src)}" integrity="${integrity}" crossorigin="anonymous">`
      : `<script src="${attr(src)}" integrity="${integrity}" crossorigin="anonymous"></script>`
  return `${integrity}\n\n${tag}`
}

// ---------- batch 3: domain helpers ----------

function lengthBuild(v: GValues): GResult {
  const raw = s(v, "domain")
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
  if (!raw) return err("Enter a domain name.")
  const parts = raw.split(".")
  if (parts.length < 2 || parts.some((p) => !p))
    return err("Enter a name with an extension, such as example.com.")
  const label = parts[0]
  const ext = parts.slice(1).join(".")
  const notes: string[] = []
  if (parts.some((p) => p.length > 63))
    notes.push("A label over 63 characters is not valid in DNS.")
  if (raw.length > 253) notes.push("A full name over 253 characters is not valid in DNS.")
  if (!/^[a-z0-9-]+$/.test(label))
    notes.push("Letters, numbers and hyphens only: other characters need punycode.")
  if (label.startsWith("-") || label.endsWith("-"))
    notes.push("A label cannot start or end with a hyphen.")
  if (label.includes("--") && label[2] !== "-")
    notes.push("Double hyphens look spammy and are easy to mistype.")
  if ((label.match(/-/g) ?? []).length > 1)
    notes.push("More than one hyphen makes a name harder to say and remember.")
  if (/\d/.test(label)) notes.push("Digits can be confused with words when spoken aloud.")
  const verdict =
    label.length <= 8
      ? "Very short: easy to type and remember, hard to find available."
      : label.length <= 15
        ? "Good length for a brand."
        : label.length <= 25
          ? "Long: fine for a keyword domain, harder to type."
          : "Very long: people will mistype it and it will be cut off in many places."
  return [
    `Name part:   ${label.length} characters  (${label})`,
    `Extension:   .${ext}  (${ext.length + 1} characters)`,
    `Full name:   ${raw.length} characters`,
    "",
    verdict,
    ...(notes.length ? ["", ...notes.map((n) => `Note: ${n}`)] : []),
  ].join("\n")
}

function combinationsBuild(v: GValues): GResult {
  const split = (id: string) =>
    Array.from(
      new Set(
        lines(s(v, id))
          .map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, ""))
          .filter(Boolean)
      )
    )
  const a = split("a")
  const b = split("b")
  const c = split("c")
  if (!a.length || !b.length) return err("Enter at least one word in each of the first two lists.")
  const joiner = s(v, "joiner")
  if (joiner && !/^-?$/.test(joiner)) return err("The joiner can be blank or a single hyphen.")
  const tlds = s(v, "tlds")
    .split(/[,\s]+/)
    .map((x) => x.replace(/^\./, "").toLowerCase())
    .filter((x) => /^[a-z]{2,24}$/.test(x))
  if (!tlds.length) return err("Enter at least one extension such as .com")
  const third = c.length ? c : [""]
  const names: string[] = []
  for (const x of a)
    for (const y of b) for (const z of third) names.push([x, y, z].filter(Boolean).join(joiner))
  const valid = Array.from(new Set(names)).filter((n) => n.length <= 63)
  const out = valid.flatMap((n) => tlds.map((t) => `${n}.${t}`))
  if (!out.length) return err("Nothing to show.")
  const shown = out.slice(0, 400)
  return `${out.length} combinations${out.length > 400 ? " (showing 400)" : ""}\n\n${shown.join("\n")}`
}

export const TLD_DATA: { ext: string; kind: "classic" | "new" | "country"; about: string }[] = [
  {
    ext: "com",
    kind: "classic",
    about: "The default for businesses; the most recognised and the most taken.",
  },
  {
    ext: "net",
    kind: "classic",
    about: "Originally for network providers; now a common second choice to .com.",
  },
  {
    ext: "org",
    kind: "classic",
    about: "Associated with non-profits, communities and open source projects.",
  },
  {
    ext: "info",
    kind: "classic",
    about: "General purpose, used for information sites and guides.",
  },
  {
    ext: "biz",
    kind: "classic",
    about: "Intended for businesses; less trusted than .com by many users.",
  },
  {
    ext: "io",
    kind: "country",
    about: "Country code of the British Indian Ocean Territory; popular with tech start-ups.",
  },
  {
    ext: "co",
    kind: "country",
    about: "Country code of Colombia; used as a shorter alternative to .com.",
  },
  {
    ext: "ai",
    kind: "country",
    about: "Country code of Anguilla; widely used by artificial intelligence projects.",
  },
  {
    ext: "me",
    kind: "country",
    about: "Country code of Montenegro; used for personal sites and portfolios.",
  },
  {
    ext: "tv",
    kind: "country",
    about: "Country code of Tuvalu; used for video and streaming sites.",
  },
  { ext: "us", kind: "country", about: "Country code of the United States." },
  {
    ext: "uk",
    kind: "country",
    about: "Country code of the United Kingdom, usually registered as co.uk or org.uk.",
  },
  {
    ext: "de",
    kind: "country",
    about: "Country code of Germany; one of the largest country extensions.",
  },
  {
    ext: "ca",
    kind: "country",
    about: "Country code of Canada; registrants need a Canadian presence.",
  },
  { ext: "in", kind: "country", about: "Country code of India; also used in the form co.in." },
  { ext: "au", kind: "country", about: "Country code of Australia, usually registered as com.au." },
  {
    ext: "eu",
    kind: "country",
    about: "European Union code; registrants must be in the EU or EEA.",
  },
  { ext: "dev", kind: "new", about: "Run by Google for developers; sites must use HTTPS." },
  { ext: "app", kind: "new", about: "Run by Google for applications; sites must use HTTPS." },
  { ext: "tech", kind: "new", about: "For technology companies, products and blogs." },
  { ext: "online", kind: "new", about: "General purpose for any business or site on the web." },
  { ext: "site", kind: "new", about: "General purpose, often used for small sites and projects." },
  { ext: "website", kind: "new", about: "General purpose for any website." },
  { ext: "store", kind: "new", about: "For online shops and retailers." },
  { ext: "shop", kind: "new", about: "For online shops and retailers." },
  { ext: "cloud", kind: "new", about: "For cloud services, hosting and SaaS products." },
  { ext: "host", kind: "new", about: "For hosting companies and hosting related sites." },
  { ext: "hosting", kind: "new", about: "Aimed at hosting providers." },
  {
    ext: "xyz",
    kind: "new",
    about: "Open to anyone; popular for projects and as a low-cost option.",
  },
  { ext: "blog", kind: "new", about: "For blogs and personal publishing." },
  { ext: "agency", kind: "new", about: "For creative, marketing and consulting agencies." },
  { ext: "digital", kind: "new", about: "For digital businesses and agencies." },
  { ext: "network", kind: "new", about: "For networks, communities and network services." },
  { ext: "systems", kind: "new", about: "For IT and engineering companies." },
  { ext: "email", kind: "new", about: "For email services and mail related sites." },
  {
    ext: "space",
    kind: "new",
    about: "General purpose, often used for creative and personal sites.",
  },
]

function extensionBuild(v: GValues): GResult {
  const q = s(v, "query").toLowerCase().replace(/^\./, "")
  const kind = String(v.kind)
  const list = TLD_DATA.filter(
    (t) =>
      (kind === "all" || t.kind === kind) &&
      (!q || t.ext.includes(q) || t.about.toLowerCase().includes(q))
  )
  if (!list.length) return err("No extension matches. Try a shorter search.")
  const label = { classic: "classic", new: "new generic", country: "country code" }
  return [
    `${list.length} extensions`,
    "",
    ...list.map((t) => `.${t.ext.padEnd(9)} ${label[t.kind].padEnd(13)} ${t.about}`),
  ].join("\n")
}

// ---------- definitions ----------

const yes = (id: string, label: string, value = false): GField => ({
  id,
  label,
  type: "checkbox",
  value,
})
const text = (id: string, label: string, value = "", placeholder?: string): GField => ({
  id,
  label,
  type: "text",
  value,
  placeholder,
})
const area = (id: string, label: string, value = "", placeholder?: string): GField => ({
  id,
  label,
  type: "textarea",
  value,
  placeholder,
})
const num = (id: string, label: string, value: number): GField => ({
  id,
  label,
  type: "number",
  value,
})
const pick = (id: string, label: string, value: string, options: [string, string][]): GField => ({
  id,
  label,
  type: "select",
  value,
  options: options.map(([v2, l]) => ({ value: v2, label: l })),
})

export const generatorDefs: Record<string, GDef> = {
  "chmod-calculator": {
    outputLabel: "Result",
    note: "Tick the permissions, or type an octal mode to convert it instead.",
    fields: [
      ...WHO.flatMap(([w, name]) =>
        PERM.map((p, i) =>
          yes(`${w}${p}`, `${name}: ${["read", "write", "execute"][i]}`, w === "u" || p !== "w")
        )
      ),
      pick("special", "Special bit", "0", [
        ["0", "None"],
        ["4", "setuid"],
        ["2", "setgid"],
        ["1", "sticky"],
      ]),
      text("octal", "Octal mode (optional, overrides the boxes)", "", "755"),
    ],
    build: chmodBuild,
  },
  "umask-calculator": {
    outputLabel: "Result",
    fields: [text("umask", "Umask", "022", "022")],
    build: umaskBuild,
  },
  "chown-generator": {
    outputLabel: "Command",
    fields: [
      text("user", "User", "www-data"),
      text("group", "Group", "www-data"),
      text("path", "Path", "/var/www/html"),
      yes("recursive", "Recursive (-R)", true),
      yes("nodereference", "Change a symlink itself, not its target (-h)"),
      yes("verbose", "Verbose (-v)"),
    ],
    build: chownBuild,
  },
  "scp-generator": {
    outputLabel: "Command",
    fields: [
      pick("direction", "Direction", "upload", [
        ["upload", "Upload (local to remote)"],
        ["download", "Download (remote to local)"],
      ]),
      text("user", "Remote user", "root"),
      text("host", "Host", "server.example.com"),
      num("port", "SSH port", 22),
      text("identity", "Identity file (optional)", "", "~/.ssh/id_ed25519"),
      text("local", "Local path", "./backup.tar.gz"),
      text("remote", "Remote path", "/home/root/"),
      yes("recursive", "Recursive (-r)"),
      yes("preserve", "Preserve times and modes (-p)"),
      yes("compress", "Compress (-C)", true),
    ],
    build: scpBuild,
  },
  "rsync-generator": {
    outputLabel: "Command",
    fields: [
      pick("direction", "Direction", "push", [
        ["push", "Push (local to remote)"],
        ["pull", "Pull (remote to local)"],
      ]),
      text("source", "Source path", "/var/www/site/"),
      text("dest", "Destination path", "/var/www/site/"),
      text("user", "Remote user (blank for local copy)", "root"),
      text("host", "Remote host (blank for local copy)", "server.example.com"),
      num("port", "SSH port", 22),
      area("exclude", "Exclude patterns, one per line", ".git\nnode_modules"),
      yes("archive", "Archive mode (-a)", true),
      yes("compress", "Compress (-z)", true),
      yes("verbose", "Verbose (-v)"),
      yes("progress", "Show progress"),
      yes("human", "Human-readable sizes (-h)", true),
      yes("dry", "Dry run (-n): show what would change", true),
      yes("delete", "Delete files missing from the source (--delete)"),
    ],
    note: "Dry run is on by default: untick it only after you have read the output.",
    build: rsyncBuild,
  },
  "nginx-config-generator": {
    outputLabel: "nginx server block",
    fields: [
      text("domain", "Domain", "example.com"),
      yes("www", "Also serve www.", true),
      text("root", "Document root", "/var/www/example.com/public"),
      yes("ssl", "HTTPS with Let's Encrypt paths and an HTTP redirect", true),
      yes("php", "PHP-FPM", true),
      text("socket", "PHP-FPM socket", "/run/php/php8.3-fpm.sock"),
      yes("gzip", "gzip compression", true),
      yes("cache", "Cache static files for 30 days", true),
      num("upload", "Max upload size (MB)", 64),
    ],
    build: nginxBuild,
  },
  "apache-virtualhost-generator": {
    outputLabel: "Apache VirtualHost",
    fields: [
      text("domain", "Domain", "example.com"),
      yes("www", "Also serve www.", true),
      text("root", "Document root", "/var/www/example.com/public"),
      text("email", "Admin email (optional)", "webmaster@example.com"),
      yes("ssl", "HTTPS with Let's Encrypt paths and an HTTP redirect", true),
      yes("override", "Allow .htaccess overrides", true),
      yes("php", "PHP-FPM handler", true),
    ],
    build: apacheBuild,
  },
  "htaccess-generator": {
    outputLabel: ".htaccess",
    fields: [
      yes("https", "Force HTTPS", true),
      pick("www", "www handling", "none", [
        ["none", "Leave as is"],
        ["add", "Redirect to www"],
        ["remove", "Redirect to non-www"],
      ]),
      yes("noindex", "Disable directory listings", true),
      text("error404", "Custom 404 page (optional)", "/404.html"),
      yes("gzip", "Compression", true),
      yes("cache", "Browser caching", true),
      yes("headers", "Security headers", true),
      yes("protect", "Block dotfiles, config files and backups", true),
    ],
    build: htaccessBuild,
  },
  "utm-builder": {
    outputLabel: "Tagged URL",
    fields: [
      text("url", "Page URL", "https://example.com/offer"),
      text("source", "Source (utm_source)", "newsletter"),
      text("medium", "Medium (utm_medium)", "email"),
      text("campaign", "Campaign (utm_campaign)", "spring_sale"),
      text("term", "Term (utm_term, optional)"),
      text("content", "Content (utm_content, optional)"),
    ],
    build: utmBuild,
  },
  "robots-txt-generator": {
    outputLabel: "robots.txt",
    fields: [
      text("agent", "User-agent", "*"),
      area("disallow", "Disallow paths, one per line", "/admin/\n/cart/"),
      area("allow", "Allow paths, one per line", "/admin/public/"),
      num("delay", "Crawl-delay in seconds (0 for none)", 0),
      text("sitemap", "Sitemap URL", "https://example.com/sitemap.xml"),
    ],
    build: robotsBuild,
  },
  "sitemap-generator": {
    outputLabel: "sitemap.xml",
    fields: [
      area("urls", "URLs, one per line", "https://example.com/\nhttps://example.com/about"),
      pick("changefreq", "Change frequency", "weekly", [
        ["none", "Omit"],
        ["daily", "daily"],
        ["weekly", "weekly"],
        ["monthly", "monthly"],
        ["yearly", "yearly"],
      ]),
      num("priority", "Priority (0 to 1)", 0.5),
      { id: "lastmod", label: "Last modified (optional)", type: "date", value: "" },
    ],
    build: sitemapBuild,
  },
  "schema-generator": {
    outputLabel: "JSON-LD",
    note: "Only the fields that apply to the chosen type are used.",
    fields: [
      pick("type", "Schema type", "FAQPage", [
        ["FAQPage", "FAQ page"],
        ["Article", "Article"],
        ["Product", "Product"],
        ["Organization", "Organization"],
        ["LocalBusiness", "Local business"],
      ]),
      text("name", "Name or headline", "Example Co"),
      text("url", "Page URL", "https://example.com/"),
      text("image", "Image URL (optional)"),
      area("description", "Description (optional)"),
      area(
        "faq",
        "FAQ: one 'Question :: Answer' per line",
        "What is a license? :: A permission to use the software."
      ),
      text("author", "Article author"),
      text("published", "Article date published (YYYY-MM-DD)"),
      text("brand", "Product brand"),
      text("price", "Product price"),
      text("currency", "Product currency", "USD"),
      text("logo", "Organization logo URL"),
      area("sameAs", "Organization profile URLs, one per line"),
      text("phone", "Phone"),
      text("address", "Street address (local business)"),
    ],
    build: schemaBuild,
  },
  "open-graph-generator": {
    outputLabel: "Meta tags",
    fields: [
      text("title", "Title", "Cheap cPanel License"),
      area("description", "Description", "Instant activation and 24/7 support."),
      text("url", "Page URL", "https://example.com/page"),
      text("image", "Image URL (1200x630 works best)"),
      text("site", "Site name", "Example"),
      pick("type", "Type", "website", [
        ["website", "website"],
        ["article", "article"],
        ["product", "product"],
      ]),
      pick("card", "Twitter card", "summary_large_image", [
        ["summary_large_image", "Large image"],
        ["summary", "Summary"],
      ]),
    ],
    build: ogBuild,
  },
  "serp-preview": {
    outputLabel: "Length report",
    note: "A simulated Google result. Real snippets can differ because Google may rewrite them.",
    fields: [
      text("title", "Page title", "Cheap cPanel License | Example"),
      text("url", "Page URL", "https://example.com/cpanel-license"),
      area(
        "description",
        "Meta description",
        "Buy a cPanel license with instant activation and 24/7 support."
      ),
    ],
    serp: (v) => ({
      title: truncateToPx(s(v, "title"), TITLE_FONT, 600),
      url: s(v, "url"),
      description: truncateToPx(s(v, "description"), DESC_FONT, 920),
    }),
    build: (v) =>
      [
        lengthReport("title", s(v, "title"), TITLE_FONT, 600, 30, 60),
        lengthReport("description", s(v, "description"), DESC_FONT, 920, 70, 160),
      ]
        .map((r, i) => `${i ? "Description" : "Title"}\n${typeof r === "string" ? r : r.error}`)
        .join("\n\n"),
  },
  "meta-title-checker": {
    outputLabel: "Result",
    fields: [text("title", "Meta title", "Cheap cPanel License | Example")],
    build: (v) => lengthReport("title", s(v, "title"), TITLE_FONT, 600, 30, 60),
  },
  "meta-description-checker": {
    outputLabel: "Result",
    fields: [
      area(
        "description",
        "Meta description",
        "Buy a cPanel license with instant activation and 24/7 support."
      ),
    ],
    build: (v) => lengthReport("description", s(v, "description"), DESC_FONT, 920, 70, 160),
  },
  "domain-expiry-calculator": {
    outputLabel: "Result",
    fields: [{ id: "expiry", label: "Expiry date", type: "date", value: "" }],
    build: expiryBuild,
  },
  "domain-name-generator": {
    outputLabel: "Candidate names",
    note: "Names are generated locally. Use the Domain Availability Checker to see which are taken.",
    fields: [
      text("keyword", "Keyword", "hosting"),
      area("prefixes", "Prefixes, comma separated", "get, try, my, the, go"),
      area("suffixes", "Suffixes, comma separated", "hq, hub, app, online, pro, cloud"),
      text("tlds", "Extensions", ".com .net .io"),
      yes("hyphen", "Join with hyphens"),
      num("max", "Longest name part (characters)", 20),
    ],
    build: domainNameBuild,
  },
  "domain-length-checker": {
    outputLabel: "Result",
    fields: [text("domain", "Domain name", "my-brand-hosting.com")],
    build: lengthBuild,
  },
  "domain-combinations-generator": {
    outputLabel: "Combinations",
    note: "Every word in the first list is joined with every word in the second, and the third when given.",
    fields: [
      area("a", "First words, one per line", "cloud\nfast\nsecure"),
      area("b", "Second words, one per line", "host\nserver\nvps"),
      area("c", "Third words, optional, one per line", ""),
      text("joiner", "Joiner (blank for none, or a hyphen)", ""),
      text("tlds", "Extensions", ".com .net"),
    ],
    build: combinationsBuild,
  },
  "domain-extension-explorer": {
    outputLabel: "Matching extensions",
    note: "A reference of common extensions and what they are used for. Prices change constantly, so none are listed.",
    fields: [
      text("query", "Search (extension or use)", "", "tech"),
      pick("kind", "Type", "all", [
        ["all", "All"],
        ["classic", "Classic generic"],
        ["new", "New generic"],
        ["country", "Country code"],
      ]),
    ],
    build: extensionBuild,
  },
  "domain-transfer-checklist": {
    outputLabel: "Checklist",
    fields: [
      text("domain", "Domain", "example.com"),
      yes("dnssec", "DNSSEC is enabled"),
      yes("dns", "DNS is hosted at the current registrar", true),
      yes("email", "Email runs on this domain", true),
    ],
    build: transferBuild,
  },
  "password-entropy-calculator": {
    outputLabel: "Analysis",
    note: "Everything is computed in this page. Nothing is sent or stored.",
    fields: [{ id: "password", label: "Password", type: "password", value: "" }],
    help: [
      "Length matters more than symbols: each extra random character multiplies the work for an attacker.",
      "Four or more random words in a row make a strong, memorable passphrase.",
      "Never reuse a password: one leaked site exposes every site that shares it.",
      "A password manager can generate and store passwords that are well above 80 bits.",
    ],
    build: entropyBuild,
  },
  "sri-hash-generator": {
    outputLabel: "Integrity attribute and tag",
    note: "Paste the file exactly as the CDN serves it: a single changed byte changes the hash.",
    fields: [
      pick("algo", "Algorithm", "SHA-384", [
        ["SHA-256", "SHA-256"],
        ["SHA-384", "SHA-384 (recommended)"],
        ["SHA-512", "SHA-512"],
      ]),
      pick("kind", "File type", "js", [
        ["js", "JavaScript"],
        ["css", "CSS"],
      ]),
      text("src", "File URL (for the tag)", "https://cdn.example.com/lib.min.js"),
      area("content", "File contents"),
    ],
    build: sriBuild,
  },
}
