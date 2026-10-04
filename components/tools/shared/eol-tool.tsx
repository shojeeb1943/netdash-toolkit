"use client"

import { useState, type ComponentType } from "react"
import type { LucideIcon } from "lucide-react"
import { Search, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ToolHeader } from "@/components/ui/tool-header"
import { CopyButton } from "@/components/ui/copy-button"
import { getProductEol, computeLifecycleStatus, type EolCycle, type EolVerdict } from "@/lib/eol"
import { getToolBySlug } from "@/lib/tool-registry"

export interface EolToolConfig {
  slug: string
  product: string
  icon: LucideIcon
  productName: string
  defaultVersion: string
  hint: string
}

export function makeEolTool(config: EolToolConfig): ComponentType {
  function EolToolComponent() {
    const tool = getToolBySlug(config.slug)!
    const [cycleInput, setCycleInput] = useState(config.defaultVersion)
    const [selectedCycle, setSelectedCycle] = useState(config.defaultVersion)
    const [cycles, setCycles] = useState<EolCycle[]>([])
    const [loading, setLoading] = useState(false)
    const [verdict, setVerdict] = useState<EolVerdict | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleCheck = async (e?: React.FormEvent) => {
      if (e) e.preventDefault()
      const target = (cycleInput || config.defaultVersion).trim()
      setLoading(true)
      setError(null)
      try {
        const data = await getProductEol(config.product)
        setCycles(data)
        const match =
          data.find((c) => c.cycle.toLowerCase() === target.toLowerCase()) ||
          data.find((c) => target.toLowerCase().startsWith(c.cycle.toLowerCase())) ||
          data[0]

        if (match) {
          setVerdict(computeLifecycleStatus(match))
          setSelectedCycle(match.cycle)
        } else {
          setError(`No release cycle matching "${target}" found for ${config.productName}.`)
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    }

    const handleSelectCycle = (cycle: string) => {
      setSelectedCycle(cycle)
      setCycleInput(cycle)
      const match = cycles.find((c) => c.cycle === cycle)
      if (match) {
        setVerdict(computeLifecycleStatus(match))
      }
    }

    const inputId = `${config.slug}-version-input`
    const errorId = `${config.slug}-error-alert`

    return (
      <div className="space-y-6">
        <ToolHeader title={tool.title} description={tool.description} icon={config.icon} />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Check {config.productName} Version</CardTitle>
              <CardDescription>
                Select or type a release branch to inspect support dates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCheck} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={inputId}>Branch or Version</Label>
                  <Input
                    id={inputId}
                    value={cycleInput}
                    onChange={(e) => setCycleInput(e.target.value)}
                    placeholder={`e.g. ${config.defaultVersion}`}
                    aria-describedby={error ? errorId : undefined}
                    aria-invalid={error ? true : undefined}
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Checking Lifecycle...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 size-4" />
                      Check {config.productName} Lifecycle
                    </>
                  )}
                </Button>

                <div className="bg-muted/40 text-muted-foreground space-y-1 rounded-md border p-3 text-xs">
                  <p className="text-foreground font-medium">Lifecycle Guidelines</p>
                  <p>{config.hint}</p>
                  <p>Data retrieved from the endoflife.date API.</p>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Lifecycle Verdict</CardTitle>
                <CardDescription>Support window and maintenance schedule</CardDescription>
              </div>
              {verdict && <CopyButton value={JSON.stringify(verdict, null, 2)} />}
            </CardHeader>
            <CardContent>
              <div role="status" aria-live="polite" className="space-y-4">
                {loading && !verdict && (
                  <div className="text-muted-foreground flex items-center justify-center py-12">
                    <Loader2 className="mr-2 size-6 animate-spin" />
                    <span>Loading lifecycle schedules...</span>
                  </div>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription id={errorId}>{error}</AlertDescription>
                  </Alert>
                )}

                {verdict && (
                  <div className="space-y-4">
                    <div className="bg-card space-y-3 rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Selected Branch</span>
                        <span className="font-mono text-base font-bold">
                          {config.productName} {verdict.cycle} {verdict.isLts ? "(LTS)" : ""}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">Support Status</span>
                        <Badge
                          variant={
                            verdict.status === "supported"
                              ? "default"
                              : verdict.status === "security-only"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {verdict.statusLabel}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Release Date</span>
                        <span className="font-mono">{verdict.releaseDate || "Unknown"}</span>
                      </div>

                      {verdict.supportDate && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Active Support Ends</span>
                          <span className="font-mono">{verdict.supportDate}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">End of Life Date</span>
                        <span className="font-mono font-semibold">
                          {verdict.eolDate || "Indefinite / Not Announced"}
                        </span>
                      </div>

                      {verdict.latestVersion && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Latest Release in Branch</span>
                          <span className="text-primary font-mono font-semibold">
                            {verdict.latestVersion}
                          </span>
                        </div>
                      )}

                      {verdict.daysUntilEol !== null && (
                        <div className="bg-muted rounded p-2.5 text-xs">
                          {verdict.daysUntilEol > 0 ? (
                            <p className="text-foreground">
                              {verdict.daysUntilEol} days of maintenance remaining until official
                              end of life.
                            </p>
                          ) : (
                            <p className="text-foreground font-medium">
                              End of life was reached {Math.abs(verdict.daysUntilEol)} days ago.
                              Upgrading is recommended.
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-muted-foreground border-t pt-2 text-xs">
                      Data from endoflife.date API
                    </div>
                  </div>
                )}

                {!loading && !error && !verdict && (
                  <div className="text-muted-foreground py-12 text-center text-sm">
                    Click &quot;Check {config.productName} Lifecycle&quot; to load official release
                    windows.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {cycles.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>All {config.productName} Release Cycles</CardTitle>
              <CardDescription>Complete historical and current release branches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="text-muted-foreground border-b text-xs">
                      <th className="px-3 py-2.5 font-semibold">Cycle</th>
                      <th className="px-3 py-2.5 font-semibold">Latest</th>
                      <th className="px-3 py-2.5 font-semibold">Released</th>
                      <th className="px-3 py-2.5 font-semibold">Support End</th>
                      <th className="px-3 py-2.5 font-semibold">EOL Date</th>
                      <th className="px-3 py-2.5 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-mono text-xs">
                    {cycles.map((c) => {
                      const v = computeLifecycleStatus(c)
                      return (
                        <tr
                          key={c.cycle}
                          className={
                            c.cycle === selectedCycle
                              ? "bg-muted/70 font-semibold"
                              : "hover:bg-muted/50"
                          }
                        >
                          <td className="px-3 py-2">
                            <button
                              type="button"
                              onClick={() => handleSelectCycle(c.cycle)}
                              className="text-primary text-left font-medium hover:underline"
                            >
                              {c.cycle} {c.lts ? "(LTS)" : ""}
                            </button>
                          </td>
                          <td className="px-3 py-2">{c.latest}</td>
                          <td className="text-muted-foreground px-3 py-2">{c.releaseDate}</td>
                          <td className="text-muted-foreground px-3 py-2">
                            {typeof c.support === "string" ? c.support : "-"}
                          </td>
                          <td className="px-3 py-2">
                            {typeof c.eol === "string" ? c.eol : c.eol ? "Ended" : "Active"}
                          </td>
                          <td className="px-3 py-2">
                            <Badge
                              variant={
                                v.status === "supported"
                                  ? "default"
                                  : v.status === "security-only"
                                    ? "secondary"
                                    : "destructive"
                              }
                              className="px-1.5 py-0 text-[0.625rem]"
                            >
                              {v.statusLabel}
                            </Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  EolToolComponent.displayName = `EolTool(${config.slug})`
  return EolToolComponent
}
