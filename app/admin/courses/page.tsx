import { Suspense } from "react"
import CoursesClient from "./table"

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold">Courses</h1>
      <Suspense fallback={<div>Loading…</div>}>
        <CoursesClient />
      </Suspense>
    </div>
  )
}
