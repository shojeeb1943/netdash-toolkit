import type { Faq } from "@/lib/tool-faqs"

export const security_toolsFaqs: Record<string, Faq[]> = {
  "api-key-generator": [
    {
      q: "How does the API Key Generator create secure authentication keys?",
      a: "It utilizes the browser's cryptographic pseudo-random number generator (window.crypto.getRandomValues) to generate high-entropy strings across customizable character sets, byte lengths, and standard key prefix conventions (e.g. 'sk_live_', 'pk_test_').",
    },
    {
      q: "Why are key prefixes recommended for production API keys?",
      a: "Standardized prefixes (like 'sk_live_' for secret keys or 'pk_test_' for publishable keys) allow secret scanning tools (GitHub, GitGuardian) to immediately detect leaked tokens in code repositories and help developers identify key scopes at a glance.",
    },
    {
      q: "What is the recommended entropy length for production API keys?",
      a: "Production API keys should provide at least 256 bits of cryptographic entropy (typically 32 to 64 alphanumeric characters), making brute-force guessing attacks mathematically impossible.",
    },
    {
      q: "Are generated API keys transmitted over the network or saved in a database?",
      a: "No. All key generation runs 100% locally in your browser memory using Web Crypto APIs. Generated keys never touch any server or telemetry endpoint.",
    },
    {
      q: "What related tool helps calculate message authentication signatures using API secrets?",
      a: "Use the HMAC Generator to create SHA-256 and SHA-512 webhook verification signatures using your generated secret keys.",
    },
    {
      q: "How should secret API keys be stored on a web server?",
      a: "Store secret keys in protected environment variables (.env files outside document roots) or dedicated secret vaults (HashiCorp Vault, AWS Secrets Manager), never hardcoded inside public frontend code.",
    },
  ],
  "token-generator": [
    {
      q: "What types of security tokens can this tool generate?",
      a: "It generates secure random tokens across multiple formats: Hexadecimal (0-9, a-f), Base64, Base64URL, Alphanumeric, and custom character sets for session cookies, CSRF tokens, email verification codes, and password reset nonces.",
    },
    {
      q: "Why is Base64URL encoding preferred for web and URL parameters?",
      a: "Base64URL replaces '+' and '/' with '-' and '_' and omits trailing '=' padding characters, ensuring tokens can be passed inside URL query strings, cookies, and HTTP headers without URL percent-encoding issues.",
    },
    {
      q: "How does crypto.getRandomValues ensure cryptographic security?",
      a: "Unlike standard Math.random() which produces predictable pseudo-random sequences, crypto.getRandomValues taps into the operating system's kernel entropy pool (hardware interrupts, thermal noise), ensuring cryptographic unpredictability.",
    },
    {
      q: "Are my generated session tokens logged or stored externally?",
      a: "No. All tokens are generated in volatile browser memory. No tokens or configuration parameters are saved or transmitted.",
    },
    {
      q: "What related tool helps build formatted cryptographic JSON Web Tokens?",
      a: "Use the JWT Generator to create signed JWT payloads with expiration claims, audience tags, and custom JSON properties.",
    },
    {
      q: "What is the recommended token length for password reset links?",
      a: "Password reset tokens should be at least 32 bytes (256 bits) of random entropy and paired with a short time-to-live (e.g. 15 to 30 minutes) and single-use database invalidation.",
    },
  ],
  "secret-generator": [
    {
      q: "What is the purpose of the Secret Generator?",
      a: "This tool generates high-entropy cryptographic master secrets, encryption keys, cookie signing salts, and database encryption passphrases using hardware-backed Web Crypto entropy.",
    },
    {
      q: "What is the difference between an API key and an encryption secret?",
      a: "An API key identifies and authenticates a client application. An encryption secret (such as an AES-256 key or HMAC signing salt) is a private cryptographic key used to encrypt data payloads or sign digital signatures.",
    },
    {
      q: "Why should different environments use separate cryptographic secrets?",
      a: "Using distinct secrets for development, staging, and production ensures that a compromised test environment or staging database dump cannot be used to decrypt live production user data.",
    },
    {
      q: "Does this generator send generated secrets to any remote server?",
      a: "No. All generation executes client-side inside your browser session. None of your generated secrets, salts, or passphrases ever leave your computer.",
    },
    {
      q: "What related tool helps generate human-memorable multi-word passphrases?",
      a: "Use the Passphrase Generator to generate memorable multi-word passphrases using Diceware wordlists for master vault passwords.",
    },
    {
      q: "How do secret salts protect password hashes against rainbow table attacks?",
      a: "Adding a unique random salt to each password before hashing (e.g. via bcrypt or argon2) guarantees that identical passwords produce completely different hash outputs, defeating precomputed rainbow tables.",
    },
  ],
  "passphrase-generator": [
    {
      q: "How does the Passphrase Generator generate secure, memorable passphrases?",
      a: "It applies the Diceware methodology, selecting random words from curated dictionaries (EFF long wordlist) using cryptographic randomness, and allows adding custom separators, capitalizations, and numbers.",
    },
    {
      q: "Why are multi-word passphrases more secure than short complex passwords?",
      a: "A 5-word Diceware passphrase (e.g. 'correct-horse-battery-staple') provides ~65 bits of entropy, which is exponentially harder to brute-force than an 8-character complex password while being significantly easier for humans to remember.",
    },
    {
      q: "How many words are recommended for a master password or root passphrase?",
      a: "Using 5 to 6 random words provides 65 to 78 bits of entropy, which is recommended for master password manager vaults, SSH root access, and full-disk encryption passphrases.",
    },
    {
      q: "Is my generated passphrase recorded or sent over the network?",
      a: "No. The wordlist matching and random selections execute 100% locally in your web browser. No passphrases or user inputs are logged.",
    },
    {
      q: "What related tool checks whether a password has previously leaked in a data breach?",
      a: "Use the Pwned Password Checker to securely verify whether a password has appeared in historical public credential breaches using k-anonymity.",
    },
    {
      q: "Can automated dictionary attacks crack Diceware passphrases?",
      a: "No. Because each word is drawn independently and uniformly from a dictionary of 7,776 words, brute-forcing a 6-word passphrase requires testing over 221 trillion combinations.",
    },
  ],
  "hmac-generator": [
    {
      q: "What is an HMAC and how does this tool compute message signatures?",
      a: "An HMAC (Hash-based Message Authentication Code) combines a cryptographic hash function (SHA-256, SHA-512, SHA-1, MD5) with a secret key to verify both data integrity and authenticity of a message or webhook payload.",
    },
    {
      q: "Why are HMAC signatures standard for webhook verification (Stripe, GitHub, Shopify)?",
      a: "Webhooks transmit an HMAC signature in the HTTP headers (e.g. 'X-Hub-Signature-256'). The receiver recomputes the HMAC using the shared secret to verify that the payload was sent by the authentic service and was not modified in transit.",
    },
    {
      q: "What is the difference between a standard hash (SHA-256) and an HMAC?",
      a: "A standard hash depends solely on the message content. An HMAC incorporates a private secret key, ensuring that attackers cannot generate valid signatures even if they know the hash algorithm.",
    },
    {
      q: "Are my secret keys or message payloads uploaded to LicenBase?",
      a: "No. The HMAC calculations are executed entirely client-side in your web browser using the Web Cryptography API (crypto.subtle). Your secrets and payloads remain 100% private.",
    },
    {
      q: "What related tool helps generate secure random keys for HMAC secrets?",
      a: "Use the Secret Generator or API Key Generator to create 256-bit cryptographic keys for your HMAC webhook integrations.",
    },
    {
      q: "How can I prevent timing attacks when comparing HMAC signatures in code?",
      a: "Always compare HMAC signatures using a constant-time comparison function (e.g. crypto.timingSafeEqual in Node.js or hash_equals() in PHP) rather than standard equality operators ('==').",
    },
  ],
  "jwt-generator": [
    {
      q: "What is a JSON Web Token (JWT) and what components does this generator build?",
      a: "A JWT is a compact URL-safe format for transmitting security claims. This tool constructs the three standard base64url-encoded parts: Header (algorithm & token type), Payload (claims: sub, iss, aud, exp, iat, custom data), and digital Signature.",
    },
    {
      q: "Which signing algorithms are supported for JWT creation?",
      a: "The generator supports symmetric HMAC algorithms (HS256, HS384, HS512) using shared secrets, as well as unsigned tokens (alg: none) for local debugging and decoding.",
    },
    {
      q: "What standard claims should always be included in authentication JWTs?",
      a: "Always include 'exp' (expiration timestamp), 'iat' (issued-at timestamp), and 'sub' (subject/user ID) to ensure tokens expire properly and cannot be replayed indefinitely.",
    },
    {
      q: "Are my JWT payload claims or private secrets stored remotely?",
      a: "No. Token assembly and cryptographic signing execute entirely inside your browser using JavaScript and Web Crypto. No payload data leaves your device.",
    },
    {
      q: "What related tool helps calculate human-readable JWT expiration countdowns?",
      a: "Use the JWT Expiry Calculator to decode token timestamps, inspect expiration windows, and verify whether a token is currently active.",
    },
    {
      q: "Why should sensitive data like passwords never be stored inside JWT payloads?",
      a: "JWT payloads are base64url-encoded, not encrypted. Anyone who intercepts the token can decode and view all payload claims in plain text unless encrypted using JWE (JSON Web Encryption).",
    },
  ],
  "jwt-expiry-calculator": [
    {
      q: "What does the JWT Expiry Calculator analyze in a token?",
      a: "It decodes the raw JWT, extracts the 'exp' (expiration), 'iat' (issued at), and 'nbf' (not before) Unix timestamps, and calculates exact remaining validity time, elapsed duration, and expiration status in your local timezone and UTC.",
    },
    {
      q: "What happens when a JWT passes its 'exp' timestamp?",
      a: "Authentication middleware will reject the token with a 'TokenExpiredError' (HTTP 401 Unauthorized), requiring the client application to refresh the token using an OAuth refresh token or re-authenticate.",
    },
    {
      q: "What is clock skew allowance in JWT validation?",
      a: "Clock skew allows a small grace window (typically 30 to 60 seconds) during validation to account for slight timestamp drift between different application servers.",
    },
    {
      q: "Is my pasted JWT token sent to external servers for decoding?",
      a: "No. The decoding and timestamp calculations execute 100% client-side in your web browser. No token strings or payload claims are shared.",
    },
    {
      q: "What related tool allows creating newly signed JWT tokens?",
      a: "Use the JWT Generator to create custom signed JWT tokens with specified expiration windows and user claims.",
    },
    {
      q: "What does the 'nbf' (Not Before) claim represent in a JWT?",
      a: "The 'nbf' claim defines the earliest timestamp at which the token becomes valid. Any attempt to use the token before this timestamp will be rejected.",
    },
  ],
  "csp-hash-generator": [
    {
      q: "What is a Content Security Policy (CSP) hash and how is it used?",
      a: "A CSP hash is a cryptographic digest (SHA-256, SHA-384, or SHA-512) of an inline JavaScript snippet or CSS block. Placing the hash in your 'script-src' header allows that specific inline script to execute without enabling unsafe-inline.",
    },
    {
      q: "Why is using CSP hashes more secure than 'unsafe-inline'?",
      a: "Using 'unsafe-inline' allows any injected XSS script to execute freely. CSP hashes allow only exact pre-approved inline code blocks to run, blocking all unauthorized injected scripts.",
    },
    {
      q: "How does exact whitespace matching affect CSP hash validation?",
      a: "CSP hashes are calculated byte-for-byte on the script content between the 'script' tags. Modifying even a single space, newline, or tab will change the hash and cause the browser to block script execution.",
    },
    {
      q: "Are my JavaScript code snippets or stylesheet styles uploaded anywhere?",
      a: "No. The SHA hashing algorithms execute purely client-side in your browser using Web Crypto APIs. Your code snippets remain completely private.",
    },
    {
      q: "What related tool helps build complete Nginx and Apache security headers?",
      a: "Use the Nginx Config Generator and Apache VirtualHost Generator in the Linux category to configure complete Content-Security-Policy headers.",
    },
    {
      q: "What is the alternative to CSP hashes for dynamic inline scripts?",
      a: "CSP Nonces ('nonce-randomvalue') provide an alternative by generating a unique random cryptographic token per HTTP request that must match on both the header and script tag.",
    },
  ],
  "uuid-validator": [
    {
      q: "What does the UUID Validator verify on a UUID string?",
      a: "It verifies standard 36-character 8-4-4-4-12 hexadecimal formatting, detects the UUID version (Version 1 time-based, Version 4 random, Version 5 SHA-1, Version 7 Unix epoch), and extracts timestamp metadata where applicable.",
    },
    {
      q: "What makes UUID Version 4 the most common format?",
      a: "UUID v4 generates 122 bits of pure random entropy (e.g. 'f47ac10b-58cc-4372-a567-0e02b2c3d479'), providing astronomical collision resistance without revealing system MAC addresses or timestamps.",
    },
    {
      q: "What are the advantages of UUID Version 7 in database indexing?",
      a: "UUID v7 incorporates a millisecond Unix timestamp in the leading 48 bits, creating time-ordered sequential UUIDs that eliminate B-Tree fragmentation in MySQL and PostgreSQL databases.",
    },
    {
      q: "Is my UUID string transmitted or stored in a database?",
      a: "No. All validation and metadata extraction execute 100% locally in your web browser. No UUIDs or user inputs are logged.",
    },
    {
      q: "What related tool generates batches of fresh cryptographic UUIDs?",
      a: "Use the UUID Bulk Generator to create hundreds of random UUID v4 or sequential UUID v7 identifiers.",
    },
    {
      q: "What is a Nil UUID in software specifications?",
      a: "The Nil UUID is a special-case identifier consisting of all zeros ('00000000-0000-0000-0000-000000000000') used to represent an empty, unset, or default identifier.",
    },
  ],
  "cve-search": [
    {
      q: "What database does the CVE Search tool query?",
      a: "It queries official National Vulnerability Database (NVD) and MITRE Common Vulnerabilities and Exposures (CVE) records to retrieve vulnerability descriptions, CVSS severity scores, affected software versions, and official patch advisories.",
    },
    {
      q: "What is a CVSS score and how do I interpret the severity rating?",
      a: "The Common Vulnerability Scoring System (CVSS v3.1) rates vulnerabilities from 0.0 to 10.0: Low (0.1-3.9), Medium (4.0-6.9), High (7.0-8.9), and Critical (9.0-10.0). Critical vulnerabilities typically allow remote code execution without authentication.",
    },
    {
      q: "Can I search by software package name as well as CVE identifier?",
      a: "Yes. You can enter specific CVE IDs (e.g. 'CVE-2024-6387') or search by software package and version (e.g. 'OpenSSH 9.6p1' or 'cPanel') to identify known security vulnerabilities.",
    },
    {
      q: "Is my search query logged or shared with external security agencies?",
      a: "No. Search queries query public vulnerability APIs in real time for diagnostic evaluation only. We do not store or track user searches.",
    },
    {
      q: "What security software automatically patches known CVEs on cPanel servers?",
      a: "Imunify360 provides proactive defense and automated kernel/PHP patching that neutralizes active CVE exploits before official software vendor patches are applied.",
    },
    {
      q: "What is the difference between a zero-day vulnerability and a published CVE?",
      a: "A zero-day vulnerability is an unpatched flaw actively exploited in the wild before public disclosure. A published CVE is a formally cataloged vulnerability with an assigned identifier and vendor remediation steps.",
    },
  ],
  "pwned-password-checker": [
    {
      q: "How does the Pwned Password Checker verify breached credentials securely?",
      a: "It uses k-anonymity mathematical models: it computes the SHA-1 hash of the password locally in your browser, sends only the first 5 characters of the hash to the HaveIBeenPwned API, and matches the remaining hash suffix locally.",
    },
    {
      q: "Does my real password ever leave my web browser?",
      a: "No, never. Your plaintext password is never sent over the network. The remote API only receives a 5-character hash prefix shared by thousands of unrelated passwords, ensuring complete mathematical privacy.",
    },
    {
      q: "What should I do if my password appears in the breach database?",
      a: "Immediately change that password on all websites where it was used, enable two-factor authentication (2FA), and generate a unique high-entropy passphrase using a password manager.",
    },
    {
      q: "Is my password search recorded or added to any list?",
      a: "No. All hashing occurs in local memory and the search results are discarded immediately. No queries or hashes are saved.",
    },
    {
      q: "What related tool helps create unbreachable master passwords?",
      a: "Use the Passphrase Generator to create long, memorable Diceware passphrases and the Secret Generator for high-entropy alphanumeric strings.",
    },
    {
      q: "Why is credential stuffing dangerous for users who reuse passwords?",
      a: "When a single website suffers a database breach, automated cybercrime bots test the leaked email and password combinations across thousands of other services (cPanel, banking, email, WHMCS).",
    },
  ],
}
