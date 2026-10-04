"use client"

import { useState } from "react"
import { Globe, RefreshCw, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolHeader } from "@/components/ui/tool-header"
import { CopyButton } from "@/components/ui/copy-button"
import { getIpGeo, type IpWhoisResponse } from "@/lib/ipwhois"
import { getToolBySlug } from "@/lib/tool-registry"

export function MyIpAddress() {
  const tool = getToolBySlug("my-ip-address")!
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<IpWhoisResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchMyIp = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getIpGeo()
      setData(res)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const errorId = "my-ip-address-error"

  return (
    <div className="tool-container">
      <ToolHeader icon={Globe} title={tool.title} description={tool.description} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Public Connection</CardTitle>
            <CardDescription>
              Shows your current public IPv4 or IPv6 address as seen by web servers on the internet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/30 space-y-3 rounded-xl border p-6 text-center">
              <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Public IP Address
              </p>
              <div className="text-primary font-mono text-2xl font-bold tracking-tight break-all sm:text-3xl">
                {loading ? (
                  <div className="flex items-center justify-center gap-2 py-1">
                    <Loader2 className="text-muted-foreground size-6 animate-spin" />
                    <span className="text-muted-foreground text-base font-normal">
                      Detecting IP...
                    </span>
                  </div>
                ) : data?.ip ? (
                  data.ip
                ) : (
                  "Not detected"
                )}
              </div>
              {!data?.ip && !loading && (
                <div className="flex justify-center pt-2">
                  <Button onClick={fetchMyIp}>Detect my IP address</Button>
                </div>
              )}
              {data?.ip && (
                <div className="flex justify-center gap-2 pt-2">
                  <CopyButton value={data.ip} />
                  <Button variant="outline" size="sm" onClick={fetchMyIp} disabled={loading}>
                    <RefreshCw className={`mr-1.5 size-3.5 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-muted text-muted-foreground space-y-1 rounded-md p-3 text-xs">
              <p className="text-foreground font-medium">Privacy Note</p>
              <p>Your IP address is requested via ipwho.is (with ipify as fallback).</p>
              <p>No browsing activity or personally identifiable information is stored.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Network and Location Details</CardTitle>
              <CardDescription>ISP, estimated city, country, and timezone</CardDescription>
            </div>
            {data && <CopyButton value={JSON.stringify(data, null, 2)} />}
          </CardHeader>
          <CardContent>
            <div role="status" aria-live="polite" className="space-y-4">
              {loading && !data && (
                <div className="text-muted-foreground flex items-center justify-center py-12">
                  <Loader2 className="mr-2 size-6 animate-spin" />
                  <span>Detecting network connection details...</span>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription id={errorId}>{error}</AlertDescription>
                </Alert>
              )}

              {data && (
                <div className="space-y-4">
                  <div className="bg-card space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Country</span>
                      <span className="font-medium">
                        {data.country || "Unknown"}{" "}
                        {data.country_code ? `(${data.country_code})` : ""}
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

                    {data.timezone && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Local Timezone</span>
                        <span className="font-mono text-xs">
                          {data.timezone.id} ({data.timezone.utc})
                        </span>
                      </div>
                    )}

                    {data.connection && (
                      <>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">ISP</span>
                          <span className="max-w-[200px] text-right font-medium">
                            {data.connection.isp || data.connection.org || "Unknown"}
                          </span>
                        </div>

                        {data.connection.asn && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Autonomous System</span>
                            <span className="font-mono">AS{data.connection.asn}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="text-muted-foreground border-t pt-2 text-xs">
                    Data from ipwho.is and api.ipify.org
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
