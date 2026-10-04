// network i/o via fetch(
import { apiFetch } from "@/lib/api-fetch"
import { getCached, setCached } from "@/lib/api-cache"
import { resolve, type DohAnswer } from "@/lib/doh"
import { fetchRdap, type RDAPDomainResponse } from "@/lib/rdap"
import { isDomain } from "@/lib/validators"

export interface DnssecCheckResult {
  domain: string
  status: "secure" | "insecure" | "bogus" | "indeterminate"
  statusLabel: string
  authenticatedData: boolean
  hasDs: boolean
  hasDnskey: boolean
  dsRecords: DohAnswer[]
  dnskeyRecords: DohAnswer[]
  aRecords: DohAnswer[]
  explanation: string
}

export async function checkDnssec(domainInput: string): Promise<DnssecCheckResult> {
  const clean = domainInput
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/\.+$/, "")
  if (!isDomain(clean)) {
    throw new Error("Please enter a valid domain name (e.g. example.com or cloudflare.com).")
  }

  const [dsRes, dnskeyRes, aRes] = await Promise.all([
    resolve(clean, "DS", "google", true).catch(() => null),
    resolve(clean, "DNSKEY", "google", true).catch(() => null),
    resolve(clean, "A", "google", true).catch(() => null),
  ])

  const dsRecords = (dsRes?.Answer ?? []).filter((r) => r.type === 43)
  const dnskeyRecords = (dnskeyRes?.Answer ?? []).filter((r) => r.type === 48)
  const aRecords = aRes?.Answer ?? []

  const hasDs = dsRecords.length > 0
  const hasDnskey = dnskeyRecords.length > 0
  const adFlag = Boolean(aRes?.AD || dsRes?.AD || dnskeyRes?.AD)

  let status: "secure" | "insecure" | "bogus" | "indeterminate" = "insecure"
  let statusLabel = "Unsigned (No DNSSEC)"
  let explanation =
    "No DS records were returned at the parent zone delegation. DNSSEC is not configured for this domain."

  if (aRes?.Status === 2) {
    status = "bogus"
    statusLabel = "Bogus (DNSSEC Validation Failed)"
    explanation =
      "The validating resolver returned SERVFAIL (RCODE 2), indicating a broken DNSSEC trust chain or invalid signatures."
  } else if (hasDs && hasDnskey && adFlag) {
    status = "secure"
    statusLabel = "DNSSEC Secure (Validated)"
    explanation =
      "The DNSSEC trust chain is valid. The public recursive resolver validated DS and DNSKEY records with the Authenticated Data (AD) flag."
  } else if (hasDs || hasDnskey) {
    status = "indeterminate"
    statusLabel = "Signed (Partial / Unconfirmed)"
    explanation =
      "DNSSEC records exist, but the upstream resolver did not assert full Authenticated Data (AD) validation on the queried records."
  }

  return {
    domain: clean,
    status,
    statusLabel,
    authenticatedData: adFlag,
    hasDs,
    hasDnskey,
    dsRecords,
    dnskeyRecords,
    aRecords,
    explanation,
  }
}

export interface DelegationCheckResult {
  domain: string
  registryNameservers: string[]
  liveNameservers: string[]
  matchingNameservers: string[]
  registryOnly: string[]
  liveOnly: string[]
  isConsistent: boolean
  verdict: "consistent" | "mismatch" | "partial" | "error"
  verdictLabel: string
  details: string
}

