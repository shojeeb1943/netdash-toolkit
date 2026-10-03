"use client"

import { useMemo, useState, type ComponentType } from "react"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolHeader } from "@/components/ui/tool-header"
import { CopyButton } from "@/components/ui/copy-button"
import { calcDefs, formatValue, runCalc } from "@/lib/business-calcs"
import { getToolBySlug } from "@/lib/tool-registry"

function CalcTool({ slug, icon }: { slug: string; icon: LucideIcon }) {
  const def = calcDefs[slug]
  const tool = getToolBySlug(slug)!
  const [raw, setRaw] = useState<Record<string, string>>(() =>
    Object.fromEntries(def.fields.map((fl) => [fl.id, String(fl.value)]))
  )

  const result = useMemo(
    () =>
      runCalc(
        slug,
        Object.fromEntries(
          def.fields.map((fl) => [fl.id, raw[fl.id].trim() === "" ? NaN : Number(raw[fl.id])])
        )
      ),
    [slug, def, raw]
  )

  const summary = Array.isArray(result)
    ? result.map((o) => `${o.label}: ${formatValue(o)}`).join("\n")
    : ""

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
            {def.fields.map((fl) => (
              <div key={fl.id} className="space-y-2">
                <Label htmlFor={`${slug}-${fl.id}`}>{fl.label}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id={`${slug}-${fl.id}`}
                    type="number"
                    inputMode="decimal"
                    min={fl.min}
                    step={fl.step}
                    value={raw[fl.id]}
                    aria-invalid={typeof result === "string"}
                    aria-describedby={typeof result === "string" ? `${slug}-error` : undefined}
                    onChange={(e) => setRaw((r) => ({ ...r, [fl.id]: e.target.value }))}
                  />
                  {fl.suffix && (
                    <span className="text-muted-foreground text-xs whitespace-nowrap">
                      {fl.suffix}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Results</CardTitle>
            {summary && <CopyButton value={summary} />}
          </CardHeader>
          <CardContent>
            {typeof result === "string" ? (
              <Alert variant="destructive">
                <AlertDescription id={`${slug}-error`}>{result}</AlertDescription>
              </Alert>
            ) : (
              <dl className="space-y-3" aria-live="polite">
                {result.map((o) => (
                  <div key={o.label} className="flex items-baseline justify-between gap-4">
                    <dt className="text-muted-foreground text-sm">{o.label}</dt>
                    <dd className={o.strong ? "text-lg font-semibold" : "font-medium"}>
                      {formatValue(o)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function makeCalc(slug: string, icon: LucideIcon): ComponentType {
  const Calc = () => <CalcTool slug={slug} icon={icon} />
  Calc.displayName = `Calc(${slug})`
  return Calc
}
