"use client"

import { useEffect, useRef, useState } from "react"
import { Sparkle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolHeader } from "@/components/ui/tool-header"
import { CopyButton } from "@/components/ui/copy-button"
import { HEX6 } from "@/lib/files"

const SIZES = [
  { px: 16, name: "favicon-16x16.png" },
  { px: 32, name: "favicon-32x32.png" },
  { px: 48, name: "favicon-48x48.png" },
  { px: 180, name: "apple-touch-icon.png" },
  { px: 192, name: "android-chrome-192x192.png" },
  { px: 512, name: "android-chrome-512x512.png" },
]

function draw(
  canvas: HTMLCanvasElement,
  px: number,
  text: string,
  bg: string,
  fg: string,
  shape: string
) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  canvas.width = px
  canvas.height = px
  ctx.clearRect(0, 0, px, px)
  ctx.fillStyle = bg
  ctx.beginPath()
  if (shape === "circle") ctx.arc(px / 2, px / 2, px / 2, 0, Math.PI * 2)
  else if (shape === "rounded") ctx.roundRect(0, 0, px, px, px * 0.22)
  else ctx.rect(0, 0, px, px)
  ctx.fill()
  ctx.fillStyle = fg
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  const chars = Array.from(text)
  ctx.font = `700 ${Math.round(px * (chars.length > 1 ? 0.5 : 0.62))}px system-ui, "Segoe UI", Arial, sans-serif`
  ctx.fillText(text, px / 2, px / 2 + px * 0.04)
}

function Tile({
  px,
  name,
  text,
  bg,
  fg,
  shape,
}: {
  px: number
  name: string
  text: string
  bg: string
  fg: string
  shape: string
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [href, setHref] = useState("")
  useEffect(() => {
    const c = ref.current
    if (!c) return
    draw(c, px, text, bg, fg, shape)
    let url = ""
    c.toBlob?.((blob) => {
      if (blob) {
        url = URL.createObjectURL(blob)
        setHref(url)
      }
    })
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [px, text, bg, fg, shape])
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <canvas
        ref={ref}
        width={px}
        height={px}
        style={{ width: Math.min(px, 96), height: Math.min(px, 96) }}
        role="img"
        aria-label={`${px} pixel icon preview`}
        className="border"
      />
      <span className="text-xs">
        {px} x {px}
      </span>
      {href && (
        <a className="text-primary text-xs underline" href={href} download={name}>
          Download {name}
        </a>
      )}
    </div>
  )
}

export function FaviconGenerator() {
  const [text, setText] = useState("L")
  const [bg, setBg] = useState("#1e40af")
  const [fg, setFg] = useState("#ffffff")
  const [shape, setShape] = useState("rounded")

  const chars = Array.from(text.trim())
  const error = !chars.length
    ? "Enter one or two characters or an emoji."
    : chars.length > 2
      ? "Use at most two characters."
      : !HEX6.test(bg) || !HEX6.test(fg)
        ? "Colours must be six digit hex values such as #1e40af."
        : ""
  const snippet = `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`
  const manifest = `"icons": [
  { "src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png" },
  { "src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png" }
]`

  return (
    <div className="tool-container">
      <ToolHeader
        icon={Sparkle}
        title="Favicon Generator"
        description="Make a simple letter or emoji favicon in every size browsers and phones need, then download the PNG files"
      />

      <Card>
        <CardHeader>
          <CardTitle>Design</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="favicon-text">Letter or emoji</Label>
            <Input
              id="favicon-text"
              value={text}
              maxLength={8}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "favicon-error" : undefined}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="favicon-shape">Shape</Label>
            <select
              id="favicon-shape"
              className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
              value={shape}
              onChange={(e) => setShape(e.target.value)}
            >
              <option value="rounded">Rounded square</option>
              <option value="circle">Circle</option>
              <option value="square">Square</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="favicon-bg">Background colour</Label>
            <Input id="favicon-bg" value={bg} onChange={(e) => setBg(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="favicon-fg">Text colour</Label>
            <Input id="favicon-fg" value={fg} onChange={(e) => setFg(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Icons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div aria-live="polite">
            {error ? (
              <Alert variant="destructive">
                <AlertDescription id="favicon-error">{error}</AlertDescription>
              </Alert>
            ) : (
              <div className="flex flex-wrap items-end gap-6">
                {SIZES.map((s) => (
                  <Tile
                    key={s.px}
                    px={s.px}
                    name={s.name}
                    text={chars.join("")}
                    bg={bg}
                    fg={fg}
                    shape={shape}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="favicon-head">Add to the page head</Label>
              <CopyButton value={snippet} />
            </div>
            <pre
              id="favicon-head"
              className="bg-muted overflow-x-auto rounded-md p-3 font-mono text-xs"
            >
              {snippet}
            </pre>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="favicon-manifest">Add to your web manifest</Label>
              <CopyButton value={manifest} />
            </div>
            <pre
              id="favicon-manifest"
              className="bg-muted overflow-x-auto rounded-md p-3 font-mono text-xs"
            >
              {manifest}
            </pre>
          </div>
          <p className="text-muted-foreground text-xs">
            The images are drawn in your browser. Upload the downloaded files to the root of your
            site.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
