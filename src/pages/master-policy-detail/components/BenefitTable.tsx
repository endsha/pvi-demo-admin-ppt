import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { BenefitRow } from '../mock-data'

const renderDash = (value: string | null) => value ?? '-'

const BENEFIT_COLUMNS: ColumnsType<BenefitRow> = [
  {
    title: 'QUYỀN LỢI BẢO HIỂM',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    render: (_value, row) => (
      <div>
        <div className="font-semibold text-gray-800">{row.name}</div>
        {row.sub && <div className="mt-0.5 text-xs italic text-gray-400">{row.sub}</div>}
      </div>
    ),
  },
  { title: 'HẠN MỨC BẢO HIỂM', dataIndex: 'hanMuc', key: 'hanMuc', align: 'center', render: renderDash },
  { title: 'ĐÃ CHI TRẢ', dataIndex: 'daChiTra', key: 'daChiTra', align: 'center', render: renderDash },
  { title: 'ƯỚC BỒI THƯỜNG', dataIndex: 'uocBoiThuong', key: 'uocBoiThuong', align: 'center', render: renderDash },
  { title: 'HẠN MỨC CÒN LẠI', dataIndex: 'hanMucConLai', key: 'hanMucConLai', align: 'center', render: renderDash },
]

interface BenefitTableProps {
  rows: BenefitRow[]
}

export function BenefitTable({ rows }: BenefitTableProps) {
  return (
    <Table<BenefitRow>
      rowKey="key"
      columns={BENEFIT_COLUMNS}
      dataSource={rows}
      pagination={false}
      size="middle"
    />
  )
}
