"use client"
import { useEffect, useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { DemoStore, seedDemoDataIfNeeded, getColleges, getCourses } from "@/lib/demo-store"
import { demoColleges, demoCourses } from "@/lib/demo-data" // fallback data if storage empty

type Props = {
  openOverride?: boolean
}

export default function OnboardingDialog({ openOverride }: Props) {
  const [open, setOpen] = useState(false)
  const [collegeId, setCollegeId] = useState<string>("")
  const [courseId, setCourseId] = useState<string>("")
  const [semester, setSemester] = useState<string>("")
  const [colleges, setColleges] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])

  // seed example data if needed and load options (with fallback)
  useEffect(() => {
    seedDemoDataIfNeeded()
    const loadedColleges = getColleges()
    const loadedCourses = getCourses()

    setColleges(loadedColleges.length ? loadedColleges : demoColleges) // fallback
    setCourses(loadedCourses.length ? loadedCourses : demoCourses) // fallback
  }, [])

  // show when no prefs
  useEffect(() => {
    const prefs = DemoStore.getPrefs()
    setOpen(openOverride ?? !prefs)
  }, [openOverride])

  useEffect(() => {
    if (!collegeId && colleges.length > 0) {
      setCollegeId(colleges[0].id)
    }
  }, [colleges, collegeId])

  useEffect(() => {
    if (!collegeId) {
      setCourseId("")
      return
    }
    const allowed = courses
      .filter((c: any) => c.collegeId === collegeId)
      .sort((a: any, b: any) => a.name.localeCompare(b.name))
    if (!allowed.length) {
      setCourseId("")
      return
    }
    if (!allowed.some((c) => c.id === courseId)) {
      setCourseId(allowed[0].id)
    }
  }, [collegeId, courses]) // drop courseId from deps so we don't fight user selection

  useEffect(() => {
    if (!courseId) {
      setSemester("")
      return
    }
    const course = courses.find((c: any) => c.id === courseId)
    const count = Math.max(1, course?.semesterCount || 8)
    const current = Number(semester || "0")
    if (!current || current < 1) {
      setSemester("1")
    } else if (current > count) {
      setSemester(String(count))
    }
  }, [courseId, courses]) // simplified deps

  const coursesForCollege = useMemo(
    () => courses.filter((c: any) => !collegeId || c.collegeId === collegeId),
    [courses, collegeId],
  )

  const semestersForCourse = useMemo(() => {
    const course = courses.find((c: any) => c.id === courseId)
    const count = Math.max(1, course?.semesterCount || 8) // clamp to at least 1
    return Array.from({ length: count }, (_, i) => i + 1)
  }, [courses, courseId])

  function handleSave() {
    if (!collegeId || !courseId) return
    const course = courses.find((c: any) => c.id === courseId)
    const count = Math.max(1, course?.semesterCount || 8)
    const semNum = semester ? Math.min(Math.max(1, Number(semester)), count) : 1
    DemoStore.setPrefs({ collegeId, courseId, semester: semNum })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-pretty">Tell us about your program</DialogTitle>
          <DialogDescription>We’ll tailor notes, PYQs, and videos to your college and course.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>College</Label>
            <Select value={collegeId} onValueChange={setCollegeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select your college" />
              </SelectTrigger>
              <SelectContent>
                {colleges.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Course</Label>
            <Select value={courseId} onValueChange={setCourseId} disabled={!collegeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select your course" />
              </SelectTrigger>
              <SelectContent>
                {coursesForCollege.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Semester (optional)</Label>
            <Select value={semester} onValueChange={setSemester} disabled={!courseId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose semester" />
              </SelectTrigger>
              <SelectContent>
                {semestersForCourse.map((n) => (
                  <SelectItem key={n} value={String(n)}>{`Semester ${n}`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Skip
          </Button>
          <Button onClick={handleSave} disabled={!collegeId || !courseId}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
