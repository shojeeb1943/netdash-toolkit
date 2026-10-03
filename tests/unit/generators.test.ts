// @vitest-environment happy-dom
import { describe, expect, it } from "vitest"
import {
  generatorDefs,
  modeFromOctal,
  passwordEntropy,
  shellQuote,
  symbolic,
} from "@/lib/generators"
import type { GValues } from "@/lib/generators"
import {
  csvToJson,
  jsonToCsv,
  jsonToTypeScript,
  jsonToYaml,
  parseCsv,
  sqlFormat,
  xmlFormat,
  yamlFormat,
  yamlToJson,
} from "@/lib/text-transforms"
import { ageFrom } from "@/lib/domain-rdap"
import { tools } from "@/lib/tool-registry"

const defaults = (slug: string): GValues =>
  Object.fromEntries(generatorDefs[slug].fields.map((f) => [f.id, f.value]))
const run = async (slug: string, over: GValues = {}) =>
  generatorDefs[slug].build({ ...defaults(slug), ...over })
const text = async (slug: string, over: GValues = {}) => {
  const r = await run(slug, over)
  if (typeof r !== "string") throw new Error(r.error)
  return r
}

describe("generators", () => {
  it("every generator is registered and builds from its defaults", async () => {
    for (const slug of Object.keys(generatorDefs)) {
      expect(
        tools.some((t) => t.slug === slug),
        slug
      ).toBe(true)
      const r = await run(slug)
      // blank-by-design forms (expiry date, password, SRI content) answer with an error, never a throw
      expect(typeof r === "string" || typeof r.error === "string", slug).toBe(true)
    }
  })

  it("chmod: defaults to 755, converts octal, handles special bits", async () => {
    expect(await text("chmod-calculator")).toContain("Octal:     755")
    expect(await text("chmod-calculator")).toContain("rwxr-xr-x")
    expect(await text("chmod-calculator", { octal: "2755" })).toContain("rwxr-sr-x")
    expect(await text("chmod-calculator", { octal: "1777" })).toContain("rwxrwxrwt")
    expect(await run("chmod-calculator", { octal: "888" })).toHaveProperty("error")
    expect(modeFromOctal("644")).toEqual({ digits: [6, 4, 4], special: 0 })
    expect(symbolic([6, 4, 4])).toBe("rw-r--r--")
  })

  it("umask: 022 gives 644 files and 755 directories", async () => {
    const out = await text("umask-calculator", { umask: "022" })
    expect(out).toContain("644")
    expect(out).toContain("755")
    expect(await text("umask-calculator", { umask: "077" })).toContain("600")
  })

  it("shell commands quote hostile input", async () => {
    expect(shellQuote("a b")).toBe("'a b'")
    expect(shellQuote("it's")).toBe("'it'\\''s'")
    const out = await text("chown-generator", { path: "/var/www/my site; rm -rf /" })
    expect(out).toContain("'/var/www/my site; rm -rf /'")
    expect(await run("chown-generator", { user: "bad user" })).toHaveProperty("error")
    expect(await text("scp-generator", { port: 2222, local: "a b.txt" })).toContain(
      "-P 2222 -C 'a b.txt'"
    )
    expect(await text("rsync-generator", { dry: true })).toContain("-n")
    expect(await run("scp-generator", { host: "bad host!" })).toHaveProperty("error")
  })

  it("nginx and apache validate the domain and emit the redirect", async () => {
    expect(await run("nginx-config-generator", { domain: "not a domain" })).toHaveProperty("error")
    const ng = await text("nginx-config-generator", { domain: "example.com" })
    expect(ng).toContain("server_name example.com www.example.com;")
    expect(ng).toContain("return 301 https://$host$request_uri;")
    expect(await text("apache-virtualhost-generator", { domain: "example.com" })).toContain(
      "Redirect permanent / https://example.com/"
    )
  })

  it("utm builder keeps existing params and validates", async () => {
    const out = await text("utm-builder", { url: "https://example.com/p?x=1" })
    expect(out).toContain("x=1")
    expect(out).toContain("utm_source=newsletter")
    expect(await run("utm-builder", { url: "nope" })).toHaveProperty("error")
    expect(await run("utm-builder", { source: "" })).toHaveProperty("error")
  })

  it("sitemap escapes ampersands and rejects bad urls", async () => {
    expect(await text("sitemap-generator", { urls: "https://e.com/?a=1&b=2" })).toContain(
      "a=1&amp;b=2"
    )
    expect(await run("sitemap-generator", { urls: "not a url" })).toHaveProperty("error")
  })

  it("robots requires leading slashes", async () => {
    expect(await text("robots-txt-generator")).toContain("Disallow: /admin/")
    expect(await run("robots-txt-generator", { disallow: "admin" })).toHaveProperty("error")
  })

  it("schema: FAQ output is valid JSON-LD and cannot close the script tag", async () => {
    const out = await text("schema-generator", { type: "FAQPage", faq: "Q? :: A </script> end" })
    expect(out).not.toContain("A </script>")
    const json = JSON.parse(out.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, ""))
    expect(json["@type"]).toBe("FAQPage")
    expect(json.mainEntity[0].name).toBe("Q?")
    expect(await run("schema-generator", { type: "FAQPage", faq: "no separator" })).toHaveProperty(
      "error"
    )
  })

  it("open graph escapes quotes", async () => {
    expect(await text("open-graph-generator", { title: 'Say "hi"' })).toContain(
      "Say &quot;hi&quot;"
    )
  })

  it("password entropy and SRI", async () => {
    expect(passwordEntropy("aaaa").pool).toBe(26)
    expect(passwordEntropy("Aa1!").pool).toBe(26 + 26 + 10 + 33)
    expect(
      await text("password-entropy-calculator", { password: "correct horse battery" })
    ).toContain("Entropy:")
    // sha-256 of "" is a known value
    const sri = await text("sri-hash-generator", { algo: "SHA-256", content: "a" })
    expect(sri).toContain("sha256-ypeBEsobvcr6wjGzmiPcTaeG7/gUfE5yuYB3ha/uSLs=")
  })

  it("domain tools", async () => {
    expect(await text("domain-name-generator")).toContain("gethosting.com")
    expect(await run("domain-name-generator", { tlds: "!!" })).toHaveProperty("error")
    expect(await text("domain-transfer-checklist")).toContain("example.com")
    expect(await run("domain-transfer-checklist", { domain: "x" })).toHaveProperty("error")
    expect(await run("domain-expiry-calculator")).toHaveProperty("error")
    expect(await text("domain-expiry-calculator", { expiry: "2000-01-01" })).toContain("Expired")
    expect(ageFrom(new Date(2020, 0, 31), new Date(2026, 2, 1))).toMatchObject({
      years: 6,
      months: 1,
    })
  })
})

