// three tool-specific questions per tool, rendered under "About this tool" and emitted as FAQPage JSON-LD.
// answers are plain text (they go into JSON-LD), written for the tool they sit on rather than shared boilerplate.
export interface Faq {
  q: string
  a: string
}

import { dev_httpFaqs } from "@/lib/faqs/dev-http"
import { emailFaqs } from "@/lib/faqs/email"
import { file_toolsFaqs } from "@/lib/faqs/file-tools"
import { hosting_businessFaqs } from "@/lib/faqs/hosting-business"
import { hosting_intelFaqs } from "@/lib/faqs/hosting-intel"
import { licenses_domainsFaqs } from "@/lib/faqs/licenses-domains"
import { linux_commandsFaqs } from "@/lib/faqs/linux-commands"
import { security_toolsFaqs } from "@/lib/faqs/security-tools"
import { seo_webFaqs } from "@/lib/faqs/seo-web"
import { server_planningFaqs } from "@/lib/faqs/server-planning"
import { text_toolsFaqs } from "@/lib/faqs/text-tools"

export const toolFaqs: Record<string, Faq[]> = {
  ...dev_httpFaqs,
  ...emailFaqs,
  ...file_toolsFaqs,
  ...hosting_businessFaqs,
  ...hosting_intelFaqs,
  ...licenses_domainsFaqs,
  ...linux_commandsFaqs,
  ...security_toolsFaqs,
  ...seo_webFaqs,
  ...server_planningFaqs,
  ...text_toolsFaqs,
}

export function faqsFor(slug: string): Faq[] {
  return toolFaqs[slug] ?? []
}
