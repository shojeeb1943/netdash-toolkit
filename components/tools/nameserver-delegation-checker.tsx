"use client"

import { useState } from "react"
import { Globe, Search, Loader2, CheckCircle2, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ToolHeader } from "@/components/ui/tool-header"
import { CopyButton } from "@/components/ui/copy-button"
import { checkNameserverDelegation, type DelegationCheckResult } from "@/lib/dns-depth"
import { getToolBySlug } from "@/lib/tool-registry"

export function NameserverDelegationChecker() {
  const tool = getToolBySlug("nameserver-delegation-checker")!
  const [domain, setDomain] = useState("github.com")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DelegationCheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!domain.trim()) {
      setError("Please enter a domain name to compare delegation.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await checkNameserverDelegation(domain)
      setResult(res)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const errorId = "delegation-checker-error"

  return (
    <div className="tool-container">
      <ToolHeader icon={Globe} title={tool.title} description={tool.description} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Delegation Comparison Query</CardTitle>
            <CardDescription>
              Compare parent registry RDAP nameservers against live zone apex NS records.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCheck} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="delegation-domain-input">Domain Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="delegation-domain-input"
                    type="text"
                    placeholder="e.g. example.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                    disabled={loading}
                    className="font-mono"
                  />
                  <Button type="submit" disabled={loading || !domain.trim()}>
                    {loading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Search className="size-4" />
                    )}
                    <span className="ml-1.5">Compare</span>
                  </Button>
                </div>
              </div>

              <div className="bg-muted text-muted-foreground space-y-1 rounded-md p-3 text-xs">
                <p className="text-foreground font-medium">Why Delegation Parity Matters</p>
                <p>
                  When registrar NS records disagree with zone file NS records, resolving DNS
                  queries may intermittently fail or route to outdated infrastructure.
                </p>
                <p>Data queried via RDAP bootstrap and Google DoH.</p>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Delegation Results</CardTitle>
              <CardDescription>Registry vs. live nameserver comparison</CardDescription>
            </div>
            {result && <CopyButton value={JSON.stringify(result, null, 2)} />}
          </CardHeader>
          <CardContent>
            <div role="status" aria-live="polite" className="space-y-4">
              {loading && (
                <div className="text-muted-foreground flex items-center justify-center py-12">
                  <Loader2 className="mr-2 size-6 animate-spin" />
                  <span>Fetching parent RDAP data and querying live NS records...</span>
                </div>
              )}

              {error && (
                <Alert variant="destructive" id={errorId}>
                  <AlertDescription id={errorId}>{error}</AlertDescription>
                </Alert>
              )}

              {!loading && !error && !result && (
                <div className="text-muted-foreground py-10 text-center text-sm">
                  Enter a domain name and click Compare to evaluate nameserver delegation.
                </div>
              )}

              {!loading && result && (
                <div className="space-y-4">
                  <div className="bg-card space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Domain</span>
                      <span className="font-mono text-base font-bold">{result.domain}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Delegation Status</span>
                      <Badge
                        variant={
                          result.isConsistent
                            ? "default"
                            : result.verdict === "mismatch"
                              ? "destructive"
                              : "secondary"
                        }
                        className="flex items-center gap-1"
                      >
                        {result.isConsistent ? (
                          <CheckCircle2 className="size-3.5" />
                        ) : (
                          <AlertTriangle className="size-3.5" />
                        )}
                        <span>{result.verdictLabel}</span>
                      </Badge>
                    </div>

                    <p className="text-muted-foreground text-xs">{result.details}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="bg-muted/20 space-y-2 rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-foreground text-xs font-semibold">
                          Registry NS (Parent)
                        </span>
                        <span className="text-muted-foreground font-mono text-xs">
                          {result.registryNameservers.length}
                        </span>
                      </div>
                      {result.registryNameservers.length > 0 ? (
                        <div className="space-y-1 font-mono text-xs">
                          {result.registryNameservers.map((ns) => (
                            <div
                              key={ns}
                              className={`rounded border p-1.5 text-[0.6875rem] ${
                                result.matchingNameservers.includes(ns)
                                  ? "bg-background/80"
                                  : "bg-destructive/10 border-destructive/30"
                              }`}
                            >
                              {ns}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-xs italic">
                          No RDAP nameservers returned.
                        </p>
                      )}
                    </div>

                    <div className="bg-muted/20 space-y-2 rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-foreground text-xs font-semibold">
                          Live NS (Zone Apex)
                        </span>
                        <span className="text-muted-foreground font-mono text-xs">
                          {result.liveNameservers.length}
                        </span>
                      </div>
                      {result.liveNameservers.length > 0 ? (
                        <div className="space-y-1 font-mono text-xs">
                          {result.liveNameservers.map((ns) => (
                            <div
                              key={ns}
                              className={`rounded border p-1.5 text-[0.6875rem] ${
                                result.matchingNameservers.includes(ns)
                                  ? "bg-background/80"
                                  : "bg-primary/10 border-primary/30"
                              }`}
                            >
                              {ns}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-xs italic">
                          No live NS records returned.
                        </p>
                      )}
                    </div>
                  </div>

                  {result.registryOnly.length > 0 && (
                    <div className="space-y-1 rounded border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs">
                      <p className="text-foreground font-semibold">
                        Parent Registry Only (Missing in Live Zone):
                      </p>
                      <p className="font-mono">{result.registryOnly.join(", ")}</p>
                    </div>
                  )}

                  {result.liveOnly.length > 0 && (
                    <div className="space-y-1 rounded border border-blue-500/30 bg-blue-500/10 p-2.5 text-xs">
                      <p className="text-foreground font-semibold">
                        Live Zone Only (Not in Parent Registry):
                      </p>
                      <p className="font-mono">{result.liveOnly.join(", ")}</p>
                    </div>
                  )}

                  <div className="text-muted-foreground border-t pt-2 text-xs">
                    Data from RDAP Registry Bootstrap and Google DNS over HTTPS
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
