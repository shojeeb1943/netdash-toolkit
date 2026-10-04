// static reference data for the HTTP and MIME tools. nothing here is fetched.

export interface StatusInfo {
  code: number
  name: string
  meaning: string
}

export const HTTP_STATUS: StatusInfo[] = [
  {
    code: 100,
    name: "Continue",
    meaning: "The server received the request headers and the client should send the body.",
  },
  {
    code: 101,
    name: "Switching Protocols",
    meaning: "The server is switching to the protocol the client asked for, such as WebSocket.",
  },
  {
    code: 103,
    name: "Early Hints",
    meaning:
      "Preliminary headers, usually Link, so the browser can begin fetching resources early.",
  },
  { code: 200, name: "OK", meaning: "The request succeeded and the response carries the result." },
  {
    code: 201,
    name: "Created",
    meaning: "A new resource was created; the Location header usually names it.",
  },
  {
    code: 202,
    name: "Accepted",
    meaning: "The request was accepted for processing but is not finished yet.",
  },
  { code: 204, name: "No Content", meaning: "Success with no body, common for deletes and saves." },
  {
    code: 206,
    name: "Partial Content",
    meaning: "Only the byte range that was requested is returned.",
  },
  {
    code: 301,
    name: "Moved Permanently",
    meaning: "The resource has a new permanent address; search engines transfer ranking to it.",
  },
  {
    code: 302,
    name: "Found",
    meaning: "A temporary redirect; the original address is still the one to use later.",
  },
  {
    code: 303,
    name: "See Other",
    meaning: "Fetch the result at another address with GET, often after a form post.",
  },
  {
    code: 304,
    name: "Not Modified",
    meaning: "The cached copy is still valid, so no body is sent.",
  },
  {
    code: 307,
    name: "Temporary Redirect",
    meaning: "A temporary redirect that keeps the request method.",
  },
  {
    code: 308,
    name: "Permanent Redirect",
    meaning: "A permanent redirect that keeps the request method.",
  },
  {
    code: 400,
    name: "Bad Request",
    meaning: "The server cannot process the request because it is malformed.",
  },
  { code: 401, name: "Unauthorized", meaning: "Authentication is required or has failed." },
  {
    code: 403,
    name: "Forbidden",
    meaning: "The server understood the request but refuses to allow it.",
  },
  { code: 404, name: "Not Found", meaning: "Nothing exists at this address." },
  {
    code: 405,
    name: "Method Not Allowed",
    meaning: "The method is not allowed on this resource; the Allow header lists valid ones.",
  },
  {
    code: 406,
    name: "Not Acceptable",
    meaning: "The server cannot produce a response matching the Accept headers.",
  },
  {
    code: 408,
    name: "Request Timeout",
    meaning: "The server gave up waiting for the client to finish the request.",
  },
  {
    code: 409,
    name: "Conflict",
    meaning: "The request conflicts with the current state of the resource.",
  },
  { code: 410, name: "Gone", meaning: "The resource was removed on purpose and will not return." },
  { code: 411, name: "Length Required", meaning: "The request needs a Content-Length header." },
  {
    code: 413,
    name: "Content Too Large",
    meaning: "The request body is larger than the server allows.",
  },
  {
    code: 414,
    name: "URI Too Long",
    meaning: "The address is longer than the server will process.",
  },
  {
    code: 415,
    name: "Unsupported Media Type",
    meaning: "The server does not accept the content type of the request body.",
  },
  {
    code: 418,
    name: "I'm a teapot",
    meaning: "An April Fools' joke status from RFC 2324; some servers use it to refuse bots.",
  },
  {
    code: 421,
    name: "Misdirected Request",
    meaning: "The request reached a server that cannot answer for that host.",
  },
  {
    code: 422,
    name: "Unprocessable Content",
    meaning: "The request is well formed but its content failed validation.",
  },
  {
    code: 425,
    name: "Too Early",
    meaning: "The server will not risk processing a request that might be replayed.",
  },
  {
    code: 426,
    name: "Upgrade Required",
    meaning: "The client must switch to another protocol, named in the Upgrade header.",
  },
  {
    code: 428,
    name: "Precondition Required",
    meaning: "The request must be conditional, for example with If-Match.",
  },
  {
    code: 429,
    name: "Too Many Requests",
    meaning: "The client is rate limited; Retry-After may say when to try again.",
  },
  {
    code: 431,
    name: "Request Header Fields Too Large",
    meaning: "The headers, often cookies, are too large for the server.",
  },
  {
    code: 451,
    name: "Unavailable For Legal Reasons",
    meaning: "Access is denied for a legal reason such as a court order.",
  },
  {
    code: 500,
    name: "Internal Server Error",
    meaning: "An unexpected error on the server stopped it from answering.",
  },
  {
    code: 501,
    name: "Not Implemented",
    meaning: "The server does not support the functionality needed.",
  },
  {
    code: 502,
    name: "Bad Gateway",
    meaning: "A gateway or proxy received an invalid response from the upstream server.",
  },
  {
    code: 503,
    name: "Service Unavailable",
    meaning: "The server is overloaded or down for maintenance; Retry-After may help.",
  },
  {
    code: 504,
    name: "Gateway Timeout",
    meaning: "A gateway or proxy timed out waiting for the upstream server.",
  },
  {
    code: 505,
    name: "HTTP Version Not Supported",
    meaning: "The HTTP version of the request is not supported.",
  },
  {
    code: 507,
    name: "Insufficient Storage",
    meaning: "The server cannot store what is needed to finish the request.",
  },
  {
    code: 511,
    name: "Network Authentication Required",
    meaning: "The client must authenticate to the network, as on a captive portal.",
  },
]

