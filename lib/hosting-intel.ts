// network i/o via fetch(
import { resolve, reverseDnsName } from "@/lib/doh"
import { getNetworkInfo, getAsOverview } from "@/lib/ripestat"
import { cleanDomain, isDomain } from "@/lib/validators"

export interface CloudAsnInfo {
  name: string
  isCdn: boolean
}

export const KNOWN_CLOUD_ASNS: Record<number, CloudAsnInfo> = {
  13335: { name: "Cloudflare", isCdn: true },
  54113: { name: "Fastly", isCdn: true },
  20940: { name: "Akamai", isCdn: true },
  16625: { name: "Akamai", isCdn: true },
  16509: { name: "Amazon Web Services (AWS)", isCdn: false },
  14618: { name: "Amazon Web Services (AWS)", isCdn: false },
  15169: { name: "Google Cloud", isCdn: false },
  396982: { name: "Google Cloud", isCdn: false },
  8075: { name: "Microsoft Azure", isCdn: false },
  14061: { name: "DigitalOcean", isCdn: false },
  16276: { name: "OVHcloud", isCdn: false },
  24940: { name: "Hetzner Online", isCdn: false },
  63949: { name: "Linode (Akamai)", isCdn: false },
  20473: { name: "Vultr / The Constant Company", isCdn: false },
}

export interface HostingCheckResult {
  domain: string
  ipv4Addresses: string[]
  ipv6Addresses: string[]
  nameservers: string[]
  ptrRecords: Record<string, string>
  asn?: number
  asnName?: string
  holder?: string
  country?: string
  prefix?: string
  isCdnFronted: boolean
  likelyHost: string
  note?: string
}

export async function checkWebsiteHosting(domainInput: string): Promise<HostingCheckResult> {
  const domain = cleanDomain(domainInput)
  if (!isDomain(domain)) {
    throw new Error("Invalid domain name. Please enter a valid hostname such as example.com.")
  }

  const [aRes, aaaaRes, nsRes] = await Promise.all([
    resolve(domain, "A", "google"),
    resolve(domain, "AAAA", "google"),
    resolve(domain, "NS", "google"),
  ])

  const ipv4Addresses = (aRes.Answer || []).filter((a) => a.type === 1).map((a) => a.data)
  const ipv6Addresses = (aaaaRes.Answer || []).filter((a) => a.type === 28).map((a) => a.data)
  const nameservers = (nsRes.Answer || [])
    .filter((a) => a.type === 2)
    .map((a) => a.data.replace(/\.$/, ""))

  const primaryIp = ipv4Addresses[0] || ipv6Addresses[0]
  if (!primaryIp) {
    throw new Error(`Could not resolve any IP address (A or AAAA) for ${domain}.`)
  }

  const ptrRecords: Record<string, string> = {}
  for (const ip of [...ipv4Addresses, ...ipv6Addresses].slice(0, 4)) {
    const ptrName = reverseDnsName(ip)
    if (ptrName) {
      try {
        const ptrRes = await resolve(ptrName, "PTR", "google")
        const ptr = ptrRes.Answer?.find((a) => a.type === 12)?.data?.replace(/\.$/, "")
        if (ptr) {
          ptrRecords[ip] = ptr
        }
      } catch {
        // ignore PTR error
      }
    }
  }

  let asn: number | undefined
  let holder: string | undefined
  let prefix: string | undefined

  try {
    const netInfo = await getNetworkInfo(primaryIp)
    if (netInfo.asns && netInfo.asns.length > 0) {
      const parsedAsn = parseInt(netInfo.asns[0].replace(/^as/i, ""), 10)
      if (!isNaN(parsedAsn)) {
        asn = parsedAsn
      }
    }
    holder = netInfo.holder
    prefix = netInfo.prefix
  } catch {
    // ignore
  }

  if (asn) {
    try {
      const asOverview = await getAsOverview(asn)
      if (asOverview.holder) {
        holder = asOverview.holder
      }
    } catch {
      // ignore
    }
  }

  const knownCloud = asn ? KNOWN_CLOUD_ASNS[asn] : undefined
  const isCdnFronted = knownCloud ? knownCloud.isCdn : false

  let likelyHost = "Unknown"
  let note: string | undefined

  if (knownCloud) {
    likelyHost = knownCloud.name
    if (knownCloud.isCdn) {
      note = `${knownCloud.name} is a content delivery network and proxy. Sites fronted by a CDN proxy conceal the underlying origin server.`
    }
  } else if (holder) {
    likelyHost = holder
  }

  return {
    domain,
    ipv4Addresses,
    ipv6Addresses,
    nameservers,
    ptrRecords,
    asn,
    holder,
    prefix,
    isCdnFronted,
    likelyHost,
    note,
  }
}
