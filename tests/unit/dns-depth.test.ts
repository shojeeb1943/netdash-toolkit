import { describe, expect, it, vi, beforeEach } from "vitest"
import {
  checkDnssec,
  checkNameserverDelegation,
  findSubdomains,
  compareResolvers,
} from "@/lib/dns-depth"

function makeMockJsonResponse(data: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
    headers: new Headers({ "content-type": "application/json" }),
  } as unknown as Response
}

describe("DNSSEC Checker", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("rejects invalid domain names", async () => {
    await expect(checkDnssec("not a domain")).rejects.toThrow("Please enter a valid domain name")
  })

  it("reports secure when DS, DNSKEY and AD flag are present", async () => {
    globalThis.fetch = vi.fn().mockImplementation(async (url: string) => {
      const u = String(url)
      if (u.includes("type=DS")) {
        return makeMockJsonResponse({
          Status: 0,
          AD: true,
          Answer: [{ name: "cloudflare.com.", type: 43, TTL: 3600, data: "2371 13 2 1234abcd" }],
        })
      }
      if (u.includes("type=DNSKEY")) {
        return makeMockJsonResponse({
          Status: 0,
          AD: true,
          Answer: [{ name: "cloudflare.com.", type: 48, TTL: 3600, data: "257 3 13 keydata" }],
        })
      }
      return makeMockJsonResponse({
        Status: 0,
        AD: true,
        Answer: [{ name: "cloudflare.com.", type: 1, TTL: 300, data: "104.16.132.229" }],
      })
    })

    const res = await checkDnssec("cloudflare.com")
    expect(res.status).toBe("secure")
    expect(res.authenticatedData).toBe(true)
    expect(res.hasDs).toBe(true)
    expect(res.hasDnskey).toBe(true)
  })

  it("reports insecure when no DS or DNSKEY records exist", async () => {
    globalThis.fetch = vi.fn().mockImplementation(async (url: string) => {
      const u = String(url)
      if (u.includes("type=DS") || u.includes("type=DNSKEY")) {
        return makeMockJsonResponse({ Status: 0, AD: false, Answer: [] })
      }
      return makeMockJsonResponse({
        Status: 0,
        AD: false,
        Answer: [{ name: "insecure.example.", type: 1, TTL: 300, data: "192.0.2.1" }],
      })
    })

    const res = await checkDnssec("insecure.example")
    expect(res.status).toBe("insecure")
    expect(res.hasDs).toBe(false)
    expect(res.hasDnskey).toBe(false)
  })

  it("reports bogus when resolver returns SERVFAIL Status 2", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      makeMockJsonResponse({
        Status: 2,
        AD: false,
        Answer: [],
      })
    )

    const res = await checkDnssec("bogus.example")
    expect(res.status).toBe("bogus")
    expect(res.statusLabel).toContain("Bogus")
  })
})

describe("Nameserver Delegation Checker", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("identifies matching delegation when RDAP and live NS agree", async () => {
    globalThis.fetch = vi.fn().mockImplementation(async (url: string) => {
      const u = String(url)
      if (u.includes("rdap.org")) {
        return makeMockJsonResponse({
          ldhName: "example.com",
          nameservers: [{ ldhName: "ns1.example.com" }, { ldhName: "ns2.example.com" }],
        })
      }
      return makeMockJsonResponse({
        Status: 0,
        Answer: [
          { name: "example.com.", type: 2, TTL: 86400, data: "ns1.example.com." },
          { name: "example.com.", type: 2, TTL: 86400, data: "ns2.example.com." },
        ],
      })
    })

    const res = await checkNameserverDelegation("example.com")
    expect(res.isConsistent).toBe(true)
    expect(res.verdict).toBe("consistent")
    expect(res.matchingNameservers).toEqual(["ns1.example.com", "ns2.example.com"])
    expect(res.registryOnly).toEqual([])
    expect(res.liveOnly).toEqual([])
  })

  it("detects mismatch when parent and live NS differ", async () => {
    globalThis.fetch = vi.fn().mockImplementation(async (url: string) => {
      const u = String(url)
      if (u.includes("rdap.org")) {
        return makeMockJsonResponse({
          ldhName: "example.com",
          nameservers: [{ ldhName: "ns1.oldhost.com" }, { ldhName: "ns2.oldhost.com" }],
        })
      }
      return makeMockJsonResponse({
        Status: 0,
        Answer: [
          { name: "example.com.", type: 2, TTL: 86400, data: "ns1.newhost.com." },
          { name: "example.com.", type: 2, TTL: 86400, data: "ns2.newhost.com." },
        ],
      })
    })

    const res = await checkNameserverDelegation("example.com")
    expect(res.isConsistent).toBe(false)
    expect(res.verdict).toBe("mismatch")
    expect(res.registryOnly).toEqual(["ns1.oldhost.com", "ns2.oldhost.com"])
    expect(res.liveOnly).toEqual(["ns1.newhost.com", "ns2.newhost.com"])
  })
})

describe("Subdomain Finder (Certificate Transparency)", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("parses, strips wildcards, and sorts unique subdomains", async () => {
    const mockIssuances = [
      { dns_names: ["api.example.com", "example.com", "*.admin.example.com"] },
      { dns_names: ["staging.example.com", "api.example.com", "*.example.com"] },
      { dns_names: ["otherdomain.com"] },
    ]

    globalThis.fetch = vi.fn().mockResolvedValue(makeMockJsonResponse(mockIssuances))

    const res = await findSubdomains("example.com")
    expect(res.totalCount).toBe(4)
    expect(res.subdomains).toEqual([
      "admin.example.com",
      "api.example.com",
      "example.com",
      "staging.example.com",
    ])
  })
})

describe("DNS Resolver Comparison", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("identifies matching records between Google and Cloudflare", async () => {
    globalThis.fetch = vi.fn().mockImplementation(async (url: string) => {
      const u = String(url)
      const isGoogle = u.includes("dns.google")
      return makeMockJsonResponse({
        Status: 0,
        AD: true,
        Answer: [
          { name: "example.com.", type: 1, TTL: isGoogle ? 300 : 250, data: "93.184.216.34" },
        ],
      })
    })

    const res = await compareResolvers("example.com", "A")
    expect(res.isIdentical).toBe(true)
    expect(res.ttlDifference).toBe(true)
    expect(res.google.status).toBe(0)
    expect(res.cloudflare.status).toBe(0)
    expect(res.google.answers[0].data).toBe("93.184.216.34")
    expect(res.cloudflare.answers[0].data).toBe("93.184.216.34")
  })
})
