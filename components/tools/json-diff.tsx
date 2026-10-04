"use client"

import { Diff } from "lucide-react"
import { makeDiffTool } from "./shared/diff-tool"

export const JsonDiff = makeDiffTool("json-diff", Diff)
