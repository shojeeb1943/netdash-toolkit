"use client"

import { useState } from "react"
import { CalendarClock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolHeader } from "@/components/ui/tool-header"
import { ageFrom, checkDomain } from "@/lib/domain-rdap"
import { isDomain } from "@/lib/generators"

function describe(created: Date) {
  const now = new Date()
  if (created.getTime() > now.getTime()) return "That date is in the future."
  const a = ageFrom(created, now)
  return `${a.years} years, ${a.months} months, ${a.days} days (${a.totalDays.toLocaleString("en-US")} days in total)`
}

export function DomainAgeCalculator() {
  const [domain, setDomain] = useState("")
  const [date, setDate] = useState("")
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState("")
  const clean = domain.trim().toLowerCase()
  const invalid = clean !== "" && !isDomain(clean)

  async function lookup() {
    setBusy(true)
    setNote("")
    const result = await checkDomain(clean)
    if (result.state === "registered" && result.created) {
      setDate(result.created.slice(0, 10))
      setNote(`Registration date read from the RDAP record for ${clean}.`)
    } else if (result.state === "likely-available") {
      setNote(
        "No RDAP record found: the domain may be unregistered, or its registry publishes no RDAP data. Enter the date by hand."
      )
    } else if (result.state === "error") {
      setNote("The lookup failed. Enter the registration date by hand.")
    } else {
      setNote("The record has no registration date. Enter it by hand.")
    }
    setBusy(false)
  }

  const created = date ? new Date(`${date}T00:00:00`) : null
  const valid = created && !Number.isNaN(created.getTime())

  return (
    <div className="tool-container">
      <ToolHeader
        icon={CalendarClock}
        title="Domain Age Calculator"
        description="Find how old a domain is from its public registration record"
      />

      <Alert>
        <AlertDescription>
          The optional lookup sends only the domain name to rdap.org, and on to the registry. You
          can also type the registration date yourself and nothing is sent.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Domain</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domain-age-domain">Domain (optional, for the lookup)</Label>
            <div className="flex gap-2">
              <Input
                id="domain-age-domain"
                value={domain}
                placeholder="example.com"
                aria-invalid={invalid || undefined}
                onChange={(e) => setDomain(e.target.value)}
              />
              <Button onClick={lookup} disabled={!clean || invalid || busy}>
                {busy ? "Looking up..." : "Look up"}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="domain-age-date">Registration date</Label>
            <Input
              id="domain-age-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div aria-live="polite" className="space-y-2">
            {note && <p className="text-muted-foreground text-sm">{note}</p>}
            {valid && <p className="text-lg font-semibold">{describe(created)}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
