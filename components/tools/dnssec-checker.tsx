"use client"

import { useState } from "react"
import {
  Shield,
  Search,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ToolHeader } from "@/components/ui/tool-header"
import { CopyButton } from "@/components/ui/copy-button"
import { checkDnssec, type DnssecCheckResult } from "@/lib/dns-depth"
import { getToolBySlug } from "@/lib/tool-registry"

export function DnssecChecker() {
  const tool = getToolBySlug("dnssec-checker")!
  const [domain, setDomain] = useState("cloudflare.com")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DnssecCheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!domain.trim()) {
      setError("Please enter a domain name to inspect.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await checkDnssec(domain)
      setResult(res)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const errorId = "dnssec-checker-error"

  return (
    <div className="tool-container">
      <ToolHeader icon={Shield} title={tool.title} description={tool.description} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>DNSSEC Domain Query</CardTitle>
            <CardDescription>
              Validate DS and DNSKEY records and check Authenticated Data status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCheck} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dnssec-domain-input">Domain Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="dnssec-domain-input"
                    type="text"
                    placeholder="e.g. cloudflare.com or icann.org"
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
                    <span className="ml-1.5">Check</span>
                  </Button>
                </div>
              </div>

              <div className="bg-muted text-muted-foreground space-y-1 rounded-md p-3 text-xs">
                <p className="text-foreground font-medium">DNSSEC Verification Scope</p>
                <p>
                  Queries DNS over HTTPS (dns.google) with the DNSSEC OK (DO) bit set to inspect
                  validation status.
                </p>
                <p>Input is sent to dns.google via secure encrypted DNS queries.</p>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>DNSSEC Status &amp; Records</CardTitle>
              <CardDescription>Validation verdict and cryptographic records</CardDescription>
            </div>
            {result && <CopyButton value={JSON.stringify(result, null, 2)} />}
          </CardHeader>
          <CardContent>
            <div role="status" aria-live="polite" className="space-y-4">
              {loading && (
                <div className="text-muted-foreground flex items-center justify-center py-12">
                  <Loader2 className="mr-2 size-6 animate-spin" />
                  <span>Querying DS, DNSKEY, and Authenticated Data flags...</span>
                </div>
              )}

              {error && (
                <Alert variant="destructive" id={errorId}>
                  <AlertDescription id={errorId}>{error}</AlertDescription>
                </Alert>
              )}

              {!loading && !error && !result && (
                <div className="text-muted-foreground py-10 text-center text-sm">
                  Enter a domain name and click Check to evaluate DNSSEC configuration.
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
                      <span className="text-muted-foreground text-sm">DNSSEC Verdict</span>
                      <Badge
                        variant={
                          result.status === "secure"
                            ? "default"
                            : result.status === "bogus"
                              ? "destructive"
                              : "secondary"
                        }
                        className="flex items-center gap-1"
                      >
                        {result.status === "secure" && <CheckCircle2 className="size-3.5" />}
                        {result.status === "bogus" && <XCircle className="size-3.5" />}
                        {result.status === "insecure" && <AlertTriangle className="size-3.5" />}
                        {result.status === "indeterminate" && <HelpCircle className="size-3.5" />}
                        <span>{result.statusLabel}</span>
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Authenticated Data (AD Flag)</span>
                      <span className="font-mono font-semibold">
                        {result.authenticatedData ? "Yes (Set by Resolver)" : "No"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Delegation Signer (DS)</span>
                      <span className="font-mono">
                        {result.hasDs ? `${result.dsRecords.length} record(s)` : "None"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">DNS Key (DNSKEY)</span>
                      <span className="font-mono">
                        {result.hasDnskey ? `${result.dnskeyRecords.length} record(s)` : "None"}
                      </span>
                    </div>

                    <div className="bg-muted text-muted-foreground rounded p-2.5 text-xs">
                      <p>{result.explanation}</p>
                    </div>
                  </div>

                  {result.dsRecords.length > 0 && (
                    <div className="space-y-1.5">
                      <h3 className="text-foreground text-xs font-semibold">
                        DS Records (Parent Zone)
                      </h3>
                      <div className="max-h-36 space-y-1 overflow-y-auto font-mono text-xs">
                        {result.dsRecords.map((r, i) => (
                          <div key={i} className="bg-muted/40 rounded border p-2 break-all">
                            <span className="text-muted-foreground">TTL {r.TTL}: </span>
                            <span>{r.data}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.dnskeyRecords.length > 0 && (
                    <div className="space-y-1.5">
                      <h3 className="text-foreground text-xs font-semibold">
                        DNSKEY Records (Apex Zone)
                      </h3>
                      <div className="max-h-36 space-y-1 overflow-y-auto font-mono text-xs">
                        {result.dnskeyRecords.map((r, i) => (
                          <div key={i} className="bg-muted/40 rounded border p-2 break-all">
                            <span className="text-muted-foreground">TTL {r.TTL}: </span>
                            <span>{r.data}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-muted-foreground border-t pt-2 text-xs">
                    Data from Google Public DNS over HTTPS (dns.google)
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
