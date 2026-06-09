import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'

export interface PaymentRow {
  key: string
  benefit: string // Quyền lợi bảo hiểm
  requested: string | null // Số tiền yêu cầu
  approved: string | null // Số tiền bồi thường
  note?: string | null // Ghi chú
}

const renderDash = (value: string | null | undefined) => value ?? '-'

// VERIFY vs design (image 02): exact column headers are low-res. Best-effort set.
const PAYMENT_COLUMNS: ColumnsType<PaymentRow> = [
  { title: 'STT', key: 'stt', width: 60, align: 'center', render: (_v, _row, index) => index + 1 },
  { title: 'QUYỀN LỢI BẢO HIỂM', dataIndex: 'benefit', key: 'benefit' },
  { title: 'SỐ TIỀN YÊU CẦU', dataIndex: 'requested', key: 'requested', align: 'right', render: renderDash },
  { title: 'SỐ TIỀN BỒI THƯỜNG', dataIndex: 'approved', key: 'approved', align: 'right', render: renderDash },
  { title: 'GHI CHÚ', dataIndex: 'note', key: 'note', render: renderDash },
]

interface PaymentTableProps {
  rows: PaymentRow[]
}

export function PaymentTable({ rows }: PaymentTableProps) {
  return (
    <Table<PaymentRow>
      rowKey="key"
      columns={PAYMENT_COLUMNS}
      dataSource={rows}
      pagination={false}
      size="middle"
    />
  )
}
