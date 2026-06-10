import type { MasterPolicyDetail } from '../mock-data'
import { InfoField } from './InfoField'

interface GeneralInfoCardProps {
  detail: MasterPolicyDetail
}

export function GeneralInfoCard({ detail }: GeneralInfoCardProps) {
  return (
    <section>
      <h2 className="mb-4 text-base font-semibold text-gray-800">Thông tin chung</h2>
      <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
        <InfoField label="Mã Tài xế Grab" value={detail.driverCode} />
        <InfoField label="Họ và tên" value={detail.fullName} />
        <InfoField label="Ngày sinh" value={detail.dob} />
        <InfoField label="Số CMND/CCCD/Hộ chiếu" value={detail.idNumber} />
        <InfoField label="Giới tính" value={detail.gender} />
        <InfoField label="Số hợp đồng nguyên tắc" value={detail.contractNumber} />
        <InfoField label="STBH tích lũy trong thời gian" value={detail.accumulationPeriod} />
      </div>
    </section>
  )
}
