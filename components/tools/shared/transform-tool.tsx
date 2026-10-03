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
import { transformDefs } from "@/lib/text-transforms"
import { getToolBySlug } from "@/lib/tool-registry"

function TransformTool({ slug, icon }: { slug: string; icon: LucideIcon }) {
  const def = transformDefs[slug]
  const tool = getToolBySlug(slug)!
  const [input, setInput] = useState("")
  const [opts, setOpts] = useState<Record<string, string | boolean>>(() =>
    Object.fromEntries((def.options ?? []).map((o) => [o.id, o.value]))
  )

  // DOMParser (xml) only exists in the browser, so an empty input is answered before run() is reached
  const result = useMemo(() => (input.trim() ? def.run(input, opts) : null), [def, input, opts])
  const error = result && "error" in result ? result.error : null
  const output = result && "ok" in result ? result.ok : ""
  const errorId = `${slug}-error`

  return (
    <div className="tool-container">
      <ToolHeader icon={icon} title={tool.title} description={tool.description} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Input</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setInput(def.sample)}>
              Load example
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${slug}-input`}>{def.inputLabel}</Label>
              <Textarea
                id={`${slug}-input`}
                rows={14}
                className="font-mono text-sm"
                spellCheck={false}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            {def.options?.map((o) => {
              const id = `${slug}-${o.id}`
              return o.type === "checkbox" ? (
                <div key={o.id} className="flex items-center gap-2">
                  <input
                    id={id}
                    type="checkbox"
                    className="size-4"
                    checked={opts[o.id] === true}
                    onChange={(e) => setOpts((p) => ({ ...p, [o.id]: e.target.checked }))}
                  />
                  <Label htmlFor={id}>{o.label}</Label>
                </div>
              ) : (
                <div key={o.id} className="space-y-2">
                  <Label htmlFor={id}>{o.label}</Label>
                  <select
                    id={id}
                    className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                    value={String(opts[o.id])}
                    onChange={(e) => setOpts((p) => ({ ...p, [o.id]: e.target.value }))}
                  >
                    {o.choices?.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{def.outputLabel}</CardTitle>
            {output && <CopyButton value={output} />}
          </CardHeader>
          <CardContent>
            {error ? (
              <Alert variant="destructive">
                <AlertDescription id={errorId}>{error}</AlertDescription>
              </Alert>
            ) : (
              <pre
                className="bg-muted min-h-40 overflow-x-auto rounded-md p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap"
                aria-live="polite"
              >
                {output || "The result appears here."}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function makeTransform(slug: string, icon: LucideIcon): ComponentType {
  const Transform = () => <TransformTool slug={slug} icon={icon} />
  Transform.displayName = `Transform(${slug})`
  return Transform
}
