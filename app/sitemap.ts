import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://studysprint.example.com"
  const routes = ["", "/browse"].map((p) => ({
    url: `${base}${p || "/"}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }))
  return routes
}
