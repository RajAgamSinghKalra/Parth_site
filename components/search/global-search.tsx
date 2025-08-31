"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useUserState } from "@/components/user-state"

type GlobalSearchContextValue = {
  open: boolean
  setOpen: (v: boolean) => void
  toggle: () => void
}

const GlobalSearchContext = createContext<GlobalSearchContextValue | null>(null)

export function useGlobalSearch() {
  const ctx = useContext(GlobalSearchContext)
  if (!ctx) throw new Error("useGlobalSearch must be used within GlobalSearchProvider")
  return ctx
}

export function GlobalSearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const toggle = useCallback(() => setOpen((v) => !v), [])
  // keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])
  const value = useMemo(() => ({ open, setOpen, toggle }), [open, toggle])
  return <GlobalSearchContext.Provider value={value}>{children}</GlobalSearchContext.Provider>
}

type Item = { title: string; href: string; group: "Colleges" | "Courses" | "Subjects" | "Quick Links" }

const DEMO_ITEMS: Item[] = [
  // Colleges
  { title: "ABC University", href: "/college/abc-university", group: "Colleges" },
  { title: "XYZ College", href: "/college/xyz-college", group: "Colleges" },
  { title: "North Tech", href: "/college/north-tech", group: "Colleges" },
  // Courses
  { title: "B.Tech — Computer Science", href: "/course/btech-cse", group: "Courses" },
  { title: "B.Sc — Physics", href: "/course/bsc-physics", group: "Courses" },
  { title: "MBA — Core", href: "/course/mba-core", group: "Courses" },
  // Subjects
  { title: "Discrete Mathematics", href: "/subject/discrete-math", group: "Subjects" },
  { title: "Data Structures", href: "/subject/data-structures", group: "Subjects" },
  { title: "Organic Chemistry", href: "/subject/organic-chemistry", group: "Subjects" },
  // Quick
  { title: "Admin Login", href: "/admin/login", group: "Quick Links" },
]

export function GlobalSearch() {
  const router = useRouter()
  const { open, setOpen } = useGlobalSearch()
  const { addRecent } = useUserState()

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search colleges, courses, subjects..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Colleges">
          {DEMO_ITEMS.filter((i) => i.group === "Colleges").map((i) => (
            <CommandItem
              key={i.href}
              onSelect={() => {
                addRecent({ title: i.title, href: i.href, type: "nav" })
                setOpen(false)
                router.push(i.href)
              }}
              value={i.title}
            >
              {i.title}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Courses">
          {DEMO_ITEMS.filter((i) => i.group === "Courses").map((i) => (
            <CommandItem
              key={i.href}
              onSelect={() => {
                addRecent({ title: i.title, href: i.href, type: "nav" })
                setOpen(false)
                router.push(i.href)
              }}
              value={i.title}
            >
              {i.title}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Subjects">
          {DEMO_ITEMS.filter((i) => i.group === "Subjects").map((i) => (
            <CommandItem
              key={i.href}
              onSelect={() => {
                addRecent({ title: i.title, href: i.href, type: "nav" })
                setOpen(false)
                router.push(i.href)
              }}
              value={i.title}
            >
              {i.title}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Quick Links">
          {DEMO_ITEMS.filter((i) => i.group === "Quick Links").map((i) => (
            <CommandItem
              key={i.href}
              onSelect={() => {
                addRecent({ title: i.title, href: i.href, type: "nav" })
                setOpen(false)
                router.push(i.href)
              }}
              value={i.title}
            >
              {i.title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
