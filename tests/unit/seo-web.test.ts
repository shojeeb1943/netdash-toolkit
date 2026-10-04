// @vitest-environment happy-dom
import { describe, expect, it } from "vitest"
import { generatorDefs, slugify } from "@/lib/generators"
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

describe("batch 4: text analysis", () => {
  it("word counter", async () => {
    const out = await text("word-counter", {
      text: "Hello world. It's a well-known test!\n\nSecond paragraph here.",
    })
    expect(out).toContain("Words:                9")
    expect(out).toContain("Paragraphs:           2")
    expect(await run("word-counter", { text: "  " })).toHaveProperty("error")
  })

  it("character counter separates characters from bytes", async () => {
    const out = await text("character-counter", { text: "café" })
    expect(out).toContain("Characters:             4")
    expect(out).toContain("UTF-8 bytes:            5")
  })

  it("reading time", async () => {
    const t = Array(476).fill("word").join(" ")
    expect(await text("reading-time-calculator", { text: t, wpm: 238 })).toContain("2 min 0 s")
    expect(await run("reading-time-calculator", { text: t, wpm: 5 })).toHaveProperty("error")
  })

  it("keyword density ignores stop words and counts phrases", async () => {
    const body =
      "cpanel hosting is fast. cpanel hosting is cheap. the cpanel panel is popular and the hosting wins"
    const out = await text("keyword-density-calculator", { text: body, size: "1" })
    expect(out).toMatch(/cpanel\s+3/)
    expect(out).not.toMatch(/^the\s/m)
    const phrases = await text("keyword-density-calculator", { text: body, size: "2" })
    expect(phrases).toMatch(/cpanel hosting\s+2/)
  })
})

describe("batch 4: html analysis", () => {
  it("heading analyzer finds a missing h1, skipped levels and empty headings", async () => {
    const out = await text("heading-structure-analyzer", { html: "<h2>A</h2><h4>B</h4><h3></h3>" })
    expect(out).toContain("There is no h1")
    expect(out).toContain("a level is skipped")
    expect(out).toContain("is empty")
    expect(await text("heading-structure-analyzer", { html: "<h1>Only</h1><h2>x</h2>" })).toContain(
      "No structure issues found"
    )
    expect(await run("heading-structure-analyzer", { html: "<p>none</p>" })).toHaveProperty("error")
  })

  it("internal links: counts relative, subdomain and external, skips mailto", async () => {
    const html =
      '<a href="/a">One</a><a href="https://www.example.com/b">Two</a><a href="https://blog.example.com">Blog</a><a href="https://other.org" rel="nofollow">X</a><a href="mailto:a@b.co">M</a><a href="/c"></a>'
    const out = await text("internal-link-calculator", { site: "example.com", html })
    expect(out).toContain("Internal:          4")
    expect(out).toContain("External:          1")
    expect(out).toContain("nofollow:          1")
    expect(out).toContain("no anchor text: 1")
    expect(await run("internal-link-calculator", { site: "not a domain", html })).toHaveProperty(
      "error"
    )
  })

  it("alt text flags generic file names", async () => {
    const out = await text("image-alt-text-generator", {
      files: "blue-cpanel-dashboard.png\nIMG_2041.jpg",
      subject: "",
    })
    expect(out).toContain('alt="Blue cpanel dashboard"')
    expect(out).toContain("says nothing")
  })
})

