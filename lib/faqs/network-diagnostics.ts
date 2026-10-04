import type { Faq } from "@/lib/tool-faqs"

export const network_diagnosticsFaqs: Record<string, Faq[]> = {
  "network-tester": [
    {
      q: "What diagnostic checks does the Network Tester execute?",
      a: "The Network Tester evaluates latency, packet jitter, download and upload throughput, browser WebSocket connectivity, and local WebRTC network interfaces directly from your client environment.",
    },
    {
      q: "How does the tool measure round-trip latency and jitter?",
      a: "It transmits consecutive HTTP/HTTPS timing pings and WebSocket frames to distributed edge endpoints, calculating mean latency, minimum and maximum spikes, and standard deviation jitter.",
    },
    {
      q: "Can browser-based network tests replace hardware network analyzers?",
      a: "Browser tests provide accurate application-layer throughput and latency benchmarks. However, they cannot measure raw Layer 2 frame drops, hardware link errors, or low-level ICMP routing metrics restricted by browser sandboxing.",
    },
    {
      q: "Are test payloads or local IP addresses logged on remote servers?",
      a: "No. Speed test streams and latency beacons are ephemeral data buffers discarded immediately upon test completion. No telemetry or browsing history is stored.",
    },
    {
      q: "What factors can cause temporary throughput drops during the test?",
      a: "Local Wi-Fi interference, background operating system updates, active VPN tunnels, or browser extension proxy overhead can temporarily throttle measured connection speeds.",
    },
    {
      q: "What tool should I use if I suspect specific port or routing latency issues?",
      a: "Use the Ping & Traceroute or Port Scanner tool to test remote host reachability and analyze individual network hops.",
    },
  ],
  "dns-tools": [
    {
      q: "What record types can I inspect using the DNS Tools suite?",
      a: "The tool queries and parses A, AAAA, CNAME, MX, TXT, NS, SOA, PTR, SRV, CAA, and DNSKEY records across authoritative nameservers and public recursive resolvers.",
    },
    {
      q: "How does the tool query DNS records without browser UDP socket restrictions?",
      a: "It uses standard DNS over HTTPS (DoH) protocols defined in RFC 8484 to query secure, privacy-preserving recursive resolvers such as Cloudflare (1.1.1.1) and Google (8.8.8.8).",
    },
    {
      q: "Why do my updated DNS records show old values in lookup results?",
      a: "DNS records are cached by recursive resolvers for the duration specified by their Time to Live (TTL) value. Until the TTL expires, resolvers return cached responses instead of querying authoritative nameservers.",
    },
    {
      q: "Can DNS Tools verify DNSSEC cryptographic signatures?",
      a: "Yes. Enabling DNSSEC validation inspects RRSIG signatures, DS records in the parent zone, and DNSKEY trust anchors to confirm that responses have not been spoofed or intercepted.",
    },
    {
      q: "Are my domain lookup queries logged or shared with third parties?",
      a: "No. All queries are sent directly over encrypted DoH channels. LicenBase does not store, index, or sell domain search logs.",
    },
    {
      q: "What tool should I use to verify email authentication records like SPF, DKIM, and DMARC?",
      a: "Use the Email Diagnostics or SPF & DKIM Checker tool to validate email security records and detect syntax errors.",
    },
  ],
  "ping-traceroute": [
    {
      q: "How does the browser-based Ping & Traceroute tool measure host reachability?",
      a: "The tool uses precise HTTP/WebSocket timing probes and distributed edge API beacons to measure round-trip response times, packet loss frequency, and network path transit across geographic points of presence.",
    },
    {
      q: "Why does browser sandboxing prevent native ICMP Echo pings?",
      a: "Web browsers restrict raw socket access (Layer 3/4 ICMP and raw UDP) for client security. The tool bridges this by measuring real application-layer response latency and edge server traceroute data.",
    },
    {
      q: "What does high latency on intermediate traceroute hops indicate?",
      a: "Intermediate routers often deprioritize ICMP or diagnostic responses to protect CPU resources. If subsequent hops return normal low latency, intermediate spikes do not indicate an actual network bottleneck.",
    },
    {
      q: "Can I test both IPv4 addresses and IPv6 hostnames?",
      a: "Yes. The tool resolves dual-stack hostnames and supports direct IPv4 and IPv6 target destinations to verify routing symmetry.",
    },
    {
      q: "Is the destination host or domain name shared publicly?",
      a: "No. Target diagnostics run ephemerally on demand. Destination endpoints and query timestamps are not retained in any public query database.",
    },
    {
      q: "What tool should I use if I need to check whether specific service ports are accepting connections?",
      a: "Use the Port Scanner tool to test connectivity across standard HTTP, HTTPS, SSH, FTP, and mail server ports.",
    },
  ],
  "port-scanner": [
    {
      q: "Which network services and ports can the Port Scanner check?",
      a: "The tool checks standard infrastructure ports including HTTP (80), HTTPS (443), SSH (22), FTP (21), SMTP (25/587), IMAP (993), POP3 (995), MySQL (3306), PostgreSQL (5432), and custom server ports.",
    },
    {
      q: "What is the difference between Open, Closed, and Filtered port status?",
      a: "Open means the service responded and accepted connection SYN packets. Closed means the host actively rejected the connection (RST). Filtered indicates an intermediate firewall silently dropped the request without responding.",
    },
    {
      q: "Why does a firewall make open ports appear filtered or timed out?",
      a: "Stateful firewalls like iptables, UFW, or cloud security groups drop incoming packets that do not match permitted access rules, causing diagnostic probes to expire after the timeout threshold.",
    },
    {
      q: "Is port scanning safe and compliant with cloud hosting provider policies?",
      a: "The tool performs lightweight single-probe connection tests against publicly accessible services rather than aggressive vulnerability probing, ensuring safe diagnostic checks for server administrators.",
    },
    {
      q: "Are scan targets, discovered open ports, or IP addresses stored?",
      a: "No. Port scan execution is completely stateless. Target hostnames, IPs, and scan results are discarded immediately once rendered in your browser.",
    },
    {
      q: "What tool should I use to inspect SSL/TLS certificates on discovered HTTPS ports?",
      a: "Use the SSL Checker tool to examine certificate validity, cipher suites, issuer chains, and expiration dates on port 443.",
    },
  ],
  "ssl-checker": [
    {
      q: "What certificate attributes are analyzed by the SSL Checker?",
      a: "The tool inspects the Subject Common Name (CN), Subject Alternative Names (SANs), certificate authority issuer chain, validity period, expiration countdown, key algorithm, and supported TLS protocol versions.",
    },
    {
      q: "How does the tool detect broken or incomplete intermediate certificate chains?",
      a: "It verifies that the server delivers all intermediate CA certificates required to establish a continuous trust path up to an authoritative root store. Missing intermediates cause trust errors on mobile devices.",
    },
    {
      q: "What causes the common SSL Error 'Certificate Name Mismatch'?",
      a: "This occurs when the domain name in the browser address bar does not match any entry listed in the certificate Subject Alternative Name (SAN) extension.",
    },
    {
      q: "Does the SSL Checker verify modern TLS 1.3 protocol support and secure ciphers?",
      a: "Yes. It verifies whether the target web server supports TLS 1.2 and TLS 1.3 and flags obsolete or insecure legacy protocols like SSL 3.0, TLS 1.0, and TLS 1.1.",
    },
    {
      q: "Is my SSL/TLS diagnostic check recorded or publicly exposed?",
      a: "No. Certificate handshakes are negotiated directly with the target server. No domain logs or certificate inspection results are retained.",
    },
    {
      q: "What tool should I use to verify that HTTP traffic automatically redirects to secure HTTPS?",
      a: "Use the Redirect Checker or HTTP Headers tool to verify 301 permanent redirects and HSTS header implementation.",
    },
  ],
  "email-diagnostics": [
    {
      q: "What components of email server configuration does Email Diagnostics evaluate?",
      a: "The tool inspects MX priority records, SPF syntax, DKIM public key records, DMARC alignment policies, reverse DNS (PTR) matching, and SMTP port connectivity.",
    },
    {
      q: "Why is a valid reverse DNS (PTR) record mandatory for outbound mail delivery?",
      a: "Major receiving mail providers (such as Gmail, Yahoo, and Outlook) immediately reject or spam-box emails sent from IP addresses whose PTR hostname does not match their forward DNS A record.",
    },
    {
      q: "How does DMARC policy enforcement protect your domain from email spoofing?",
      a: "DMARC instructs receiving mail servers to quarantine or reject unauthenticated messages that fail SPF or DKIM alignment checks, preventing phishing attacks using your brand domain.",
    },
    {
      q: "What is the consequence of exceeding the SPF 10-DNS-lookup limit?",
      a: "RFC 7208 mandates that SPF evaluation must not require more than 10 nested DNS lookups. Exceeding this limit causes receiving mail servers to return an SPF PermError and mark emails as unauthenticated.",
    },
    {
      q: "Are test email addresses or domains logged in external databases?",
      a: "No. All MX and TXT record inspections occur through direct real-time DNS queries. No email addresses or domain queries are retained.",
    },
    {
      q: "What tool should I use to generate a strict SPF or DMARC record if mine has errors?",
      a: "Use the SPF Record Generator or DMARC Generator tool to build syntax-validated, standards-compliant DNS authentication records.",
    },
  ],
  "http-headers": [
    {
      q: "What information is revealed by the HTTP Headers inspection tool?",
      a: "The tool captures full HTTP response status codes (e.g. 200 OK, 301 Moved, 404 Not Found), response headers, server software signatures, caching directives, content types, and compression headers.",
    },
    {
      q: "How do caching headers like Cache-Control and ETag impact web performance?",
      a: "Cache-Control headers instruct browsers and CDN edge servers how long to cache static assets locally, preventing unnecessary round trips and reducing origin server bandwidth consumption.",
    },
    {
      q: "Why should web servers hide or sanitize the Server and X-Powered-By headers?",
      a: "Exposing exact web server and framework version numbers (such as Apache 2.4.41 or PHP 8.1.2) helps malicious actors target known vulnerabilities specific to those software releases.",
    },
    {
      q: "Can I test custom user-agent headers and custom request headers?",
      a: "Yes. You can customize request headers to simulate mobile browsers, Googlebot crawlers, or authenticated API client requests.",
    },
    {
      q: "Are scanned URLs or sensitive authentication headers logged?",
      a: "No. The header inspection executes on demand. Authorization tokens and inspected response headers are displayed in your browser and not saved to disk.",
    },
    {
      q: "What tool should I use to specifically audit web security headers like CSP and HSTS?",
      a: "Use the Security Headers Analyzer to grade your site security posture across CSP, HSTS, X-Frame-Options, and Permissions-Policy headers.",
    },
  ],
  "security-headers": [
    {
      q: "Which core HTTP security headers are audited by this tool?",
      a: "The analyzer evaluates Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy.",
    },
    {
      q: "How does a Content Security Policy (CSP) prevent cross-site scripting (XSS) attacks?",
      a: "CSP defines an explicit whitelist of trusted origins from which scripts, styles, images, and fonts can load, preventing malicious inline scripts and unauthorized third-party code injection.",
    },
    {
      q: "Why is the includeSubDomains and preload directive critical for HSTS?",
      a: "The includeSubDomains directive extends mandatory HTTPS to all subdomains, while preload qualifies the domain for inclusion in browser hardcoded HTTPS lists, eliminating initial insecure HTTP connections.",
    },
    {
      q: "How does the tool calculate the security posture letter grade (A+ to F)?",
      a: "The scoring algorithm weighs presence, correct syntax, and directive strength across essential security headers, penalizing missing headers or overly permissive configurations like unsafe-inline in CSP.",
    },
    {
      q: "Are security header audit reports stored or publicly searchable?",
      a: "No. All audits are performed ephemerally. Results and vulnerability notes are rendered locally and never cataloged in public ranking tables.",
    },
    {
      q: "What tool should I use to generate a custom Content-Security-Policy header?",
      a: "Use the CSP Generator or CSP Hash Generator tool to build strict, compliant policy directives tailored to your web application.",
    },
  ],
  "redirect-checker": [
    {
      q: "What redirect metrics and status codes are tracked by the Redirect Checker?",
      a: "The tool maps complete redirect sequences, capturing HTTP 301 (Permanent), 302 (Found), 307 (Temporary), and 308 (Permanent) status codes along with intermediate latency and final destination URLs.",
    },
    {
      q: "Why are redirect chains harmful to SEO rankings and page speed?",
      a: "Every redirect hop introduces additional TCP handshakes, TLS negotiations, and server processing delay. Multi-hop chains dilute link equity (PageRank) and can cause search crawlers to abandon indexing.",
    },
    {
      q: "What is a redirect loop and how does the tool detect it?",
      a: "A redirect loop occurs when URL A redirects to URL B, which redirects back to URL A (or through intermediate steps), causing browsers to display ERR_TOO_MANY_REDIRECTS. The checker halts and flags the cyclical URL.",
    },
    {
      q: "Does the tool follow both HTTP header redirects and HTML meta refresh redirects?",
      a: "Yes. It inspects server HTTP Location headers as well as client-side HTML meta http-equiv='refresh' tags to trace the true final destination.",
    },
    {
      q: "Are tested redirect URLs tracked or logged?",
      a: "No. Redirect inspections are executed strictly on request without persistent query logging or third-party data sharing.",
    },
    {
      q: "What tool should I use to create clean URL redirect rules for Apache or Nginx?",
      a: "Use the Htaccess Generator or Nginx Config Generator to create high-performance 301 redirect directives.",
    },
  ],
  "user-agent-parser": [
    {
      q: "What information does the User-Agent Parser extract from user-agent strings?",
      a: "The parser identifies the browser family and version, rendering engine (Blink, Gecko, WebKit), operating system, CPU architecture, device vendor, and hardware type (mobile, tablet, desktop, bot).",
    },
    {
      q: "How does the tool distinguish between legitimate search engine bots and regular browsers?",
      a: "It matches crawler signatures from Googlebot, Bingbot, Yandex, Baidu, and social preview bots (e.g. Twitterbot, FacebookExternalHit), detailing their crawler type and verification guidelines.",
    },
    {
      q: "How does the parser handle Client Hints and modern frozen user-agent strings?",
      a: "Modern browsers freeze UA strings to protect user privacy (e.g. reporting generic OS versions). The parser decodes both standard UA strings and User-Agent Client Hints (Sec-CH-UA) when available.",
    },
    {
      q: "Can I parse user-agent strings copied from web server access logs?",
      a: "Yes. Simply paste raw user-agent strings from Apache, Nginx, Cloudflare, or AWS CloudFront access logs to inspect visitor device metrics instantly.",
    },
    {
      q: "Is my current browser user-agent string transmitted to any server?",
      a: "No. Detection runs client-side using JavaScript regex pattern matching directly against navigator.userAgent and your provided text strings.",
    },
    {
      q: "What tool should I use if I need to build robot crawling rules based on user-agent names?",
      a: "Use the Robots.txt Generator to create targeted crawl delay and directory allow/disallow directives for specific web spiders.",
    },
  ],
  "dns-resolver-comparison": [
    {
      q: "What public recursive DNS resolvers are benchmarked by this tool?",
      a: "The tool benchmarks response latency and resolution accuracy across major global providers including Cloudflare (1.1.1.1), Google (8.8.8.8), Quad9 (9.9.9.9), OpenDNS (208.67.222.222), and AdGuard DNS.",
    },
    {
      q: "How is DNS resolution latency measured across different resolvers?",
      a: "It issues parallel DNS over HTTPS (DoH) requests to each provider endpoint for a designated test domain, measuring exact query turnaround time in milliseconds from your local client location.",
    },
    {
      q: "Why do different DNS resolvers return different IP addresses for the same domain?",
      a: "Major CDNs and global platforms use Anycast routing and EDNS Client Subnet (ECS) data to return the edge server IP nearest to the resolver or user geographic location.",
    },
    {
      q: "Which DNS resolvers provide built-in malware blocking and family filtering?",
      a: "Quad9 (9.9.9.9) and Cloudflare Security (1.1.1.2) automatically block known malicious domains, while AdGuard and OpenDNS FamilyShield filter adult content and advertising trackers.",
    },
    {
      q: "Are my test domain lookups logged during the resolver benchmark?",
      a: "No. Queries are dispatched directly to the public DoH resolvers from your browser. LicenBase does not log or monitor query payloads.",
    },
    {
      q: "What tool should I use to inspect authoritative nameserver delegation for a domain?",
      a: "Use the Nameserver Delegation Checker to inspect TLD parent zone delegation and authoritative NS health.",
    },
  ],
  "subnet-calculator": [
    {
      q: "What network parameters are calculated by the IPv4 Subnet Calculator?",
      a: "The calculator computes network address, broadcast address, usable host IP range, total available host count, CIDR prefix length, subnet mask, and wildcard mask from any IPv4 address and prefix.",
    },
    {
      q: "How does the tool distinguish between usable host IPs and total subnet addresses?",
      a: "In standard IPv4 subnets (CIDR /30 and larger), the first address is reserved as the network identifier and the last address is reserved as the broadcast address, subtracting 2 from total host capacity.",
    },
    {
      q: "How are point-to-point /31 and host-specific /32 subnets handled?",
      a: "In accordance with RFC 3021, /31 subnets provide 2 usable host addresses for point-to-point router links without broadcast overhead. A /32 prefix denotes a single host loopback address.",
    },
    {
      q: "Does the calculator display binary and hexadecimal representations?",
      a: "Yes. It displays 32-bit binary octet breakdowns highlighting network and host bit boundaries, as well as hexadecimal subnet mask equivalents for network engineering.",
    },
    {
      q: "Is my private IP subnet configuration transmitted over the internet?",
      a: "No. All bitwise operations, CIDR conversions, and range calculations are executed entirely inside your web browser via client-side JavaScript.",
    },
    {
      q: "What tool should I use if I need to divide a network block into unequal subnets for multiple departments?",
      a: "Use the VLSM Planner (Variable Length Subnet Mask) to design hierarchical, efficient subnet allocations without wasting IP space.",
    },
  ],
  "vlsm-planner": [
    {
      q: "What is Variable Length Subnet Masking (VLSM) and how does this planner help?",
      a: "VLSM allows network engineers to divide an IP address block into subnets of varying sizes tailored to exact host requirements, minimizing wasted IP addresses compared to fixed-size subnetting.",
    },
    {
      q: "How does the VLSM Planner optimize subnet allocation order?",
      a: "The planning algorithm sorts requested subnets in descending order of host requirements before assigning address blocks, ensuring contiguous, properly aligned subnet boundaries.",
    },
    {
      q: "Can the planner detect IP address exhaustion or overlapping subnets?",
      a: "Yes. If the cumulative host demands exceed the capacity of the parent CIDR block, the tool flags address exhaustion and highlights unallocated surplus blocks for future expansion.",
    },
    {
      q: "Can I export the completed VLSM subnet allocation table?",
      a: "Yes. You can copy the structured allocation table or export it as CSV data detailing subnet names, CIDR prefixes, network IPs, gateway IPs, usable ranges, and broadcast addresses.",
    },
    {
      q: "Are my internal corporate network designs kept confidential?",
      a: "Yes. All subnet planning algorithms run 100% locally in browser memory. No network topology diagrams or IP ranges are transmitted externally.",
    },
    {
      q: "What tool should I use to calculate overall bandwidth requirements across my newly planned subnets?",
      a: "Use the Bandwidth Calculator to forecast traffic capacity and interface utilization across your infrastructure.",
    },
  ],
  "mtu-calculator": [
    {
      q: "What is Maximum Transmission Unit (MTU) and Maximum Segment Size (MSS)?",
      a: "MTU defines the largest Layer 2 Ethernet frame size (typically 1500 bytes) that can be transmitted without fragmentation. MSS is the maximum TCP payload data size, calculated by subtracting IP and TCP header overhead from MTU.",
    },
    {
      q: "How do VPN tunnels and encapsulation protocols reduce effective MTU?",
      a: "Encapsulation protocols such as WireGuard, IPsec, OpenVPN, GRE, and VXLAN add extra outer packet headers (ranging from 20 to 80 bytes), requiring a corresponding reduction in MTU/MSS to prevent packet fragmentation.",
    },
    {
      q: "What happens when an IP packet exceeds the path MTU with the Don't Fragment (DF) flag set?",
      a: "The router drops the oversized packet and transmits an ICMP Type 3 Code 4 'Fragmentation Needed' message back to the sender. If firewalls block ICMP, this causes silent connection freezes known as Path MTU Discovery (PMTUD) black holes.",
    },
    {
      q: "Does the calculator support both IPv4 and IPv6 header calculations?",
      a: "Yes. It accounts for standard 20-byte IPv4 headers, 40-byte IPv6 fixed headers, 20-byte TCP headers, and various tunnel encapsulation overheads.",
    },
    {
      q: "Are MTU calculations processed client-side?",
      a: "Yes. All protocol header mathematics and MSS offset calculations run locally in your browser without network communication.",
    },
    {
      q: "What tool should I use to inspect server interface packet loss and latency under load?",
      a: "Use the Network Tester or Ping & Traceroute tool to test link performance and detect packet delivery issues.",
    },
  ],
  "bandwidth-calculator": [
    {
      q: "What calculations does the Bandwidth Calculator perform?",
      a: "The calculator translates between network throughput rates (e.g. Mbps, Gbps) and data transfer times for file sizes, as well as estimating monthly bandwidth transfer volume for web traffic.",
    },
    {
      q: "What is the difference between Megabits per second (Mbps) and Megabytes per second (MB/s)?",
      a: "Network transmission speeds are measured in bits (Mbps), while disk storage and file downloads are measured in bytes (MB/s). Because 1 byte equals 8 bits, a 100 Mbps connection yields a theoretical maximum download speed of 12.5 MB/s.",
    },
    {
      q: "How does network protocol overhead affect real-world file download speeds?",
      a: "TCP/IP framing, TLS encryption, packet acknowledgments, and Ethernet headers introduce approximately 5% to 10% protocol overhead, meaning practical transfer speeds are slightly lower than theoretical interface line rates.",
    },
    {
      q: "Can I calculate monthly hosting bandwidth consumption based on daily visitor pageviews?",
      a: "Yes. Input your average page weight in MB and expected daily visitor count to calculate monthly gigabyte transfer quotas and ensure your VPS plan has sufficient bandwidth.",
    },
    {
      q: "Is any server traffic or file size data transmitted to external servers?",
      a: "No. All unit conversions, transfer time projections, and monthly bandwidth models are computed locally in your browser.",
    },
    {
      q: "What tool should I use to size dedicated VPS RAM and CPU capacity for expected web traffic?",
      a: "Use the VPS RAM Calculator or PHP Worker Calculator to size server compute capacity alongside your bandwidth requirements.",
    },
  ],
  "cable-calculator": [
    {
      q: "What Ethernet cable categories and standards are compared by this calculator?",
      a: "The calculator compares Cat5e, Cat6, Cat6a, Cat7, and Cat8 twisted-pair copper Ethernet cables, analyzing maximum bandwidth frequencies (MHz), data rates (1G to 40G), and certified maximum distance limits.",
    },
    {
      q: "What is the maximum certified channel distance for standard Cat6 vs Cat6a at 10 Gbps?",
      a: "Cat6 supports 10 Gbps speeds up to 37-55 meters in low-crosstalk environments, whereas Cat6a (augmented) is fully certified for 10 Gbps across the full 100-meter (328 ft) standard channel length.",
    },
    {
      q: "How does Power over Ethernet (PoE) impact cable selection and heat dissipation?",
      a: "Higher PoE standards (PoE++ up to 90W) generate heat in bundled cables. Cat6a with 23 AWG solid copper conductors dissipates heat more effectively than thinner Cat5e 24 AWG wiring, preventing packet loss.",
    },
    {
      q: "What is the difference between Shielded (STP/FTP) and Unshielded (UTP) cabling?",
      a: "UTP is standard for enterprise office deployments. Shielded cabling (STP/FTP) provides grounding protection against electromagnetic interference (EMI) in industrial server rooms, near heavy machinery, or alongside high-voltage power lines.",
    },
    {
      q: "Is the cable specification database queried locally in the browser?",
      a: "Yes. The TIA/EIA and ISO/IEC cabling reference database is bundled locally for instant offline calculation.",
    },
    {
      q: "What tool should I use to plan VLAN segmentations across physical network switches?",
      a: "Use the VLAN Manager to plan 802.1Q tagged and untagged switch port assignments across your cabling infrastructure.",
    },
  ],
  "data-unit-converter": [
    {
      q: "What storage and network transfer units can be converted with this tool?",
      a: "The tool converts across decimal SI units (KB, MB, GB, TB, PB) and binary IEC units (KiB, MiB, GiB, TiB, PiB), as well as network bit rates (Kbps, Mbps, Gbps, Tbps).",
    },
    {
      q: "What is the difference between decimal Gigabytes (GB) and binary Gibibytes (GiB)?",
      a: "Decimal Gigabytes use base-10 powers (1 GB = 1,000,000,000 bytes, standard for hard drive manufacturers), whereas binary Gibibytes use base-2 powers (1 GiB = 1,073,741,824 bytes, standard for operating systems like Linux and Windows).",
    },
    {
      q: "Why does a 1 TB SSD show as approximately 931 GiB in my operating system?",
      a: "Drive manufacturers market drive capacity in decimal 10^12 bytes (1,000,000,000,000 bytes). When the OS divides this total by 1024^3 to report GiB, the resulting capacity appears as 931.32 GiB without any actual storage loss.",
    },
    {
      q: "Can I convert between high-speed storage transfer rates and network download times?",
      a: "Yes. You can instantly toggle between bitrates (Gbps) and byte rates (MB/s or GB/h) to verify backup and replication throughput.",
    },
    {
      q: "Is any converted data sent across the network?",
      a: "No. All high-precision mathematical conversions run client-side using JavaScript BigInt and floating-point math.",
    },
    {
      q: "What tool should I use to calculate server storage requirements factoring in RAID parity?",
      a: "Use the RAID Capacity Calculator to model usable, parity, and hot-spare capacity across hardware RAID arrays.",
    },
  ],
  "uptime-calculator": [
    {
      q: "What does the Uptime & SLA Calculator compute across service availability tiers?",
      a: "The calculator converts uptime percentages (such as 99%, 99.9%, 99.95%, 99.99%, and 99.999% 'five nines') into maximum allowed downtime per day, week, month, quarter, and year.",
    },
    {
      q: "How much downtime is permitted under a 99.9% ('three nines') SLA per year?",
      a: "A 99.9% uptime SLA permits a maximum of 8 hours, 45 minutes, and 56 seconds of unscheduled cumulative downtime across a standard 365-day operating year.",
    },
    {
      q: "What is the downtime budget for high-availability 99.99% ('four nines') systems?",
      a: "Under 99.99% availability, cumulative downtime cannot exceed 52 minutes and 35 seconds per year, or approximately 4.38 minutes per month.",
    },
    {
      q: "How does scheduled maintenance impact SLA compliance calculations?",
      a: "Many Service Level Agreements exclude planned, pre-notified maintenance windows from SLA penalty calculations. The calculator lets you calculate uptime with and without maintenance exclusions.",
    },
    {
      q: "Are SLA calculations performed locally?",
      a: "Yes. All availability conversions and time calculations run locally in your browser runtime without transmitting data.",
    },
    {
      q: "What tool should I use to monitor server uptime and test network latency?",
      a: "Use the Network Tester or Ping & Traceroute tool to benchmark response latency and detect server packet loss.",
    },
  ],
  "network-calculator": [
    {
      q: "What network engineering metrics does the Network Calculator unify in one tool?",
      a: "The tool combines IPv4/IPv6 subnet calculation, binary netmask breakdown, IP range generation, broadcast address discovery, wildcard mask generation, and host capacity estimation.",
    },
    {
      q: "How does the tool calculate the wildcard mask used in Cisco ACLs and OSPF configs?",
      a: "The wildcard mask is the bitwise inverse of the subnet mask, calculated by subtracting each octet of the subnet mask from 255 (e.g. 255.255.255.0 becomes 0.0.0.255).",
    },
    {
      q: "How does the tool identify private (RFC 1918), loopback, link-local, and multicast IP ranges?",
      a: "It automatically identifies reserved address spaces including 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 (RFC 1918), 127.0.0.0/8 (Loopback), 169.254.0.0/16 (APIPA), and 224.0.0.0/4 (Multicast).",
    },
    {
      q: "Can I calculate both single host addresses and supernet summaries?",
      a: "Yes. You can analyze individual host assignments or aggregate multiple contiguous subnets into a single route supernet (CIDR aggregation).",
    },
    {
      q: "Is my network topology or IP schema shared externally?",
      a: "No. All bitwise calculations and subnet transformations are performed 100% client-side in browser memory.",
    },
    {
      q: "What tool should I use to generate Cisco or iptables firewall access control lists?",
      a: "Use the ACL Generator tool to build syntax-validated firewall access rules based on your calculated subnets and wildcard masks.",
    },
  ],
  "random-generator": [
    {
      q: "What types of random data can the Random Generator produce?",
      a: "The tool generates cryptographically secure random numbers within custom ranges, random alphanumeric strings, UUIDs, dice rolls, coin flips, and shuffled item lists.",
    },
    {
      q: "How does the generator guarantee true cryptographic randomness?",
      a: "It uses the Web Cryptography API (window.crypto.getRandomValues()), which draws entropy directly from underlying operating system hardware entropy pools rather than pseudorandom Math.random().",
    },
    {
      q: "Can I generate multiple unique random numbers without duplicates?",
      a: "Yes. Enable the 'Unique Numbers Only' toggle to draw random samples without replacement from your configured minimum and maximum range.",
    },
    {
      q: "Can I use this tool to generate secure passwords or authentication secrets?",
      a: "Yes, though for advanced entropy controls, symbols, and passphrase generation, our dedicated Passphrase Generator and Secret Generator offer specialized parameter tuning.",
    },
    {
      q: "Are generated numbers or random strings transmitted or stored on remote servers?",
      a: "No. All random byte generation and list shuffling execute strictly in your local browser sandbox. Generated values are never logged or transmitted.",
    },
    {
      q: "What tool should I use to generate random API tokens with specific hashing algorithms?",
      a: "Use the Token Generator or API Key Generator tool for pre-formatted API keys and cryptographic tokens.",
    },
  ],
  "wifi-qr": [
    {
      q: "What information is encoded into a Wi-Fi QR code?",
      a: "The QR code encodes standard WIFI protocol strings (e.g. WIFI:T:WPA;S:NetworkName;P:Password;;) containing the network SSID, authentication type (WPA/WPA2/WPA3, WEP, or Open), password, and hidden SSID flag.",
    },
    {
      q: "How do mobile smartphones connect to Wi-Fi using the generated QR code?",
      a: "iOS and Android camera apps natively scan the QR code and display a one-tap prompt to automatically connect to the Wi-Fi network without typing the password manually.",
    },
    {
      q: "Does the generator support modern WPA3 personal security and hidden networks?",
      a: "Yes. You can select WPA/WPA2, modern WPA3, legacy WEP, or open networks, as well as toggle the hidden SSID flag for unbroadcasted access points.",
    },
    {
      q: "Can I download the QR code in high-resolution vector and raster formats?",
      a: "Yes. You can download the generated QR code as SVG (scalable vector format for printing onto office cards) or high-resolution PNG format.",
    },
    {
      q: "Is my private Wi-Fi network password transmitted across the internet?",
      a: "No. The QR matrix is generated 100% client-side in your browser using local canvas and SVG rendering libraries. Your Wi-Fi password never leaves your device.",
    },
    {
      q: "What tool should I use if I need to generate QR codes for website URLs or vCards?",
      a: "Use the general QR Code Generator tool to encode web links, contact cards, plain text, and SMS triggers.",
    },
  ],
  "ip-converter": [
    {
      q: "What formats can the IP Converter translate between?",
      a: "The converter translates IPv4 and IPv6 addresses across dotted-decimal, 32-bit integer (decimal), binary, hexadecimal, octal, and fully expanded or compressed IPv6 notation.",
    },
    {
      q: "Why is converting IP addresses to integer format useful in software development?",
      a: "Storing IPv4 addresses as 32-bit unsigned integers in SQL databases (like MySQL INET_ATON and INET_NTOA) drastically reduces storage footprint and accelerates IP range indexing and GeoIP queries.",
    },
    {
      q: "How does the tool handle leading zeros and octal IP address confusion?",
      a: "In some systems, leading zeros cause IP octets to be parsed as octal numbers (e.g. 010.0.0.1 being parsed as 8.0.0.1). The converter validates and warns about potential octal misinterpretation vulnerabilities.",
    },
    {
      q: "Can the converter expand and compress IPv6 addresses according to RFC 5952?",
      a: "Yes. It compresses consecutive 16-bit zero fields using the double colon (::) notation and strips leading zeros, as well as expanding addresses into full 32-character hexadecimal format.",
    },
    {
      q: "Are converted IP addresses tracked or logged?",
      a: "No. All number format conversions occur locally in your browser through client-side bitwise arithmetic.",
    },
    {
      q: "What tool should I use to calculate subnet ranges and broadcast addresses for converted IPs?",
      a: "Use the Subnet Calculator or Subnet Mask Converter to analyze CIDR masks and usable host allocations.",
    },
  ],
  "ip-enumerator": [
    {
      q: "What does the IP Enumerator tool do?",
      a: "The IP Enumerator expands any CIDR subnet block or starting and ending IP address range into a complete, sequential list of individual IP addresses.",
    },
    {
      q: "Can I filter out network identifiers and broadcast addresses during enumeration?",
      a: "Yes. You can choose to enumerate all addresses in the block or restrict output exclusively to usable host IP addresses.",
    },
    {
      q: "Is there a limit on how many IP addresses can be enumerated in the browser?",
      a: "The tool efficiently generates lists up to /16 subnets (65,536 addresses) directly in browser memory. For massive /8 blocks, pagination or command-line scripting is advised to prevent browser UI freezing.",
    },
    {
      q: "What export formats are supported for enumerated IP lists?",
      a: "You can copy the list directly to your clipboard or download it as a plain text (.txt) file or CSV file formatted for firewall whitelist imports or monitoring systems.",
    },
    {
      q: "Is my IP list uploaded to external servers?",
      a: "No. IP address enumeration and string formatting execute 100% locally in your browser memory.",
    },
    {
      q: "What tool should I use to compare two IP lists and identify overlapping addresses?",
      a: "Use the IP Conflict Checker or IP Diff tool to identify overlapping ranges and duplicate IP assignments.",
    },
  ],
  "ipv6-tools": [
    {
      q: "What IPv6 address analysis operations are supported by IPv6 Tools?",
      a: "The tool provides IPv6 compression/expansion (RFC 5952), CIDR prefix calculation, reverse DNS (ip6.arpa) PTR string generation, address type classification, and 6to4/Teredo transition decoding.",
    },
    {
      q: "How does the tool generate reverse DNS ip6.arpa PTR records for IPv6 addresses?",
      a: "It expands the 128-bit address into 32 hexadecimal nibbles separated by dots in reverse order, appending the .ip6.arpa suffix required for authoritative DNS PTR records.",
    },
    {
      q: "What IPv6 address scope types does the tool identify?",
      a: "It identifies Global Unicast (2000::/3), Unique Local Addresses (fc00::/7 ULA), Link-Local (fe80::/10), Multicast (ff00::/8), Loopback (::1/128), and Unspecified (::/128) address ranges.",
    },
    {
      q: "How does IPv6 subnetting differ from IPv4 subnetting?",
      a: "Standard IPv6 end-site assignments use /48 or /56 prefixes, while individual local subnets are consistently sized at /64 (providing 18 quintillion addresses) to support SLAAC stateless auto-configuration without broadcast addresses.",
    },
    {
      q: "Are analyzed IPv6 addresses stored or logged?",
      a: "No. All IPv6 address operations are computed locally in your browser without transmitting queries to remote endpoints.",
    },
    {
      q: "What tool should I use to look up standard IPv6 prefix reference tables?",
      a: "Use the IPv6 Reference Hub or CIDR Reference tool to review standard address assignments and prefix sizes.",
    },
  ],
  "conflict-checker": [
    {
      q: "How does the IP Conflict Checker identify overlapping network assignments?",
      a: "The tool parses multiple IP ranges, CIDR subnets, and individual host IP addresses, sorting and comparing numerical boundaries to detect overlapping subnets and duplicate IP allocations.",
    },
    {
      q: "Why do IP address conflicts disrupt network routing and host connectivity?",
      a: "When two devices share the same IP address on a local network, ARP requests cause traffic flapping and connection drops. In routing, overlapping CIDR subnets cause suboptimal routing or complete route drops.",
    },
    {
      q: "Can I paste raw configuration tables containing mixed CIDR notations and IP ranges?",
      a: "Yes. The intelligent parser accepts mixed inputs including CIDR prefixes (e.g. 10.0.1.0/24), hyphenated ranges (192.168.1.10-192.168.1.50), and single IP addresses separated by commas or line breaks.",
    },
    {
      q: "Does the tool highlight the exact overlapping IP intervals?",
      a: "Yes. It reports the precise overlapping IP span and identifies which specific subnets or interface definitions are in conflict.",
    },
    {
      q: "Is my proprietary internal IP allocation schema transmitted externally?",
      a: "No. All range parsing and interval overlap detection execute client-side in browser memory.",
    },
    {
      q: "What tool should I use to re-plan my subnets without overlaps after detecting a conflict?",
      a: "Use the VLSM Planner or Subnet Calculator to recalculate non-overlapping contiguous address blocks.",
    },
  ],
  "mac-formatter": [
    {
      q: "What MAC address formatting styles are supported by the MAC Formatter?",
      a: "The tool converts MAC addresses across colon-delimited (00:1A:2B:3C:4D:5E), hyphen-delimited (00-1A-2B-3C-4D-5E), Cisco dot-notation (001a.2b3c.4d5e), bare hex (001A2B3C4D5E), and binary formats.",
    },
    {
      q: "Can the formatter process bulk lists of MAC addresses with mixed delimiters?",
      a: "Yes. You can paste hundreds of MAC addresses with inconsistent formats, spaces, or lowercase letters, and convert the entire batch into a uniform target format with one click.",
    },
    {
      q: "Does the tool validate MAC address length and hexadecimal integrity?",
      a: "Yes. It verifies that each entry contains exactly 12 hexadecimal characters (48 bits for EUI-48) or 16 hex characters (64 bits for EUI-64) and flags malformed strings.",
    },
    {
      q: "How does the tool identify the Organizationally Unique Identifier (OUI) vendor prefix?",
      a: "The first 3 octets (24 bits) represent the IEEE-assigned OUI. The formatter isolates this prefix for immediate hardware manufacturer lookup.",
    },
    {
      q: "Are formatted MAC addresses uploaded or stored on any server?",
      a: "No. All regular expression parsing and string manipulation execute locally in your browser.",
    },
    {
      q: "What tool should I use to look up the hardware manufacturer from the MAC prefix?",
      a: "Use the OUI Lookup tool to identify the registered network equipment manufacturer (e.g. Cisco, Apple, Intel, Dell).",
    },
  ],
  "subnet-mask-converter": [
    {
      q: "What subnet mask formats can this converter translate between?",
      a: "The converter translates between CIDR prefix notation (/0 to /32), dotted-decimal netmasks (e.g. 255.255.255.0), hexadecimal netmasks (0xFFFFFF00), binary netmasks, and Cisco wildcard masks (0.0.0.255).",
    },
    {
      q: "How does the tool calculate total addresses and usable host capacity for each mask?",
      a: "It computes total addresses as 2^(32 - prefix) and usable hosts as 2^(32 - prefix) - 2 for standard subnets, displaying host limits for every subnet size.",
    },
    {
      q: "Why must IPv4 subnet masks consist of contiguous leading 1s in binary?",
      a: "Standard IP routing requires netmasks to have contiguous high-order 1s followed by trailing 0s. The converter flags non-contiguous netmasks that are invalid under RFC routing standards.",
    },
    {
      q: "How is a Cisco wildcard mask generated from a subnet mask?",
      a: "The wildcard mask is calculated by performing a bitwise NOT operation on the subnet mask (subtracting each octet from 255), which is required for Cisco IOS ACLs and OSPF network statements.",
    },
    {
      q: "Is any netmask conversion data transmitted over the internet?",
      a: "No. All bitwise operations and conversions execute instantly in client-side JavaScript.",
    },
    {
      q: "What tool should I use to calculate full network and broadcast boundaries for a specific IP address?",
      a: "Use the Subnet Calculator to compute network, broadcast, and usable host ranges for any given IP and mask.",
    },
  ],
  "vlan-manager": [
    {
      q: "What does the VLAN Manager tool help network administrators plan?",
      a: "The VLAN Manager helps engineers organize IEEE 802.1Q Virtual LANs, allocating VLAN IDs (1 to 4094), subnet IP blocks, gateway addresses, description tags, and switch trunking configurations.",
    },
    {
      q: "What are standard, extended, and reserved VLAN ID ranges?",
      a: "Standard VLANs range from 1 to 1005 (with 1 as default management, and 1002-1005 reserved for legacy Token Ring/FDDI). Extended VLANs span from 1006 to 4094 for modern enterprise switching.",
    },
    {
      q: "What is the difference between tagged (trunk) and untagged (access) switch ports?",
      a: "Untagged access ports connect directly to end devices (PCs, printers) stripping VLAN headers, while tagged trunk ports carry 802.1Q encapsulated frames between switches and routers across multiple VLANs.",
    },
    {
      q: "Can I export VLAN mapping tables for Cisco, Juniper, or Linux network switches?",
      a: "Yes. You can export structured VLAN assignment tables as CSV files or generate command-line syntax for Cisco IOS (vlan 'id') and Linux bridge/interface definitions.",
    },
    {
      q: "Is my enterprise VLAN segmentation architecture saved on remote servers?",
      a: "No. All VLAN tables and switch configuration snippets are generated locally in your browser memory.",
    },
    {
      q: "What tool should I use to configure inter-VLAN routing and static routes between VLAN gateways?",
      a: "Use the Routing Tools or ACL Generator to build static routing tables and inter-VLAN firewall filter rules.",
    },
  ],
  "routing-tools": [
    {
      q: "What routing functions are supported by Routing Tools?",
      a: "The tool assists with static route generation, CIDR route summarization (supernetting), longest-prefix match simulation, and next-hop gateway path resolution.",
    },
    {
      q: "How does longest-prefix match determine packet forwarding in IP routing?",
      a: "When a router has multiple matching routes for a destination IP, it always forwards packets via the route with the most specific (longest) CIDR prefix length (e.g. /28 takes precedence over /24).",
    },
    {
      q: "What is Route Summarization (Supernetting) and how does it optimize routing tables?",
      a: "Route summarization combines multiple contiguous smaller subnets into a single aggregated route prefix, reducing routing table size and conserving router CPU and memory.",
    },
    {
      q: "Can the tool generate static route syntax for Linux (ip route), Windows (route add), and Cisco IOS?",
      a: "Yes. Select your target operating system to output ready-to-paste command syntax for persistent or transient static routes.",
    },
    {
      q: "Are my internal routing tables and next-hop IP addresses sent over the network?",
      a: "No. Route evaluation, summarization, and syntax generation execute entirely in client-side JavaScript.",
    },
    {
      q: "What tool should I use to calculate subnet boundaries before building routing tables?",
      a: "Use the Subnet Calculator or VLSM Planner to structure your IP addresses and verify subnet sizes.",
    },
  ],
  "acl-generator": [
    {
      q: "What types of firewall Access Control Lists (ACLs) can be created with this generator?",
      a: "The tool generates Standard and Extended IPv4 ACLs for Cisco IOS, Linux iptables/nftables, Cisco ASA, and pfSense/FreeBSD packet filters.",
    },
    {
      q: "What is the difference between standard and extended Cisco ACLs?",
      a: "Standard ACLs (numbered 1-99 or named) filter traffic solely on source IP address, while Extended ACLs (100-199 or named) filter by source IP, destination IP, protocol (TCP/UDP/ICMP), and port numbers.",
    },
    {
      q: "Why is the implicit 'deny all' at the end of an ACL significant?",
      a: "Both Cisco ACLs and enterprise firewalls enforce an implicit deny rule at the bottom of rule lists. Any traffic not explicitly permitted by preceding rules is silently dropped.",
    },
    {
      q: "How does the generator calculate wildcard masks for source and destination subnets?",
      a: "It automatically converts your entered CIDR prefixes or subnet masks into bitwise inverse wildcard masks required by Cisco command syntax.",
    },
    {
      q: "Is my security policy or firewall rule schema transmitted to external servers?",
      a: "No. All ACL syntax parsing and script compilation occur client-side inside your browser.",
    },
    {
      q: "What tool should I use to verify port connectivity after applying ACL firewall rules?",
      a: "Use the Port Scanner tool to verify whether target services are reachable or properly blocked by your new firewall rules.",
    },
  ],
  "wireless-tools": [
    {
      q: "What wireless network calculations and standards are covered by Wireless Tools?",
      a: "The tool calculates Free Space Path Loss (FSPL), Wi-Fi channel overlaps (2.4 GHz, 5 GHz, 6 GHz Wi-Fi 6E/7), dBm-to-milliwatt power conversions, and Fresnel zone clearance for wireless links.",
    },
    {
      q: "Why are channels 1, 6, and 11 the only non-overlapping channels in 2.4 GHz Wi-Fi?",
      a: "In 2.4 GHz Wi-Fi, each channel is 20 MHz wide with 5 MHz spacing between center frequencies. Channels 1, 6, and 11 are spaced 25 MHz apart, allowing co-located access points to operate without adjacent channel interference.",
    },
    {
      q: "What is the Fresnel zone and why is obstacle clearance critical for outdoor point-to-point links?",
      a: "The Fresnel zone is an elliptical radio signal propagation zone between transmitter and receiver antennas. Obstacles invading more than 40% of the 1st Fresnel zone cause phase cancellation and severe throughput loss.",
    },
    {
      q: "How does the tool convert between dBm signal strength and milliwatts (mW)?",
      a: "It calculates power using the logarithmic formula mW = 10^(dBm / 10). For example, 20 dBm equals 100 mW, and 30 dBm equals 1000 mW (1 Watt).",
    },
    {
      q: "Are wireless site planning coordinates or link distances sent to external servers?",
      a: "No. All RF path loss calculations and channel models run 100% locally in your browser.",
    },
    {
      q: "What tool should I use to generate a Wi-Fi QR code for client guest access?",
      a: "Use the Wi-Fi QR Code Generator tool to produce printable connection QR codes for smartphone scanning.",
    },
  ],
  "reference-hub": [
    {
      q: "What reference cheat sheets and protocols are accessible in the Reference Hub?",
      a: "The Reference Hub provides unified access to standard TCP/UDP port tables, IP protocol numbers, CIDR subnet cheat sheets, IPv6 prefix references, OUI hardware vendor lists, and HTTP status codes.",
    },
    {
      q: "How can I search and filter across reference datasets quickly?",
      a: "The hub features real-time client-side search filtering across port numbers, service names, protocol descriptions, and RFC standard citations.",
    },
    {
      q: "Are all reference tables updated against official IANA registry standards?",
      a: "Yes. Reference datasets are verified against official IANA Service Name and Port Number registries and IEEE OUI registry standards.",
    },
    {
      q: "Can I use the Reference Hub offline without internet connectivity?",
      a: "Yes. All reference tables and search indexes are bundled locally within the web application, providing instant offline reference.",
    },
    {
      q: "Is my search activity in the reference hub tracked?",
      a: "No. All search index queries and table filtering execute in browser memory without tracking or logging.",
    },
    {
      q: "What tool should I use if I need to calculate subnets based on CIDR tables?",
      a: "Use the Subnet Calculator or CIDR Reference tool to convert between prefix lengths, masks, and usable host counts.",
    },
  ],
  "oui-lookup": [
    {
      q: "What is an OUI and how does this lookup identify hardware manufacturers?",
      a: "An Organizationally Unique Identifier (OUI) is the first 24 bits (3 octets) of a MAC address assigned by the IEEE to hardware manufacturers like Apple, Cisco, Intel, or Dell to uniquely identify device vendors.",
    },
    {
      q: "Can I search by company name as well as MAC address prefix?",
      a: "Yes. You can enter a partial or complete MAC address (e.g. 00:1A:2B), or search directly by company name (e.g. 'Raspberry Pi', 'Cisco', 'Espressif') to find assigned prefixes.",
    },
    {
      q: "What is a locally administered MAC address (randomized MAC) and how is it detected?",
      a: "If the second least significant bit of the first octet is set to 1 (e.g. x2:xx, x6:xx, xA:xx, xE:xx), the MAC is locally administered or randomized by iOS/Android for privacy, meaning it has no registered OUI vendor.",
    },
    {
      q: "How frequently is the IEEE OUI vendor registry database updated?",
      a: "The lookup database is synchronized with the official IEEE Standards Association public OUI/MA-L, MA-M, and MA-S registry feeds.",
    },
    {
      q: "Are searched MAC addresses logged or transmitted to third parties?",
      a: "No. The OUI search index runs locally in your browser memory. Searched MAC addresses never leave your machine.",
    },
    {
      q: "What tool should I use to reformat MAC addresses between colon, hyphen, and Cisco dot notation?",
      a: "Use the MAC Formatter tool to clean and standardize bulk MAC address lists.",
    },
  ],
  "port-reference": [
    {
      q: "What information does the Port Reference guide provide for standard network ports?",
      a: "The guide lists well-known ports (0-1023), registered ports (1024-49151), and dynamic ports (49152-65535), providing transport protocols (TCP/UDP), associated service names, common use cases, and security notes.",
    },
    {
      q: "What is the difference between Well-Known Ports and Registered Ports?",
      a: "Well-known ports (0-1023) are reserved for core system services (HTTP:80, HTTPS:443, SSH:22, DNS:53) requiring administrative privileges on Unix systems. Registered ports (1024-49151) are assigned by IANA for specific vendor applications (e.g. MySQL:3306, Redis:6379).",
    },
    {
      q: "Which ports should always be closed or firewalled from public internet access?",
      a: "Database ports (MySQL 3306, PostgreSQL 5432, MongoDB 27017, Redis 6379), SMB file sharing (445), and unencrypted management services (Telnet 23, RDP 3389) should never be exposed publicly without a secure VPN.",
    },
    {
      q: "Can I search ports by application name, protocol, or port number?",
      a: "Yes. The interactive search filter lets you locate ports by number, service keyword, protocol type, or CVE security relevance.",
    },
    {
      q: "Is the port reference database accessible client-side?",
      a: "Yes. The complete IANA port directory is stored locally in client-side memory for instant lookups.",
    },
    {
      q: "What tool should I use to check whether a remote server has specific ports open?",
      a: "Use the Port Scanner tool to test live connectivity to web, database, or SSH ports on any target host.",
    },
  ],
  "cidr-reference": [
    {
      q: "What does the CIDR Reference table display for IPv4 subnets?",
      a: "The table provides a complete reference from /0 down to /32, showing CIDR prefix length, dotted-decimal subnet mask, wildcard mask, total addresses, usable host capacity, and standard Classful network equivalents.",
    },
    {
      q: "How do CIDR prefix lengths relate to available IP addresses?",
      a: "Each increment in prefix length halves the available address pool. For instance, a /24 contains 256 total addresses (254 usable), a /25 contains 128 (126 usable), and a /26 contains 64 (62 usable).",
    },
    {
      q: "What are the common CIDR block sizes assigned to residential, VPS, and enterprise networks?",
      a: "Individual VPS instances typically receive a single /32 IPv4 address, small branch offices use /24 subnets (254 hosts), and large enterprise VPCs allocate /16 supernets (65,534 hosts).",
    },
    {
      q: "Why does a /30 subnet have only 2 usable host addresses?",
      a: "A /30 contains 4 total addresses (2^(32-30) = 4). With 1 address reserved for the network ID and 1 for the broadcast address, exactly 2 usable addresses remain, making it ideal for point-to-point links.",
    },
    {
      q: "Is the CIDR reference chart available offline?",
      a: "Yes. The reference table is compiled directly into the application client bundle and loads instantaneously without server requests.",
    },
    {
      q: "What tool should I use to calculate specific network ranges for an IP address and CIDR prefix?",
      a: "Use the Subnet Calculator or VLSM Planner to compute exact network boundaries and assign subnets.",
    },
  ],
  "protocol-reference": [
    {
      q: "What information is listed in the IP Protocol Reference table?",
      a: "The table documents IANA assigned IP protocol numbers (0 to 255) found in the IPv4 Protocol field and IPv6 Next Header field, including ICMP (1), IGMP (2), TCP (6), UDP (17), GRE (47), ESP (50), and OSPF (89).",
    },
    {
      q: "What is the difference between an IP Protocol Number and a TCP/UDP Port Number?",
      a: "IP protocol numbers identify the Layer 4 transport protocol encapsulated inside the Layer 3 IP header (e.g. protocol 6 = TCP). Port numbers operate inside Layer 4 to direct traffic to specific applications (e.g. port 443 = HTTPS).",
    },
    {
      q: "Which IP protocol numbers are used for IPsec VPN encapsulation and tunneling?",
      a: "IPsec uses ESP (Encapsulating Security Payload, protocol 50) and AH (Authentication Header, protocol 51). Generic Routing Encapsulation uses GRE (protocol 47).",
    },
    {
      q: "Can I search protocol numbers by RFC standard citation or acronym?",
      a: "Yes. Search by protocol name, keyword, hex code, or RFC number to locate specific protocol definitions instantly.",
    },
    {
      q: "Is the protocol reference data stored client-side?",
      a: "Yes. The complete IANA protocol catalog is bundled locally in your browser session.",
    },
    {
      q: "What tool should I use to build firewall rules filtering by specific IP protocol numbers?",
      a: "Use the ACL Generator tool to create Cisco or iptables rules matching specific protocol numbers and ports.",
    },
  ],
  "ipv6-reference": [
    {
      q: "What information is compiled in the IPv6 Reference Hub?",
      a: "The hub outlines IPv6 address architectures (RFC 4291), special address allocations (RFC 5156), standard prefix allocations (/32, /48, /56, /64), solicited-node multicast addresses, and IPv4 transition mechanisms.",
    },
    {
      q: "Why is a /64 prefix the mandatory standard subnet size for IPv6 local networks?",
      a: "The lower 64 bits of an IPv6 address form the Interface Identifier (IID). Stateless Address Autoconfiguration (SLAAC) requires a /64 prefix to derive interface addresses automatically from device MAC addresses.",
    },
    {
      q: "What are the designated IPv6 address ranges for Link-Local, Loopback, and ULA?",
      a: "Loopback is ::1/128, Link-Local unicast is fe80::/10 (used for local subnet communication and neighbor discovery), and Unique Local Addresses (ULA) occupy fc00::/7 (private internal routable addressing).",
    },
    {
      q: "How does IPv6 eliminate the need for NAT and broadcast addresses?",
      a: "With 340 undecillion global addresses, every device can hold a globally unique public IP, eliminating Network Address Translation (NAT). Broadcast is replaced by efficient Multicast groups.",
    },
    {
      q: "Is the IPv6 reference catalog accessible offline?",
      a: "Yes. All reference charts, RFC references, and prefix tables are bundled locally for instant offline consultation.",
    },
    {
      q: "What tool should I use to expand, compress, or generate PTR records for IPv6 addresses?",
      a: "Use the IPv6 Tools or IP Converter tool to manipulate and validate IPv6 address formats.",
    },
  ],
}
