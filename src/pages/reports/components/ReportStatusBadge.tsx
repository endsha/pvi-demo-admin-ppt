import { Tag } from 'antd'
import { STATUS_CONFIG, type ReportStatus } from '../mock-data'

interface ReportStatusBadgeProps {
  status: ReportStatus
}

export function ReportStatusBadge({ status }: ReportStatusBadgeProps) {
  const { label, color } = STATUS_CONFIG[status]
  return (
    <Tag color={color} className="rounded-full px-2 py-0.5">
      {label}
    </Tag>
  )
}
