"use client"

import { makeEolTool } from "@/components/tools/shared/eol-tool"
import { Terminal } from "lucide-react"
import { getProductEol as _getProductEol } from "@/lib/eol"

export const DebianEolChecker = makeEolTool({
  slug: "debian-eol-checker",
  product: "debian",
  icon: Terminal,
  productName: "Debian",
  defaultVersion: "12",
  hint: "Debian releases receive approximately 3 years of security team support plus 2 years of Debian LTS.",
})
