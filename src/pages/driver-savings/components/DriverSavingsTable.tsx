import type { ReactNode } from 'react'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { formatDateTime, formatPremium, type DriverSavingsRow } from '../mock-data'
import { DriverSavingsStatusBadge } from './DriverSavingsStatusBadge'

const PAGE_SIZE = 10

interface DriverSavingsTableProps {
  rows: DriverSavingsRow[]
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

export function DriverSavingsTable({ rows, page, onPageChange }: DriverSavingsTableProps) {
  const columns: ColumnsType<DriverSavingsRow> = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      render: (_value, _row, index) => (page - 1) * PAGE_SIZE + index + 1,
    },
    {
      title: 'Thông tin khách hàng',
      key: 'customer',
      render: (_v, row) => (
        <div className="space-y-1">
          <Field label="Mã tài xế" value={row.driverCode} />
          <Field label="Tên" value={row.customerName} />
          <Field label="SĐT" value={row.phone} />
        </div>
      ),
    },
    {
      title: 'Thông tin đơn bảo hiểm',
      key: 'policy',
      render: (_v, row) => (
        <div className="space-y-1">
          <Field label="ID chuyến đi" value={row.tripId} />
          <Field label="Phí bảo hiểm" value={`${formatPremium(row.premium)} đ`} />
          <Field label="Số đơn" value={row.policyNumber} />
          <Field label="Loại bảo hiểm" value={row.insuranceType} />
        </div>
      ),
    },
    {
      title: 'Thời gian hiệu lực',
      key: 'effective',
      render: (_v, row) => (
        <div className="space-y-1">
          <Field label="Thời gian bắt đầu" value={formatDateTime(row.effectiveStart)} />
          <Field label="Thời gian kết thúc" value={formatDateTime(row.effectiveEnd)} />
        </div>
      ),
    },
    {
      title: 'Trạng thái đơn bảo hiểm',
      key: 'status',
      width: 200,
      render: (_v, row) => <DriverSavingsStatusBadge status={row.status} />,
    },
  ]

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-2 shadow-sm">
      <Table<DriverSavingsRow>
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
