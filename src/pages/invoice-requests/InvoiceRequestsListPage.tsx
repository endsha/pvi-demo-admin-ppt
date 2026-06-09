import { useMemo, useState } from 'react'
import { Breadcrumb } from 'antd'
import { invoiceRows } from './mock-data'
import { applyFilters, DEFAULT_FILTERS, type InvoiceFilters } from './invoice-filters'
import { InvoiceFilters as InvoiceFiltersBar } from './components/InvoiceFilters'
import { InvoiceToolbar } from './components/InvoiceToolbar'
import { InvoiceTable } from './components/InvoiceTable'

export function InvoiceRequestsListPage() {
  const [appliedFilters, setAppliedFilters] = useState<InvoiceFilters>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)

  const filteredRows = useMemo(
    () => applyFilters(invoiceRows, appliedFilters),
    [appliedFilters],
  )

  const handleSearch = (filters: InvoiceFilters) => {
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
        <Breadcrumb items={[{ title: 'Yêu cầu hoá đơn' }]} />
        <h1 className="text-xl font-semibold text-gray-800">Yêu cầu hoá đơn</h1>
      </div>
      <InvoiceFiltersBar onSearch={handleSearch} onReset={handleReset} />
      <InvoiceToolbar />
      <InvoiceTable rows={filteredRows} page={page} onPageChange={setPage} />
    </div>
  )
}
