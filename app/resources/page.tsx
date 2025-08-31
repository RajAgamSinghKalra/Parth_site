"use client"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DemoStore } from "@/lib/demo-store"
import { demoNotes, demoVideos } from "@/lib/demo-data"

type Prefs = ReturnType<typeof DemoStore.getPrefs>

export default function ResourcesPage() {
  const [prefs, setPrefs] = useState<Prefs>(null)
  const [notes, setNotes] = useState<any[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])

  useEffect(() => {
    // seed notes/videos on first visit if empty
    if ((DemoStore.get("notes") as any[]).length === 0) DemoStore.set("notes", demoNotes)
    if ((DemoStore.get("videos") as any[]).length === 0) DemoStore.set("videos", demoVideos)

    setPrefs(DemoStore.getPrefs())
    setNotes(DemoStore.get("notes") as any[])
    setVideos(DemoStore.get("videos") as any[])
    setSubjects(DemoStore.get("subjects") as any[])
  }, [])

  const subjectsForPrefs = useMemo(() => {
    if (!prefs) return []
    return subjects.filter((s) => s.courseId === prefs.courseId && (!prefs.semester || s.semester === prefs.semester))
  }, [subjects, prefs])

  const subjectIds = useMemo(() => new Set(subjectsForPrefs.map((s) => s.id)), [subjectsForPrefs])

  const filteredNotes = useMemo(() => notes.filter((n) => subjectIds.has(n.subjectId)), [notes, subjectIds])
  const filteredVideos = useMemo(() => videos.filter((v) => subjectIds.has(v.subjectId)), [videos, subjectIds])

  return (
    <main className="container mx-auto max-w-5xl p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-pretty">Resources tailored for you</h1>
        <div className="mt-2 flex items-center gap-2">
          <p className="text-muted-foreground">Based on your preferences. You can adjust them any time.</p>
          <button
            type="button"
            onClick={() => {
              DemoStore.clearPrefs()
              window.location.reload()
            }}
            className="rounded-full border border-input px-3 py-1.5 text-sm hover:bg-muted"
            aria-label="Edit Preferences"
          >
            Edit Preferences
          </button>
        </div>
      </div>

      <Tabs defaultValue="notes" className="w-full">
        <TabsList>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>

        <TabsContent value="notes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNotes.map((n) => (
              <Card key={n.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-pretty">{n.title}</CardTitle>
                  <CardDescription>{n.type === "pdf" ? "PDF" : "Web Article"}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Link href={n.url} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full">Open {n.type === "pdf" ? "PDF" : "Page"}</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
            {filteredNotes.length === 0 && (
              <div className="text-muted-foreground">No notes match your selection yet.</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="videos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVideos.map((v) => (
              <Card key={v.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-pretty">{v.title}</CardTitle>
                  <CardDescription>YouTube</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Link href={v.url} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full">Watch on YouTube</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
            {filteredVideos.length === 0 && (
              <div className="text-muted-foreground">No videos match your selection yet.</div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}
