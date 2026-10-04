// @vitest-environment happy-dom
import { describe, expect, it } from "vitest"
import { generatorDefs } from "@/lib/generators"
import type { GValues } from "@/lib/generators"
import { cssMinify, htmlFormat, htmlMinify, sqlMinify, transformDefs } from "@/lib/text-transforms"
import { parseInline, parseMarkdown, safeHref } from "@/lib/markdown"

const defaults = (slug: string): GValues =>
  Object.fromEntries(generatorDefs[slug].fields.map((f) => [f.id, f.value]))
const run = async (slug: string, over: GValues = {}) =>
  generatorDefs[slug].build({ ...defaults(slug), ...over })
const text = async (slug: string, over: GValues = {}) => {
  const r = await run(slug, over)
  if (typeof r !== "string") throw new Error(r.error)
  return r
}
const okOf = (r: ReturnType<typeof cssMinify>) => ("ok" in r ? r.ok : `ERROR ${r.error}`)

describe("batch 7: minifiers and formatter", () => {
  it("css minify keeps strings, urls and licence comments", () => {
    expect(okOf(cssMinify("/* x */\n.a  {\n  color: red;\n  margin: 0 auto;\n}\n"))).toBe(
      ".a{color:red;margin:0 auto}"
    )
    expect(okOf(cssMinify('a::after{content:" a  b ";background:url( "x y.png" )}'))).toBe(
      'a::after{content:" a  b ";background:url( "x y.png" )}'
    )
    expect(okOf(cssMinify("/*! keep */ a { b: c }"))).toBe("/*! keep */ a{b:c}")
    expect(okOf(cssMinify("a :hover { color: red }"))).toBe("a :hover{color:red}")
    expect(okOf(cssMinify("p { width: calc(1px + 2px); }"))).toBe("p{width:calc(1px + 2px)}")
    expect(okOf(cssMinify("div > p , a { x: y }"))).toBe("div>p,a{x:y}")
    expect(cssMinify("  ")).toHaveProperty("error")
  })

  it("sql minify removes comments but not string contents", () => {
    const out = okOf(
      sqlMinify("-- note\nSELECT a,\n   b FROM t /* c */ WHERE x = 'a  b  c' AND y = \"q  r\";\n")
    )
    expect(out).toBe("SELECT a,b FROM t WHERE x = 'a  b  c' AND y = \"q  r\";")
    expect(okOf(sqlMinify("SELECT 'it''s  ok'"))).toBe("SELECT 'it''s  ok'")
  })

  it("html minify drops comments and block whitespace, keeps pre and conditional comments", () => {
    const out = okOf(
      htmlMinify(
        '<!-- c -->\n<div class="a">\n  <p>Hello,   world</p>\n  <pre>keep   this\n</pre>\n</div>'
      )
    )
    expect(out).toBe('<div class="a"><p>Hello, world</p><pre>keep   this\n</pre></div>')
    expect(okOf(htmlMinify("<!--[if IE]><p>ie</p><![endif]--><b>a</b> <i>b</i>"))).toContain(
      "<!--[if IE]>"
    )
    expect(okOf(htmlMinify("<b>a</b> <i>b</i>"))).toBe("<b>a</b> <i>b</i>")
  })

  it("html formatter indents, joins short elements and leaves raw blocks alone", () => {
    const out = okOf(
      htmlFormat("<div><h1>Title</h1><ul><li>One</li></ul><script>var a  =  1;</script></div>", 2)
    )
    expect(out).toBe(
      "<div>\n  <h1>Title</h1>\n  <ul>\n    <li>One</li>\n  </ul>\n  <script>var a  =  1;</script>\n</div>"
    )
    expect(okOf(htmlFormat("<p>x<br>y</p>", 2))).toContain("<br>")
  })

  it("every transform definition runs on its sample without throwing", () => {
    for (const [slug, def] of Object.entries(transformDefs)) {
      const opts = Object.fromEntries((def.options ?? []).map((o) => [o.id, o.value]))
      const r = def.run(def.sample, opts)
      expect("ok" in r || "error" in r, slug).toBe(true)
    }
  })
})

