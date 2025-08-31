"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"

export function FileUploader({
  accept = "*/*",
  maxBytes = 10 * 1024 * 1024,
  onUploaded,
}: {
  accept?: string
  maxBytes?: number
  onUploaded: (res: { url: string; path: string }) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function uploadFile(file: File) {
    setError(null)
    if (file.size > maxBytes) {
      setError("File too large")
      return
    }
    const formData = new FormData()
    formData.append("file", file)
    setProgress(0)
    const res = await fetch("/api/upload", { method: "POST", body: formData })
    setProgress(null)
    if (!res.ok) {
      setError("Upload failed")
      return
    }
    const data = await res.json()
    onUploaded(data.file)
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-center ${drag ? "bg-muted" : ""}`}
      onDragOver={(e) => {
        e.preventDefault()
        setDrag(true)
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDrag(false)
        const file = e.dataTransfer.files?.[0]
        if (file) void uploadFile(file)
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) void uploadFile(f)
        }}
      />
      <p className="text-sm text-muted-foreground">Drag & drop or choose a file to upload</p>
      <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
        Choose File
      </Button>
      {progress !== null && <p className="text-xs">Uploading…</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
