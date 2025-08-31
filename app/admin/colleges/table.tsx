"use client"

import useSWR from "swr"
import { useState } from "react"
import { DataTable } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { FileUploader } from "@/components/admin/file-uploader"

type College = {
  id: string
  name: string
  slug: string
  location: string | null
  logoUrl: string | null
  createdAt: string
  updatedAt: string
}

const fetcher = (u: string) => fetch(u).then((r) => r.json())

export default function CollegesClient() {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState("")
  const { data, mutate, isLoading } = useSWR<{ items: College[]; total: number; page: number; pageSize: number }>(
    `/api/colleges?page=${page}&q=${encodeURIComponent(q)}`,
    fetcher,
  )
  const { toast } = useToast()

  async function create(values: Partial<College>) {
    const res = await fetch("/api/colleges", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    })
    if (!res.ok) throw new Error("Create failed")
    toast({ title: "Created" })
    mutate()
  }

  async function update(id: string, values: Partial<College>) {
    const res = await fetch(`/api/colleges/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    })
    if (!res.ok) throw new Error("Update failed")
    toast({ title: "Updated" })
    mutate()
  }

  async function remove(id: string) {
    const res = await fetch(`/api/colleges/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error("Delete failed")
    toast({ title: "Deleted" })
    mutate()
  }

  return (
    <div className="space-y-4">
      <DataTable
        rows={data?.items || []}
        columns={[
          { key: "name", header: "Name" },
          { key: "slug", header: "Slug", className: "hidden md:table-cell" },
          { key: "location", header: "Location", className: "hidden sm:table-cell" },
          {
            key: "logoUrl",
            header: "Logo",
            render: (r) =>
              r.logoUrl ? (
                <img src={r.logoUrl || "/placeholder.svg"} alt={`${r.name} logo`} className="h-6 w-6 rounded" />
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              ),
          },
          {
            key: "actions",
            header: "Actions",
            render: (r) => <RowActions row={r} onUpdate={(v) => update(r.id, v)} onDelete={() => remove(r.id)} />,
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
        actions={<CreateDialog onCreate={create} />}
      />
      {isLoading && <div className="text-sm text-muted-foreground">Loading…</div>}
    </div>
  )
}

function CreateDialog({ onCreate }: { onCreate: (values: Partial<College>) => Promise<void> }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [location, setLocation] = useState("")
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add College</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New College</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="slug">Slug (auto from name if empty)</Label>
            <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Logo</Label>
            <FileUploader accept="image/*" onUploaded={(f) => setLogoUrl(f.url)} />
            {logoUrl && <p className="text-xs text-muted-foreground break-all">Uploaded: {logoUrl}</p>}
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
                  location: location || undefined,
                  logoUrl: logoUrl || undefined,
                })
                setOpen(false)
                setName("")
                setSlug("")
                setLocation("")
                setLogoUrl(null)
              }}
              disabled={!name}
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
  onUpdate,
  onDelete,
}: {
  row: College
  onUpdate: (values: Partial<College>) => Promise<void>
  onDelete: () => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(row.name)
  const [slug, setSlug] = useState(row.slug)
  const [location, setLocation] = useState(row.location || "")
  const [logoUrl, setLogoUrl] = useState<string | null>(row.logoUrl)

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
            <DialogTitle>Edit College</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Logo</Label>
              <FileUploader accept="image/*" onUploaded={(f) => setLogoUrl(f.url)} />
              {logoUrl && <p className="text-xs text-muted-foreground break-all">Uploaded: {logoUrl}</p>}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  await onUpdate({ name, slug, location: location || undefined, logoUrl: logoUrl || undefined })
                  setOpen(false)
                }}
                disabled={!name}
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
