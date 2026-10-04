// three tool-specific questions per tool, rendered under "About this tool" and emitted as FAQPage JSON-LD.
// answers are plain text (they go into JSON-LD), written for the tool they sit on rather than shared boilerplate.
export interface Faq {
  q: string
  a: string
}

import { hosting_businessFaqs } from "@/lib/faqs/hosting-business"
import { server_planningFaqs } from "@/lib/faqs/server-planning"

export const toolFaqs: Record<string, Faq[]> = {
  ...hosting_businessFaqs,
  ...server_planningFaqs,
}

export function faqsFor(slug: string): Faq[] {
  return toolFaqs[slug] ?? []
}
