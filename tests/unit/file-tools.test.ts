import { describe, expect, it } from "vitest"
import { detectDelimiter, extForMime, formatBytes, HEX6, parseDataUri, readExif } from "@/lib/files"
import { parseCsv } from "@/lib/csv"

describe("batch 8c: file helpers", () => {
  it("formats sizes", () => {
    expect(formatBytes(0)).toBe("0 B")
    expect(formatBytes(1536)).toBe("1.50 KB")
    expect(formatBytes(5 * 1024 * 1024)).toBe("5.00 MB")
    expect(formatBytes(-1)).toBe("n/a")
  })

  it("detects the delimiter outside quotes", () => {
    expect(detectDelimiter("a,b,c\n1,2,3")).toBe(",")
    expect(detectDelimiter("a;b;c\n1;2;3")).toBe(";")
    expect(detectDelimiter("a\tb\tc")).toBe("\t")
    expect(detectDelimiter('"x, y";"z"\n1;2')).toBe(";")
    expect(detectDelimiter("single column")).toBe(",")
    expect(detectDelimiter("")).toBe(",")
  })

  it("csv keeps literal quotes inside unquoted fields", () => {
    expect(parseCsv('says "hi",b', ",")).toEqual([['says "hi"', "b"]])
    expect(parseCsv('"quoted, with comma","x ""y"""', ",")).toEqual([
      ["quoted, with comma", 'x "y"'],
    ])
    expect(() => parseCsv('"open', ",")).toThrow()
  })

  it("parses base64 and percent encoded data URIs", () => {
    const b = parseDataUri("data:text/plain;base64,SGVsbG8=")
    expect("error" in b).toBe(false)
    if (!("error" in b)) {
      expect(b.mime).toBe("text/plain")
      expect(b.base64).toBe(true)
      expect(new TextDecoder().decode(b.bytes)).toBe("Hello")
    }
    const p = parseDataUri("data:text/plain;charset=utf-8,Hello%20World")
    if (!("error" in p)) {
      expect(p.params.charset).toBe("utf-8")
      expect(new TextDecoder().decode(p.bytes)).toBe("Hello World")
    }
    const url = parseDataUri("data:application/octet-stream;base64,_-8=")
    expect("error" in url).toBe(false)
    expect(parseDataUri("data:,plain")).toMatchObject({ mime: "text/plain" })
  })

  it("rejects malformed data URIs", () => {
    expect(parseDataUri("hello")).toHaveProperty("error")
    expect(parseDataUri("data:not a type,xx")).toHaveProperty("error")
    expect(parseDataUri("data:text/plain;base64,@@@")).toHaveProperty("error")
    expect(parseDataUri("data:text/plain,%E0%A4%A")).toHaveProperty("error")
  })

  it("maps media types to extensions", () => {
    expect(extForMime("image/png")).toBe("png")
    expect(extForMime("image/jpeg")).toBe("jpg")
    expect(extForMime("application/x-unknown")).toBe("bin")
  })

  it("validates hex colours", () => {
    expect(HEX6.test("#1e40af")).toBe(true)
    expect(HEX6.test("#fff")).toBe(false)
    expect(HEX6.test("red")).toBe(false)
  })
})

// builds a tiny JPEG whose only content is an APP1 Exif block
function jpegWithExif(opts: {
  little: boolean
  make: string
  gps: boolean
  orientation?: number
}): ArrayBuffer {
  const { little, make } = opts
  const tiff: number[] = []
  const w16 = (n: number) => (little ? [n & 255, n >> 8] : [n >> 8, n & 255])
  const w32 = (n: number) =>
    little
      ? [n & 255, (n >> 8) & 255, (n >> 16) & 255, n >>> 24]
      : [n >>> 24, (n >> 16) & 255, (n >> 8) & 255, n & 255]
  tiff.push(...(little ? [0x49, 0x49] : [0x4d, 0x4d]), ...w16(42), ...w32(8))
  const entries = 2 + (opts.gps ? 1 : 0)
  const ifdStart = 8
  const dataOffset = ifdStart + 2 + entries * 12 + 4
  const makeBytes = [...Array.from(make, (c) => c.charCodeAt(0)), 0]
  const gpsIfdOffset = dataOffset + makeBytes.length
  tiff.push(...w16(entries))
  tiff.push(...w16(0x010f), ...w16(2), ...w32(makeBytes.length), ...w32(dataOffset))
  tiff.push(...w16(0x0112), ...w16(3), ...w32(1), ...w16(opts.orientation ?? 1), 0, 0)
  if (opts.gps) tiff.push(...w16(0x8825), ...w16(4), ...w32(1), ...w32(gpsIfdOffset))
  tiff.push(...w32(0))
  tiff.push(...makeBytes)
  if (opts.gps) tiff.push(...w16(1), ...w16(1), ...w16(2), ...w32(2), 0x4e, 0x00, 0, 0, ...w32(0))
  const body = [0x45, 0x78, 0x69, 0x66, 0, 0, ...tiff]
  const len = body.length + 2
  return new Uint8Array([0xff, 0xd8, 0xff, 0xe1, len >> 8, len & 255, ...body, 0xff, 0xd9]).buffer
}

describe("batch 8c: exif reader", () => {
  it("reads make, orientation and GPS presence in both byte orders", () => {
    for (const little of [true, false]) {
      const info = readExif(jpegWithExif({ little, make: "ACME", gps: true, orientation: 6 }))
      expect(info).toMatchObject({ make: "ACME", orientation: 6, hasGps: true })
      const clean = readExif(jpegWithExif({ little, make: "Canon", gps: false }))
      expect(clean).toMatchObject({ make: "Canon", orientation: 1, hasGps: false })
    }
  })

  it("returns null for non-JPEG or exif-less data and never throws on garbage", () => {
    expect(readExif(new Uint8Array([0x89, 0x50, 0x4e, 0x47]).buffer)).toBeNull()
    expect(readExif(new Uint8Array([0xff, 0xd8, 0xff, 0xd9]).buffer)).toBeNull()
    expect(readExif(new ArrayBuffer(0))).toBeNull()
    const garbage = new Uint8Array(200).map((_, i) => (i * 37) & 255)
    garbage.set([0xff, 0xd8, 0xff, 0xe1, 0xff, 0xff])
    expect(() => readExif(garbage.buffer)).not.toThrow()
    const truncated = new Uint8Array(
      jpegWithExif({ little: true, make: "ACME", gps: true }).slice(0, 40)
    )
    expect(() => readExif(truncated.buffer)).not.toThrow()
  })
})
