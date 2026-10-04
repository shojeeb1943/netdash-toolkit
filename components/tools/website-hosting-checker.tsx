"use client"

import { useState } from "react"
import { Server, Search, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ToolHeader } from "@/components/ui/tool-header"
import { CopyButton } from "@/components/ui/copy-button"
import { checkWebsiteHosting, type HostingCheckResult } from "@/lib/hosting-intel"
import { getToolBySlug } from "@/lib/tool-registry"

export function WebsiteHostingChecker() {
  const tool = getToolBySlug("website-hosting-checker")!
  const [domain, setDomain] = useState("example.com")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<HostingCheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!domain.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await checkWebsiteHosting(domain)
      setResult(res)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const errorId = "website-hosting-checker-error"

  return (
    <div className="tool-container">
      <ToolHeader icon={Server} title={tool.title} description={tool.description} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Domain Lookup</CardTitle>
            <CardDescription>
              Enter a domain to discover its hosting provider, IP addresses, nameservers, and ASN
              details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hosting-domain-input">Website Domain</Label>
                <div className="flex gap-2">
                  <Input
                    id="hosting-domain-input"
                    type="text"
                    placeholder="example.com"
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
                    <span className="ml-1.5">Inspect</span>
                  </Button>
                </div>
              </div>

              <div className="bg-muted text-muted-foreground space-y-1 rounded-md p-3 text-xs">
                <p className="text-foreground font-medium">Notice and Privacy</p>
                <p>
                  Queries are sent via public DNS over HTTPS (dns.google) and RIPEstat Data API.
                </p>
                <p>
                  Sites fronted by a reverse proxy or CDN (such as Cloudflare or Fastly) conceal
                  their actual origin hosting provider.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Hosting Analysis</CardTitle>
              <CardDescription>Detected infrastructure and network provider</CardDescription>
            </div>
            {result && <CopyButton value={JSON.stringify(result, null, 2)} />}
          </CardHeader>
          <CardContent>
            <div role="status" aria-live="polite" className="space-y-4">
              {loading && (
                <div className="text-muted-foreground flex items-center justify-center py-12">
                  <Loader2 className="mr-2 size-6 animate-spin" />
                  <span>Querying DNS and RIPEstat routing databases...</span>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription id={errorId}>{error}</AlertDescription>
                </Alert>
              )}

              {!loading && !error && !result && (
                <div className="text-muted-foreground py-10 text-center text-sm">
                  Enter a domain and click Inspect to view hosting infrastructure details.
                </div>
              )}

              {!loading && result && (
                <div className="space-y-4">
                  <div className="bg-card space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Likely Host / Network</span>
                      <Badge variant={result.isCdnFronted ? "secondary" : "default"}>
                        {result.likelyHost}
                      </Badge>
                    </div>

                    {result.asn && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Autonomous System</span>
                        <span className="font-mono font-medium">
                          AS{result.asn} {result.holder ? `(${result.holder})` : ""}
                        </span>
                      </div>
                    )}

                    {result.prefix && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">BGP Prefix</span>
                        <span className="font-mono">{result.prefix}</span>
                      </div>
                    )}

                    {result.note && (
                      <div className="bg-muted text-muted-foreground rounded p-2.5 text-xs">
                        <p>{result.note}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold">Resolved IP Addresses</h3>
                    <div className="space-y-1 font-mono text-xs">
                      {result.ipv4Addresses.map((ip) => (
                        <div
                          key={ip}
                          className="bg-muted/60 flex items-center justify-between rounded px-3 py-1.5"
                        >
                          <span>{ip} (IPv4)</span>
                          {result.ptrRecords[ip] && (
                            <span className="text-muted-foreground max-w-[200px] truncate">
                              PTR: {result.ptrRecords[ip]}
                            </span>
                          )}
                        </div>
                      ))}
                      {result.ipv6Addresses.map((ip) => (
                        <div
                          key={ip}
                          className="bg-muted/60 flex items-center justify-between rounded px-3 py-1.5"
                        >
                          <span className="max-w-[220px] truncate">{ip} (IPv6)</span>
                          {result.ptrRecords[ip] && (
                            <span className="text-muted-foreground max-w-[180px] truncate">
                              PTR: {result.ptrRecords[ip]}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {result.nameservers.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold">Authoritative Nameservers</h3>
                      <ul className="text-muted-foreground list-inside list-disc space-y-1 font-mono text-xs">
                        {result.nameservers.map((ns) => (
                          <li key={ns}>{ns}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="text-muted-foreground border-t pt-2 text-xs">
                    Data from Google DNS over HTTPS and RIPEstat Data API
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
