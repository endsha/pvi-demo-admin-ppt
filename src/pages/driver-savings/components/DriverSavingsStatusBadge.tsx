import { Tag } from 'antd'
import { STATUS_CONFIG, type DriverSavingsStatus } from '../mock-data'

interface DriverSavingsStatusBadgeProps {
  status: DriverSavingsStatus
}

export function DriverSavingsStatusBadge({ status }: DriverSavingsStatusBadgeProps) {
  const { tagLabel, color } = STATUS_CONFIG[status]
  return (
    <Tag color={color} className="rounded-full px-2 py-0.5">
      {tagLabel}
    </Tag>
  )
}
