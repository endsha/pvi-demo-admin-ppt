import { Tag } from 'antd'
import { STATUS_CONFIG, type PolicyStatus } from '../mock-data'

interface PolicyStatusBadgeProps {
  status: PolicyStatus
}

export function PolicyStatusBadge({ status }: PolicyStatusBadgeProps) {
  const { tagLabel, color } = STATUS_CONFIG[status]
  return (
    <Tag color={color} className="rounded-full px-2 py-0.5">
      {tagLabel}
    </Tag>
  )
}
