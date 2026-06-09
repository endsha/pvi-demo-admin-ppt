import { Breadcrumb } from 'antd'
import { useParams } from 'react-router-dom'
import { getMasterPolicyDetail } from './mock-data'
import { GeneralInfoCard } from './components/GeneralInfoCard'
import { BenefitTable } from './components/BenefitTable'
import { AccumulationTable } from './components/AccumulationTable'

export function MasterPolicyDetailPage() {
  const { id = '' } = useParams()
  const detail = getMasterPolicyDetail(id)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Breadcrumb
          items={[
            { title: 'Hợp đồng nguyên tắc' },
            { title: 'Bảo hiểm tích luỹ tài xế' },
            { title: 'Xem Hợp đồng nguyên tắc' },
          ]}
        />
        <h1 className="text-xl font-semibold text-gray-800">Xem Hợp đồng nguyên tắc</h1>
      </div>

      <div className="flex flex-col gap-8 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <GeneralInfoCard detail={detail} />
        <section>
          <h2 className="mb-4 text-base font-semibold text-gray-800">Bảng Quyền lợi bảo hiểm</h2>
          <BenefitTable rows={detail.benefits} />
        </section>
        <AccumulationTable trips={detail.trips} />
      </div>
    </div>
  )
}
