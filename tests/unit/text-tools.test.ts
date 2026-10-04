import { describe, expect, it } from "vitest"
import { convertCase, generatorDefs, splitWords } from "@/lib/generators"
import type { GValues } from "@/lib/generators"
import { diffJson, diffLines, formatJsonChanges, MAX_DIFF_LINES } from "@/lib/diff"
import { tsvToCsv } from "@/lib/text-transforms"

const defaults = (slug: string): GValues =>
  Object.fromEntries(generatorDefs[slug].fields.map((f) => [f.id, f.value]))
const run = async (slug: string, over: GValues = {}) =>
  generatorDefs[slug].build({ ...defaults(slug), ...over })
const text = async (slug: string, over: GValues = {}) => {
  const r = await run(slug, over)
  if (typeof r !== "string") throw new Error(r.error)
  return r
}
const opts = { ignoreCase: false, ignoreSpace: false }
const okOf = (r: ReturnType<typeof tsvToCsv>) => ("ok" in r ? r.ok : `ERROR ${r.error}`)

describe("batch 8b: case converter", () => {
  it("splits identifiers into words", () => {
    expect(splitWords("HTTPServerError")).toEqual(["HTTP", "Server", "Error"])
    expect(splitWords("some_snake-case.and kebab")).toEqual([
      "some",
      "snake",
      "case",
      "and",
      "kebab",
    ])
    expect(splitWords("version2Update")).toEqual(["version2", "Update"])
  })

  it("converts to each style", () => {
    const src = "Hello World from the Tools"
    expect(convertCase(src, "camel")).toBe("helloWorldFromTheTools")
    expect(convertCase(src, "pascal")).toBe("HelloWorldFromTheTools")
    expect(convertCase(src, "snake")).toBe("hello_world_from_the_tools")
    expect(convertCase(src, "kebab")).toBe("hello-world-from-the-tools")
    expect(convertCase(src, "constant")).toBe("HELLO_WORLD_FROM_THE_TOOLS")
    expect(convertCase(src, "dot")).toBe("hello.world.from.the.tools")
    expect(convertCase("makeHTTPRequest", "snake")).toBe("make_http_request")
    expect(convertCase("hello WORLD. second sentence! third?", "sentence")).toBe(
      "Hello world. Second sentence! Third?"
    )
    expect(convertCase("the quick-brown fox", "title")).toBe("The Quick-Brown Fox")
    expect(convertCase("abc", "alternating")).toBe("aBc")
    expect(convertCase("aBc", "inverse")).toBe("AbC")
    expect(convertCase("one two\nthree four", "camel")).toBe("oneTwo\nthreeFour")
  })

  it("the generator wraps it and rejects empty input", async () => {
    expect(
      await text("text-case-converter", { mode: "snake", text: "Hello World from the web tools" })
    ).toBe("hello_world_from_the_web_tools")
    expect(await run("text-case-converter", { text: "  " })).toHaveProperty("error")
  })
})

