import { Suspense } from "react"
import CollegesClient from "./table"

export default function CollegesPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold">Colleges</h1>
      <Suspense fallback={<div>Loading…</div>}>
        <CollegesClient />
      </Suspense>
    </div>
  )
}
