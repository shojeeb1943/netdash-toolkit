"use client"

import { ServerCog } from "lucide-react"
import { makeCalc } from "./shared/calc-tool"

export const DedicatedServerPricingCalculator = makeCalc(
  "dedicated-server-pricing-calculator",
  ServerCog
)
