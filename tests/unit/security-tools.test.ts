import { describe, expect, it } from "vitest"
import { generatorDefs } from "@/lib/generators"
import type { GValues } from "@/lib/generators"
import { PASSPHRASE_WORDS } from "@/lib/wordlist"

const defaults = (slug: string): GValues =>
  Object.fromEntries(generatorDefs[slug].fields.map((f) => [f.id, f.value]))
const run = async (slug: string, over: GValues = {}) =>
  generatorDefs[slug].build({ ...defaults(slug), ...over })
const text = async (slug: string, over: GValues = {}) => {
  const r = await run(slug, over)
  if (typeof r !== "string") throw new Error(r.error)
  return r
}
const body = (out: string) => out.split("\n\n")[0].split("\n")

const b64url = (s: string) => Buffer.from(s).toString("base64url")

describe("batch 8a: security tools", () => {
  it("the word list has 256 distinct simple words", () => {
    expect(PASSPHRASE_WORDS).toHaveLength(256)
    expect(new Set(PASSPHRASE_WORDS).size).toBe(256)
    for (const w of PASSPHRASE_WORDS) expect(w).toMatch(/^[a-z]{3,8}$/)
  })

  it("passphrases: word count, separator, entropy statement, bounds", async () => {
    const out = await text("passphrase-generator", { words: 5, count: 4 })
    const lines = body(out)
    expect(lines).toHaveLength(4)
    for (const l of lines) {
      const parts = l.split("-")
      expect(parts).toHaveLength(5)
      for (const w of parts) expect(PASSPHRASE_WORDS).toContain(w)
    }
    expect(out).toContain("About 40 bits")
    expect(out).toContain("weak")
    expect(
      await text("passphrase-generator", {
        words: 8,
        capitalize: true,
        sep: "space",
        number: true,
        count: 1,
      })
    ).toMatch(/^([A-Z][a-z]+ ){8}\d{1,2}\n/)
    expect(await run("passphrase-generator", { words: 2 })).toHaveProperty("error")
    expect(await run("passphrase-generator", { count: 99 })).toHaveProperty("error")
  })

  it("api keys honour prefix, length and alphabet", async () => {
    const keys = body(await text("api-key-generator", { count: 10, length: 24 }))
    expect(keys).toHaveLength(10)
    for (const k of keys) expect(k).toMatch(/^sk_live_[0-9A-Za-z]{24}$/)
    expect(new Set(keys).size).toBe(10)
    for (const k of body(
      await text("api-key-generator", { prefix: "", charset: "hex", length: 16, count: 3 })
    ))
      expect(k).toMatch(/^[0-9a-f]{16}$/)
    expect(await run("api-key-generator", { prefix: "Bad Prefix" })).toHaveProperty("error")
    expect(await run("api-key-generator", { length: 4 })).toHaveProperty("error")
  })

  it("secrets have the right size and encoding", async () => {
    expect(body(await text("secret-generator"))[0]).toMatch(/^[0-9a-f]{64}$/)
    expect(body(await text("secret-generator", { encoding: "base64", bytes: 32 }))[0]).toMatch(
      /^[A-Za-z0-9+/]{43}=$/
    )
    expect(body(await text("secret-generator", { encoding: "base64url", bytes: 32 }))[0]).toMatch(
      /^[A-Za-z0-9_-]{43}$/
    )
    expect(await text("secret-generator", { encoding: "base64" })).toContain(
      "openssl rand -base64 32"
    )
    expect(await run("secret-generator", { bytes: 4 })).toHaveProperty("error")
  })

  it("tokens group and stay inside the set", async () => {
    for (const t of body(
      await text("token-generator", { charset: "upper", length: 12, group: 4, count: 20 })
    ))
      expect(t).toMatch(/^[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/)
    for (const t of body(
      await text("token-generator", { charset: "numbers", length: 10, count: 5 })
    ))
      expect(t).toMatch(/^\d{10}$/)
    expect(await run("token-generator", { length: 2 })).toHaveProperty("error")
  })

  it("hmac matches the published test vectors", async () => {
    // RFC 4231 test case 2 and a well known SHA-1 vector
    const sha256 = await text("hmac-generator", {
      key: "Jefe",
      message: "what do ya want for nothing?",
      algo: "SHA-256",
    })
    expect(sha256).toContain("5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843")
    const sha1 = await text("hmac-generator", {
      key: "key",
      message: "The quick brown fox jumps over the lazy dog",
      algo: "SHA-1",
    })
    expect(sha1).toContain("de7c9b85b8b78aa6bc8a7a36f70a90701c9db4d9")
    expect(
      await text("hmac-generator", {
        keyFormat: "hex",
        key: "4a656665",
        message: "what do ya want for nothing?",
      })
    ).toContain("5bdcc146bf60754e")
    expect(await run("hmac-generator", { key: "" })).toHaveProperty("error")
    expect(await run("hmac-generator", { keyFormat: "hex", key: "xyz" })).toHaveProperty("error")
  })

  it("jwt generator signs verifiably and expiry calculator reads it back", async () => {
    const tok = (
      await text("jwt-generator", { payload: '{"sub":"1"}', secret: "s3cret", minutes: 60 })
    ).split("\n")[0]
    const [h, p, sig] = tok.split(".")
    expect(JSON.parse(Buffer.from(h, "base64url").toString())).toEqual({ alg: "HS256", typ: "JWT" })
    const payload = JSON.parse(Buffer.from(p, "base64url").toString())
    expect(payload.sub).toBe("1")
    expect(payload.exp - payload.iat).toBe(3600)
    const { createHmac } = await import("node:crypto")
    expect(createHmac("sha256", "s3cret").update(`${h}.${p}`).digest("base64url")).toBe(sig)
    const status = await text("jwt-expiry-calculator", { token: tok })
    expect(status).toContain("VALID")
    expect(status).toMatch(/in (1h 0m|59m \d+s)/)
    expect(await run("jwt-generator", { payload: "[1]" })).toHaveProperty("error")
    expect(await run("jwt-generator", { payload: "{bad" })).toHaveProperty("error")
    expect(await run("jwt-generator", { secret: "" })).toHaveProperty("error")
  })

  it("expiry calculator handles expired, not-yet-valid, no-expiry and garbage", async () => {
    const make = (claims: object) =>
      `${b64url('{"alg":"none"}')}.${b64url(JSON.stringify(claims))}.sig`
    const now = Math.floor(Date.now() / 1000)
    expect(await text("jwt-expiry-calculator", { token: make({ exp: now - 120 }) })).toContain(
      "EXPIRED"
    )
    expect(
      await text("jwt-expiry-calculator", { token: make({ nbf: now + 600, exp: now + 3600 }) })
    ).toContain("NOT VALID YET")
    expect(await text("jwt-expiry-calculator", { token: make({ sub: "x" }) })).toContain(
      "never expires"
    )
    expect(
      await text("jwt-expiry-calculator", { token: `Bearer ${make({ exp: now + 10 })}` })
    ).toContain("VALID")
    expect(await run("jwt-expiry-calculator", { token: "not.a.jwt!" })).toHaveProperty("error")
    expect(await run("jwt-expiry-calculator", { token: "" })).toHaveProperty("error")
  })

  it("uuid validator identifies version, variant and special values", async () => {
    const out = await text("uuid-validator")
    expect(out).toContain("3 of 4 are well formed")
    expect(out).toContain("550e8400-e29b-41d4-a716-446655440000  version 4, variant RFC 4122/9562")
    expect(out).toContain("INVALID  not-a-uuid")
    expect(out).toContain("nil UUID")
    expect(
      await text("uuid-validator", { uuids: "FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF" })
    ).toContain("max UUID")
    expect(await text("uuid-validator", { uuids: "123e4567e89b12d3a456426614174000" })).toContain(
      "version 1"
    )
    expect(
      await text("uuid-validator", { uuids: "123e4567-e89b-92d3-a456-426614174000" })
    ).toContain("CHECK")
  })

  it("csp hash matches sha256 of the exact content", async () => {
    const out = await text("csp-hash-generator", { content: "console.log('hello');" })
    const { createHash } = await import("node:crypto")
    const expected = createHash("sha256").update("console.log('hello');").digest("base64")
    expect(out.split("\n")[0]).toBe(`'sha256-${expected}'`)
    expect(out).toContain("script-src 'self'")
    expect(
      await text("csp-hash-generator", { kind: "style", algo: "SHA-384", content: "a{b:c}" })
    ).toContain("style-src 'self' 'sha384-")
    expect(await run("csp-hash-generator", { content: "" })).toHaveProperty("error")
  })
})
