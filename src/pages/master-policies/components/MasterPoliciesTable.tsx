import type { ReactNode } from 'react'
import { Button, Table } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  ColumnHeightOutlined,
  ReloadOutlined,
  SettingOutlined,
  ZoomInOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { formatDateTimeSeconds, formatMoney, type MasterPolicyRow } from '../mock-data'

const PAGE_SIZE = 10

interface MasterPoliciesTableProps {
  rows: MasterPolicyRow[]
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

export function MasterPoliciesTable({ rows, page, onPageChange }: MasterPoliciesTableProps) {
  const navigate = useNavigate()
  const goToDetail = (id: string) =>
    navigate(`/hop-dong-nguyen-tac/bao-hiem-tich-luy-tai-xe/${id}`)

  const columns: ColumnsType<MasterPolicyRow> = [
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
          <Field label="Số hợp đồng nguyên tắc" value={row.contractNumber} />
          <Field label="Mã tài xế" value={row.driverCode} />
          <Field label="Tên khách hàng" value={row.customerName} />
          <Field label="SĐT" value={row.phone} />
        </div>
      ),
    },
    {
      title: 'Thông tin chương trình bảo hiểm',
      key: 'program',
      render: (_v, row) => (
        <div className="space-y-1">
          <Field label="Tên gói" value={row.packageName} />
          <Field label="Phí" value={`${formatMoney(row.premium)} đ`} />
          <Field label="Quyền lợi tối đa" value={`${formatMoney(row.maxBenefit)} đ`} />
          <Field label="Số tiền đã tích luỹ" value={`${formatMoney(row.accumulated)} đ`} />
        </div>
      ),
    },
    {
      title: 'Thời hạn hiệu lực',
      key: 'effective',
      render: (_v, row) => (
        <div className="space-y-1">
          <Field label="Ngày bắt đầu" value={formatDateTimeSeconds(row.effectiveStart)} />
          <Field label="Ngày kết thúc" value={formatDateTimeSeconds(row.effectiveEnd)} />
        </div>
      ),
    },
    {
      title: 'Liên kết',
      key: 'link',
      render: (_v, row) => (
        <Button type="link" className="px-0" onClick={() => goToDetail(row.id)}>
          Xem hợp đồng nguyên tắc
        </Button>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      render: (_v, row) => (
        <Button type="primary" icon={<ZoomInOutlined />} onClick={() => goToDetail(row.id)} />
      ),
    },
  ]

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-2 shadow-sm">
      <div className="flex items-center justify-between px-2 py-3">
        <h2 className="text-base font-semibold text-gray-800">Danh sách Hợp đồng nguyên tắc</h2>
        <div className="flex items-center gap-3 text-gray-400">
          <ReloadOutlined />
          <ColumnHeightOutlined />
          <SettingOutlined />
        </div>
      </div>
      <Table<MasterPolicyRow>
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
