"use client"

import { useState, useEffect, useId, useCallback } from "react"
import { Layers, RefreshCw, Info, ExternalLink } from "lucide-react"
import {
  fetchExchangeRates,
  convertAmount,
  LICENSE_TIERS,
  COMMON_CURRENCIES,
  type ExchangeRateData,
} from "@/lib/currency-rates"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ToolHeader } from "@/components/ui/tool-header"
import { getToolBySlug } from "@/lib/tool-registry"

export function LicensePriceCurrencyConverter() {
  const tool = getToolBySlug("license-price-currency-converter")!
  const [selectedTierId, setSelectedTierId] = useState<string>("cpanel-vps")
  const [billingMonths, setBillingMonths] = useState<number>(1)
  const [toCurrency, setToCurrency] = useState<string>("BDT")
  const [ratesData, setRatesData] = useState<ExchangeRateData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [lastCalculated, setLastCalculated] = useState<Date | null>(null)

  const tierId = useId()
  const periodId = useId()
  const currencyId = useId()
  const errorId = useId()

  const loadRates = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchExchangeRates("USD")
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
    loadRates()
  }, [loadRates])

  const selectedTier = LICENSE_TIERS.find((t) => t.id === selectedTierId) || LICENSE_TIERS[0]
  const baseUsdPrice = selectedTier.isOneTime
    ? selectedTier.monthlyUsd
    : selectedTier.monthlyUsd * billingMonths

  const rates = ratesData?.rates || {}
  const { converted, rate } = ratesData
    ? convertAmount(baseUsdPrice, "USD", toCurrency, rates, "USD")
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
        icon={Layers}
        title={tool ? tool.title : "License Price Currency Converter"}
        description={
          tool
            ? tool.description
            : "Calculate software license pricing for cPanel, Plesk, LiteSpeed, WHMCS, and CloudLinux in local currencies."
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Wholesale License Configuration</CardTitle>
          <CardDescription>
            Select a software license product tier, choose billing duration, and convert into your
            local currency.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              loadRates()
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor={tierId} className="mb-1.5 block">
                  License Product and Tier
                </Label>
                <select
                  id={tierId}
                  value={selectedTierId}
                  onChange={(e) => setSelectedTierId(e.target.value)}
                  className="border-input bg-background focus:ring-primary w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                >
                  {LICENSE_TIERS.map((tier) => (
                    <option key={tier.id} value={tier.id}>
                      {tier.product}: {tier.name} (${tier.monthlyUsd.toFixed(2)}
                      {tier.isOneTime ? " one-time" : "/mo"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor={periodId} className="mb-1.5 block">
                  Billing Period
                </Label>
                <select
                  id={periodId}
                  value={billingMonths}
                  disabled={selectedTier.isOneTime}
                  onChange={(e) => setBillingMonths(parseInt(e.target.value, 10) || 1)}
                  className="border-input bg-background focus:ring-primary w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none disabled:opacity-50"
                >
                  <option value={1}>1 Month (Monthly)</option>
                  <option value={3}>3 Months (Quarterly)</option>
                  <option value={6}>6 Months (Semi-Annual)</option>
                  <option value={12}>12 Months (1 Year)</option>
                  <option value={24}>24 Months (2 Years)</option>
                </select>
              </div>

              <div>
                <Label htmlFor={currencyId} className="mb-1.5 block">
                  Target Currency
                </Label>
                <select
                  id={currencyId}
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="border-input bg-background focus:ring-primary w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                >
                  {allCurrencyCodes.map((code) => (
                    <option key={`license-${code}`} value={code}>
                      {findName(code)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <Button type="submit" disabled={loading} className="gap-2">
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Updating Rates..." : "Recalculate Price"}
              </Button>
              <span className="text-muted-foreground text-xs">
                Based on wholesale LicenBase tier catalog pricing.
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
                  USD Wholesale Price ({selectedTier.name})
                </span>
                <span className="text-foreground font-mono text-2xl font-bold">
                  ${baseUsdPrice.toFixed(2)} USD
                </span>
                <span className="text-muted-foreground mt-1 block text-xs">
                  {selectedTier.isOneTime
                    ? "One-time lifetime owned license"
                    : `$${selectedTier.monthlyUsd.toFixed(2)}/mo for ${billingMonths} month${billingMonths > 1 ? "s" : ""}`}
                </span>
              </div>

              <div className="bg-primary/10 border-primary/20 rounded-lg border p-4">
                <span className="text-primary block font-mono text-xs uppercase">
                  Estimated Price in {toCurrency}
                </span>
                <span className="text-primary font-mono text-2xl font-bold">
                  {converted.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  {toCurrency}
                </span>
                <span className="text-primary/80 mt-1 block text-xs">
                  {selectedTier.description}
                </span>
              </div>
            </div>

            <div className="text-muted-foreground grid grid-cols-1 gap-4 text-xs md:grid-cols-3">
              <div>
                <span className="text-foreground block font-medium">Conversion Rate:</span>
                <span>
                  1 USD = {rate.toFixed(4)} {toCurrency}
                </span>
              </div>
              <div>
                <span className="text-foreground block font-medium">Rate Timestamp:</span>
                <span>{ratesData.time_last_update_utc || "Recent"}</span>
              </div>
              <div>
                <span className="text-foreground block font-medium">Calculated At:</span>
                <span>{lastCalculated ? lastCalculated.toLocaleTimeString() : "Recent"}</span>
              </div>
            </div>

            <div className="bg-muted text-muted-foreground space-y-1 rounded-md p-3 text-xs">
              <div className="text-foreground flex items-center gap-1.5 font-medium">
                <Info className="text-primary h-4 w-4" />
                <span>Indicative Exchange Rate Notice</span>
              </div>
              <p>
                Rates are indicative, not bank rates. LicenBase processes orders in USD; local
                currency billing totals depend on your card issuer or payment gateway settlement
                conversion rate.
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
            <CardTitle className="text-base">Direct Wholesale Baseline</CardTitle>
            <CardDescription className="text-xs">
              Calculations use authentic LicenBase product prices with support for monthly,
              quarterly, and annual billing terms.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Transparent Conversions</CardTitle>
            <CardDescription className="text-xs">
              Compare hosting license overhead across BDT, INR, EUR, GBP, and 160+ fiat currencies
              with live rates.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Automated IP Licensing</CardTitle>
            <CardDescription className="text-xs">
              Compatible with all major control panels and server addons including cPanel,
              LiteSpeed, Plesk, and CloudLinux.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
