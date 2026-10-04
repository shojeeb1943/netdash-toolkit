"use client"

import { useState } from "react"
import {
  KeyRound,
  Search,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  Lock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolHeader } from "@/components/ui/tool-header"
import { checkPwnedPassword, type PwnedCheckResult } from "@/lib/pwned"
import { getToolBySlug } from "@/lib/tool-registry"

export function PwnedPasswordChecker() {
  const tool = getToolBySlug("pwned-password-checker")!
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PwnedCheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) {
      setError("Please enter a password to evaluate.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await checkPwnedPassword(password)
      setResult(res)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const errorId = "pwned-password-error"

  return (
    <div className="tool-container">
      <ToolHeader icon={KeyRound} title={tool.title} description={tool.description} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Password Exposure Check</CardTitle>
            <CardDescription>
              Check whether a password has appeared in billions of publicly leaked data breach
              records.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCheck} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pwned-password-input">Password to Check</Label>
                <div className="relative">
                  <Input
                    id="pwned-password-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                    disabled={loading}
                    autoComplete="off"
                    className="pr-10 font-mono"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 p-1"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading || !password} className="w-full">
                {loading ? (
                  <Loader2 className="mr-1.5 size-4 animate-spin" />
                ) : (
                  <Search className="mr-1.5 size-4" />
                )}
                <span>Check Breach Datasets</span>
              </Button>

              <div className="bg-muted text-muted-foreground space-y-1.5 rounded-md p-3 text-xs">
                <p className="text-foreground flex items-center gap-1.5 font-semibold">
                  <Lock className="text-primary size-3.5" />
                  <span>Zero-Knowledge K-Anonymity Privacy</span>
                </p>
                <p>
                  Your password is hashed with SHA-1 locally inside your browser and NEVER leaves
                  your device.
                </p>
                <p>
                  Only the first 5 hexadecimal characters of the hash are queried from the Have I
                  Been Pwned API.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Breach Analysis Verdict</CardTitle>
            <CardDescription>K-anonymity matching results</CardDescription>
          </CardHeader>
          <CardContent>
            <div role="status" aria-live="polite" className="space-y-4">
              {loading && (
                <div className="text-muted-foreground flex items-center justify-center py-12">
                  <Loader2 className="mr-2 size-6 animate-spin" />
                  <span>Hashing password locally and querying prefix database...</span>
                </div>
              )}

              {error && (
                <Alert variant="destructive" id={errorId}>
                  <AlertDescription id={errorId}>{error}</AlertDescription>
                </Alert>
              )}

              {!loading && !error && !result && (
                <div className="text-muted-foreground py-10 text-center text-sm">
                  Enter a password and click Check Breach Datasets to evaluate exposure.
                </div>
              )}

              {!loading && result && (
                <div className="space-y-4">
                  {result.pwned ? (
                    <div className="border-destructive/40 bg-destructive/10 space-y-3 rounded-xl border p-5">
                      <div className="text-destructive flex items-center gap-2.5 font-semibold">
                        <ShieldAlert className="size-5" />
                        <span className="text-base">Password Compromised in Known Breaches</span>
                      </div>
                      <p className="text-foreground text-sm">
                        This password was exposed{" "}
                        <span className="text-destructive font-mono font-bold">
                          {result.count.toLocaleString()}
                        </span>{" "}
                        times across public data breaches.
                      </p>
                      <div className="bg-background/80 text-muted-foreground rounded border p-3 text-xs">
                        <p className="text-foreground font-medium">Recommendation:</p>
                        <p>
                          Never use this password for any account. Choose a unique, random
                          passphrase or password manager generated credential.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="border-primary/40 bg-primary/10 space-y-3 rounded-xl border p-5">
                      <div className="text-primary flex items-center gap-2.5 font-semibold">
                        <ShieldCheck className="size-5" />
                        <span className="text-base">No Breach Exposures Found</span>
                      </div>
                      <p className="text-foreground text-sm">
                        This password was <span className="text-primary font-bold">not found</span>{" "}
                        in any known breach database dumps cataloged by Have I Been Pwned.
                      </p>
                      <div className="bg-background/80 text-muted-foreground rounded border p-3 text-xs">
                        <p className="text-foreground font-medium">Security Note:</p>
                        <p>
                          While unbreached, ensure your password is at least 14 characters long and
                          not reused across services.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="bg-muted/40 space-y-1 rounded-lg border p-3 font-mono text-xs">
                    <div className="text-muted-foreground flex justify-between">
                      <span>K-Anonymity Prefix Sent:</span>
                      <span className="text-foreground font-bold">{result.prefix}</span>
                    </div>
                    <div className="text-muted-foreground flex justify-between">
                      <span>Local SHA-1 Mask:</span>
                      <span>{result.sha1}</span>
                    </div>
                  </div>

                  <div className="text-muted-foreground border-t pt-2 text-xs">
                    Data from Have I Been Pwned Pwned Passwords API (Troy Hunt)
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
