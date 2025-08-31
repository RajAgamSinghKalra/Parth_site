export function getPagination(searchParams: URLSearchParams) {
  const page = Math.max(1, Number(searchParams.get("page") || 1))
  const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") || 10)))
  const q = (searchParams.get("q") || "").trim()
  return { page, pageSize, q }
}