export const MIME_TYPES: { ext: string; type: string; note: string }[] = [
  { ext: "html", type: "text/html", note: "Web page" },
  { ext: "htm", type: "text/html", note: "Web page" },
  { ext: "css", type: "text/css", note: "Stylesheet" },
  { ext: "js", type: "text/javascript", note: "JavaScript (RFC 9239)" },
  { ext: "mjs", type: "text/javascript", note: "JavaScript module" },
  { ext: "json", type: "application/json", note: "JSON data" },
  { ext: "jsonld", type: "application/ld+json", note: "JSON-LD structured data" },
  { ext: "xml", type: "application/xml", note: "XML data" },
  { ext: "rss", type: "application/rss+xml", note: "RSS feed" },
  { ext: "atom", type: "application/atom+xml", note: "Atom feed" },
  { ext: "txt", type: "text/plain", note: "Plain text" },
  { ext: "csv", type: "text/csv", note: "Comma separated values" },
  { ext: "md", type: "text/markdown", note: "Markdown" },
  { ext: "ics", type: "text/calendar", note: "Calendar" },
  { ext: "vcf", type: "text/vcard", note: "Contact card" },
  { ext: "webmanifest", type: "application/manifest+json", note: "Web app manifest" },
  { ext: "wasm", type: "application/wasm", note: "WebAssembly module" },
  { ext: "pdf", type: "application/pdf", note: "PDF document" },
  { ext: "zip", type: "application/zip", note: "ZIP archive" },
  { ext: "gz", type: "application/gzip", note: "gzip file" },
  { ext: "tar", type: "application/x-tar", note: "Tar archive" },
  { ext: "7z", type: "application/x-7z-compressed", note: "7-Zip archive" },
  { ext: "rar", type: "application/vnd.rar", note: "RAR archive" },
  { ext: "doc", type: "application/msword", note: "Word 97 to 2003" },
  {
    ext: "docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    note: "Word document",
  },
  { ext: "xls", type: "application/vnd.ms-excel", note: "Excel 97 to 2003" },
  {
    ext: "xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    note: "Excel workbook",
  },
  { ext: "ppt", type: "application/vnd.ms-powerpoint", note: "PowerPoint 97 to 2003" },
  {
    ext: "pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    note: "PowerPoint deck",
  },
  { ext: "odt", type: "application/vnd.oasis.opendocument.text", note: "OpenDocument text" },
  {
    ext: "ods",
    type: "application/vnd.oasis.opendocument.spreadsheet",
    note: "OpenDocument spreadsheet",
  },
  { ext: "png", type: "image/png", note: "PNG image" },
  { ext: "jpg", type: "image/jpeg", note: "JPEG image" },
  { ext: "jpeg", type: "image/jpeg", note: "JPEG image" },
  { ext: "gif", type: "image/gif", note: "GIF image" },
  { ext: "webp", type: "image/webp", note: "WebP image" },
  { ext: "avif", type: "image/avif", note: "AVIF image" },
  { ext: "svg", type: "image/svg+xml", note: "SVG image" },
  { ext: "ico", type: "image/vnd.microsoft.icon", note: "Icon" },
  { ext: "bmp", type: "image/bmp", note: "Bitmap image" },
  { ext: "tif", type: "image/tiff", note: "TIFF image" },
  { ext: "woff", type: "font/woff", note: "Web font" },
  { ext: "woff2", type: "font/woff2", note: "Web font" },
  { ext: "ttf", type: "font/ttf", note: "TrueType font" },
  { ext: "otf", type: "font/otf", note: "OpenType font" },
  { ext: "mp3", type: "audio/mpeg", note: "MP3 audio" },
  { ext: "wav", type: "audio/wav", note: "WAV audio" },
  { ext: "ogg", type: "audio/ogg", note: "Ogg audio" },
  { ext: "m4a", type: "audio/mp4", note: "AAC audio" },
  { ext: "mp4", type: "video/mp4", note: "MP4 video" },
  { ext: "webm", type: "video/webm", note: "WebM video" },
  { ext: "mov", type: "video/quicktime", note: "QuickTime video" },
  { ext: "avi", type: "video/x-msvideo", note: "AVI video" },
  { ext: "mpeg", type: "video/mpeg", note: "MPEG video" },
  {
    ext: "php",
    type: "application/x-httpd-php",
    note: "Server side script (do not serve as a download)",
  },
  { ext: "sh", type: "application/x-sh", note: "Shell script" },
  { ext: "bin", type: "application/octet-stream", note: "Unknown binary" },
]

