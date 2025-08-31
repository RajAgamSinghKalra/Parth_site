"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { DemoStore } from "@/lib/demo-store"
import { demoColleges, demoCourses, demoSubjects } from "@/lib/demo-data"

type EntityKey = "colleges" | "courses" | "subjects" | "notes" | "videos"

export default function AdminManagePage() {
  const [colleges, setColleges] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [notes, setNotes] = useState<any[]>([])
  const [videos, setVideos] = useState<any[]>([])

  // fields
  const [newCollegeName, setNewCollegeName] = useState("")
  const [newCourseName, setNewCourseName] = useState("")
  const [newCourseCollegeId, setNewCourseCollegeId] = useState("")
  const [newSubjectName, setNewSubjectName] = useState("")
  const [newSubjectCourseId, setNewSubjectCourseId] = useState("")
  const [newSubjectSemester, setNewSubjectSemester] = useState("")
  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [newNoteSubjectId, setNewNoteSubjectId] = useState("")
  const [newNoteUrl, setNewNoteUrl] = useState("")
  const [newNoteType, setNewNoteType] = useState<"pdf" | "web">("pdf")
  const [newVideoTitle, setNewVideoTitle] = useState("")
  const [newVideoSubjectId, setNewVideoSubjectId] = useState("")
  const [newVideoUrl, setNewVideoUrl] = useState("")

  useEffect(() => {
    // ensure demo data exists
    DemoStore.initIfEmpty({
      colleges: demoColleges,
      courses: demoCourses,
      subjects: demoSubjects,
      notes: [],
      videos: [],
    })

    refresh()
  }, [])

  function refresh() {
    setColleges(DemoStore.get("colleges") as any[])
    setCourses(DemoStore.get("courses") as any[])
    setSubjects(DemoStore.get("subjects") as any[])
    setNotes(DemoStore.get("notes") as any[])
    setVideos(DemoStore.get("videos") as any[])
  }

  function addEntity(key: EntityKey, value: any) {
    const current = DemoStore.get(key as any) as any[]
    DemoStore.set(key as any, [...current, value])
    refresh()
  }

  function removeEntity(key: EntityKey, id: string) {
    const current = DemoStore.get(key as any) as any[]
    DemoStore.set(
      key as any,
      current.filter((x) => x.id !== id),
    )
    refresh()
  }

  return (
    <main className="container mx-auto max-w-5xl p-4 md:p-6 space-y-8">
      <h1 className="text-2xl md:text-3xl font-semibold">Admin Manage (Demo)</h1>

      <Card>
        <CardHeader>
          <CardTitle>Colleges</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="College name"
              value={newCollegeName}
              onChange={(e) => setNewCollegeName(e.target.value)}
            />
            <Button
              onClick={() => {
                if (!newCollegeName) return
                addEntity("colleges", {
                  id: `c-${Date.now()}`,
                  name: newCollegeName,
                  slug: newCollegeName.toLowerCase().replace(/\s+/g, "-"),
                })
                setNewCollegeName("")
              }}
            >
              Add
            </Button>
          </div>
          <ul className="text-sm text-muted-foreground">
            {colleges.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-1">
                <span>{c.name}</span>
                <Button variant="outline" size="sm" onClick={() => removeEntity("colleges", c.id)}>
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-3 gap-2">
            <Select value={newCourseCollegeId} onValueChange={setNewCourseCollegeId}>
              <SelectTrigger>
                <SelectValue placeholder="College" />
              </SelectTrigger>
              <SelectContent>
                {colleges.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="Course name" value={newCourseName} onChange={(e) => setNewCourseName(e.target.value)} />
            <Button
              onClick={() => {
                if (!newCourseName || !newCourseCollegeId) return
                addEntity("courses", {
                  id: `co-${Date.now()}`,
                  collegeId: newCourseCollegeId,
                  name: newCourseName,
                  slug: newCourseName.toLowerCase().replace(/\s+/g, "-"),
                  semesterCount: 8,
                })
                setNewCourseName("")
              }}
            >
              Add
            </Button>
          </div>
          <ul className="text-sm text-muted-foreground">
            {courses.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-1">
                <span>{c.name}</span>
                <Button variant="outline" size="sm" onClick={() => removeEntity("courses", c.id)}>
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subjects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-4 gap-2">
            <Select value={newSubjectCourseId} onValueChange={setNewSubjectCourseId}>
              <SelectTrigger>
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Subject name"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
            />
            <Input
              placeholder="Semester (optional)"
              value={newSubjectSemester}
              onChange={(e) => setNewSubjectSemester(e.target.value)}
            />
            <Button
              onClick={() => {
                if (!newSubjectName || !newSubjectCourseId) return
                const sem = newSubjectSemester ? Number(newSubjectSemester) : undefined
                addEntity("subjects", {
                  id: `s-${Date.now()}`,
                  courseId: newSubjectCourseId,
                  name: newSubjectName,
                  slug: newSubjectName.toLowerCase().replace(/\s+/g, "-"),
                  semester: sem,
                })
                setNewSubjectName("")
                setNewSubjectSemester("")
              }}
            >
              Add
            </Button>
          </div>
          <ul className="text-sm text-muted-foreground">
            {subjects.map((s) => (
              <li key={s.id} className="flex items-center justify-between py-1">
                <span>{s.name}</span>
                <Button variant="outline" size="sm" onClick={() => removeEntity("subjects", s.id)}>
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-4 gap-2">
            <Select value={newNoteSubjectId} onValueChange={setNewNoteSubjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="Title" value={newNoteTitle} onChange={(e) => setNewNoteTitle(e.target.value)} />
            <Input placeholder="URL (PDF or Web)" value={newNoteUrl} onChange={(e) => setNewNoteUrl(e.target.value)} />
            <Select value={newNoteType} onValueChange={(v) => setNewNoteType(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="web">Web</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => {
              if (!newNoteSubjectId || !newNoteTitle || !newNoteUrl) return
              addEntity("notes", {
                id: `n-${Date.now()}`,
                subjectId: newNoteSubjectId,
                title: newNoteTitle,
                type: newNoteType,
                url: newNoteUrl,
              })
              setNewNoteTitle("")
              setNewNoteUrl("")
            }}
          >
            Add Note
          </Button>
          <ul className="text-sm text-muted-foreground">
            {notes.map((n) => (
              <li key={n.id} className="flex items-center justify-between py-1">
                <span>{n.title}</span>
                <Button variant="outline" size="sm" onClick={() => removeEntity("notes", n.id)}>
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Videos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-3 gap-2">
            <Select value={newVideoSubjectId} onValueChange={setNewVideoSubjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="Title" value={newVideoTitle} onChange={(e) => setNewVideoTitle(e.target.value)} />
            <Input placeholder="YouTube URL" value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} />
          </div>
          <Button
            onClick={() => {
              if (!newVideoSubjectId || !newVideoTitle || !newVideoUrl) return
              addEntity("videos", {
                id: `v-${Date.now()}`,
                subjectId: newVideoSubjectId,
                title: newVideoTitle,
                url: newVideoUrl,
              })
              setNewVideoTitle("")
              setNewVideoUrl("")
            }}
          >
            Add Video
          </Button>
          <ul className="text-sm text-muted-foreground">
            {videos.map((v) => (
              <li key={v.id} className="flex items-center justify-between py-1">
                <span>{v.title}</span>
                <Button variant="outline" size="sm" onClick={() => removeEntity("videos", v.id)}>
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </main>
  )
}
