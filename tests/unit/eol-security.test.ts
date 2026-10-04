import { describe, expect, it, vi, beforeEach } from "vitest"
import { computeLifecycleStatus, parseDate, type EolCycle } from "@/lib/eol"
import { searchCves } from "@/lib/cve"
import { checkPwnedPassword, sha1Hex } from "@/lib/pwned"

describe("EOL Lifecycle calculations", () => {
  it("parses valid dates and rejects invalid ones", () => {
    expect(parseDate("2026-10-01")?.toISOString().slice(0, 10)).toBe("2026-10-01")
    expect(parseDate(false)).toBeNull()
    expect(parseDate(undefined)).toBeNull()
    expect(parseDate("invalid-date")).toBeNull()
  })

  it("calculates active support status when today is before support end", () => {
    const cycle: EolCycle = {
      cycle: "8.3",
      releaseDate: "2023-11-23",
      support: "2025-12-31",
      eol: "2026-12-31",
      latest: "8.3.12",
      lts: false,
    }
    const targetDate = new Date("2024-06-01T00:00:00Z")
    const verdict = computeLifecycleStatus(cycle, targetDate)
    expect(verdict.status).toBe("supported")
    expect(verdict.statusLabel).toBe("Active Support")
    expect(verdict.daysUntilEol).toBeGreaterThan(0)
    expect(verdict.isLts).toBe(false)
  })

  it("calculates security-only status when active support passed but EOL is in future", () => {
    const cycle: EolCycle = {
      cycle: "8.1",
      releaseDate: "2021-11-25",
      support: "2023-11-25",
      eol: "2025-12-31",
      latest: "8.1.30",
      lts: false,
    }
    const targetDate = new Date("2024-06-01T00:00:00Z")
    const verdict = computeLifecycleStatus(cycle, targetDate)
    expect(verdict.status).toBe("security-only")
    expect(verdict.statusLabel).toBe("Security Fixes Only")
    expect(verdict.daysUntilEol).toBeGreaterThan(0)
  })

  it("calculates EOL status when EOL date has passed", () => {
    const cycle: EolCycle = {
      cycle: "7.4",
      releaseDate: "2019-11-28",
      support: "2021-11-28",
      eol: "2022-11-28",
      latest: "7.4.33",
      lts: false,
    }
    const targetDate = new Date("2024-06-01T00:00:00Z")
    const verdict = computeLifecycleStatus(cycle, targetDate)
    expect(verdict.status).toBe("eol")
    expect(verdict.statusLabel).toBe("End of Life")
    expect(verdict.daysUntilEol).toBeLessThan(0)
  })

  it("handles boolean eol flag true", () => {
    const cycle: EolCycle = {
      cycle: "5.6",
      releaseDate: "2014-08-28",
      eol: true,
      latest: "5.6.40",
      lts: false,
    }
    const verdict = computeLifecycleStatus(cycle)
    expect(verdict.status).toBe("eol")
    expect(verdict.statusLabel).toBe("End of Life")
  })
})

describe("CVE Search parser", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("rejects empty keywords", async () => {
    await expect(searchCves("   ")).rejects.toThrow("Please enter a software keyword")
  })

  it("parses NVD response with CVSS v3.1 metrics", async () => {
    const mockNvd = {
      resultsPerPage: 1,
      startIndex: 0,
      totalResults: 1,
      format: "NVD_CVE",
      version: "2.0",
      timestamp: "2026-10-04T00:00:00.000",
      vulnerabilities: [
        {
          cve: {
            id: "CVE-2023-3824",
            published: "2023-08-11T00:00:00.000",
            lastModified: "2023-08-15T00:00:00.000",
            descriptions: [{ lang: "en", value: "Buffer overflow in PHP phar processing." }],
            metrics: {
              cvssMetricV31: [
                {
                  cvssData: {
                    baseScore: 9.8,
                    baseSeverity: "CRITICAL",
                  },
                },
              ],
            },
          },
        },
      ],
    }

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockNvd,
      headers: new Headers({ "content-type": "application/json" }),
    } as unknown as Response)

    const result = await searchCves("php")
    expect(result.total).toBe(1)
    expect(result.items[0].id).toBe("CVE-2023-3824")
    expect(result.items[0].score).toBe(9.8)
    expect(result.items[0].severity).toBe("CRITICAL")
    expect(result.items[0].description).toBe("Buffer overflow in PHP phar processing.")
    // link checked in ui
  })
})

describe("Pwned Password checker", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("hashes password correctly with SHA-1", async () => {
    // SHA-1 of "password" is 5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8
    const hash = await sha1Hex("password")
    expect(hash).toBe("5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8")
  })

  it("finds matching suffix and returns breach count", async () => {
    // "password" -> prefix 5BAA6, suffix 1E4C9B93F3F0682250B6CF8331B7EE68FD8
    const mockRangeBody =
      "0018A45C4D1def81644B54AB7F969B88D65:1\r\n1E4C9B93F3F0682250B6CF8331B7EE68FD8:3861493\r\n00D4F6E8F6C:2"

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => mockRangeBody,
      headers: new Headers({ "content-type": "text/plain" }),
    } as unknown as Response)

    const res = await checkPwnedPassword("password")
    expect(res.pwned).toBe(true)
    expect(res.count).toBe(3861493)
    expect(res.prefix).toBe("5BAA6")
  })

  it("returns pwned: false when suffix is not in range response", async () => {
    const mockRangeBody = "0018A45C4D1DEF81644B54AB7F969B88D65:1\r\n00D4F6E8F6C:2"

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => mockRangeBody,
      headers: new Headers({ "content-type": "text/plain" }),
    } as unknown as Response)

    const res = await checkPwnedPassword("password")
    expect(res.pwned).toBe(false)
    expect(res.count).toBe(0)
  })
})
