// data-driven hosting and licensing calculators: a definition is its inputs plus one pure compute().
// every figure comes from what the user types; no prices are stored anywhere.

export interface CalcField {
  id: string
  label: string
  value: number
  suffix?: string
  min?: number
  step?: number
}

export type OutKind = "money" | "number" | "percent" | "text"

export interface CalcOutput {
  label: string
  value: number | string
  kind: OutKind
  strong?: boolean
}

export interface CalcDef {
  fields: CalcField[]
  note?: string
  /** returns outputs, or an error message when the inputs cannot produce an answer */
  compute: (v: Record<string, number>) => CalcOutput[] | string
}

const money = (label: string, value: number, strong = false): CalcOutput => ({
  label,
  value,
  kind: "money",
  strong,
})
const num = (label: string, value: number, strong = false): CalcOutput => ({
  label,
  value,
  kind: "number",
  strong,
})
const pct = (label: string, value: number): CalcOutput => ({ label, value, kind: "percent" })
const text = (label: string, value: string, strong = false): CalcOutput => ({
  label,
  value,
  kind: "text",
  strong,
})

const f = (id: string, label: string, value: number, suffix?: string, step = 1): CalcField => ({
  id,
  label,
  value,
  suffix,
  step,
  min: 0,
})

export function formatDuration(hours: number): string {
  if (!Number.isFinite(hours)) return "n/a"
  const totalMinutes = Math.round(hours * 60)
  const d = Math.floor(totalMinutes / 1440)
  const h = Math.floor((totalMinutes % 1440) / 60)
  const m = totalMinutes % 60
  return [d && `${d}d`, (d || h) && `${h}h`, `${m}m`].filter(Boolean).join(" ")
}

export function formatValue(out: CalcOutput): string {
  if (typeof out.value === "string") return out.value
  if (!Number.isFinite(out.value)) return "n/a"
  if (out.kind === "money")
    return out.value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    })
  if (out.kind === "percent") return `${out.value.toFixed(1)}%`
  return out.value.toLocaleString("en-US", { maximumFractionDigits: 2 })
}

const HOURS_PER_MONTH = 730

// one license: monthly price per unit, how many units, and how many hosting accounts share them
function licenseDef(name: string, unit: string): CalcDef {
  return {
    note: `Enter the price you actually pay for ${name}. Nothing here is a stored price list.`,
    fields: [
      f("price", `${name} price per ${unit}`, 10, "USD / month", 0.01),
      f("units", `Number of ${unit}s`, 1, unit + "s"),
      f("accounts", "Hosting accounts per " + unit, 100, "accounts"),
      f("prepaid", "Discount for paying yearly", 0, "%"),
    ],
    compute: (v) => {
      if (v.units < 1) return "Enter at least one " + unit + "."
      const monthly = v.price * v.units
      const annual = monthly * 12 * (1 - v.prepaid / 100)
      return [
        money("Monthly software cost", monthly, true),
        money("Annual software cost", annual, true),
        money("Cost per " + unit + " / month", v.price),
        v.accounts > 0
          ? money("Cost per account / month", v.price / v.accounts)
          : text("Cost per account / month", "Enter accounts per " + unit),
      ]
    },
  }
}

const STACK = ["cPanel", "CloudLinux", "LiteSpeed", "JetBackup", "Softaculous", "Imunify360"]

