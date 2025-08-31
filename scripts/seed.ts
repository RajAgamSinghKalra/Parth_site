// Seed script for StudySprint demo data
// Usage in v0: run this script from the /scripts runner

import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/slug"

async function main() {
  const collegeName = "Guru Gobind Singh Indraprastha University (GGSIPU)"
  const collegeSlug = "ggsipu"

  const college = await prisma.college.upsert({
    where: { slug: collegeSlug },
    update: {},
    create: { name: collegeName, slug: collegeSlug, location: "Delhi, India" },
  })

  const courseName = "B.Tech CSE"
  const courseSlug = "btech-cse"

  const course = await prisma.course.upsert({
    where: { collegeId_slug: { collegeId: college.id, slug: courseSlug } },
    update: {},
    create: {
      name: courseName,
      slug: courseSlug,
      collegeId: college.id,
    },
  })

  const subjects = [
    { name: "Next Generation Web", code: "CIE-413T", semester: 7 },
    { name: "Intellectual Property Rights", code: undefined, semester: 7 },
    { name: "Machine Learning", code: undefined, semester: 6 },
    { name: "RL & DL", code: undefined, semester: 7 },
    { name: "Pattern Recognition & Computer Vision", code: undefined, semester: 7 },
  ]

  const createdSubjects = []
  for (const s of subjects) {
    const slug = slugify(s.name)
    const subject = await prisma.subject.upsert({
      where: { courseId_slug: { courseId: course.id, slug } },
      update: {},
      create: {
        name: s.name,
        code: s.code,
        semester: s.semester ?? null,
        slug,
        courseId: course.id,
      },
    })
    createdSubjects.push(subject)
  }

  // Helper to create two materials, one PYQ (2024 Endsem), and one video per subject
  const sampleYouTubeIds = ["dQw4w9WgXcQ", "jNQXAC9IVRw", "3GwjfUFyY6M", "aqz-KE-bpKQ", "Zi_XLOBDo_Y"]

  for (const [idx, subj] of createdSubjects.entries()) {
    await prisma.material.createMany({
      data: [
        {
          subjectId: subj.id,
          type: "NOTES",
          title: `${subj.name} - Key Notes`,
          description: "Concise notes covering core topics.",
          tags: ["Important", "Formula"],
          year: 2024,
          author: "StudySprint Team",
        },
        {
          subjectId: subj.id,
          type: "GUIDE",
          title: `${subj.name} - Quick Guide`,
          description: "High-level guide for revision.",
          tags: ["Revision"],
          year: 2024,
          author: "StudySprint Team",
        },
      ],
    })

    await prisma.pYQ.create({
      data: {
        subjectId: subj.id,
        year: 2024,
        examType: "Endsem",
        fileUrl: "/uploads/sample-pyq.pdf",
        solutionsUrl: "/uploads/sample-solution.pdf",
        tags: ["2024", "Endsem"],
      },
    })

    await prisma.video.create({
      data: {
        subjectId: subj.id,
        youtubeId: sampleYouTubeIds[idx % sampleYouTubeIds.length],
        title: `${subj.name} Explained`,
        description: "Hand-picked lecture for the subject.",
        tags: ["Lecture"],
      },
    })
  }

  console.log("[seed] Completed successfully")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
