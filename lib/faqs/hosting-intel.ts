import type { Faq } from "@/lib/tool-faqs"

export const hosting_intelFaqs: Record<string, Faq[]> = {
  "website-hosting-checker": [
    {
      q: "What information does the Website Hosting Checker reveal?",
      a: "It identifies the hosting provider, datacenter ASN, cloud infrastructure (e.g. AWS, Cloudflare, OVH, DigitalOcean), public IPv4/IPv6 addresses, web server technology, and country location for any website URL.",
    },
    {
      q: "How does this tool detect hosting providers behind Cloudflare or proxy CDNs?",
      a: "When a site uses a reverse proxy like Cloudflare, the primary A record returns proxy IPs. The tool indicates when edge CDN acceleration is active and checks historical records to uncover origin hosting infrastructure where available.",
    },
    {
      q: "Is my target website search query logged or published?",
      a: "No. All hosting checks run in real time for diagnostic evaluation only. We never log, track, or publish domain searches.",
    },
    {
      q: "What related tool provides detailed autonomous system information?",
      a: "Use the ASN Lookup tool to inspect the full BGP Autonomous System Number, routing prefixes, and network ownership details for the hosting provider.",
    },
    {
      q: "How can I verify server response headers for a hosted website?",
      a: "Use the HTTP Headers Lookup tool to inspect active web server versions, caching directives, and security response headers directly.",
    },
    {
      q: "What tools help identify the CMS powering a hosted website?",
      a: "Inspecting HTML source tags, WP Toolkit headers, and public robots.txt files reveals whether a website runs on WordPress, Joomla, Drupal, or custom platforms.",
    },
  ],
  "asn-lookup": [
    {
      q: "What is an Autonomous System Number (ASN) and what does this tool display?",
      a: "An ASN is a globally unique identifier assigned to an autonomous network (ISP, datacenter, cloud provider). This tool queries regional internet registries (RIPE, ARIN, APNIC) to display AS name, organization, country, and announced IP prefixes.",
    },
    {
      q: "Why is ASN intelligence valuable for network engineers and sysadmins?",
      a: "ASN data reveals network peering relationships, routing redundancy, upstream internet transit providers, and helps administrators configure BGP routing policies and firewall ASN-based IP blocking.",
    },
    {
      q: "Can I search by both ASN number (e.g. AS15169) and IP address?",
      a: "Yes. You can enter an ASN number (e.g. AS13335) to inspect network ownership, or enter an IP address to identify which Autonomous System owns that specific IP.",
    },
    {
      q: "Are my ASN lookups logged or shared externally?",
      a: "No. All queries query public BGP and WHOIS routing registries in real time without recording your query history.",
    },
    {
      q: "What related tool inspects all IP prefixes announced by an ASN?",
      a: "Use the BGP Prefix Lookup tool to list all CIDR subnets and IPv4/IPv6 address ranges announced by a specific Autonomous System.",
    },
    {
      q: "How do firewalls like CSF or Imunify360 use ASN blocking?",
      a: "Security firewalls allow administrators to block entire Autonomous Systems known for bulletproof hosting or massive botnet scanning, blocking thousands of malicious IPs with a single rule.",
    },
  ],
  "ip-abuse-contact-finder": [
    {
      q: "What does the IP Abuse Contact Finder do?",
      a: "It queries regional internet registries (ARIN, RIPE, APNIC, LACNIC, AFRINIC) to extract official designated abuse reporting email addresses, telephone numbers, and network ownership contacts for any IP address.",
    },
    {
      q: "When should I use an abuse contact email address?",
      a: "Use abuse contact emails to submit formal reports when experiencing malicious brute-force attacks, DDoS floods, phishing campaigns, copyright infringement, or spam originating from a specific IP address.",
    },
    {
      q: "What evidence should be included in a formal abuse report?",
      a: "Include raw server access/auth logs with UTC timestamps, target IP addresses, source IP addresses, attacked ports, and packet samples to allow datacenter abuse teams to investigate and terminate offending accounts.",
    },
    {
      q: "Is my reported IP lookup shared with the offending network?",
      a: "No. Searching an IP on this tool performs a read-only registry lookup. No notifications or queries are sent to the network owner.",
    },
    {
      q: "What related tool helps pinpoint the physical location of an abusive IP?",
      a: "Use the IP Geolocation tool to identify the city, country, ISP, and approximate geographic coordinates of the attacking IP address.",
    },
    {
      q: "What is the difference between an abuse contact and a tech contact in WHOIS?",
      a: "Tech contacts manage routine BGP routing and nameserver records. Abuse contacts are legally designated personnel required to investigate network security violations and abuse complaints.",
    },
  ],
  "bgp-prefix-lookup": [
    {
      q: "What is a BGP Prefix and what does this tool inspect?",
      a: "A BGP prefix is an IP address block (CIDR subnet) announced to global Border Gateway Protocol routing tables. This tool retrieves all active IPv4 and IPv6 prefixes broadcast by a target Autonomous System.",
    },
    {
      q: "Why is BGP prefix tracking important for DDoS mitigation and routing?",
      a: "Tracking announced prefixes allows network engineers to verify route propagation, detect BGP route hijacking incidents, and construct accurate access control lists (ACLs) for peering networks.",
    },
    {
      q: "How many IP addresses are contained in a standard /24 BGP prefix?",
      a: "A /24 IPv4 prefix is the minimum subnet size accepted in global BGP routing tables and contains exactly 256 IP addresses (254 usable host addresses).",
    },
    {
      q: "Are my BGP routing queries tracked or saved?",
      a: "No. All prefix data is retrieved from public routing information bases (RIBs) in real time. Your searches remain strictly confidential.",
    },
    {
      q: "What related tool helps convert and calculate CIDR prefix masks?",
      a: "Use the Subnet Calculator and CIDR Reference tools in the Calculators category to calculate network bounds, broadcast addresses, and usable host ranges for any prefix.",
    },
    {
      q: "What is RPKI and how does it protect BGP prefix announcements?",
      a: "Resource Public Key Infrastructure (RPKI) uses cryptographic Route Origin Authorizations (ROAs) to prove that an ASN is authorized to announce specific IP prefixes, preventing accidental or malicious route hijacking.",
    },
  ],
  "ip-geolocation": [
    {
      q: "What data does the IP Geolocation tool provide?",
      a: "It queries IP location databases to return the country, region, city, postal code, geographic latitude/longitude coordinates, timezone, ISP, and Autonomous System details for any public IPv4 or IPv6 address.",
    },
    {
      q: "How accurate is IP geolocation data?",
      a: "Country-level accuracy is approximately 99%, state/region accuracy is ~90%, and city-level accuracy is ~80%. Geolocation identifies the network routing node or ISP distribution center rather than a physical street address.",
    },
    {
      q: "Why do VPN and mobile cellular IPs sometimes report different cities?",
      a: "Cellular carriers route mobile traffic through centralized regional gateway hubs, and VPN providers route traffic through remote exit nodes, reflecting the gateway location rather than the user's physical device.",
    },
    {
      q: "Is my searched IP address logged or stored in a database?",
      a: "No. All geolocation lookups execute in real time. We do not maintain logs or share queried IP addresses with third parties.",
    },
    {
      q: "What related tool reveals your own public IP address and connection details?",
      a: "Use the My IP Address tool to instantly view your current public IPv4/IPv6 address, ISP, and browser connection parameters.",
    },
    {
      q: "How can web applications use IP geolocation for security?",
      a: "Applications use geolocation to enforce geo-blocking (restricting logins to specific countries), detect impossible travel logins (logins from two countries within minutes), and localize currencies.",
    },
  ],
  "my-ip-address": [
    {
      q: "What information does the My IP Address tool display?",
      a: "It detects your public IPv4 and IPv6 address, internet service provider (ISP), Autonomous System (ASN), estimated geographic location, and browser connection metadata.",
    },
    {
      q: "What is the difference between a public IP and a private local IP?",
      a: "Your public IP is assigned by your ISP and visible to all websites on the internet. Private local IPs (e.g. 192.168.1.x or 10.0.0.x) are assigned by your local Wi-Fi router and are never routable over the public internet.",
    },
    {
      q: "Why do I see an IPv6 address instead of an IPv4 address?",
      a: "If your ISP and home network support dual-stack IPv6, modern web browsers prioritize connecting over native IPv6 protocols. The tool displays both IPv4 and IPv6 when available.",
    },
    {
      q: "Does LicenBase store or track my personal IP address?",
      a: "No. The tool reads your client connection IP during page load to display it on your screen. None of your IP data, browser headers, or location data are logged or saved.",
    },
    {
      q: "What tool helps look up detailed network and abuse contacts for an IP?",
      a: "Use the IP Abuse Contact Finder and ASN Lookup tools to inspect network ownership and routing parameters for any public IP address.",
    },
    {
      q: "How does a VPN or proxy change your public IP address?",
      a: "A VPN encrypts your traffic and routes it through an intermediary server, replacing your ISP-assigned public IP address with the VPN server's public IP.",
    },
  ],
}
