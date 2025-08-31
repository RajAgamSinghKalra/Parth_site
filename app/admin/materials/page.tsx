import { Suspense } from "react"
import MaterialsClient from "./table"

export default function MaterialsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold">Materials</h1>
      <Suspense fallback={<div>Loading…</div>}>
        <MaterialsClient />
      </Suspense>
    </div>
  )
}
