// network i/o via fetch(
import { apiFetch } from "@/lib/api-fetch"

export interface PwnedCheckResult {
  pwned: boolean
  count: number
  prefix: string
  sha1: string
}

export async function sha1Hex(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest("SHA-1", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()
}

export function parsePwnedRangeResponse(responseBody: string, targetSuffix: string): number {
  const upperSuffix = targetSuffix.toUpperCase().trim()
  const lines = responseBody.split(/\r?\n/)
  for (const line of lines) {
    const [suffix, countStr] = line.split(":")
    if (suffix && suffix.trim() === upperSuffix) {
      const count = parseInt(countStr?.trim() || "0", 10)
      return isNaN(count) ? 0 : count
    }
  }
  return 0
}

export async function checkPwnedPassword(password: string): Promise<PwnedCheckResult> {
  if (!password) {
    throw new Error("Please enter a password to test.")
  }

  const hash = await sha1Hex(password)
  const prefix = hash.slice(0, 5)
  const suffix = hash.slice(5)

  const url = `https://api.pwnedpasswords.com/range/${prefix}`
  const body = await apiFetch<string>(url, {
    headers: {
      "Add-Padding": "true",
    },
  })

  const count = parsePwnedRangeResponse(body, suffix)

  return {
    pwned: count > 0,
    count,
    prefix,
    sha1: `${prefix}***********************************`,
  }
}
