import type { Metadata } from "next"
import { ToolShell } from "@/components/tool-shell"
import { getToolBySlug, isOffline, tools } from "@/lib/tool-registry"
import { BRAND, SITE_ORIGIN, canonical, pageTitle } from "@/lib/site"
import { categoryLabelOf } from "@/lib/tool-registry"
import { faqsFor } from "@/lib/tool-faqs"

// static export: every tool page is enumerated at build time, so unknown slugs fail the build
export const dynamicParams = false

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) return {}

  const url = canonical(`/${tool.slug}`)
  // stated per tool: roughly a quarter of them do leave the device, so the card must not imply otherwise
  const privacy = isOffline(tool)
    ? "Runs offline; nothing you type leaves your browser."
    : "Sends data to a third-party host, and only when you ask it to."

  return {
    title: { absolute: pageTitle(tool.title) },
    description: tool.description,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: BRAND,
      title: pageTitle(tool.title),
      description: `${tool.description} ${privacy}`,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle(tool.title),
      description: `${tool.description} ${privacy}`,
    },
  }
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  return (
    <>
      {tool && (
        <script
          type="application/ld+json"
          // only claims that are true of the page: a free, browser-run tool inside a named category
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: tool.title,
                description: tool.description,
                url: canonical(`/${tool.slug}`),
                applicationCategory: "UtilitiesApplication",
                applicationSubCategory: categoryLabelOf(tool),
                operatingSystem: "Any",
                browserRequirements: "Requires JavaScript",
                isAccessibleForFree: true,
                featureList: tool.features,
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
                publisher: { "@type": "Organization", name: BRAND, url: SITE_ORIGIN },
              },
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "LicenBase", item: `${SITE_ORIGIN}/` },
                  { "@type": "ListItem", position: 2, name: "Tools", item: canonical("/") },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: tool.title,
                    item: canonical(`/${tool.slug}`),
                  },
                ],
              },
              ...(faqsFor(tool.slug).length
                ? [
                    {
                      "@context": "https://schema.org",
                      "@type": "FAQPage",
                      mainEntity: faqsFor(tool.slug).map((f) => ({
                        "@type": "Question",
                        name: f.q,
                        acceptedAnswer: { "@type": "Answer", text: f.a },
                      })),
                    },
                  ]
                : []),
            ]).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <ToolShell slug={slug} />
    </>
  )
}
