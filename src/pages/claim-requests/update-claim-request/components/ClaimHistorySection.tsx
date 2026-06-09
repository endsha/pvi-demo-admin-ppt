import { Button, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { ClaimHistoryRow } from '../update-claim-request-mock'

interface ClaimHistorySectionProps {
  rows: ClaimHistoryRow[]
}

const columns: ColumnsType<ClaimHistoryRow> = [
  { title: 'Mã Hồ sơ bồi thường', dataIndex: 'claimFileCode', key: 'claimFileCode' },
  { title: 'Mã hợp đồng nguyên tắc', dataIndex: 'masterPolicyNumber', key: 'masterPolicyNumber' },
  { title: 'Người tạo', dataIndex: 'createdBy', key: 'createdBy' },
  { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt' },
  { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
  {
    title: 'Hành động',
    key: 'action',
    width: 90,
    render: () => <Button type="link">Xem</Button>,
  },
]

export function ClaimHistorySection({ rows }: ClaimHistorySectionProps) {
  return (
    <section>
      <h2 className="mb-4 text-base font-semibold text-gray-800">
        Thông tin Hồ sơ bồi thường đã tạo
      </h2>
      <Table<ClaimHistoryRow>
        rowKey="id"
        columns={columns}
        dataSource={rows}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </section>
  )
}
