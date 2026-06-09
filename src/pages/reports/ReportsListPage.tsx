import { useMemo, useState } from 'react'
import { Breadcrumb } from 'antd'
import { reportRows } from './mock-data'
import { applyFilters, DEFAULT_FILTERS, type ReportFilters } from './reports-filters'
import { ReportFilters as ReportFiltersBar } from './components/ReportFilters'
import { ReportToolbar } from './components/ReportToolbar'
import { ReportTable } from './components/ReportTable'

export function ReportsListPage() {
  const [appliedFilters, setAppliedFilters] = useState<ReportFilters>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)

  const filteredRows = useMemo(
    () => applyFilters(reportRows, appliedFilters),
    [appliedFilters],
  )

  const handleSearch = (filters: ReportFilters) => {
    setAppliedFilters(filters)
    setPage(1)
  }

  const handleReset = () => {
    setAppliedFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Breadcrumb items={[{ title: 'Báo cáo Power BI' }, { title: 'Quản lý báo cáo' }]} />
        <h1 className="text-xl font-semibold text-gray-800">Quản lý báo cáo</h1>
      </div>
      <ReportFiltersBar onSearch={handleSearch} onReset={handleReset} />
      <ReportToolbar />
      <ReportTable rows={filteredRows} page={page} onPageChange={setPage} />
    </div>
  )
}
