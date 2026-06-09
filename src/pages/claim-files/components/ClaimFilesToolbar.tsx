import { Button, Tooltip } from 'antd'
import { ReloadOutlined, InsertRowAboveOutlined, SettingOutlined } from '@ant-design/icons'

export function ClaimFilesToolbar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-800">Danh sách Hồ sơ bồi thường</h2>
      <div className="flex items-center gap-2">
        {/* Decorative no-op icon buttons matching the design */}
        <Tooltip title="Tải lại">
          <Button icon={<ReloadOutlined />} />
        </Tooltip>
        <Tooltip title="Tuỳ chỉnh cột">
          <Button icon={<InsertRowAboveOutlined />} />
        </Tooltip>
        <Tooltip title="Cài đặt">
          <Button icon={<SettingOutlined />} />
        </Tooltip>
      </div>
    </div>
  )
}
