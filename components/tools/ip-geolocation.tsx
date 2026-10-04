"use client"

import { useState } from "react"
import { Globe2, Search, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolHeader } from "@/components/ui/tool-header"
import { CopyButton } from "@/components/ui/copy-button"
import { getIpGeo, type IpWhoisResponse } from "@/lib/ipwhois"
import { isIp } from "@/lib/validators"
import { getToolBySlug } from "@/lib/tool-registry"

export function IpGeolocation() {
  const tool = getToolBySlug("ip-geolocation")!
  const [ipInput, setIpInput] = useState("8.8.8.8")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<IpWhoisResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const clean = ipInput.trim()
    if (!isIp(clean)) {
      setError("Enter a valid IPv4 or IPv6 address, for example 8.8.8.8 or 2001:4860:4860::8888.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await getIpGeo(clean)
      setData(res)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const errorId = "ip-geolocation-error"

  return (
    <div className="tool-container">
      <ToolHeader icon={Globe2} title={tool.title} description={tool.description} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>IP Location Lookup</CardTitle>
            <CardDescription>
              Look up approximate geographic location, internet service provider, Autonomous System,
              and timezone for any IP.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="geo-ip-input">Target IP Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="geo-ip-input"
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
                    <span className="ml-1.5">Locate</span>
                  </Button>
                </div>
              </div>

              <div className="bg-muted text-muted-foreground space-y-1 rounded-md p-3 text-xs">
                <p className="text-foreground font-medium">Accuracy Notice</p>
                <p>
                  IP geolocation is estimated based on regional internet registry assignments and
                  network routing.
                </p>
                <p>
                  Location data is approximate and typically reflects the ISP point of presence
                  rather than physical user location.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Location Report</CardTitle>
              <CardDescription>Geographic and network provider estimates</CardDescription>
            </div>
            {data && <CopyButton value={JSON.stringify(data, null, 2)} />}
          </CardHeader>
          <CardContent>
            <div role="status" aria-live="polite" className="space-y-4">
              {loading && (
                <div className="text-muted-foreground flex items-center justify-center py-12">
                  <Loader2 className="mr-2 size-6 animate-spin" />
                  <span>Fetching geolocation data...</span>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription id={errorId}>{error}</AlertDescription>
                </Alert>
              )}

              {!loading && !error && !data && (
                <div className="text-muted-foreground py-10 text-center text-sm">
                  Enter an IP address to view geographic location and ISP details.
                </div>
              )}

              {!loading && data && (
                <div className="space-y-4">
                  <div className="bg-card space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">IP Address</span>
                      <span className="font-mono font-bold">{data.ip}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Country</span>
                      <span className="font-medium">
                        {data.country} {data.country_code ? `(${data.country_code})` : ""}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Region / State</span>
                      <span>{data.region || "Unknown"}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">City</span>
                      <span>{data.city || "Unknown"}</span>
                    </div>

                    {data.postal && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Postal Code</span>
                        <span className="font-mono">{data.postal}</span>
                      </div>
                    )}

                    {data.timezone && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Timezone</span>
                        <span className="font-mono text-xs">
                          {data.timezone.id} ({data.timezone.utc})
                        </span>
                      </div>
                    )}
                  </div>

                  {data.connection && (
                    <div className="bg-card space-y-3 rounded-lg border p-4">
                      <h3 className="text-sm font-semibold">Network Connection</h3>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">ISP / Organization</span>
                        <span className="max-w-[220px] text-right font-medium">
                          {data.connection.isp || data.connection.org || "Unknown"}
                        </span>
                      </div>

                      {data.connection.asn && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">ASN</span>
                          <span className="font-mono">AS{data.connection.asn}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-muted-foreground border-t pt-2 text-xs">
                    Data from ipwho.is Geolocation API
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
