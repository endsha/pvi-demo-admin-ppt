import type { ReactNode } from 'react'
import { Button, Table, Typography } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import {
  formatAmount,
  formatDate,
  formatDateTime,
  type ClaimRequestRow,
} from '../mock-data'
import { ClaimRequestStatusBadge } from './ClaimRequestStatusBadge'

const PAGE_SIZE = 10

interface ClaimRequestsTableProps {
  rows: ClaimRequestRow[]
  page: number
  onPageChange: (page: number) => void
  onView: (id: string) => void
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

export function ClaimRequestsTable({
  rows,
  page,
  onPageChange,
  onView,
  onEdit,
}: ClaimRequestsTableProps) {
  const columns: ColumnsType<ClaimRequestRow> = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      render: (_v, _r, index) => (page - 1) * PAGE_SIZE + index + 1,
    },
    {
      title: 'Nguồn tiếp nhận',
      key: 'source',
      render: (_v, row) => row.source ?? '-',
    },
    {
      title: 'Ngày yêu cầu bồi thường',
      key: 'requestedAt',
      render: (_v, row) => formatDateTime(row.requestedAt),
    },
    {
      title: 'Số thông báo tổn thất',
      dataIndex: 'lossNoticeNumber',
      key: 'lossNoticeNumber',
    },
    {
      title: 'Thông tin khách hàng',
      key: 'customer',
      render: (_v, row) => (
        <div className="space-y-1">
          <Field label="Mã tài xế" value={row.driverCode} />
          <Field label="Số HĐNT" value={row.masterPolicyNumber} />
          <Field label="Tên" value={row.customerName} />
          <Field label="Số điện thoại" value={row.phone} />
        </div>
      ),
    },
    {
      title: 'Thông tin về tai nạn',
      key: 'accident',
      render: (_v, row) => (
        <div className="space-y-1">
          <Field label="Ngày xảy ra tai nạn" value={formatDate(row.accidentDate)} />
          <Field label="Nơi xảy ra tai nạn" value={row.accidentPlace} />
          <Field label="Hậu quả tai nạn" value={row.accidentConsequence} />
        </div>
      ),
    },
    {
      title: 'Số tiền yêu cầu chi trả',
      key: 'claimAmount',
      render: (_v, row) => formatAmount(row.claimAmount),
    },
    {
      title: 'Tình trạng yêu cầu bồi thường',
      key: 'status',
      width: 180,
      render: (_v, row) => <ClaimRequestStatusBadge status={row.status} />,
    },
    {
      title: 'Liên kết',
      key: 'link',
      render: (_v, row) => (
        <Typography.Link onClick={() => onView(row.id)}>Xem giấy YCBT</Typography.Link>
      ),
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
      <Table<ClaimRequestRow>
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
