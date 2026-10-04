// network i/o via fetch(
import { apiFetch } from "@/lib/api-fetch"
import { reverseDnsName } from "@/lib/reverse-dns"

export interface DohAnswer {
  name: string
  type: number
  TTL: number
  data: string
}

export interface DohResponse {
  Status: number
  TC?: boolean
  RD?: boolean
  RA?: boolean
  AD?: boolean
  CD?: boolean
  Question?: Array<{ name: string; type: number }>
  Answer?: DohAnswer[]
  Authority?: DohAnswer[]
  Comment?: string
}

export type DohProvider = "google" | "cloudflare"

export async function resolve(
  name: string,
  type: string | number = "A",
  provider: DohProvider = "google",
  doDnssec: boolean = true
): Promise<DohResponse> {
  const cleanName = name.trim().replace(/\.+$/, "")
  const typeStr = String(type)

  let url: string
  let headers: Record<string, string> | undefined

  if (provider === "cloudflare") {
    url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(cleanName)}&type=${encodeURIComponent(typeStr)}${doDnssec ? "&do=1" : ""}`
    headers = { Accept: "application/dns-json" }
  } else {
    url = `https://dns.google/resolve?name=${encodeURIComponent(cleanName)}&type=${encodeURIComponent(typeStr)}${doDnssec ? "&do=1" : ""}`
  }

  return apiFetch<DohResponse>(url, { headers })
}

export { reverseDnsName }
