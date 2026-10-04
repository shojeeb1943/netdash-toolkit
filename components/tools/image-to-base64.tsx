"use client"

import { useState } from "react"
import { FileImage } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolHeader } from "@/components/ui/tool-header"
import { CopyButton } from "@/components/ui/copy-button"
import { formatBytes } from "@/lib/files"

const MAX_FILE = 5 * 1024 * 1024

interface Result {
  name: string
  size: number
  uri: string
}

function readAsDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(new Error("The file could not be read."))
    r.readAsDataURL(file)
  })
}

function Snippet({ id, label, value }: { id: string; label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        <CopyButton value={value} />
      </div>
      <Textarea id={id} readOnly rows={3} className="font-mono text-xs" value={value} />
    </div>
  )
}

export function ImageToBase64() {
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState("")

  async function onFile(file: File | undefined) {
    setError("")
    setResult(null)
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setError("That is not an image file.")
      return
    }
    if (file.size > MAX_FILE) {
      setError(
        `That image is ${formatBytes(file.size)}. Embedding more than ${formatBytes(MAX_FILE)} is not practical.`
      )
      return
    }
    try {
      setResult({ name: file.name, size: file.size, uri: await readAsDataUri(file) })
    } catch (e) {
      setError(e instanceof Error ? e.message : "The file could not be read.")
    }
  }

  const raw = result ? result.uri.slice(result.uri.indexOf(",") + 1) : ""

  return (
    <div className="tool-container">
      <ToolHeader
        icon={FileImage}
        title="Image to Base64"
        description="Turn an image into a Base64 data URI with ready HTML and CSS snippets, without uploading it anywhere"
      />

      <Card>
        <CardHeader>
          <CardTitle>Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label htmlFor="image-to-base64-file">Choose an image</Label>
          <Input
            id="image-to-base64-file"
            type="file"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "image-to-base64-error" : undefined}
            accept="image/*"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          <p className="text-muted-foreground text-xs">
            Up to {formatBytes(MAX_FILE)}. The image is encoded inside your browser.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Result</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div aria-live="polite" className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription id="image-to-base64-error">{error}</AlertDescription>
              </Alert>
            )}
            {result ? (
              <>
                <p className="text-sm">
                  {result.name}: {formatBytes(result.size)} becomes {formatBytes(result.uri.length)}{" "}
                  as text (about 33% larger).
                </p>
                {result.uri.length > 100_000 && (
                  <Alert>
                    <AlertDescription>
                      Large data URIs make pages slower and cannot be cached on their own. They suit
                      small icons; use a normal image file for photos.
                    </AlertDescription>
                  </Alert>
                )}
                <Snippet id="image-to-base64-uri" label="Data URI" value={result.uri} />
                <Snippet
                  id="image-to-base64-html"
                  label="HTML image tag"
                  value={`<img src="${result.uri}" alt="">`}
                />
                <Snippet
                  id="image-to-base64-css"
                  label="CSS background"
                  value={`background-image: url("${result.uri}");`}
                />
                <Snippet id="image-to-base64-raw" label="Base64 only" value={raw} />
              </>
            ) : (
              !error && (
                <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
                  <li>A data URI puts the image inside the HTML or CSS, saving one request.</li>
                  <li>It works best for icons and tiny images under about 10 KB.</li>
                  <li>The text is about a third larger than the original file.</li>
                  <li>Remember to write a real alt text for images that carry meaning.</li>
                </ul>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
