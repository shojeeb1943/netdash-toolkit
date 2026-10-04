import type { Faq } from "@/lib/tool-faqs"

export const dev_httpFaqs: Record<string, Faq[]> = {
  "user-agent-generator": [
    {
      q: "What types of User-Agent strings can this tool generate?",
      a: "It generates authentic User-Agent header strings across modern Desktop browsers (Chrome, Firefox, Safari, Edge), Mobile operating systems (iOS Safari, Android Chrome), and official search engine bot crawlers (Googlebot, Bingbot, YandexBot).",
    },
    {
      q: "Why do web scrapers and API testing tools require authentic User-Agent strings?",
      a: "Web servers and CDNs (Cloudflare, AWS CloudFront) frequently block or challenge automated requests that lack User-Agent headers or carry default tool signatures (e.g. 'python-requests/2.28' or 'curl/7.88').",
    },
    {
      q: "What is User-Agent Client Hints (UA-CH) in modern browsers?",
      a: "Modern browsers are transitioning from bloated User-Agent strings to structured 'Sec-CH-UA' client hint headers to reduce browser fingerprinting surface while providing secure device metadata.",
    },
    {
      q: "Are my generated User-Agent selections tracked or saved?",
      a: "No. The generator runs 100% locally in your web browser session using JavaScript. No User-Agent strings or target selections are recorded.",
    },
    {
      q: "What related tool helps parse and inspect User-Agent header strings?",
      a: "Use the User-Agent Parser in the DevTools category to decode browser engine, OS version, and device type from raw User-Agent strings.",
    },
    {
      q: "How can I verify a real Googlebot request against a spoofed User-Agent header?",
      a: "Perform a Reverse DNS lookup on the visitor IP address to confirm it resolves to a verified '*.googlebot.com' hostname, and verify Forward DNS matches the IP.",
    },
  ],
  "http-status-reference": [
    {
      q: "What HTTP status code classes are documented in this reference?",
      a: "It catalogs all standard IETF and IANA HTTP status codes across 5 classes: 1xx Informational, 2xx Success (200 OK, 201 Created), 3xx Redirection (301, 302, 304), 4xx Client Errors (400, 401, 403, 404, 429), and 5xx Server Errors (500, 502, 503, 504).",
    },
    {
      q: "What is the technical difference between HTTP 502 Bad Gateway and HTTP 504 Gateway Timeout?",
      a: "A 502 Bad Gateway means the reverse proxy (Nginx) received an invalid or crashed response from the upstream backend (PHP-FPM/Node.js). A 504 Gateway Timeout means the proxy received no response before the timeout timer expired.",
    },
    {
      q: "What is the difference between HTTP 401 Unauthorized and HTTP 403 Forbidden?",
      a: "A 401 Unauthorized indicates that authentication credentials are missing or invalid. A 403 Forbidden means the server recognizes the client's identity but refuses to grant access to the requested resource.",
    },
    {
      q: "Does this tool monitor or log my HTTP status queries?",
      a: "No. The reference database runs entirely offline in your browser. No queries or status searches leave your computer.",
    },
    {
      q: "What related tool generates mock HTTP responses with custom status codes?",
      a: "Use the HTTP Status Generator to test application error handling against simulated 2xx, 3xx, 4xx, and 5xx response headers.",
    },
    {
      q: "Why is HTTP 429 Too Many Requests used in modern REST APIs?",
      a: "HTTP 429 informs client applications that they have exceeded their rate limit quota, typically accompanied by a 'Retry-After' header indicating when requests may resume.",
    },
  ],
  "http-status-generator": [
    {
      q: "How does the HTTP Status Generator assist in API testing?",
      a: "It generates mock HTTP response headers and status codes (e.g. 200, 301, 400, 401, 403, 404, 429, 500, 502, 503) to test how frontend web applications and API clients handle various server response states.",
    },
    {
      q: "How do mock HTTP status codes help validate frontend error handling?",
      a: "Simulating edge-case status codes (like 429 Rate Limiting or 503 Service Unavailable) allows developers to verify that error banners, retry logic, and fallback UI states function correctly without bringing down live production servers.",
    },
    {
      q: "Can I customize response headers like Retry-After and Location?",
      a: "Yes. You can configure custom headers to test redirect destinations on 301/302 codes and rate-limit backoff intervals on 429 responses.",
    },
    {
      q: "Are my test payloads or simulated responses logged on external servers?",
      a: "No. The generator operates locally in your web browser session using JavaScript. No test configurations or response data are transmitted.",
    },
    {
      q: "What related tool provides detailed definitions of all standard HTTP codes?",
      a: "Use the HTTP Status Reference to look up RFC specifications and debugging guidance for any HTTP status code.",
    },
    {
      q: "Why is testing HTTP 304 Not Modified important for caching optimization?",
      a: "HTTP 304 responses instruct browsers to serve assets from local cache when ETag or Last-Modified timestamps match, reducing server bandwidth and eliminating redundant data transfers.",
    },
  ],
  "mime-type-lookup": [
    {
      q: "What information does the MIME Type Lookup tool provide?",
      a: "It maps file extensions (.html, .json, .webp, .mp4, .wasm) to their official IANA MIME media types (text/html, application/json, image/webp, video/mp4, application/wasm) and displays corresponding Content-Type headers.",
    },
    {
      q: "Why must web servers send correct MIME types in Content-Type headers?",
      a: "Web browsers use the Content-Type header (not the file extension) to decide how to process and render files. Sending incorrect MIME types (e.g. text/plain for CSS or JS) causes browsers to block stylesheets and scripts due to MIME-sniffing protections.",
    },
    {
      q: "What MIME type is standard for WebAssembly (.wasm) and SVG (.svg) files?",
      a: "WebAssembly files require 'application/wasm' for native browser compilation. Scalable Vector Graphics files require 'image/svg+xml' for inline rendering.",
    },
    {
      q: "Is my MIME lookup search recorded or tracked?",
      a: "No. The lookup queries an internal client-side database in your web browser. No search queries or file extensions are sent to any remote server.",
    },
    {
      q: "What related tool verifies whether a live URL returns correct MIME types?",
      a: "Use the MIME Type Checker to inspect live HTTP headers from a web server and verify Content-Type header accuracy.",
    },
    {
      q: "How does 'X-Content-Type-Options: nosniff' interact with MIME types?",
      a: "The 'nosniff' security header forces browsers to strictly adhere to the declared Content-Type header, preventing browsers from guessing (sniffing) alternative MIME types.",
    },
  ],
  "mime-type-checker": [
    {
      q: "What does the MIME Type Checker verify on a live URL?",
      a: "It inspects the HTTP 'Content-Type' header returned by a live web server or API endpoint, comparing the declared MIME type against the actual file extension and payload structure to detect misconfigurations.",
    },
    {
      q: "What happens when a web server serves JavaScript with an incorrect MIME type?",
      a: "If a server serves JavaScript with 'text/plain' or 'text/html' on a page with 'X-Content-Type-Options: nosniff' enabled, modern browsers will strictly refuse to execute the script.",
    },
    {
      q: "How can I fix missing or incorrect MIME types in Apache or Nginx?",
      a: "In Nginx, include 'include /etc/nginx/mime.types;' inside the http block. In Apache, add 'AddType image/webp .webp' or 'AddType application/wasm .wasm' to httpd.conf or .htaccess.",
    },
    {
      q: "Is my checked website URL stored or shared publicly?",
      a: "No. All URL header checks are executed in real time for diagnostic display only without persistent logging.",
    },
    {
      q: "What related tool helps build complete Content-Type headers with charset parameters?",
      a: "Use the Content-Type Builder to generate formatted Content-Type headers with custom charsets and boundary parameters.",
    },
    {
      q: "Why is 'charset=utf-8' recommended in text Content-Type headers?",
      a: "Declaring 'text/html; charset=utf-8' ensures browsers decode international characters, emojis, and symbols correctly without encoding distortion (mojibake).",
    },
  ],
  "content-type-builder": [
    {
      q: "What parameters does the Content-Type Builder construct?",
      a: "It builds standard HTTP 'Content-Type' headers combining MIME media type, character encoding sets (charset=utf-8, ISO-8859-1), multipart boundary strings, and format parameters (e.g. application/json; charset=utf-8).",
    },
    {
      q: "Why are multipart boundary parameters required for file uploads?",
      a: "When submitting forms with file attachments ('multipart/form-data'), the boundary string separates different form fields and binary payloads within a single HTTP request body.",
    },
    {
      q: "What Content-Type header is standard for REST API JSON responses?",
      a: "'application/json; charset=utf-8' is the standard MIME specification for JSON API endpoints, ensuring clients parse payloads as structured JSON objects.",
    },
    {
      q: "Does this tool transmit my header parameters to any server?",
      a: "No. All header assembly executes locally in your browser session using JavaScript. No header strings or configurations leave your device.",
    },
    {
      q: "What related tool helps look up official MIME types for specific file extensions?",
      a: "Use the MIME Type Lookup tool to look up IANA-registered media types across all file formats.",
    },
    {
      q: "What Content-Type is required for standard HTML form submissions?",
      a: "Standard web forms submit data using 'application/x-www-form-urlencoded', where key-value pairs are percent-encoded and joined with ampersands.",
    },
  ],
  "cache-control-generator": [
    {
      q: "What directives does the Cache-Control Generator configure?",
      a: "It generates production HTTP 'Cache-Control' headers configuring visibility (public, private), revalidation rules (no-cache, no-store, must-revalidate), expiration durations (max-age, s-maxage), and stale-while-revalidate parameters.",
    },
    {
      q: "What is the technical difference between 'no-cache' and 'no-store'?",
      a: "'no-cache' allows browsers to store the asset but requires validating with the server (via ETag/304) before using it. 'no-store' forbids all caching entirely, requiring a complete fresh download on every request (ideal for private banking data).",
    },
    {
      q: "What Cache-Control header is recommended for versioned static assets (CSS, JS, images)?",
      a: "'public, max-age=31536000, immutable' is the gold standard for fingerprinted assets (e.g. app.a1b2c3.js), allowing browsers and CDNs to cache files for 1 year without checking the origin server.",
    },
    {
      q: "Is my server caching policy uploaded or saved remotely?",
      a: "No. The header generator runs 100% locally in your web browser. None of your caching rules or server configurations are stored.",
    },
    {
      q: "What does the 'stale-while-revalidate' directive do?",
      a: "It instructs the browser to serve stale cached content instantly while asynchronously fetching an updated version in the background, delivering instant page loads without serving outdated content.",
    },
    {
      q: "What related tool helps build complete server configuration blocks?",
      a: "Use the Nginx Config Generator and .htaccess Generator in the Linux category to apply generated Cache-Control headers directly to web server virtual hosts.",
    },
  ],
  "cors-header-generator": [
    {
      q: "What Cross-Origin Resource Sharing (CORS) headers does this tool build?",
      a: "It constructs standard CORS response headers: Access-Control-Allow-Origin, Access-Control-Allow-Methods (GET, POST, PUT, DELETE, OPTIONS), Access-Control-Allow-Headers, Access-Control-Allow-Credentials, and Access-Control-Max-Age for preflight caching.",
    },
    {
      q: "Why does setting 'Access-Control-Allow-Origin: *' fail when credentials are enabled?",
      a: "Browser security standards forbid using the wildcard '*' origin when 'Access-Control-Allow-Credentials: true' is configured. You must specify the exact requesting domain origin explicitly.",
    },
    {
      q: "What is an HTTP CORS preflight (OPTIONS) request?",
      a: "Before sending non-simple requests (requests with custom headers or JSON payloads), browsers send an automatic HTTP OPTIONS request to verify that the server permits the cross-origin method and headers.",
    },
    {
      q: "Are my API domain names or CORS policies recorded externally?",
      a: "No. All CORS header generation executes purely on the client side in your browser session. No domain names or security rules leave your computer.",
    },
    {
      q: "How does 'Access-Control-Max-Age' optimize API performance?",
      a: "Setting 'Access-Control-Max-Age: 86400' caches the preflight OPTIONS response for 24 hours in the client browser, eliminating redundant preflight roundtrips on subsequent API calls.",
    },
    {
      q: "What related tool helps generate comprehensive HTTP security headers?",
      a: "Use the Security Header Generator to build complete suites of security headers alongside CORS policies.",
    },
  ],
  "csp-generator": [
    {
      q: "What security directives does the CSP Generator configure?",
      a: "It builds Content Security Policy (CSP) headers configuring default-src, script-src, style-src, img-src, connect-src, font-src, frame-ancestors, object-src, and upgrade-insecure-requests to prevent Cross-Site Scripting (XSS) and clickjacking.",
    },
    {
      q: "How does 'object-src 'none'' and 'base-uri 'self'' protect web applications?",
      a: "'object-src 'none'' blocks obsolete vulnerable Flash and Java applet plugins. 'base-uri 'self'' prevents attackers from injecting malicious <base href> tags to hijack relative script paths.",
    },
    {
      q: "What is the difference between 'Content-Security-Policy' and 'Content-Security-Policy-Report-Only'?",
      a: "'Content-Security-Policy' actively blocks unauthorized resources. 'Content-Security-Policy-Report-Only' allows resources to load normally while sending JSON policy violation reports to a reporting URL for testing before enforcement.",
    },
    {
      q: "Is my website security policy stored on LicenBase servers?",
      a: "No. The CSP generator runs 100% locally in your web browser using JavaScript. No domain policies or security configurations are transmitted.",
    },
    {
      q: "What related tool calculates cryptographic hashes for inline scripts?",
      a: "Use the CSP Hash Generator in the Security category to calculate SHA-256 digests for approved inline JavaScript code blocks.",
    },
    {
      q: "Why is 'frame-ancestors 'none'' preferred over the legacy X-Frame-Options header?",
      a: "'frame-ancestors' is the modern CSP standard that provides granular control over which specific domains may embed your page in an iframe, superseding legacy X-Frame-Options.",
    },
  ],
  "hsts-header-generator": [
    {
      q: "What does the HTTP Strict Transport Security (HSTS) header do?",
      a: "The 'Strict-Transport-Security' header instructs web browsers to only connect to your domain over encrypted HTTPS connections for a specified duration (max-age), blocking all unencrypted HTTP fallback attempts.",
    },
    {
      q: "What is HSTS Preloading and what requirements must be met?",
      a: "HSTS Preload hardcodes your domain directly into Google Chrome, Firefox, and Safari source code. It requires: 'max-age=31536000' (1 year minimum), 'includeSubDomains', and the 'preload' directive on your root domain.",
    },
    {
      q: "Why should you test HSTS with a short max-age before enabling preload?",
      a: "Enabling HSTS with includeSubDomains forces all subdomains to use valid SSL certificates. Testing with a short max-age (e.g. 5 minutes) ensures no internal subdomains break before committing to permanent preload inclusion.",
    },
    {
      q: "Does this generator store my domain name or security settings?",
      a: "No. The generator runs locally within your browser session using JavaScript. No domain names or header configurations are recorded.",
    },
    {
      q: "What related tool verifies whether your active SSL certificate is valid?",
      a: "Use the SSL Checker in the Diagnostics category to verify certificate chain integrity and expiration dates before enabling HSTS.",
    },
    {
      q: "How does HSTS protect users from SSL-stripping man-in-the-middle attacks?",
      a: "Because the browser knows HTTPS is mandatory, it automatically rewrites 'http://' to 'https://' internally before dispatching any network packets, defeating public Wi-Fi SSL-stripping tools.",
    },
  ],
  "security-header-generator": [
    {
      q: "What comprehensive security headers does this generator build?",
      a: "It constructs an all-in-one suite of enterprise HTTP response headers: Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy to achieve A+ security audit grades.",
    },
    {
      q: "What does the Permissions-Policy (formerly Feature-Policy) header control?",
      a: "It restricts browser hardware and API access, allowing sites to disable camera, microphone, geolocation, and payment APIs (e.g. 'camera=(), microphone=(), geolocation=()') to prevent unauthorized third-party script access.",
    },
    {
      q: "What is the recommended setting for the Referrer-Policy header?",
      a: "'strict-origin-when-cross-origin' is the industry best practice, sending full URL paths for same-origin requests but sending only the base domain origin over HTTPS cross-origin requests.",
    },
    {
      q: "Is my server security profile or domain name shared externally?",
      a: "No. All header generation logic executes locally in your browser. None of your security configurations or domain settings are uploaded.",
    },
    {
      q: "How do I apply these headers in Nginx and Apache web servers?",
      a: "In Nginx, add 'add_header HeaderName \"value\" always;' inside your server block. In Apache, add 'Header always set HeaderName \"value\"' inside httpd.conf or .htaccess.",
    },
    {
      q: "What related tool evaluates active security headers on a live website?",
      a: "Use the Security Headers tool in the Diagnostics category to inspect live website response headers and view security grade ratings.",
    },
  ],
}
