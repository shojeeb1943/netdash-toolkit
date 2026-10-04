import type { Faq } from "@/lib/tool-faqs"

export const dns_depthFaqs: Record<string, Faq[]> = {
  "dnssec-checker": [
    {
      q: "What does the DNSSEC Authenticated Data flag indicate?",
      a: "The Authenticated Data (AD) flag in DNS responses confirms that the recursive resolver cryptographically verified digital signatures across the DNSSEC trust chain from the root zone down to the requested records.",
    },
    {
      q: "Why do some domains have DS records but unvalidated status?",
      a: "If DS records are published in the parent zone but DNSKEY records or RRSIG signatures are missing or mismatched at the authoritative server, validating resolvers detect a broken chain and return SERVFAIL.",
    },
    {
      q: "Does this tool audit the entire cryptographic chain locally?",
      a: "This checker queries public validating resolvers via DNS over HTTPS to inspect DS, DNSKEY, and Authenticated Data status rather than executing raw root-to-apex chain cryptography inside the browser.",
    },
  ],
  "nameserver-delegation-checker": [
    {
      q: "What is the difference between registry NS and live NS records?",
      a: "Registry nameservers are configured at the parent registrar and delegate authority, whereas live NS records are authoritative answers published inside the zone file itself at the apex.",
    },
    {
      q: "What causes a nameserver delegation mismatch?",
      a: "Delegation mismatches occur when nameservers are updated at the DNS hosting provider or registrar without synchronizing the corresponding NS records across both systems, or during active DNS migrations.",
    },
    {
      q: "What is a lame delegation in DNS?",
      a: "A lame delegation happens when a parent registry nameserver points to a server that is unreachable, does not answer, or is not configured to provide authoritative answers for that specific domain zone.",
    },
  ],
  "subdomain-finder": [
    {
      q: "How does this tool discover subdomains without brute force?",
      a: "It queries Certificate Transparency (CT) logs, which are public append-only ledgers of all SSL/TLS certificates issued by Certificate Authorities for the target domain and its subdomains.",
    },
    {
      q: "Are wildcard certificates included in the subdomain results?",
      a: "Wildcard certificates (such as *.example.com) are cataloged by CT logs; this tool strips wildcard prefixes and extracts unique known hostnames into a clean, deduplicated list.",
    },
    {
      q: "Why might some active subdomains not appear in CT logs?",
      a: "A subdomain will not appear in Certificate Transparency logs if it has never had a dedicated public SSL certificate issued, or if it only uses a generic wildcard certificate without individual host issuances.",
    },
  ],
  "dns-resolver-comparison": [
    {
      q: "Why compare Google DNS and Cloudflare DNS side by side?",
      a: "Comparing major public resolvers helps detect DNS propagation delays, regional caching variance, geo-DNS routing splits, and recursive resolver configuration differences in real time.",
    },
    {
      q: "Why do TTL values differ between Google and Cloudflare?",
      a: "Time-to-live (TTL) counters tick down independently on each resolver based on when each server first received and cached the record from the authoritative nameserver.",
    },
    {
      q: "Can this comparison tool test different DNS record types?",
      a: "Yes, you can compare responses for A, AAAA, CNAME, MX, TXT, NS, SOA, and PTR records across both Google DNS and Cloudflare DNS simultaneously.",
    },
  ],
}
