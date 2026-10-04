import { describe, expect, it, vi, beforeEach } from "vitest"
import {
  fetchExchangeRates,
  convertAmount,
  LICENSE_TIERS,
  COMMON_CURRENCIES,
  type ExchangeRateData,
} from "@/lib/currency-rates"
import { tools } from "@/lib/tool-registry"

describe("Currency Rates & Converter Logic", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("checks tools array for undefined", () => {
    tools.forEach((t, i) => {
      if (!t) {
        console.log("UNDEFINED TOOL AT INDEX", i, "out of", tools.length)
      }
    })
    expect(tools.every((t) => Boolean(t && t.slug))).toBe(true)
  })

  it("defines standard license tiers with accurate monthly prices", () => {
    const cpanelVps = LICENSE_TIERS.find((t) => t.id === "cpanel-vps")
    expect(cpanelVps).toBeDefined()
    expect(cpanelVps?.monthlyUsd).toBe(4.0)

    const cpanelDedi = LICENSE_TIERS.find((t) => t.id === "cpanel-dedi")
    expect(cpanelDedi).toBeDefined()
    expect(cpanelDedi?.monthlyUsd).toBe(8.0)

    const litespeed2c = LICENSE_TIERS.find((t) => t.id === "litespeed-2c")
    expect(litespeed2c?.monthlyUsd).toBe(4.0)

    const whmcsOwned = LICENSE_TIERS.find((t) => t.id === "whmcs-owned")
    expect(whmcsOwned?.isOneTime).toBe(true)
    expect(whmcsOwned?.monthlyUsd).toBe(20.0)
  })

  it("includes required common currencies", () => {
    const codes = COMMON_CURRENCIES.map((c) => c.code)
    expect(codes).toContain("USD")
    expect(codes).toContain("BDT")
    expect(codes).toContain("EUR")
    expect(codes).toContain("GBP")
    expect(codes).toContain("INR")
  })

  it("converts amounts correctly based on exchange rates", () => {
    const rates: Record<string, number> = {
      USD: 1,
      EUR: 0.9,
      BDT: 120,
      INR: 85,
    }

    // Direct conversion from USD
    const usdToBdt = convertAmount(10, "USD", "BDT", rates, "USD")
    expect(usdToBdt.converted).toBe(1200)
    expect(usdToBdt.rate).toBe(120)

    // Direct conversion to USD
    const bdtToUsd = convertAmount(1200, "BDT", "USD", rates, "USD")
    expect(bdtToUsd.converted).toBe(10)
    expect(bdtToUsd.rate).toBeCloseTo(1 / 120, 5)

    // Cross-rate conversion: EUR to BDT
    const eurToBdt = convertAmount(9, "EUR", "BDT", rates, "USD")
    // 9 EUR = 10 USD = 1200 BDT
    expect(eurToBdt.converted).toBeCloseTo(1200, 2)

    // Same currency conversion
    const same = convertAmount(50, "USD", "USD", rates, "USD")
    expect(same.converted).toBe(50)
    expect(same.rate).toBe(1)
  })

  it("handles zero and invalid amounts gracefully", () => {
    const rates: Record<string, number> = { USD: 1, BDT: 120 }
    expect(convertAmount(0, "USD", "BDT", rates).converted).toBe(0)
    expect(convertAmount(-10, "USD", "BDT", rates).converted).toBe(0)
    expect(convertAmount(NaN, "USD", "BDT", rates).converted).toBe(0)
  })

  it("fetches and parses live exchange rates from API", async () => {
    const mockData: ExchangeRateData = {
      result: "success",
      time_last_update_unix: 1728000000,
      time_last_update_utc: "Sun, 04 Oct 2026 00:00:00 +0000",
      base_code: "USD",
      rates: {
        USD: 1,
        BDT: 122.5,
        EUR: 0.92,
      },
    }

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => mockData,
    } as unknown as Response)

    const data = await fetchExchangeRates("USD")
    expect(data.result).toBe("success")
    expect(data.rates.BDT).toBe(122.5)
  })
})
