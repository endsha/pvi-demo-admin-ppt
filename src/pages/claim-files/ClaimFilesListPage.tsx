import { useMemo, useState } from 'react'
import { Breadcrumb } from 'antd'
import { useNavigate } from 'react-router-dom'
import { claimFileRows } from './mock-data'
import { applyFilters, DEFAULT_FILTERS, type ClaimFileFilters } from './claim-files-filters'
import { ClaimFilesFilters } from './components/ClaimFilesFilters'
import { ClaimFilesToolbar } from './components/ClaimFilesToolbar'
import { ClaimFilesTable } from './components/ClaimFilesTable'

const BASE_PATH = '/ho-so-boi-thuong/bao-hiem-tich-luy-tai-xe'

export function ClaimFilesListPage() {
  const navigate = useNavigate()
  const [appliedFilters, setAppliedFilters] = useState<ClaimFileFilters>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)

  const filteredRows = useMemo(
    () => applyFilters(claimFileRows, appliedFilters),
    [appliedFilters],
  )

  const handleSearch = (filters: ClaimFileFilters) => {
    setAppliedFilters(filters)
    setPage(1)
  }

  const handleReset = () => {
    setAppliedFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  const handleEdit = (id: string) => navigate(`${BASE_PATH}/${id}`)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Breadcrumb
          items={[{ title: 'Hồ sơ bồi thường' }, { title: 'Bảo hiểm tích lũy tài xế' }]}
        />
        <h1 className="text-xl font-semibold text-gray-800">Bảo hiểm tích lũy tài xế</h1>
      </div>
      <ClaimFilesFilters onSearch={handleSearch} onReset={handleReset} />
      <ClaimFilesToolbar />
      <ClaimFilesTable
        rows={filteredRows}
        page={page}
        onPageChange={setPage}
        onEdit={handleEdit}
      />
    </div>
  )
}
