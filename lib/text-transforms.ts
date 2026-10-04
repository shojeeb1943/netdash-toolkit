// paste-in, paste-out developer converters. pure functions: a failure is returned as { error }, never thrown.
import { parse as parseYaml, stringify as stringifyYaml } from "yaml"
import { format as formatSql } from "sql-formatter"
import { parseCsv } from "@/lib/csv"

export type TResult = { ok: string } | { error: string }

export interface TOption {
  id: string
  label: string
  type: "select" | "checkbox"
  value: string | boolean
  choices?: { value: string; label: string }[]
}

export interface TDef {
  inputLabel: string
  outputLabel: string
  sample: string
  /** short notes under the result */
  help?: string[]
  options?: TOption[]
  run: (input: string, opts: Record<string, string | boolean>) => TResult
}

const ok = (value: string): TResult => ({ ok: value })
const fail = (e: unknown): TResult => ({ error: e instanceof Error ? e.message : String(e) })
const empty = (): TResult => ({ error: "Paste something to convert." })

export function yamlFormat(input: string, indent: number): TResult {
  if (!input.trim()) return empty()
  try {
    return ok(stringifyYaml(parseYaml(input), { indent, lineWidth: 0 }).trimEnd())
  } catch (e) {
    return fail(e)
  }
}

export function jsonToYaml(input: string, indent: number): TResult {
  if (!input.trim()) return empty()
  try {
    return ok(stringifyYaml(JSON.parse(input), { indent, lineWidth: 0 }).trimEnd())
  } catch (e) {
    return fail(e)
  }
}

export function yamlToJson(input: string, indent: number): TResult {
  if (!input.trim()) return empty()
  try {
    return ok(JSON.stringify(parseYaml(input), null, indent))
  } catch (e) {
    return fail(e)
  }
}

