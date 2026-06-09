import type { ReactNode } from 'react'
import { Button, Table } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import {
  formatAmount,
  formatDate,
  formatDateTime,
  type ClaimFileRow,
} from '../mock-data'
import { ClaimFileStatusBadge } from './ClaimFileStatusBadge'

const PAGE_SIZE = 10

interface ClaimFilesTableProps {
  rows: ClaimFileRow[]
  page: number
  onPageChange: (page: number) => void
  onEdit: (id: string) => void
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="leading-5">
      <span className="font-medium text-gray-500">{label}: </span>
      <span className="text-gray-800">{value}</span>
    </div>
  )
}

export function ClaimFilesTable({ rows, page, onPageChange, onEdit }: ClaimFilesTableProps) {
  const columns: ColumnsType<ClaimFileRow> = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      render: (_v, _r, index) => (page - 1) * PAGE_SIZE + index + 1,
    },
    {
      title: 'Số yêu cầu bồi thường',
      key: 'request',
      render: (_v, row) => (
        <div className="space-y-1">
          <Field label="Số yêu cầu bồi thường" value={row.claimRequestNumber} />
          <Field label="Mã Hồ sơ bồi thường" value={row.claimFileCode} />
          <Field label="Ngày xảy ra tai nạn" value={formatDate(row.accidentDate)} />
        </div>
      ),
    },
    {
      title: 'Thông tin khách hàng',
      key: 'customer',
      render: (_v, row) => (
        <div className="space-y-1">
          <Field label="Mã tài xế" value={row.driverCode} />
          <Field label="Họ và tên" value={row.customerName} />
          <Field label="Số HĐNT" value={row.masterPolicyNumber} />
        </div>
      ),
    },
    {
      title: 'Số tiền chi trả',
      key: 'amount',
      render: (_v, row) => (
        <div className="space-y-1">
          <Field label="Khách hàng yêu cầu" value={formatAmount(row.customerRequested)} />
          <Field label="Ước bồi thường" value={formatAmount(row.estimatedClaim)} />
          <Field label="Đã chi trả" value={formatAmount(row.paidAmount)} />
        </div>
      ),
    },
    {
      title: 'Ngày thực hiện chi trả',
      key: 'paidAt',
      render: (_v, row) => formatDateTime(row.paidAt),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 160,
      render: (_v, row) => <ClaimFileStatusBadge status={row.status} />,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 90,
      render: (_v, row) => (
        <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(row.id)} />
      ),
    },
  ]

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-2 shadow-sm">
      <Table<ClaimFileRow>
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
