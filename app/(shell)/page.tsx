import type { Metadata } from "next"
import { Dashboard } from "@/components/dashboard"
import { BRAND, canonical } from "@/lib/site"

const TITLE = `Free Network & Sysadmin Tools \u2013 DNS, Subnet & IP | ${BRAND}`
const DESCRIPTION =
  "Free online sysadmin and network tools: subnet calculators, DNS lookup, IP converters, TLS checks, and packet diagnostics. Fast, secure, and browser-based."

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "network engineering",
    "subnet calculator",
    "cidr",
    "dns lookup",
    "network tools",
    "ipv6",
    "vlsm",
    "sysadmin tools",
    "ip converter",
    "whois lookup",
  ],
  alternates: { canonical: canonical("/") },
  openGraph: { title: TITLE, description: DESCRIPTION, url: canonical("/") },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
}

export default function HomePage() {
  return <Dashboard />
}
