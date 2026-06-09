import type { ClaimFileRow, ClaimFileStatus, SortOrder } from './mock-data'

export interface ClaimFileFilters {
  keyword: string // claimRequestNumber | claimFileCode | driverCode | customerName | masterPolicyNumber
  sort: SortOrder // by paidAt
  paidRange: [string, string] | null // [YYYY-MM-DD, YYYY-MM-DD] over paidAt
  status: ClaimFileStatus | null
}

export const DEFAULT_FILTERS: ClaimFileFilters = {
  keyword: '',
  sort: 'newest',
  paidRange: null,
  status: null,
}

export function applyFilters(
  rows: ClaimFileRow[],
  filters: ClaimFileFilters,
): ClaimFileRow[] {
  const matched = rows.filter((row) => {
    if (filters.keyword.trim()) {
      const kw = filters.keyword.trim().toLowerCase()
      const haystack = [
        row.claimRequestNumber,
        row.claimFileCode,
        row.driverCode,
        row.customerName,
        row.masterPolicyNumber,
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(kw)) return false
    }
    if (filters.paidRange) {
      const [from, to] = filters.paidRange
      const day = row.paidAt.slice(0, 10)
      if (day < from || day > to) return false
    }
    if (filters.status && row.status !== filters.status) return false
    return true
  })

  return [...matched].sort((a, b) => {
    const cmp = a.paidAt < b.paidAt ? -1 : a.paidAt > b.paidAt ? 1 : 0
    return filters.sort === 'newest' ? -cmp : cmp
  })
}
