"use client"

import { useState, useEffect, useId, useCallback } from "react"
import { DollarSign, ArrowRightLeft, RefreshCw, Info, ExternalLink } from "lucide-react"
import {
  fetchExchangeRates,
  convertAmount,
  COMMON_CURRENCIES,
  type ExchangeRateData,
} from "@/lib/currency-rates"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ToolHeader } from "@/components/ui/tool-header"
import { getToolBySlug } from "@/lib/tool-registry"

export function HostingPriceCurrencyConverter() {
  const tool = getToolBySlug("hosting-price-currency-converter")!
  const [amount, setAmount] = useState<number>(10)
  const [fromCurrency, setFromCurrency] = useState<string>("USD")
  const [toCurrency, setToCurrency] = useState<string>("BDT")
  const [ratesData, setRatesData] = useState<ExchangeRateData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [lastCalculated, setLastCalculated] = useState<Date | null>(null)

  const amountId = useId()
  const fromCurrencyId = useId()
  const toCurrencyId = useId()
  const errorId = useId()

  const loadRates = useCallback(async (base: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchExchangeRates(base)
      setRatesData(data)
      setLastCalculated(new Date())
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load exchange rates"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRates(fromCurrency)
  }, [fromCurrency, loadRates])

  const handleSwap = () => {
    const nextFrom = toCurrency
    const nextTo = fromCurrency
    setFromCurrency(nextFrom)
    setToCurrency(nextTo)
  }

  const rates = ratesData?.rates || {}
  const { converted, rate } = ratesData
    ? convertAmount(amount, fromCurrency, toCurrency, rates, ratesData.base_code)
    : { converted: 0, rate: 0 }

  const allCurrencyCodes = Array.from(
    new Set([...COMMON_CURRENCIES.map((c) => c.code), ...Object.keys(rates)])
  ).sort()

  const findName = (code: string) => {
    const match = COMMON_CURRENCIES.find((c) => c.code === code)
    return match ? `${code} - ${match.name}` : code
  }

  return (
    <div className="tool-container space-y-6">
      <ToolHeader
        icon={DollarSign}
        title={tool ? tool.title : "Hosting Price Currency Converter"}
        description={
          tool
            ? tool.description
            : "Convert hosting, server, and cloud infrastructure pricing across global currencies."
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Hosting Currency Calculation</CardTitle>
          <CardDescription>
            Enter your monthly or annual hosting package cost and choose target currencies.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              loadRates(fromCurrency)
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor={amountId} className="mb-1.5 block">
                  Hosting Amount
                </Label>
                <Input
                  id={amountId}
                  type="number"
                  min="0.01"
                  step="any"
                  value={amount || ""}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  aria-describedby={error ? errorId : undefined}
                  required
                />
              </div>

              <div>
                <Label htmlFor={fromCurrencyId} className="mb-1.5 block">
                  From Currency
                </Label>
                <select
                  id={fromCurrencyId}
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="border-input bg-background focus:ring-primary w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                >
                  {allCurrencyCodes.map((code) => (
                    <option key={`from-${code}`} value={code}>
                      {findName(code)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <Label htmlFor={toCurrencyId}>To Currency</Label>
                  <button
                    type="button"
                    onClick={handleSwap}
                    aria-label="Swap currencies"
                    className="text-primary flex min-h-6 items-center gap-1 text-xs hover:underline"
                  >
                    <ArrowRightLeft className="h-3 w-3" />
                    Swap
                  </button>
                </div>
                <select
                  id={toCurrencyId}
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="border-input bg-background focus:ring-primary w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                >
                  {allCurrencyCodes.map((code) => (
                    <option key={`to-${code}`} value={code}>
                      {findName(code)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <Button type="submit" disabled={loading} className="gap-2">
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Updating Rates..." : "Convert Price"}
              </Button>
              <span className="text-muted-foreground text-xs">
                Rate data is cached for 6 hours in your browser.
              </span>
            </div>
          </form>

          <div role="status" aria-live="polite" className="mt-4">
            {error && (
              <div
                id={errorId}
                className="bg-destructive/10 text-destructive rounded-md p-3 text-sm"
              >
                {error}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {ratesData && (
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="bg-muted/40 border-border rounded-lg border p-4">
                <span className="text-muted-foreground block font-mono text-xs uppercase">
                  Original Price ({fromCurrency})
                </span>
                <span className="text-foreground font-mono text-2xl font-bold">
                  {amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  {fromCurrency}
                </span>
              </div>

              <div className="bg-primary/10 border-primary/20 rounded-lg border p-4">
                <span className="text-primary block font-mono text-xs uppercase">
                  Converted Amount ({toCurrency})
                </span>
                <span className="text-primary font-mono text-2xl font-bold">
                  {converted.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  {toCurrency}
                </span>
              </div>
            </div>

            <div className="text-muted-foreground grid grid-cols-1 gap-4 text-xs md:grid-cols-3">
              <div>
                <span className="text-foreground block font-medium">Exchange Rate:</span>
                <span>
                  1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
                </span>
              </div>
              <div>
                <span className="text-foreground block font-medium">Provider Update:</span>
                <span>{ratesData.time_last_update_utc || "Recent"}</span>
              </div>
              <div>
                <span className="text-foreground block font-medium">Calculation Time:</span>
                <span>{lastCalculated ? lastCalculated.toLocaleTimeString() : "Recent"}</span>
              </div>
            </div>

            <div className="bg-muted text-muted-foreground space-y-1 rounded-md p-3 text-xs">
              <div className="text-foreground flex items-center gap-1.5 font-medium">
                <Info className="text-primary h-4 w-4" />
                <span>Indicative Exchange Rate Notice</span>
              </div>
              <p>
                Rates are indicative, not bank rates. Final credit card billing and gateway
                conversions may include issuer markups, cross-border handling fees, or local tax
                levies.
              </p>
              <div className="pt-1">
                <a
                  href="https://www.exchangerate-api.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary inline-flex items-center gap-1 hover:underline"
                >
                  Rates By Exchange Rate API
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Global Multi-Currency</CardTitle>
            <CardDescription className="text-xs">
              Support for over 160 fiat currencies including USD, EUR, GBP, BDT, INR, CAD, and AUD.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Instant Mid-Market Rates</CardTitle>
            <CardDescription className="text-xs">
              Direct API integration with 6-hour caching ensures fast, reliable price checks without
              rate throttling.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Server and Cloud Costing</CardTitle>
            <CardDescription className="text-xs">
              Plan your hosting budgets accurately for dedicated servers, VPS slices, and software
              licensing stacks.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
