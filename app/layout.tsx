import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { ProjectProvider } from "@/contexts/project-context"
import { Toaster } from "sonner"
import { Suspense } from "react"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { offlineToolCount, tools } from "@/lib/tool-registry"
import { BRAND, SITE_NAME, SITE_ORIGIN, canonical } from "@/lib/site"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  // without metadataBase every og:image and canonical resolves relative and breaks once a card renders off-site
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: `Free Network & Sysadmin Tools \u2013 DNS, Subnet & IP | ${BRAND}`,
    // per-tool pages supply an absolute title; anything else inherits this suffix
    template: `%s | ${SITE_NAME}`,
  },
  description: `${tools.length} network engineering tools: subnetting, DNS, TLS, packet maths and reference tables. Free, no account required, and ${offlineToolCount()} of them never send your input anywhere.`,
  applicationName: SITE_NAME,
  authors: [{ name: BRAND, url: SITE_ORIGIN }],
  creator: BRAND,
  keywords: [
    "network engineering",
    "subnet calculator",
    "cidr",
    "dns lookup",
    "network tools",
    "ipv6",
    "vlsm",
  ],
  alternates: { canonical: canonical("/") },
  openGraph: {
    type: "website",
    siteName: BRAND,
    title: `Free Network & Sysadmin Tools \u2013 DNS, Subnet & IP | ${BRAND}`,
    description: `${tools.length} network engineering tools. Free, no account required.`,
    url: canonical("/"),
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `Free Network & Sysadmin Tools \u2013 DNS, Subnet & IP | ${BRAND}`,
    description: `${tools.length} network engineering tools. Free, no account required.`,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  // both values are the real --background tokens, so browser chrome matches the painted page instead of flashing
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          // only claims that are verifiably true of this app: no ratings, review counts or publisher organisation
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: SITE_NAME,
              description:
                "Free online sysadmin and network engineering tools: subnet calculators, DNS lookup, IP converters, TLS checks, and packet diagnostics.",
              url: canonical("/"),
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Any",
              browserRequirements: "Requires JavaScript",
              isAccessibleForFree: true,
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              author: { "@type": "Organization", name: BRAND, url: SITE_ORIGIN },
            }),
          }}
        />
        <Suspense fallback={null}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NuqsAdapter>
              <AuthProvider>
                <ProjectProvider>{children}</ProjectProvider>
              </AuthProvider>
            </NuqsAdapter>
            {/* two toast systems were declared and neither mounted, so every "copied"/"saved"/"failed" message was silent */}
            <Toaster richColors closeButton position="bottom-right" />
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}
