import { describe, expect, it } from "vitest"
import { toolFaqs } from "@/lib/tool-faqs"
import { tools } from "@/lib/tool-registry"

const entries = Object.entries(toolFaqs)

describe("tool faqs", () => {
  it("only describe registered tools", () => {
    const slugs = new Set(tools.map((t) => t.slug))
    for (const [slug] of entries) expect(slugs.has(slug), slug).toBe(true)
  })

  it("give each tool exactly three questions", () => {
    for (const [slug, faqs] of entries) expect(faqs.length, slug).toBe(3)
  })

  it("keep answers a useful length, as plain text without dashes", () => {
    for (const [slug, faqs] of entries) {
      for (const { q, a } of faqs) {
        expect(a.length, `${slug}: "${q}" answer length`).toBeGreaterThanOrEqual(40)
        expect(a.length, `${slug}: "${q}" answer length`).toBeLessThanOrEqual(400)
        expect(q.endsWith("?"), `${slug}: "${q}" should be a question`).toBe(true)
        expect(/[–—<>]/.test(q + a), `${slug}: dash or markup in FAQ`).toBe(false)
      }
    }
  })

  it("never repeat a question or an answer across tools", () => {
    const questions = entries.flatMap(([, f]) => f.map((x) => x.q))
    const answers = entries.flatMap(([, f]) => f.map((x) => x.a))
    expect(new Set(questions).size, "duplicate questions").toBe(questions.length)
    expect(new Set(answers).size, "duplicate answers").toBe(answers.length)
  })
})
