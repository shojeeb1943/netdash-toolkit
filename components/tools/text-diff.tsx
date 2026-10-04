"use client"

import { GitCompare } from "lucide-react"
import { makeDiffTool } from "./shared/diff-tool"

export const TextDiff = makeDiffTool("text-diff", GitCompare)
