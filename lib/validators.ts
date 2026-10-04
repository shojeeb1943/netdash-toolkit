import { isValidIPv4, isValidIPv6, isValidCIDR } from "@/lib/network-utils"

const DOMAIN_REGEX = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i

export function isDomain(val: string): boolean {
  return DOMAIN_REGEX.test(val.trim())
}

export function cleanDomain(val: string): string {
  return val
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
}

export function isIpv4(val: string): boolean {
  return isValidIPv4(val.trim())
}

export function isIpv6(val: string): boolean {
  return isValidIPv6(val.trim())
}

export function isIp(val: string): boolean {
  const t = val.trim()
  return isValidIPv4(t) || isValidIPv6(t)
}

export function isCidr(val: string): boolean {
  return isValidCIDR(val.trim())
}

export function isAsn(val: string): boolean {
  const clean = val.trim().replace(/^as/i, "")
  if (!/^\d+$/.test(clean)) return false
  const num = parseInt(clean, 10)
  return num > 0 && num <= 4294967295
}

export function cleanAsn(val: string): string {
  return val.trim().replace(/^as/i, "")
}
