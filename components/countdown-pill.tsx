"use client"
import { useEffect, useMemo, useState } from "react"
import { Hourglass } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type ExamMap = Record<string, string>

function parseCookie(): ExamMap {
  if (typeof document === "undefined") return {}
  const cookie = document.cookie.split("; ").find((c) => c.startsWith("studysprint_exam_dates="))
  if (!cookie) return {}
  try {
    const value = decodeURIComponent(cookie.split("=")[1] || "")
    return JSON.parse(value) as ExamMap
  } catch {
    return {}
  }
}

function writeCookie(map: ExamMap) {
  if (typeof document === "undefined") return
  const value = encodeURIComponent(JSON.stringify(map))
  document.cookie = `studysprint_exam_dates=${value}; Path=/; Max-Age=${60 * 60 * 24 * 365}`
}

function getNearest(exams: ExamMap): Date | null {
  const upcoming = Object.values(exams)
    .map((iso) => new Date(iso))
    .filter((d) => d.getTime() > Date.now())
    .sort((a, b) => a.getTime() - b.getTime())
  return upcoming[0] || null
}

export function CountdownPill() {
  const [target, setTarget] = useState<Date | null>(null)
  const [now, setNow] = useState<number>(Date.now())
  const [open, setOpen] = useState(false)
  const [examName, setExamName] = useState("")
  const [examDate, setExamDate] = useState<string>("")

  useEffect(() => {
    const map = parseCookie()
    setTarget(getNearest(map))
    const t = setInterval(() => setNow(Date.now()), 1000 * 15)
    return () => clearInterval(t)
  }, [])

  function handleSave() {
    if (!examDate) return
    const date = new Date(examDate)
    if (isNaN(date.getTime())) return
    const map = parseCookie()
    const name = (examName || "Next Exam").slice(0, 80)
    const iso = date.toISOString()
    map[name] = iso
    writeCookie(map)
    setTarget(getNearest(map))
    setOpen(false)
  }

  function handleClear() {
    writeCookie({})
    setTarget(null)
    setExamName("")
    setExamDate("")
    setOpen(false)
  }

  const timeLeft = useMemo(() => {
    if (!target) return null
    const diff = target.getTime() - now
    if (diff <= 0) return { d: 0, h: 0, m: 0 }
    const d = Math.floor(diff / (1000 * 60 * 60 * 24))
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const m = Math.floor((diff / (1000 * 60)) % 60)
    return { d, h, m }
  }, [target, now])

  return (
    <>
      <button
        type="button"
        aria-label="Set or view exam countdown"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-input bg-background px-3 py-1.5 text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <Hourglass className="h-4 w-4" aria-hidden="true" />
        {timeLeft ? (
          <span className="tabular-nums">
            {timeLeft.d}d:{timeLeft.h}h:{timeLeft.m}m
          </span>
        ) : (
          <span className="text-muted-foreground">Set Exam</span>
        )}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set upcoming exam</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="exam-name">Exam name</Label>
              <Input
                id="exam-name"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="Midterm / Finals / Gate"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="exam-date">Date & time</Label>
              <Input
                id="exam-date"
                type="datetime-local"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
            <Button onClick={handleSave} disabled={!examDate}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