describe("text transforms", () => {
  it("yaml and json round trip, with errors as values", () => {
    expect(jsonToYaml('{"a":{"b":[1,2]}}', 2)).toEqual({ ok: "a:\n  b:\n    - 1\n    - 2" })
    expect(yamlToJson("a: 1", 2)).toEqual({ ok: '{\n  "a": 1\n}' })
    expect(yamlFormat("a:   1", 2)).toEqual({ ok: "a: 1" })
    expect(yamlFormat("a: [", 2)).toHaveProperty("error")
    expect(jsonToYaml("{bad", 2)).toHaveProperty("error")
  })

  it("xml pretty prints and reports malformed input", () => {
    expect(xmlFormat("<a><b>1</b><c/></a>", 2)).toEqual({ ok: "<a>\n  <b>1</b>\n  <c/>\n</a>" })
    expect(xmlFormat("<a><b></a>", 2)).toHaveProperty("error")
  })

  it("sql formats", () => {
    const r = sqlFormat("select a,b from t where x=1", "sql", true)
    expect("ok" in r && r.ok).toContain("SELECT")
  })

  it("json to typescript", () => {
    const r = jsonToTypeScript('{"id":1,"tags":["a"],"p":{"on":true},"n":null}', "Root", false)
    expect(r).toHaveProperty("ok")
    const out = "ok" in r ? r.ok : ""
    expect(out).toContain("interface Root")
    expect(out).toContain("id: number")
    expect(out).toContain("tags: string[]")
    expect(out).toContain("n: null")
    const arr = jsonToTypeScript('[{"a":1},{"a":2,"b":"x"}]', "Items", false)
    expect("ok" in arr && arr.ok).toContain("b?: string")
  })

  it("csv parses quotes, newlines in fields and types", () => {
    expect(parseCsv('a,b\n"x,1","he said ""hi"""\n', ",")).toEqual([
      ["a", "b"],
      ["x,1", 'he said "hi"'],
    ])
    expect(() => parseCsv('"open', ",")).toThrow()
    const r = csvToJson("n,v\nada,1.5\nlin,true", ",", true, true)
    expect("ok" in r && JSON.parse(r.ok)).toEqual([
      { n: "ada", v: 1.5 },
      { n: "lin", v: true },
    ])
    expect(csvToJson("a,a\n1,2", ",", true, true)).toHaveProperty("error")
  })

  it("json to csv quotes fields and neutralises spreadsheet formulas", () => {
    const r = jsonToCsv('[{"a":"x,y","b":"=SUM(A1)","c":{"d":1}}]', ",")
    expect("ok" in r && r.ok).toBe('a,b,c.d\n"x,y",\'=SUM(A1),1')
    expect(jsonToCsv('{"a":1}', ",")).toEqual({ ok: "a\n1" })
    expect(jsonToCsv("[1,2]", ",")).toHaveProperty("error")
  })
})
