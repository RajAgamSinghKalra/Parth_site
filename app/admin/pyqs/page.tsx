import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type PyqRow = {
  id: string
  subject: string
  year: number
  title: string
}

const demo: PyqRow[] = [
  { id: "1", subject: "Mathematics I", year: 2022, title: "Semester 1 Midterm" },
  { id: "2", subject: "Physics", year: 2023, title: "Final Exam" },
]

export default function AdminPyqsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="font-serif text-2xl font-semibold">PYQs</h1>
          <p className="text-sm text-muted-foreground">Manage previous year question papers.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled title="CSV import coming soon">
            Import CSV
          </Button>
          <Button disabled title="Create coming soon">
            Add PYQ
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Input placeholder="Search title or subject…" className="max-w-xs" />
        <Button variant="outline" disabled title="Filtering coming soon">
          Filter
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="grid grid-cols-12 border-b border-border/60 px-4 py-2 text-sm text-muted-foreground">
          <div className="col-span-5">Title</div>
          <div className="col-span-4">Subject</div>
          <div className="col-span-2">Year</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
        <div>
          {demo.map((row) => (
            <div key={row.id} className="grid grid-cols-12 items-center px-4 py-3 border-b last:border-b-0">
              <div className="col-span-5 font-medium">{row.title}</div>
              <div className="col-span-4">{row.subject}</div>
              <div className="col-span-2 tabular-nums">{row.year}</div>
              <div className="col-span-1 flex justify-end gap-2">
                <Button size="sm" variant="outline" disabled title="Edit coming soon">
                  Edit
                </Button>
                <Button size="sm" variant="destructive" disabled title="Delete coming soon">
                  Delete
                </Button>
              </div>
            </div>
          ))}
          {demo.length === 0 && <div className="px-4 py-8 text-center text-sm text-muted-foreground">No PYQs yet.</div>}
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Looking for videos?{" "}
        <Link className="underline underline-offset-4 hover:no-underline" href="/admin/videos">
          Go to Videos
        </Link>
      </div>
    </div>
  )
}