export async function checkNameserverDelegation(
  domainInput: string
): Promise<DelegationCheckResult> {
  const clean = domainInput
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/\.+$/, "")
  if (!isDomain(clean)) {
    throw new Error("Please enter a valid domain name (e.g. example.com).")
  }

  let registryNs: string[] = []
  try {
    const rdap = await fetchRdap<RDAPDomainResponse>("domain", clean)
    if (rdap.data?.nameservers && Array.isArray(rdap.data.nameservers)) {
      registryNs = rdap.data.nameservers
        .map((ns) => (ns.ldhName || "").trim().toLowerCase().replace(/\.+$/, ""))
        .filter(Boolean)
    }
  } catch {
    // RDAP can be unavailable or not supported for some ccTLDs
  }

  let liveNs: string[] = []
  try {
    const dohRes = await resolve(clean, "NS", "google", true)
    if (dohRes.Answer && Array.isArray(dohRes.Answer)) {
      liveNs = dohRes.Answer.map((a) =>
        (a.data || "").trim().toLowerCase().replace(/\.+$/, "")
      ).filter(Boolean)
    }
  } catch {
    // DoH query failed
  }

  const regSet = new Set(registryNs)
  const liveSet = new Set(liveNs)

  const matchingNameservers = [...regSet].filter((x) => liveSet.has(x)).sort()
  const registryOnly = [...regSet].filter((x) => !liveSet.has(x)).sort()
  const liveOnly = [...liveSet].filter((x) => !regSet.has(x)).sort()

  const isConsistent =
    registryNs.length > 0 && liveNs.length > 0 && registryOnly.length === 0 && liveOnly.length === 0

  let verdict: "consistent" | "mismatch" | "partial" | "error" = "consistent"
  let verdictLabel = "Consistent Delegation"
  let details =
    "Parent registry delegation and authoritative zone apex NS records match completely."

  if (registryNs.length === 0 && liveNs.length === 0) {
    verdict = "error"
    verdictLabel = "No Nameservers Found"
    details = "Could not discover nameservers from either RDAP registry data or live DNS queries."
  } else if (registryNs.length === 0) {
    verdict = "partial"
    verdictLabel = "Live DNS Only (No RDAP Data)"
    details =
      "Live NS records were resolved, but parent registry RDAP data was not available for this TLD."
  } else if (liveNs.length === 0) {
    verdict = "partial"
    verdictLabel = "Registry Only (No Live NS Answers)"
    details =
      "Parent registry specifies nameservers, but live NS queries returned no answers. Check DNS propagation."
  } else if (!isConsistent) {
    verdict = "mismatch"
    verdictLabel = "Delegation Mismatch"
    details =
      "Discrepancy detected between parent registry nameservers and live authoritative NS records."
  }

  return {
    domain: clean,
    registryNameservers: [...regSet].sort(),
    liveNameservers: [...liveSet].sort(),
    matchingNameservers,
    registryOnly,
    liveOnly,
    isConsistent,
    verdict,
    verdictLabel,
    details,
  }
}

export interface SubdomainFinderResult {
  domain: string
  subdomains: string[]
  totalCount: number
  cached: boolean
}

export async function findSubdomains(domainInput: string): Promise<SubdomainFinderResult> {
  const clean = domainInput
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/\.+$/, "")
  if (!isDomain(clean)) {
    throw new Error("Please enter a valid root or registered domain (e.g. example.com).")
  }

  const cacheKey = `subdomains_ct_${clean}`
  const cached = getCached<string[]>(cacheKey)
  if (cached) {
    return {
      domain: clean,
      subdomains: cached,
      totalCount: cached.length,
      cached: true,
    }
  }

  const url = `https://api.certspotter.com/v1/issuances?domain=${encodeURIComponent(clean)}&include_subdomains=true&expand=dns_names`
  const res = await apiFetch<Array<{ dns_names?: string[] }>>(url)

  if (!Array.isArray(res)) {
    throw new Error("Invalid response from Certificate Transparency index.")
  }

  const foundSet = new Set<string>()
  for (const item of res) {
    if (item.dns_names && Array.isArray(item.dns_names)) {
      for (const name of item.dns_names) {
        const c = name.trim().toLowerCase().replace(/\.+$/, "")
        if (c.startsWith("*.")) {
          const stripped = c.slice(2)
          if (stripped.endsWith(clean)) foundSet.add(stripped)
        } else if (c.endsWith(clean)) {
          foundSet.add(c)
        }
      }
    }
  }

  const subdomains = [...foundSet].sort((a, b) => a.localeCompare(b))
  setCached(cacheKey, subdomains, 60 * 60 * 1000) // 1 hour cache

  return {
    domain: clean,
    subdomains,
    totalCount: subdomains.length,
    cached: false,
  }
}

