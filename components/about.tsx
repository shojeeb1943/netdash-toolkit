/* eslint-disable @next/next/no-html-link-for-pages -- these links go to the main LicenBase site, outside the /tools basePath */
"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GitCommit, Plus, Bug, Wrench, Star, Cloud, Monitor, WifiOff } from "lucide-react"
import changelogData from "@/data/changelog.json"
import { categories, isOffline, offlineToolCount, tools } from "@/lib/tool-registry"

const changelog = changelogData.releases
const offlineCount = offlineToolCount()
const networkTools = tools.filter((t) => !isOffline(t))

// the browser/desktop split is stated once here instead of re-explained inside five tools
const desktopTools = tools.filter((t) => (t.runtime?.desktopOnly?.length ?? 0) > 0)

const algorithms = [
  {
    title: "IPv4 subnet math",
    detail:
      "Network = IP & Mask, Broadcast = Network | ~Mask, on unsigned 32-bit values so the high octet cannot overflow into a negative.",
  },
  {
    title: "VLSM allocation",
    detail:
      "Sort subnets by host count descending, pick the prefix p where 2^(32-p)-2 >= hosts, then place each block on its own binary boundary.",
  },
  {
    title: "IPv6 compression",
    detail:
      "RFC 5952: drop leading zeros per group, then replace the single longest run of zero groups with :: exactly once.",
  },
  {
    title: "Conflict detection",
    detail:
      "Parses ARP tables, DHCP leases and MAC tables, correlates addresses across sources, and reports the evidence rather than a verdict.",
  },
]

const getVersionBadgeVariant = (type: string) => {
  switch (type) {
    case "major":
      return "default"
    case "minor":
      return "secondary"
    default:
      return "outline"
  }
}

const getVersionIcon = (type: string) => {
  switch (type) {
    case "major":
      return Star
    case "minor":
      return Plus
    case "patch":
      return Bug
    default:
      return Wrench
  }
}

