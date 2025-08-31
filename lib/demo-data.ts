export type College = { id: string; name: string; slug: string }
export type Course = { id: string; collegeId: string; name: string; slug: string; semesterCount?: number }
export type Subject = { id: string; courseId: string; name: string; slug: string; semester?: number }
export type Note = { id: string; subjectId: string; title: string; type: "pdf" | "web"; url: string }
export type Video = { id: string; subjectId: string; title: string; url: string }

export const demoColleges: College[] = [
  { id: "c-mlu", name: "Modern Learning University", slug: "mlu" },
  { id: "c-nit", name: "National Institute of Tech", slug: "nit" },
  { id: "c-sec", name: "State Engineering College", slug: "sec" }, // added
]

export const demoCourses: Course[] = [
  { id: "cs-btech", collegeId: "c-mlu", name: "B.Tech Computer Science", slug: "btech-cs", semesterCount: 8 },
  { id: "me-btech", collegeId: "c-mlu", name: "B.Tech Mechanical", slug: "btech-me", semesterCount: 8 },
  { id: "cs-nit", collegeId: "c-nit", name: "B.Tech Computer Science", slug: "btech-cs-nit", semesterCount: 8 },
  { id: "bca-sec", collegeId: "c-sec", name: "BCA", slug: "bca-sec", semesterCount: 6 }, // added
  { id: "mba-sec", collegeId: "c-sec", name: "MBA", slug: "mba-sec", semesterCount: 4 }, // added
]

export const demoSubjects: Subject[] = [
  { id: "sub-dsa", courseId: "cs-btech", name: "Data Structures & Algorithms", slug: "dsa", semester: 3 },
  { id: "sub-dbms", courseId: "cs-btech", name: "DBMS", slug: "dbms", semester: 4 },
  { id: "sub-thermo", courseId: "me-btech", name: "Thermodynamics", slug: "thermodynamics", semester: 3 },
  { id: "sub-os", courseId: "cs-btech", name: "Operating Systems", slug: "os", semester: 4 }, // added
  { id: "sub-bca-math", courseId: "bca-sec", name: "Discrete Mathematics", slug: "discrete-math", semester: 1 }, // added
]

export const demoNotes: Note[] = [
  // pdf notes: using public web PDFs so it works without assets
  {
    id: "n-dsa-1",
    subjectId: "sub-dsa",
    title: "DSA Cheat Sheet (PDF)",
    type: "pdf",
    url: "https://www.cs.cmu.edu/~15251f20/handouts/cheatsheet.pdf",
  },
  {
    id: "n-dbms-1",
    subjectId: "sub-dbms",
    title: "DBMS Quick Notes (PDF)",
    type: "pdf",
    url: "https://www3.nd.edu/~zxu2/acms60212-40212/Lec-Notes/notes.pdf",
  },
  // web notes
  {
    id: "n-dsa-2",
    subjectId: "sub-dsa",
    title: "Big-O Notation Guide (Web)",
    type: "web",
    url: "https://www.interviewcake.com/article/python/big-o-notation-time-and-space-complexity",
  },
  {
    id: "n-os-1",
    subjectId: "sub-os",
    title: "Operating Systems Notes (PDF)",
    type: "pdf",
    url: "https://pages.cs.wisc.edu/~remzi/OSTEP/intro.pdf",
  },
  {
    id: "n-bca-1",
    subjectId: "sub-bca-math",
    title: "Discrete Math Cheatsheet (Web)",
    type: "web",
    url: "https://discrete.openmathbooks.org/dmoi3/",
  },
]

export const demoVideos: Video[] = [
  {
    id: "v-dsa-1",
    subjectId: "sub-dsa",
    title: "DSA Playlist (YouTube)",
    url: "https://www.youtube.com/watch?v=8hly31xKli0",
  },
  {
    id: "v-dbms-1",
    subjectId: "sub-dbms",
    title: "DBMS Full Course (YouTube)",
    url: "https://www.youtube.com/watch?v=4Z9KEBexzcM",
  },
  {
    id: "v-os-1",
    subjectId: "sub-os",
    title: "Operating Systems Course (YouTube)",
    url: "https://www.youtube.com/watch?v=ZQPeH4S-Bis",
  },
  {
    id: "v-bca-1",
    subjectId: "sub-bca-math",
    title: "Discrete Mathematics Course (YouTube)",
    url: "https://www.youtube.com/watch?v=YQc9zX04DXs",
  },
]
