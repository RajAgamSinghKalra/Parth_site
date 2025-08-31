"use client"

import useSWR from "swr"
import { useState } from "react"
import { DataTable } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { CsvImportDialog } from "@/components/admin/csv-import-dialog"

type Subject = {
  id: string
  name: string
  slug: string
  code: string | null
  semester: number | null
  courseId: string
  course: { id: string; name: string; slug: string; college: { id: string; name: string } }
}

type Course = { id: string; name: string; slug: string }
type CourseOption = Course & { label: string }

const fetcher = (u: string) => fetch(u).then((r) => r.json())

export default function SubjectsClient() {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState("")
  const [courseFilter, setCourseFilter] = useState<string>("")
  const { data, mutate } = useSWR<{ items: Subject[]; total: number; page: number; pageSize: number }>(
    `/api/subjects?page=${page}&q=${encodeURIComponent(q)}${courseFilter ? `&courseId=${encodeURIComponent(courseFilter)}` : ""}`,
    fetcher,
  )
  // Get courses for select
  const { data: coursesData } = useSWR<{ items: Course[] }>(`/api/courses?page=1&pageSize=1000`, fetcher)
  const courses: CourseOption[] = (coursesData?.items || []).map((c) => ({ ...c, label: c.name })) || []

  const { toast } = useToast()

  async function create(values: {
    name: string
    slug?: string
    code?: string
    semester?: number | null
    courseId: string
  }) {
    const res = await fetch("/api/subjects", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    })
    if (!res.ok) throw new Error("Create failed")
    toast({ title: "Created" })
    mutate()
  }

  async function update(id: string, values: Partial<Subject>) {
    const res = await fetch(`/api/subjects/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    })
    if (!res.ok) throw new Error("Update failed")
    toast({ title: "Updated" })
    mutate()
  }

  async function remove(id: string) {
    if (!confirm("Delete this subject? This cannot be undone.")) return
    const res = await fetch(`/api/subjects/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error("Delete failed")
    toast({ title: "Deleted" })
    mutate()
  }

  async function bulkImport(rows: Record<string, string>[]) {
    for (const r of rows) {
      if (!r.name || !r.courseSlug) continue
      const course = courses.find((c) => c.slug.toLowerCase() === r.courseSlug.toLowerCase())
      if (!course) continue
      const semester = r.semester ? Number(r.semester) : undefined
      await create({
        name: r.name,
        slug: r.slug || undefined,
        code: r.code || undefined,
        semester: Number.isFinite(semester as number) ? (semester as number) : undefined,
        courseId: course.id,
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label className="text-sm">Filter by Course</Label>
        <Select value={courseFilter} onValueChange={(v) => setCourseFilter(v === "all" ? "" : v)}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="All courses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All courses</SelectItem>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        rows={data?.items || []}
        columns={[
          { key: "name", header: "Name" },
          { key: "slug", header: "Slug", className: "hidden md:table-cell" },
          { key: "code", header: "Code", className: "hidden md:table-cell" },
          {
            key: "semester",
            header: "Sem",
            render: (r) => r.semester ?? "—",
            className: "hidden sm:table-cell",
          },
          { key: "course", header: "Course", render: (r) => r.course?.name || "" },
          {
            key: "actions",
            header: "Actions",
            render: (r) => (
              <RowActions row={r} courses={courses} onUpdate={(v) => update(r.id, v)} onDelete={() => remove(r.id)} />
            ),
          },
        ]}
        total={data?.total || 0}
        page={page}
        pageSize={data?.pageSize || 10}
        onPageChange={setPage}
        onSearch={(qq) => {
          setQ(qq)
          setPage(1)
        }}
        actions={
          <div className="flex items-center gap-2">
            <CreateDialog onCreate={create} courses={courses} />
            <CsvImportDialog
              expectedFields={["name", "slug", "code", "semester", "courseSlug"]}
              template={{
                filename: "subjects-template.csv",
                headers: ["name", "slug", "code", "semester", "courseSlug"],
                rows: [["Next Generation Web", "next-generation-web", "CIE-413T", "7", "btech-cse"]],
              }}
              onImport={bulkImport}
            />
          </div>
        }
      />
    </div>
  )
}

function CreateDialog({
  onCreate,
  courses,
}: {
  onCreate: (v: {
    name: string
    slug?: string
    code?: string
    semester?: number | null
    courseId: string
  }) => Promise<void>
  courses: CourseOption[]
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [code, setCode] = useState("")
  const [semester, setSemester] = useState<string>("")
  const [courseId, setCourseId] = useState<string>("")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Subject</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Subject</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Slug (auto if empty)</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label>Code</Label>
              <Input value={code} onChange={(e) => setCode(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Semester</Label>
              <Input
                inputMode="numeric"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                placeholder="1-12"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Course</Label>
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await onCreate({
                  name,
                  slug: slug || undefined,
                  code: code || undefined,
                  semester: semester ? Number(semester) : undefined,
                  courseId,
                })
                setOpen(false)
                setName("")
                setSlug("")
                setCode("")
                setSemester("")
                setCourseId("")
              }}
              disabled={!name || !courseId}
            >
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function RowActions({
  row,
  courses,
  onUpdate,
  onDelete,
}: {
  row: Subject
  courses: CourseOption[]
  onUpdate: (v: Partial<Subject>) => Promise<void>
  onDelete: () => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(row.name)
  const [slug, setSlug] = useState(row.slug)
  const [code, setCode] = useState(row.code || "")
  const [semester, setSemester] = useState<string>(row.semester ? String(row.semester) : "")
  const [courseId, setCourseId] = useState<string>(row.courseId)

  return (
    <div className="flex items-center gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Slug</Label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label>Code</Label>
                <Input value={code} onChange={(e) => setCode(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Semester</Label>
                <Input value={semester} onChange={(e) => setSemester(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Course</Label>
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  await onUpdate({
                    name,
                    slug,
                    code: code || undefined,
                    semester: semester ? Number(semester) : null,
                    courseId,
                  })
                  setOpen(false)
                }}
                disabled={!name || !courseId}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Button size="sm" variant="destructive" onClick={() => void onDelete()}>
        Delete
      </Button>
    </div>
  )
}