export function About() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="eyebrow">About</p>
        <h1 className="text-3xl font-semibold text-balance sm:text-4xl">LicenBase Tools</h1>
        <p className="text-muted-foreground max-w-3xl leading-relaxed text-pretty">
          {tools.length} network engineering utilities in one static site: subnetting, addressing,
          config generation, diagnostics, reference tables and a handful of everyday developer
          tools. There is no backend. {offlineCount} of the {tools.length} tools run offline and
          never leave your browser, and the remaining {networkTools.length} name the host they
          contact before they send anything.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="gap-1">
            <WifiOff className="size-3" aria-hidden="true" />
            {offlineCount} run offline
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Cloud className="size-3" aria-hidden="true" />
            {networkTools.length} send data
          </Badge>
          <Badge variant="outline">{categories.length} categories</Badge>
          <Badge variant="outline">WCAG 2.2 AA</Badge>
          <Badge variant="outline">Free, no account required</Badge>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Where your input goes</CardTitle>
          <CardDescription>
            The full list, not a summary. Anything not on it never leaves your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            Subnet math, VLSM planning, address conversion, config generation, encoding, hashing and
            every reference table run on the values you type and nothing else. No request is made
            until you press a button. The site itself records page views through Vercel Analytics,
            which sees the URL you visited and never the contents of a tool.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-md text-left text-sm">
              <caption className="sr-only">
                Tools that make network requests, and the hosts they contact
              </caption>
              <thead>
                <tr className="border-border text-muted-foreground border-b text-xs">
                  <th scope="col" className="py-2 pr-4 font-medium">
                    Tool
                  </th>
                  <th scope="col" className="py-2 font-medium">
                    Contacts
                  </th>
                </tr>
              </thead>
              <tbody>
                {networkTools.map((tool) => (
                  <tr key={tool.slug} className="border-border/60 border-b last:border-0">
                    <td className="py-2 pr-4 align-top">
                      <Link
                        href={`/${tool.slug}`}
                        className="focus-visible:ring-ring focus-visible:ring-offset-background rounded underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                      >
                        {tool.title}
                      </Link>
                    </td>
                    <td className="text-muted-foreground py-2 align-top font-mono text-xs">
                      {tool.runtime?.thirdParty?.join(", ") ?? "not declared"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Every tool above that contacts a host names it on the tool page before anything is sent.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How it is built</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3 text-sm leading-relaxed">
            <p>
              Next.js App Router exported as static HTML. Every tool is its own lazily loaded chunk,
              so opening one tool does not download the other {tools.length - 1}. State that belongs
              in a link lives in the URL, so a calculation can be shared by copying the address bar.
            </p>
            <p>
              Projects are stored in your browser. Cloud sync is opt-in and does nothing until you
              sign in, so the default install talks to no account service at all.
            </p>
            <p>
              The same code ships as an Electron desktop app, which adds the operations a browser is
              not permitted to perform at all.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Monitor className="size-4" aria-hidden="true" />
              What the desktop build adds
            </CardTitle>
            <CardDescription>
              Named per tool, because the browser versions cannot do these and do not pretend to.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {desktopTools.map((tool) => (
                <li key={tool.slug} className="flex flex-col gap-0.5">
                  <span className="font-medium">{tool.title}</span>
                  <span className="text-muted-foreground text-xs leading-relaxed">
                    {tool.runtime?.desktopOnly?.join(", ")}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground mt-4 text-xs leading-relaxed">
              In the browser, the ping tool measures an HTTPS round trip. That is a useful
              reachability signal, but it is not ICMP and the tool says so.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How the math is done</CardTitle>
          <CardDescription>The four calculations most likely to be wrong elsewhere</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {algorithms.map((algorithm) => (
              <div key={algorithm.title} className="border-border rounded-lg border p-4">
                <h3 className="text-sm font-semibold">{algorithm.title}</h3>
                <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
                  {algorithm.detail}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Accessibility</CardTitle>
          <CardDescription>What the WCAG 2.2 AA claim is actually backed by</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-3 text-sm leading-relaxed">
          <p>
            All {tools.length} tools are mounted in CI and run through axe-core against the full 2.2
            AA rule set on every commit. Colour contrast is asserted separately, straight from the
            design tokens, because an automated checker cannot measure a page that never painted.
          </p>
          <p>
            Automated checks cover roughly a third of the success criteria. The rest, focus order,
            meaningful sequence and sensible labels, are reviewed by hand. Every interactive target
            is at least 24 by 24 CSS pixels, and the interface is usable from 320 pixels wide.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <GitCommit className="size-4" aria-hidden="true" />
            Changelog
          </CardTitle>
          <CardDescription>
            {changelog.length} releases, from v{changelog[changelog.length - 1]?.version} to v
            {changelog[0].version}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="scrollbar-slim h-128 pr-4">
            <div className="space-y-6">
              {changelog.map((release, index) => {
                const VersionIcon = getVersionIcon(release.type)
                return (
                  <div key={release.version} className="relative">
                    {index < changelog.length - 1 && (
                      <div
                        className="bg-border absolute top-8 bottom-0 left-4 w-px"
                        aria-hidden="true"
                      />
                    )}

                    <div className="flex items-start gap-4">
                      <div className="bg-background border-border flex size-8 shrink-0 items-center justify-center rounded-full border-2">
                        <VersionIcon className="text-muted-foreground size-4" aria-hidden="true" />
                      </div>

                      <div className="min-w-0 flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="tabular text-base font-semibold">v{release.version}</h3>
                          <Badge variant={getVersionBadgeVariant(release.type)}>
                            {release.type}
                          </Badge>
                        </div>

                        <h4 className="text-foreground text-sm font-medium">{release.title}</h4>

                        <ul className="space-y-1">
                          {release.changes.map((change, changeIndex) => (
                            <li key={changeIndex} className="flex items-start gap-2 text-sm">
                              <span
                                className="bg-primary mt-2 size-1.5 shrink-0 rounded-full"
                                aria-hidden="true"
                              />
                              <span className="text-muted-foreground leading-relaxed">
                                {change}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {release.technical && release.technical.length > 0 && (
                          <ul className="space-y-1">
                            {release.technical.map((tech, techIndex) => (
                              <li key={techIndex} className="flex items-start gap-2">
                                <span
                                  className="bg-muted-foreground mt-2 size-1.5 shrink-0 rounded-full"
                                  aria-hidden="true"
                                />
                                <span className="text-muted-foreground font-mono text-xs leading-relaxed">
                                  {tech}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Provided by LicenBase</CardTitle>
          <CardDescription>
            Empowering sysadmins, DevOps teams, and web hosting providers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            LicenBase is the leading software licensing platform for hosting providers, agencies,
            and cloud engineers. We build and maintain these {tools.length} high-performance tools
            to give the sysadmin and developer community completely free, privacy-first, and
            browser-local utilities.
          </p>
          <div className="flex flex-wrap gap-2">
            <a href="/products" className="lb-tools-btn-primary">
              <span>Explore Licenses</span>
            </a>
            <a href="/deals" className="lb-tools-btn-secondary">
              Hosting Deals
            </a>
            <a href="/contact" className="lb-tools-btn-secondary">
              Contact Support
            </a>
            <a href="/" className="lb-tools-btn-secondary">
              LicenBase Home
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
