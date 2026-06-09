import type { DriverSavingsRow, DriverSavingsStatus } from './mock-data'

export interface DriverSavingsFilters {
  phone: string
  tripId: string
  plate: string
  driverCode: string
  effectiveRange: [string, string] | null // Thời gian bắt đầu hiệu lực (YYYY-MM-DD)
  createdRange: [string, string] | null // Thời gian tạo (Thời gian mua) (YYYY-MM-DD)
  status: DriverSavingsStatus | null
}

export const DEFAULT_FILTERS: DriverSavingsFilters = {
  phone: '',
  tripId: '',
  plate: '',
  driverCode: '',
  effectiveRange: null,
  createdRange: ['2026-06-01', '2026-06-09'],
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

export function applyFilters(rows: DriverSavingsRow[], f: DriverSavingsFilters): DriverSavingsRow[] {
  return rows.filter(
    (row) =>
      hasText(row.phone, f.phone) &&
      hasText(row.tripId, f.tripId) &&
      hasText(row.plate, f.plate) &&
      hasText(row.driverCode, f.driverCode) &&
      (f.status === null || row.status === f.status) &&
      inRange(row.effectiveStart, f.effectiveRange) &&
      inRange(row.createdAt, f.createdRange),
  )
}