describe("batch 7: markdown", () => {
  it("parses blocks", () => {
    const md =
      "# Title\n\nPara with **bold** and `code`.\n\n- a\n- b\n  - nested\n\n1. one\n2. two\n\n> quote\n\n---\n\n```js\nlet x = 1\n```\n\n| A | B |\n| :-- | --: |\n| 1 | 2 |\n"
    const blocks = parseMarkdown(md)
    expect(blocks.map((b) => b.t)).toEqual([
      "heading",
      "p",
      "list",
      "list",
      "quote",
      "hr",
      "code",
      "table",
    ])
    const list = blocks[2]
    expect(list.t === "list" && list.items).toHaveLength(2)
    const table = blocks[7]
    expect(table.t === "table" && table.align).toEqual(["left", "right"])
    expect(blocks[6]).toMatchObject({ t: "code", lang: "js", v: "let x = 1" })
  })

  it("never produces unsafe links or html", () => {
    expect(safeHref("javascript:alert(1)")).toBeNull()
    expect(safeHref("data:text/html,x")).toBeNull()
    expect(safeHref("https://example.com/a?b=1")).toBe("https://example.com/a?b=1")
    const nodes = parseInline(
      "[x](javascript:alert(1)) <script>alert(1)</script> ![pic](http://evil/x.png)"
    )
    expect(nodes.some((n) => n.t === "link")).toBe(false)
    expect(nodes.some((n) => n.t === "image")).toBe(true)
    expect(JSON.stringify(nodes)).toContain("<script>")
    const link = parseInline("[ok](https://example.com)")[0]
    expect(link).toMatchObject({ t: "link", href: "https://example.com" })
  })

  it("handles emphasis edge cases without hanging", () => {
    expect(parseInline("snake_case_name")).toEqual([{ t: "text", v: "snake_case_name" }])
    expect(parseInline("*a* and **b** and ~~c~~").map((n) => n.t)).toEqual([
      "em",
      "text",
      "strong",
      "text",
      "del",
    ])
    expect(parseInline("unclosed ** bold")).toEqual([{ t: "text", v: "unclosed ** bold" }])
    expect(parseMarkdown("")).toEqual([])
  })
})