export interface ResolverComparisonResult {
  name: string
  type: string
  google: {
    status: number
    statusText: string
    authenticatedData: boolean
    answers: DohAnswer[]
    rttMs: number
  }
  cloudflare: {
    status: number
    statusText: string
    authenticatedData: boolean
    answers: DohAnswer[]
    rttMs: number
  }
  isIdentical: boolean
  ttlDifference: boolean
  notes: string[]
}

const RCODE_MAP: Record<number, string> = {
  0: "NOERROR",
  1: "FORMERR",
  2: "SERVFAIL",
  3: "NXDOMAIN",
  4: "NOTIMP",
  5: "REFUSED",
}

export async function compareResolvers(
  nameInput: string,
  recordType: string = "A"
): Promise<ResolverComparisonResult> {
  const clean = nameInput
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/\.+$/, "")
  if (!clean) {
    throw new Error("Please enter a domain or hostname to query.")
  }

  const t0Google = performance.now()
  const googlePromise = resolve(clean, recordType, "google", true)
    .then((res) => ({ res, rtt: Math.round(performance.now() - t0Google) }))
    .catch((err) => ({
      error: err instanceof Error ? err.message : String(err),
      rtt: Math.round(performance.now() - t0Google),
    }))

  const t0Cf = performance.now()
  const cfPromise = resolve(clean, recordType, "cloudflare", true)
    .then((res) => ({ res, rtt: Math.round(performance.now() - t0Cf) }))
    .catch((err) => ({
      error: err instanceof Error ? err.message : String(err),
      rtt: Math.round(performance.now() - t0Cf),
    }))

  const [gResult, cfResult] = await Promise.all([googlePromise, cfPromise])

  const gRes = "res" in gResult ? gResult.res : null
  const cfRes = "res" in cfResult ? cfResult.res : null

  const gAnswers = gRes?.Answer ?? []
  const cfAnswers = cfRes?.Answer ?? []

  const gData = gAnswers.map((a) => a.data.toLowerCase()).sort()
  const cfData = cfAnswers.map((a) => a.data.toLowerCase()).sort()

  const sameAnswers =
    gData.length === cfData.length && gData.every((val, idx) => val === cfData[idx])

  const sameStatus = (gRes?.Status ?? -1) === (cfRes?.Status ?? -1)
  const isIdentical = sameStatus && sameAnswers

  let ttlDiff = false
  if (sameAnswers && gAnswers.length > 0) {
    for (const ga of gAnswers) {
      const match = cfAnswers.find((ca) => ca.data.toLowerCase() === ga.data.toLowerCase())
      if (match && match.TTL !== ga.TTL) {
        ttlDiff = true
        break
      }
    }
  }

  const notes: string[] = []
  if (!sameStatus) {
    notes.push(
      `Status mismatch: Google returned ${RCODE_MAP[gRes?.Status ?? 0] || gRes?.Status} while Cloudflare returned ${RCODE_MAP[cfRes?.Status ?? 0] || cfRes?.Status}.`
    )
  }
  if (!sameAnswers) {
    notes.push("Returned record answers differ between Google DNS and Cloudflare DNS.")
  }
  if (ttlDiff) {
    notes.push("Record answers match, but TTLs differ due to independent cache expiration cycles.")
  }
  if (isIdentical && !ttlDiff) {
    notes.push("Both resolvers returned identical status and record answers.")
  }

  return {
    name: clean,
    type: recordType.toUpperCase(),
    google: {
      status: gRes?.Status ?? 999,
      statusText: RCODE_MAP[gRes?.Status ?? 999] || `RCODE ${gRes?.Status}`,
      authenticatedData: Boolean(gRes?.AD),
      answers: gAnswers,
      rttMs: gResult.rtt,
    },
    cloudflare: {
      status: cfRes?.Status ?? 999,
      statusText: RCODE_MAP[cfRes?.Status ?? 999] || `RCODE ${cfRes?.Status}`,
      authenticatedData: Boolean(cfRes?.AD),
      answers: cfAnswers,
      rttMs: cfResult.rtt,
    },
    isIdentical,
    ttlDifference: ttlDiff,
    notes,
  }
}
