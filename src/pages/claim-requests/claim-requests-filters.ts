import type { ClaimRequestRow, ClaimRequestStatus, SortOrder } from './mock-data'

export interface ClaimRequestFilters {
  keyword: string // matches driverCode | customerName | phone | lossNoticeNumber
  sort: SortOrder // by requestedAt
  requestedRange: [string, string] | null // [YYYY-MM-DD, YYYY-MM-DD]
  source: string | null
  status: ClaimRequestStatus | null
}

export const DEFAULT_FILTERS: ClaimRequestFilters = {
  keyword: '',
  sort: 'newest',
  requestedRange: null,
  source: null,
  status: null,
}

export function applyFilters(
  rows: ClaimRequestRow[],
  filters: ClaimRequestFilters,
): ClaimRequestRow[] {
  const matched = rows.filter((row) => {
    if (filters.keyword.trim()) {
      const kw = filters.keyword.trim().toLowerCase()
      const haystack = [row.driverCode, row.customerName, row.phone, row.lossNoticeNumber]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(kw)) return false
    }
    if (filters.requestedRange) {
      const [from, to] = filters.requestedRange
      const day = row.requestedAt.slice(0, 10)
      if (day < from || day > to) return false
    }
    if (filters.source && row.source !== filters.source) return false
    if (filters.status && row.status !== filters.status) return false
    return true
  })

  return [...matched].sort((a, b) => {
    const cmp = a.requestedAt < b.requestedAt ? -1 : a.requestedAt > b.requestedAt ? 1 : 0
    return filters.sort === 'newest' ? -cmp : cmp
  })
}
