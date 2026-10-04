"use client"

import { useState } from "react"
import { ArrowLeftRight, Search, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ToolHeader } from "@/components/ui/tool-header"
import { CopyButton } from "@/components/ui/copy-button"
import { compareResolvers, type ResolverComparisonResult } from "@/lib/dns-depth"
import { getToolBySlug } from "@/lib/tool-registry"

const RECORD_TYPES = ["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SOA", "PTR"]

export function DnsResolverComparison() {
  const tool = getToolBySlug("dns-resolver-comparison")!
  const [name, setName] = useState("cloudflare.com")
  const [recordType, setRecordType] = useState("A")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ResolverComparisonResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Please enter a domain or hostname to compare.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await compareResolvers(name, recordType)
      setResult(res)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const errorId = "resolver-comparison-error"

  return (
    <div className="tool-container">
      <ToolHeader icon={ArrowLeftRight} title={tool.title} description={tool.description} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Dual Resolver Query</CardTitle>
            <CardDescription>
              Query Google DNS and Cloudflare DNS simultaneously to detect propagation differences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCompare} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resolver-name-input">Domain or Hostname</Label>
                <Input
                  id="resolver-name-input"
                  type="text"
                  placeholder="e.g. example.com"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? errorId : undefined}
                  disabled={loading}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resolver-type-select">Record Type</Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {RECORD_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setRecordType(t)}
                      className={`rounded border px-2 py-1.5 font-mono text-xs font-semibold transition-colors ${
                        recordType === t
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background hover:bg-muted text-foreground border-input"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" disabled={loading || !name.trim()} className="w-full">
                {loading ? (
                  <Loader2 className="mr-1.5 size-4 animate-spin" />
                ) : (
                  <Search className="mr-1.5 size-4" />
                )}
                <span>Compare Resolvers</span>
              </Button>

              <div className="bg-muted text-muted-foreground space-y-1 rounded-md p-3 text-xs">
                <p className="text-foreground font-medium">DoH Endpoints</p>
                <p>Google: dns.google (8.8.8.8)</p>
                <p>Cloudflare: cloudflare-dns.com (1.1.1.1, JSON)</p>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Side-by-Side Comparison</CardTitle>
              <CardDescription>
                {result
                  ? `Answers for ${result.name} (${result.type})`
                  : "Resolver response comparison"}
              </CardDescription>
            </div>
            {result && <CopyButton value={JSON.stringify(result, null, 2)} />}
          </CardHeader>
          <CardContent>
            <div role="status" aria-live="polite" className="space-y-4">
              {loading && (
                <div className="text-muted-foreground flex items-center justify-center py-12">
                  <Loader2 className="mr-2 size-6 animate-spin" />
                  <span>Querying dns.google and cloudflare-dns.com in parallel...</span>
                </div>
              )}

              {error && (
                <Alert variant="destructive" id={errorId}>
                  <AlertDescription id={errorId}>{error}</AlertDescription>
                </Alert>
              )}

              {!loading && !error && !result && (
                <div className="text-muted-foreground py-10 text-center text-sm">
                  Enter a hostname, select a record type, and click Compare to view side-by-side
                  answers.
                </div>
              )}

              {!loading && result && (
                <div className="space-y-4">
                  <div className="bg-card flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Comparison:</span>
                      <Badge variant={result.isIdentical ? "default" : "destructive"}>
                        {result.isIdentical ? "Identical Answers" : "Answers Differ"}
                      </Badge>
                      {result.ttlDifference && (
                        <Badge variant="outline" className="text-xs">
                          TTL Variance
                        </Badge>
                      )}
                    </div>
                  </div>

                  {result.notes.length > 0 && (
                    <div className="space-y-1">
                      {result.notes.map((note, i) => (
                        <p key={i} className="text-muted-foreground text-xs">
                          • {note}
                        </p>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Google Column */}
                    <div className="bg-muted/20 space-y-3 rounded-lg border p-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="text-foreground text-sm font-bold">Google DNS</p>
                          <p className="text-muted-foreground font-mono text-[0.6875rem]">
                            dns.google (8.8.8.8)
                          </p>
                        </div>
                        <Badge variant="outline" className="font-mono text-xs">
                          {result.google.rttMs} ms
                        </Badge>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <span className="font-mono font-semibold">
                            {result.google.statusText}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">DNSSEC AD:</span>
                          <span className="font-mono">
                            {result.google.authenticatedData ? "Yes" : "No"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Answer Count:</span>
                          <span className="font-mono font-semibold">
                            {result.google.answers.length}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-foreground text-xs font-semibold">Answer Records:</p>
                        {result.google.answers.length > 0 ? (
                          <div className="max-h-48 space-y-1 overflow-y-auto font-mono text-xs">
                            {result.google.answers.map((ans, idx) => (
                              <div
                                key={idx}
                                className="bg-background/80 rounded border p-2 text-[0.6875rem] break-all"
                              >
                                <div className="text-muted-foreground text-[0.625rem]">
                                  TTL: {ans.TTL}s
                                </div>
                                <div>{ans.data}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-xs italic">
                            No answers returned.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Cloudflare Column */}
                    <div className="bg-muted/20 space-y-3 rounded-lg border p-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="text-foreground text-sm font-bold">Cloudflare DNS</p>
                          <p className="text-muted-foreground font-mono text-[0.6875rem]">
                            cloudflare-dns.com (1.1.1.1)
                          </p>
                        </div>
                        <Badge variant="outline" className="font-mono text-xs">
                          {result.cloudflare.rttMs} ms
                        </Badge>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <span className="font-mono font-semibold">
                            {result.cloudflare.statusText}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">DNSSEC AD:</span>
                          <span className="font-mono">
                            {result.cloudflare.authenticatedData ? "Yes" : "No"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Answer Count:</span>
                          <span className="font-mono font-semibold">
                            {result.cloudflare.answers.length}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-foreground text-xs font-semibold">Answer Records:</p>
                        {result.cloudflare.answers.length > 0 ? (
                          <div className="max-h-48 space-y-1 overflow-y-auto font-mono text-xs">
                            {result.cloudflare.answers.map((ans, idx) => (
                              <div
                                key={idx}
                                className="bg-background/80 rounded border p-2 text-[0.6875rem] break-all"
                              >
                                <div className="text-muted-foreground text-[0.625rem]">
                                  TTL: {ans.TTL}s
                                </div>
                                <div>{ans.data}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-xs italic">
                            No answers returned.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-muted-foreground border-t pt-2 text-xs">
                    Direct DNS queries sent to Google (dns.google) and Cloudflare
                    (cloudflare-dns.com)
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
