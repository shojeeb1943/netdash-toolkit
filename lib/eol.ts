// network i/o via fetch(
import { apiFetch } from "@/lib/api-fetch"
import { getCached, setCached } from "@/lib/api-cache"

export interface EolCycle {
  cycle: string
  releaseDate: string
  eol: string | boolean
  latest: string
  latestReleaseDate?: string
  support?: string | boolean
  lts?: boolean | string
}

export type LifecycleStatus = "supported" | "security-only" | "eol"

export interface EolVerdict {
  cycle: string
  status: LifecycleStatus
  statusLabel: string
  daysUntilEol: number | null
  eolDate: string | null
  supportDate: string | null
  releaseDate: string
  latestVersion: string
  isLts: boolean
}

const CACHE_TTL = 6 * 60 * 60 * 1000 // 6 hours

export async function getProductEol(product: string): Promise<EolCycle[]> {
  const clean = product.trim().toLowerCase()
  const cacheKey = `eol_product_${clean}`
  const cached = getCached<EolCycle[]>(cacheKey)
  if (cached) return cached

  const url = `https://endoflife.date/api/${encodeURIComponent(clean)}.json`
  const res = await apiFetch<EolCycle[]>(url)
  if (Array.isArray(res)) {
    setCached(cacheKey, res, CACHE_TTL)
    return res
  }
  throw new Error(`Failed to fetch lifecycle data for ${product}`)
}

export function parseDate(dateStr: string | boolean | undefined): Date | null {
  if (!dateStr || typeof dateStr !== "string") return null
  const d = new Date(dateStr + "T00:00:00Z")
  return isNaN(d.getTime()) ? null : d
}

export function computeLifecycleStatus(
  cycleData: EolCycle,
  targetDate: Date = new Date()
): EolVerdict {
  const today = new Date(
    Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate())
  )

  const eolDateObj = typeof cycleData.eol === "string" ? parseDate(cycleData.eol) : null
  const supportDateObj = typeof cycleData.support === "string" ? parseDate(cycleData.support) : null

  let status: LifecycleStatus = "supported"
  let statusLabel = "Supported (Active)"
  let daysUntilEol: number | null = null

  if (cycleData.eol === true) {
    status = "eol"
    statusLabel = "End of Life"
  } else if (eolDateObj) {
    const diffMs = eolDateObj.getTime() - today.getTime()
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
    daysUntilEol = diffDays

    if (diffDays <= 0) {
      status = "eol"
      statusLabel = "End of Life"
    } else if (supportDateObj && supportDateObj.getTime() < today.getTime()) {
      status = "security-only"
      statusLabel = "Security Fixes Only"
    } else {
      status = "supported"
      statusLabel = "Active Support"
    }
  } else if (cycleData.eol === false) {
    if (supportDateObj && supportDateObj.getTime() < today.getTime()) {
      status = "security-only"
      statusLabel = "Security Fixes Only"
    } else {
      status = "supported"
      statusLabel = "Supported"
    }
  }

  const isLts = Boolean(cycleData.lts)

  return {
    cycle: cycleData.cycle,
    status,
    statusLabel,
    daysUntilEol,
    eolDate: typeof cycleData.eol === "string" ? cycleData.eol : null,
    supportDate: typeof cycleData.support === "string" ? cycleData.support : null,
    releaseDate: cycleData.releaseDate,
    latestVersion: cycleData.latest,
    isLts,
  }
}
