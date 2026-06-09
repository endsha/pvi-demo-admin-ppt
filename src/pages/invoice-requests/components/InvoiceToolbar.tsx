import { Button, Tooltip } from 'antd'
import { ColumnHeightOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons'

export function InvoiceToolbar() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-white px-5 py-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <h2 className="text-base font-semibold text-gray-800">Danh sách Yêu cầu hóa đơn</h2>
      <div className="flex items-center gap-2">
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
