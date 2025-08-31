"use client"

import useSWR from "swr"
import { useState } from "react"
import { DataTable } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { FileUploader } from "@/components/admin/file-uploader"
import { CsvImportDialog } from "@/components/admin/csv-import-dialog"

type Subject = { id: string; name: string; slug: string; course: { college: { name: string }; name: string } }
type Material = {
  id: string
  subjectId: string
  type: "NOTES" | "SYLLABUS" | "GUIDE" | "ASSIGNMENT" | "PPT" | "OTHER"
  title: string
  description: string | null
  fileUrl: string | null
  externalUrl: string | null
  tags: string[]
  year: number | null
  author: string | null
  subject?: Subject
}

const fetcher = (u: string) => fetch(u).then((r) => r.json())
const TYPES = ["NOTES", "SYLLABUS", "GUIDE", "ASSIGNMENT", "PPT", "OTHER"] as const

export default function MaterialsClient() {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState("")
  const [subjectFilter, setSubjectFilter] = useState<string>("")
  const [typeFilter, setTypeFilter] = useState<string>("")
  const apiUrl = `/api/materials?page=${page}&q=${encodeURIComponent(q)}${
    subjectFilter ? `&subjectId=${encodeURIComponent(subjectFilter)}` : ""
  }${typeFilter ? `&type=${encodeURIComponent(typeFilter)}` : ""}`

  const { data, mutate } = useSWR<{ items: Material[]; total: number; page: number; pageSize: number }>(apiUrl, fetcher)
  const { data: subjectsData } = useSWR<{ items: Subject[] }>(`/api/subjects?page=1&pageSize=1000`, fetcher)

  const { toast } = useToast()

  async function create(values: Omit<Material, "id">) {
    const res = await fetch("/api/materials", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    })
    if (!res.ok) throw new Error("Create failed")
    toast({ title: "Created" })
    mutate()
  }

  async function update(id: string, values: Partial<Material>) {
    const res = await fetch(`/api/materials/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    })
    if (!res.ok) throw new Error("Update failed")
    toast({ title: "Updated" })
    mutate()
  }

  async function remove(id: string) {
    if (!confirm("Delete this material?")) return
    const res = await fetch(`/api/materials/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error("Delete failed")
    toast({ title: "Deleted" })
    mutate()
  }

  async function bulkImport(rows: Record<string, string>[]) {
    // Expected: title,type,subjectSlug,year,author,tags,externalUrl,fileUrl,description
    for (const r of rows) {
      if (!r.title || !r.type || !r.subjectSlug) continue
      const subj = subjectsData?.items.find((s) => s.slug.toLowerCase() === r.subjectSlug.toLowerCase())
      if (!subj) continue
      const tags = (r.tags || "")
        .split(/[|,]/)
        .map((t) => t.trim())
        .filter(Boolean)
      const year = r.year ? Number(r.year) : undefined
      const description = r.description || undefined
      await create({
        subjectId: subj.id,
        type: (r.type.toUpperCase() as Material["type"]) || "OTHER",
        title: r.title,
        description: description ?? null,
        fileUrl: r.fileUrl || null,
        externalUrl: r.externalUrl || null,
        tags,
        year: Number.isFinite(year as number) ? (year as number) : null,
        author: r.author || null,
      } as any)
    }
  }

  const subjects = subjectsData?.items || []

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Label className="text-sm">Subject</Label>
          <Select value={subjectFilter} onValueChange={(v) => setSubjectFilter(v === "all" ? "" : v)}>
            <SelectTrigger className="w-72">
              <SelectValue placeholder="All subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All subjects</SelectItem>
              {subjects.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name} ({s.course?.name} • {s.course?.college?.name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-sm">Type</Label>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v === "all" ? "" : v)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        rows={data?.items || []}
        columns={[
          { key: "title", header: "Title" },
          { key: "type", header: "Type", className: "hidden sm:table-cell" },
          {
            key: "subject",
            header: "Subject",
            render: (r) => (r.subject ? `${r.subject.name}` : ""),
            className: "hidden md:table-cell",
          },
          {
            key: "year",
            header: "Year",
            render: (r) => r.year ?? "—",
            className: "hidden lg:table-cell",
          },
          {
            key: "tags",
            header: "Tags",
            render: (r) =>
              r.tags?.length ? (
                <div className="flex flex-wrap gap-1">
                  {r.tags.map((t) => (
                    <span key={t} className="rounded bg-accent px-1.5 py-0.5 text-xs text-accent-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              ),
            className: "hidden xl:table-cell",
          },
          {
            key: "actions",
            header: "Actions",
            render: (r) => (
              <RowActions row={r} subjects={subjects} onUpdate={(v) => update(r.id, v)} onDelete={() => remove(r.id)} />
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
            <CreateDialog subjects={subjects} onCreate={create} />
            <CsvImportDialog
              expectedFields={[
                "title",
                "type",
                "subjectSlug",
                "year",
                "author",
                "tags",
                "externalUrl",
                "fileUrl",
                "description",
              ]}
              template={{
                filename: "materials-template.csv",
                headers: [
                  "title",
                  "type",
                  "subjectSlug",
                  "year",
                  "author",
                  "tags",
                  "externalUrl",
                  "fileUrl",
                  "description",
                ],
                rows: [
                  [
                    "Next Gen Web - Key Notes",
                    "NOTES",
                    "next-generation-web",
                    "2024",
                    "StudySprint Team",
                    "Important|Formula",
                    "",
                    "",
                    "Concise notes",
                  ],
                ],
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
  subjects,
  onCreate,
}: {
  subjects: Subject[]
  onCreate: (v: {
    subjectId: string
    type: Material["type"]
    title: string
    description?: string | null
    fileUrl?: string | null
    externalUrl?: string | null
    tags?: string[]
    year?: number | null
    author?: string | null
  }) => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [subjectId, setSubjectId] = useState("")
  const [type, setType] = useState<Material["type"]>("NOTES")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [externalUrl, setExternalUrl] = useState("")
  const [tags, setTags] = useState("")
  const [year, setYear] = useState("")
  const [author, setAuthor] = useState("")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Material</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>New Material</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="space-y-1">
            <Label>Subject</Label>
            <Select value={subjectId} onValueChange={setSubjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Year</Label>
              <Input inputMode="numeric" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="space-y-1">
            <Label>File upload</Label>
            <FileUploader accept="application/pdf,image/*" onUploaded={(f) => setFileUrl(f.url)} />
            {fileUrl && <p className="text-xs break-all text-muted-foreground">Uploaded: {fileUrl}</p>}
          </div>
          <div className="space-y-1">
            <Label>External URL</Label>
            <Input
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
            />
          </div>
          <div className="space-y-1">
            <Label>Tags (comma or | separated)</Label>
            <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Important, Formula" />
          </div>
          <div className="space-y-1">
            <Label>Author</Label>
            <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                const tagList = tags
                  .split(/[|,]/)
                  .map((t) => t.trim())
                  .filter(Boolean)
                await onCreate({
                  subjectId,
                  type,
                  title,
                  description: description || undefined,
                  fileUrl: fileUrl || undefined,
                  externalUrl: externalUrl || undefined,
                  tags: tagList,
                  year: year ? Number(year) : undefined,
                  author: author || undefined,
                })
                setOpen(false)
                setSubjectId("")
                setType("NOTES")
                setTitle("")
                setDescription("")
                setFileUrl(null)
                setExternalUrl("")
                setTags("")
                setYear("")
                setAuthor("")
              }}
              disabled={!subjectId || !title}
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
  subjects,
  onUpdate,
  onDelete,
}: {
  row: Material
  subjects: Subject[]
  onUpdate: (v: Partial<Material>) => Promise<void>
  onDelete: () => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [subjectId, setSubjectId] = useState(row.subjectId)
  const [type, setType] = useState<Material["type"]>(row.type)
  const [title, setTitle] = useState(row.title)
  const [description, setDescription] = useState(row.description || "")
  const [fileUrl, setFileUrl] = useState<string | null>(row.fileUrl)
  const [externalUrl, setExternalUrl] = useState(row.externalUrl || "")
  const [tags, setTags] = useState((row.tags || []).join(", "))
  const [year, setYear] = useState(row.year ? String(row.year) : "")
  const [author, setAuthor] = useState(row.author || "")

  return (
    <div className="flex items-center gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Material</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="space-y-1">
              <Label>Subject</Label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label>Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Year</Label>
                <Input inputMode="numeric" value={year} onChange={(e) => setYear(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>
            <div className="space-y-1">
              <Label>File upload</Label>
              <FileUploader accept="application/pdf,image/*" onUploaded={(f) => setFileUrl(f.url)} />
              {fileUrl && <p className="text-xs break-all text-muted-foreground">Uploaded: {fileUrl}</p>}
            </div>
            <div className="space-y-1">
              <Label>External URL</Label>
              <Input value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Tags</Label>
              <Input value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Author</Label>
              <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  const tagList = tags
                    .split(/[|,]/)
                    .map((t) => t.trim())
                    .filter(Boolean)
                  await onUpdate({
                    subjectId,
                    type,
                    title,
                    description: description || undefined,
                    fileUrl: fileUrl || undefined,
                    externalUrl: externalUrl || undefined,
                    tags: tagList,
                    year: year ? Number(year) : null,
                    author: author || undefined,
                  } as any)
                  setOpen(false)
                }}
                disabled={!subjectId || !title}
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
