// three tool-specific questions per tool, rendered under "About this tool" and emitted as FAQPage JSON-LD.
// answers are plain text (they go into JSON-LD), written for the tool they sit on rather than shared boilerplate.
export interface Faq {
  q: string
  a: string
}

import { dev_httpFaqs } from "@/lib/faqs/dev-http"
import { emailFaqs } from "@/lib/faqs/email"
import { hosting_businessFaqs } from "@/lib/faqs/hosting-business"
import { licenses_domainsFaqs } from "@/lib/faqs/licenses-domains"
import { linux_commandsFaqs } from "@/lib/faqs/linux-commands"
import { security_toolsFaqs } from "@/lib/faqs/security-tools"
import { seo_webFaqs } from "@/lib/faqs/seo-web"
import { server_planningFaqs } from "@/lib/faqs/server-planning"

export const toolFaqs: Record<string, Faq[]> = {
  ...dev_httpFaqs,
  ...emailFaqs,
  ...hosting_businessFaqs,
  ...licenses_domainsFaqs,
  ...linux_commandsFaqs,
  ...security_toolsFaqs,
  ...seo_webFaqs,
  ...server_planningFaqs,
}

export function faqsFor(slug: string): Faq[] {
  return toolFaqs[slug] ?? []
}
