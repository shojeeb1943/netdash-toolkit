import type { Faq } from "@/lib/tool-faqs"

export const security_toolsFaqs: Record<string, Faq[]> = {
  "passphrase-generator": [
    {
      q: "Why are passphrases good?",
      a: "A few random words are easy to remember and hard to guess. Six random words from this list give about 48 bits, and each extra word adds 8 more.",
    },
    {
      q: "How many words do I need?",
      a: "Use at least six for ordinary accounts and eight or more for a password manager or disk encryption. The result tells you the bits so you can judge.",
    },
    {
      q: "Is the word list large?",
      a: "It has 256 short words, which keeps the maths simple: every word is worth exactly 8 bits. Larger lists give more bits per word, so add a word or two to compensate.",
    },
  ],
  "api-key-generator": [
    {
      q: "Why add a prefix to an API key?",
      a: "A prefix such as sk_live or pk_test shows what a key is for, and lets secret scanners spot leaked keys in code and logs.",
    },
    {
      q: "How long should an API key be?",
      a: "At least 32 random characters from letters and numbers gives about 190 bits, far more than can be guessed. Longer keys cost nothing.",
    },
    {
      q: "How should I store API keys?",
      a: "Store only a hash of each key in your database and show the real key to its owner once, as you would a password.",
    },
  ],
  "secret-generator": [
    {
      q: "How many bytes should a secret be?",
      a: "32 bytes (256 bits) is the common choice for session secrets, signing keys and encryption keys. Use 16 bytes only for short lived values.",
    },
    {
      q: "Which encoding should I pick?",
      a: "Hex is simple and safe in any file. Base64 is shorter for the same strength. Base64 URL safe avoids plus and slash characters in URLs and cookies.",
    },
    {
      q: "Is it safe to generate secrets in a browser?",
      a: "The values come from your browser's cryptographic random number generator and are not sent anywhere. For production keys many teams prefer to generate them on the server that will use them.",
    },
  ],
  "token-generator": [
    {
      q: "What are random tokens used for?",
      a: "Password reset links, invitation codes, email confirmation and session identifiers. They must be unpredictable, so they come from secure randomness.",
    },
    {
      q: "What does grouping do?",
      a: "It inserts a hyphen every few characters so a code that a person must read or type, such as XXXX-XXXX-XXXX, is easier to handle.",
    },
    {
      q: "How long should a reset token be?",
      a: "At least 32 characters of letters and numbers. Give it a short life, such as an hour, and make it single use.",
    },
  ],
  "hmac-generator": [
    {
      q: "What is an HMAC?",
      a: "A signature made from a message and a secret key. Only someone with the key can produce or check it, so it proves the message is genuine and unchanged.",
    },
    {
      q: "Where are HMACs used?",
      a: "Webhook signatures from payment and code hosting services, signed cookies and URLs, and API request signing.",
    },
    {
      q: "How is it different from a plain hash?",
      a: "A hash can be computed by anyone. An HMAC needs the secret key, so an attacker cannot forge it by hashing a changed message.",
    },
  ],
  "jwt-generator": [
    {
      q: "What is in a JWT?",
      a: "Three parts joined by dots: a header naming the algorithm, a payload of claims and a signature. The first two are only encoded, not encrypted.",
    },
    {
      q: "Is this safe to use with a real secret?",
      a: "The secret is used only in your browser and never sent, but it is best to test with a throwaway secret. Never paste a production signing key into any website.",
    },
    {
      q: "What are exp and iat?",
      a: "exp is when the token expires and iat when it was issued, both in seconds since 1970. The tool can add them for you.",
    },
  ],
  "jwt-expiry-calculator": [
    {
      q: "Does this verify the token?",
      a: "No. It reads the time claims only. A forged token can have a valid looking expiry, so the signature must be checked by your server with the key.",
    },
    {
      q: "Is my token uploaded?",
      a: "No. It is decoded in your browser. Even so, avoid pasting live production tokens: treat them like passwords.",
    },
    {
      q: "What does no expiry set mean?",
      a: "The token has no exp claim and never expires, so if it leaks it works forever. Add a short expiry to tokens you issue.",
    },
  ],
  "uuid-validator": [
    {
      q: "What makes a UUID valid?",
      a: "Thirty-two hexadecimal digits, normally written 8-4-4-4-12. The tool also accepts braces and values without hyphens.",
    },
    {
      q: "How do I know a UUID's version?",
      a: "The first digit of the third group is the version. A 4 means random, a 7 means time ordered, and 1 means time and MAC address based.",
    },
    {
      q: "What are nil and max UUIDs?",
      a: "The nil UUID is all zeros and the max UUID is all f digits. Both are valid special values that are normally used as placeholders.",
    },
  ],
  "csp-hash-generator": [
    {
      q: "When do I need a CSP hash?",
      a: "When a page has an inline script or style you cannot move to a file. The hash allows that exact content without allowing every inline script.",
    },
    {
      q: "What exactly gets hashed?",
      a: "Every character between the opening and closing tags, including spaces and line breaks. Copy it precisely or the browser will block the block.",
    },
    {
      q: "Should I use a hash or a nonce?",
      a: "Hashes suit static content that never changes. A nonce, a fresh random value for each response, suits pages where the content varies.",
    },
  ],
}
