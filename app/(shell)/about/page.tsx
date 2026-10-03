import type { Metadata } from "next"
import { BRAND, canonical } from "@/lib/site"
import { About } from "@/components/about"

const TITLE = `About LicenBase Tools \u2013 Free Sysadmin & Network Engineering Suite | ${BRAND}`
const DESCRIPTION = "What LicenBase Tools is, how it works, and what ships in each release"

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  // without its own canonical this inherits the root layout's, which points at "/" and folds the page into the homepage
  alternates: { canonical: canonical("/about") },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: canonical("/about"),
  },
}

export default function AboutPage() {
  return <About />
}
