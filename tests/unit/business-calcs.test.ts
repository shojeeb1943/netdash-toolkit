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

describe("server planning calculators", () => {
  it("raid: usable capacity and validation per level", () => {
    const s = "raid-capacity-calculator"
    expect(get(s, "Usable capacity (TB)", { level: 5, drives: 4, size: 4 })).toBe(12)
    expect(get(s, "Usable capacity (TB)", { level: 6, drives: 6, size: 4 })).toBe(16)
    expect(get(s, "Usable capacity (TB)", { level: 10, drives: 4, size: 4 })).toBe(8)
    expect(get(s, "Usable capacity (TB)", { level: 1, drives: 2, size: 4 })).toBe(4)
    expect(typeof runCalc(s, { level: 5, drives: 2, size: 4 })).toBe("string")
    expect(typeof runCalc(s, { level: 10, drives: 5, size: 4 })).toBe("string")
    expect(typeof runCalc(s, { level: 3, drives: 4, size: 4 })).toBe("string")
  })

  it("vps ram rounds up to a real plan size", () => {
    const s = "vps-ram-calculator"
    expect(
      get(s, "Plan size to buy (GB)", {
        sites: 20,
        perSite: 60,
        db: 1024,
        cache: 512,
        os: 600,
        headroom: 25,
      })
    ).toBe(8)
    expect(
      get(s, "Plan size to buy (GB)", {
        sites: 1,
        perSite: 10,
        db: 0,
        cache: 0,
        os: 100,
        headroom: 0,
      })
    ).toBe(1)
  })

  it("php workers: min of RAM and demand, and the RAM-limited warning", () => {
    const s = "php-worker-calculator"
    expect(
      get(s, "Workers the RAM allows", { ram: 4, perWorker: 64, cores: 4, reqMs: 100, rps: 10 })
    ).toBe(64)
    expect(
      get(s, "Workers the traffic needs", { ram: 4, perWorker: 64, cores: 4, reqMs: 100, rps: 10 })
    ).toBe(1)
    expect(
      String(get(s, "Status", { ram: 1, perWorker: 100, cores: 4, reqMs: 1000, rps: 50 }))
    ).toContain("RAM is the limit")
  })

  it("ram allocation, storage planner, swap", () => {
    expect(
      typeof runCalc("server-ram-allocation-calculator", {
        total: 32,
        os: 50,
        db: 40,
        php: 20,
        cache: 5,
      })
    ).toBe("string")
    expect(
      get("server-ram-allocation-calculator", "Unallocated (GB)", {
        total: 32,
        os: 10,
        db: 40,
        php: 40,
        cache: 10,
      })
    ).toBe(0)
    expect(
      get("server-storage-calculator", "Months until completely full", {
        used: 500,
        total: 1000,
        growth: 50,
        alarm: 80,
      })
    ).toBe(10)
    expect(get("swap-size-calculator", "Recommended swap (GB)", { ram: 8, hibernate: 0 })).toBe(8)
    expect(get("swap-size-calculator", "Recommended swap (GB)", { ram: 1, hibernate: 0 })).toBe(2)
    expect(get("swap-size-calculator", "Recommended swap (GB)", { ram: 128, hibernate: 0 })).toBe(4)
  })

  it("backups, inodes, disk", () => {
    expect(
      get("backup-rotation-calculator", "Storage needed (GB)", {
        size: 100,
        daily: 7,
        weekly: 4,
        monthly: 12,
        yearly: 1,
        dedupe: 50,
      })
    ).toBe(1200)
    expect(
      get("inode-usage-calculator", "Total inodes", {
        disk: 1,
        ratio: 16384,
        accounts: 1,
        files: 1,
      })
    ).toBe(65536)
    expect(
      typeof runCalc("disk-usage-calculator", {
        sites: 900,
        mail: 200,
        db: 0,
        logs: 0,
        backups: 0,
        other: 0,
        total: 1000,
      })
    ).toBe("string")
    const bw = "backup-bandwidth-calculator"
    expect(
      get(bw, "Speed needed for a full backup (Mbps)", {
        data: 100,
        change: 5,
        window: 1,
        link: 1000,
        eff: 100,
      })
    ).toBeCloseTo(222.22, 1)
    expect(
      get(bw, "Fits the window", { data: 100, change: 5, window: 1, link: 1000, eff: 100 })
    ).toBe("Yes, even a full backup")
  })

  it("mysql, redis, bandwidth, cpu", () => {
    expect(
      get("mysql-ram-calculator", "Worst case memory (GB)", {
        pool: 2,
        globals: 0,
        conns: 100,
        perConn: 10,
        active: 30,
      })
    ).toBeCloseTo(2 + 1000 / 1024, 5)
    expect(get("redis-ram-calculator", "Bytes per key all in", {})).toBe(404)
    expect(
      get("vps-cpu-calculator", "vCPU plan to buy", {
        visitors: 600,
        perMin: 10,
        ms: 100,
        target: 50,
      })
    ).toBe(20)
    expect(typeof runCalc("vps-cpu-calculator", { visitors: 1, perMin: 1, ms: 1, target: 0 })).toBe(
      "string"
    )
    expect(
      get("vps-bandwidth-calculator", "Transfer per month (GB)", {
        visitors: 1024,
        pages: 1,
        size: 1,
        peak: 10,
      })
    ).toBe(1)
  })
})

describe("batch 3 calculators", () => {
  it("licence calculators reuse the shared maths", () => {
    expect(get("plesk-license-calculator", "Monthly software cost", { price: 12, units: 3 })).toBe(
      36
    )
    expect(
      get("sitepad-license-calculator", "Annual software cost", {
        price: 10,
        units: 1,
        prepaid: 10,
      })
    ).toBe(108)
  })

  it("domain renewal compounds the yearly increase", () => {
    const s = "domain-renewal-cost-calculator"
    expect(
      get(s, "Total renewals per domain", { renew: 10, increase: 0, years: 5, domains: 1 })
    ).toBe(50)
    expect(
      get(s, "Total renewals per domain", { renew: 100, increase: 10, years: 2, domains: 1 })
    ).toBeCloseTo(210, 5)
    expect(typeof runCalc(s, { renew: 10, increase: 5, years: 0, domains: 1 })).toBe("string")
  })

  it("domain profit subtracts renewals after the first year and the fee", () => {
    const s = "domain-profit-calculator"
    // cost = 10 + 2 * 10 = 30 ; proceeds = 200 * 0.9 = 180 ; profit 150
    expect(get(s, "Profit", { buy: 10, sell: 200, renew: 10, years: 3, fee: 10 })).toBe(150)
  })

  it("portfolio: holding cost and expected net", () => {
    const s = "domain-portfolio-value-calculator"
    expect(
      get(s, "Holding cost per year", { count: 100, renew: 10, price: 500, sell: 2, fee: 20 })
    ).toBe(1000)
    // 2 sold * 500 * 0.8 = 800 revenue, net -200
    expect(
      get(s, "Expected net per year", { count: 100, renew: 10, price: 500, sell: 2, fee: 20 })
    ).toBe(-200)
  })
})
