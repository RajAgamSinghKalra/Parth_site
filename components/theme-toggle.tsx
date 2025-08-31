"use client"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = (resolvedTheme || "light") === "dark"
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        title="Toggle theme"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-input bg-background hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <span className="sr-only">Toggle theme</span>
        <Moon className="h-5 w-5" aria-hidden="true" />
      </button>
    )
  }
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      title="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-input bg-background hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <span className="sr-only">Toggle theme</span>
      {isDark ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
    </button>
  )
}
