// network i/o via fetch(
import { apiFetch } from "@/lib/api-fetch"
import { getCached, setCached } from "@/lib/api-cache"

export interface IpWhoisResponse {
  ip: string
  success: boolean
  message?: string
  type?: string
  continent?: string
  country?: string
  country_code?: string
  region?: string
  city?: string
  latitude?: number
  longitude?: number
  postal?: string
  connection?: {
    asn?: number
    org?: string
    isp?: string
    domain?: string
  }
  timezone?: {
    id?: string
    abbr?: string
    is_dst?: boolean
    offset?: number
    utc?: string
    current_time?: string
  }
}

export async function getIpGeo(ip?: string): Promise<IpWhoisResponse> {
  const cleanIp = (ip ?? "").trim()
  const cacheKey = `ipwhois_${cleanIp || "caller"}`
  if (cleanIp) {
    const cached = getCached<IpWhoisResponse>(cacheKey)
    if (cached) return cached
  }

  const url = cleanIp ? `https://ipwho.is/${encodeURIComponent(cleanIp)}` : "https://ipwho.is/"
  let res: IpWhoisResponse
  try {
    res = await apiFetch<IpWhoisResponse>(url)
  } catch (err) {
    if (!cleanIp) {
      const ipify = await apiFetch<{ ip: string }>("https://api.ipify.org?format=json")
      if (ipify?.ip) {
        return getIpGeo(ipify.ip)
      }
    }
    throw err
  }

  if (res && res.success === false) {
    throw new Error(res.message || "Geolocation lookup failed for this IP")
  }
  if (cleanIp && res && res.success) {
    setCached(cacheKey, res, 60 * 60 * 1000)
  }
  return res
}
