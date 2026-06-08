import type { PolicyRow, PolicyStatus } from './mock-data'

export interface PolicyFilters {
  phone: string
  tripId: string
  plate: string
  effectiveRange: [string, string] | null // Thời gian bắt đầu hiệu lực (YYYY-MM-DD)
  createdRange: [string, string] | null // Thời gian tạo đơn bảo hiểm (YYYY-MM-DD)
  status: PolicyStatus | null
}

export const DEFAULT_FILTERS: PolicyFilters = {
  phone: '',
  tripId: '',
  plate: '',
  effectiveRange: null,
  createdRange: ['2026-06-01', '2026-06-08'],
  status: 'hoan-thanh',
}

function inRange(iso: string, range: [string, string] | null): boolean {
  if (!range) return true
  const day = iso.slice(0, 10) // YYYY-MM-DD; lexical compare is valid for ISO dates
  return day >= range[0] && day <= range[1]
}

function hasText(value: string, query: string): boolean {
  if (!query.trim()) return true
  return value.toLowerCase().includes(query.trim().toLowerCase())
}

export function applyFilters(rows: PolicyRow[], f: PolicyFilters): PolicyRow[] {
  return rows.filter((row) => {
    const phoneOk =
      !f.phone.trim() || hasText(row.bookerPhone, f.phone) || hasText(row.riderPhone, f.phone)
    return (
      phoneOk &&
      hasText(row.tripId, f.tripId) &&
      hasText(row.plate, f.plate) &&
      (f.status === null || row.status === f.status) &&
      inRange(row.startAt, f.effectiveRange) &&
      inRange(row.createdAt, f.createdRange)
    )
  })
}
