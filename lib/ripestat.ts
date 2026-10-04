// network i/o via fetch(
import { apiFetch } from "@/lib/api-fetch"
import { getCached, setCached } from "@/lib/api-cache"

const BASE_URL = "https://stat.ripe.net/data"
const CACHE_TTL = 30 * 60 * 1000 // 30 mins

export interface RipeStatResponse<T> {
  status: string
  server_id: string
  data: T
  messages: string[]
}

export interface AsOverviewData {
  type: string
  resource: string
  block?: {
    resource: string
    desc: string
    name: string
  }
  holder?: string
  announced?: boolean
}

export interface AnnouncedPrefixesData {
  resource: string
  prefixes: Array<{
    prefix: string
    timelines: Array<{ starttime: string; endtime: string }>
  }>
}

export interface PrefixOverviewData {
  resource: string
  asns: Array<{
    asn: number
    holder: string
  }>
  block?: {
    resource: string
    desc: string
    name: string
  }
  is_less_specific?: boolean
  announced?: boolean
}

export interface NetworkInfoData {
  prefix?: string
  asns?: string[]
  holder?: string
}

export interface AbuseContactFinderData {
  authorities?: string[]
  abuse_contacts?: string[]
  parameters?: {
    resource: string
    cache?: unknown
  }
}

async function fetchRipeStat<T>(endpoint: string, resource: string): Promise<T> {
  const cleanRes = resource.trim()
  const cacheKey = `ripestat_${endpoint}_${cleanRes}`
  const cached = getCached<T>(cacheKey)
  if (cached) return cached

  const url = `${BASE_URL}/${endpoint}/data.json?resource=${encodeURIComponent(cleanRes)}`
  const res = await apiFetch<RipeStatResponse<T>>(url)
  if (res && res.data) {
    setCached(cacheKey, res.data, CACHE_TTL)
    return res.data
  }
  throw new Error("Invalid response from RIPEstat")
}

export async function getAsOverview(asn: string | number): Promise<AsOverviewData> {
  const clean = String(asn).replace(/^as/i, "").trim()
  return fetchRipeStat<AsOverviewData>("as-overview", clean)
}

export async function getAnnouncedPrefixes(asn: string | number): Promise<AnnouncedPrefixesData> {
  const clean = String(asn).replace(/^as/i, "").trim()
  return fetchRipeStat<AnnouncedPrefixesData>("announced-prefixes", clean)
}

export async function getPrefixOverview(prefix: string): Promise<PrefixOverviewData> {
  return fetchRipeStat<PrefixOverviewData>("prefix-overview", prefix)
}

export async function getNetworkInfo(ipOrPrefix: string): Promise<NetworkInfoData> {
  return fetchRipeStat<NetworkInfoData>("network-info", ipOrPrefix)
}

export async function getAbuseContact(resource: string): Promise<AbuseContactFinderData> {
  return fetchRipeStat<AbuseContactFinderData>("abuse-contact-finder", resource)
}
