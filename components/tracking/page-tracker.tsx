"use client"

import { useEffect } from "react"
import { useUserState } from "@/components/user-state"

export function PageTracker(props: { title: string; href: string; type?: "nav" | "material" | "pyq" | "video" }) {
  const { addRecent } = useUserState()
  useEffect(() => {
    addRecent({ title: props.title, href: props.href, type: props.type || "nav" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.title, props.href, props.type])
  return null
}
