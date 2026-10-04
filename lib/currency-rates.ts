// network i/o via fetch(
import { getCached, setCached } from "@/lib/api-cache"
import { apiFetch } from "@/lib/api-fetch"

export interface ExchangeRateData {
  result: string
  provider?: string
  documentation?: string
  terms_of_use?: string
  time_last_update_unix: number
  time_last_update_utc: string
  time_next_update_unix?: number
  time_next_update_utc?: string
  base_code: string
  rates: Record<string, number>
}

export interface LicenseTier {
  id: string
  name: string
  product: string
  monthlyUsd: number
  isOneTime?: boolean
  description: string
}

export const LICENSE_TIERS: LicenseTier[] = [
  {
    id: "cpanel-vps",
    product: "cPanel and WHM",
    name: "cPanel VPS License",
    monthlyUsd: 4.0,
    description: "VPS and cloud instances",
  },
  {
    id: "cpanel-dedi",
    product: "cPanel and WHM",
    name: "cPanel Dedicated License",
    monthlyUsd: 8.0,
    description: "Dedicated bare-metal servers",
  },
  {
    id: "litespeed-2c",
    product: "LiteSpeed",
    name: "LiteSpeed 2 Core",
    monthlyUsd: 4.0,
    description: "Up to 2 CPU cores",
  },
  {
    id: "litespeed-4c",
    product: "LiteSpeed",
    name: "LiteSpeed 4 Core",
    monthlyUsd: 7.5,
    description: "Up to 4 CPU cores",
  },
  {
    id: "litespeed-8c",
    product: "LiteSpeed",
    name: "LiteSpeed 8 Core",
    monthlyUsd: 10.5,
    description: "Up to 8 CPU cores",
  },
  {
    id: "litespeed-xc",
    product: "LiteSpeed",
    name: "LiteSpeed X Core (Unlimited)",
    monthlyUsd: 11.5,
    description: "Unlimited CPU cores",
  },
  {
    id: "plesk-vps",
    product: "Plesk",
    name: "Plesk VPS Edition",
    monthlyUsd: 2.5,
    description: "Plesk Web Pro / Host VPS",
  },
  {
    id: "plesk-dedi",
    product: "Plesk",
    name: "Plesk Dedicated Edition",
    monthlyUsd: 6.5,
    description: "Plesk Dedicated Server",
  },
  {
    id: "whmcs-monthly",
    product: "WHMCS",
    name: "WHMCS Monthly License",
    monthlyUsd: 4.0,
    description: "Monthly billing software license",
  },
  {
    id: "whmcs-owned",
    product: "WHMCS",
    name: "WHMCS Lifetime Owned",
    monthlyUsd: 20.0,
    isOneTime: true,
    description: "One-time owned license",
  },
  {
    id: "cloudlinux-shared",
    product: "CloudLinux OS",
    name: "CloudLinux Shared License",
    monthlyUsd: 4.0,
    description: "Kernel isolation and LVE manager",
  },
  {
    id: "virtualizor-node",
    product: "Virtualizor",
    name: "Virtualizor Node License",
    monthlyUsd: 3.5,
    description: "VPS virtualization control node",
  },
  {
    id: "sitepad-server",
    product: "SitePad",
    name: "SitePad Server License",
    monthlyUsd: 1.5,
    description: "Drag and drop website builder",
  },
  {
    id: "whmreseller-pro",
    product: "WHMReseller",
    name: "WHMReseller Pro License",
    monthlyUsd: 1.5,
    description: "Master and alpha reseller control",
  },
  {
    id: "softaculous-premium",
    product: "Softaculous",
    name: "Softaculous Premium License",
    monthlyUsd: 1.0,
    description: "1-click application auto-installer",
  },
  {
    id: "jetbackup-server",
    product: "JetBackup 5",
    name: "JetBackup 5 Server License",
    monthlyUsd: 1.5,
    description: "Backup automation and instant restore",
  },
  {
    id: "imunify360-unlimited",
    product: "Imunify360",
    name: "Imunify360 Unlimited License",
    monthlyUsd: 1.5,
    description: "Complete automated server security",
  },
  {
    id: "webuzo-premium",
    product: "Webuzo",
    name: "Webuzo Premium License",
    monthlyUsd: 4.0,
    description: "Single-user hosting control panel",
  },
  {
    id: "wpsquared-enterprise",
    product: "WP Squared",
    name: "WP Squared Enterprise",
    monthlyUsd: 4.0,
    description: "Managed WordPress server platform",
  },
]

export const COMMON_CURRENCIES: { code: string; name: string; symbol: string }[] = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "Tk" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$" },
  { code: "AUD", name: "Australian Dollar", symbol: "AU$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "CN¥" },
  { code: "SGD", name: "Singapore Dollar", symbol: "SG$" },
  { code: "AED", name: "UAE Dirham", symbol: "AED" },
  { code: "SAR", name: "Saudi Riyal", symbol: "SAR" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "PKR" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
]

const API_ENDPOINT = "https://open.er-api.com/v6/latest"
const CACHE_TTL_MS = 6 * 60 * 60 * 1000 // 6 hours

export async function fetchExchangeRates(baseCurrency = "USD"): Promise<ExchangeRateData> {
  const base = (baseCurrency || "USD").trim().toUpperCase()
  const cacheKey = `exchange_rates_${base}`
  const cached = getCached<ExchangeRateData>(cacheKey)
  if (cached && cached.rates && Object.keys(cached.rates).length > 0) {
    return cached
  }

  const url = `${API_ENDPOINT}/${encodeURIComponent(base)}`
  const data = await apiFetch<ExchangeRateData>(url, { timeoutMs: 10000 })
  if (!data || data.result !== "success" || !data.rates) {
    throw new Error("Failed to retrieve currency exchange rates from provider.")
  }

  setCached(cacheKey, data, CACHE_TTL_MS)
  return data
}

export function convertAmount(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>,
  baseCurrency = "USD"
): { converted: number; rate: number } {
  if (amount <= 0 || !Number.isFinite(amount)) {
    return { converted: 0, rate: 0 }
  }
  const from = fromCurrency.toUpperCase()
  const to = toCurrency.toUpperCase()
  const base = baseCurrency.toUpperCase()

  if (from === to) {
    return { converted: amount, rate: 1 }
  }

  let rate = 1
  if (base === from && rates[to]) {
    rate = rates[to]
  } else if (base === to && rates[from] && rates[from] > 0) {
    rate = 1 / rates[from]
  } else if (rates[from] && rates[from] > 0 && rates[to]) {
    rate = rates[to] / rates[from]
  }

  return {
    converted: amount * rate,
    rate,
  }
}