export function xmlFormat(input: string, indent: number): TResult {
  if (!input.trim()) return empty()
  const doc = new DOMParser().parseFromString(input, "application/xml")
  const problem = doc.querySelector("parsererror")
  if (problem) return { error: (problem.textContent ?? "Invalid XML").trim().split("\n")[0] }
  const pad = " ".repeat(indent)
  const out: string[] = []
  const decl = input.match(/^\s*<\?xml[^>]*\?>/)
  if (decl) out.push(decl[0].trim())
  const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  const escAttr = (t: string) => esc(t).replace(/"/g, "&quot;")
  const walk = (node: Node, depth: number) => {
    const space = pad.repeat(depth)
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element
      const attrs = Array.from(el.attributes)
        .map((a) => ` ${a.name}="${escAttr(a.value)}"`)
        .join("")
      const kids = Array.from(el.childNodes).filter(
        (c) => !(c.nodeType === Node.TEXT_NODE && !c.textContent?.trim())
      )
      if (!kids.length) out.push(`${space}<${el.tagName}${attrs}/>`)
      else if (kids.length === 1 && kids[0].nodeType === Node.TEXT_NODE)
        out.push(
          `${space}<${el.tagName}${attrs}>${esc(kids[0].textContent!.trim())}</${el.tagName}>`
        )
      else {
        out.push(`${space}<${el.tagName}${attrs}>`)
        kids.forEach((k) => walk(k, depth + 1))
        out.push(`${space}</${el.tagName}>`)
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      out.push(space + esc(node.textContent!.trim()))
    } else if (node.nodeType === Node.COMMENT_NODE) {
      out.push(`${space}<!--${node.textContent}-->`)
    } else if (node.nodeType === Node.CDATA_SECTION_NODE) {
      out.push(`${space}<![CDATA[${node.textContent}]]>`)
    }
  }
  Array.from(doc.childNodes).forEach((c) => walk(c, 0))
  return ok(out.join("\n"))
}

export function sqlFormat(input: string, dialect: string, upper: boolean): TResult {
  if (!input.trim()) return empty()
  try {
    return ok(
      formatSql(input, {
        language: dialect as "sql" | "mysql" | "postgresql" | "mariadb" | "sqlite" | "transactsql",
        keywordCase: upper ? "upper" : "preserve",
        tabWidth: 2,
      })
    )
  } catch (e) {
    return fail(e)
  }
}

// ---- JSON to TypeScript ----

const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/
const pascal = (name: string) =>
  name
    .replace(/[^A-Za-z0-9]+(.)?/g, (_m, c: string | undefined) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (c) => c.toUpperCase()) || "Item"

export function jsonToTypeScript(input: string, rootName: string, asType: boolean): TResult {
  if (!input.trim()) return empty()
  let data: unknown
  try {
    data = JSON.parse(input)
  } catch (e) {
    return fail(e)
  }
  const decls: string[] = []
  const used = new Set<string>()
  const uniqueName = (base: string) => {
    let name = pascal(base)
    for (let i = 2; used.has(name); i++) name = `${pascal(base)}${i}`
    used.add(name)
    return name
  }

  const typeOf = (value: unknown, hint: string): string => {
    if (value === null) return "null"
    if (Array.isArray(value)) {
      if (!value.length) return "unknown[]"
      const kinds = Array.from(new Set(value.map((v) => typeOf(v, hint.replace(/s$/, "")))))
      const inner = kinds.length === 1 ? kinds[0] : `(${kinds.join(" | ")})`
      // arrays of objects share one interface with optional keys
      if (value.every((v) => v && typeof v === "object" && !Array.isArray(v))) {
        return `${objectDecl(value as Record<string, unknown>[], hint.replace(/s$/, ""))}[]`
      }
      return `${inner}[]`
    }
    if (typeof value === "object") return objectDecl([value as Record<string, unknown>], hint)
    return typeof value
  }

  const objectDecl = (objects: Record<string, unknown>[], hint: string): string => {
    const name = uniqueName(hint)
    const keys = Array.from(new Set(objects.flatMap((o) => Object.keys(o))))
    const fields = keys.map((key) => {
      const present = objects.filter((o) => key in o)
      const optional = present.length < objects.length ? "?" : ""
      const types = Array.from(new Set(present.map((o) => typeOf(o[key], key))))
      const prop = IDENT.test(key) ? key : JSON.stringify(key)
      return `  ${prop}${optional}: ${types.join(" | ")}${asType ? ";" : ""}`
    })
    decls.push(
      asType
        ? `type ${name} = {\n${fields.join("\n")}\n}`
        : `interface ${name} {\n${fields.join("\n").replace(/;$/gm, "")}\n}`
    )
    return name
  }

  const root = typeOf(data, rootName || "Root")
  const primitiveRoot = !decls.length || !decls.some((d) => d.includes(` ${root} `))
  if (primitiveRoot && !/^[A-Z]/.test(root))
    decls.push(`type ${pascal(rootName || "Root")} = ${root}`)
  else if (root.endsWith("[]")) decls.push(`type ${pascal(rootName || "Root")} = ${root}`)
  return ok(decls.join("\n\n"))
}

// ---- CSV ----

export { parseCsv } from "@/lib/csv"

const asValue = (cell: string): unknown => {
  if (cell === "") return ""
  if (/^-?\d+(\.\d+)?$/.test(cell) && Number.isFinite(Number(cell)) && !/^-?0\d/.test(cell))
    return Number(cell)
  if (cell === "true") return true
  if (cell === "false") return false
  return cell
}

export function csvToJson(
  input: string,
  delimiter: string,
  header: boolean,
  typed: boolean
): TResult {
  if (!input.trim()) return empty()
  try {
    const rows = parseCsv(input, delimiter === "tab" ? "\t" : delimiter)
    if (!rows.length) return empty()
    const conv = (cell: string) => (typed ? asValue(cell) : cell)
    if (!header)
      return ok(
        JSON.stringify(
          rows.map((r) => r.map(conv)),
          null,
          2
        )
      )
    const [names, ...data] = rows
    const seen = new Set<string>()
    for (const name of names) {
      if (seen.has(name)) return { error: `Duplicate column name "${name}" would overwrite data.` }
      seen.add(name)
    }
    return ok(
      JSON.stringify(
        data.map((r) => Object.fromEntries(names.map((name, i) => [name, conv(r[i] ?? "")]))),
        null,
        2
      )
    )
  } catch (e) {
    return fail(e)
  }
}

// a formula cell (=, +, -, @) opens in a spreadsheet as code: prefix a quote, as OWASP advises
const guard = (cell: string) =>
  /^[=+\-@\t\r]/.test(cell) && !/^-?\d+(\.\d+)?$/.test(cell) ? `'${cell}` : cell

export function jsonToCsv(input: string, delimiter: string): TResult {
  if (!input.trim()) return empty()
  let data: unknown
  try {
    data = JSON.parse(input)
  } catch (e) {
    return fail(e)
  }
  const list = Array.isArray(data) ? data : [data]
  if (!list.length || !list.every((r) => r && typeof r === "object" && !Array.isArray(r)))
    return { error: 'Expected a JSON array of objects, for example [{"a":1},{"a":2}].' }
  const sep = delimiter === "tab" ? "\t" : delimiter
  const flat = (obj: Record<string, unknown>, prefix = ""): Record<string, unknown> =>
    Object.entries(obj).reduce<Record<string, unknown>>((acc, [k, v]) => {
      const key = prefix ? `${prefix}.${k}` : k
      if (v && typeof v === "object" && !Array.isArray(v))
        Object.assign(acc, flat(v as Record<string, unknown>, key))
      else acc[key] = v
      return acc
    }, {})
  const rows = (list as Record<string, unknown>[]).map((r) => flat(r))
  const cols = Array.from(new Set(rows.flatMap((r) => Object.keys(r))))
  const cell = (v: unknown) => {
    const t =
      v === null || v === undefined ? "" : typeof v === "object" ? JSON.stringify(v) : String(v)
    const g = guard(t)
    return g.includes(sep) || /["\n\r]/.test(g) ? `"${g.replace(/"/g, '""')}"` : g
  }
  return ok(
    [cols.map(cell).join(sep), ...rows.map((r) => cols.map((c) => cell(r[c])).join(sep))].join("\n")
  )
}

// ---- batch 7: HTML and CSS and SQL ----

const VOID = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
])
const RAW = new Set(["script", "style", "pre", "textarea"])
const BLOCK = new Set(
  "address article aside blockquote body dd details dialog div dl dt fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html li main nav ol p section table tbody td tfoot th thead title tr ul meta link script style base noscript template option select".split(
    " "
  )
)

type HtmlTok = {
  kind: "text" | "open" | "close" | "self" | "comment" | "doctype" | "raw"
  text: string
  name?: string
}

function tokenizeHtml(src: string): HtmlTok[] {
  const toks: HtmlTok[] = []
  let i = 0
  while (i < src.length) {
    if (src[i] !== "<") {
      const j = src.indexOf("<", i)
      const end = j === -1 ? src.length : j
      toks.push({ kind: "text", text: src.slice(i, end) })
      i = end
      continue
    }
    if (src.startsWith("<!--", i)) {
      const j = src.indexOf("-->", i + 4)
      const end = j === -1 ? src.length : j + 3
      toks.push({ kind: "comment", text: src.slice(i, end) })
      i = end
      continue
    }
    const m = /^<(\/?)([A-Za-z][A-Za-z0-9:-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/.exec(src.slice(i))
    if (!m) {
      const dt = /^<![^>]*>/.exec(src.slice(i))
      if (dt) {
        toks.push({ kind: "doctype", text: dt[0] })
        i += dt[0].length
      } else {
        toks.push({ kind: "text", text: "<" })
        i += 1
      }
      continue
    }
    const name = m[2].toLowerCase()
    const full = m[0]
    i += full.length
    if (m[1]) toks.push({ kind: "close", text: full, name })
    else if (full.endsWith("/>") || VOID.has(name)) toks.push({ kind: "self", text: full, name })
    else if (RAW.has(name)) {
      const closeRe = new RegExp(`</${name}\\s*>`, "i")
      const rest = src.slice(i)
      const c = closeRe.exec(rest)
      const bodyEnd = c ? c.index : rest.length
      toks.push({ kind: "raw", text: full + rest.slice(0, bodyEnd) + (c ? c[0] : ""), name })
      i += bodyEnd + (c ? c[0].length : 0)
    } else toks.push({ kind: "open", text: full, name })
  }
  return toks
}

const tidyTag = (t: string) =>
  t
    .replace(/\s+/g, " ")
    .replace(/\s+>/, ">")
    .replace(/\s+\/>/, " />")

export function htmlFormat(input: string, indent: number): TResult {
  if (!input.trim()) return empty()
  const pad = " ".repeat(indent)
  const toks = tokenizeHtml(input)
  const out: string[] = []
  let depth = 0
  for (let k = 0; k < toks.length; k++) {
    const t = toks[k]
    const line = (s2: string) => out.push(pad.repeat(Math.max(0, depth)) + s2)
    if (t.kind === "text") {
      const txt = t.text.replace(/\s+/g, " ").trim()
      if (txt) line(txt)
    } else if (t.kind === "close") {
      depth--
      line(tidyTag(t.text))
    } else if (t.kind === "open") {
      const a = toks[k + 1]
      const c = toks[k + 2]
      if (
        a &&
        c &&
        a.kind === "text" &&
        c.kind === "close" &&
        c.name === t.name &&
        a.text.replace(/\s+/g, " ").trim().length <= 80 &&
        !a.text.includes("\n\n")
      ) {
        line(tidyTag(t.text) + a.text.replace(/\s+/g, " ").trim() + tidyTag(c.text))
        k += 2
      } else if (a && a.kind === "close" && a.name === t.name) {
        line(tidyTag(t.text) + tidyTag(a.text))
        k += 1
      } else {
        line(tidyTag(t.text))
        depth++
      }
    } else if (t.kind === "raw") {
      // keep the inside byte for byte: only the opening line is indented
      out.push(pad.repeat(Math.max(0, depth)) + t.text)
    } else line(t.kind === "self" ? tidyTag(t.text) : t.text.trim())
  }
  return ok(out.join("\n"))
}

export function htmlMinify(input: string): TResult {
  if (!input.trim()) return empty()
  const toks = tokenizeHtml(input)
  const parts: string[] = []
  for (let k = 0; k < toks.length; k++) {
    const t = toks[k]
    if (t.kind === "comment") {
      if (/^<!--\[if|^<!--!/.test(t.text)) parts.push(t.text)
      continue
    }
    if (t.kind === "text") {
      const collapsed = t.text.replace(/\s+/g, " ")
      if (collapsed.trim() === "") {
        const prev = [...toks.slice(0, k)].reverse().find((x) => x.kind !== "comment")
        const next = toks.slice(k + 1).find((x) => x.kind !== "comment")
        const edge = (x?: HtmlTok) =>
          !x || x.kind === "doctype" || (x.name !== undefined && BLOCK.has(x.name))
        if (!edge(prev) && !edge(next)) parts.push(" ")
      } else parts.push(collapsed)
      continue
    }
    parts.push(t.kind === "doctype" ? t.text.trim() : t.kind === "raw" ? t.text : tidyTag(t.text))
  }
  return ok(parts.join("").trim())
}

export function cssMinify(input: string): TResult {
  if (!input.trim()) return empty()
  let out = ""
  let i = 0
  const n2 = input.length
  const lastChar = () => out[out.length - 1]
  while (i < n2) {
    const c = input[i]
    if (c === "/" && input[i + 1] === "*") {
      const end = input.indexOf("*/", i + 2)
      const stop = end === -1 ? n2 : end + 2
      if (input[i + 2] === "!") out += input.slice(i, stop)
      i = stop
    } else if (c === '"' || c === "'") {
      let j = i + 1
      while (j < n2 && input[j] !== c) j += input[j] === "\\" ? 2 : 1
      out += input.slice(i, j + 1)
      i = j + 1
    } else if (c === "u" && /^url\(\s*[^'")\s]/i.test(input.slice(i, i + 12))) {
      const j = input.indexOf(")", i)
      const stop = j === -1 ? n2 : j + 1
      out += input.slice(i, stop).replace(/\s+/g, "")
      i = stop
    } else if (/\s/.test(c)) {
      let j = i
      while (j < n2 && /\s/.test(input[j])) j++
      const nextC = input[j]
      const prev = lastChar()
      if (!prev || !nextC || "{};,>~".includes(nextC) || "{;,>~:".includes(prev)) {
        /* drop */
      } else out += " "
      i = j
    } else if (
      c === ";" &&
      input
        .slice(i + 1)
        .trimStart()
        .startsWith("}")
    ) {
      i++
    } else {
      out += c
      i++
    }
  }
  return ok(out.trim())
}

export function sqlMinify(input: string): TResult {
  if (!input.trim()) return empty()
  let out = ""
  let i = 0
  const n2 = input.length
  while (i < n2) {
    const c = input[i]
    if (c === "-" && input[i + 1] === "-") {
      while (i < n2 && input[i] !== "\n") i++
    } else if (c === "/" && input[i + 1] === "*") {
      const end = input.indexOf("*/", i + 2)
      i = end === -1 ? n2 : end + 2
    } else if (c === "'" || c === '"' || c === "`") {
      let j = i + 1
      while (j < n2) {
        if (input[j] === c) {
          if (input[j + 1] === c) j += 2
          else break
        } else j += input[j] === "\\" && c === "'" ? 2 : 1
      }
      out += input.slice(i, j + 1)
      i = j + 1
    } else if (/\s/.test(c)) {
      while (i < n2 && /\s/.test(input[i])) i++
      if (out && !" ,(".includes(out[out.length - 1]) && i < n2 && !",);".includes(input[i]))
        out += " "
    } else {
      out += c
      i++
    }
  }
  return ok(out.trim())
}

export function tsvToCsv(input: string, outDelim: string, protect: boolean): TResult {
  if (!input.trim()) return empty()
  try {
    const rows = parseCsv(input, "\t")
    const sep = outDelim === "tab" ? "\t" : outDelim
    const cell = (c: string) => {
      const g = protect ? guard(c) : c
      return g.includes(sep) || /["\n\r]/.test(g) ? `"${g.replace(/"/g, '""')}"` : g
    }
    return ok(rows.map((r) => r.map(cell).join(sep)).join("\n"))
  } catch (e) {
    return fail(e)
  }
}

// ---- definitions ----

const indentOption: TOption = {
  id: "indent",
  label: "Indent",
  type: "select",
  value: "2",
  choices: [
    { value: "2", label: "2 spaces" },
    { value: "4", label: "4 spaces" },
  ],
}
const delimiterOption: TOption = {
  id: "delimiter",
  label: "Delimiter",
  type: "select",
  value: ",",
  choices: [
    { value: ",", label: "Comma" },
    { value: ";", label: "Semicolon" },
    { value: "tab", label: "Tab" },
    { value: "|", label: "Pipe" },
  ],
}
const ind = (o: Record<string, string | boolean>) => Number(o.indent) || 2

export const transformDefs: Record<string, TDef> = {
  "html-formatter": {
    inputLabel: "HTML",
    outputLabel: "Formatted HTML",
    sample:
      "<div><h1>Title</h1><p>Some <b>bold</b> text</p><ul><li>One</li><li>Two</li></ul><script>var a=1;</script></div>",
    options: [indentOption],
    run: (i, o) => htmlFormat(i, ind(o)),
  },
  "html-minifier": {
    inputLabel: "HTML",
    outputLabel: "Minified HTML",
    sample:
      '<!-- header -->\n<div class="box">\n  <p>Hello,   world</p>\n  <pre>keep   this</pre>\n</div>\n',
    help: [
      "Comments are removed, except conditional comments for old Internet Explorer.",
      "Text inside pre, textarea, script and style is left exactly as written.",
      "Spaces between inline tags such as b and i are kept so words do not join.",
      "Always test the minified page before deploying it.",
    ],
    run: (i) => htmlMinify(i),
  },
  "css-minifier": {
    inputLabel: "CSS",
    outputLabel: "Minified CSS",
    sample:
      "/* button */\n.btn {\n  color: #fff;\n  margin: 0 auto;\n  background: url( 'a b.png' );\n}\n.btn:hover { color: red; }\n",
    help: [
      "Comments are removed, except those starting with /*! which usually carry a licence.",
      "Strings and url() values are copied exactly as written.",
      "Spaces that change meaning, such as before a pseudo-class in a selector, are kept.",
      "Pair minification with gzip or brotli on the server for the smallest download.",
    ],
    run: (i) => cssMinify(i),
  },
  "sql-minifier": {
    inputLabel: "SQL",
    outputLabel: "Minified SQL",
    sample:
      "-- active users\nSELECT id,\n       name\n  FROM users /* main table */\n WHERE note = 'a  b  c';\n",
    help: [
      "Line comments (--) and block comments (/* */) are removed.",
      "Text in quotes, double quotes and backticks is copied exactly as written.",
      "Runs of spaces, tabs and line breaks become a single space.",
      "Keep any optimizer hint comments out of the input if your database reads them.",
    ],
    run: (i) => sqlMinify(i),
  },
  "tsv-to-csv": {
    inputLabel: "TSV (tab separated)",
    outputLabel: "CSV",
    sample: 'name\tplan\tnote\nAda\tvps\tsays "hi", twice\nLin\tdedicated\t=SUM(A1)\n',
    options: [
      { ...delimiterOption, id: "out", label: "Output delimiter" },
      {
        id: "protect",
        label: "Protect against spreadsheet formulas",
        type: "checkbox",
        value: true,
      },
    ],
    help: [
      "Cells that contain the delimiter, quotes or line breaks are quoted for you.",
      "The formula guard adds an apostrophe to cells starting with =, +, - or @.",
      "Copy cells from a spreadsheet and paste them in: they arrive tab separated.",
      "Turn the guard off if you need the data byte for byte.",
    ],
    run: (i, o) => tsvToCsv(i, String(o.out), o.protect === true),
  },
  "yaml-formatter": {
    inputLabel: "YAML",
    outputLabel: "Formatted YAML",
    sample: "server:\n    host:   example.com\n    ports: [80,   443]\n",
    options: [indentOption],
    run: (i, o) => yamlFormat(i, ind(o)),
  },
  "xml-formatter": {
    inputLabel: "XML",
    outputLabel: "Formatted XML",
    sample: '<?xml version="1.0"?><urlset><url><loc>https://example.com/</loc></url></urlset>',
    options: [indentOption],
    run: (i, o) => xmlFormat(i, ind(o)),
  },
  "sql-formatter": {
    inputLabel: "SQL",
    outputLabel: "Formatted SQL",
    sample: "select id,name from users where active=1 and created_at>'2026-01-01' order by name",
    options: [
      {
        id: "dialect",
        label: "Dialect",
        type: "select",
        value: "sql",
        choices: [
          { value: "sql", label: "Standard SQL" },
          { value: "mysql", label: "MySQL" },
          { value: "mariadb", label: "MariaDB" },
          { value: "postgresql", label: "PostgreSQL" },
          { value: "sqlite", label: "SQLite" },
          { value: "transactsql", label: "SQL Server" },
        ],
      },
      { id: "upper", label: "Uppercase keywords", type: "checkbox", value: true },
    ],
    run: (i, o) => sqlFormat(i, String(o.dialect), o.upper === true),
  },
  "json-to-yaml": {
    inputLabel: "JSON",
    outputLabel: "YAML",
    sample: '{"server":{"host":"example.com","ports":[80,443]}}',
    options: [indentOption],
    run: (i, o) => jsonToYaml(i, ind(o)),
  },
  "yaml-to-json": {
    inputLabel: "YAML",
    outputLabel: "JSON",
    sample: "server:\n  host: example.com\n  ports: [80, 443]\n",
    options: [indentOption],
    run: (i, o) => yamlToJson(i, ind(o)),
  },
  "json-to-typescript": {
    inputLabel: "JSON",
    outputLabel: "TypeScript",
    sample: '{"id":1,"name":"Ada","tags":["a","b"],"profile":{"active":true}}',
    options: [
      {
        id: "alias",
        label: "Use type aliases instead of interfaces",
        type: "checkbox",
        value: false,
      },
    ],
    run: (i, o) => jsonToTypeScript(i, "Root", o.alias === true),
  },
  "csv-to-json": {
    inputLabel: "CSV",
    outputLabel: "JSON",
    sample: "name,plan,price\nAda,vps,9.5\nLin,dedicated,80\n",
    options: [
      delimiterOption,
      { id: "header", label: "First row is the header", type: "checkbox", value: true },
      { id: "typed", label: "Convert numbers and booleans", type: "checkbox", value: true },
    ],
    run: (i, o) => csvToJson(i, String(o.delimiter), o.header === true, o.typed === true),
  },
  "json-to-csv": {
    inputLabel: "JSON (array of objects)",
    outputLabel: "CSV",
    sample:
      '[{"name":"Ada","plan":"vps","price":9.5},{"name":"Lin","plan":"dedicated","price":80}]',
    options: [delimiterOption],
    run: (i, o) => jsonToCsv(i, String(o.delimiter)),
  },
}
