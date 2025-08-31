import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminDashboardPage() {
  let colleges = 0,
    courses = 0,
    subjects = 0,
    materials = 0,
    pyqs = 0,
    videos = 0
  try {
    const { prisma } = await import("@/lib/prisma")
    const results = await Promise.all([
      prisma.college.count(),
      prisma.course.count(),
      prisma.subject.count(),
      prisma.material.count(),
      prisma.pYQ.count(),
      prisma.video.count(),
    ])
    ;[colleges, courses, subjects, materials, pyqs, videos] = results
  } catch {
    // prisma not available or schema not migrated yet; show zeros so dashboard still renders
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold">Dashboard</h1>
        <div className="flex gap-2">
          <Button asChild variant="default">
            <Link href="/admin/manage">Open Manage (Demo)</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/colleges">Colleges</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/courses">Courses</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/subjects">Subjects</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/materials">Materials</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/pyqs">PYQs</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/videos">Videos</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Kpi label="#Colleges" value={colleges} />
        <Kpi label="#Courses" value={courses} />
        <Kpi label="#Subjects" value={subjects} />
        <Kpi label="#Materials" value={materials} />
        <Kpi label="#PYQs" value={pyqs} />
        <Kpi label="#Videos" value={videos} />
      </div>
    </div>
  )
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  )
}
