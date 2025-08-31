"use client"
import { useEffect, useState } from "react"
import { Cookie } from "lucide-react"

const KEY = "studysprint_cookie_notice"

export function CookieBanner() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const seen = typeof window !== "undefined" && (localStorage.getItem(KEY) || "")
    setOpen(!seen)
  }, [])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[60] mx-auto w-full max-w-3xl rounded-t-2xl border border-border bg-background/95 p-4 shadow-lg"
    >
      <div className="flex items-start gap-3">
        <Cookie className="h-5 w-5 mt-1 shrink-0" aria-hidden="true" />
        <p className="text-sm text-pretty">
          We store only non-personal study preferences (like theme, bookmarks, and exam dates) in cookies/localStorage
          to improve your experience. No accounts, no tracking.
        </p>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button
          className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted"
          onClick={() => {
            localStorage.setItem(KEY, "dismissed")
            setOpen(false)
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
