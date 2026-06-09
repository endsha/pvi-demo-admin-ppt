import { useMemo, useState } from 'react'
import { Breadcrumb } from 'antd'
import { driverSavingsRows } from './mock-data'
import { applyFilters, DEFAULT_FILTERS, type DriverSavingsFilters } from './driver-savings-filters'
import { DriverSavingsFilters as DriverSavingsFiltersBar } from './components/DriverSavingsFilters'
import { DriverSavingsSummaryBar } from './components/DriverSavingsSummaryBar'
import { DriverSavingsTable } from './components/DriverSavingsTable'

export function DriverSavingsListPage() {
  const [appliedFilters, setAppliedFilters] = useState<DriverSavingsFilters>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)

  const filteredRows = useMemo(
    () => applyFilters(driverSavingsRows, appliedFilters),
    [appliedFilters],
  )

  const handleSearch = (filters: DriverSavingsFilters) => {
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
        <Breadcrumb
          items={[{ title: 'Đơn bảo hiểm' }, { title: 'Bảo hiểm tích lũy tài xế' }]}
        />
        <h1 className="text-xl font-semibold text-gray-800">Bảo hiểm tích lũy tài xế</h1>
      </div>
      <DriverSavingsFiltersBar onSearch={handleSearch} onReset={handleReset} />
      <DriverSavingsSummaryBar />
      <DriverSavingsTable rows={filteredRows} page={page} onPageChange={setPage} />
    </div>
  )
}
