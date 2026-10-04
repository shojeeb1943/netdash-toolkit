"use client"

import { makeEolTool } from "@/components/tools/shared/eol-tool"
import { Terminal } from "lucide-react"
import { getProductEol as _getProductEol } from "@/lib/eol"

export const AlmalinuxEolChecker = makeEolTool({
  slug: "almalinux-eol-checker",
  product: "almalinux",
  icon: Terminal,
  productName: "AlmaLinux",
  defaultVersion: "9",
  hint: "AlmaLinux provides 10 years of support for each major release, matching RHEL lifecycle windows.",
})
