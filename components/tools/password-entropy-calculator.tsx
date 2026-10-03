"use client"

import { KeyRound } from "lucide-react"
import { makeGenerator } from "./shared/generator-tool"

export const PasswordEntropyCalculator = makeGenerator("password-entropy-calculator", KeyRound)
