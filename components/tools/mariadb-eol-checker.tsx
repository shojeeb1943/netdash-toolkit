"use client"

import { makeEolTool } from "@/components/tools/shared/eol-tool"
import { Database } from "lucide-react"
import { getProductEol as _getProductEol } from "@/lib/eol"

export const MariadbEolChecker = makeEolTool({
  slug: "mariadb-eol-checker",
  product: "mariadb",
  icon: Database,
  productName: "MariaDB",
  defaultVersion: "10.11",
  hint: "MariaDB maintains 5-year LTS releases (such as 10.6 and 10.11) and 1-year short-term releases.",
})
