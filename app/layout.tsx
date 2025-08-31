import type React from "react"
import type { Metadata } from "next"
import { Inter, Source_Serif_4 } from "next/font/google"
import { ClientLayout } from "./client-layout"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-serif",
})

export const metadata: Metadata = {
  title: {
    default: "StudySprint",
    template: "%s • StudySprint",
  },
  description: "Find the right study material—fast. Browse colleges, courses, subjects, materials, PYQs, and videos.",
  metadataBase: new URL("https://studysprint.example.com"),
  openGraph: {
    title: "StudySprint",
    description: "Find the right study material—fast.",
    url: "https://studysprint.example.com",
    siteName: "StudySprint",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StudySprint",
    description: "Find the right study material—fast.",
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable + " " + sourceSerif.variable + " antialiased"}>
      <body>
        {/* Wrap with ThemeProvider to enable next-themes across the app */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
