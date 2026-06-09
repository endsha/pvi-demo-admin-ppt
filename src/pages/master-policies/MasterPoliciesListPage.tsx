import { useMemo, useState } from 'react'
import { Breadcrumb } from 'antd'
import { masterPolicyRows } from './mock-data'
import { applyFilters, DEFAULT_FILTERS, type MasterPoliciesFilters } from './master-policies-filters'
import { MasterPoliciesFilters as MasterPoliciesFiltersBar } from './components/MasterPoliciesFilters'
import { MasterPoliciesTable } from './components/MasterPoliciesTable'

export function MasterPoliciesListPage() {
  const [appliedFilters, setAppliedFilters] = useState<MasterPoliciesFilters>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)

  const filteredRows = useMemo(
    () => applyFilters(masterPolicyRows, appliedFilters),
    [appliedFilters],
  )

  const handleSearch = (filters: MasterPoliciesFilters) => {
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
          items={[{ title: 'Hợp đồng nguyên tắc' }, { title: 'Bảo hiểm tích luỹ tài xế' }]}
        />
        <h1 className="text-xl font-semibold text-gray-800">Bảo hiểm tích luỹ tài xế</h1>
      </div>
      <MasterPoliciesFiltersBar onSearch={handleSearch} onReset={handleReset} />
      <MasterPoliciesTable rows={filteredRows} page={page} onPageChange={setPage} />
    </div>
  )
}
