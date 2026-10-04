import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { isDomain, isIp, isIpv4, isIpv6, isAsn, cleanAsn, isCidr } from "@/lib/validators"
import { getCached, setCached } from "@/lib/api-cache"
import { apiFetch } from "@/lib/api-fetch"
import { resolve, reverseDnsName } from "@/lib/doh"
import {
  getAsOverview,
  getAnnouncedPrefixes,
  getNetworkInfo,
  getAbuseContact,
} from "@/lib/ripestat"
import { getIpGeo } from "@/lib/ipwhois"
import { checkWebsiteHosting } from "@/lib/hosting-intel"

describe("validators", () => {
  it("validates domain names", () => {
    expect(isDomain("example.com")).toBe(true)
    expect(isDomain("sub.domain.co.uk")).toBe(true)
    expect(isDomain("invalid_domain")).toBe(false)
    expect(isDomain("")).toBe(false)
  })

  it("validates IP addresses", () => {
    expect(isIpv4("192.0.2.1")).toBe(true)
    expect(isIpv4("999.0.2.1")).toBe(false)
    expect(isIpv6("2001:db8::1")).toBe(true)
    expect(isIpv6("invalid")).toBe(false)
    expect(isIp("1.1.1.1")).toBe(true)
    expect(isIp("2606:4700:4700::1111")).toBe(true)
    expect(isIp("not-an-ip")).toBe(false)
  })

  it("validates and cleans ASNs", () => {
    expect(isAsn("13335")).toBe(true)
    expect(isAsn("AS13335")).toBe(true)
    expect(isAsn("as15169")).toBe(true)
    expect(isAsn("invalid")).toBe(false)
    expect(cleanAsn("AS13335")).toBe("13335")
    expect(cleanAsn("as15169")).toBe("15169")
  })

  it("validates CIDR blocks", () => {
    expect(isCidr("192.0.2.0/24")).toBe(true)
    expect(isCidr("2001:db8::/32")).toBe(true)
    expect(isCidr("192.0.2.0/35")).toBe(false)
  })
})

describe("api-cache", () => {
  const store = new Map<string, string>()
  const mockStorage: Storage = {
    length: 0,
    key: () => null,
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => {
      store.set(k, v)
    },
    removeItem: (k: string) => {
      store.delete(k)
    },
    clear: () => {
      store.clear()
    },
  }

  beforeEach(() => {
    store.clear()
    vi.stubGlobal("localStorage", mockStorage)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("stores and retrieves cached items", () => {
    setCached("test_key", { hello: "world" }, 5000)
    expect(getCached("test_key")).toEqual({ hello: "world" })
  })

  it("returns null on expired items", () => {
    setCached("expired_key", "old", -1000)
    expect(getCached("expired_key")).toBeNull()
  })
})

describe("api-fetch error mapping", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("maps 429 to friendly rate limit error", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 429,
      headers: new Headers(),
    } as Response)
    await expect(apiFetch("https://api.example.com")).rejects.toThrow(
      "rate limited, try again in a minute"
    )
  })

  it("maps 404 to not found error", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
      headers: new Headers(),
    } as Response)
    await expect(apiFetch("https://api.example.com")).rejects.toThrow("not found")
  })

  it("maps 503 to service unavailable error", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 503,
      headers: new Headers(),
    } as Response)
    await expect(apiFetch("https://api.example.com")).rejects.toThrow("service unavailable")
  })
})

describe("DoH resolver", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("queries Google DoH endpoint", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        Status: 0,
        Answer: [{ name: "example.com.", type: 1, TTL: 300, data: "93.184.216.34" }],
      }),
    } as unknown as Response)

    const res = await resolve("example.com", "A", "google")
    expect(res.Status).toBe(0)
    expect(res.Answer?.[0].data).toBe("93.184.216.34")
  })

  it("constructs reverse DNS PTR names", () => {
    expect(reverseDnsName("8.8.4.4")).toBe("4.4.8.8.in-addr.arpa")
  })
})

describe("RIPEstat and IP geolocation", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("fetches AS overview and announced prefixes", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        data: {
          resource: "13335",
          holder: "CLOUDFLARENET",
          announced: true,
        },
      }),
    } as unknown as Response)

    const res = await getAsOverview("13335")
    expect(res.holder).toBe("CLOUDFLARENET")
    expect(res.announced).toBe(true)

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        data: {
          resource: "13335",
          prefixes: [{ prefix: "1.1.1.0/24", timelines: [] }],
        },
      }),
    } as unknown as Response)

    const pref = await getAnnouncedPrefixes("13335")
    expect(pref.prefixes).toHaveLength(1)
  })

  it("fetches network info and abuse contacts", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        data: {
          prefix: "1.1.1.0/24",
          asns: ["AS13335"],
          holder: "Cloudflare",
        },
      }),
    } as unknown as Response)

    const net = await getNetworkInfo("1.1.1.1")
    expect(net.holder).toBe("Cloudflare")

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        data: {
          abuse_contacts: ["abuse@cloudflare.com"],
          authorities: ["apnic"],
        },
      }),
    } as unknown as Response)

    const abuse = await getAbuseContact("1.1.1.1")
    expect(abuse.abuse_contacts).toContain("abuse@cloudflare.com")
  })

  it("fetches IP geolocation with ipwho.is", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        ip: "8.8.8.8",
        success: true,
        country: "United States",
        city: "Mountain View",
      }),
    } as unknown as Response)

    const res = await getIpGeo("8.8.8.8")
    expect(res.ip).toBe("8.8.8.8")
    expect(res.country).toBe("United States")
  })
})

describe("website hosting checker", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("identifies Cloudflare CDN fronted websites", async () => {
    // 1. A record response
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        Status: 0,
        Answer: [{ name: "example.com.", type: 1, TTL: 300, data: "104.16.1.1" }],
      }),
    } as unknown as Response)
    // 2. AAAA response
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ Status: 0, Answer: [] }),
    } as unknown as Response)
    // 3. NS response
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        Status: 0,
        Answer: [{ name: "example.com.", type: 2, TTL: 300, data: "ns1.cloudflare.com." }],
      }),
    } as unknown as Response)
    // 4. PTR response
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ Status: 0, Answer: [] }),
    } as unknown as Response)
    // 5. Network info response
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        data: {
          prefix: "104.16.0.0/12",
          asns: ["AS13335"],
          holder: "Cloudflare, Inc.",
        },
      }),
    } as unknown as Response)
    // 6. AS overview response
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        data: {
          resource: "13335",
          holder: "Cloudflare, Inc.",
          announced: true,
        },
      }),
    } as unknown as Response)

    const res = await checkWebsiteHosting("example.com")
    expect(res.domain).toBe("example.com")
    expect(res.asn).toBe(13335)
    expect(res.isCdnFronted).toBe(true)
    expect(res.likelyHost).toBe("Cloudflare")
  })
})
