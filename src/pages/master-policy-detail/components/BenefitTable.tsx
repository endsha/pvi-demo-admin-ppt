import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { BenefitRow } from '../mock-data'

const renderDash = (value: string | null) => value ?? '-'

interface BenefitTableProps {
  rows: BenefitRow[]
}

export function BenefitTable({ rows }: BenefitTableProps) {
  const columns: ColumnsType<BenefitRow> = [
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

  return (
    <Table<BenefitRow>
      rowKey="key"
      columns={columns}
      dataSource={rows}
      pagination={false}
      size="middle"
    />
  )
}
