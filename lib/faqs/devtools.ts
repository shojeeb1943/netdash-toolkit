import type { Faq } from "@/lib/tool-faqs"

export const devtoolsFaqs: Record<string, Faq[]> = {
  "hash-generator": [
    {
      q: "What cryptographic hash algorithms does the Hash Generator compute?",
      a: "It computes cryptographic digests across SHA-1, SHA-256, SHA-384, SHA-512, and legacy MD5 algorithms using native browser Web Cryptography APIs.",
    },
    {
      q: "Why is SHA-256 the standard choice for data integrity verification?",
      a: "SHA-256 produces a 256-bit (64-character hex) digest with zero known collision vulnerabilities, making it the industry standard for SSL certificates, digital signatures, and file checksums.",
    },
    {
      q: "Can I hash both text strings and binary files in this tool?",
      a: "Yes. You can paste plain text to compute live string hashes, or drag and drop local files to stream file bytes through the hasher without uploading anything to a server.",
    },
    {
      q: "Are my hashed passwords or private text strings uploaded anywhere?",
      a: "No. All hashing occurs 100% client-side in your web browser using 'crypto.subtle.digest'. No text, files, or computed hashes leave your local machine.",
    },
    {
      q: "What related tool generates Subresource Integrity hashes for web scripts?",
      a: "Use the SRI Hash Generator to generate base64-encoded SHA-384 integrity hashes with 'integrity=\"sha384-...\"' attributes for HTML script and link tags.",
    },
    {
      q: "What is the difference between a hash function and an encryption algorithm?",
      a: "A hash function is a one-way mathematical function that cannot be decrypted or reversed. Encryption is a two-way mathematical process that requires a private decryption key to recover original data.",
    },
  ],
  "password-generator": [
    {
      q: "How does the Password Generator ensure strong password creation?",
      a: "It uses the Web Cryptography API (crypto.getRandomValues) to draw random characters from customizable uppercase, lowercase, number, and special symbol pools, calculating real-time password entropy.",
    },
    {
      q: "What password length is recommended for administrative server accounts?",
      a: "Administrative and root server passwords should be at least 16 to 24 characters long with mixed character types, providing over 90 bits of entropy against brute-force attacks.",
    },
    {
      q: "Does this generator exclude ambiguous characters (like 1, l, I, 0, O)?",
      a: "Yes. You can enable the 'Exclude Ambiguous Characters' option to prevent confusing character pairs when manually transcribing passwords.",
    },
    {
      q: "Are my generated passwords stored, logged, or sent over the internet?",
      a: "No. Passwords are generated strictly in local browser memory and discarded upon page refresh. No passwords are transmitted.",
    },
    {
      q: "What related tool calculates the exact mathematical strength of a password?",
      a: "Use the Password Entropy Calculator to measure brute-force crack times and entropy bits across different attack scenarios.",
    },
    {
      q: "What related tool generates multi-word Diceware passphrases?",
      a: "Use the Passphrase Generator in the Security category to create memorable multi-word passphrases for master vaults.",
    },
  ],
  "base64-encoder": [
    {
      q: "What operations does the Base64 Encoder & Decoder perform?",
      a: "It encodes text and binary data into standard RFC 4648 Base64 or URL-safe Base64 strings, and decodes Base64 payloads back into UTF-8 text with full Unicode emoji support.",
    },
    {
      q: "What is the difference between standard Base64 and Base64URL?",
      a: "Standard Base64 uses '+' and '/' characters and '=' padding. Base64URL replaces them with '-' and '_' and omits padding, allowing safe usage inside URL query parameters and JWT tokens.",
    },
    {
      q: "Why does Base64 encoding increase raw data size by ~33%?",
      a: "Base64 represents 3 bytes of binary data (24 bits) as 4 ASCII text characters (6 bits each), resulting in a 4/3 (~33.3%) size expansion.",
    },
    {
      q: "Is my encoded or decoded text sent to any remote server?",
      a: "No. All encoding and decoding execute 100% locally in your web browser session using JavaScript Uint8Array buffers. Your data remains completely private.",
    },
    {
      q: "What related tool helps convert local image files into Base64 Data URIs?",
      a: "Use the Image to Base64 tool in the Files category to convert PNG, JPEG, and SVG graphics into inline 'data:image/...;base64,' strings.",
    },
    {
      q: "How does this tool handle non-ASCII Unicode characters and emojis?",
      a: "The tool uses TextEncoder and TextDecoder APIs to handle UTF-8 byte streams cleanly, avoiding legacy 'atob()' Latin-1 character crashes on multi-byte Unicode.",
    },
  ],
  "url-encoder": [
    {
      q: "What is the difference between encodeURI and encodeURIComponent?",
      a: "'encodeURI' preserves full URL protocol delimiters (e.g. 'https://', '/', '?', '&'). 'encodeURIComponent' encodes all special characters (including '/', '?', '&') for embedding values safely inside query parameters.",
    },
    {
      q: "Why do spaces get converted to '%20' or '+' in URLs?",
      a: "URLs cannot contain literal whitespace. '%20' is the standard RFC 3986 percent-encoding for spaces, while '+' is standard for HTML form submissions (application/x-www-form-urlencoded).",
    },
    {
      q: "Can I decode nested percent-encoded URL strings?",
      a: "Yes. The tool decodes multi-level encoded URLs and query parameters back into human-readable text.",
    },
    {
      q: "Are my URL strings or encoded query parameters uploaded to a server?",
      a: "No. All encoding and decoding execute client-side in your web browser. None of your URL strings leave your device.",
    },
    {
      q: "What related tool breaks down full URLs into protocol, host, and query components?",
      a: "Use the URL Parser in the SEO category to inspect structured query parameters and hostname segments.",
    },
    {
      q: "What causes 'URIError: URI malformed' during decoding?",
      a: "This error occurs when a percent sign (%) is followed by invalid hex digits (e.g. '%ZZ') or truncated multi-byte UTF-8 sequences. The tool flags malformed sequences automatically.",
    },
  ],
  "json-formatter": [
    {
      q: "What capabilities does the JSON Formatter & Validator offer?",
      a: "It formats, indents, minifies, validates, and color-highlights raw JSON data, detecting syntax errors (missing commas, unquoted keys, trailing commas) with exact line and column pointers.",
    },
    {
      q: "Can I customize indentation spacing (2 spaces, 4 spaces, tabs)?",
      a: "Yes. You can switch between 2-space indentation (standard for web APIs), 4-space indentation, tab indentation, or compact 1-line minification.",
    },
    {
      q: "How does JSON minification reduce API payload bandwidth?",
      a: "Minification strips all unnecessary whitespace, indentation spaces, and newline characters, shrinking JSON payload sizes by 20% to 40% before network transmission.",
    },
    {
      q: "Is my JSON data or API payload sent to external servers?",
      a: "No. The JSON parser and formatter run 100% locally in your web browser session using JavaScript. No JSON data is recorded or uploaded.",
    },
    {
      q: "What related tool converts JSON data structures into YAML or TypeScript interfaces?",
      a: "Use the JSON to YAML tool for configuration conversion and JSON to TypeScript to generate typed TypeScript interface declarations.",
    },
    {
      q: "Why are trailing commas invalid in standard JSON?",
      a: "The strict JSON specification (RFC 8259) forbids trailing commas after the last element in arrays or objects. The validator automatically highlights and cleans trailing commas.",
    },
  ],
  "jwt-decoder": [
    {
      q: "What information does the JWT Decoder extract from a token?",
      a: "It decodes base64url-encoded JSON Web Tokens, displaying the Header (algorithm, key ID), Payload (claims: sub, iss, aud, exp, iat, custom user roles), and signature status in a colorized interface.",
    },
    {
      q: "Does decoding a JWT verify its cryptographic signature?",
      a: "No. Decoding inspects the plaintext payload data contained within the token. Cryptographic signature verification requires the private signing key or public certificate on an authorized backend server.",
    },
    {
      q: "How does the tool display human-readable expiration dates?",
      a: "It automatically converts Unix integer timestamps in 'exp' and 'iat' claims into local calendar dates and countdown badges indicating whether the token is currently active or expired.",
    },
    {
      q: "Is my secret JWT token sent to any external server during decoding?",
      a: "No. Decoding is performed 100% client-side in your web browser using string splitting and base64url decoding. Your tokens remain completely private.",
    },
    {
      q: "What related tool helps calculate remaining time before a token expires?",
      a: "Use the JWT Expiry Calculator in the Security category for detailed timestamp breakdown and clock skew analysis.",
    },
    {
      q: "Why is sensitive user data like passwords unsafe in standard JWT payloads?",
      a: "JWT payloads are base64-encoded, not encrypted. Any client or intermediary network proxy can read all payload claims in plain text unless encrypted via JWE.",
    },
  ],
  "timestamp-converter": [
    {
      q: "What date formats does the Timestamp Converter support?",
      a: "It translates between Unix epoch seconds, epoch milliseconds, ISO 8601 strings, UTC format, RFC 2822 dates, and localized human-readable calendar timestamps in real time.",
    },
    {
      q: "What is the Year 2038 Problem (Y2K38)?",
      a: "On January 19, 2038, standard 32-bit signed integer Unix timestamps will overflow. Modern 64-bit systems handle timestamps safely for billions of years into the future.",
    },
    {
      q: "How do I determine if a timestamp is in seconds or milliseconds?",
      a: "10-digit integers (e.g. 1760000000) represent Unix epoch seconds. 13-digit integers (e.g. 1760000000000) represent milliseconds commonly used in JavaScript Date objects.",
    },
    {
      q: "Are my timestamp queries logged or tracked?",
      a: "No. All date conversions execute locally in your web browser using JavaScript Date APIs. No timestamps or searches are shared.",
    },
    {
      q: "What related tool helps parse and test scheduled cron expressions?",
      a: "Use the Cron Parser to translate cron schedule strings into human-readable descriptions and upcoming execution timestamps.",
    },
    {
      q: "How does the tool handle daylight saving time (DST) shifts?",
      a: "The converter evaluates your browser's local timezone offset and UTC definitions to display accurate local times across historical and future DST changes.",
    },
  ],
  "cron-parser": [
    {
      q: "What cron expression formats does the Cron Parser support?",
      a: "It parses standard 5-field UNIX crontab expressions (Minute, Hour, Day of Month, Month, Day of Week) as well as 6-field system expressions with seconds, translating them into clear human-readable sentences.",
    },
    {
      q: "Does this tool calculate upcoming execution run times?",
      a: "Yes. It displays the next 5 to 10 scheduled execution timestamps in both your local timezone and UTC, allowing you to verify schedule accuracy before deploying crontab rules.",
    },
    {
      q: "What do the special characters *, /, ,, and - represent in cron syntax?",
      a: "'*' means every unit, '/' specifies step intervals (e.g. '*/5' for every 5 minutes), ',' lists discrete values ('1,15'), and '-' defines ranges ('9-17' for business hours).",
    },
    {
      q: "Is my cron schedule or application path uploaded anywhere?",
      a: "No. The parsing engine executes 100% locally in your web browser session using JavaScript. No cron expressions or system data leave your machine.",
    },
    {
      q: "What related tool helps generate native systemd cron timers for Linux?",
      a: "Use the Systemd Timer Generator in the Linux category to build modern .timer unit files for scheduled background tasks.",
    },
    {
      q: "What is the difference between crontab '0 0 * * *' and '@daily'?",
      a: "'0 0 * * *' and '@daily' (or '@midnight') are functionally identical in vixie-cron, executing tasks once daily at 00:00 (midnight).",
    },
  ],
  "regex-tester": [
    {
      q: "What regex engines and features does the Regex Tester support?",
      a: "It tests JavaScript (ECMAScript) and PCRE-compatible regular expressions against sample text in real time, highlighting matching groups, capture indices, and supporting flags: global (g), case-insensitive (i), multiline (m), and dotAll (s).",
    },
    {
      q: "How does capture group extraction assist in string parsing?",
      a: "It breaks down matching substrings into numbered ($1, $2) and named (?'group') capture groups, allowing developers to extract structured fields from raw server logs.",
    },
    {
      q: "What is catastrophic backtracking and how can it be avoided?",
      a: "Catastrophic backtracking occurs when nested ambiguous quantifiers (e.g. (a+)+$) cause exponential regex backtracking on non-matching strings, freezing the CPU. Using atomic groups or specific character classes prevents backtracking lockups.",
    },
    {
      q: "Is my regex pattern or test text stored or uploaded remotely?",
      a: "No. All regular expression matching executes client-side in your browser's V8 engine. None of your patterns or test data are transmitted.",
    },
    {
      q: "What related tool helps build terminal regex search commands?",
      a: "Use the Grep Command Generator in the Linux category to translate tested regular expressions into recursive terminal grep commands.",
    },
    {
      q: "What is the difference between greedy and lazy quantifiers in regex?",
      a: "Greedy quantifiers ('.*') match the longest possible string. Adding a question mark ('.*?') makes the quantifier lazy, matching the shortest possible string up to the next delimiter.",
    },
  ],
  "color-converter": [
    {
      q: "What color models and formats does the Color Converter translate?",
      a: "It converts colors between HEX (#ffffff), RGB/RGBA (255, 255, 255), HSL/HSLA, HWB, CMYK (for print design), and modern CSS Color Module 4 OKLCH and OKLAB color spaces.",
    },
    {
      q: "Why are OKLCH and OKLAB color spaces preferred in modern CSS?",
      a: "OKLCH is perceptually uniform across all hues, ensuring consistent visual brightness and contrast across color palettes, while unlocking wide-gamut P3 display colors.",
    },
    {
      q: "Does this tool calculate WCAG color contrast ratios?",
      a: "Yes. It calculates contrast ratios against white and black backgrounds, rating compliance with WCAG 2.1 AA (4.5:1 for normal text) and AAA (7:1) accessibility standards.",
    },
    {
      q: "Are my brand color codes or palettes logged remotely?",
      a: "No. All color conversions and color space transformations execute locally in your browser. No palette data is shared.",
    },
    {
      q: "What related tool helps extract color hex codes from web assets?",
      a: "Use the CSS Minifier and Web Manifest Generator to apply converted color values to stylesheets and Progressive Web App theme colors.",
    },
    {
      q: "How does alpha transparency channel conversion work in HEX codes?",
      a: "8-digit hex codes append a 2-digit hex alpha channel (e.g. '#ffffff80' represents white with 50% opacity, equivalent to 'rgba(255, 255, 255, 0.5)').",
    },
  ],
  "lorem-generator": [
    {
      q: "What content types can the Lorem Ipsum Generator create?",
      a: "It generates placeholder filler text across paragraphs, sentences, words, bulleted lists, and HTML markup blocks, with options for classic Cicero Latin or modern English dummy copy.",
    },
    {
      q: "Why is placeholder dummy text standard in UI and web design?",
      a: "Lorem ipsum provides realistic word length distributions and typographic visual texture, allowing designers and clients to evaluate page layout and typography without being distracted by readable draft copy.",
    },
    {
      q: "Can I generate HTML markup tags (p, h2, ul, li) directly?",
      a: "Yes. You can toggle HTML output to generate pre-wrapped ''p'', ''h2'', and ''ul''li'' tags with 1-click copy for rapid web template prototyping.",
    },
    {
      q: "Is any generated dummy text or configuration transmitted externally?",
      a: "No. Text generation algorithms run 100% locally in your web browser session using JavaScript. No data is stored or transmitted.",
    },
    {
      q: "What related tool helps measure the word count and reading time of generated text?",
      a: "Use the Word Counter and Reading Time Calculator in the SEO category to inspect text metrics across your mockups.",
    },
    {
      q: "What is the historical origin of the classic 'Lorem ipsum' passage?",
      a: "The text is derived from sections 1.10.32 and 1.10.33 of Cicero's 45 BC philosophical treatise 'De Finibus Bonorum et Malorum' (On the Extremes of Good and Evil).",
    },
  ],
  "yaml-formatter": [
    {
      q: "What formatting and validation checks does the YAML Formatter perform?",
      a: "It formats, lints, and validates YAML syntax, fixing indentation depth (2-space standard), verifying key-value mappings, and highlighting syntax errors with exact line and column numbers.",
    },
    {
      q: "Why is strict indentation critical in YAML files?",
      a: "YAML relies on whitespace indentation rather than curly brackets to define object hierarchy. Mixing tab characters with spaces or using inconsistent indentation will cause Docker, Kubernetes, and CI/CD parsers to crash.",
    },
    {
      q: "Can this tool convert tabs to spaces automatically?",
      a: "Yes. The formatter automatically converts forbidden tab characters into standard 2-space indentation levels compliant with official YAML 1.2 specifications.",
    },
    {
      q: "Is my YAML configuration or CI/CD pipeline file sent to external servers?",
      a: "No. All YAML parsing and formatting execute client-side in your web browser using JavaScript. No configuration files leave your machine.",
    },
    {
      q: "What related tool converts YAML into JSON for API development?",
      a: "Use the YAML to JSON and JSON to YAML tools to convert data structures bidirectionally between formats.",
    },
    {
      q: "How does YAML represent multi-line string blocks?",
      a: "YAML uses the pipe operator ('|') to preserve literal newlines (literal block scalar) and the greater-than sign ('') to fold multi-line strings into a single paragraph.",
    },
  ],
  "xml-formatter": [
    {
      q: "What does the XML Formatter & Validator do?",
      a: "It parses, indents, colorizes, and validates XML documents, detecting unclosed tags, attribute syntax errors, unescaped XML entities, and CDATA blocks with exact line error highlighting.",
    },
    {
      q: "Can I minify XML documents as well as format them?",
      a: "Yes. You can format XML with clean hierarchical indentation (2 spaces or 4 spaces) or minify XML into a compact single-line string to reduce file size.",
    },
    {
      q: "How does this tool handle XML declaration headers and self-closing tags?",
      a: "It preserves '?xml version=\"1.0\" encoding=\"UTF-8\"?' declarations, formats self-closing tags ('tag /') cleanly, and validates XML namespace attributes (xmlns).",
    },
    {
      q: "Are my XML files, sitemaps, or RSS feeds uploaded to LicenBase?",
      a: "No. The XML DOM parser runs 100% locally in your web browser. None of your XML documents or data structures are transmitted.",
    },
    {
      q: "What related tool generates compliant XML sitemaps for SEO?",
      a: "Use the Sitemap Generator in the SEO category to build validated XML sitemaps for search engine indexing.",
    },
    {
      q: "What are the 5 predefined XML entity references?",
      a: "Special characters must be escaped in XML: '&lt;' for '', '&gt;' for '', '&amp;' for '&', '&apos;' for ', and '&quot;' for '\"'.",
    },
  ],
  "sql-formatter": [
    {
      q: "What SQL dialects does the SQL Formatter support?",
      a: "It formats and beautifies SQL queries across standard ANSI SQL, MySQL, MariaDB, PostgreSQL, SQLite, Microsoft SQL Server (T-SQL), and Oracle PL/SQL.",
    },
    {
      q: "How does SQL formatting improve database query maintainability?",
      a: "It standardizes keyword capitalization (SELECT, FROM, WHERE, JOIN, GROUP BY), aligns subqueries, and indents nested ON/AND clauses for immediate visual clarity.",
    },
    {
      q: "Can this tool minify complex SQL queries into single lines?",
      a: "Yes. You can switch between formatted multi-line indentation and single-line minification to embed clean queries inside application code strings.",
    },
    {
      q: "Is my SQL database query or schema structure sent to remote servers?",
      a: "No. The SQL formatting engine executes entirely on the client side in your web browser using JavaScript. No database queries or table structures leave your computer.",
    },
    {
      q: "What related tool helps minify SQL queries for production deployment?",
      a: "Use the SQL Minifier to strip comments and whitespace from database migration scripts.",
    },
    {
      q: "Why is keyword capitalization recommended in SQL code standards?",
      a: "Capitalizing SQL keywords distinguishes database commands from table names and column identifiers, making complex multi-join queries significantly easier to audit.",
    },
  ],
  "json-to-yaml": [
    {
      q: "How does the JSON to YAML Converter translate data structures?",
      a: "It parses raw JSON objects and arrays and translates them into clean, human-readable YAML with standard 2-space hierarchy indentation and native type mapping (strings, booleans, numbers, nulls).",
    },
    {
      q: "Why is YAML preferred over JSON for configuration files (Docker, Kubernetes, GitHub Actions)?",
      a: "YAML eliminates noisy curly brackets, quotation marks, and comma requirements, supports comments (#), and uses intuitive visual indentation, making configuration files cleaner to maintain.",
    },
    {
      q: "Does this tool preserve data types during conversion?",
      a: "Yes. It accurately maps JSON booleans (true/false), floating-point numbers, integers, null values, and nested arrays without data truncation or type coercion.",
    },
    {
      q: "Is my JSON payload or configuration data uploaded to any API?",
      a: "No. All conversion algorithms run 100% locally in your browser session using JavaScript. No data is stored or transmitted.",
    },
    {
      q: "What related tool converts YAML files back into JSON format?",
      a: "Use the YAML to JSON tool to convert YAML configuration files back into JSON payloads for REST API consumption.",
    },
    {
      q: "How does the converter handle special characters in strings?",
      a: "Strings containing colons, quotes, or special YAML syntax symbols are automatically wrapped in safe quotation marks to preserve YAML parser validity.",
    },
  ],
  "yaml-to-json": [
    {
      q: "What does the YAML to JSON Converter do?",
      a: "It parses YAML documents, validates indentation and node structures, and converts the data into formatted or minified JSON compliant with RFC 8259 specifications.",
    },
    {
      q: "Why is YAML to JSON conversion needed in modern web development?",
      a: "While developers write configurations in YAML, web APIs, frontend applications, and database engines natively ingest structured JSON payloads.",
    },
    {
      q: "Can I customize the output JSON indentation format?",
      a: "Yes. You can export JSON with 2-space indentation, 4-space indentation, or compact 1-line minification for production API payloads.",
    },
    {
      q: "Is my YAML file or configuration structure sent over the network?",
      a: "No. The parsing and conversion execute client-side in your web browser. None of your YAML data or server configurations leave your machine.",
    },
    {
      q: "What related tool converts JSON payloads into TypeScript interfaces?",
      a: "Use the JSON to TypeScript tool to generate typed interface definitions directly from your converted JSON data.",
    },
    {
      q: "How does the parser handle multi-document YAML files (separated by '---')?",
      a: "Multi-document YAML streams are parsed into a top-level JSON array containing each individual document object.",
    },
  ],
  "json-to-typescript": [
    {
      q: "How does the JSON to TypeScript Generator construct type definitions?",
      a: "It recursively analyzes JSON objects, arrays, and nested properties to generate strongly typed TypeScript 'interface' or 'type' declarations with accurate property types and optional flag detections.",
    },
    {
      q: "Does this generator support nested interfaces and union types?",
      a: "Yes. Nested objects are extracted into clean modular sub-interfaces, and arrays containing heterogeneous data types are typed with union types (e.g. '(string | number)[]').",
    },
    {
      q: "How does automatic type generation reduce frontend runtime bugs?",
      a: "Generating TypeScript interfaces directly from live API responses ensures strict compile-time type checking, preventing 'undefined is not a function' and missing property crashes.",
    },
    {
      q: "Is my JSON schema or application data uploaded to a server?",
      a: "No. The type generator runs 100% locally in your web browser session using JavaScript. No JSON schemas or interfaces are transmitted.",
    },
    {
      q: "What related tool helps format and validate JSON payloads?",
      a: "Use the JSON Formatter to inspect and validate raw JSON API responses before generating TypeScript definitions.",
    },
    {
      q: "Can I customize root interface names and export keyword styles?",
      a: "Yes. You can specify custom root type names (e.g. 'UserProfile' or 'ApiResponse') and toggle 'export interface' syntax.",
    },
  ],
  "csv-to-json": [
    {
      q: "How does the CSV to JSON Converter transform tabular data?",
      a: "It parses comma-separated (CSV), tab-separated (TSV), or semicolon-separated spreadsheets, treats the first row as object keys, and outputs an array of structured JSON objects with automated number/boolean type parsing.",
    },
    {
      q: "How does this tool handle commas inside quoted spreadsheet cells?",
      a: "It adheres to RFC 4180 standards, correctly preserving commas, quotes, and line breaks that occur inside double-quoted text cells without splitting columns incorrectly.",
    },
    {
      q: "Can I choose between an Array of Objects and an Array of Arrays?",
      a: 'Yes. You can export data as an Array of Objects (\'[{"id": 1, "name": "Val"}]\') or as a compact Array of Arrays matrix (\'[["id", "name"], [1, "Val"]]\').',
    },
    {
      q: "Is my CSV file data or spreadsheet uploaded to external databases?",
      a: "No. All CSV parsing and JSON serialization execute locally inside your web browser. None of your tabular data leaves your computer.",
    },
    {
      q: "What related tool converts JSON data back into CSV spreadsheet format?",
      a: "Use the JSON to CSV tool to export JSON API payloads into downloadable CSV files for Microsoft Excel and Google Sheets.",
    },
    {
      q: "What related tool allows viewing and filtering CSV files interactively?",
      a: "Use the CSV Viewer in the Files category to view, sort, and search spreadsheet tables directly in the browser.",
    },
  ],
  "json-to-csv": [
    {
      q: "How does the JSON to CSV Converter export structured data?",
      a: "It extracts top-level and nested keys from JSON arrays of objects, flattens hierarchical properties with dot notation (e.g. 'user.address.city'), and generates RFC 4180-compliant CSV files with 1-click download.",
    },
    {
      q: "How does the converter handle nested arrays and object properties?",
      a: "Nested objects are flattened into dedicated columns using dot notation, and arrays are serialized as comma-separated or JSON-encoded strings within individual cells.",
    },
    {
      q: "Does the generated CSV open cleanly in Microsoft Excel and Google Sheets?",
      a: "Yes. The tool formats text with proper quotation wrapping and includes an optional UTF-8 Byte Order Mark (BOM) to ensure Excel renders international characters and accents perfectly.",
    },
    {
      q: "Are my JSON datasets uploaded or stored remotely?",
      a: "No. Conversion and file generation run 100% client-side in your web browser. No data is stored or sent to remote servers.",
    },
    {
      q: "What related tool converts CSV spreadsheets back into JSON arrays?",
      a: "Use the CSV to JSON tool to convert CSV and TSV files into JSON for REST API endpoints.",
    },
    {
      q: "What is the maximum JSON dataset size this tool can convert?",
      a: "Because it runs in browser memory, it can comfortably convert datasets of tens of thousands of rows within seconds without server upload limits.",
    },
  ],
  "password-entropy-calculator": [
    {
      q: "What is password entropy and how does this calculator compute it?",
      a: "Password entropy measures cryptographic strength in bits using the formula E = L * log2(R), where L is password length and R is character pool size (lowercase, uppercase, numbers, symbols). Higher bits indicate exponential resistance to brute-force attacks.",
    },
    {
      q: "How many bits of entropy are required for high security?",
      a: "Under 40 bits is weak (crackable in seconds), 40-60 bits is reasonable for casual accounts, 60-80 bits is strong, and 80+ bits provides military-grade resistance against supercomputer offline cracking clusters.",
    },
    {
      q: "Does this tool calculate estimated crack time across GPU clusters?",
      a: "Yes. It estimates crack times across different hardware tiers: single CPU (10k guesses/sec), high-end GPU cluster (100 billion guesses/sec), and state-sponsored ASIC cracking rigs.",
    },
    {
      q: "Is my tested password sent over the network or stored in logs?",
      a: "No. The entropy math runs 100% locally in your web browser session using JavaScript. No passwords or keystrokes leave your machine.",
    },
    {
      q: "What related tool checks whether a password has appeared in historical data breaches?",
      a: "Use the Pwned Password Checker in the Security category to verify credentials against known public database leaks using k-anonymity.",
    },
    {
      q: "Why does doubling password length increase entropy much more than adding special symbols?",
      a: "Entropy scales linearly with length in the exponent. An 18-character lowercase password has more entropy than an 8-character complex password containing symbols and numbers.",
    },
  ],
  "sri-hash-generator": [
    {
      q: "What is Subresource Integrity (SRI) and what does this tool generate?",
      a: "SRI is a W3C security standard that enables browsers to verify that resources fetched from third-party CDNs (jQuery, Bootstrap, React) have not been maliciously manipulated, generating 'integrity=\"sha384-...\"' HTML attributes.",
    },
    {
      q: "How does SRI protect websites against CDN compromise attacks?",
      a: "When a script tag includes an SRI integrity hash, the browser computes the hash of the downloaded script before executing it. If an attacker tampers with the CDN file, the hashes will not match and the browser blocks execution.",
    },
    {
      q: "Why is 'crossorigin=\"anonymous\"' mandatory on SRI script tags?",
      a: "CORS authorization is required for browsers to read and hash cross-origin script bytes. Without 'crossorigin=\"anonymous\"', the browser will block the script from loading.",
    },
    {
      q: "Are my scripts or CSS stylesheets uploaded to LicenBase servers?",
      a: "No. All SHA-256, SHA-384, and SHA-512 hashing runs locally in your web browser using Web Crypto APIs. Your files remain completely private.",
    },
    {
      q: "What related tool helps build complete Content Security Policy headers?",
      a: "Use the CSP Generator in the HTTP category to enforce strict resource loading policies alongside SRI hashes.",
    },
    {
      q: "Which hash algorithm is recommended for SRI tags?",
      a: "SHA-384 is the industry-standard recommendation for Subresource Integrity, providing the optimal balance of cryptographic security and browser performance.",
    },
  ],
  "html-formatter": [
    {
      q: "What does the HTML Formatter & Beautifier do?",
      a: "It formats messy, unformatted, or minified HTML documents into clean, indented code with customizable 2-space or 4-space indentation, consistent tag nesting, and inline script/style formatting.",
    },
    {
      q: "Can I format embedded CSS ('style') and JavaScript ('script') blocks?",
      a: "Yes. The formatter recursively beautifies embedded CSS rules and JavaScript functions inside script tags along with the surrounding HTML markup.",
    },
    {
      q: "How does clean HTML formatting assist in debugging layout issues?",
      a: "Indented HTML makes unclosed 'div' tags, mismatched container wrappers, and broken table structures visually apparent immediately.",
    },
    {
      q: "Is my HTML source code uploaded or stored on remote servers?",
      a: "No. The formatting parser executes 100% locally in your web browser session using JavaScript. None of your code or page content is transmitted.",
    },
    {
      q: "What related tool minifies HTML for production deployment?",
      a: "Use the HTML Minifier to compress HTML markup before publishing web pages to live production servers.",
    },
    {
      q: "How does the tool handle void elements (like img /, input /, 'br')?",
      a: "It recognizes self-closing void elements according to HTML5 specifications without adding redundant closing tags.",
    },
  ],
  "html-minifier": [
    {
      q: "How does the HTML Minifier reduce file size?",
      a: "It removes unnecessary whitespace, strips HTML comments, collapses multi-line text, removes redundant attribute quotes, and minifies inline CSS and JavaScript, reducing HTML payload sizes by 15% to 30%.",
    },
    {
      q: "Does minifying HTML break preformatted text ('pre', 'code') blocks?",
      a: "No. The minifier detects ''pre'', ''code'', and ''textarea'' elements and preserves their exact internal whitespace to ensure code formatting is never corrupted.",
    },
    {
      q: "Why is HTML minification important for Core Web Vitals?",
      a: "Smaller HTML payloads download faster over mobile networks, reducing Time to First Byte (TTFB) and First Contentful Paint (FCP) render times.",
    },
    {
      q: "Is my website code or template data saved on any server?",
      a: "No. All minification algorithms run client-side in your web browser using JavaScript. No source code leaves your computer.",
    },
    {
      q: "What related tools help minify stylesheets and database queries?",
      a: "Use the CSS Minifier to compress stylesheets and the SQL Minifier to compress database scripts.",
    },
    {
      q: "Should HTML comments containing copyright or licenses be preserved?",
      a: "You can toggle the 'Preserve Important Comments' option to retain legal disclaimers and build version timestamps while stripping all other comments.",
    },
  ],
  "css-minifier": [
    {
      q: "What optimizations does the CSS Minifier perform?",
      a: "It strips comments, removes unnecessary whitespace and newlines, collapses redundant margin/padding shorthand rules, shortens hex colors (e.g. #ffffff to #fff), and removes trailing semicolons.",
    },
    {
      q: "How much bandwidth savings does CSS minification typically achieve?",
      a: "Minifying CSS stylesheets typically reduces uncompressed file sizes by 20% to 40%, accelerating stylesheet download and CSSOM rendering times.",
    },
    {
      q: "Does this tool preserve CSS custom properties (variables) and media queries?",
      a: "Yes. Modern CSS variables (--primary-color), calc() functions, CSS Grid, and @media queries are fully preserved with valid syntax.",
    },
    {
      q: "Are my CSS stylesheets uploaded to external servers?",
      a: "No. All CSS minification runs 100% locally in your web browser session. Your design systems and stylesheets remain completely private.",
    },
    {
      q: "What related tool helps convert and optimize color formats in CSS?",
      a: "Use the Color Converter to convert hex colors to modern OKLCH and HSL formats with WCAG contrast verification.",
    },
    {
      q: "What is the difference between CSS minification and Gzip/Brotli compression?",
      a: "Minification removes unnecessary text characters from source code before transmission. Gzip/Brotli compresses the remaining minified byte stream at the HTTP transport layer for maximum compression.",
    },
  ],
  "sql-minifier": [
    {
      q: "What does the SQL Minifier do?",
      a: "It strips SQL block comments (/* ... */), single-line comments (-- and #), collapses multiple spaces, and compresses database queries into compact single-line strings.",
    },
    {
      q: "Why is SQL minification helpful for application codebases?",
      a: "Minifying long SQL queries allows embedding database queries cleanly inside application source code strings (PHP, Python, Node.js) and database migration files without bloated multi-line whitespace.",
    },
    {
      q: "Does minifying SQL alter string literals or database values?",
      a: "No. The parser respects quoted string literals ('...') and escaped characters, ensuring database query logic and values remain 100% unchanged.",
    },
    {
      q: "Is my SQL query or schema data stored on remote servers?",
      a: "No. All minification executes locally in your browser using JavaScript. No database structures or queries are transmitted.",
    },
    {
      q: "What related tool beautifies and formats minified SQL queries?",
      a: "Use the SQL Formatter to beautify, indent, and standardize keyword capitalization on minified SQL code.",
    },
    {
      q: "How does query minification benefit database logging?",
      a: "Single-line minified queries produce clean, single-line log entries in MySQL general query logs and application APM log streams.",
    },
  ],
  "markdown-preview": [
    {
      q: "What features does the Markdown Preview tool provide?",
      a: "It provides a split-pane interactive Markdown editor with live HTML preview, supporting GitHub Flavored Markdown (GFM): tables, task lists, code syntax highlighting, blockquotes, and strikethrough.",
    },
    {
      q: "Can I export rendered content to raw HTML or formatted text?",
      a: "Yes. You can copy the compiled HTML markup with 1-click or export your formatted document for README files, blog posts, and documentation.",
    },
    {
      q: "Does the previewer sanitize HTML tags to prevent XSS?",
      a: "Yes. The preview renderer sanitizes dangerous script tags and event handlers to ensure secure live preview rendering in your browser.",
    },
    {
      q: "Is my draft markdown content stored or uploaded anywhere?",
      a: "No. All markdown compilation runs client-side in your web browser using JavaScript. No draft text or documentation is transmitted.",
    },
    {
      q: "What related tool helps build formatted markdown tables?",
      a: "Use the Markdown Table Generator to design and format multi-column markdown tables with custom alignments.",
    },
    {
      q: "How do task checkboxes function in GitHub Flavored Markdown?",
      a: "Typing '- [ ] Task item' renders an interactive unchecked checkbox, while '- [x] Completed task' renders a checked item.",
    },
  ],
  "markdown-table-generator": [
    {
      q: "What does the Markdown Table Generator create?",
      a: "It provides an interactive spreadsheet-like grid editor to create, edit, and format GitHub Flavored Markdown tables with custom row/column counts and column alignments (left :---, center :---:, right ---:).",
    },
    {
      q: "How does column alignment work in Markdown tables?",
      a: "Colons in the separator line determine alignment: ':---' aligns text to the left, ':---:' centers text, and '---:' aligns numeric data to the right.",
    },
    {
      q: "Can I import CSV or spreadsheet data into the table generator?",
      a: "Yes. You can paste tab-delimited or comma-delimited data directly into the editor to generate formatted markdown tables instantly.",
    },
    {
      q: "Is my table data or documentation content saved on external servers?",
      a: "No. The table builder runs 100% locally in your web browser session. No data is stored or shared.",
    },
    {
      q: "What related tool allows previewing complete markdown documents?",
      a: "Use the Markdown Preview tool to preview your generated tables alongside headings, code blocks, and body paragraphs.",
    },
    {
      q: "How do pipe (|) characters inside table cell content get handled?",
      a: "Literal pipe characters inside table cells must be escaped with a backslash ('\\|') to prevent breaking markdown column boundaries.",
    },
  ],
  "uuid-bulk-generator": [
    {
      q: "What UUID versions does the UUID Bulk Generator support?",
      a: "It generates batches of UUID Version 4 (pure random entropy) and UUID Version 7 (time-ordered sequential timestamps) with customizable uppercase/lowercase, hyphens, and braces formatting.",
    },
    {
      q: "Why is UUID v7 superior for database primary keys compared to UUID v4?",
      a: "UUID v7 embeds a millisecond Unix timestamp in the leading 48 bits, ensuring sequential chronological ordering that avoids B-Tree index fragmentation and maintains fast database write performance.",
    },
    {
      q: "How many UUIDs can this tool generate in a single batch?",
      a: "You can generate anywhere from 1 to 1,000 UUIDs in a single click with instant 1-click clipboard copy or text file download.",
    },
    {
      q: "Are generated UUIDs stored in a database or logged remotely?",
      a: "No. All UUIDs are generated in local browser memory using crypto.getRandomValues. No identifiers are recorded or sent over the network.",
    },
    {
      q: "What related tool validates UUID format and extracts version metadata?",
      a: "Use the UUID Validator in the Security category to verify UUID strings and extract timestamp details.",
    },
    {
      q: "What is the probability of a UUID v4 collision?",
      a: "With 122 bits of random entropy, the odds of generating a duplicate UUID v4 are approximately 1 in 2.71 quintillion, making collisions practically impossible.",
    },
  ],
  "nanoid-generator": [
    {
      q: "What is Nano ID and what does this generator create?",
      a: "Nano ID is a compact, URL-friendly, unique string ID generator. This tool generates cryptographically secure Nano IDs with customizable length (default 21 characters) and custom alphabet character sets.",
    },
    {
      q: "What are the advantages of Nano ID over standard UUIDs?",
      a: "Nano ID is more compact (21 characters vs 36 characters in UUID), uses a larger 64-character URL-safe alphabet (A-Z, a-z, 0-9, _, -), and provides equivalent collision resistance in a smaller footprint.",
    },
    {
      q: "Can I customize the alphabet for numbers-only or lowercase identifiers?",
      a: "Yes. You can select predefined alphabets (Hexadecimal, Alphanumeric, Numbers Only, Base58) or type custom character sets for verification codes and short links.",
    },
    {
      q: "Are my generated Nano IDs sent to external servers?",
      a: "No. The generator runs 100% locally in your web browser session using Web Crypto APIs. None of your generated IDs are stored.",
    },
    {
      q: "What related tool generates standard 36-character UUID identifiers?",
      a: "Use the UUID Bulk Generator to create standard RFC 4122 UUID v4 and v7 identifiers.",
    },
    {
      q: "How long does it take for a 21-character Nano ID to experience a collision?",
      a: "Generating 1,000 IDs per second for over 4,000 years yields only a 1% probability of generating a single collision.",
    },
  ],
  "random-string-generator": [
    {
      q: "What character sets does the Random String Generator support?",
      a: "It generates high-entropy random strings across uppercase letters, lowercase letters, numbers, special symbols, hexadecimal, base64, and custom character pools with custom length and quantity controls.",
    },
    {
      q: "Why is crypto.getRandomValues critical for random string security?",
      a: "It draws entropy from the operating system's hardware randomness pool, making generated strings cryptographically unpredictable and suitable for security nonces, tokens, and test fixtures.",
    },
    {
      q: "Can I generate hundreds of random strings in bulk?",
      a: "Yes. You can generate up to 500 random strings in a single batch with custom line delimiters and 1-click clipboard export.",
    },
    {
      q: "Are my generated strings logged or stored remotely?",
      a: "No. All generation executes client-side in local browser memory. No strings or parameters leave your device.",
    },
    {
      q: "What related tools generate dedicated API keys and session tokens?",
      a: "Use the API Key Generator and Token Generator in the Security category for formatted authentication keys.",
    },
    {
      q: "What is the difference between pseudo-random and cryptographically secure random strings?",
      a: "Pseudo-random algorithms (Math.random) follow deterministic mathematical sequences that can be predicted by attackers. Cryptographically secure random generators cannot be predicted.",
    },
  ],
  "text-case-converter": [
    {
      q: "What text casing formats does this tool convert?",
      a: "It converts text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, CONSTANT_CASE, kebab-case, Dot.case, and Path/case in real time.",
    },
    {
      q: "What casing conventions are standard in programming languages?",
      a: "JavaScript and TypeScript use camelCase for variables and PascalCase for classes. Python and Rust use snake_case for functions. Global environment variables use CONSTANT_CASE, and URL slugs use kebab-case.",
    },
    {
      q: "How does the tool handle Title Case capitalization rules?",
      a: "It applies grammatical Title Case standards, capitalizing primary nouns and verbs while keeping minor prepositions and conjunctions (in, on, and, with) lowercase unless starting a sentence.",
    },
    {
      q: "Is my text uploaded or stored on any server?",
      a: "No. The case conversion algorithms execute 100% locally in your web browser session using JavaScript. Your text remains completely private.",
    },
    {
      q: "What related tool helps convert text into SEO-friendly URL slugs?",
      a: "Use the URL Slug Generator in the SEO category to transform titles into lowercase kebab-case permalinks with accent transliteration.",
    },
    {
      q: "How does the tool handle international Unicode accented characters during casing?",
      a: "It uses JavaScript 'toLocaleUpperCase()' and 'toLocaleLowerCase()' APIs to ensure proper casing across international alphabets (such as Turkish dotted/dotless I).",
    },
  ],
  "line-sorter": [
    {
      q: "What sorting modes does the Line Sorter provide?",
      a: "It sorts text lines alphabetically (A-Z, Z-A), numerically, by line length (shortest to longest), randomly (shuffle), and supports natural human sorting (e.g. item2 before item10).",
    },
    {
      q: "What is Natural Sort Order vs standard alphabetical ASCII sorting?",
      a: "ASCII sorting places 'item10' before 'item2' because character '1' precedes '2'. Natural sorting recognizes multi-digit numbers, correctly ordering 'item2' before 'item10'.",
    },
    {
      q: "Can I remove duplicate lines and trim whitespace while sorting?",
      a: "Yes. You can toggle options to deduplicate identical lines and trim leading/trailing whitespace automatically during the sort.",
    },
    {
      q: "Are my sorted text lists sent to remote servers?",
      a: "No. The sorting algorithms execute entirely client-side in your web browser. None of your text data leaves your machine.",
    },
    {
      q: "What related tool removes duplicate lines without altering line order?",
      a: "Use the Duplicate Line Remover to deduplicate text while preserving the original sequence of items.",
    },
    {
      q: "How many lines of text can this tool sort simultaneously?",
      a: "Because it runs in local browser memory using native Array.sort(), it can sort lists of over 50,000 lines in milliseconds.",
    },
  ],
  "duplicate-line-remover": [
    {
      q: "How does the Duplicate Line Remover clean text lists?",
      a: "It removes duplicate and redundant lines from lists, IP addresses, email databases, and log files while preserving original first-occurrence ordering and providing duplicate removal counts.",
    },
    {
      q: "Can I toggle case sensitivity during line deduplication?",
      a: "Yes. You can enable or disable case sensitivity, allowing 'Domain.com' and 'domain.com' to be treated as duplicates or distinct items.",
    },
    {
      q: "Does this tool strip empty blank lines automatically?",
      a: "Yes. You can enable the 'Remove Empty Lines' and 'Trim Whitespace' options to clean messy text inputs simultaneously.",
    },
    {
      q: "Is my text list or customer data stored or transmitted externally?",
      a: "No. Deduplication runs 100% locally in your browser using JavaScript Set data structures. Your data remains strictly confidential.",
    },
    {
      q: "What related tool sorts cleaned lists alphabetically or numerically?",
      a: "Use the Line Sorter to alphabetize or reorder your deduplicated text lists.",
    },
    {
      q: "What is the time complexity of the deduplication algorithm?",
      a: "Using hash-based Set lookups achieves O(n) linear time complexity, processing tens of thousands of lines instantly without browser freezing.",
    },
  ],
  "whitespace-cleaner": [
    {
      q: "What cleanup operations does the Whitespace Cleaner perform?",
      a: "It strips leading and trailing whitespace from lines, collapses multiple consecutive spaces into single spaces, removes blank empty lines, and converts tab characters into spaces.",
    },
    {
      q: "Why is whitespace cleaning important for code and data imports?",
      a: "Hidden trailing whitespace and non-breaking spaces (NBSP) can corrupt CSV imports, cause git diff noise, and break strict indentation parsers in YAML and Python.",
    },
    {
      q: "Does this tool detect invisible zero-width Unicode characters?",
      a: "Yes. It detects and purges hidden zero-width spaces (ZWSP, \\u200B) and zero-width joiners that can cause invisible parsing bugs in software code.",
    },
    {
      q: "Is my cleaned text sent to any server?",
      a: "No. All whitespace sanitization executes client-side in your web browser session using JavaScript. Your text remains completely private.",
    },
    {
      q: "What related tool helps remove duplicate lines from cleaned text?",
      a: "Use the Duplicate Line Remover and Line Sorter to organize your sanitized lists.",
    },
    {
      q: "How does converting tabs to spaces standardize code formatting?",
      a: "Converting tabs to standard 2-space or 4-space indentations ensures code displays identically across different IDEs, GitHub code views, and terminal viewers.",
    },
  ],
  "tsv-to-csv": [
    {
      q: "What does the TSV to CSV Converter do?",
      a: "It converts Tab-Separated Values (TSV) into Comma-Separated Values (CSV) and vice versa, handling quoted text fields, custom delimiters, and RFC 4180 quotation rules.",
    },
    {
      q: "How does the converter handle commas already existing inside tab-separated data?",
      a: 'When converting TSV to CSV, any text cell containing a comma is automatically wrapped in double quotation marks (e.g. "Smith, John") to preserve column structure.',
    },
    {
      q: "Can I copy data directly from Microsoft Excel or Google Sheets into this tool?",
      a: "Yes. Copying cells from Excel or Google Sheets pastes as tab-separated text (TSV), which this tool converts to standard CSV in 1 click.",
    },
    {
      q: "Are my spreadsheet datasets stored or uploaded to remote servers?",
      a: "No. The conversion executes 100% locally in your web browser session using JavaScript. No spreadsheet data leaves your machine.",
    },
    {
      q: "What related tool converts CSV and TSV spreadsheets into JSON arrays?",
      a: "Use the CSV to JSON tool to convert spreadsheet data into structured JSON objects for API endpoints.",
    },
    {
      q: "What related tool allows viewing and filtering tabular data in the browser?",
      a: "Use the CSV Viewer in the Files category to view and search spreadsheet files interactively.",
    },
  ],
  "text-diff": [
    {
      q: "How does the Text Diff tool compare two text documents?",
      a: "It uses the Myers Diff algorithm to compare Original and Modified text side-by-side or inline, highlighting additions (green), deletions (red), and modified characters with line numbers.",
    },
    {
      q: "What comparison modes are available in the diff viewer?",
      a: "You can toggle between Split View (side-by-side comparison) and Unified View (inline git-style diff), and adjust granularity between line-by-line and character-by-character diffs.",
    },
    {
      q: "Can this tool ignore whitespace or case changes during comparison?",
      a: "Yes. You can enable options to ignore leading/trailing whitespace changes, ignore blank line differences, and ignore text casing.",
    },
    {
      q: "Is my text or code sent to external servers for diffing?",
      a: "No. All diff computations execute entirely client-side in your web browser using JavaScript. Your confidential code and documents remain completely private.",
    },
    {
      q: "What related tool compares structured JSON objects specifically?",
      a: "Use the JSON Diff tool to compare JSON payloads with structural key-value highlighting rather than raw text matching.",
    },
    {
      q: "How do character-level diffs help inspect subtle code edits?",
      a: "Character diffs highlight the exact word, spelling correction, or punctuation mark changed within a line without forcing you to re-read the entire sentence.",
    },
  ],
  "json-diff": [
    {
      q: "What does the JSON Diff tool compare between two JSON objects?",
      a: "It parses two JSON payloads, normalizes key ordering, and highlights structural additions, deletions, modified values, and type changes with tree-view visual indicators.",
    },
    {
      q: "How does JSON Diff differ from standard text diff tools?",
      a: "Standard text diffs flag differences when JSON keys are simply reordered. JSON Diff understands JSON semantics, ignoring key ordering differences and focusing strictly on true data changes.",
    },
    {
      q: "How does the tool highlight data type changes (e.g. string to number)?",
      a: "If a value changes from string '100' to number 100 or boolean true, the tool explicitly flags the data type alteration alongside the value change.",
    },
    {
      q: "Are my JSON datasets or API response payloads uploaded anywhere?",
      a: "No. All JSON parsing and semantic comparisons execute 100% locally in your web browser session using JavaScript. No data is stored or transmitted.",
    },
    {
      q: "What related tool formats and validates single JSON payloads?",
      a: "Use the JSON Formatter to beautify and validate JSON payloads before running comparisons.",
    },
    {
      q: "Can this tool compare deeply nested arrays and object graphs?",
      a: "Yes. The recursive diff engine traverses multi-level nested objects and arrays, displaying exact object path pointers (e.g. 'users[2].address.zip').",
    },
  ],
}
