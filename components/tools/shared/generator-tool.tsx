"use client"

import { useEffect, useMemo, useState, type ComponentType } from "react"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolHeader } from "@/components/ui/tool-header"
import { CopyButton } from "@/components/ui/copy-button"
import { generatorDefs, type GResult, type GValues } from "@/lib/generators"
import { getToolBySlug } from "@/lib/tool-registry"

function GeneratorTool({ slug, icon }: { slug: string; icon: LucideIcon }) {
  const def = generatorDefs[slug]
  const tool = getToolBySlug(slug)!
  const [values, setValues] = useState<GValues>(() =>
    Object.fromEntries(def.fields.map((f) => [f.id, f.value]))
  )
  const [result, setResult] = useState<GResult>("")
  const [nonce, setNonce] = useState(0)

  // build() may be async (Web Crypto); the cancelled flag drops a stale answer when typing outpaces it
  useEffect(() => {
    let cancelled = false
    Promise.resolve(def.build(values))
      .then((r) => !cancelled && setResult(r))
      .catch((e) => !cancelled && setResult({ error: e instanceof Error ? e.message : String(e) }))
    return () => {
      cancelled = true
    }
  }, [def, values, nonce])

  const set = (id: string, value: string | number | boolean) =>
    setValues((v) => ({ ...v, [id]: value }))
  const failed = typeof result !== "string"
  const output = typeof result === "string" ? result : ""
  const serp = useMemo(() => (def.serp && !failed ? def.serp(values) : null), [def, values, failed])
  const card = useMemo(() => (def.card && !failed ? def.card(values) : null), [def, values, failed])
  const errorId = `${slug}-error`

  return (
    <div className="tool-container">
      <ToolHeader icon={icon} title={tool.title} description={tool.description} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {def.note && <p className="text-muted-foreground text-sm">{def.note}</p>}
            {def.fields.map((f) => {
              const id = `${slug}-${f.id}`
              const common = {
                id,
                "aria-invalid": failed || undefined,
                "aria-describedby": failed ? errorId : undefined,
              }
              if (f.type === "checkbox") {
                return (
                  <div key={f.id} className="flex items-center gap-2">
                    <input
                      id={id}
                      type="checkbox"
                      className="size-4"
                      checked={values[f.id] === true}
                      onChange={(e) => set(f.id, e.target.checked)}
                    />
                    <Label htmlFor={id}>{f.label}</Label>
                  </div>
                )
              }
              return (
                <div key={f.id} className="space-y-2">
                  <Label htmlFor={id}>{f.label}</Label>
                  {f.type === "textarea" ? (
                    <Textarea
                      {...common}
                      rows={4}
                      className="font-mono text-sm"
                      placeholder={f.placeholder}
                      value={String(values[f.id])}
                      onChange={(e) => set(f.id, e.target.value)}
                    />
                  ) : f.type === "select" ? (
                    <select
                      id={id}
                      className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                      value={String(values[f.id])}
                      onChange={(e) => set(f.id, e.target.value)}
                    >
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      {...common}
                      type={f.type === "number" ? "number" : f.type}
                      inputMode={f.type === "number" ? "decimal" : undefined}
                      step={f.type === "number" ? "any" : undefined}
                      placeholder={f.placeholder}
                      autoComplete={f.type === "password" ? "off" : undefined}
                      value={String(values[f.id])}
                      onChange={(e) =>
                        set(f.id, f.type === "number" ? Number(e.target.value) : e.target.value)
                      }
                    />
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{def.outputLabel}</CardTitle>
            <div className="flex items-center gap-1">
              {def.regenerate && (
                <Button variant="outline" size="sm" onClick={() => setNonce((x) => x + 1)}>
                  Generate again
                </Button>
              )}
              {output && <CopyButton value={output} />}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {failed ? (
              <Alert variant="destructive">
                <AlertDescription id={errorId}>{result.error}</AlertDescription>
              </Alert>
            ) : (
              <pre
                className="bg-muted overflow-x-auto rounded-md p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap"
                aria-live="polite"
              >
                {output}
              </pre>
            )}
            {def.help && (
              <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
                {def.help.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}
            {card && (
              <div className="bg-background overflow-hidden rounded-xl border text-left">
                <div className="bg-muted text-muted-foreground flex h-24 items-center justify-center text-xs">
                  {card.large ? "Large image area" : "Image area"}
                </div>
                <div className="space-y-1 p-3">
                  <p className="text-muted-foreground text-xs uppercase">{card.domain}</p>
                  <p className="text-sm leading-snug font-semibold">{card.title}</p>
                  <p className="text-muted-foreground text-xs leading-snug">{card.description}</p>
                </div>
              </div>
            )}
            {serp && (
              <div className="rounded-md border bg-white p-3 text-left dark:bg-white">
                <p className="truncate text-xs text-[#202124]">{serp.url}</p>
                <p className="text-lg leading-snug text-[#1a0dab]">{serp.title}</p>
                <p className="text-sm leading-snug text-[#4d5156]">{serp.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function makeGenerator(slug: string, icon: LucideIcon): ComponentType {
  const Generator = () => <GeneratorTool slug={slug} icon={icon} />
  Generator.displayName = `Generator(${slug})`
  return Generator
}
