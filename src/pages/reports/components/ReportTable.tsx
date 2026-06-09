import { useState } from 'react'
import type { Key } from 'react'
import { Button, Empty, Switch, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { ACCESS_CONFIG, type ReportRow } from '../mock-data'
import { ReportStatusBadge } from './ReportStatusBadge'

const PAGE_SIZE = 10

interface ReportTableProps {
  rows: ReportRow[]
  page: number
  onPageChange: (page: number) => void
}

export function ReportTable({ rows, page, onPageChange }: ReportTableProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
  // local-only enable/disable state (visual; no API). Falls back to the row's seed value.
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>({})

  const isEnabled = (row: ReportRow) => enabledMap[row.id] ?? row.enabled
  const toggleEnabled = (row: ReportRow, value: boolean) =>
    setEnabledMap((prev) => ({ ...prev, [row.id]: value }))

  const columns: ColumnsType<ReportRow> = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      render: (_v, _row, index) => (page - 1) * PAGE_SIZE + index + 1,
    },
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Loại báo cáo', dataIndex: 'reportType', key: 'reportType' },
    { title: 'Mã đối tác', dataIndex: 'partnerCode', key: 'partnerCode' },
    { title: 'Mã sản phẩm', dataIndex: 'productCode', key: 'productCode' },
    { title: 'Thứ tự', dataIndex: 'order', key: 'order', width: 80 },
    {
      title: 'Quyền truy cập',
      key: 'access',
      render: (_v, row) => ACCESS_CONFIG[row.access].label,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_v, row) => <ReportStatusBadge status={row.status} />,
    },
    {
      title: 'Trạng thái',
      key: 'enabled',
      width: 110,
      fixed: 'right',
      render: (_v, row) => (
        <Switch checked={isEnabled(row)} onChange={(value) => toggleEnabled(row, value)} />
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 140,
      fixed: 'right',
      render: () => (
        <div className="flex items-center gap-1">
          <Button type="text" icon={<EyeOutlined />} />
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" danger icon={<DeleteOutlined />} />
        </div>
      ),
    },
  ]

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-2 shadow-sm">
      <Table<ReportRow>
        rowKey="id"
        columns={columns}
        dataSource={rows}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Trống" /> }}
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
