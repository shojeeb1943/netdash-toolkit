"use client"

import { Paperclip } from "lucide-react"
import { makeGenerator } from "./shared/generator-tool"

export const EmailAttachmentSizeCalculator = makeGenerator(
  "email-attachment-size-calculator",
  Paperclip
)
