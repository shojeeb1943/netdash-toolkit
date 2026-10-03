import { describe, expect, it } from "vitest"
import { calcDefs, formatDuration, runCalc } from "@/lib/business-calcs"
import { tools } from "@/lib/tool-registry"

const defaults = (slug: string) =>
  Object.fromEntries(calcDefs[slug].fields.map((f) => [f.id, f.value]))

const get = (slug: string, label: string, over: Record<string, number> = {}) => {
  const out = runCalc(slug, { ...defaults(slug), ...over })
  if (typeof out === "string") throw new Error(out)
  return out.find((o) => o.label === label)!.value
}

describe("business calculators", () => {
  it("every definition is registered as a tool", () => {
    for (const slug of Object.keys(calcDefs)) {
      expect(
        tools.some((t) => t.slug === slug),
        slug
      ).toBe(true)
      expect(Array.isArray(runCalc(slug, defaults(slug))), slug).toBe(true)
    }
  })

  it("break-even rounds up and rejects a loss-making price", () => {
    const s = "hosting-break-even-calculator"
    expect(get(s, "Customers needed to break even", { fixed: 100, price: 10, variable: 5 })).toBe(
      20
    )
    expect(get(s, "Customers needed to break even", { fixed: 101, price: 10, variable: 5 })).toBe(
      21
    )
    expect(typeof runCalc(s, { fixed: 1, price: 5, variable: 5 })).toBe("string")
  })

  it("license stack sums per-server licenses and shares WHMCS", () => {
    const s = "server-license-stack-calculator"
    const v = { cpanel: 10, cloudlinux: 5, servers: 2, whmcs: 20, accounts: 100 }
    expect(get(s, "Monthly software cost", v)).toBe(50)
    expect(get(s, "Cost per account / month", v)).toBe(0.25)
  })

  it("rejects negative or blank input instead of guessing", () => {
    expect(
      typeof runCalc("vps-cost-calculator", { ...defaults("vps-cost-calculator"), ram: -1 })
    ).toBe("string")
    expect(
      typeof runCalc("vps-cost-calculator", { ...defaults("vps-cost-calculator"), ram: NaN })
    ).toBe("string")
  })

  it("migration time and durations", () => {
    expect(formatDuration(1.5)).toBe("1h 30m")
    // 100 GB over 100 Mbps at 100% = 8000s
    expect(
      get("migration-time-calculator", "Data transfer time", { data: 100, mbps: 100, eff: 100 })
    ).toBe("2h 13m")
  })
})
