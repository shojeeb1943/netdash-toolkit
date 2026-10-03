"use client"

import { FileText } from "lucide-react"
import { makeTransform } from "./shared/transform-tool"

export const YamlFormatter = makeTransform("yaml-formatter", FileText)
