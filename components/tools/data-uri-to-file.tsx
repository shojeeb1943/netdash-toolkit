"use client"

import { useEffect, useMemo, useState } from "react"
import { FileDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolHeader } from "@/components/ui/tool-header"
import { extForMime, formatBytes, parseDataUri, PREVIEW_IMAGES, PREVIEW_TEXT } from "@/lib/files"

const SAMPLE = "data:text/plain;base64,SGVsbG8gZnJvbSBhIGRhdGEgVVJJIQ=="

export function DataUriToFile() {
  const [input, setInput] = useState(SAMPLE)
  const parsed = useMemo(() => (input.trim() ? parseDataUri(input) : null), [input])
  const ok = parsed && !("error" in parsed) ? parsed : null
  const error = parsed && "error" in parsed ? parsed.error : ""

  const [url, setUrl] = useState("")
  useEffect(() => {
    if (!ok) {
      setUrl("")
      return
    }
    // downloaded as a plain blob of the stated type; it is never opened or rendered as a page
    const u = URL.createObjectURL(new Blob([ok.bytes as BlobPart], { type: ok.mime }))
    setUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [ok])

  const text =
    ok && PREVIEW_TEXT.has(ok.mime) ? new TextDecoder().decode(ok.bytes.slice(0, 4000)) : ""

  return (
    <div className="tool-container">
      <ToolHeader
        icon={FileDown}
        title="Data URI to File"
        description="Decode a data URI back into a downloadable file and see its type and size, entirely in your browser"
      />

      <Card>
        <CardHeader>
          <CardTitle>Data URI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="data-uri-input">Paste a data URI</Label>
          <Textarea
            id="data-uri-input"
            rows={6}
            className="font-mono text-xs"
            spellCheck={false}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "data-uri-error" : undefined}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>File</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div aria-live="polite" className="space-y-3">
            {error && (
              <Alert variant="destructive">
                <AlertDescription id="data-uri-error">{error}</AlertDescription>
              </Alert>
            )}
            {ok && (
              <>
                <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-sm">
                  <dt className="text-muted-foreground">Type</dt>
                  <dd className="font-medium">{ok.mime}</dd>
                  <dt className="text-muted-foreground">Size</dt>
                  <dd className="font-medium">{formatBytes(ok.bytes.length)}</dd>
                  <dt className="text-muted-foreground">Encoding</dt>
                  <dd className="font-medium">{ok.base64 ? "Base64" : "Percent encoded text"}</dd>
                  {Object.entries(ok.params).map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
                {url && (
                  <a
                    className="text-primary inline-flex min-h-6 items-center text-sm underline"
                    href={url}
                    download={`file.${extForMime(ok.mime)}`}
                  >
                    Download file.{extForMime(ok.mime)}
                  </a>
                )}
                {PREVIEW_IMAGES.has(ok.mime) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={input.trim()}
                    alt="Preview of the decoded image"
                    className="max-h-64 rounded-md border"
                  />
                )}
                {text && (
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">
                      First part of the content, shown as plain text:
                    </p>
                    <pre className="bg-muted overflow-x-auto rounded-md p-3 font-mono text-xs whitespace-pre-wrap">
                      {text}
                    </pre>
                  </div>
                )}
              </>
            )}
            {!ok && !error && (
              <p className="text-muted-foreground text-sm">Paste a data URI to decode it.</p>
            )}
          </div>
          <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-xs">
            <li>HTML and SVG content is shown as text and downloaded, never run.</li>
            <li>A data URI looks like data:image/png;base64, followed by the encoded bytes.</li>
            <li>Only images that browsers show safely are previewed.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
