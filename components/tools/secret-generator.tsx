"use client"

import { Lock } from "lucide-react"
import { makeGenerator } from "./shared/generator-tool"

export const SecretGenerator = makeGenerator("secret-generator", Lock)
