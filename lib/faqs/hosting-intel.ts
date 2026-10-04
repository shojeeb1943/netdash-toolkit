import type { Faq } from "@/lib/tool-faqs"

export const hosting_intelFaqs: Record<string, Faq[]> = {
  "website-hosting-checker": [
    {
      q: "How does the website hosting checker detect a hosting provider?",
      a: "The tool resolves the domain DNS records (A, AAAA, and NS), checks reverse DNS PTR pointers, and queries the RIPEstat global routing database to identify the autonomous system (ASN) and network owner.",
    },
    {
      q: "Why does the tool show Cloudflare or Fastly instead of the actual server host?",
      a: "When a website uses a content delivery network or reverse proxy, DNS records point to the edge proxy IP addresses rather than origin servers, keeping the origin web host shielded behind the proxy.",
    },
    {
      q: "Can I inspect hosting details for IPv6 only domains?",
      a: "Yes. The checker queries both A (IPv4) and AAAA (IPv6) records, looking up network ownership and autonomous system details for whichever IP versions the domain advertises.",
    },
  ],
  "asn-lookup": [
    {
      q: "What is an Autonomous System Number (ASN)?",
      a: "An ASN is a globally unique identifier assigned by regional internet registries to a network or group of IP prefixes managed by a single administrative entity running BGP routing.",
    },
    {
      q: "What information does the ASN lookup tool return?",
      a: "It returns the registered organization name, registry allocation block, current BGP announcement status, and a list of all IP address prefixes announced by that autonomous system.",
    },
    {
      q: "Can I query an ASN with or without the AS prefix?",
      a: "Yes. You can enter either AS13335 or simply 13335, and the tool will automatically format the query for the RIPEstat database.",
    },
  ],
  "ip-abuse-contact-finder": [
    {
      q: "Where do the IP abuse contact email addresses come from?",
      a: "Abuse contacts are retrieved directly from authoritative Regional Internet Registry (RIR) databases including RIPE NCC, ARIN, APNIC, LACNIC, and AFRINIC via the RIPEstat API.",
    },
    {
      q: "When should I email an IP abuse contact?",
      a: "You should contact network abuse teams only for legitimate security issues such as spam campaigns, port scanning, DDoS attacks, malware hosting, or copyright infringements originating from that IP.",
    },
    {
      q: "Can I look up abuse contacts for an entire CIDR prefix?",
      a: "Yes. You can enter a single IP address or an entire CIDR network block such as 192.0.2.0/24 to find the responsible organization abuse desk.",
    },
  ],
  "bgp-prefix-lookup": [
    {
      q: "What is a BGP covering prefix?",
      a: "A BGP covering prefix is the most specific IP subnet block advertised in the global Border Gateway Protocol routing tables that encompasses the target IP address.",
    },
    {
      q: "Why does the BGP prefix differ from my local subnet mask?",
      a: "Local subnet masks divide internal private or assigned subnets, whereas BGP prefixes represent the aggregate routes announced globally across internet backbone routers.",
    },
    {
      q: "What does unannounced BGP status mean?",
      a: "An unannounced status indicates that while the IP block may be allocated by a registry, no active BGP routes for that subnet are currently being propagated across the global internet routing table.",
    },
  ],
  "ip-geolocation": [
    {
      q: "How accurate is IP address geolocation?",
      a: "IP geolocation provides an estimate based on registry allocations and internet routing. Country and city estimates are generally reliable for fixed connections, but may reflect the ISP data center rather than exact street address.",
    },
    {
      q: "Does IP geolocation reveal my physical home address?",
      a: "No. IP geolocation only identifies the internet service provider region, city, or routing hub, not a specific residential building or personal identity.",
    },
    {
      q: "Can VPNs or proxies alter the detected geolocation?",
      a: "Yes. If an IP belongs to a VPN server or proxy service, the lookup reflects the server location and hosting data center rather than the end user true geographical position.",
    },
  ],
  "my-ip-address": [
    {
      q: "What is the difference between my public IP and private IP?",
      a: "Your public IP is the address visible to websites on the global internet, assigned by your ISP. Your private IP (such as 192.168.1.5) is used only within your local network behind your router.",
    },
    {
      q: "Does this tool display IPv4 or IPv6?",
      a: "The tool detects whichever protocol your browser and ISP used to connect to the lookup service, displaying your public IPv4 or IPv6 address accordingly.",
    },
    {
      q: "Why does my public IP change periodically?",
      a: "Most residential internet providers assign dynamic IP addresses from a pool that rotate whenever your router reconnects or your ISP lease renews.",
    },
  ],
}
