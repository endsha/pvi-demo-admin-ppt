import { Table } from 'antd'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { BenefitTable } from './BenefitTable'
import { formatDateTimeSeconds, formatMoney } from './format'
import type { AccumulationTrip } from './types'

function SortCaret() {
  return (
    <span className="ml-1 inline-flex flex-col text-[9px] leading-[7px] text-gray-300">
      <CaretUpOutlined />
      <CaretDownOutlined />
    </span>
  )
}

function HeaderWithSort({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center">
      {label}
      <SortCaret />
    </span>
  )
}

interface AccumulationTableProps {
  trips: AccumulationTrip[]
  title?: string
}

export function AccumulationTable({ trips, title = 'Bảng Danh sách đơn tích luỹ' }: AccumulationTableProps) {
  const columns: ColumnsType<AccumulationTrip> = [
    { title: 'STT', key: 'stt', width: 60, render: (_v, _row, index) => index + 1 },
    { title: <HeaderWithSort label="ID chuyến xe GSM" />, dataIndex: 'gsmTripId', key: 'gsmTripId' },
    {
      title: <HeaderWithSort label="Mã hợp đồng bảo hiểm chuyến" />,
      dataIndex: 'transferContractNo',
      key: 'transferContractNo',
    },
    {
      title: <HeaderWithSort label="Thời gian hoàn thành chuyến" />,
      dataIndex: 'completedAt',
      key: 'completedAt',
      render: formatDateTimeSeconds,
    },
    {
      title: <HeaderWithSort label="Thời gian bắt đầu bảo hiểm" />,
      dataIndex: 'effectiveStart',
      key: 'effectiveStart',
      render: formatDateTimeSeconds,
    },
    {
      title: <HeaderWithSort label="Thời gian kết thúc bảo hiểm" />,
      dataIndex: 'effectiveEnd',
      key: 'effectiveEnd',
      render: formatDateTimeSeconds,
    },
    {
      title: 'STBH/ chuyến',
      dataIndex: 'sumInsured',
      key: 'sumInsured',
      align: 'right',
      render: (value: number) => `${formatMoney(value)} đ`,
    },
  ]

  return (
    <section>
      <h2 className="mb-4 text-base font-semibold text-gray-800">{title}</h2>
      <Table<AccumulationTrip>
        rowKey="id"
        columns={columns}
        dataSource={trips}
        expandable={{
          expandedRowRender: (trip) => <BenefitTable rows={trip.benefits} />,
        }}
        pagination={{
          pageSize: 10,
          total: trips.length,
          showSizeChanger: false,
          showTotal: (total, range) => `${range[0]}-${range[1]} trên ${total} mặt hàng`,
        }}
        scroll={{ x: 'max-content' }}
      />
    </section>
  )
}
