import type { ReportRow, ReportStatus } from './mock-data'

export interface ReportFilters {
  keyword: string // Tìm kiếm — matches title + partnerCode + productCode
  title: string // Tiêu đề — substring match on title
  sort: 'moi-nhat' | 'cu-nhat'
  reportType: string | null // advanced — Loại báo cáo
  partnerCode: string // advanced — Mã đối tác
  status: ReportStatus | null // advanced — Trạng thái
}

export const DEFAULT_FILTERS: ReportFilters = {
  keyword: '',
  title: '',
  sort: 'moi-nhat',
  reportType: null,
  partnerCode: '',
  status: null,
}

function hasText(value: string, query: string): boolean {
  if (!query.trim()) return true
  return value.toLowerCase().includes(query.trim().toLowerCase())
}

export function applyFilters(rows: ReportRow[], f: ReportFilters): ReportRow[] {
  const filtered = rows.filter((row) => {
    const keywordOk =
      !f.keyword.trim() ||
      hasText(row.title, f.keyword) ||
      hasText(row.partnerCode, f.keyword) ||
      hasText(row.productCode, f.keyword)
    return (
      keywordOk &&
      hasText(row.title, f.title) &&
      hasText(row.partnerCode, f.partnerCode) &&
      (f.reportType === null || row.reportType === f.reportType) &&
      (f.status === null || row.status === f.status)
    )
  })
  // immutable sort: "mới nhất" = highest order first, "cũ nhất" = lowest first
  return [...filtered].sort((a, b) =>
    f.sort === 'moi-nhat' ? b.order - a.order : a.order - b.order,
  )
}
