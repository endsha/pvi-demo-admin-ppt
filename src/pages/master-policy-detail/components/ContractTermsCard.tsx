import type { ContractTerms } from '../contract-terms'
import { formatMoney } from '../../../components/insurance/format'
import { InfoField } from './InfoField'

function vnd(n: number): string {
  return `${formatMoney(n)} VND`
}

interface ContractTermsCardProps {
  terms: ContractTerms
}

export function ContractTermsCard({ terms }: ContractTermsCardProps) {
  const fields: Array<{ label: string; value: string }> = [
    { label: 'Chương trình bảo hiểm', value: terms.programName },
    { label: 'Đối tượng', value: terms.vehicleLabel },
    { label: 'Quy tắc bảo hiểm', value: terms.insuranceRule },
    { label: 'Phạm vi địa lý', value: terms.territory },
    { label: 'Độ tuổi tham gia', value: terms.ageRange },
    { label: 'STBH tối đa của Hợp đồng', value: vnd(terms.masterMaxBenefit) },
    { label: 'STBH tối đa mỗi Đơn tích lũy', value: vnd(terms.accumMaxPerPolicy) },
    { label: 'Phí bảo hiểm cố định mỗi Đơn', value: vnd(terms.fixedPremiumPerPolicy) },
    { label: 'QL Tử vong/TTTBVV mỗi Đơn', value: vnd(terms.deathDisabilityLimit) },
    { label: 'QL Trợ cấp nằm viện mỗi Đơn', value: vnd(terms.hospitalLimitPerPolicy) },
    { label: 'QL Chi phí y tế mỗi Đơn', value: vnd(terms.medicalLimitPerPolicy) },
    { label: 'Trợ cấp nằm viện tối đa mỗi đợt', value: vnd(terms.hospitalMaxPerStay) },
    { label: 'Thời hạn Hợp đồng', value: terms.contractTerm },
    { label: 'Thời hạn Đơn tích lũy', value: terms.accumPolicyTerm },
    { label: 'Điều kiện hủy hợp đồng', value: terms.cancellationNotice },
  ]

  return (
    <section>
      <h2 className="mb-4 text-base font-semibold text-gray-800">
        Thông số Hợp đồng nguyên tắc
      </h2>
      <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
        {fields.map((f) => (
          <InfoField key={f.label} label={f.label} value={f.value} />
        ))}
      </div>
    </section>
  )
}
