"use client"

import { makeEolTool } from "@/components/tools/shared/eol-tool"
import { Terminal } from "lucide-react"
import { getProductEol as _getProductEol } from "@/lib/eol"

export const UbuntuEolChecker = makeEolTool({
  slug: "ubuntu-eol-checker",
  product: "ubuntu",
  icon: Terminal,
  productName: "Ubuntu",
  defaultVersion: "24.04",
  hint: "Ubuntu LTS releases receive 5 years of standard support and up to 10 years under Expanded Security Maintenance (ESM).",
})
