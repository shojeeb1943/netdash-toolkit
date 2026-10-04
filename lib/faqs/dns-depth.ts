import type { Faq } from "@/lib/tool-faqs"

export const dns_depthFaqs: Record<string, Faq[]> = {
  "dns-propagation-checker": [
    {
      q: "How does the DNS Propagation Checker test global DNS resolution?",
      a: "It queries over 20 recursive DNS servers located in North America, Europe, Asia, South America, and Australia in real time to verify whether your updated A, AAAA, CNAME, MX, or TXT records have propagated worldwide.",
    },
    {
      q: "Why does DNS propagation take time across the globe?",
      a: "Recursive DNS resolvers cache records based on the Time-To-Live (TTL) value specified in your DNS zone. Resolvers will not fetch updated records until their local cached TTL expires.",
    },
    {
      q: "How can I speed up DNS propagation before migrating servers?",
      a: "Lower your DNS record TTL to 300 seconds (5 minutes) at least 24 to 48 hours prior to server migration. Once migration cutover is complete, you can restore standard TTLs (86400s).",
    },
    {
      q: "Are my DNS check queries stored or published publicly?",
      a: "No. Propagation checks query public DNS servers in real time. No search queries, IP mappings, or domain names are recorded.",
    },
    {
      q: "What does it mean if some locations return old IP addresses while others return new ones?",
      a: "This indicates normal active propagation in progress. Resolvers with expired cache timers have pulled the new IP, while resolvers with active cache counters will update once their TTL expires.",
    },
    {
      q: "What related tool inspects complete authoritative DNS zone records?",
      a: "Use the DNS Lookup tool to perform detailed queries across all record types on authoritative nameservers.",
    },
  ],
  "dns-lookup": [
    {
      q: "What record types can I query with the DNS Lookup tool?",
      a: "You can query all standard DNS record types including A (IPv4), AAAA (IPv6), CNAME (canonical name), MX (mail exchange), TXT (text & SPF), NS (nameservers), SOA (authority), SRV (services), and CAA (certificate authority).",
    },
    {
      q: "What is the difference between authoritative and recursive DNS lookups?",
      a: "Authoritative lookups query the master nameservers directly for ground-truth zone data. Recursive lookups query public resolvers (e.g. Google 8.8.8.8, Cloudflare 1.1.1.1) to view cached public responses.",
    },
    {
      q: "How do CNAME records function in DNS routing?",
      a: "A CNAME (Canonical Name) record aliases one domain name to another canonical hostname. Resolvers automatically follow CNAME chains until an A or AAAA address record is reached.",
    },
    {
      q: "Is my DNS lookup query logged or tracked by LicenBase?",
      a: "No. All DNS lookups execute in real time. We do not store, archive, or analyze any queried domain names or IP records.",
    },
    {
      q: "What related tool checks Reverse DNS (IP to hostname) mapping?",
      a: "Use the Reverse DNS Lookup tool or PTR Lookup tool to verify Reverse DNS mappings for your server IP addresses.",
    },
    {
      q: "Why do some TXT records appear split into multiple quoted strings?",
      a: "RFC 4408 limits individual TXT string segments to 255 characters. Longer records (such as 2048-bit DKIM public keys) are split into concatenated 255-byte strings that resolvers combine seamlessly.",
    },
  ],
  "reverse-dns-lookup": [
    {
      q: "What is Reverse DNS (rDNS) and why is it essential?",
      a: "Reverse DNS resolves an IP address back to its associated domain hostname via PTR records. It is critical for mail server reputation, anti-spam validation, and network diagnostic logging.",
    },
    {
      q: "What happens if a mail server lacks a matching Reverse DNS record?",
      a: "Major email providers like Gmail, Yahoo, and Microsoft will reject incoming emails or flag them as spam if the sending IP lacks an rDNS PTR record that matches the mail server HELO banner.",
    },
    {
      q: "Where do I configure Reverse DNS for my VPS or dedicated server?",
      a: "Reverse DNS must be configured in your hosting provider's datacenter management console, as the IP subnet owner controls the in-addr.arpa delegation zone.",
    },
    {
      q: "Is any IP address I search logged on remote servers?",
      a: "No. The lookup queries authoritative reverse DNS servers in real time. No IP queries or diagnostic logs are retained.",
    },
    {
      q: "What is the difference between IPv4 and IPv6 reverse DNS zones?",
      a: "IPv4 reverse records are placed in the in-addr.arpa zone using dotted-quad octets in reverse order (e.g. 1.2.0.192.in-addr.arpa). IPv6 records use the ip6.arpa zone with nibble-reversed hex digits.",
    },
    {
      q: "What related tool checks mail server routing and MX records?",
      a: "Use the MX Lookup tool to verify mail exchange server priority and IP routing configurations.",
    },
  ],
  "mx-lookup": [
    {
      q: "What information does the MX Lookup tool provide?",
      a: "It retrieves all Mail Exchange (MX) records for a domain, displaying the mail server hostnames, priority numbers, associated IPv4/IPv6 addresses, and reverse DNS validation status.",
    },
    {
      q: "How does MX record priority determine email routing?",
      a: "Sending mail servers deliver messages to the MX record with the lowest numerical priority first (e.g. Priority 10). If the primary server is unreachable, mail queues failover to secondary servers (e.g. Priority 20).",
    },
    {
      q: "Can an MX record point directly to an IP address?",
      a: "No. RFC standards mandate that MX records must point to a canonical domain hostname (A/AAAA record) and cannot point directly to an IP address or a CNAME alias.",
    },
    {
      q: "Are my searched email domains logged or tracked?",
      a: "No. MX lookups query authoritative DNS nameservers in real time. No domain searches or mail server configurations are stored.",
    },
    {
      q: "What related tools help verify email deliverability and security?",
      a: "Use the SPF Record Generator, DKIM Record Generator, and DMARC Record Generator in the Email category to configure complete email security records.",
    },
    {
      q: "What happens if a domain has no MX records configured?",
      a: "If no MX records exist, sending mail servers will attempt fallback delivery directly to the domain's primary A record as defined in RFC 5321.",
    },
  ],
}
