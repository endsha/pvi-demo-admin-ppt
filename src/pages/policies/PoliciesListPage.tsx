import { useMemo, useState } from 'react'
import { Breadcrumb } from 'antd'
import { policyRows } from './mock-data'
import { applyFilters, DEFAULT_FILTERS, type PolicyFilters } from './policies-filters'
import { PolicyFilters as PolicyFiltersBar } from './components/PolicyFilters'
import { PolicySummaryBar } from './components/PolicySummaryBar'
import { PolicyTable } from './components/PolicyTable'

export function PoliciesListPage() {
  const [appliedFilters, setAppliedFilters] = useState<PolicyFilters>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)

  const filteredRows = useMemo(
    () => applyFilters(policyRows, appliedFilters),
    [appliedFilters],
  )

  const handleSearch = (filters: PolicyFilters) => {
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
          items={[{ title: 'Đơn bảo hiểm' }, { title: 'Tai nạn hành khách theo chuyến' }]}
        />
        <h1 className="text-xl font-semibold text-gray-800">
          Tai nạn hành khách theo chuyến
        </h1>
      </div>
      <PolicyFiltersBar onSearch={handleSearch} onReset={handleReset} />
      <PolicySummaryBar />
      <PolicyTable rows={filteredRows} page={page} onPageChange={setPage} />
    </div>
  )
}