export const UA_BROWSERS: { id: string; label: string; make: (v: number) => string }[] = [
  {
    id: "chrome-win",
    label: "Chrome on Windows",
    make: (v) =>
      `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${v}.0.0.0 Safari/537.36`,
  },
  {
    id: "chrome-mac",
    label: "Chrome on macOS",
    make: (v) =>
      `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${v}.0.0.0 Safari/537.36`,
  },
  {
    id: "chrome-linux",
    label: "Chrome on Linux",
    make: (v) =>
      `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${v}.0.0.0 Safari/537.36`,
  },
  {
    id: "firefox-win",
    label: "Firefox on Windows",
    make: (v) =>
      `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:${v}.0) Gecko/20100101 Firefox/${v}.0`,
  },
  {
    id: "firefox-linux",
    label: "Firefox on Linux",
    make: (v) => `Mozilla/5.0 (X11; Linux x86_64; rv:${v}.0) Gecko/20100101 Firefox/${v}.0`,
  },
  {
    id: "safari-mac",
    label: "Safari on macOS",
    make: (v) =>
      `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${v}.0 Safari/605.1.15`,
  },
  {
    id: "edge-win",
    label: "Edge on Windows",
    make: (v) =>
      `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${v}.0.0.0 Safari/537.36 Edg/${v}.0.0.0`,
  },
  {
    id: "chrome-android",
    label: "Chrome on Android",
    make: (v) =>
      `Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${v}.0.0.0 Mobile Safari/537.36`,
  },
  {
    id: "safari-ios",
    label: "Safari on iPhone",
    make: (v) =>
      `Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${v}.0 Mobile/15E148 Safari/604.1`,
  },
  {
    id: "googlebot",
    label: "Googlebot (desktop)",
    make: () => "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  },
  {
    id: "bingbot",
    label: "Bingbot",
    make: () => "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
  },
  { id: "curl", label: "curl", make: () => "curl/8.5.0" },
]
