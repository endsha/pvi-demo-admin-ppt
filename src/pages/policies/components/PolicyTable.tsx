import type { ReactNode } from 'react'
import { Button, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EyeOutlined } from '@ant-design/icons'
import { formatDateTime, formatPremium, type PolicyRow } from '../mock-data'
import { PolicyStatusBadge } from './PolicyStatusBadge'

const PAGE_SIZE = 10

interface PolicyTableProps {
  rows: PolicyRow[]
  page: number
  onPageChange: (page: number) => void
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="leading-5">
      <span className="font-medium text-gray-500">{label}: </span>
      <span className="text-gray-800">{value}</span>
    </div>
  )
}

export function PolicyTable({ rows, page, onPageChange }: PolicyTableProps) {
  const columns: ColumnsType<PolicyRow> = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      render: (_value, _row, index) => (page - 1) * PAGE_SIZE + index + 1,
    },
    {
      title: 'Thông tin chuyến đi',
      key: 'trip',
      render: (_v, row) => (
        <div className="space-y-1">
          <Field label="ID chuyến đi" value={row.tripId} />
          <Field label="Phí bảo hiểm" value={`${formatPremium(row.premium)} đ`} />
          <Field label="Biển số xe" value={row.plate} />
        </div>
      ),
    },
    {
      title: 'Thông tin khách hàng',
      key: 'customer',
      render: (_v, row) => (
        <div className="space-y-1">
          <Field label="Tên người đặt" value={row.bookerName} />
          <Field label="SĐT người đặt" value={row.bookerPhone} />
          <Field label="Tên người đi" value={row.riderName} />
          <Field label="SĐT người đi" value={row.riderPhone} />
        </div>
      ),
    },
    {
      title: 'Thời gian và địa điểm',
      key: 'timeplace',
      render: (_v, row) => (
        <div className="space-y-1">
          <Field label="Thời gian bắt đầu" value={formatDateTime(row.startAt)} />
          <Field label="Thời gian kết thúc" value={formatDateTime(row.endAt)} />
          <Field label="Địa chỉ đi" value={row.fromAddress} />
          <Field label="Địa chỉ đến" value={row.toAddress} />
        </div>
      ),
    },
    {
      title: 'Trạng thái đơn bảo hiểm',
      key: 'status',
      width: 180,
      render: (_v, row) => <PolicyStatusBadge status={row.status} />,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      render: () => <Button type="primary" icon={<EyeOutlined />} />,
    },
  ]

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-2 shadow-sm">
      <Table<PolicyRow>
        rowKey="id"
        columns={columns}
        dataSource={rows}
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total: rows.length,
          onChange: onPageChange,
          showSizeChanger: false,
        }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  )
}