describe("batch 8b: line tools", () => {
  it("sorts in every order", async () => {
    const t = "banana\nApple\ncherry\napple\n10\n9\n"
    expect((await text("line-sorter", { text: t })).split("\n")).toEqual([
      "9",
      "10",
      "Apple",
      "apple",
      "banana",
      "cherry",
    ])
    expect((await text("line-sorter", { text: t, order: "za" })).split("\n")[0]).toBe("cherry")
    expect(
      (await text("line-sorter", { text: "a2\na10\na1", order: "num-asc" })).split("\n")
    ).toEqual(["a1", "a2", "a10"])
    expect(
      (await text("line-sorter", { text: "aaa\nb\ncc", order: "len-desc" })).split("\n")
    ).toEqual(["aaa", "cc", "b"])
    expect((await text("line-sorter", { text: "1\n2\n3", order: "reverse" })).split("\n")).toEqual([
      "3",
      "2",
      "1",
    ])
    const shuffled = (
      await text("line-sorter", { text: "1\n2\n3\n4\n5\n6\n7\n8", order: "shuffle" })
    ).split("\n")
    expect([...shuffled].sort()).toEqual(["1", "2", "3", "4", "5", "6", "7", "8"])
    expect(await run("line-sorter", { text: "" })).toHaveProperty("error")
  })

  it("removes, finds and counts duplicates", async () => {
    const out = await text("duplicate-line-remover")
    expect(out.split("\n\n")[0].split("\n")).toEqual(["alpha", "beta", "Gamma", "gamma"])
    expect(out).toContain("3 duplicate or blank line(s) removed")
    expect(
      (await text("duplicate-line-remover", { icase: true })).split("\n\n")[0].split("\n")
    ).toEqual(["alpha", "beta", "Gamma"])
    expect(
      (await text("duplicate-line-remover", { mode: "duplicates" })).split("\n\n")[0].split("\n")
    ).toEqual(["alpha", "beta"])
    expect(
      (await text("duplicate-line-remover", { mode: "unique" })).split("\n\n")[0].split("\n")
    ).toEqual(["Gamma", "gamma"])
    expect(await text("duplicate-line-remover", { count: true })).toContain("2\talpha")
  })

  it("cleans whitespace, invisible characters and line endings", async () => {
    const out = (await text("whitespace-cleaner")).split("\n\n\n")[0]
    expect(out).not.toMatch(/ |​/)
    expect(out.split("\n")[0]).toBe("  Hello world")
    expect(await text("whitespace-cleaner", { text: "a​b", trimEnds: false })).toMatch(/^ab/)
    expect(await text("whitespace-cleaner", { text: "a\n\n\n\n\nb", blanks: true })).toMatch(
      /^a\n\nb\n\n/
    )
    expect(await text("whitespace-cleaner", { text: "a\nb", eol: "crlf" })).toContain("a\r\nb")
    expect(await text("whitespace-cleaner", { text: "x   ", final: true })).toMatch(/^x\n\n/)
    expect(await run("whitespace-cleaner", { text: "" })).toHaveProperty("error")
  })

  it("tsv to csv quotes correctly and guards formulas", () => {
    const csv = okOf(tsvToCsv('a\tb,c\td\nsays "hi"\t=SUM(A1)\tx', ",", true))
    expect(csv).toBe('a,"b,c",d\n"says ""hi""",\'=SUM(A1),x')
    expect(okOf(tsvToCsv("a\t=1", ";", false))).toBe("a;=1")
    expect(okOf(tsvToCsv("a\tb", "tab", true))).toBe("a\tb")
    expect(tsvToCsv("  ", ",", true)).toHaveProperty("error")
  })
})

describe("batch 8b: diff engines", () => {
  it("line diff finds adds, deletes and keeps shared lines in order", () => {
    const ops = diffLines(["a", "b", "c", "d"], ["a", "c", "d", "e"], opts)
    expect(ops.map((o) => `${o.t[0]}:${o.v}`)).toEqual(["s:a", "d:b", "s:c", "s:d", "a:e"])
    expect(diffLines([], ["x"], opts)).toEqual([{ t: "add", v: "x" }])
    expect(diffLines(["x"], [], opts)).toEqual([{ t: "del", v: "x" }])
    expect(diffLines(["same"], ["same"], opts)).toEqual([{ t: "same", v: "same" }])
  })

  it("line diff honours ignore case and spacing but shows original text", () => {
    const ops = diffLines(["Hello   World"], ["hello world"], {
      ignoreCase: true,
      ignoreSpace: true,
    })
    expect(ops).toEqual([{ t: "same", v: "Hello   World" }])
    expect(diffLines(["Hello"], ["hello"], opts).map((o) => o.t)).toEqual(["del", "add"])
  })

  it("the number of kept lines is the longest common subsequence", () => {
    const a = "the quick brown fox jumps over the lazy dog again and again".split(" ")
    const b = "the slow brown dog jumps over a lazy fox again then again".split(" ")
    const ops = diffLines(a, b, opts)
    expect(ops.filter((o) => o.t !== "add").map((o) => o.v)).toEqual(a)
    expect(ops.filter((o) => o.t !== "del").map((o) => o.v)).toEqual(b)
  })

  it("refuses sizes that would freeze the browser", () => {
    const big = Array.from({ length: MAX_DIFF_LINES + 1 }, (_, i) => String(i))
    expect(() => diffLines(big, [], opts)).toThrow(/at most/)
  })

  it("json diff reports paths, ignores key order and compares arrays by index", () => {
    const changes = diffJson(
      { a: 1, b: { c: [1, 2] }, d: "x" },
      { d: "x", b: { c: [1, 3, 4] }, e: true }
    )
    expect(formatJsonChanges(changes).split("\n")).toEqual([
      "- $.a: 1",
      "~ $.b.c[1]: 2 -> 3",
      "+ $.b.c[2]: 4",
      "+ $.e: true",
    ])
    expect(diffJson({ a: 1, b: 2 }, { b: 2, a: 1 })).toEqual([])
    expect(diffJson({ "a-b": 1 }, { "a-b": 2 })[0].path).toBe('$["a-b"]')
    expect(diffJson(1, "1")).toHaveLength(1)
  })
})
