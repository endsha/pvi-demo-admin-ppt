import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { formatDate, formatDateTime, type InvoiceRequestRow } from '../mock-data'

const PAGE_SIZE = 10

interface InvoiceTableProps {
  rows: InvoiceRequestRow[]
  page: number
  onPageChange: (page: number) => void
}

export function InvoiceTable({ rows, page, onPageChange }: InvoiceTableProps) {
  const columns: ColumnsType<InvoiceRequestRow> = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      render: (_v, _row, index) => (page - 1) * PAGE_SIZE + index + 1,
    },
    { title: 'Số hợp đồng bảo hiểm', dataIndex: 'contractNo', key: 'contractNo' },
    { title: 'Tên chủ hợp đồng', dataIndex: 'holderName', key: 'holderName' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'Tên người nhận', dataIndex: 'receiverName', key: 'receiverName' },
    { title: 'Đối tác', dataIndex: 'partner', key: 'partner' },
    { title: 'Sản phẩm', dataIndex: 'product', key: 'product' },
    {
      title: 'Ngày tạo yêu cầu',
      key: 'createdAt',
      render: (_v, row) => formatDate(row.createdAt),
    },
    {
      title: 'Thời hạn bảo hiểm',
      key: 'coverage',
      render: (_v, row) => (
        <div className="leading-5">
          <div>
            <span className="text-gray-500">Từ: </span>
            <span className="text-gray-800">{formatDateTime(row.coverageFrom)}</span>
          </div>
          <div>
            <span className="text-gray-500">Đến: </span>
            <span className="text-gray-800">{formatDateTime(row.coverageTo)}</span>
          </div>
        </div>
      ),
    },
    { title: 'Email người nhận', dataIndex: 'email', key: 'email' },
    { title: 'Mã số thuế', dataIndex: 'taxCode', key: 'taxCode' },
    { title: 'Địa chỉ người nhận', dataIndex: 'address', key: 'address' },
  ]

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-2 shadow-sm">
      <Table<InvoiceRequestRow>
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
