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

describe("hosting business calculators", () => {
  it("churn: lifetime is the inverse of churn and impossible losses are rejected", () => {
    const s = "customer-churn-calculator"
    expect(get(s, "Churn rate", { start: 500, lost: 25 })).toBe(5)
    expect(get(s, "Average customer lifetime (months)", { start: 500, lost: 25 })).toBe(20)
    expect(typeof runCalc(s, { start: 10, lost: 11, added: 0 })).toBe("string")
  })

  it("ltv and ltv:cac follow margin / churn", () => {
    expect(
      get("hosting-ltv-calculator", "Customer lifetime value", { arpu: 10, margin: 50, churn: 5 })
    ).toBe(100)
    expect(typeof runCalc("hosting-ltv-calculator", { arpu: 10, margin: 50, churn: 0 })).toBe(
      "string"
    )
    const s = "hosting-ltv-cac-calculator"
    expect(get(s, "LTV : CAC ratio", { arpu: 10, margin: 50, churn: 5, cac: 20 })).toBe(5)
    expect(get(s, "Verdict", { arpu: 10, margin: 50, churn: 5, cac: 20 })).toBe("Healthy")
    expect(get(s, "Verdict", { arpu: 10, margin: 50, churn: 5, cac: 200 })).toBe(
      "Losing money per customer"
    )
  })

  it("markup is not margin", () => {
    const s = "hosting-markup-calculator"
    expect(get(s, "Selling price", { cost: 4, markup: 100 })).toBe(8)
    expect(get(s, "Margin", { cost: 4, markup: 100 })).toBe(50)
  })

  it("pricing calculators keep the target margin after fees", () => {
    // price 100 -> fee 3 + margin 55 + cost 42 : (1 + 0.4) / (1 - 0.55 - 0.03) = 3.333
    const price = get("reseller-pricing-calculator", "Monthly price to charge", {
      cost: 1,
      support: 0.4,
      fee: 3,
      margin: 55,
    }) as number
    expect(price).toBeCloseTo(1.4 / 0.42, 5)
    expect(
      typeof runCalc("reseller-pricing-calculator", { cost: 1, support: 1, fee: 50, margin: 50 })
    ).toBe("string")
    expect(
      get("vps-pricing-calculator", "Cost per VPS", {
        node: 300,
        count: 20,
        overhead: 1.5,
        margin: 40,
      })
    ).toBe(16.5)
  })

  it("discount, annual and break-even maths", () => {
    expect(
      get("hosting-discount-calculator", "Total over the term", {
        price: 10,
        discount: 50,
        months: 12,
        term: 24,
      })
    ).toBe(180)
    expect(
      get("monthly-to-annual-hosting-calculator", "Yearly plan price", { monthly: 8, paid: 10 })
    ).toBe(80)
    expect(
      get("server-break-even-calculator", "Accounts to break even", {
        server: 150,
        price: 6,
        variable: 0.5,
      })
    ).toBe(28)
    expect(
      get("server-break-even-calculator", "Verdict", {
        server: 150,
        capacity: 10,
        price: 6,
        variable: 0.5,
      })
    ).toBe("Not reachable on this server")
    expect(
      typeof runCalc("vps-profit-calculator", {
        nodeCost: 1,
        capacity: 5,
        sold: 6,
        price: 1,
        support: 0,
      })
    ).toBe("string")
  })

  it("utilization names the tightest resource and the status", () => {
    const s = "server-utilization-calculator"
    expect(
      get(s, "Tightest resource", {
        cpuUsed: 1,
        cpuTotal: 16,
        ramUsed: 60,
        ramTotal: 64,
        diskUsed: 1,
        diskTotal: 1000,
      })
    ).toBe("RAM")
    expect(
      get(s, "Status", {
        cpuUsed: 1,
        cpuTotal: 16,
        ramUsed: 60,
        ramTotal: 64,
        diskUsed: 1,
        diskTotal: 1000,
      })
    ).toBe("Add capacity now")
  })

  it("mrr, arr, occupancy, roi", () => {
    expect(
      get("hosting-mrr-calculator", "Ending MRR", {
        start: 1000,
        newMrr: 100,
        expansion: 50,
        contraction: 10,
        churned: 40,
      })
    ).toBe(1100)
    expect(
      get("hosting-arr-calculator", "ARR", { monthly: 1000, annualPlans: 10, annualPrice: 100 })
    ).toBe(13000)
    expect(
      get("hosting-occupancy-rate-calculator", "Unused revenue potential", {
        sold: 70,
        capacity: 100,
        price: 6,
      })
    ).toBe(180)
    expect(
      get("hosting-business-roi-calculator", "Net profit over the period", {
        invest: 1000,
        revenue: 300,
        cost: 100,
        months: 10,
      })
    ).toBe(1000)
    expect(
      get("server-roi-calculator", "Payback (months)", {
        price: 1200,
        colo: 100,
        revenue: 200,
        years: 2,
        resale: 0,
      })
    ).toBe(12)
  })
})
