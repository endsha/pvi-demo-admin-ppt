import { Button, Tooltip } from 'antd'
import {
  ColumnHeightOutlined,
  ExportOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import {
  formatInt,
  formatPremium,
  headlineTotalOrders,
  headlineTotalPremium,
} from '../mock-data'

export function DriverSavingsSummaryBar() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-white px-5 py-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="space-y-1 text-sm">
        <div>
          <span className="font-semibold text-gray-700">Tổng số đơn</span>
          <span className="text-gray-500"> : </span>
          <span className="text-gray-800">{formatInt(headlineTotalOrders)}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Tổng phí bảo hiểm</span>
          <span className="text-gray-500"> : </span>
          <span className="text-gray-800">{formatPremium(headlineTotalPremium)} đ</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button type="text" icon={<ExportOutlined />} className="text-gray-600">
          Xuất danh sách đơn bảo hiểm CSV
        </Button>
        <Tooltip title="Tải lại">
          <Button icon={<ReloadOutlined />} />
        </Tooltip>
        <Tooltip title="Độ cao hàng">
          <Button icon={<ColumnHeightOutlined />} />
        </Tooltip>
        <Tooltip title="Cài đặt cột">
          <Button icon={<SettingOutlined />} />
        </Tooltip>
      </div>
    </div>
  )
}
