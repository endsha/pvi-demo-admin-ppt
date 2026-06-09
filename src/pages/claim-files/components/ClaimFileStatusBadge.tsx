import { Tag } from 'antd'
import { STATUS_CONFIG, type ClaimFileStatus } from '../mock-data'

interface ClaimFileStatusBadgeProps {
  status: ClaimFileStatus
}

export function ClaimFileStatusBadge({ status }: ClaimFileStatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return <Tag color={config.color}>{config.tagLabel}</Tag>
}