export const calcDefs: Record<string, CalcDef> = {
  "hosting-cost-calculator": {
    fields: [
      f("servers", "Servers", 1, "servers"),
      f("serverCost", "Server cost each", 150, "USD / month"),
      f("licenses", "Software licenses (total)", 40, "USD / month"),
      f("network", "Bandwidth, IPs and other", 20, "USD / month"),
      f("staff", "Support and staff share", 0, "USD / month"),
      f("accounts", "Hosting accounts", 100, "accounts"),
    ],
    compute: (v) => {
      const monthly = v.servers * v.serverCost + v.licenses + v.network + v.staff
      return [
        money("Total monthly cost", monthly, true),
        money("Total annual cost", monthly * 12, true),
        money("Cost per server / month", v.servers > 0 ? monthly / v.servers : NaN),
        v.accounts > 0
          ? money("Cost per account / month", monthly / v.accounts)
          : text("Cost per account / month", "Enter accounts"),
      ]
    },
  },
  "vps-cost-calculator": {
    fields: [
      f("cores", "vCPU cores", 4, "cores"),
      f("coreCost", "Price per core", 4, "USD / month", 0.01),
      f("ram", "RAM", 8, "GB"),
      f("ramCost", "Price per GB RAM", 2, "USD / month", 0.01),
      f("disk", "Storage", 160, "GB"),
      f("diskCost", "Price per GB storage", 0.05, "USD / month", 0.01),
      f("tb", "Bandwidth", 2, "TB"),
      f("tbCost", "Price per TB", 1, "USD / month", 0.01),
      f("license", "Control panel and OS license", 0, "USD / month", 0.01),
    ],
    compute: (v) => {
      const monthly =
        v.cores * v.coreCost + v.ram * v.ramCost + v.disk * v.diskCost + v.tb * v.tbCost + v.license
      return [
        money("Monthly cost", monthly, true),
        money("Annual cost", monthly * 12, true),
        money("Hourly cost (730 h month)", monthly / HOURS_PER_MONTH),
      ]
    },
  },
  "hosting-profit-calculator": {
    fields: [
      f("customers", "Paying customers", 50, "customers"),
      f("price", "Average price per customer", 8, "USD / month", 0.01),
      f("cost", "Direct cost per customer", 2, "USD / month", 0.01),
      f("fixed", "Fixed monthly costs", 150, "USD / month"),
    ],
    compute: (v) => {
      const revenue = v.customers * v.price
      const profit = revenue - v.customers * v.cost - v.fixed
      return [
        money("Monthly revenue", revenue),
        money("Monthly profit", profit, true),
        money("Annual profit", profit * 12, true),
        revenue > 0 ? pct("Profit margin", (profit / revenue) * 100) : text("Profit margin", "n/a"),
      ]
    },
  },
  "hosting-break-even-calculator": {
    fields: [
      f("fixed", "Fixed monthly costs", 300, "USD / month"),
      f("price", "Price per customer", 8, "USD / month", 0.01),
      f("variable", "Variable cost per customer", 1.5, "USD / month", 0.01),
    ],
    compute: (v) => {
      const margin = v.price - v.variable
      if (margin <= 0) return "Price must be higher than the variable cost per customer."
      const customers = Math.ceil(v.fixed / margin)
      return [
        num("Customers needed to break even", customers, true),
        money("Revenue at break-even / month", customers * v.price),
        money("Contribution per customer", margin),
      ]
    },
  },
  "server-capacity-calculator": {
    fields: [
      f("ram", "Server RAM", 64, "GB"),
      f("ramReserved", "RAM reserved for OS and services", 8, "GB"),
      f("ramPer", "RAM per account", 512, "MB"),
      f("disk", "Server storage", 1000, "GB"),
      f("diskReserved", "Storage reserved (OS, backups)", 200, "GB"),
      f("diskPer", "Storage per account", 5, "GB", 0.5),
      f("cores", "CPU cores", 16, "cores"),
      f("perCore", "Accounts per core", 25, "accounts"),
    ],
    compute: (v) => {
      if (v.ramPer <= 0 || v.diskPer <= 0 || v.perCore <= 0)
        return "Per-account figures must be above zero."
      const byRam = Math.floor(((v.ram - v.ramReserved) * 1024) / v.ramPer)
      const byDisk = Math.floor((v.disk - v.diskReserved) / v.diskPer)
      const byCpu = Math.floor(v.cores * v.perCore)
      const limits: [string, number][] = [
        ["RAM", byRam],
        ["Storage", byDisk],
        ["CPU", byCpu],
      ]
      const [limit, cap] = limits.reduce((a, b) => (b[1] < a[1] ? b : a))
      return [
        num("Accounts by RAM", Math.max(0, byRam)),
        num("Accounts by storage", Math.max(0, byDisk)),
        num("Accounts by CPU", Math.max(0, byCpu)),
        num("Safe capacity", Math.max(0, cap), true),
        text("Limiting resource", limit, true),
      ]
    },
  },
  "backup-storage-calculator": {
    fields: [
      f("data", "Data to protect", 500, "GB"),
      f("change", "Daily change rate", 3, "%", 0.1),
      f("days", "Retention", 30, "days"),
      f("fullEvery", "Full backup every", 7, "days"),
      f("compress", "Compression saving", 30, "%"),
    ],
    compute: (v) => {
      if (v.fullEvery < 1) return "Full backup interval must be at least 1 day."
      const fulls = Math.max(1, Math.ceil(v.days / v.fullEvery))
      const incrementals = Math.max(0, v.days - fulls)
      const raw = fulls * v.data + incrementals * v.data * (v.change / 100)
      const total = raw * (1 - v.compress / 100)
      return [
        num("Full backups kept", fulls),
        num("Incremental backups kept", incrementals),
        num("Storage needed (GB)", total, true),
        num("Storage needed (TB)", total / 1000),
      ]
    },
  },
  "backup-retention-calculator": {
    fields: [
      f("daily", "Daily backups kept", 7, "backups"),
      f("weekly", "Weekly backups kept", 4, "backups"),
      f("monthly", "Monthly backups kept", 6, "backups"),
      f("size", "Average backup size", 50, "GB"),
      f("gbCost", "Storage price", 0.01, "USD / GB / month", 0.001),
    ],
    compute: (v) => {
      const count = v.daily + v.weekly + v.monthly
      const gb = count * v.size
      return [
        num("Restore points kept", count),
        num("Storage needed (GB)", gb, true),
        money("Storage cost / month", gb * v.gbCost, true),
        text(
          "Oldest restore point",
          `about ${Math.max(v.daily, v.weekly * 7, v.monthly * 30)} days`
        ),
      ]
    },
  },
  "migration-time-calculator": {
    fields: [
      f("data", "Data to move", 200, "GB"),
      f("mbps", "Link speed", 100, "Mbps"),
      f("eff", "Real-world efficiency", 70, "%"),
      f("accounts", "Accounts to migrate", 50, "accounts"),
      f("perAccount", "Manual checks per account", 5, "minutes"),
    ],
    compute: (v) => {
      if (v.mbps <= 0 || v.eff <= 0) return "Link speed and efficiency must be above zero."
      const transferH = (v.data * 8000) / (v.mbps * (v.eff / 100)) / 3600
      const manualH = (v.accounts * v.perAccount) / 60
      return [
        text("Data transfer time", formatDuration(transferH)),
        text("Verification time", formatDuration(manualH)),
        text("Total migration window", formatDuration(transferH + manualH), true),
      ]
    },
  },
  "bandwidth-cost-calculator": {
    fields: [
      f("tb", "Monthly transfer", 12, "TB", 0.1),
      f("included", "Included transfer", 10, "TB", 0.1),
      f("base", "Base plan price", 40, "USD / month", 0.01),
      f("overage", "Overage price", 2, "USD / TB", 0.01),
    ],
    compute: (v) => {
      const over = Math.max(0, v.tb - v.included)
      const total = v.base + over * v.overage
      return [
        num("Overage transfer (TB)", over),
        money("Total monthly cost", total, true),
        v.tb > 0
          ? money("Effective price per TB", total / v.tb)
          : text("Effective price per TB", "n/a"),
      ]
    },
  },
  "hosting-package-pricing-calculator": {
    fields: [
      f("server", "Server cost", 150, "USD / month"),
      f("accounts", "Accounts per server", 100, "accounts"),
      f("license", "License cost per account", 0.3, "USD / month", 0.01),
      f("support", "Support cost per account", 0.5, "USD / month", 0.01),
      f("margin", "Target profit margin", 50, "%"),
      f("yearly", "Yearly plan discount", 15, "%"),
    ],
    compute: (v) => {
      if (v.accounts < 1) return "Enter at least one account per server."
      if (v.margin >= 100) return "Margin must be below 100%."
      const cost = v.server / v.accounts + v.license + v.support
      const price = cost / (1 - v.margin / 100)
      return [
        money("Cost per account / month", cost),
        money("Recommended monthly price", price, true),
        money("Yearly plan price", price * 12 * (1 - v.yearly / 100), true),
        pct("Markup on cost", cost > 0 ? ((price - cost) / cost) * 100 : NaN),
      ]
    },
  },

  "domain-cost-calculator": {
    note: "Registration is often discounted for the first year; the renewal price is what you pay every year after.",
    fields: [
      f("reg", "First-year registration price", 10, "USD", 0.01),
      f("renew", "Renewal price per year", 15, "USD", 0.01),
      f("years", "Years you will hold the domain", 5, "years"),
      f("privacy", "WHOIS privacy per year", 0, "USD", 0.01),
      f("domains", "Number of domains", 1, "domains"),
    ],
    compute: (v) => {
      if (v.years < 1) return "Hold the domain for at least 1 year."
      const one = v.reg + v.renew * (v.years - 1) + v.privacy * v.years
      return [
        money("Total cost per domain", one, true),
        money("Total for all domains", one * v.domains, true),
        money("Average per year (per domain)", one / v.years),
        money("Renewal-year cost (per domain)", v.renew + v.privacy),
      ]
    },
  },
  "cpanel-license-calculator": licenseDef("cPanel", "server"),
  "cloudlinux-license-calculator": licenseDef("CloudLinux", "server"),
  "litespeed-license-calculator": licenseDef("LiteSpeed", "server"),
  "whmcs-license-calculator": licenseDef("WHMCS", "install"),
  "jetbackup-license-calculator": licenseDef("JetBackup", "server"),
  "softaculous-license-calculator": licenseDef("Softaculous", "server"),
  "virtualizor-license-calculator": licenseDef("Virtualizor", "node"),
  "server-license-stack-calculator": {
    note: "Leave a price at 0 for software you do not run. WHMCS is one install shared by every server.",
    fields: [
      ...STACK.map((n) => f(n.toLowerCase(), `${n} per server`, 0, "USD / month", 0.01)),
      f("whmcs", "WHMCS (one install)", 0, "USD / month", 0.01),
      f("servers", "Servers", 1, "servers"),
      f("accounts", "Hosting accounts per server", 100, "accounts"),
    ],
    compute: (v) => {
      if (v.servers < 1) return "Enter at least one server."
      const perServer = STACK.reduce((sum, n) => sum + v[n.toLowerCase()], 0)
      const monthly = perServer * v.servers + v.whmcs
      return [
        money("Monthly software cost", monthly, true),
        money("Annual software cost", monthly * 12, true),
        money("Cost per server / month", monthly / v.servers),
        v.accounts > 0
          ? money("Cost per account / month", monthly / (v.servers * v.accounts))
          : text("Cost per account / month", "Enter accounts"),
      ]
    },
  },
}

export function runCalc(slug: string, values: Record<string, number>): CalcOutput[] | string {
  const def = calcDefs[slug]
  if (!def) return "Unknown calculator."
  const clean: Record<string, number> = {}
  for (const field of def.fields) {
    const n = values[field.id]
    if (!Number.isFinite(n) || n < 0) return `Enter a number of 0 or more for "${field.label}".`
    clean[field.id] = n
  }
  return def.compute(clean)
}
