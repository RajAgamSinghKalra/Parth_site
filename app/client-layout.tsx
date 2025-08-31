"use client"

import type React from "react"
import Link from "next/link"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { CountdownPill } from "@/components/countdown-pill"
import { CookieBanner } from "@/components/cookie-banner"
import { Search } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { GlobalSearch, GlobalSearchProvider, useGlobalSearch } from "@/components/search/global-search"
import { UserStateProvider } from "@/components/user-state"
import OnboardingDialog from "@/components/onboarding/onboarding-dialog"
import { DemoStore } from "@/lib/demo-store"
import { OnboardingInit } from "@/components/onboarding/onboarding-init"

function Header() {
  const searchParams = useSearchParams()
  const { setOpen } = useGlobalSearch()
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-2">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-serif text-xl font-semibold tracking-tight">
            StudySprint
            <span className="sr-only">Home</span>
          </Link>
          {/* global search placeholder (cmd/ctrl+k opens) */}
          <button
            type="button"
            aria-label="Open search (Cmd/Ctrl + K)"
            className="hidden sm:flex items-center gap-2 rounded-full border border-input bg-background px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted"
            onClick={() => setOpen(true)}
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            <span className="text-pretty">Search…</span>
            <kbd className="ml-2 hidden rounded bg-muted px-1.5 py-0.5 text-xs sm:inline-block">⌘K</kbd>
          </button>
          <Link
            href="/resources"
            className="hidden sm:inline-block rounded-full border border-input px-3 py-1.5 text-sm hover:bg-muted"
          >
            Resources
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              DemoStore.clearPrefs()
              window.location.reload()
            }}
            className="rounded-full border border-input px-3 py-1.5 text-sm hover:bg-muted"
            aria-label="Edit Preferences"
          >
            Preferences
          </button>
          <CountdownPill />
          <ThemeToggle />
          <Link
            href="/admin/manage"
            className="rounded-full border border-input px-3 py-1.5 text-sm hover:bg-muted"
            aria-label="Admin Manage"
          >
            Admin Manage
          </Link>
          <Link
            href="/admin/login"
            className="rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label="Admin Login"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-12 border-t border-border/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <h3 className="font-serif text-lg font-semibold">StudySprint</h3>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              All academic content belongs to respective authors. For takedowns contact support@example.com.
            </p>
          </div>
          <nav className="flex flex-col gap-1 text-sm">
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/submit-material" className="hover:underline">
              Submit Material
            </Link>
          </nav>
          <div className="text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} StudySprint. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

const ClientLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true} storageKey="studysprint_theme">
      <GlobalSearchProvider>
        <UserStateProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Header />
            <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
            <Footer />
            <CookieBanner />
            <OnboardingInit />
            <OnboardingDialog />
          </Suspense>
          <GlobalSearch />
        </UserStateProvider>
      </GlobalSearchProvider>
    </ThemeProvider>
  )
}

export default ClientLayout
export { ClientLayout }
