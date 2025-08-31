"use client"
import { useState } from "react"

export default function SubmitMaterialPage() {
  const [submitted, setSubmitted] = useState(false)
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">Submit Material</h1>
      {!submitted ? (
        <form
          className="grid max-w-xl gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            setSubmitted(true)
          }}
        >
          <input required placeholder="Title" className="rounded-md border px-3 py-2" />
          <input required placeholder="URL (PDF, webpage, or YouTube)" className="rounded-md border px-3 py-2" />
          <textarea placeholder="Notes (optional)" className="rounded-md border px-3 py-2" />
          <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground">Submit</button>
        </form>
      ) : (
        <p className="text-green-600">Thanks! In this demo, submissions aren’t sent to a server.</p>
      )}
    </main>
  )
}
