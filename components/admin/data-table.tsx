"use client"
import { useMemo, useState } from "react"
import type React from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Column<T> = {
  key: keyof T | string
  header: string
  render?: (row: T) => React.ReactNode
  className?: string
}

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  total,
  page,
  pageSize,
  onPageChange,
  onSearch,
  actions,
  searchPlaceholder = "Search…",
}: {
  rows: T[]
  columns: Column<T>[]
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onSearch: (q: string) => void
  actions?: React.ReactNode
  searchPlaceholder?: string
}) {
  const [q, setQ] = useState("")

  const pageCount = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Input
            placeholder={searchPlaceholder}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch(q)}
            className="w-64"
          />
          <Button variant="outline" onClick={() => onSearch(q)}>
            Search
          </Button>
        </div>
        <div className="flex items-center gap-2">{actions}</div>
      </div>
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={String(c.key)} className={c.className}>
                  {c.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                {columns.map((c) => (
                  <TableCell key={String(c.key)} className={c.className}>
                    {c.render ? c.render(row) : (row as any)[c.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-sm text-muted-foreground">
                  No results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {(page - 1) * pageSize + 1} - {Math.min(total, page * pageSize)} of {total}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm tabular-nums">
            {page} / {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(pageCount, page + 1))}
            disabled={page >= pageCount}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
