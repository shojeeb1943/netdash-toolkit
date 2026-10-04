import { describe, expect, it } from "vitest"
import { generatorDefs, normalizePath } from "@/lib/generators"
import type { GValues } from "@/lib/generators"

const defaults = (slug: string): GValues =>
  Object.fromEntries(generatorDefs[slug].fields.map((f) => [f.id, f.value]))
const run = async (slug: string, over: GValues = {}) =>
  generatorDefs[slug].build({ ...defaults(slug), ...over })
const text = async (slug: string, over: GValues = {}) => {
  const r = await run(slug, over)
  if (typeof r !== "string") throw new Error(r.error)
  return r
}

describe("batch 6: linux commands", () => {
  it("tar creates, extracts and lists with the right flags", async () => {
    expect(await text("tar-command-generator")).toBe(
      "tar -czpf backup.tar.gz --exclude='*.log' --exclude=node_modules -C /var/www public_html config"
    )
    expect(await text("tar-command-generator", { format: "xz", verbose: true })).toContain("-cJvpf")
    expect(await text("tar-command-generator", { format: "zst" })).toContain("--zstd")
    expect(await text("tar-command-generator", { action: "extract", strip: 1 })).toBe(
      "tar -xzpf backup.tar.gz -C /var/www/restore --strip-components=1"
    )
    expect(await text("tar-command-generator", { action: "list", format: "none" })).toBe(
      "tar -tf backup.tar.gz"
    )
    expect(await run("tar-command-generator", { paths: "" })).toHaveProperty("error")
  })

  it("find builds filters and warns before delete", async () => {
    expect(await text("find-command-generator")).toBe(
      "find /var/log -type f -name '*.log' -mtime +30 -print"
    )
    const del = await text("find-command-generator", { action: "delete" })
    expect(del).toContain("-delete")
    expect(del).toContain("-print first")
    expect(await text("find-command-generator", { depth: true, maxdepth: 1 })).toContain(
      "find /var/log -maxdepth 1"
    )
    expect(await run("find-command-generator", { size: "big" })).toHaveProperty("error")
    expect(await run("find-command-generator", { days: "x" })).toHaveProperty("error")
    expect(await run("find-command-generator", { user: "bad user" })).toHaveProperty("error")
  })

  it("grep escapes the pattern and picks flags", async () => {
    expect(await text("grep-command-generator")).toBe(
      "grep -r -i -n --include='*.log' -- error /var/log/"
    )
    expect(await text("grep-command-generator", { pattern: "a b; rm -rf /" })).toContain(
      "-- 'a b; rm -rf /'"
    )
    expect(await text("grep-command-generator", { mode: "fixed", context: 2 })).toContain("-F")
    expect(await run("grep-command-generator", { pattern: "" })).toHaveProperty("error")
  })

  it("sed escapes literals, picks a free delimiter and edits in place safely", async () => {
    expect(await text("sed-command-generator")).toBe(
      "sed 's/old\\.example\\.com/new.example.com/g' config.txt"
    )
    expect(
      await text("sed-command-generator", { find: "/var/www", replace: "/srv/www" })
    ).toContain("s|")
    expect(await text("sed-command-generator", { inplace: true })).toContain("sed -i.bak ")
    expect(await text("sed-command-generator", { replace: "a&b" })).toContain("a\\&b")
    expect(await text("sed-command-generator", { mode: "delete" })).toBe("sed 5,10d config.txt")
    expect(await text("sed-command-generator", { mode: "print", range: "3" })).toBe(
      "sed -n 3p config.txt"
    )
    expect(await run("sed-command-generator", { mode: "delete", range: "x" })).toHaveProperty(
      "error"
    )
    expect(await run("sed-command-generator", { find: "/|#@~", replace: "/|#@~" })).toHaveProperty(
      "error"
    )
  })

  it("awk builds each task and rejects bad columns", async () => {
    expect(await text("awk-command-generator")).toBe("awk '$9 == 404 { print $1, $7 }' access.log")
    expect(await text("awk-command-generator", { mode: "sum", value: "" })).toBe(
      "awk '{ sum += $7 } END { print sum }' access.log"
    )
    expect(await text("awk-command-generator", { mode: "count", op: "~", value: "GET" })).toContain(
      '$9 ~ "GET"'
    )
    expect(await text("awk-command-generator", { sep: "," })).toContain("-F ,")
    expect(await run("awk-command-generator", { columns: "a" })).toHaveProperty("error")
    expect(await run("awk-command-generator", { value: "it's" })).toHaveProperty("error")
  })

  it("curl validates and quotes", async () => {
    const out = await text("curl-command-generator", {
      method: "POST",
      body: '{"a": 1}',
      json: true,
      user: "me:secret",
    })
    expect(out).toContain("-X POST")
    expect(out).toContain("-H 'Content-Type: application/json'")
    expect(out).toContain(`--data-raw '{"a": 1}'`)
    expect(out).toContain("-u me:secret")
    expect(
      await run("curl-command-generator", { method: "POST", body: "{bad", json: true })
    ).toHaveProperty("error")
    expect(await run("curl-command-generator", { url: "ftp://x" })).toHaveProperty("error")
    expect(await run("curl-command-generator", { headers: "not a header" })).toHaveProperty("error")
    expect(await text("curl-command-generator", { insecure: true })).toContain("# -k turns off")
  })

  it("wget", async () => {
    expect(await text("wget-command-generator")).toBe(
      "wget -c --tries=3 https://example.com/file.zip"
    )
    expect(await text("wget-command-generator", { mirror: true })).toContain("-m -k -p -np")
    expect(await run("wget-command-generator", { rate: "fast" })).toHaveProperty("error")
  })

  it("systemd service and timer validate names, paths and schedules", async () => {
    const svc = await text("systemd-service-generator")
    expect(svc).toContain("ExecStart=/usr/bin/node /srv/myapp/server.js")
    expect(svc).toContain("NoNewPrivileges=true")
    expect(svc).toContain("Environment=NODE_ENV=production")
    expect(await run("systemd-service-generator", { exec: "node server.js" })).toHaveProperty(
      "error"
    )
    expect(await run("systemd-service-generator", { name: "Bad Name" })).toHaveProperty("error")
    expect(await run("systemd-service-generator", { env: "no equals" })).toHaveProperty("error")
    const timer = await text("systemd-timer-generator")
    expect(timer).toContain("OnCalendar=*-*-* 02:00:00")
    expect(timer).toContain("Persistent=true")
    expect(timer).toContain("RandomizedDelaySec=300")
    expect(await text("systemd-timer-generator", { kind: "interval", when: "15min" })).toContain(
      "OnUnitActiveSec=15min"
    )
    expect(
      await run("systemd-timer-generator", { kind: "interval", when: "often" })
    ).toHaveProperty("error")
    expect(await run("systemd-timer-generator", { when: "bad;rule" })).toHaveProperty("error")
  })

  it("php-fpm enforces the spare server ordering", async () => {
    const out = await text("php-fpm-config-generator")
    expect(out).toContain("pm.max_children = 20")
    expect(out).toContain("listen = /run/php/php-fpm-example.sock")
    expect(out).toContain("disable_functions")
    expect(await run("php-fpm-config-generator", { minSpare: 9 })).toHaveProperty("error")
    expect(await run("php-fpm-config-generator", { memory: "lots" })).toHaveProperty("error")
    expect(await run("php-fpm-config-generator", { basedir: "relative/path" })).toHaveProperty(
      "error"
    )
    expect(await text("php-fpm-config-generator", { pm: "static", minSpare: 99 })).not.toContain(
      "pm.start_servers"
    )
  })

  it("paths: normalise and analyse", async () => {
    expect(normalizePath("/var/www/./site/../site2//public/", true)).toEqual({
      path: "/var/www/site2/public/",
      escaped: false,
    })
    expect(normalizePath("/../etc", false)).toEqual({ path: "/etc", escaped: true })
    expect(normalizePath("../../etc/passwd", false).path).toBe("../../etc/passwd")
    expect(normalizePath("a/..", false).path).toBe(".")
    expect(normalizePath("/", false).path).toBe("/")
    const out = await text("linux-path-normalizer")
    expect(out).toContain("/var/www/site2/public/")
    expect(out).toContain("above the root")
    const a = await text("linux-path-analyzer")
    expect(a).toContain("Normalized:  /var/log/nginx/error.log")
    expect(a).toContain("Log files")
    expect(a).toContain("Extension:   .log")
    expect(await text("linux-path-analyzer", { path: "~/my file*.txt" })).toContain(
      "Contains spaces"
    )
  })
})
