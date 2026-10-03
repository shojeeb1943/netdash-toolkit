"use client"

import { useState } from "react"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolHeader } from "@/components/ui/tool-header"
import { CANDIDATE_TLDS, checkDomain, normalizeLabel, type Availability } from "@/lib/domain-rdap"

export function DomainAvailabilityChecker() {
  const [name, setName] = useState("")
  const [rows, setRows] = useState<{ domain: string; result?: Availability }[]>([])
  const [busy, setBusy] = useState(false)
  const label = normalizeLabel(name)
  const invalid = name.trim() !== "" && label === ""

  async function run() {
    if (!label) return
    const domains = CANDIDATE_TLDS.map((t) => `${label}.${t}`)
    setRows(domains.map((domain) => ({ domain })))
    setBusy(true)
    // three at a time: rdap.org is a free public service, so do not hammer it
    for (let i = 0; i < domains.length; i += 3) {
      const batch = domains.slice(i, i + 3)
      const results = await Promise.all(batch.map(checkDomain))
      setRows((prev) =>
        prev.map((row) => {
          const at = batch.indexOf(row.domain)
          return at === -1 ? row : { ...row, result: results[at] }
        })
      )
    }
    setBusy(false)
  }

  return (
    <div className="tool-container">
      <ToolHeader
        icon={Globe}
        title="Domain Availability Checker"
        description="Check a name across 12 popular extensions using public RDAP records"
      />

      <Alert>
        <AlertDescription>
          Only the domain names you check are sent, to rdap.org and then to the registry that
          answers. A registry that publishes no RDAP data looks the same as a free name, so
          &ldquo;likely available&rdquo; always needs a final check at a registrar.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Name</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domain-availability-name">Name without extension</Label>
            <div className="flex gap-2">
              <Input
                id="domain-availability-name"
                value={name}
                placeholder="mybrand"
                aria-invalid={invalid || undefined}
                aria-describedby={invalid ? "domain-availability-error" : undefined}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !busy && run()}
              />
              <Button onClick={run} disabled={!label || busy}>
                {busy ? "Checking..." : "Check"}
              </Button>
            </div>
            {invalid && (
              <p id="domain-availability-error" className="text-destructive text-sm">
                Use letters, numbers and hyphens.
              </p>
            )}
          </div>

          <p className="text-muted-foreground text-sm">
            Extensions checked:{" "}
            {CANDIDATE_TLDS.map((t) => (
              <span
                key={t}
                className="bg-muted mr-1 inline-block rounded px-1.5 py-0.5 font-mono text-xs"
              >
                .{t}
              </span>
            ))}
          </p>

          <div aria-live="polite">
            {rows.length > 0 && (
              <ul className="divide-y rounded-md border">
                {rows.map(({ domain, result }) => (
                  <li
                    key={domain}
                    className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm"
                  >
                    <span className="font-mono">{domain}</span>
                    <span className="text-muted-foreground">
                      {!result && "Checking..."}
                      {result?.state === "registered" &&
                        `Registered${result.expires ? `, expires ${result.expires.slice(0, 10)}` : ""}${result.registrar ? `, ${result.registrar}` : ""}`}
                      {result?.state === "likely-available" &&
                        "Likely available: confirm at a registrar"}
                      {result?.state === "error" && "Could not check (try again later)"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
