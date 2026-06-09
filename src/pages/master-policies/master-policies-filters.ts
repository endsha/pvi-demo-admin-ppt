import type { MasterPolicyRow } from './mock-data'

export type MasterPoliciesSort = 'newest' | 'oldest'

export interface MasterPoliciesFilters {
  keyword: string
  sort: MasterPoliciesSort
  effectiveRange: [string, string] | null // Thời gian bắt đầu hiệu lực (YYYY-MM-DD)
  packageType: string | null // Loại bảo hiểm
}

export const DEFAULT_FILTERS: MasterPoliciesFilters = {
  keyword: '',
  sort: 'newest',
  effectiveRange: null,
  packageType: null,
}

function inRange(iso: string, range: [string, string] | null): boolean {
  if (!range) return true
  const day = iso.slice(0, 10) // YYYY-MM-DD; lexical compare is valid for ISO dates
  return day >= range[0] && day <= range[1]
}

function matchesKeyword(row: MasterPolicyRow, keyword: string): boolean {
  const q = keyword.trim().toLowerCase()
  if (!q) return true
  return [row.contractNumber, row.driverCode, row.customerName, row.phone].some((value) =>
    value.toLowerCase().includes(q),
  )
}

export function applyFilters(
  rows: MasterPolicyRow[],
  f: MasterPoliciesFilters,
): MasterPolicyRow[] {
  const filtered = rows.filter(
    (row) =>
      matchesKeyword(row, f.keyword) &&
      (f.packageType === null || row.packageName === f.packageType) &&
      inRange(row.effectiveStart, f.effectiveRange),
  )
  return [...filtered].sort((a, b) => {
    const cmp = a.effectiveStart.localeCompare(b.effectiveStart)
    return f.sort === 'newest' ? -cmp : cmp
  })
}