describe("batch 7: generators", () => {
  it("table generator aligns, pads ragged rows and escapes pipes", async () => {
    const out = await text("markdown-table-generator")
    expect(out.split("\n")[1]).toMatch(/^\| :-+ \| -+: \| :-+: \|$/)
    expect(out).toContain("| Starter ")
    const rag = await text("markdown-table-generator", { data: "a,b\nx|y", header: true })
    expect(rag).toContain("x\\|y")
    expect(await run("markdown-table-generator", { data: "" })).toHaveProperty("error")
  })

  it("uuid: counts, formats, v7 ordering", async () => {
    const out = (await text("uuid-bulk-generator", { count: 20 })).split("\n")
    expect(out).toHaveLength(20)
    for (const u of out)
      expect(u).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    expect(new Set(out).size).toBe(20)
    const v7 = (
      await text("uuid-bulk-generator", {
        count: 5,
        version: "v7",
        hyphens: false,
        upper: true,
        braces: true,
      })
    ).split("\n")
    expect(v7[0]).toMatch(/^\{[0-9A-F]{32}\}$/)
    expect(v7[0][13]).toBe("7")
    expect([...v7].sort()).toEqual(v7)
    expect(await run("uuid-bulk-generator", { count: 5000 })).toHaveProperty("error")
  })

  it("nanoid and random strings respect length, alphabet and required classes", async () => {
    const ids = (await text("nanoid-generator", { count: 50, length: 12, alphabet: "hex" }))
      .split("\n\n")[0]
      .split("\n")
    expect(ids).toHaveLength(50)
    for (const id of ids) expect(id).toMatch(/^[0-9a-f]{12}$/)
    expect(await run("nanoid-generator", { length: 0 })).toHaveProperty("error")
    const strs = (await text("random-string-generator", { length: 8, count: 30, symbols: true }))
      .split("\n\n")[0]
      .split("\n")
    for (const x of strs) {
      expect(x).toHaveLength(8)
      expect(x).toMatch(/[a-z]/)
      expect(x).toMatch(/[A-Z]/)
      expect(x).toMatch(/\d/)
      expect(x).toMatch(/[^A-Za-z0-9]/)
    }
    expect(
      (
        await text("random-string-generator", {
          ambiguous: true,
          length: 200,
          count: 1,
          symbols: false,
        })
      ).split("\n\n")[0]
    ).not.toMatch(/[0O1lI|]/)
    expect(
      await run("random-string-generator", {
        lower: false,
        upper: false,
        digits: false,
        symbols: false,
      })
    ).toHaveProperty("error")
    expect(await run("random-string-generator", { length: 2, symbols: true })).toHaveProperty(
      "error"
    )
  })

  it("user agents", async () => {
    expect(await text("user-agent-generator")).toContain("Chrome/131.0.0.0")
    expect(await text("user-agent-generator", { which: "all" })).toContain("Googlebot")
    expect(await run("user-agent-generator", { version: 0 })).toHaveProperty("error")
  })

  it("status reference and generator", async () => {
    expect(await text("http-status-reference", { query: "404" })).toContain("Not Found")
    expect(await text("http-status-reference", { query: "5xx" })).toContain("503")
    expect(await run("http-status-reference", { query: "zzzz" })).toHaveProperty("error")
    expect(await text("http-status-generator", { code: "301" })).toContain(
      "Location: https://example.com/new"
    )
    expect(
      await run("http-status-generator", { code: "301", location: "javascript:x" })
    ).toHaveProperty("error")
    expect(
      await run("http-status-generator", { code: "301", location: "/a; evil" })
    ).toHaveProperty("error")
    expect(await text("http-status-generator", { code: "204" })).not.toContain("Content-Type")
  })

  it("mime lookup, checker and content-type builder", async () => {
    expect(await text("mime-type-lookup", { query: "webp" })).toContain("image/webp")
    expect(await text("mime-type-checker")).toContain("Match.")
    expect(await text("mime-type-checker", { type: "text/plain" })).toContain("Mismatch")
    expect(
      await text("mime-type-checker", {
        file: "app.js",
        type: "application/javascript; charset=utf-8",
      })
    ).toContain("Match.")
    expect(await run("mime-type-checker", { file: "noext" })).toHaveProperty("error")
    expect(await text("content-type-builder")).toContain("Content-Type: text/html; charset=utf-8")
    expect(await text("content-type-builder", { type: "multipart/form-data" })).toContain(
      "boundary=----FormBoundary7MA4YWxk"
    )
    expect(await run("content-type-builder", { custom: "not a type" })).toHaveProperty("error")
    expect(
      await run("content-type-builder", { type: "multipart/form-data", boundary: "bad boundary!" })
    ).toHaveProperty("error")
  })

  it("cache-control combinations and warnings", async () => {
    expect(await text("cache-control-generator")).toContain(
      "Cache-Control: public, max-age=31536000, immutable"
    )
    const store = await text("cache-control-generator", { nostore: true })
    expect(store).toContain("Cache-Control: no-store")
    expect(store).toContain("switches caching off")
    expect(await text("cache-control-generator", { immutable: true, maxAge: 60 })).toContain(
      "only helps with a long max-age"
    )
    expect(await run("cache-control-generator", { maxAge: -1 })).toHaveProperty("error")
  })

  it("cors rules", async () => {
    const out = await text("cors-header-generator")
    expect(out).toContain("Access-Control-Allow-Origin: https://app.example.com")
    expect(out).toContain("Access-Control-Allow-Methods: GET, POST, OPTIONS")
    expect(await run("cors-header-generator", { origin: "*", credentials: true })).toHaveProperty(
      "error"
    )
    expect(await run("cors-header-generator", { origin: "https://x.com/path" })).toHaveProperty(
      "error"
    )
    expect(await run("cors-header-generator", { headers: "bad header!" })).toHaveProperty("error")
    expect(
      await run("cors-header-generator", { mGET: false, mPOST: false, mOPTIONS: false })
    ).toHaveProperty("error")
  })

  it("csp validates sources and flags risk", async () => {
    const out = await text("csp-generator")
    expect(out).toContain(
      "Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self'"
    )
    expect(out).toContain("upgrade-insecure-requests")
    expect(await text("csp-generator", { script: "'self' 'unsafe-inline'" })).toContain(
      "'unsafe-inline' lets injected inline scripts run"
    )
    expect(await run("csp-generator", { script: "'self'; img-src *" })).toHaveProperty("error")
    expect(await run("csp-generator", { script: 'evil"' })).toHaveProperty("error")
    expect(await text("csp-generator", { object: "", base: "" })).toContain("object-src is not set")
    expect(await run("csp-generator", { report: "javascript:x" })).toHaveProperty("error")
  })

  it("hsts preload rules", async () => {
    expect(await text("hsts-header-generator")).toContain("max-age=31536000; includeSubDomains")
    expect(await run("hsts-header-generator", { preload: true, maxAge: 100 })).toHaveProperty(
      "error"
    )
    expect(await run("hsts-header-generator", { preload: true, sub: false })).toHaveProperty(
      "error"
    )
    expect(await text("hsts-header-generator", { preload: true })).toContain("; preload")
  })

  it("security headers for each server", async () => {
    expect(await text("security-header-generator")).toContain(
      'add_header X-Content-Type-Options "nosniff" always;'
    )
    expect(await text("security-header-generator", { server: "apache" })).toContain(
      "<IfModule mod_headers.c>"
    )
    expect(await text("security-header-generator", { server: "php" })).toContain("<?php")
    expect(await text("security-header-generator", { server: "raw" })).toContain(
      "X-Frame-Options: SAMEORIGIN"
    )
    expect(
      await run("security-header-generator", {
        nosniff: false,
        frame: "off",
        referrer: "off",
        permissions: false,
        coop: "off",
        corp: "off",
        hsts: false,
      })
    ).toHaveProperty("error")
  })
})
