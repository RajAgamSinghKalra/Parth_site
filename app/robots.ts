import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const base = "https://studysprint.example.com"
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/*", "/api/*"],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
