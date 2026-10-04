import type { Faq } from "@/lib/tool-faqs"

export const emailFaqs: Record<string, Faq[]> = {
  "email-subject-line-analyzer": [
    {
      q: "What factors does the Email Subject Line Analyzer evaluate?",
      a: "It evaluates subject line character length, word count, spam trigger word detection, urgency phrasing, emoji usage, sentiment polarity, and mobile inbox preview boundaries to predict open rates.",
    },
    {
      q: "What is the optimal character length for email subject lines?",
      a: "Keeping subject lines between 30 and 50 characters (4 to 7 words) ensures the entire headline displays cleanly on mobile email clients (iPhone Mail, Gmail) without being cut off by screen margins.",
    },
    {
      q: "How do spam trigger words harm email deliverability?",
      a: "Spam filters (SpamAssassin, Barracuda) assign negative penalty points to aggressive sales keywords (e.g. '100% FREE', 'ACT NOW', 'URGENT', 'CASH BONUS'), increasing the risk of messages landing in the spam folder.",
    },
    {
      q: "Are my email subject lines or newsletter copy stored on remote servers?",
      a: "No. The analysis algorithms execute 100% locally in your web browser session using JavaScript. No subject lines or marketing copy leave your machine.",
    },
    {
      q: "What related tool helps calculate total email payload size including HTML and images?",
      a: "Use the Email Size Calculator to ensure your entire email template stays under Gmail's 102 KB clipping threshold.",
    },
    {
      q: "Why is preheader text important alongside subject lines?",
      a: "Preheader snippet text (the first 50-100 characters of email body copy) appears immediately after the subject line in mobile inboxes, providing a second opportunity to drive opens.",
    },
  ],
  "email-address-validator": [
    {
      q: "What checks does the Email Address Validator perform?",
      a: "It validates syntax against RFC 5322 standards, checks for valid domain TLD formatting, detects disposable/temporary email provider domains, and checks for valid MX mail server records.",
    },
    {
      q: "Why is syntax validation alone insufficient for email verification?",
      a: "An email address may be syntactically valid (e.g. user@nonexistent123domain.com) but completely undeliverable if the destination domain has no active DNS MX records to receive messages.",
    },
    {
      q: "Does this tool send test emails or ping SMTP mailboxes?",
      a: "No. The tool verifies RFC syntax locally and queries public DNS records without sending test emails, ensuring no emails or spam reports are triggered.",
    },
    {
      q: "Are my validated email addresses stored or added to contact lists?",
      a: "No. All validation runs in real time for diagnostic evaluation only. We never log, store, or sell any email addresses checked on our platform.",
    },
    {
      q: "What related tool cleans and standardizes email addresses?",
      a: "Use the Email Address Normalizer to trim whitespace, lowercase domains, and strip Gmail plus-tags and dot aliases.",
    },
    {
      q: "What are disposable email addresses and why should web hosts block them?",
      a: "Disposable email services (e.g. Mailinator, TempMail) provide temporary 10-minute inboxes frequently used by fraudsters to bypass signup verifications and launch abusive trials.",
    },
  ],
  "email-address-normalizer": [
    {
      q: "How does the Email Address Normalizer standardize email addresses?",
      a: "It converts domain names to lowercase, removes leading/trailing whitespace, strips optional Gmail plus addressing tags (e.g. 'user+news@gmail.com' to 'user@gmail.com'), and removes dots from Gmail usernames.",
    },
    {
      q: "Why is email normalization critical for user account deduplication?",
      a: "Gmail treats 'john.doe@gmail.com' and 'johndoe+promo@gmail.com' as identical mailboxes. Normalizing emails prevents users from creating multiple fraudulent accounts or exploiting trial promotions.",
    },
    {
      q: "Does normalization alter internationalized domain names (IDNs)?",
      a: "The tool converts internationalized Unicode domain names into ASCII Punycode representations (e.g. 'user@m\u00fcnchen.de' to 'user@xn--mnchen-3ya.de') for universal mail protocol compatibility.",
    },
    {
      q: "Are my normalized email lists shared or uploaded to a database?",
      a: "No. The normalization algorithms run 100% client-side in your web browser. No email addresses or user records leave your device.",
    },
    {
      q: "What related tool extracts domain names from email lists?",
      a: "Use the Email Domain Extractor to isolate and aggregate domain names from bulk email contact lists.",
    },
    {
      q: "What is the difference between case sensitivity in email local-parts vs domains?",
      a: "RFC 5321 specifies that the domain part is strictly case-insensitive, while the local-part (username) can theoretically be case-sensitive, though virtually all modern mail servers treat the entire address as case-insensitive.",
    },
  ],
  "email-domain-extractor": [
    {
      q: "What does the Email Domain Extractor do?",
      a: "It parses bulk email lists or raw text, extracts all unique domain names (e.g. gmail.com, company.com), and outputs sorted lists with frequency counts and CSV export options.",
    },
    {
      q: "How does domain extraction help analyze email subscriber databases?",
      a: "Extracting domains reveals ESP distribution across your audience (e.g. 60% Gmail, 25% Outlook, 15% corporate domains), helping marketing teams optimize authentication and deliverability for top providers.",
    },
    {
      q: "Can this tool handle messy text containing mixed formatting and text blocks?",
      a: "Yes. The regex extractor scans unstructured text, extracts all valid email domains, and deduplicates them into a clean, formatted list.",
    },
    {
      q: "Is my customer email list stored or transmitted over the internet?",
      a: "No. All parsing and extraction execute locally within your browser session using JavaScript. No email addresses or domain lists are uploaded.",
    },
    {
      q: "What related tool validates MX records for extracted domain lists?",
      a: "Use the MX Lookup tool in the Domains category to inspect mail exchange servers and verify mail routing for any extracted domain.",
    },
    {
      q: "How can I filter out free consumer webmail domains from B2B lead lists?",
      a: "The tool highlights common consumer webmail providers (gmail.com, yahoo.com, hotmail.com, outlook.com) so you can separate corporate business domains from free webmail accounts.",
    },
  ],
  "email-username-generator": [
    {
      q: "What formats does the Email Username Generator produce?",
      a: "It converts first and last names into standard corporate email username formats: first.last, flast, firstl, f.last, first_last, first-last, and numeric variants for business team onboarding.",
    },
    {
      q: "What is the most widely adopted corporate email naming convention?",
      a: "'first.last@company.com' (e.g. john.doe@company.com) and 'flast@company.com' (e.g. jdoe@company.com) are the two most standard corporate email structures in enterprise environments.",
    },
    {
      q: "How does the tool handle middle names and international characters?",
      a: "It transliterates accented characters (e.g. '\u00e9' to 'e', '\u00f1' to 'n') and allows incorporating middle initials to resolve naming conflicts in large organizations.",
    },
    {
      q: "Are my employee names or generated email formats recorded remotely?",
      a: "No. The name permutation algorithms run 100% locally in your web browser. No employee names or company usernames leave your machine.",
    },
    {
      q: "What related tool helps build professional email signatures for new accounts?",
      a: "Use the HTML Email Signature Generator to create branded, responsive email signatures with logos and social links.",
    },
    {
      q: "How should organizations handle username collisions for employees with identical names?",
      a: "Incorporate middle initials (e.g. 'john.m.doe@') or assign departmental prefixes to maintain clear identity separation.",
    },
  ],
  "email-signature-generator": [
    {
      q: "What does the Email Signature Generator create?",
      a: "It generates clean plain-text and rich-text email signatures formatted with employee name, job title, company, phone numbers, website URL, physical office address, and social profile links.",
    },
    {
      q: "Why are standardized email signatures important for business branding?",
      a: "Consistent email signatures reinforce brand credibility, ensure corporate legal disclaimer compliance, and provide recipients with verified direct contact channels in every email sent.",
    },
    {
      q: "Can I copy the generated signature directly into Gmail, Outlook, or Apple Mail?",
      a: "Yes. The tool provides a 1-click 'Copy Signature' button that copies formatted rich text with active hyperlinks directly to your clipboard for instant pasting into any email client settings.",
    },
    {
      q: "Is my contact information or corporate logo stored on external servers?",
      a: "No. All signature rendering occurs locally within your browser session. None of your personal details, phone numbers, or company info are transmitted.",
    },
    {
      q: "What related tool generates raw HTML code for custom email signature templates?",
      a: "Use the HTML Email Signature Generator to export table-based HTML code with inline CSS styling for web development deployments.",
    },
    {
      q: "How do legal email disclaimers protect enterprise organizations?",
      a: "Confidentiality notices clarify that messages are intended solely for the named recipient and provide liability protection regarding inadvertent data disclosure.",
    },
  ],
  "html-email-signature-generator": [
    {
      q: "What code standards does the HTML Email Signature Generator output?",
      a: "It generates cross-client compatible HTML signatures built using nested HTML tables, inline CSS styles, explicit font fallbacks, absolute image URLs, and mobile-responsive viewport scaling.",
    },
    {
      q: "Why is table-based HTML required for email signatures instead of modern CSS grid/flexbox?",
      a: "Legacy desktop email clients (specifically Microsoft Outlook for Windows, which uses the Microsoft Word rendering engine) do not support CSS Flexbox, Grid, or external stylesheets.",
    },
    {
      q: "Where should images and company logos in email signatures be hosted?",
      a: "Images must be hosted on a fast public HTTPS web server or CDN with absolute URLs (e.g. 'img src=\"https://yourdomain.com/logo.png\"') so they load reliably across all recipient email clients.",
    },
    {
      q: "Is my HTML signature template saved in an external database?",
      a: "No. The HTML compiler executes 100% locally in your web browser using JavaScript. No template data or company assets are stored.",
    },
    {
      q: "How do I install the generated HTML signature in cPanel Webmail (Roundcube)?",
      a: "In Roundcube Webmail, navigate to Settings  Identities  select your identity, check 'HTML signature', paste your raw HTML code into the source code modal, and click Save.",
    },
    {
      q: "What related tool calculates email MIME size overhead from HTML signatures?",
      a: "Use the Email Size Calculator to measure the byte footprint added by your HTML signature markup.",
    },
  ],
  "email-header-date-converter": [
    {
      q: "What date formats does the Email Header Date Converter translate?",
      a: "It parses RFC 2822 / RFC 5322 email header date strings (e.g. 'Date: Wed, 04 Oct 2026 14:30:00 +0000') and converts them into ISO 8601, UTC timestamps, Unix epoch seconds, and your local timezone format.",
    },
    {
      q: "Why is email header date inspection important in forensic investigations?",
      a: "Comparing the client-originated 'Date:' header against intermediate 'Received:' hop timestamps reveals message transit delays, spoofed originating timestamps, and timezone discrepancies.",
    },
    {
      q: "How do timezone offset indicators (+0000, -0500) function in email headers?",
      a: "The offset indicates the sender's local time difference relative to Coordinated Universal Time (UTC). Converting all hops to UTC normalizes the timeline across international mail relays.",
    },
    {
      q: "Are my pasted email headers or date strings logged externally?",
      a: "No. Date parsing executes entirely client-side in your web browser. No header data or email content leaves your device.",
    },
    {
      q: "What related tool helps convert standard Unix timestamps across timezones?",
      a: "Use the Timestamp Converter in the DevTools category to convert raw integer epoch timestamps into human-readable calendar dates.",
    },
    {
      q: "What causes the 'Date' header to differ from the top 'Received' header?",
      a: "The 'Date' header is generated by the sender's email client clock, which may be misconfigured. The top 'Received' header is stamped by your receiving mail server's synchronized clock.",
    },
  ],
  "email-attachment-size-calculator": [
    {
      q: "How does the Email Attachment Size Calculator determine Base64 overhead?",
      a: "Email protocols (MIME) encode binary attachments into 7-bit ASCII text using Base64 encoding. Base64 encoding expands raw file sizes by approximately 33% to 37% (4 bytes of text for every 3 bytes of binary data plus line wrap overhead).",
    },
    {
      q: "Why did my 20 MB attachment bounce on a mail server with a 25 MB limit?",
      a: "A 20 MB raw binary file expands to ~27 MB once Base64-encoded into MIME format, exceeding the server's 25 MB maximum message size ceiling and causing an SMTP bounce.",
    },
    {
      q: "What is the standard maximum email attachment limit across major providers?",
      a: "Gmail, Microsoft 365, and Yahoo enforce a 25 MB total encoded message limit, meaning raw uncompressed attachments should not exceed 18 MB to ensure successful delivery.",
    },
    {
      q: "Are my attachment files uploaded or analyzed on remote servers?",
      a: "No. The calculation runs 100% locally in your browser using mathematical encoding formulas. No files or filenames are uploaded.",
    },
    {
      q: "What related tool calculates total email size including HTML and headers?",
      a: "Use the Email Size Calculator to model complete message size footprints across text, HTML, embedded images, and attachments.",
    },
    {
      q: "What is the best way to send files larger than 25 MB to clients?",
      a: "Upload large files to cloud storage (Google Drive, Dropbox, Nextcloud) and include a secure direct download link in the email body rather than attaching binary files.",
    },
  ],
  "email-size-calculator": [
    {
      q: "What components does the Email Size Calculator measure in a message?",
      a: "It sums plain-text body copy, HTML template markup, inline CSS stylesheets, embedded CID images, header metadata, and Base64-encoded attachment payloads to calculate the total MIME message size.",
    },
    {
      q: "What is the Gmail 102 KB HTML clipping limit?",
      a: "If an email's raw HTML source code exceeds 102 KB (excluding external hosted images), Gmail automatically truncates the message and displays a '[Message clipped] View entire message' link, breaking tracking pixels and footer unsubscribe links.",
    },
    {
      q: "How can I reduce email template HTML size below 102 KB?",
      a: "Minify HTML and CSS, remove redundant inline style declarations, host images externally rather than embedding raw Base64 strings, and keep marketing copy concise.",
    },
    {
      q: "Is my email template HTML or marketing copy transmitted to any server?",
      a: "No. All size calculations execute locally in your web browser session using JavaScript. Your email templates remain completely private.",
    },
    {
      q: "What related tool calculates Base64 attachment inflation?",
      a: "Use the Email Attachment Size Calculator to calculate exact encoded sizes for binary file attachments.",
    },
    {
      q: "How does email size impact deliverability and spam filtering?",
      a: "Excessively heavy emails (over 500 KB without attachments) take longer to download on mobile networks and can trigger spam filter scrutiny due to bloated code-to-text ratios.",
    },
  ],
  "smtp-port-reference": [
    {
      q: "What standard ports are documented in the SMTP Port Reference?",
      a: "It details standard email transmission and retrieval ports: SMTP Port 25 (server-to-server relay), Port 587 (authenticated client submission / STARTTLS), Port 465 (implicit SMTPS SSL/TLS), Port 993 (IMAPS), and Port 995 (POP3S).",
    },
    {
      q: "Why is Port 587 recommended for sending outbound email from client apps?",
      a: "RFC 6409 designates Port 587 for authenticated client email submission with opportunistic STARTTLS encryption. Unlike Port 25, Port 587 is rarely blocked by residential ISPs.",
    },
    {
      q: "Why do residential and cloud VPS providers block outbound TCP Port 25 by default?",
      a: "ISPs and cloud VPS providers block Port 25 to prevent compromised virtual machines and botnets from dispatching massive spam floods directly to external mail servers.",
    },
    {
      q: "Does this reference tool track my network connection or port scans?",
      a: "No. This is a static technical reference guide that runs locally in your browser without scanning your local network or sending telemetry.",
    },
    {
      q: "What is the difference between Port 465 (SMTPS) and Port 587 (STARTTLS)?",
      a: "Port 465 requires immediate TLS negotiation upon initial TCP connection (implicit SSL). Port 587 starts as plain text and upgrades to encrypted TLS via the 'STARTTLS' SMTP command.",
    },
    {
      q: "What related tool checks MIME media types for email attachments?",
      a: "Use the Email MIME Type Reference to look up standard MIME headers for email attachment handling.",
    },
  ],
  "email-mime-type-reference": [
    {
      q: "What information does the Email MIME Type Reference provide?",
      a: "It catalogs standard Multipurpose Internet Mail Extensions (MIME) Content-Type headers for email bodies (text/plain, text/html, multipart/alternative, multipart/mixed, multipart/related) and common attachment file formats.",
    },
    {
      q: "What is the difference between multipart/alternative and multipart/mixed in email?",
      a: "'multipart/alternative' contains both plain-text and HTML versions of the same message (the client displays the best supported version). 'multipart/mixed' is used when attaching independent files to a message.",
    },
    {
      q: "What MIME structure is required for inline embedded images (CID attachments)?",
      a: "Inline embedded images require 'multipart/related' with a 'Content-ID: 'image123'' header on the image part, referenced in HTML as 'img src=\"cid:image123\"'.",
    },
    {
      q: "Is my MIME lookup logged or shared with external servers?",
      a: "No. The technical reference database is loaded locally in your web browser. No search queries are recorded.",
    },
    {
      q: "What related tool checks MIME types for web server HTTP headers?",
      a: "Use the MIME Type Lookup tool in the HTTP category to inspect Content-Type headers for web files and API responses.",
    },
    {
      q: "Why do security gateways block attachments with 'application/x-dosexec' MIME types?",
      a: "'application/x-dosexec' corresponds to executable binary files (.exe, .scr, .dll) which are primary vectors for malware and ransomware payloads.",
    },
  ],
}
