import { Tag } from 'antd'
import { STATUS_CONFIG, type ClaimRequestStatus } from '../mock-data'

interface ClaimRequestStatusBadgeProps {
  status: ClaimRequestStatus
}

export function ClaimRequestStatusBadge({ status }: ClaimRequestStatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return <Tag color={config.color}>{config.tagLabel}</Tag>
}
