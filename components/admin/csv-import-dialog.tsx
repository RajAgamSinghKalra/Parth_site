"use client"
import { useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

type Mapping = Record<string, string> // expectedField -> csvHeader

function parseCSV(content: string): { headers: string[]; rows: Record<string, string>[] } {
  // Simple CSV parser with quote handling
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length)
  if (lines.length === 0) return { headers: [], rows: [] }
  const headers = splitCSVLine(lines[0])
  const rows = lines.slice(1).map((line) => {
    const values = splitCSVLine(line)
    const obj: Record<string, string> = {}
    headers.forEach((h, i) => (obj[h] = values[i] ?? ""))
    return obj
  })
  return { headers, rows }
}

function splitCSVLine(line: string): string[] {
  const res: string[] = []
  let cur = ""
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === "," && !inQuotes) {
      res.push(cur)
      cur = ""
    } else {
      cur += ch
    }
  }
  res.push(cur)
  return res.map((s) => s.trim())
}

export function CsvImportDialog({
  expectedFields,
  onImport,
  template,
  triggerLabel = "Bulk Import (CSV)",
}: {
  expectedFields: string[]
  onImport: (rows: Record<string, string>[]) => Promise<void> | void
  template?: { filename: string; headers: string[]; rows?: string[][] }
  triggerLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [csv, setCsv] = useState<{ headers: string[]; rows: Record<string, string>[] } | null>(null)
  const [mapping, setMapping] = useState<Mapping>({})
  const { toast } = useToast()

  const canImport = useMemo(() => {
    return csv && expectedFields.every((f) => mapping[f])
  }, [csv, expectedFields, mapping])

  function downloadTemplate() {
    if (!template) return
    const content = [template.headers.join(","), ...(template.rows || []).map((r) => r.join(","))].join("\n") + "\n"
    const blob = new Blob([content], { type: "text/csv" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = template.filename
    a.click()
    URL.revokeObjectURL(a.href)
  }

  async function handleImport() {
    if (!csv) return
    const rows = csv.rows.map((r) => {
      const obj: Record<string, string> = {}
      expectedFields.forEach((field) => {
        const header = mapping[field]
        obj[field] = r[header] || ""
      })
      return obj
    })
    try {
      await onImport(rows)
      toast({ title: "Imported", description: `${rows.length} rows processed.` })
      setOpen(false)
      setFile(null)
      setCsv(null)
      setMapping({})
    } catch (e: any) {
      toast({ title: "Import failed", description: e.message || "Unknown error", variant: "destructive" })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>CSV Import</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Input
              type="file"
              accept=".csv,text/csv"
              onChange={async (e) => {
                const f = e.target.files?.[0]
                setFile(f || null)
                if (f) {
                  const text = await f.text()
                  const parsed = parseCSV(text)
                  setCsv(parsed)
                }
              }}
            />
            {template && (
              <Button variant="ghost" onClick={downloadTemplate}>
                Download template
              </Button>
            )}
          </div>
          {csv && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Map CSV columns to fields:</p>
              {expectedFields.map((f) => (
                <div key={f} className="grid grid-cols-2 items-center gap-2">
                  <Label className="text-sm">{f}</Label>
                  <Select value={mapping[f]} onValueChange={(v) => setMapping((m) => ({ ...m, [f]: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select CSV column" />
                    </SelectTrigger>
                    <SelectContent>
                      {csv.headers.map((h) => (
                        <SelectItem key={h} value={h}>
                          {h}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!canImport}>
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
