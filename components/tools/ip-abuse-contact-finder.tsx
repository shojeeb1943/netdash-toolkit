"use client"

import { useState } from "react"
import { ShieldAlert, Search, Loader2, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolHeader } from "@/components/ui/tool-header"
import { CopyButton } from "@/components/ui/copy-button"
import { getAbuseContact, type AbuseContactFinderData } from "@/lib/ripestat"
import { isIp, isCidr } from "@/lib/validators"
import { getToolBySlug } from "@/lib/tool-registry"

export function IpAbuseContactFinder() {
  const tool = getToolBySlug("ip-abuse-contact-finder")!
  const [resourceInput, setResourceInput] = useState("1.1.1.1")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<AbuseContactFinderData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const clean = resourceInput.trim()
    if (!isIp(clean) && !isCidr(clean)) {
      setError("Enter a valid IPv4, IPv6 address, or CIDR prefix (e.g. 1.1.1.1 or 8.8.8.0/24).")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await getAbuseContact(clean)
      setData(res)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const errorId = "ip-abuse-contact-finder-error"
  const contacts = data?.abuse_contacts ?? []

  return (
    <div className="tool-container">
      <ToolHeader icon={ShieldAlert} title={tool.title} description={tool.description} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Abuse Contact Lookup</CardTitle>
            <CardDescription>
              Find the verified abuse reporting email addresses and regional internet registry for
              any IP address or prefix.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="abuse-ip-input">IP Address or CIDR Prefix</Label>
                <div className="flex gap-2">
                  <Input
                    id="abuse-ip-input"
                    type="text"
                    placeholder="1.1.1.1"
                    value={resourceInput}
                    onChange={(e) => setResourceInput(e.target.value)}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                    disabled={loading}
                    className="font-mono"
                  />
                  <Button type="submit" disabled={loading || !resourceInput.trim()}>
                    {loading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Search className="size-4" />
                    )}
                    <span className="ml-1.5">Find Abuse Contacts</span>
                  </Button>
                </div>
              </div>

              <div className="bg-muted text-muted-foreground space-y-1 rounded-md p-3 text-xs">
                <p className="text-foreground font-medium">Notice</p>
                <p>Queries are sent to the RIPEstat abuse contact finder service.</p>
                <p>
                  Use these contacts exclusively to report network abuse, spam, DDoS, phishing, or
                  security incidents.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Responsible Abuse Contacts</CardTitle>
              <CardDescription>Network authority and reporting mailbox</CardDescription>
            </div>
            {contacts.length > 0 && <CopyButton value={contacts.join(", ")} />}
          </CardHeader>
          <CardContent>
            <div role="status" aria-live="polite" className="space-y-4">
              {loading && (
                <div className="text-muted-foreground flex items-center justify-center py-12">
                  <Loader2 className="mr-2 size-6 animate-spin" />
                  <span>Querying RIR database for abuse contacts...</span>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription id={errorId}>{error}</AlertDescription>
                </Alert>
              )}

              {!loading && !error && !data && (
                <div className="text-muted-foreground py-10 text-center text-sm">
                  Enter an IP address or network prefix to find the official abuse reporting
                  contact.
                </div>
              )}

              {!loading && data && (
                <div className="space-y-4">
                  <div className="bg-card space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Queried Resource</span>
                      <span className="font-mono font-bold">
                        {data.parameters?.resource || resourceInput}
                      </span>
                    </div>

                    {data.authorities && data.authorities.length > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Authoritative RIR</span>
                        <span className="font-mono font-semibold uppercase">
                          {data.authorities.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="flex items-center gap-1.5 text-sm font-semibold">
                      <Mail className="text-muted-foreground size-4" />
                      <span>Official Abuse Contact Emails</span>
                    </h3>

                    {contacts.length === 0 ? (
                      <div className="text-muted-foreground bg-muted rounded p-3 text-sm">
                        No dedicated abuse email found in the registry for this network.
                      </div>
                    ) : (
                      <div className="space-y-2 font-mono text-sm">
                        {contacts.map((email) => (
                          <div
                            key={email}
                            className="bg-muted/60 flex items-center justify-between rounded-md border p-3"
                          >
                            <a
                              href={`mailto:${email}`}
                              className="text-primary font-medium underline"
                            >
                              {email}
                            </a>
                            <CopyButton value={email} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="text-muted-foreground border-t pt-2 text-xs">
                    Data from RIPEstat Abuse Contact Finder (RIPE NCC)
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
