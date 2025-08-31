export type StudentPrefs = {
  collegeId: string
  courseId: string
  semester?: number
}

const KEYS = {
  prefs: "studysprint:prefs",
  colleges: "studysprint:colleges",
  courses: "studysprint:courses",
  subjects: "studysprint:subjects",
  notes: "studysprint:notes",
  videos: "studysprint:videos",
} as const

// SSR guard helpers
const isBrowser = () => typeof window !== "undefined"

import { demoColleges, demoCourses, demoSubjects, demoNotes, demoVideos } from "./demo-data"

type KeyName = keyof typeof KEYS

function readArray<T = any>(key: KeyName): T[] {
  if (!isBrowser()) return []
  const raw = localStorage.getItem(KEYS[key])
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export const DemoStore = {
  // initialize store with defaults if empty
  initIfEmpty(payload: {
    colleges: any[]
    courses: any[]
    subjects: any[]
    notes: any[]
    videos: any[]
  }) {
    if (!isBrowser()) return
    for (const [key, data] of Object.entries(payload)) {
      const storageKey = (KEYS as any)[key]
      if (storageKey && !localStorage.getItem(storageKey)) {
        localStorage.setItem(storageKey, JSON.stringify(data))
      }
    }
  },

  getPrefs(): StudentPrefs | null {
    if (!isBrowser()) return null
    const raw = localStorage.getItem(KEYS.prefs)
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  },

  setPrefs(prefs: StudentPrefs) {
    if (!isBrowser()) return
    localStorage.setItem(KEYS.prefs, JSON.stringify(prefs))
  },

  // entity getters/setters
  get(key: keyof typeof KEYS) {
    return readArray(key)
  },

  set(key: keyof typeof KEYS, data: any[]) {
    if (!isBrowser()) return
    localStorage.setItem(KEYS[key], JSON.stringify(data))
  },

  clearPrefs() {
    if (typeof window === "undefined") return
    localStorage.removeItem(KEYS.prefs)
  },
}

export function seedDemoDataIfNeeded() {
  DemoStore.initIfEmpty({
    colleges: demoColleges,
    courses: demoCourses,
    subjects: demoSubjects,
    notes: demoNotes,
    videos: demoVideos,
  })
}

export function getColleges() {
  seedDemoDataIfNeeded()
  return readArray("colleges") as import("./demo-data").College[]
}

export function getCourses() {
  seedDemoDataIfNeeded()
  return readArray("courses") as import("./demo-data").Course[]
}

export function getSubjects() {
  seedDemoDataIfNeeded()
  return readArray("subjects") as import("./demo-data").Subject[]
}

export function getNotes() {
  seedDemoDataIfNeeded()
  return readArray("notes") as import("./demo-data").Note[]
}

export function getVideos() {
  seedDemoDataIfNeeded()
  return readArray("videos") as import("./demo-data").Video[]
}

export function getCoursesByCollege(collegeSlug: string) {
  const colleges = getColleges()
  const courses = getCourses()
  const college = colleges.find((c) => c.slug === collegeSlug)
  if (!college) return []
  return courses.filter((co) => co.collegeId === college.id)
}

export function getSemestersForCourse(courseSlug: string) {
  const courses = getCourses()
  const course = courses.find((c) => c.slug === courseSlug)
  if (!course) return []
  const count = Math.max(1, course.semesterCount || 8)
  return Array.from({ length: count }, (_, i) => i + 1)
}

// Re-export existing prefs helpers with consistent names for callers
export const getPrefs = () => DemoStore.getPrefs()
export const setPrefs = (prefs: StudentPrefs) => DemoStore.setPrefs(prefs)

export function clearAllDemoData() {
  if (typeof window === "undefined") return
  ;(Object.keys(KEYS) as KeyName[]).forEach((k) => {
    if (k !== "prefs") localStorage.removeItem(KEYS[k])
  })
}

export { KEYS }
