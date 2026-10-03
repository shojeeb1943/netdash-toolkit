// one place for the canonical origin and the app's public identity, so metadata,
// sitemap, manifest and structured data cannot drift apart.
// LicenBase serves the suite under /tools (basePath in next.config.mjs); canonical() adds that prefix.
export const SITE_ORIGIN = "https://licenbase.com"
export const BASE_PATH = "/tools"
export const SITE_URL = SITE_ORIGIN
export const SITE_NAME = "LicenBase Tools"
export const SITE_TAGLINE = "Free Sysadmin & Network Utilities"
export const BRAND = "LicenBase"

// <h1 title> – Free Online Tool | LicenBase: the title pattern every indexed tool page uses
export function pageTitle(title: string): string {
  return `${title} \u2013 Free Online Tool | ${BRAND}`
}

// trailingSlash: true in next.config, so every canonical must end in a slash or
// it resolves to a redirect rather than the page itself
export function canonical(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`
  const withSlash = clean.endsWith("/") ? clean : `${clean}/`
  return new URL(`${BASE_PATH}${withSlash}`, SITE_ORIGIN).href
}
