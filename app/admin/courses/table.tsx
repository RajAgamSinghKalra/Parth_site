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

type Course = {
  id: string
  name: string
  slug: string
  collegeId: string
  college: { id: string; name: string }
}

type College = { id: string; name: string }

const fetcher = (u: string) => fetch(u).then((r) => r.json())

export default function CoursesClient() {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState("")
  const [collegeFilter, setCollegeFilter] = useState<string>("all")
  const apiUrl = `/api/courses?page=${page}&q=${encodeURIComponent(q)}${
    collegeFilter && collegeFilter !== "all" ? `&collegeId=${encodeURIComponent(collegeFilter)}` : ""
  }`
  const { data, mutate } = useSWR<{ items: Course[]; total: number; page: number; pageSize: number }>(apiUrl, fetcher)
  const { data: colleges } = useSWR<{ items: College[]; total: number }>(`/api/colleges?page=1&pageSize=1000`, fetcher)
  const { toast } = useToast()

  async function create(values: { name: string; slug?: string; collegeId: string }) {
    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    })
    if (!res.ok) throw new Error("Create failed")
    toast({ title: "Created" })
    mutate()
  }

  async function update(id: string, values: Partial<Course>) {
    const res = await fetch(`/api/courses/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    })
    if (!res.ok) throw new Error("Update failed")
    toast({ title: "Updated" })
    mutate()
  }

  async function remove(id: string) {
    const res = await fetch(`/api/courses/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error("Delete failed")
    toast({ title: "Deleted" })
    mutate()
  }

  async function bulkImport(rows: Record<string, string>[]) {
    for (const r of rows) {
      if (!r.name || !r.collegeName) continue
      // find college by name
      const c = colleges?.items.find((x) => x.name.toLowerCase() === r.collegeName.toLowerCase())
      if (!c) continue
      await create({ name: r.name, slug: r.slug || undefined, collegeId: c.id })
    }
  }

  const collegeOptions = colleges?.items || []

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label className="text-sm">Filter by College</Label>
        <Select value={collegeFilter} onValueChange={setCollegeFilter}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="All colleges" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All colleges</SelectItem>
            {collegeOptions.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
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
          { key: "college", header: "College", render: (r) => r.college?.name || "" },
          {
            key: "actions",
            header: "Actions",
            render: (r) => (
              <RowActions
                row={r}
                colleges={collegeOptions}
                onUpdate={(v) => update(r.id, v)}
                onDelete={() => remove(r.id)}
              />
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
            <CreateDialog onCreate={create} colleges={collegeOptions} />
            <CsvImportDialog
              expectedFields={["name", "slug", "collegeName"]}
              template={{
                filename: "courses-template.csv",
                headers: ["name", "slug", "collegeName"],
                rows: [["B.Tech CSE", "btech-cse", "Guru Gobind Singh Indraprastha University (GGSIPU)"]],
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
  colleges,
}: {
  onCreate: (v: { name: string; slug?: string; collegeId: string }) => Promise<void>
  colleges: College[]
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [collegeId, setCollegeId] = useState<string>("all")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Course</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Course</DialogTitle>
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
          <div className="space-y-1">
            <Label>College</Label>
            <Select value={collegeId} onValueChange={setCollegeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select college" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All colleges</SelectItem>
                {colleges.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
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
                await onCreate({ name, slug: slug || undefined, collegeId })
                setOpen(false)
                setName("")
                setSlug("")
                setCollegeId("all")
              }}
              disabled={!name || !collegeId || collegeId === "all"}
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
  colleges,
  onUpdate,
  onDelete,
}: {
  row: Course
  colleges: College[]
  onUpdate: (v: Partial<Course>) => Promise<void>
  onDelete: () => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(row.name)
  const [slug, setSlug] = useState(row.slug)
  const [collegeId, setCollegeId] = useState<string>(row.collegeId)

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
            <DialogTitle>Edit Course</DialogTitle>
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
            <div className="space-y-1">
              <Label>College</Label>
              <Select value={collegeId} onValueChange={setCollegeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select college" />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
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
                  await onUpdate({ name, slug, collegeId })
                  setOpen(false)
                }}
                disabled={!name || !collegeId}
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
