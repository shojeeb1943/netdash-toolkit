"use client"

import { useState } from "react"
import { Route, Search, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ToolHeader } from "@/components/ui/tool-header"
import { CopyButton } from "@/components/ui/copy-button"
import {
  getNetworkInfo,
  getPrefixOverview,
  type NetworkInfoData,
  type PrefixOverviewData,
} from "@/lib/ripestat"
import { isIp, isCidr } from "@/lib/validators"
import { getToolBySlug } from "@/lib/tool-registry"

export function BgpPrefixLookup() {
  const tool = getToolBySlug("bgp-prefix-lookup")!
  const [ipInput, setIpInput] = useState("8.8.8.8")
  const [loading, setLoading] = useState(false)
  const [netInfo, setNetInfo] = useState<NetworkInfoData | null>(null)
  const [prefixOverview, setPrefixOverview] = useState<PrefixOverviewData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const clean = ipInput.trim()
    if (!isIp(clean) && !isCidr(clean)) {
      setError("Enter a valid IP address or CIDR prefix, for example 8.8.8.8 or 1.1.1.0/24.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const net = await getNetworkInfo(clean)
      setNetInfo(net)

      const targetPrefix = net.prefix || clean
      if (targetPrefix) {
        try {
          const pref = await getPrefixOverview(targetPrefix)
          setPrefixOverview(pref)
        } catch {
          // ignore prefix overview error
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
      setNetInfo(null)
      setPrefixOverview(null)
    } finally {
      setLoading(false)
    }
  }

  const errorId = "bgp-prefix-lookup-error"

  return (
    <div className="tool-container">
      <ToolHeader icon={Route} title={tool.title} description={tool.description} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>BGP Route Lookup</CardTitle>
            <CardDescription>
              Identify the covering BGP routing prefix, origin Autonomous System, and network holder
              for any IP address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bgp-ip-input">IP Address or Prefix</Label>
                <div className="flex gap-2">
                  <Input
                    id="bgp-ip-input"
                    type="text"
                    placeholder="8.8.8.8"
                    value={ipInput}
                    onChange={(e) => setIpInput(e.target.value)}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                    disabled={loading}
                    className="font-mono"
                  />
                  <Button type="submit" disabled={loading || !ipInput.trim()}>
                    {loading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Search className="size-4" />
                    )}
                    <span className="ml-1.5">Lookup Prefix</span>
                  </Button>
                </div>
              </div>

              <div className="bg-muted text-muted-foreground space-y-1 rounded-md p-3 text-xs">
                <p className="text-foreground font-medium">Routing Information</p>
                <p>Data is retrieved from the RIPEstat global routing analysis engine.</p>
                <p>
                  Shows the most specific covering route announced by global border gateway protocol
                  routers.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Prefix and ASN Details</CardTitle>
              <CardDescription>Origin autonomous systems and covering block</CardDescription>
            </div>
            {netInfo && <CopyButton value={JSON.stringify({ netInfo, prefixOverview }, null, 2)} />}
          </CardHeader>
          <CardContent>
            <div role="status" aria-live="polite" className="space-y-4">
              {loading && (
                <div className="text-muted-foreground flex items-center justify-center py-12">
                  <Loader2 className="mr-2 size-6 animate-spin" />
                  <span>Looking up BGP prefix tables...</span>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription id={errorId}>{error}</AlertDescription>
                </Alert>
              )}

              {!loading && !error && !netInfo && (
                <div className="text-muted-foreground py-10 text-center text-sm">
                  Enter an IP address to inspect its origin ASN and covering BGP prefix.
                </div>
              )}

              {!loading && netInfo && (
                <div className="space-y-4">
                  <div className="bg-card space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Covering Prefix</span>
                      <span className="font-mono text-base font-bold">
                        {netInfo.prefix || "Not found"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Origin ASN</span>
                      <span className="font-mono font-semibold">
                        {netInfo.asns && netInfo.asns.length > 0
                          ? netInfo.asns.map((a) => `AS${a.replace(/^as/i, "")}`).join(", ")
                          : "None"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Network Holder</span>
                      <span className="max-w-[240px] text-right font-medium">
                        {netInfo.holder || "Not available"}
                      </span>
                    </div>

                    {prefixOverview && (
                      <>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Announcement Status</span>
                          <Badge variant={prefixOverview.announced ? "default" : "secondary"}>
                            {prefixOverview.announced ? "Announced in BGP" : "Unannounced"}
                          </Badge>
                        </div>

                        {prefixOverview.block && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Allocated Block</span>
                            <span className="font-mono text-xs">
                              {prefixOverview.block.resource}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

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
