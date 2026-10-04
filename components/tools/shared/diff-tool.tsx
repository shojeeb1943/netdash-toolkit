"use client"

import { useMemo, useState, type ComponentType } from "react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolHeader } from "@/components/ui/tool-header"
import { CopyButton } from "@/components/ui/copy-button"
import { diffDefs, diffJson, diffLines, formatJsonChanges } from "@/lib/diff"
import { getToolBySlug } from "@/lib/tool-registry"

function DiffTool({ slug, icon }: { slug: string; icon: LucideIcon }) {
  const def = diffDefs[slug]
  const tool = getToolBySlug(slug)!
  const [a, setA] = useState(def.sampleA)
  const [b, setB] = useState(def.sampleB)
  const [ignoreCase, setIgnoreCase] = useState(false)
  const [ignoreSpace, setIgnoreSpace] = useState(false)
  const errorId = `${slug}-error`

  const result = useMemo(() => {
    try {
      if (def.kind === "json") {
        if (!a.trim() || !b.trim()) return { error: "Paste JSON into both boxes." }
        const changes = diffJson(JSON.parse(a), JSON.parse(b))
        return { json: changes, text: formatJsonChanges(changes) }
      }
      const ops = diffLines(a.split(/\r?\n/), b.split(/\r?\n/), { ignoreCase, ignoreSpace })
      const added = ops.filter((o) => o.t === "add").length
      const removed = ops.filter((o) => o.t === "del").length
      return { ops, added, removed, same: ops.length - added - removed }
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) }
    }
  }, [def.kind, a, b, ignoreCase, ignoreSpace])

  const error = "error" in result ? result.error : null
  const copyText =
    "ops" in result && result.ops
      ? result.ops
          .map((o) => `${o.t === "add" ? "+" : o.t === "del" ? "-" : " "} ${o.v}`)
          .join("\n")
      : "text" in result && result.text
        ? result.text
        : ""

  return (
    <div className="tool-container">
      <ToolHeader icon={icon} title={tool.title} description={tool.description} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[
          { id: "a", label: def.labelA, value: a, set: setA },
          { id: "b", label: def.labelB, value: b, set: setB },
        ].map((box) => (
          <Card key={box.id}>
            <CardHeader>
              <CardTitle>{box.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label htmlFor={`${slug}-${box.id}`}>{box.label}</Label>
              <Textarea
                id={`${slug}-${box.id}`}
                rows={10}
                className="font-mono text-sm"
                spellCheck={false}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                value={box.value}
                onChange={(e) => box.set(e.target.value)}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Differences</CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setA(b)
                setB(a)
              }}
            >
              Swap sides
            </Button>
            {copyText && <CopyButton value={copyText} />}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {def.kind === "text" && (
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="size-4"
                  checked={ignoreCase}
                  onChange={(e) => setIgnoreCase(e.target.checked)}
                />
                Ignore case
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="size-4"
                  checked={ignoreSpace}
                  onChange={(e) => setIgnoreSpace(e.target.checked)}
                />
                Ignore spacing
              </label>
            </div>
          )}
          <div aria-live="polite" className="space-y-3">
            {error ? (
              <Alert variant="destructive">
                <AlertDescription id={errorId}>{error}</AlertDescription>
              </Alert>
            ) : "ops" in result && result.ops ? (
              <>
                <p className="text-sm">
                  {result.added} added, {result.removed} removed, {result.same} unchanged
                </p>
                <pre className="bg-muted overflow-x-auto rounded-md p-3 font-mono text-xs leading-relaxed">
                  {result.ops.map((o, i) => (
                    <span
                      key={i}
                      className={`block ${o.t === "add" ? "bg-green-500/15 text-green-800 dark:text-green-300" : o.t === "del" ? "bg-red-500/15 text-red-800 dark:text-red-300" : ""}`}
                    >
                      {o.t === "add" ? "+ " : o.t === "del" ? "- " : "  "}
                      {o.v}
                    </span>
                  ))}
                </pre>
              </>
            ) : "json" in result && result.json ? (
              result.json.length ? (
                <>
                  <p className="text-sm">
                    {result.json.length} difference{result.json.length === 1 ? "" : "s"}
                  </p>
                  <pre className="bg-muted overflow-x-auto rounded-md p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                    {result.text}
                  </pre>
                </>
              ) : (
                <p className="text-sm">The two documents are identical.</p>
              )
            ) : null}
          </div>
          <p className="text-muted-foreground text-xs">
            + means added in the second box, - means removed from the first.
            {def.kind === "json" ? " ~ means the value changed. Key order is ignored." : ""}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export function makeDiffTool(slug: string, icon: LucideIcon): ComponentType {
  const Diff = () => <DiffTool slug={slug} icon={icon} />
  Diff.displayName = `Diff(${slug})`
  return Diff
}
