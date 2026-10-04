import { describe, expect, it } from "vitest"
import { emailProblem, generatorDefs, rfcDate } from "@/lib/generators"
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

describe("batch 5: email", () => {
  it("emailProblem accepts normal addresses and rejects malformed ones", () => {
    for (const ok of [
      "a@b.co",
      "first.last+tag@sub.example.com",
      "o'brien@example.org",
      "x_y-z@ex-ample.io",
    ])
      expect(emailProblem(ok), ok).toBeNull()
    for (const bad of [
      "plain",
      "@x.com",
      "a@",
      "a@@b.com",
      "a b@c.com",
      "a..b@c.com",
      ".a@c.com",
      "a@c",
      "a@c.c",
      "a@-c.com",
      `${"x".repeat(65)}@c.com`,
    ])
      expect(emailProblem(bad), bad).not.toBeNull()
  })

  it("validator flags typos and counts valid addresses", async () => {
    const out = await text("email-address-validator")
    expect(out).toContain("2 of 3 look valid")
    expect(out).toContain("did you mean @gmail.com")
    expect(out).toContain("INVALID  not-an-email")
    expect(await run("email-address-validator", { emails: "" })).toHaveProperty("error")
  })

  it("normalizer applies gmail rules, dedupes and strips wrappers", async () => {
    const out = await text("email-address-normalizer")
    expect(out.split("\n")[0]).toBe("janedoe@gmail.com")
    expect(out).toContain("bob@example.com")
    expect(out).toContain("1 duplicate(s) removed")
    const keep = await text("email-address-normalizer", {
      gmail: false,
      dedupe: false,
      plus: false,
    })
    expect(keep).toContain("jane.doe+news@gmail.com")
  })

  it("domain extractor counts domains case-insensitively", async () => {
    const out = await text("email-domain-extractor", {
      text: "a@Example.com b@example.com c@other.org",
    })
    expect(out).toContain("3 addresses, 2 unique domain(s)")
    expect(out).toMatch(/\s2\s+example\.com/)
    expect(await run("email-domain-extractor", { text: "nothing here" })).toHaveProperty("error")
  })

  it("username generator folds accents", async () => {
    const out = await text("email-username-generator", {
      first: "José",
      last: "O'Brien",
      domain: "example.com",
    })
    expect(out).toContain("jose.obrien@example.com")
    expect(out).toContain("jobrien@example.com")
    expect(await run("email-username-generator", { first: "", last: "x" })).toHaveProperty("error")
  })

  it("signatures validate input and escape html", async () => {
    expect(await text("email-signature-generator")).toContain("Tel: +1 555 0100")
    expect(await run("email-signature-generator", { site: "javascript:alert(1)" })).toHaveProperty(
      "error"
    )
    expect(await run("email-signature-generator", { phone: "<script>" })).toHaveProperty("error")
    const html = await text("html-email-signature-generator", { name: 'Jane <b>"Doe"' })
    expect(html).toContain("Jane &lt;b>&quot;Doe&quot;")
    expect(html).toContain('href="mailto:jane@example.com"')
    expect(
      await run("html-email-signature-generator", { logo: "http://x.com/l.png" })
    ).toHaveProperty("error")
    expect(await run("html-email-signature-generator", { color: "red" })).toHaveProperty("error")
  })

  it("header dates convert in both directions", async () => {
    const out = await text("email-header-date-converter")
    expect(out).toContain("2025-10-14T08:15:00.000Z")
    expect(out).toContain("Tue, 14 Oct 2025 08:15:00 +0000")
    expect(
      await text("email-header-date-converter", { input: "1760429700", offset: "-0500" })
    ).toContain("Tue, 14 Oct 2025 03:15:00 -0500")
    expect(rfcDate(0, "+0530")).toBe("Thu, 01 Jan 1970 05:30:00 +0530")
    expect(await run("email-header-date-converter", { input: "garbage" })).toHaveProperty("error")
    expect(await run("email-header-date-converter", { offset: "5" })).toHaveProperty("error")
  })

  it("size calculators encode and warn", async () => {
    const out = await text("email-attachment-size-calculator")
    expect(out).toContain("Total file size:       14.00 MB")
    expect(out).toContain("19.18 MB")
    expect(await text("email-attachment-size-calculator", { f1: 20, f2: 0, limit: 25 })).toContain(
      "Too big by"
    )
    expect(await run("email-attachment-size-calculator", { f1: 0, f2: 0 })).toHaveProperty("error")
    expect(await text("email-size-calculator", { body: 150 })).toContain("clips")
  })

  it("subject analyzer", async () => {
    const bad = await text("email-subject-line-analyzer", {
      subject: "FREE!!! ACT NOW to WIN CASH",
    })
    expect(bad).toContain("free")
    expect(bad).toContain("capital")
    expect(bad).toContain("! or ?")
    expect(
      await text("email-subject-line-analyzer", { subject: "Your cPanel license is ready" })
    ).toContain("No obvious problems")
  })

  it("references filter by text", async () => {
    expect(await text("smtp-port-reference", { query: "587" })).toContain("STARTTLS")
    expect(await text("smtp-port-reference", { query: "" })).toContain("9 port(s)")
    expect(await text("email-mime-type-reference", { query: ".pdf" })).toContain("application/pdf")
    expect(await run("smtp-port-reference", { query: "zzz" })).toHaveProperty("error")
  })
})
