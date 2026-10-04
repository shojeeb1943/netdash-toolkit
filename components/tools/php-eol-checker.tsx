"use client"

import { makeEolTool } from "@/components/tools/shared/eol-tool"
import { CalendarClock } from "lucide-react"
import { getProductEol as _getProductEol } from "@/lib/eol"

export const PhpEolChecker = makeEolTool({
  slug: "php-eol-checker",
  product: "php",
  icon: CalendarClock,
  productName: "PHP",
  defaultVersion: "8.3",
  hint: "PHP 8.1 is end-of-life; 8.2 receives security fixes only; 8.3 and 8.4 are actively supported.",
})
