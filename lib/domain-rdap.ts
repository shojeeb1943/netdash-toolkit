// domain availability and age on top of the existing RDAP client (lib/rdap.ts). rdap.org answers
// 404 both for "not registered" and for "this TLD publishes no RDAP", so "available" is only ever "likely".
import type { RDAPDomainResponse } from "@/lib/rdap"

export const CANDIDATE_TLDS = [
  "com",
  "net",
  "org",
  "io",
  "dev",
  "app",
  "co",
  "xyz",
  "info",
  "biz",
  "online",
  "cloud",
]

export type Availability =
  | { state: "registered"; created?: string; expires?: string; registrar?: string }
  | { state: "likely-available" }
  | { state: "error"; message: string }

export function normalizeLabel(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/\.[a-z]{2,24}$/, "")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-+|-+$/g, "")
}

const event = (d: RDAPDomainResponse, action: string) =>
  d.events?.find((e) => e.eventAction === action)?.eventDate

export function registrarOf(d: RDAPDomainResponse): string | undefined {
  const entity = d.entities?.find((e) => e.roles?.includes("registrar"))
  const fn = entity?.vcardArray?.[1]?.find((f) => f[0] === "fn")
  return typeof fn?.[3] === "string" ? fn[3] : undefined
}

export async function checkDomain(domain: string): Promise<Availability> {
  try {
    // rdap.org redirects to the authoritative registry (RFC 9224); a 404 is its only "not found" signal
    const response = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
      headers: { Accept: "application/rdap+json" },
    })
    if (response.status === 404) return { state: "likely-available" }
    if (!response.ok) return { state: "error", message: `HTTP ${response.status}` }
    const data = (await response.json()) as RDAPDomainResponse
    return {
      state: "registered",
      created: event(data, "registration"),
      expires: event(data, "expiration"),
      registrar: registrarOf(data),
    }
  } catch (e) {
    return { state: "error", message: e instanceof Error ? e.message : String(e) }
  }
}

export function ageFrom(
  created: Date,
  now: Date
): { years: number; months: number; days: number; totalDays: number } {
  let years = now.getFullYear() - created.getFullYear()
  let months = now.getMonth() - created.getMonth()
  let days = now.getDate() - created.getDate()
  if (days < 0) {
    months -= 1
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate()
  }
  if (months < 0) {
    years -= 1
    months += 12
  }
  return {
    years,
    months,
    days,
    totalDays: Math.floor((now.getTime() - created.getTime()) / 86_400_000),
  }
}
