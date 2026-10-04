"use client"

import { useEffect, useRef, useState } from "react"
import { ScanSearch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolHeader } from "@/components/ui/tool-header"
import { formatBytes, readExif, type ExifInfo } from "@/lib/files"

const MAX_FILE = 30 * 1024 * 1024
const ORIENTATION: Record<number, string> = {
  1: "Normal",
  2: "Mirrored",
  3: "Rotated 180 degrees",
  4: "Mirrored vertically",
  5: "Mirrored and turned",
  6: "Rotated 90 degrees clockwise",
  7: "Mirrored and turned",
  8: "Rotated 90 degrees counter-clockwise",
}

function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a
}

interface Meta {
  name: string
  size: number
  type: string
  modified: string
  width?: number
  height?: number
  exif: ExifInfo | null
}

export function ImageMetadataViewer() {
  const [meta, setMeta] = useState<Meta | null>(null)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<File | null>(null)

  async function onFile(file: File | undefined) {
    setError("")
    setMeta(null)
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setError("That is not an image file.")
      return
    }
    if (file.size > MAX_FILE) {
      setError(
        `That image is ${formatBytes(file.size)}. The viewer reads up to ${formatBytes(MAX_FILE)}.`
      )
      return
    }
    fileRef.current = file
    const buf = await file.arrayBuffer()
    const exif = file.type === "image/jpeg" ? readExif(buf) : null
    let width: number | undefined
    let height: number | undefined
    try {
      const bitmap = await createImageBitmap(file)
      width = bitmap.width
      height = bitmap.height
      bitmap.close()
    } catch {
      /* the format may not be decodable here: file facts still show */
    }
    setMeta({
      name: file.name,
      size: file.size,
      type: file.type,
      modified: new Date(file.lastModified).toISOString().slice(0, 19).replace("T", " "),
      width,
      height,
      exif,
    })
  }

  const [downloadUrl, setDownloadUrl] = useState("")
  useEffect(
    () => () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl)
    },
    [downloadUrl]
  )

  async function strip() {
    const file = fileRef.current
    if (!file) return
    setBusy(true)
    try {
      const bitmap = await createImageBitmap(file)
      const canvas = document.createElement("canvas")
      canvas.width = bitmap.width
      canvas.height = bitmap.height
      canvas.getContext("2d")?.drawImage(bitmap, 0, 0)
      bitmap.close()
      const type = file.type === "image/png" ? "image/png" : "image/jpeg"
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, type, 0.92))
      if (!blob) throw new Error("The browser could not re-encode this image.")
      setDownloadUrl(URL.createObjectURL(blob))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create a clean copy.")
    }
    setBusy(false)
  }

  const rows: [string, string][] = meta
    ? [
        ["File name", meta.name],
        ["File size", formatBytes(meta.size)],
        ["Type", meta.type],
        ["Last modified", meta.modified],
        ...(meta.width && meta.height
          ? ([
              ["Dimensions", `${meta.width} x ${meta.height} pixels`],
              [
                "Aspect ratio",
                `${meta.width / gcd(meta.width, meta.height)}:${meta.height / gcd(meta.width, meta.height)}`,
              ],
              ["Megapixels", ((meta.width * meta.height) / 1_000_000).toFixed(2)],
            ] as [string, string][])
          : []),
        ...(meta.exif
          ? (
              [
                ["Camera make", meta.exif.make ?? ""],
                ["Camera model", meta.exif.model ?? ""],
                ["Software", meta.exif.software ?? ""],
                ["Taken", meta.exif.dateOriginal ?? meta.exif.dateTime ?? ""],
                [
                  "Orientation",
                  meta.exif.orientation
                    ? (ORIENTATION[meta.exif.orientation] ?? String(meta.exif.orientation))
                    : "",
                ],
              ] as [string, string][]
            ).filter(([, v]) => v)
          : []),
      ]
    : []

  return (
    <div className="tool-container">
      <ToolHeader
        icon={ScanSearch}
        title="Image Metadata Viewer"
        description="See an image's size, dimensions and camera EXIF data, and whether it hides GPS location, all in your browser"
      />

      <Card>
        <CardHeader>
          <CardTitle>Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label htmlFor="image-metadata-file">Choose an image</Label>
          <Input
            id="image-metadata-file"
            type="file"
            accept="image/*"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          <p className="text-muted-foreground text-xs">
            The file is read by your browser only. It is not uploaded.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div aria-live="polite" className="space-y-3">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {meta?.exif?.hasGps && (
              <Alert>
                <AlertDescription>
                  This photo contains GPS location data. Sharing the original file can reveal where
                  it was taken.
                </AlertDescription>
              </Alert>
            )}
            {meta && meta.type === "image/jpeg" && !meta.exif && (
              <p className="text-muted-foreground text-sm">No EXIF data found in this JPEG.</p>
            )}
            {rows.length > 0 ? (
              <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-sm">
                {rows.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-medium break-all">{v}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              !error && (
                <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
                  <li>Choose a JPEG, PNG, GIF, WebP or other image to inspect it.</li>
                  <li>
                    JPEG photos often carry the camera model, time and sometimes GPS position.
                  </li>
                  <li>
                    Social sites usually strip this data, but email and direct downloads often do
                    not.
                  </li>
                  <li>You can make a clean copy without any of it.</li>
                </ul>
              )
            )}
          </div>
          {meta && (
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" onClick={strip} disabled={busy}>
                {busy ? "Working..." : "Make a copy without metadata"}
              </Button>
              {downloadUrl && (
                <a
                  className="text-primary text-sm underline"
                  href={downloadUrl}
                  download={`clean-${meta.name.replace(/\.[^.]+$/, "")}.${meta.type === "image/png" ? "png" : "jpg"}`}
                >
                  Download the clean copy
                </a>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
