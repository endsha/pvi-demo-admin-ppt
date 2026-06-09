import { useMemo, useState } from 'react'
import { Breadcrumb } from 'antd'
import { useNavigate } from 'react-router-dom'
import { claimRequestRows } from './mock-data'
import {
  applyFilters,
  DEFAULT_FILTERS,
  type ClaimRequestFilters,
} from './claim-requests-filters'
import { ClaimRequestsFilters } from './components/ClaimRequestsFilters'
import { ClaimRequestsToolbar } from './components/ClaimRequestsToolbar'
import { ClaimRequestsTable } from './components/ClaimRequestsTable'

const BASE_PATH = '/yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe'

export function ClaimRequestsListPage() {
  const navigate = useNavigate()
  const [appliedFilters, setAppliedFilters] = useState<ClaimRequestFilters>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)

  const filteredRows = useMemo(
    () => applyFilters(claimRequestRows, appliedFilters),
    [appliedFilters],
  )

  const handleSearch = (filters: ClaimRequestFilters) => {
    setAppliedFilters(filters)
    setPage(1)
  }

  const handleReset = () => {
    setAppliedFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  const handleAdd = () => navigate(`${BASE_PATH}/them-moi`)
  const handleView = (id: string) => navigate(`${BASE_PATH}/${id}/giay-ycbt`)
  const handleEdit = (id: string) => navigate(`${BASE_PATH}/${id}/cap-nhat`)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Breadcrumb
          items={[{ title: 'Yêu cầu bồi thường' }, { title: 'Bảo hiểm tích lũy tài xế' }]}
        />
        <h1 className="text-xl font-semibold text-gray-800">Bảo hiểm tích lũy tài xế</h1>
      </div>
      <ClaimRequestsFilters onSearch={handleSearch} onReset={handleReset} />
      <ClaimRequestsToolbar onAdd={handleAdd} />
      <ClaimRequestsTable
        rows={filteredRows}
        page={page}
        onPageChange={setPage}
        onView={handleView}
        onEdit={handleEdit}
      />
    </div>
  )
}
