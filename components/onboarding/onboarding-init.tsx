"use client"

import * as React from "react"
import { seedDemoDataIfNeeded } from "@/lib/demo-store"

export function OnboardingInit() {
  React.useEffect(() => {
    seedDemoDataIfNeeded()
  }, [])

  return null
}
