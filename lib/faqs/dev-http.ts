import type { Faq } from "@/lib/tool-faqs"

export const dev_httpFaqs: Record<string, Faq[]> = {
  "html-formatter": [
    {
      q: "Does the formatter change how my page looks?",
      a: "It only changes whitespace between tags. Script, style, pre and textarea contents are left exactly as written, since changing them could break code or text.",
    },
    {
      q: "Why are some short elements kept on one line?",
      a: "A tag that holds only a short piece of text, such as a list item or heading, is kept on one line with its text so the output stays compact and readable.",
    },
    {
      q: "Is my HTML uploaded?",
      a: "No. The tags are processed by code in your browser, so private templates stay on your device.",
    },
  ],
  "html-minifier": [
    {
      q: "What does the HTML minifier remove?",
      a: "HTML comments, line breaks and repeated spaces between tags. Conditional comments for old Internet Explorer are kept because they change behaviour.",
    },
    {
      q: "Is it safe for text inside pre tags?",
      a: "Yes. Content of pre, textarea, script and style is passed through untouched, so formatted text and code still work.",
    },
    {
      q: "How much will it save?",
      a: "Hand written pages usually shrink by 10 to 30 percent before compression. Savings are smaller if your server already sends gzip or brotli.",
    },
  ],
  "css-minifier": [
    {
      q: "What does CSS minification change?",
      a: "It removes comments and unneeded spaces and line breaks, and drops the final semicolon in each rule. The styles behave the same.",
    },
    {
      q: "Are important comments kept?",
      a: "Comments that start with /*! are kept, which is the usual way to mark a licence notice that must stay in the file.",
    },
    {
      q: "Does it rewrite colours or merge rules?",
      a: "No. It only cleans whitespace, so the result is easy to trust. Tools that shorten values or merge rules can save more but need testing.",
    },
  ],
  "sql-minifier": [
    {
      q: "When would I minify SQL?",
      a: "To embed a query in code or a log line on one line, to compare two queries without formatting noise, or to shrink a long script before sending it.",
    },
    {
      q: "Are string values changed?",
      a: "No. Anything inside single quotes, double quotes or backticks is copied exactly, including the spaces.",
    },
    {
      q: "Does it change what the query does?",
      a: "It should not. Only comments and runs of whitespace are removed. Keep comments out of the input if they contain query hints your database reads.",
    },
  ],
  "markdown-preview": [
    {
      q: "Which Markdown features are supported?",
      a: "Headings, bold, italic, strikethrough, inline code, fenced code blocks, links, bullet and numbered lists, quotes, rules and pipe tables.",
    },
    {
      q: "Is it safe to paste untrusted Markdown?",
      a: "Yes. The text is turned into page elements by code, not into raw HTML, so scripts cannot run. Only http, https and mailto links are active, and images are not loaded.",
    },
    {
      q: "Why are images not shown?",
      a: "Loading a remote image would contact its server from your browser. The preview shows the alt text instead so it stays fully private.",
    },
  ],
  "markdown-table-generator": [
    {
      q: "How do I get my spreadsheet into Markdown?",
      a: "Copy the cells in your spreadsheet, paste them in and choose Tab as the separator. Each row becomes a table row.",
    },
    {
      q: "How do I align columns?",
      a: "Enter left, center or right for each column, separated by commas. If you list fewer than there are columns, the last choice is used for the rest.",
    },
    {
      q: "What happens to a pipe character in a cell?",
      a: "It is escaped with a backslash, because a bare pipe would split the cell in Markdown.",
    },
  ],
  "uuid-bulk-generator": [
    {
      q: "What is the difference between UUID v4 and v7?",
      a: "v4 is entirely random. v7 starts with a millisecond timestamp, so values sort by creation time, which keeps database indexes efficient.",
    },
    {
      q: "Are these UUIDs safe to use as identifiers?",
      a: "They are produced with your browser's secure random number generator, so collisions are astronomically unlikely. Do not use a UUID alone as a secret.",
    },
    {
      q: "Can I get them without hyphens?",
      a: "Yes. Untick hyphens for 32 character strings, and use the uppercase and braces options for formats used by some Windows tools.",
    },
  ],
  "nanoid-generator": [
    {
      q: "How is a NanoID different from a UUID?",
      a: "It uses a larger alphabet, so a shorter string holds the same randomness. The default 21 characters give about 126 bits, similar to a UUID.",
    },
    {
      q: "How long should my IDs be?",
      a: "Pick a length by the bits shown. Around 64 bits is plenty for short links in a small system, and 120 or more is safe for large systems.",
    },
    {
      q: "Is the generator unbiased?",
      a: "Yes. Each character is chosen with rejection sampling from secure random numbers, so no symbol is more likely than another.",
    },
  ],
  "random-string-generator": [
    {
      q: "Is this secure enough for passwords or tokens?",
      a: "It uses the browser's cryptographic random generator and picks characters without bias, which is suitable for tokens and passwords. Nothing is sent or stored.",
    },
    {
      q: "Why remove look-alike characters?",
      a: "0, O, 1, l, I and | are easy to confuse when read aloud or typed from print. Dropping them avoids support problems with codes people must type.",
    },
    {
      q: "What do the bits mean?",
      a: "They measure how hard the string is to guess. Each character adds log2 of the character count, so a 24 character string from 62 characters has about 143 bits.",
    },
  ],
  "user-agent-generator": [
    {
      q: "What is a user agent string?",
      a: "A line of text a browser or bot sends with each request to say what it is. Sites and logs use it to tell browsers, devices and crawlers apart.",
    },
    {
      q: "Why do all browsers say Mozilla?",
      a: "For historical reasons. Early sites served better pages to Netscape, so every browser began claiming to be Mozilla compatible, and the habit stuck.",
    },
    {
      q: "Can I use these to test my site?",
      a: "Yes, for testing your own site. Do not use a crawler's string to impersonate it elsewhere: sites that verify bots by IP will block you, and it may breach their terms.",
    },
  ],
  "http-status-reference": [
    {
      q: "What do the five classes of status code mean?",
      a: "1xx are informational, 2xx success, 3xx redirection, 4xx client errors and 5xx server errors. Search 4xx to list a whole class.",
    },
    {
      q: "What is the difference between 401 and 403?",
      a: "401 means the request lacks valid authentication. 403 means the server knows who you are and still refuses. Many sites use 403 for both.",
    },
    {
      q: "When should a site return 503?",
      a: "When it is temporarily unable to answer, such as during maintenance. Add a Retry-After header so crawlers and clients come back later instead of treating it as gone.",
    },
  ],
  "http-status-generator": [
    {
      q: "What does this generator output?",
      a: "An example response with the status line and the headers that usually go with it, plus one line of code for nginx, Apache, PHP and Express.",
    },
    {
      q: "Why does a redirect need a Location?",
      a: "The Location header tells the client where to go next. The tool checks that it is a full URL or a path, and rejects characters that could break a server configuration.",
    },
    {
      q: "Does it start a real server?",
      a: "No. It only writes text for you to copy, so nothing is sent anywhere.",
    },
  ],
  "mime-type-lookup": [
    {
      q: "What does a MIME type tell the browser?",
      a: "A label such as image/webp that tells a browser what kind of file a response contains, so it knows whether to display, run or download it.",
    },
    {
      q: "Is it text/javascript or application/javascript?",
      a: "text/javascript is the standard for JavaScript, set by RFC 9239. application/javascript still appears in older configurations and works.",
    },
    {
      q: "What if my extension is missing?",
      a: "Serve application/octet-stream for unknown binary data. Browsers will then offer a download instead of trying to guess how to show it.",
    },
  ],
  "mime-type-checker": [
    {
      q: "Why does a wrong MIME type matter?",
      a: "Browsers may refuse to run scripts or apply styles served with the wrong type, and with X-Content-Type-Options nosniff they block them outright.",
    },
    {
      q: "How do I see what my server sends?",
      a: "Open your browser's developer tools, choose the network tab and click the file. The Content-Type is shown under the response headers.",
    },
    {
      q: "Does the checker look at the file contents?",
      a: "No. It compares the file name with the claimed type, which catches the usual server misconfigurations.",
    },
  ],
  "content-type-builder": [
    {
      q: "Do I need a charset on every type?",
      a: "Only text types need it. HTML and plain text should state utf-8. JSON is always UTF-8, and binary types such as images ignore the parameter.",
    },
    {
      q: "What is a multipart boundary?",
      a: "A string that separates the parts of a multipart body, such as a file upload. It must be 1 to 70 characters and must not appear in the data.",
    },
    {
      q: "Which type do forms use?",
      a: "application/x-www-form-urlencoded for ordinary forms and multipart/form-data when the form uploads files.",
    },
  ],
  "cache-control-generator": [
    {
      q: "What is a good Cache-Control for static assets?",
      a: "public, max-age=31536000, immutable for files whose names change when their content changes, such as app.3f2a1.js. Browsers then never re-download them.",
    },
    {
      q: "What is the difference between no-cache and no-store?",
      a: "no-cache lets the browser keep a copy but requires checking with the server before using it. no-store forbids keeping any copy at all.",
    },
    {
      q: "What does s-maxage do?",
      a: "It sets a separate lifetime for shared caches such as a CDN, while max-age applies to browsers.",
    },
  ],
  "cors-header-generator": [
    {
      q: "What is CORS?",
      a: "A browser rule that stops a page on one site reading responses from another unless that other site opts in with Access-Control headers.",
    },
    {
      q: "Why can I not use * with credentials?",
      a: "Browsers refuse it. If a request carries cookies, the server must name the exact origin that is allowed, so the tool shows an error for that combination.",
    },
    {
      q: "What is a preflight request?",
      a: "A request using the OPTIONS method that the browser sends first to ask what is allowed. Your server must answer it with the allow headers and a 204.",
    },
  ],
  "csp-generator": [
    {
      q: "What does a Content Security Policy do?",
      a: "It tells the browser which sources of scripts, styles, images and frames are allowed, which limits the damage if an attacker injects content into a page.",
    },
    {
      q: "Why start in report-only mode?",
      a: "A strict policy can break a site. Report-only logs what would have been blocked without blocking it, so you can fix the policy before enforcing it.",
    },
    {
      q: "Why is unsafe-inline flagged?",
      a: "It allows any inline script, including injected ones, which removes most of the benefit. Use nonces or hashes for the scripts you actually need.",
    },
  ],
  "hsts-header-generator": [
    {
      q: "What does HSTS do?",
      a: "It tells browsers to use HTTPS only for your site for a set time, which blocks downgrade attacks and removes the insecure first request.",
    },
    {
      q: "What are the rules for preload?",
      a: "max-age must be at least a year, includeSubDomains must be on and the preload token must be present. The tool checks all three.",
    },
    {
      q: "Can HSTS be undone?",
      a: "By sending max-age=0 over HTTPS, but browsers keep the old setting until they next visit, and preloaded domains take months to remove. Test with a short max-age first.",
    },
  ],
  "security-header-generator": [
    {
      q: "Which security headers should every site send?",
      a: "X-Content-Type-Options nosniff, a frame policy, a Referrer-Policy, and HSTS on HTTPS sites. A Content-Security-Policy adds the most protection and takes the most care.",
    },
    {
      q: "Will these headers break my site?",
      a: "The defaults are conservative. Check embeds: a SAMEORIGIN frame policy stops other sites from framing yours, and a restrictive Permissions-Policy turns off features you may use.",
    },
    {
      q: "Where do I add the output?",
      a: "In your server block for nginx, in .htaccess or the virtual host for Apache, or at the top of your PHP entry file.",
    },
  ],
}
