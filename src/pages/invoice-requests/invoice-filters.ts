import type { InvoiceRequestRow } from './mock-data'

export interface InvoiceFilters {
  keyword: string // Tìm kiếm — contractNo + holderName + receiverName + phone + taxCode
  sort: 'moi-nhat' | 'cu-nhat'
}

export const DEFAULT_FILTERS: InvoiceFilters = {
  keyword: '',
  sort: 'moi-nhat',
}

function hasText(value: string, query: string): boolean {
  const q = query.trim()
  if (!q) return true
  return value.toLowerCase().includes(q.toLowerCase())
}

export function applyFilters(rows: InvoiceRequestRow[], f: InvoiceFilters): InvoiceRequestRow[] {
  const filtered = rows.filter(
    (row) =>
      !f.keyword.trim() ||
      hasText(row.contractNo, f.keyword) ||
      hasText(row.holderName, f.keyword) ||
      hasText(row.receiverName, f.keyword) ||
      hasText(row.phone, f.keyword) ||
      hasText(row.taxCode, f.keyword),
  )
  // immutable sort by createdAt (ISO strings sort lexically): "mới nhất" = newest first.
  return [...filtered].sort((a, b) =>
    f.sort === 'moi-nhat'
      ? b.createdAt.localeCompare(a.createdAt)
      : a.createdAt.localeCompare(b.createdAt),
  )
}
