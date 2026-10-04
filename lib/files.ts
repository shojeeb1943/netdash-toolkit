// helpers for the file tools. everything works on bytes and strings already in the browser: nothing is uploaded.

export function formatBytes(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "n/a"
  if (n < 1024) return `${n} B`
  const units = ["KB", "MB", "GB"]
  let v = n / 1024
  let i = 0
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i++
  }
  return `${v.toFixed(v < 10 ? 2 : 1)} ${units[i]}`
}

export function detectDelimiter(text: string): "," | ";" | "\t" | "|" {
  const first = text.split(/\r?\n/).find((l) => l.trim()) ?? ""
  // count only outside quotes, so a comma inside "a, b" does not outvote a semicolon file
  const counts: Record<string, number> = { ",": 0, ";": 0, "\t": 0, "|": 0 }
  let quoted = false
  for (const ch of first) {
    if (ch === '"') quoted = !quoted
    else if (!quoted && ch in counts) counts[ch]++
  }
  const best = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0] ?? [","])[0]
  return counts[best] > 0 ? (best as "," | ";" | "\t" | "|") : ","
}

export interface DataUri {
  mime: string
  params: Record<string, string>
  base64: boolean
  bytes: Uint8Array
}

const MIME_RE = /^[A-Za-z0-9][A-Za-z0-9!#$&^_.+-]*\/[A-Za-z0-9][A-Za-z0-9!#$&^_.+-]*$/

export function parseDataUri(input: string): DataUri | { error: string } {
  const s = input.trim()
  const m = /^data:([^,]*),([\s\S]*)$/i.exec(s)
  if (!m)
    return {
      error:
        "A data URI starts with data: and has a comma before the data, for example data:text/plain;base64,SGVsbG8=",
    }
  const meta = m[1].split(";")
  const mime = (meta.shift() || "text/plain").toLowerCase()
  if (!MIME_RE.test(mime)) return { error: `"${mime}" is not a valid media type.` }
  const base64 = meta[meta.length - 1]?.toLowerCase() === "base64"
  if (base64) meta.pop()
  const params: Record<string, string> = {}
  for (const p of meta) {
    const i = p.indexOf("=")
    if (i > 0) params[p.slice(0, i).toLowerCase()] = p.slice(i + 1)
  }
  let bytes: Uint8Array
  try {
    if (base64) {
      const clean = decodeURIComponent(m[2])
        .replace(/\s+/g, "")
        .replace(/-/g, "+")
        .replace(/_/g, "/")
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(clean))
        return { error: "The base64 data contains characters that are not allowed." }
      const bin = atob(clean + "=".repeat((4 - (clean.length % 4)) % 4))
      bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
    } else bytes = new TextEncoder().encode(decodeURIComponent(m[2]))
  } catch {
    return {
      error: "The data could not be decoded. Check that it is complete and correctly encoded.",
    }
  }
  return { mime, params, base64, bytes }
}

const EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/svg+xml": "svg",
  "image/bmp": "bmp",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
  "application/pdf": "pdf",
  "application/json": "json",
  "application/zip": "zip",
  "application/octet-stream": "bin",
  "text/plain": "txt",
  "text/html": "html",
  "text/css": "css",
  "text/csv": "csv",
  "text/javascript": "js",
  "application/xml": "xml",
  "font/woff": "woff",
  "font/woff2": "woff2",
  "audio/mpeg": "mp3",
  "video/mp4": "mp4",
}

export function extForMime(mime: string): string {
  return EXT[mime] ?? "bin"
}

export const PREVIEW_IMAGES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/avif",
  "image/bmp",
])
export const PREVIEW_TEXT = new Set([
  "text/plain",
  "text/csv",
  "text/css",
  "text/javascript",
  "application/json",
  "application/xml",
  "text/html",
  "image/svg+xml",
])

export interface ExifInfo {
  make?: string
  model?: string
  software?: string
  orientation?: number
  dateTime?: string
  dateOriginal?: string
  width?: number
  height?: number
  hasGps: boolean
}

// a deliberately small EXIF reader: the common camera fields and whether GPS data is present. never throws.
export function readExif(buf: ArrayBuffer): ExifInfo | null {
  const dv = new DataView(buf)
  try {
    if (dv.getUint16(0) !== 0xffd8) return null
    let p = 2
    while (p + 4 < dv.byteLength) {
      if (dv.getUint8(p) !== 0xff) return null
      const marker = dv.getUint8(p + 1)
      if (marker === 0xda || marker === 0xd9) return null
      const len = dv.getUint16(p + 2)
      if (marker === 0xe1 && dv.getUint32(p + 4) === 0x45786966 && dv.getUint16(p + 8) === 0)
        return parseTiff(dv, p + 10, p + 2 + len)
      p += 2 + len
    }
  } catch {
    return null
  }
  return null
}

function parseTiff(dv: DataView, base: number, end: number): ExifInfo {
  const info: ExifInfo = { hasGps: false }
  const little = dv.getUint16(base) === 0x4949
  const u16 = (o: number) => dv.getUint16(base + o, little)
  const u32 = (o: number) => dv.getUint32(base + o, little)
  const ascii = (entry: number) => {
    const count = u32(entry + 4)
    const off = count <= 4 ? entry + 8 : u32(entry + 8)
    if (base + off + count > end) return undefined
    let t = ""
    for (let i = 0; i < count; i++) {
      const c = dv.getUint8(base + off + i)
      if (c === 0) break
      t += String.fromCharCode(c)
    }
    return t.trim() || undefined
  }
  const number = (entry: number) => (u16(entry + 2) === 3 ? u16(entry + 8) : u32(entry + 8))
  const walk = (ifd: number, visit: (tag: number, entry: number) => void) => {
    if (ifd < 8 || base + ifd + 2 > end) return
    const count = u16(ifd)
    for (let i = 0; i < Math.min(count, 200); i++) {
      const entry = ifd + 2 + i * 12
      if (base + entry + 12 > end) break
      visit(u16(entry), entry)
    }
  }
  let exifIfd = 0
  let gpsIfd = 0
  walk(u32(4), (tag, e) => {
    if (tag === 0x010f) info.make = ascii(e)
    else if (tag === 0x0110) info.model = ascii(e)
    else if (tag === 0x0131) info.software = ascii(e)
    else if (tag === 0x0132) info.dateTime = ascii(e)
    else if (tag === 0x0112) info.orientation = number(e)
    else if (tag === 0x8769) exifIfd = u32(e + 8)
    else if (tag === 0x8825) gpsIfd = u32(e + 8)
  })
  if (exifIfd)
    walk(exifIfd, (tag, e) => {
      if (tag === 0x9003) info.dateOriginal = ascii(e)
      else if (tag === 0xa002) info.width = number(e)
      else if (tag === 0xa003) info.height = number(e)
    })
  if (gpsIfd) walk(gpsIfd, () => (info.hasGps = true))
  return info
}

export const HEX6 = /^#[0-9a-f]{6}$/i
