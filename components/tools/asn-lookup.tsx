"use client"

import { useState } from "react"
import { Network, Search, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ToolHeader } from "@/components/ui/tool-header"
import { CopyButton } from "@/components/ui/copy-button"
import {
  getAsOverview,
  getAnnouncedPrefixes,
  type AsOverviewData,
  type AnnouncedPrefixesData,
} from "@/lib/ripestat"
import { isAsn, cleanAsn } from "@/lib/validators"
import { getToolBySlug } from "@/lib/tool-registry"

export function AsnLookup() {
  const tool = getToolBySlug("asn-lookup")!
  const [asnInput, setAsnInput] = useState("AS13335")
  const [loading, setLoading] = useState(false)
  const [overview, setOverview] = useState<AsOverviewData | null>(null)
  const [prefixes, setPrefixes] = useState<AnnouncedPrefixesData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const clean = cleanAsn(asnInput)
    if (!isAsn(clean)) {
      setError("Enter a valid Autonomous System Number, for example AS13335 or 15169.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const [ovRes, prefRes] = await Promise.all([
        getAsOverview(clean),
        getAnnouncedPrefixes(clean),
      ])
      setOverview(ovRes)
      setPrefixes(prefRes)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
      setOverview(null)
      setPrefixes(null)
    } finally {
      setLoading(false)
    }
  }

  const errorId = "asn-lookup-error"
  const totalPrefixes = prefixes?.prefixes?.length ?? 0
  const displayedPrefixes = prefixes?.prefixes?.slice(0, 50) ?? []

  return (
    <div className="tool-container">
      <ToolHeader icon={Network} title={tool.title} description={tool.description} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Autonomous System Search</CardTitle>
            <CardDescription>
              Query Autonomous System Number (ASN) details, organization holder, and announced BGP
              routing prefixes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="asn-search-input">ASN (e.g. AS13335 or 15169)</Label>
                <div className="flex gap-2">
                  <Input
                    id="asn-search-input"
                    type="text"
                    placeholder="AS13335"
                    value={asnInput}
                    onChange={(e) => setAsnInput(e.target.value)}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                    disabled={loading}
                    className="font-mono"
                  />
                  <Button type="submit" disabled={loading || !asnInput.trim()}>
                    {loading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Search className="size-4" />
                    )}
                    <span className="ml-1.5">Lookup</span>
                  </Button>
                </div>
              </div>

              <div className="bg-muted text-muted-foreground space-y-1 rounded-md p-3 text-xs">
                <p className="text-foreground font-medium">Data Source</p>
                <p>Data retrieved in real time from the RIPEstat Global Routing Database.</p>
                <p>Prefix lists are capped at the first 50 entries for fast browser rendering.</p>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>ASN Information</CardTitle>
              <CardDescription>Holder registration and route origin stats</CardDescription>
            </div>
            {overview && (
              <CopyButton value={JSON.stringify({ overview, totalPrefixes }, null, 2)} />
            )}
          </CardHeader>
          <CardContent>
            <div role="status" aria-live="polite" className="space-y-4">
              {loading && (
                <div className="text-muted-foreground flex items-center justify-center py-12">
                  <Loader2 className="mr-2 size-6 animate-spin" />
                  <span>Querying RIPEstat AS overview and prefix tables...</span>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription id={errorId}>{error}</AlertDescription>
                </Alert>
              )}

              {!loading && !error && !overview && (
                <div className="text-muted-foreground py-10 text-center text-sm">
                  Enter an ASN such as AS13335 or AS15169 to view registration and announced
                  prefixes.
                </div>
              )}

              {!loading && overview && (
                <div className="space-y-4">
                  <div className="bg-card space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">ASN Number</span>
                      <span className="font-mono text-base font-bold">AS{overview.resource}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Holder / Organization</span>
                      <span className="max-w-[240px] text-right font-medium">
                        {overview.holder || "Not specified"}
                      </span>
                    </div>

                    {overview.block && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Registry Range</span>
                        <span className="font-mono text-xs">
                          {overview.block.resource} ({overview.block.desc})
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">BGP Status</span>
                      <Badge variant={overview.announced ? "default" : "secondary"}>
                        {overview.announced ? "Currently Announced" : "Not Announced"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Announced Prefixes</span>
                      <span className="font-mono font-semibold">{totalPrefixes} total</span>
                    </div>
                  </div>

                  {displayedPrefixes.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold">Announced BGP Prefixes</h3>
                        <span className="text-muted-foreground text-xs">
                          Showing {displayedPrefixes.length} of {totalPrefixes}
                        </span>
                      </div>
                      <div className="bg-muted/40 max-h-60 space-y-1 overflow-y-auto rounded-md border p-2 font-mono text-xs">
                        {displayedPrefixes.map((p) => (
                          <div
                            key={p.prefix}
                            className="bg-background/80 flex justify-between rounded border px-2 py-0.5"
                          >
                            <span>{p.prefix}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-muted-foreground border-t pt-2 text-xs">
                    Data from RIPEstat Data API (RIPE NCC)
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
