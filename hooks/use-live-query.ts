import { useEffect, useState } from "react"

export function useLiveQuery<T>(url: string, interval = 10000) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let active = true
    async function fetchData() {
      try {
        const res = await fetch(url, { cache: "no-store" })
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
        const json = await res.json()
        if (active) setData(json)
      } catch (err) {
        if (active) setError(err as Error)
      }
    }
    fetchData()
    const id = setInterval(fetchData, interval)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [url, interval])

  return { data, error }
}

export default useLiveQuery
