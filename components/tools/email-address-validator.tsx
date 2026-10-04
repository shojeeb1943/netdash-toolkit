"use client"

import { MailCheck } from "lucide-react"
import { makeGenerator } from "./shared/generator-tool"

export const EmailAddressValidator = makeGenerator("email-address-validator", MailCheck)
