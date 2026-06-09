import { Empty, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { GsmRecord } from '../mock-data'
import { STATUS_CONFIG, formatPremium, formatDateTime } from '../../policies/mock-data'

const PAGE_SIZE = 10

interface GsmSearchResultProps {
  records: GsmRecord[]
}

const columns: ColumnsType<GsmRecord> = [
  { title: 'Mã chuyến', dataIndex: 'tripId', key: 'tripId' },
  { title: 'Biển số', dataIndex: 'plate', key: 'plate' },
  { title: 'Tên người đi', dataIndex: 'riderName', key: 'riderName' },
  { title: 'SĐT', dataIndex: 'riderPhone', key: 'riderPhone' },
  { title: 'Loại bảo hiểm', dataIndex: 'insuranceType', key: 'insuranceType' },
  {
    title: 'Phí (đ)',
    dataIndex: 'premium',
    key: 'premium',
    align: 'right',
    render: (value: number) => formatPremium(value),
  },
  {
    title: 'Thời gian',
    dataIndex: 'startAt',
    key: 'startAt',
    render: (value: string) => formatDateTime(value),
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status: GsmRecord['status']) => {
      const cfg = STATUS_CONFIG[status]
      return <Tag color={cfg.color}>{cfg.tagLabel}</Tag>
    },
  },
]

export function GsmSearchResult({ records }: GsmSearchResultProps) {
  return (
    <section className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-800">Kết quả tra cứu</h2>
      {records.length === 0 ? (
        <Empty description="Không tìm thấy thông tin phù hợp" />
      ) : (
        <Table<GsmRecord>
          rowKey="id"
          columns={columns}
          dataSource={records}
          pagination={{ pageSize: PAGE_SIZE, hideOnSinglePage: true, showSizeChanger: false }}
          scroll={{ x: 'max-content' }}
        />
      )}
    </section>
  )
}