describe("batch 4: urls", () => {
  it("url parser and builder round trip", async () => {
    const out = await text("url-parser", { url: "https://user@example.com:8443/p?x=1&y=two#top" })
    expect(out).toContain("Port:      8443")
    expect(out).toContain("x = 1")
    expect(await run("url-parser", { url: "nope" })).toHaveProperty("error")
    const built = await text("url-builder", {
      base: "https://e.com/s?old=1",
      params: "q=a b\ntag=x\ntag=y",
      hash: "#r",
      reset: true,
    })
    expect(built).toBe("https://e.com/s?q=a+b&tag=x&tag=y#r")
    expect(await run("url-builder", { params: "=oops" })).toHaveProperty("error")
  })

  it("slugify handles accents, ampersands, separators, stop words and limits", () => {
    expect(slugify("Café & Crème Brûlée!")).toBe("cafe-and-creme-brulee")
    expect(slugify("How to Install the cPanel", "-", 0, true)).toBe("how-install-cpanel")
    expect(slugify("A very long title about hosting servers", "_", 20)).toBe("a_very_long_title")
    expect(slugify("!!!")).toBe("")
  })

  it("url length checker", async () => {
    expect(await text("url-length-checker", { url: "https://example.com/Some_Path" })).toContain(
      "Uppercase"
    )
    expect(
      await text("url-length-checker", { url: `https://example.com/${"a".repeat(2100)}` })
    ).toContain("2,000")
  })

  it("canonical generator strips tracking, fragments and index files", async () => {
    const out = await text("canonical-url-generator")
    expect(out.split("\n")[0]).toBe("https://www.example.com/Page/?id=7")
    expect(
      await text("canonical-url-generator", { params: "all", slash: "remove", www: "add" })
    ).toContain("https://www.example.com/Page\n")
    expect(await run("canonical-url-generator", { url: "ftp://x.com" })).toHaveProperty("error")
  })

  it("redirect builder refuses injection and loops", async () => {
    expect(await text("redirect-url-builder")).toContain(
      "Redirect 301 /old-page https://example.com/new-page"
    )
    expect(await run("redirect-url-builder", { to: "/x; return 301 evil" })).toHaveProperty("error")
    expect(await run("redirect-url-builder", { from: "/a", to: "/a" })).toHaveProperty("error")
    expect(await run("redirect-url-builder", { from: "old", to: "/a" })).toHaveProperty("error")
  })

  it("utm campaign builds one link per channel", async () => {
    const out = await text("utm-campaign-generator")
    expect(out.match(/utm_campaign=spring_sale/g)).toHaveLength(3)
    expect(await run("utm-campaign-generator", { channels: "onlyone" })).toHaveProperty("error")
  })
})

describe("batch 4: tags and files", () => {
  it("twitter card validates handles and escapes", async () => {
    const out = await text("twitter-card-generator", { title: 'Say "hi"' })
    expect(out).toContain('twitter:site" content="@example"')
    expect(out).toContain("Say &quot;hi&quot;")
    expect(
      await run("twitter-card-generator", { site: "@way_too_long_handle_name" })
    ).toHaveProperty("error")
  })

  it("previews report lengths and never load images", async () => {
    const out = await text("open-graph-preview", { title: "x".repeat(80) })
    expect(out).toContain("will probably be cut off")
    expect(out).toContain("not loaded")
    expect(
      generatorDefs["open-graph-preview"].card?.({ ...defaults("open-graph-preview") })?.kind
    ).toBe("og")
  })

  it("meta tag generator escapes and warns", async () => {
    const out = await text("meta-tag-generator", { title: "A & B", description: "x".repeat(170) })
    expect(out).toContain("<title>A &amp; B</title>")
    expect(out).toContain("aim for about 160")
    expect(await run("meta-tag-generator", { color: "blue" })).toHaveProperty("error")
  })

  it("html sitemap escapes titles and groups", async () => {
    const out = await text("html-sitemap-generator", {
      pages: "/blog/a | A <b>\n/blog/b-post",
      group: true,
    })
    expect(out).toContain("<h2>Blog</h2>")
    expect(out).toContain("A &lt;b>")
    expect(out).toContain("B post")
  })

  it("manifest json is valid and warns about missing icon sizes", async () => {
    const out = await text("web-manifest-generator")
    expect(JSON.parse(out).icons).toHaveLength(2)
    expect(await text("web-manifest-generator", { icons: "/i.png 48x48" })).toContain(
      "at least a 192x192"
    )
    expect(await run("web-manifest-generator", { theme: "blue" })).toHaveProperty("error")
  })

  it("security.txt follows RFC 9116 rules", async () => {
    const future = new Date(Date.now() + 200 * 86_400_000).toISOString().slice(0, 10)
    const out = await text("security-txt-generator", { expires: future })
    expect(out).toContain("Contact: mailto:security@example.com")
    expect(out).toMatch(/Expires: \d{4}-\d{2}-\d{2}T23:59:59Z/)
    expect(await run("security-txt-generator", { expires: "2000-01-01" })).toHaveProperty("error")
    expect(
      await run("security-txt-generator", { expires: future, contact: "security@example.com" })
    ).toHaveProperty("error")
    expect(
      await run("security-txt-generator", { expires: future, policy: "http://x.com/p" })
    ).toHaveProperty("error")
  })
})
