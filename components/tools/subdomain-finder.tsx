"use client"

import { useState } from "react"
import { Search, Loader2, Download, Copy, Check, Layers, ListFilter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolHeader } from "@/components/ui/tool-header"
import { findSubdomains, type SubdomainFinderResult } from "@/lib/dns-depth"
import { getToolBySlug } from "@/lib/tool-registry"

export function SubdomainFinder() {
  const tool = getToolBySlug("subdomain-finder")!
  const [domain, setDomain] = useState("github.com")
  const [filterText, setFilterText] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [result, setResult] = useState<SubdomainFinderResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!domain.trim()) {
      setError("Please enter a domain name to discover subdomains.")
      return
    }
    setLoading(true)
    setError(null)
    setFilterText("")
    try {
      const res = await findSubdomains(domain)
      setResult(res)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const filteredSubdomains =
    result?.subdomains.filter((sub) =>
      filterText.trim() ? sub.toLowerCase().includes(filterText.trim().toLowerCase()) : true
    ) ?? []

  const handleCopyAll = () => {
    if (!result) return
    const text = filteredSubdomains.join("\n")
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!result) return
    const text = filteredSubdomains.join("\n")
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${result.domain}-subdomains.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const errorId = "subdomain-finder-error"

  return (
    <div className="tool-container">
      <ToolHeader icon={Layers} title={tool.title} description={tool.description} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Certificate Transparency Search</CardTitle>
            <CardDescription>
              Discover active and historical subdomains from public certificate logs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subdomain-parent-input">Target Domain</Label>
                <div className="flex gap-2">
                  <Input
                    id="subdomain-parent-input"
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
                    <span className="ml-1.5">Find</span>
                  </Button>
                </div>
              </div>

              <div className="bg-muted text-muted-foreground space-y-1 rounded-md p-3 text-xs">
                <p className="text-foreground font-medium">Passive Reconnaissance</p>
                <p>
                  Queries CertSpotter Certificate Transparency API without sending traffic to target
                  hosts.
                </p>
                <p>Results cached for 1 hour to respect API rate limits.</p>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Discovered Subdomains</CardTitle>
              <CardDescription>
                {result
                  ? `${filteredSubdomains.length} unique subdomains found for ${result.domain}`
                  : "Subdomain list and export options"}
              </CardDescription>
            </div>
            {result && filteredSubdomains.length > 0 && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyAll} className="h-8 text-xs">
                  {copied ? (
                    <Check className="text-primary mr-1 size-3.5" />
                  ) : (
                    <Copy className="mr-1 size-3.5" />
                  )}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="h-8 text-xs"
                >
                  <Download className="mr-1 size-3.5" />
                  <span>Download</span>
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div role="status" aria-live="polite" className="space-y-4">
              {loading && (
                <div className="text-muted-foreground flex items-center justify-center py-12">
                  <Loader2 className="mr-2 size-6 animate-spin" />
                  <span>Searching Certificate Transparency issuance ledgers...</span>
                </div>
              )}

              {error && (
                <Alert variant="destructive" id={errorId}>
                  <AlertDescription id={errorId}>{error}</AlertDescription>
                </Alert>
              )}

              {!loading && !error && !result && (
                <div className="text-muted-foreground py-10 text-center text-sm">
                  Enter a domain name and click Find to discover hostnames from public CT logs.
                </div>
              )}

              {!loading && result && (
                <div className="space-y-3">
                  {result.subdomains.length > 5 && (
                    <div className="relative">
                      <ListFilter className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
                      <Input
                        type="text"
                        placeholder="Filter discovered subdomains..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="h-8 pl-8 font-mono text-xs"
                        aria-label="Filter subdomains"
                      />
                    </div>
                  )}

                  {filteredSubdomains.length > 0 ? (
                    <div className="bg-muted/30 max-h-80 space-y-1 overflow-y-auto rounded-md border p-2 font-mono text-xs">
                      {filteredSubdomains.map((sub) => (
                        <div
                          key={sub}
                          className="bg-background/80 flex justify-between rounded border p-1.5"
                        >
                          <span>{sub}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground py-4 text-center text-xs">
                      No subdomains matching filter.
                    </p>
                  )}

                  <div className="text-muted-foreground border-t pt-2 text-xs">
                    Data from CertSpotter Certificate Transparency API (SSLMate)
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
