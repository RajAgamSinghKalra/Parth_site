"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

type RecentItem = { title: string; href: string; type: "nav" | "material" | "pyq" | "video"; ts?: number }
type BookmarkItem = { title: string; href: string; type: "material" | "pyq" | "video" }

type UserState = {
  recents: RecentItem[]
  bookmarks: BookmarkItem[]
  addRecent: (item: Omit<RecentItem, "ts">) => void
  toggleBookmark: (item: BookmarkItem) => void
}

const KEY_RECENTS = "studysprint_recents"
const KEY_BOOKMARKS = "studysprint_bookmarks"

const Ctx = createContext<UserState | null>(null)

export function useUserState() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useUserState must be used within UserStateProvider")
  return ctx
}

export function UserStateProvider({ children }: { children: React.ReactNode }) {
  const [recents, setRecents] = useState<RecentItem[]>([])
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])

  useEffect(() => {
    try {
      const r = JSON.parse(localStorage.getItem(KEY_RECENTS) || "[]")
      const b = JSON.parse(localStorage.getItem(KEY_BOOKMARKS) || "[]")
      setRecents(Array.isArray(r) ? r : [])
      setBookmarks(Array.isArray(b) ? b : [])
    } catch {
      // ignore parse errors
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(KEY_RECENTS, JSON.stringify(recents.slice(0, 50)))
  }, [recents])

  useEffect(() => {
    localStorage.setItem(KEY_BOOKMARKS, JSON.stringify(bookmarks.slice(0, 200)))
  }, [bookmarks])

  const addRecent: UserState["addRecent"] = (item) => {
    setRecents((prev) => {
      const next = [{ ...item, ts: Date.now() }, ...prev.filter((x) => x.href !== item.href)]
      return next.slice(0, 50)
    })
  }

  const toggleBookmark: UserState["toggleBookmark"] = (item) => {
    setBookmarks((prev) => {
      const exists = prev.find((b) => b.href === item.href)
      if (exists) return prev.filter((b) => b.href !== item.href)
      return [item, ...prev]
    })
  }

  const value = useMemo(() => ({ recents, bookmarks, addRecent, toggleBookmark }), [recents, bookmarks])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function ContinueStudyingShelf() {
  const { bookmarks, recents } = useUserState()
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  const items = hydrated ? (bookmarks.length ? bookmarks.slice(0, 6) : recents.slice(0, 6)) : []

  if (!items.length) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4">
            <div className="h-24 w-full rounded-md bg-muted" aria-hidden="true" />
            <p className="mt-2 text-sm text-muted-foreground">Your bookmarks will appear here.</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <a key={it.href} href={it.href} className="rounded-xl border border-border bg-card p-4 hover:bg-muted">
          <div className="h-24 w-full rounded-md bg-muted" aria-hidden="true" />
          <p className="mt-2 text-sm">
            <span className="font-medium">{it.title}</span>
            <span className="ml-2 text-muted-foreground text-xs uppercase">{it.type}</span>
          </p>
        </a>
      ))}
    </div>
  )
}
