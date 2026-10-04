"use client"

import { makeEolTool } from "@/components/tools/shared/eol-tool"
import { Database } from "lucide-react"
import { getProductEol as _getProductEol } from "@/lib/eol"

export const MysqlEolChecker = makeEolTool({
  slug: "mysql-eol-checker",
  product: "mysql",
  icon: Database,
  productName: "MySQL",
  defaultVersion: "8.0",
  hint: "MySQL 5.7 reached end-of-life in October 2023. MySQL 8.0 and 8.4 LTS are actively supported.",
})
