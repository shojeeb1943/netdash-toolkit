// network i/o via fetch(
import { apiFetch } from "@/lib/api-fetch"
import { getCached, setCached } from "@/lib/api-cache"

export interface CveItem {
  id: string
  published: string
  lastModified?: string
  score?: number
  severity?: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  description: string
}

export interface NvdCveResponse {
  resultsPerPage: number
  startIndex: number
  totalResults: number
  format: string
  version: string
  timestamp: string
  vulnerabilities: Array<{
    cve: {
      id: string
      published: string
      lastModified: string
      descriptions: Array<{ lang: string; value: string }>
      metrics?: {
        cvssMetricV31?: Array<{
          cvssData: {
            baseScore: number
            baseSeverity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
          }
        }>
        cvssMetricV30?: Array<{
          cvssData: {
            baseScore: number
            baseSeverity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
          }
        }>
        cvssMetricV2?: Array<{
          cvssData: {
            baseScore: number
          }
          baseSeverity?: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
        }>
      }
    }
  }>
}

const CACHE_TTL = 60 * 60 * 1000 // 1 hour

export async function searchCves(keyword: string): Promise<{ total: number; items: CveItem[] }> {
  const clean = keyword.trim()
  if (!clean) {
    throw new Error("Please enter a software keyword or CVE ID (e.g. cPanel, OpenSSL, PHP).")
  }

  const cacheKey = `cve_search_${clean.toLowerCase()}`
  const cached = getCached<{ total: number; items: CveItem[] }>(cacheKey)
  if (cached) return cached

  const url = `https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${encodeURIComponent(clean)}&resultsPerPage=20`
  const res = await apiFetch<NvdCveResponse>(url)

  if (!res || !Array.isArray(res.vulnerabilities)) {
    throw new Error("Invalid response from NIST NVD database.")
  }

  const items: CveItem[] = res.vulnerabilities.map((v) => {
    const c = v.cve
    const desc =
      c.descriptions?.find((d) => d.lang === "en")?.value ||
      c.descriptions?.[0]?.value ||
      "No description provided."

    let score: number | undefined
    let severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | undefined

    if (c.metrics?.cvssMetricV31?.[0]?.cvssData) {
      score = c.metrics.cvssMetricV31[0].cvssData.baseScore
      severity = c.metrics.cvssMetricV31[0].cvssData.baseSeverity
    } else if (c.metrics?.cvssMetricV30?.[0]?.cvssData) {
      score = c.metrics.cvssMetricV30[0].cvssData.baseScore
      severity = c.metrics.cvssMetricV30[0].cvssData.baseSeverity
    } else if (c.metrics?.cvssMetricV2?.[0]?.cvssData) {
      score = c.metrics.cvssMetricV2[0].cvssData.baseScore
      const s = score
      if (s >= 9.0) severity = "CRITICAL"
      else if (s >= 7.0) severity = "HIGH"
      else if (s >= 4.0) severity = "MEDIUM"
      else severity = "LOW"
    }

    return {
      id: c.id,
      published: c.published?.split("T")[0] || c.published,
      score,
      severity,
      description: desc,
    }
  })

  const result = {
    total: res.totalResults || items.length,
    items,
  }

  setCached(cacheKey, result, CACHE_TTL)
  return result
}
