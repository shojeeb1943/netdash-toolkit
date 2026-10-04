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
const pct = (label: string, value: number, strong = false): CalcOutput => ({
  label,
  value,
  kind: "percent",
  strong,
})
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

  "dedicated-server-cost-calculator": {
    note: "Enter what the provider charges. Add every recurring line so the monthly figure matches the invoice.",
    fields: [
      f("rent", "Server rent", 120, "USD / month", 0.01),
      f("setup", "One-time setup fee", 0, "USD", 0.01),
      f("ips", "Extra IP addresses", 4, "IPs"),
      f("ipCost", "Price per extra IP", 2, "USD / month", 0.01),
      f("license", "Control panel and OS licences", 25, "USD / month", 0.01),
      f("backup", "Backup storage", 10, "USD / month", 0.01),
      f("years", "Contract length", 1, "years"),
    ],
    compute: (v) => {
      if (v.years < 1) return "Contract length must be at least 1 year."
      const monthly = v.rent + v.ips * v.ipCost + v.license + v.backup
      return [
        money("Monthly cost", monthly, true),
        money("Cost over the contract", monthly * 12 * v.years + v.setup, true),
        money("Average per month incl. setup", (monthly * 12 * v.years + v.setup) / (12 * v.years)),
        money("Yearly cost", monthly * 12),
      ]
    },
  },
  "reseller-hosting-cost-calculator": {
    fields: [
      f("plan", "Reseller plan cost", 30, "USD / month", 0.01),
      f("accounts", "Accounts you will host", 40, "accounts"),
      f("billing", "Billing and tools", 15, "USD / month", 0.01),
      f("retail", "Retail price per account", 5, "USD / month", 0.01),
      f("fee", "Payment processor fee", 3, "% of revenue", 0.1),
    ],
    compute: (v) => {
      if (v.accounts < 1) return "Enter at least one account."
      const cost = v.plan + v.billing
      const revenue = v.retail * v.accounts
      const profit = revenue * (1 - v.fee / 100) - cost
      const perAccountNet = v.retail * (1 - v.fee / 100)
      return [
        money("Cost per account / month", cost / v.accounts),
        money("Monthly profit", profit, true),
        revenue > 0 ? pct("Profit margin", (profit / revenue) * 100) : text("Profit margin", "n/a"),
        perAccountNet > 0
          ? num("Accounts to break even", Math.ceil(cost / perAccountNet), true)
          : text("Accounts to break even", "Price must be above 0"),
      ]
    },
  },
  "vps-profit-calculator": {
    fields: [
      f("nodeCost", "Node cost", 300, "USD / month"),
      f("capacity", "VPS plans a node holds", 30, "VPS"),
      f("sold", "VPS sold per node", 24, "VPS"),
      f("price", "Average price per VPS", 18, "USD / month", 0.01),
      f("support", "Support and software per VPS", 2, "USD / month", 0.01),
    ],
    compute: (v) => {
      if (v.capacity < 1) return "A node must hold at least one VPS."
      if (v.sold > v.capacity) return "You cannot sell more VPS than the node holds."
      const revenue = v.sold * v.price
      const cost = v.nodeCost + v.sold * v.support
      const profit = revenue - cost
      return [
        money("Revenue per node / month", revenue),
        money("Profit per node / month", profit, true),
        revenue > 0 ? pct("Margin", (profit / revenue) * 100) : text("Margin", "n/a"),
        pct("Node filled", (v.sold / v.capacity) * 100),
        money("Annual profit per node", profit * 12),
      ]
    },
  },
  "server-break-even-calculator": {
    fields: [
      f("server", "Server cost", 150, "USD / month"),
      f("capacity", "Accounts the server can hold", 100, "accounts"),
      f("price", "Price per account", 6, "USD / month", 0.01),
      f("variable", "Extra cost per account", 0.5, "USD / month", 0.01),
    ],
    compute: (v) => {
      const margin = v.price - v.variable
      if (margin <= 0) return "Price must be higher than the extra cost per account."
      const accounts = Math.ceil(v.server / margin)
      return [
        num("Accounts to break even", accounts, true),
        v.capacity > 0
          ? pct("Share of capacity needed", (accounts / v.capacity) * 100)
          : text("Share of capacity needed", "Enter a capacity"),
        money("Revenue at break-even", accounts * v.price),
        accounts > v.capacity
          ? text("Verdict", "Not reachable on this server", true)
          : text("Verdict", "Reachable within capacity", true),
      ]
    },
  },
  "hosting-discount-calculator": {
    fields: [
      f("price", "List price", 10, "USD / month", 0.01),
      f("discount", "Discount", 25, "%", 0.1),
      f("months", "Discount applies for", 12, "months"),
      f("term", "Total term", 24, "months"),
    ],
    compute: (v) => {
      if (v.discount > 100) return "A discount cannot exceed 100%."
      if (v.months > v.term) return "The discount period cannot be longer than the term."
      const cheap = v.price * (1 - v.discount / 100)
      const total = cheap * v.months + v.price * (v.term - v.months)
      return [
        money("Discounted monthly price", cheap, true),
        money("Total over the term", total, true),
        money("You save", v.price * v.term - total),
        v.term > 0
          ? money("Effective price per month", total / v.term)
          : text("Effective price per month", "n/a"),
      ]
    },
  },
  "monthly-to-annual-hosting-calculator": {
    fields: [
      f("monthly", "Monthly price", 8, "USD / month", 0.01),
      f("paid", "Months charged for a year", 10, "months"),
    ],
    compute: (v) => {
      if (v.paid > 12) return "A yearly plan cannot charge for more than 12 months."
      const annual = v.monthly * v.paid
      return [
        money("Yearly plan price", annual, true),
        money("Effective monthly price", annual / 12),
        money("Saving vs paying monthly", v.monthly * 12 - annual),
        v.monthly > 0
          ? pct("Effective discount", (1 - annual / (v.monthly * 12)) * 100)
          : text("Effective discount", "n/a"),
      ]
    },
  },
  "hosting-revenue-calculator": {
    fields: [
      f("c1", "Starter customers", 60, "customers"),
      f("p1", "Starter price", 4, "USD / month", 0.01),
      f("c2", "Business customers", 25, "customers"),
      f("p2", "Business price", 12, "USD / month", 0.01),
      f("c3", "Premium customers", 8, "customers"),
      f("p3", "Premium price", 30, "USD / month", 0.01),
      f("addons", "Add-on revenue (SSL, backups, domains)", 90, "USD / month", 0.01),
    ],
    compute: (v) => {
      const customers = v.c1 + v.c2 + v.c3
      if (customers < 1) return "Enter at least one customer."
      const monthly = v.c1 * v.p1 + v.c2 * v.p2 + v.c3 * v.p3 + v.addons
      return [
        money("Monthly revenue", monthly, true),
        money("Annual revenue", monthly * 12, true),
        money("Average revenue per customer", monthly / customers),
        num("Total customers", customers),
      ]
    },
  },
  "hosting-mrr-calculator": {
    note: "MRR is monthly recurring revenue. Enter this month's movements to see where it ended.",
    fields: [
      f("start", "MRR at the start of the month", 4000, "USD", 0.01),
      f("newMrr", "New customers MRR", 600, "USD", 0.01),
      f("expansion", "Upgrades and add-ons", 150, "USD", 0.01),
      f("contraction", "Downgrades", 50, "USD", 0.01),
      f("churned", "Cancelled customers MRR", 200, "USD", 0.01),
    ],
    compute: (v) => {
      const net = v.newMrr + v.expansion - v.contraction - v.churned
      return [
        money("Ending MRR", v.start + net, true),
        money("Net new MRR", net, true),
        v.start > 0 ? pct("Monthly growth", (net / v.start) * 100) : text("Monthly growth", "n/a"),
        v.start > 0
          ? pct("Gross MRR churn", (v.churned / v.start) * 100)
          : text("Gross MRR churn", "n/a"),
      ]
    },
  },
  "hosting-arr-calculator": {
    fields: [
      f("monthly", "Monthly-billed MRR", 3500, "USD", 0.01),
      f("annualPlans", "Customers on yearly plans", 40, "customers"),
      f("annualPrice", "Average yearly plan price", 90, "USD / year", 0.01),
    ],
    compute: (v) => {
      const annualBook = v.annualPlans * v.annualPrice
      const arr = v.monthly * 12 + annualBook
      return [
        money("ARR", arr, true),
        money("Equivalent MRR", arr / 12, true),
        arr > 0
          ? pct("Share from yearly plans", (annualBook / arr) * 100)
          : text("Share from yearly plans", "n/a"),
      ]
    },
  },
  "customer-churn-calculator": {
    fields: [
      f("start", "Customers at the start", 500, "customers"),
      f("lost", "Customers lost", 15, "customers"),
      f("added", "New customers", 40, "customers"),
    ],
    compute: (v) => {
      if (v.start < 1) return "Enter the customers you started with."
      if (v.lost > v.start) return "You cannot lose more customers than you started with."
      const churn = v.lost / v.start
      return [
        pct("Churn rate", churn * 100, true),
        pct("Retention rate", (1 - churn) * 100),
        churn > 0
          ? num("Average customer lifetime (months)", 1 / churn)
          : text("Average customer lifetime (months)", "No churn yet"),
        pct("Yearly churn if this repeats", (1 - Math.pow(1 - churn, 12)) * 100),
        num("Ending customers", v.start - v.lost + v.added),
      ]
    },
  },
  "hosting-ltv-calculator": {
    fields: [
      f("arpu", "Average revenue per customer", 9, "USD / month", 0.01),
      f("margin", "Gross margin", 70, "%", 0.1),
      f("churn", "Monthly churn", 3, "%", 0.1),
    ],
    compute: (v) => {
      if (v.churn <= 0) return "Churn must be above 0%, or lifetime value is unbounded."
      if (v.margin > 100) return "Gross margin cannot exceed 100%."
      const life = 100 / v.churn
      return [
        money("Customer lifetime value", v.arpu * (v.margin / 100) * life, true),
        num("Average lifetime (months)", life),
        money("Revenue over lifetime", v.arpu * life),
      ]
    },
  },
  "cac-calculator": {
    fields: [
      f("marketing", "Marketing spend", 800, "USD", 0.01),
      f("sales", "Sales and onboarding cost", 200, "USD", 0.01),
      f("customers", "New customers won", 40, "customers"),
      f("arpu", "Average revenue per customer", 9, "USD / month", 0.01),
      f("margin", "Gross margin", 70, "%", 0.1),
    ],
    compute: (v) => {
      if (v.customers < 1) return "Enter at least one new customer."
      const cac = (v.marketing + v.sales) / v.customers
      const monthlyProfit = v.arpu * (v.margin / 100)
      return [
        money("Customer acquisition cost", cac, true),
        monthlyProfit > 0
          ? num("Payback period (months)", cac / monthlyProfit, true)
          : text("Payback period (months)", "Margin must be above 0"),
        money("Profit per customer / month", monthlyProfit),
      ]
    },
  },
  "hosting-ltv-cac-calculator": {
    note: "A ratio of 3 or more with a payback under 12 months is a common benchmark for subscription businesses.",
    fields: [
      f("arpu", "Average revenue per customer", 9, "USD / month", 0.01),
      f("margin", "Gross margin", 70, "%", 0.1),
      f("churn", "Monthly churn", 3, "%", 0.1),
      f("cac", "Customer acquisition cost", 25, "USD", 0.01),
    ],
    compute: (v) => {
      if (v.churn <= 0) return "Churn must be above 0%."
      if (v.cac <= 0) return "CAC must be above 0."
      const ltv = (v.arpu * (v.margin / 100)) / (v.churn / 100)
      const ratio = ltv / v.cac
      const payback = v.cac / (v.arpu * (v.margin / 100))
      return [
        money("Lifetime value", ltv),
        num("LTV : CAC ratio", ratio, true),
        num("Payback (months)", payback),
        text(
          "Verdict",
          ratio >= 3
            ? "Healthy"
            : ratio >= 1
              ? "Thin: lower CAC or churn"
              : "Losing money per customer",
          true
        ),
      ]
    },
  },
  "hosting-markup-calculator": {
    fields: [f("cost", "Your cost", 4, "USD / month", 0.01), f("markup", "Markup", 100, "%", 0.1)],
    compute: (v) => {
      const price = v.cost * (1 + v.markup / 100)
      return [
        money("Selling price", price, true),
        money("Profit", price - v.cost),
        price > 0 ? pct("Margin", ((price - v.cost) / price) * 100) : text("Margin", "n/a"),
      ]
    },
  },
  "hosting-profit-margin-calculator": {
    fields: [
      f("revenue", "Revenue", 6000, "USD / month", 0.01),
      f("cogs", "Direct costs (servers, licences)", 2400, "USD / month", 0.01),
      f("opex", "Other expenses (staff, tools, marketing)", 1800, "USD / month", 0.01),
    ],
    compute: (v) => {
      if (v.revenue <= 0) return "Revenue must be above 0."
      const gross = v.revenue - v.cogs
      const net = gross - v.opex
      return [
        money("Gross profit", gross),
        pct("Gross margin", (gross / v.revenue) * 100, true),
        money("Net profit", net, true),
        pct("Net margin", (net / v.revenue) * 100),
      ]
    },
  },
  "hosting-business-roi-calculator": {
    fields: [
      f("invest", "Initial investment", 5000, "USD", 0.01),
      f("revenue", "Monthly revenue", 1800, "USD", 0.01),
      f("cost", "Monthly running cost", 900, "USD", 0.01),
      f("months", "Period", 24, "months"),
    ],
    compute: (v) => {
      if (v.invest <= 0) return "Investment must be above 0."
      const monthly = v.revenue - v.cost
      const profit = monthly * v.months - v.invest
      return [
        pct("Return on investment", (profit / v.invest) * 100, true),
        money("Net profit over the period", profit, true),
        monthly > 0
          ? num("Payback (months)", v.invest / monthly)
          : text("Payback (months)", "Never at this monthly profit"),
      ]
    },
  },
  "server-roi-calculator": {
    fields: [
      f("price", "Server purchase price", 3200, "USD", 0.01),
      f("colo", "Colocation cost", 90, "USD / month", 0.01),
      f("revenue", "Revenue the server earns", 520, "USD / month", 0.01),
      f("years", "Years in service", 4, "years"),
      f("resale", "Resale value at the end", 400, "USD", 0.01),
    ],
    compute: (v) => {
      if (v.price <= 0 || v.years < 1) return "Enter a price and at least 1 year."
      const months = v.years * 12
      const profit = (v.revenue - v.colo) * months + v.resale - v.price
      const monthly = v.revenue - v.colo
      return [
        money("Net profit over its life", profit, true),
        pct("Return on investment", (profit / v.price) * 100, true),
        monthly > 0
          ? num("Payback (months)", v.price / monthly)
          : text("Payback (months)", "Never at this revenue"),
      ]
    },
  },
  "server-utilization-calculator": {
    fields: [
      f("cpuUsed", "CPU used", 9, "cores"),
      f("cpuTotal", "CPU total", 16, "cores"),
      f("ramUsed", "RAM used", 42, "GB"),
      f("ramTotal", "RAM total", 64, "GB"),
      f("diskUsed", "Disk used", 640, "GB"),
      f("diskTotal", "Disk total", 1000, "GB"),
    ],
    compute: (v) => {
      if (v.cpuTotal <= 0 || v.ramTotal <= 0 || v.diskTotal <= 0) return "Totals must be above 0."
      const cpu = (v.cpuUsed / v.cpuTotal) * 100
      const ram = (v.ramUsed / v.ramTotal) * 100
      const disk = (v.diskUsed / v.diskTotal) * 100
      const max = Math.max(cpu, ram, disk)
      return [
        pct("CPU utilization", cpu),
        pct("RAM utilization", ram),
        pct("Disk utilization", disk),
        text("Tightest resource", cpu === max ? "CPU" : ram === max ? "RAM" : "Disk", true),
        text(
          "Status",
          max >= 90 ? "Add capacity now" : max >= 75 ? "Plan an upgrade" : "Healthy",
          true
        ),
      ]
    },
  },
  "hosting-occupancy-rate-calculator": {
    fields: [
      f("sold", "Accounts sold", 70, "accounts"),
      f("capacity", "Total capacity", 100, "accounts"),
      f("price", "Average price per account", 6, "USD / month", 0.01),
    ],
    compute: (v) => {
      if (v.capacity < 1) return "Capacity must be at least 1."
      if (v.sold > v.capacity) return "Sold accounts cannot exceed capacity."
      return [
        pct("Occupancy rate", (v.sold / v.capacity) * 100, true),
        num("Empty slots", v.capacity - v.sold),
        money("Revenue now", v.sold * v.price),
        money("Revenue at full occupancy", v.capacity * v.price),
        money("Unused revenue potential", (v.capacity - v.sold) * v.price, true),
      ]
    },
  },
  "reseller-pricing-calculator": {
    fields: [
      f("cost", "Wholesale cost per account", 1.2, "USD / month", 0.01),
      f("support", "Support cost per account", 0.4, "USD / month", 0.01),
      f("fee", "Payment fee", 3, "% of price", 0.1),
      f("margin", "Target margin", 55, "%", 0.1),
    ],
    compute: (v) => {
      const keep = 1 - v.margin / 100 - v.fee / 100
      if (keep <= 0) return "Margin plus payment fee must be below 100%."
      const price = (v.cost + v.support) / keep
      return [
        money("Monthly price to charge", price, true),
        money("Yearly price (12 months)", price * 12),
        money("Profit per account / month", price * (v.margin / 100)),
      ]
    },
  },
  "vps-pricing-calculator": {
    fields: [
      f("node", "Node cost", 320, "USD / month"),
      f("count", "VPS you will fit on it", 20, "VPS"),
      f("overhead", "Overhead per VPS (licence, support)", 1.5, "USD / month", 0.01),
      f("margin", "Target margin", 40, "%", 0.1),
    ],
    compute: (v) => {
      if (v.count < 1) return "Enter at least one VPS."
      if (v.margin >= 100) return "Margin must be below 100%."
      const cost = v.node / v.count + v.overhead
      const price = cost / (1 - v.margin / 100)
      return [
        money("Cost per VPS", cost),
        money("Monthly price to charge", price, true),
        money("Profit per VPS", price - cost),
        money("Hourly price (730 h)", price / 730),
      ]
    },
  },
  "dedicated-server-pricing-calculator": {
    fields: [
      f("cost", "Your cost for the server", 140, "USD / month"),
      f("license", "Licences you include", 20, "USD / month", 0.01),
      f("bandwidth", "Bandwidth cost", 10, "USD / month", 0.01),
      f("support", "Support allowance", 15, "USD / month", 0.01),
      f("margin", "Target margin", 30, "%", 0.1),
    ],
    compute: (v) => {
      if (v.margin >= 100) return "Margin must be below 100%."
      const cost = v.cost + v.license + v.bandwidth + v.support
      const price = cost / (1 - v.margin / 100)
      return [
        money("Total monthly cost", cost),
        money("Monthly price to charge", price, true),
        money("Profit per month", price - cost),
        money("Yearly price", price * 12),
      ]
    },
  },
  "vps-ram-calculator": {
    note: "Typical figures are pre-filled. Replace them with measurements from your own server for a tighter answer.",
    fields: [
      f("sites", "Websites", 20, "sites"),
      f("perSite", "Average memory per site", 60, "MB"),
      f("db", "Database server", 1024, "MB"),
      f("cache", "Cache (Redis, Memcached, OPcache)", 512, "MB"),
      f("os", "Operating system and services", 600, "MB"),
      f("headroom", "Headroom for spikes", 25, "%"),
    ],
    compute: (v) => {
      const base = v.sites * v.perSite + v.db + v.cache + v.os
      const needMb = base * (1 + v.headroom / 100)
      const sizes = [1, 2, 4, 8, 16, 32, 64, 128, 256]
      const plan = sizes.find((s) => s * 1024 >= needMb) ?? sizes[sizes.length - 1]
      return [
        num("Memory needed (GB)", needMb / 1024, true),
        num("Plan size to buy (GB)", plan, true),
        num("Memory before headroom (GB)", base / 1024),
        pct("Spare once running", ((plan * 1024 - needMb) / (plan * 1024)) * 100),
      ]
    },
  },
  "vps-cpu-calculator": {
    fields: [
      f("visitors", "Concurrent visitors at peak", 200, "visitors"),
      f("perMin", "Dynamic requests per visitor per minute", 6, "requests"),
      f("ms", "CPU time per request", 80, "ms"),
      f("target", "Highest CPU load you accept", 70, "%"),
    ],
    compute: (v) => {
      if (v.target <= 0 || v.target > 100) return "Target load must be between 1 and 100%."
      const rps = (v.visitors * v.perMin) / 60
      const busy = (rps * v.ms) / 1000
      const cores = busy / (v.target / 100)
      return [
        num("Requests per second at peak", rps),
        num("CPU cores busy", busy),
        num("Cores needed", Math.ceil(cores * 10) / 10, true),
        num("vCPU plan to buy", Math.max(1, Math.ceil(cores)), true),
      ]
    },
  },
  "vps-storage-calculator": {
    fields: [
      f("sites", "Websites", 20, "sites"),
      f("perSite", "Average site files", 1.5, "GB", 0.1),
      f("db", "Databases (total)", 10, "GB", 0.1),
      f("mail", "Mailboxes (total)", 8, "GB", 0.1),
      f("os", "Operating system and logs", 20, "GB", 0.1),
      f("backups", "Local backup copies kept", 2, "copies"),
      f("growth", "Yearly growth", 30, "%"),
      f("years", "Plan ahead for", 2, "years"),
    ],
    compute: (v) => {
      const data = v.sites * v.perSite + v.db + v.mail
      const grown = data * Math.pow(1 + v.growth / 100, v.years)
      const total = grown * (1 + v.backups) + v.os
      return [
        num("Live data today (GB)", data),
        num("Live data after growth (GB)", grown),
        num("Disk to provision (GB)", total * 1.2, true),
        text("Includes", "20% free space so the disk is never full"),
      ]
    },
  },
  "vps-bandwidth-calculator": {
    fields: [
      f("visitors", "Visitors per month", 50000, "visitors"),
      f("pages", "Pages per visit", 3, "pages", 0.1),
      f("size", "Average page weight", 2.2, "MB", 0.1),
      f("peak", "Peak hour share of daily traffic", 10, "%"),
    ],
    compute: (v) => {
      const gb = (v.visitors * v.pages * v.size) / 1024
      const dailyGb = gb / 30
      const peakMbps = (dailyGb * 1024 * 8 * (v.peak / 100)) / 3600
      return [
        num("Transfer per month (GB)", gb, true),
        num("Transfer per month (TB)", gb / 1024),
        num("Average per day (GB)", dailyGb),
        num("Peak hour speed (Mbps)", peakMbps, true),
      ]
    },
  },
  "server-storage-calculator": {
    fields: [
      f("used", "Used today", 640, "GB"),
      f("total", "Total capacity", 1000, "GB"),
      f("growth", "Growth per month", 25, "GB", 0.1),
      f("alarm", "Alarm threshold", 85, "%"),
    ],
    compute: (v) => {
      if (v.total <= 0) return "Capacity must be above 0."
      if (v.used > v.total) return "Used space cannot exceed capacity."
      if (v.growth <= 0)
        return [
          pct("Used today", (v.used / v.total) * 100, true),
          text("Time to full", "Not growing"),
        ]
      const limit = (v.alarm / 100) * v.total
      const toAlarm = Math.max(0, (limit - v.used) / v.growth)
      return [
        pct("Used today", (v.used / v.total) * 100),
        num("Months until the alarm level", toAlarm, true),
        num("Months until completely full", (v.total - v.used) / v.growth, true),
        num("Capacity needed in 12 months (GB)", v.used + v.growth * 12),
      ]
    },
  },
  "raid-capacity-calculator": {
    note: "Enter the RAID level as a number: 0, 1, 5, 6 or 10. Hot spares are not counted.",
    fields: [
      f("level", "RAID level", 5, "0, 1, 5, 6 or 10"),
      f("drives", "Number of drives", 4, "drives"),
      f("size", "Size of each drive", 4, "TB", 0.1),
    ],
    compute: (v) => {
      const n = v.drives
      const raw = n * v.size
      const levels: Record<number, { min: number; usable: number; tolerance: string }> = {
        0: { min: 2, usable: n, tolerance: "None: one failed drive loses everything" },
        1: { min: 2, usable: 1, tolerance: "All drives but one" },
        5: { min: 3, usable: n - 1, tolerance: "1 drive" },
        6: { min: 4, usable: n - 2, tolerance: "2 drives" },
        10: { min: 4, usable: n / 2, tolerance: "1 per mirrored pair" },
      }
      const l = levels[v.level]
      if (!l) return "RAID level must be 0, 1, 5, 6 or 10."
      if (n < l.min) return `RAID ${v.level} needs at least ${l.min} drives.`
      if (v.level === 10 && n % 2 !== 0) return "RAID 10 needs an even number of drives."
      const usable = l.usable * v.size
      return [
        num("Usable capacity (TB)", usable, true),
        num("Raw capacity (TB)", raw),
        pct("Space efficiency", (usable / raw) * 100),
        text("Failures survived", l.tolerance, true),
      ]
    },
  },
  "swap-size-calculator": {
    note: "Rule of thumb used by common distributions. A fast SSD with plenty of RAM needs far less swap than a busy small server.",
    fields: [
      f("ram", "Installed RAM", 8, "GB", 0.5),
      f("hibernate", "Needs hibernation? (1 = yes, 0 = no)", 0, "0 or 1"),
    ],
    compute: (v) => {
      if (v.ram <= 0) return "RAM must be above 0."
      const base =
        v.ram <= 2 ? v.ram * 2 : v.ram <= 8 ? v.ram : v.ram <= 64 ? Math.max(4, v.ram / 2) : 4
      const swap = v.hibernate >= 1 ? v.ram + Math.sqrt(v.ram) : base
      return [
        num("Recommended swap (GB)", Math.round(swap * 10) / 10, true),
        num("Total virtual memory (GB)", v.ram + swap),
        text("Suggested swappiness", v.ram >= 16 ? "10 (prefer RAM)" : "30 to 60", true),
      ]
    },
  },
  "php-worker-calculator": {
    fields: [
      f("ram", "RAM available for PHP", 4, "GB", 0.5),
      f("perWorker", "Memory per PHP worker", 60, "MB"),
      f("cores", "CPU cores", 4, "cores"),
      f("reqMs", "Average request time", 150, "ms"),
      f("rps", "Peak requests per second", 25, "requests"),
    ],
    compute: (v) => {
      if (v.perWorker <= 0 || v.reqMs <= 0) return "Worker memory and request time must be above 0."
      const byRam = Math.floor((v.ram * 1024) / v.perWorker)
      const needed = Math.ceil((v.rps * v.reqMs) / 1000)
      return [
        num("Workers the RAM allows", byRam),
        num("Workers the traffic needs", needed),
        num(
          "Suggested pm.max_children",
          Math.max(1, Math.min(byRam, Math.max(needed * 2, v.cores * 4))),
          true
        ),
        text(
          "Status",
          needed > byRam
            ? "RAM is the limit: add memory or reduce per-worker use"
            : "RAM covers peak traffic",
          true
        ),
      ]
    },
  },
  "mysql-ram-calculator": {
    fields: [
      f("pool", "InnoDB buffer pool", 2, "GB", 0.25),
      f("globals", "Other global buffers (log, key, query cache)", 256, "MB"),
      f("conns", "max_connections", 150, "connections"),
      f("perConn", "Memory per connection (sort, join, read, thread)", 4, "MB", 0.5),
      f("active", "Share of connections busy at once", 30, "%"),
    ],
    compute: (v) => {
      const peak = v.pool * 1024 + v.globals + v.conns * v.perConn
      const typical = v.pool * 1024 + v.globals + v.conns * (v.active / 100) * v.perConn
      return [
        num("Worst case memory (GB)", peak / 1024, true),
        num("Typical memory (GB)", typical / 1024, true),
        num("Memory only from connections (GB)", (v.conns * v.perConn) / 1024),
        text("Rule of thumb", "Keep worst case under 80% of server RAM"),
      ]
    },
  },
  "redis-ram-calculator": {
    fields: [
      f("keys", "Number of keys", 1000000, "keys"),
      f("keyBytes", "Average key size", 40, "bytes"),
      f("valueBytes", "Average value size", 300, "bytes"),
      f("overhead", "Redis overhead per key", 64, "bytes"),
      f("replicas", "Replicas", 1, "copies"),
      f("frag", "Fragmentation factor", 1.3, "x", 0.05),
    ],
    compute: (v) => {
      const per = v.keyBytes + v.valueBytes + v.overhead
      const oneCopy = (v.keys * per * v.frag) / 1024 ** 3
      return [
        num("Memory for one instance (GB)", oneCopy, true),
        num("Memory including replicas (GB)", oneCopy * (1 + v.replicas), true),
        num("Bytes per key all in", per),
        text("Advice", "Set maxmemory about 10% below the server limit"),
      ]
    },
  },
  "server-ram-allocation-calculator": {
    fields: [
      f("total", "Server RAM", 32, "GB"),
      f("os", "Operating system and services", 8, "%"),
      f("db", "Database", 35, "%"),
      f("php", "PHP and web server", 40, "%"),
      f("cache", "Cache (Redis, OPcache)", 12, "%"),
    ],
    compute: (v) => {
      const used = v.os + v.db + v.php + v.cache
      if (used > 100) return `Shares add up to ${used}%: reduce them to 100% or less.`
      const gb = (p: number) => (v.total * p) / 100
      return [
        num("Operating system (GB)", gb(v.os)),
        num("Database (GB)", gb(v.db)),
        num("PHP and web server (GB)", gb(v.php)),
        num("Cache (GB)", gb(v.cache)),
        num("Unallocated (GB)", gb(100 - used), true),
      ]
    },
  },
  "disk-usage-calculator": {
    fields: [
      f("sites", "Website files", 220, "GB"),
      f("mail", "Mail", 60, "GB"),
      f("db", "Databases", 80, "GB"),
      f("logs", "Logs", 25, "GB"),
      f("backups", "Local backups", 180, "GB"),
      f("other", "Everything else", 30, "GB"),
      f("total", "Disk size", 1000, "GB"),
    ],
    compute: (v) => {
      const used = v.sites + v.mail + v.db + v.logs + v.backups + v.other
      if (v.total <= 0) return "Disk size must be above 0."
      if (used > v.total) return `The parts add up to ${used} GB, more than the ${v.total} GB disk.`
      const biggest = Math.max(v.sites, v.mail, v.db, v.logs, v.backups, v.other)
      const name =
        biggest === v.sites
          ? "Website files"
          : biggest === v.backups
            ? "Local backups"
            : biggest === v.db
              ? "Databases"
              : biggest === v.mail
                ? "Mail"
                : biggest === v.logs
                  ? "Logs"
                  : "Other"
      return [
        num("Used (GB)", used),
        num("Free (GB)", v.total - used, true),
        pct("Used", (used / v.total) * 100, true),
        text("Largest consumer", name),
        pct("Backups share of used space", used > 0 ? (v.backups / used) * 100 : 0),
      ]
    },
  },
  "inode-usage-calculator": {
    note: "Default ext4 creates one inode per 16 KB of disk. Check the real value with df -i.",
    fields: [
      f("disk", "Filesystem size", 500, "GB"),
      f("ratio", "Bytes per inode", 16384, "bytes"),
      f("accounts", "Hosting accounts", 100, "accounts"),
      f("files", "Average files per account", 40000, "files"),
    ],
    compute: (v) => {
      if (v.ratio <= 0) return "Bytes per inode must be above 0."
      if (v.accounts < 1) return "Enter at least one account."
      const total = (v.disk * 1024 ** 3) / v.ratio
      const used = v.accounts * v.files
      return [
        num("Total inodes", total),
        num("Inodes used", used),
        pct("Inode usage", (used / total) * 100, true),
        num("Fair inode limit per account", Math.floor((total * 0.8) / v.accounts), true),
      ]
    },
  },
  "backup-rotation-calculator": {
    note: "Grandfather-father-son rotation: daily, weekly, monthly and yearly full copies, with optional deduplication.",
    fields: [
      f("size", "Size of one full backup", 80, "GB"),
      f("daily", "Daily copies kept", 7, "copies"),
      f("weekly", "Weekly copies kept", 4, "copies"),
      f("monthly", "Monthly copies kept", 12, "copies"),
      f("yearly", "Yearly copies kept", 1, "copies"),
      f("dedupe", "Space saved by compression and dedup", 40, "%"),
    ],
    compute: (v) => {
      if (v.dedupe >= 100) return "Savings must be below 100%."
      const copies = v.daily + v.weekly + v.monthly + v.yearly
      const stored = copies * v.size * (1 - v.dedupe / 100)
      return [
        num("Restore points kept", copies),
        num("Storage needed (GB)", stored, true),
        num("Storage needed (TB)", stored / 1024),
        text(
          "Furthest restore point",
          v.yearly > 0 ? `${v.yearly} year(s) back` : `${v.monthly} month(s) back`
        ),
      ]
    },
  },
  "backup-bandwidth-calculator": {
    fields: [
      f("data", "Data to back up", 500, "GB"),
      f("change", "Daily change", 3, "%", 0.1),
      f("window", "Backup window", 6, "hours", 0.5),
      f("link", "Link speed available", 200, "Mbps"),
      f("eff", "Real-world efficiency", 75, "%"),
    ],
    compute: (v) => {
      if (v.window <= 0 || v.link <= 0 || v.eff <= 0)
        return "Window, link and efficiency must be above 0."
      const need = (gb: number) => (gb * 8000) / (v.window * 3600)
      const usable = v.link * (v.eff / 100)
      const fullH = (v.data * 8000) / usable / 3600
      const incGb = v.data * (v.change / 100)
      const incH = (incGb * 8000) / usable / 3600
      return [
        num("Speed needed for a full backup (Mbps)", need(v.data), true),
        num("Speed needed for an incremental (Mbps)", need(incGb)),
        num("Full backup takes (hours)", fullH),
        num("Incremental takes (hours)", incH),
        text(
          "Fits the window",
          fullH <= v.window
            ? "Yes, even a full backup"
            : incH <= v.window
              ? "Only incrementals"
              : "No: add bandwidth",
          true
        ),
      ]
    },
  },
  "plesk-license-calculator": licenseDef("Plesk", "server"),
  "imunify360-license-calculator": licenseDef("Imunify360", "server"),
  "sitepad-license-calculator": licenseDef("SitePad", "server"),
  "whmreseller-license-calculator": licenseDef("WHMReseller", "server"),
  "domain-renewal-cost-calculator": {
    note: "Registries and registrars raise renewal prices over time. Enter a yearly increase to see the effect.",
    fields: [
      f("renew", "Renewal price this year", 15, "USD", 0.01),
      f("increase", "Expected yearly price increase", 5, "%", 0.1),
      f("years", "Years to hold", 10, "years"),
      f("domains", "Number of domains", 1, "domains"),
    ],
    compute: (v) => {
      if (v.years < 1) return "Hold the domain for at least 1 year."
      let total = 0
      let price = v.renew
      for (let y = 0; y < v.years; y++) {
        total += price
        price *= 1 + v.increase / 100
      }
      return [
        money("Total renewals per domain", total, true),
        money("Total for all domains", total * v.domains, true),
        money("Price in the final year", price / (1 + v.increase / 100)),
        money("Average per year", total / v.years),
      ]
    },
  },
  "domain-profit-calculator": {
    fields: [
      f("buy", "Purchase price", 12, "USD", 0.01),
      f("sell", "Sale price", 450, "USD", 0.01),
      f("renew", "Renewal per year", 15, "USD", 0.01),
      f("years", "Years held before selling", 3, "years", 0.5),
      f("fee", "Marketplace or broker fee", 15, "% of sale", 0.1),
    ],
    compute: (v) => {
      const holding = v.renew * Math.max(0, v.years - 1)
      const cost = v.buy + holding
      const net = v.sell * (1 - v.fee / 100)
      const profit = net - cost
      return [
        money("Total cost to hold", cost),
        money("Proceeds after fees", net),
        money("Profit", profit, true),
        cost > 0
          ? pct("Return on cost", (profit / cost) * 100, true)
          : text("Return on cost", "n/a"),
      ]
    },
  },
  "domain-portfolio-value-calculator": {
    note: "A planning model, not an appraisal. Real resale values and sell-through rates are uncertain: use cautious numbers.",
    fields: [
      f("count", "Domains in the portfolio", 50, "domains"),
      f("renew", "Average renewal cost", 14, "USD / year", 0.01),
      f("price", "Average sale price when sold", 300, "USD", 0.01),
      f("sell", "Share of the portfolio sold each year", 2, "%", 0.1),
      f("fee", "Marketplace or broker fee", 15, "% of sale", 0.1),
    ],
    compute: (v) => {
      const holding = v.count * v.renew
      const sold = v.count * (v.sell / 100)
      const revenue = sold * v.price * (1 - v.fee / 100)
      return [
        money("Holding cost per year", holding),
        num("Expected sales per year", sold),
        money("Expected revenue per year", revenue),
        money("Expected net per year", revenue - holding, true),
        revenue > 0
          ? num("Years to sell the portfolio at this rate", v.sell > 0 ? 100 / v.sell : Infinity)
          : text("Years to sell the portfolio at this rate", "n/a"),
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
