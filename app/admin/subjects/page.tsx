import { Suspense } from "react"
import SubjectsClient from "./table"

export default function SubjectsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold">Subjects</h1>
      <Suspense fallback={<div>Loading…</div>}>
        <SubjectsClient />
      </Suspense>
    </div>
  )
}
