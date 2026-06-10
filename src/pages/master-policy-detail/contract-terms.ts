// Thông số Hợp đồng nguyên tắc cho từng loại tài xế, trích từ 2 mẫu HĐBH:
//  - 20240925_HDBH_Tai_xe_XE_MAY.pdf  (xe máy / mã PM)
//  - 20240925_HDBH_Tai_xe_XE_O_TO.pdf (ô tô / mã PC)
// Hai mẫu chỉ khác nhau ở phần hạn mức/phí; các điều khoản còn lại dùng chung.

export type VehicleType = 'motorcycle' | 'car'

export interface ContractTerms {
  vehicleType: VehicleType
  vehicleLabel: string // Đối tượng (Tài xế Xe máy / Tài xế Ô tô)
  programName: string // Tên chương trình bảo hiểm
  masterMaxBenefit: number // STBH tối đa của Hợp đồng (VND)
  accumMaxPerPolicy: number // STBH tối đa cho mỗi Đơn bảo hiểm tích lũy (VND)
  fixedPremiumPerPolicy: number // Phí bảo hiểm cố định cho mỗi Đơn (VND)
  deathDisabilityLimit: number // QL1: Tử vong/TTTBVV — giới hạn mỗi đơn (VND)
  hospitalLimitPerPolicy: number // QL2: Trợ cấp nằm viện — giới hạn mỗi đơn (VND)
  medicalLimitPerPolicy: number // QL3: Chi phí y tế — giới hạn mỗi đơn (VND)
  hospitalMaxPerStay: number // Trợ cấp nằm viện tối đa mỗi đợt nằm viện (VND)
  hospitalBenefitRate: string // Tỷ lệ trợ cấp nằm viện trên STBH tích lũy
  medicalBenefitRate: string // Tỷ lệ chi phí y tế trên STBH tích lũy
  insuranceRule: string // Quy tắc bảo hiểm áp dụng
  territory: string // Phạm vi địa lý
  ageRange: string // Độ tuổi tham gia
  contractTerm: string // Thời hạn Hợp đồng bảo hiểm
  accumPolicyTerm: string // Thời hạn Đơn bảo hiểm tích lũy
  cancellationNotice: string // Điều kiện hủy hợp đồng
}

// Điều khoản dùng chung cho cả hai mẫu hợp đồng.
const SHARED_TERMS = {
  programName: 'Bảo hiểm tích lũy Xanh SM Care Plus',
  hospitalBenefitRate: '6% STBH tích lũy tại thời điểm xảy ra tai nạn',
  medicalBenefitRate: '6% STBH tích lũy tại thời điểm xảy ra tai nạn',
  insuranceRule: 'QĐ số 719/QĐ-PVIBH ngày 03/11/2011',
  territory: 'Việt Nam',
  ageRange: 'Từ đủ 18 đến 65 tuổi',
  contractTerm: '01 (một) năm',
  accumPolicyTerm: 'Tối đa 180 (một trăm tám mươi) ngày',
  cancellationNotice: 'Thông báo trước 30 (ba mươi) ngày',
} as const

export const CONTRACT_TERMS: Record<VehicleType, ContractTerms> = {
  motorcycle: {
    ...SHARED_TERMS,
    vehicleType: 'motorcycle',
    vehicleLabel: 'Tài xế Xe máy',
    masterMaxBenefit: 300_000_000,
    accumMaxPerPolicy: 125_000,
    fixedPremiumPerPolicy: 100,
    deathDisabilityLimit: 125_000,
    hospitalLimitPerPolicy: 7_500,
    medicalLimitPerPolicy: 7_500,
    hospitalMaxPerStay: 1_500_000,
  },
  car: {
    ...SHARED_TERMS,
    vehicleType: 'car',
    vehicleLabel: 'Tài xế Ô tô',
    masterMaxBenefit: 600_000_000,
    accumMaxPerPolicy: 250_000,
    fixedPremiumPerPolicy: 200,
    deathDisabilityLimit: 250_000,
    hospitalLimitPerPolicy: 15_000,
    medicalLimitPerPolicy: 15_000,
    hospitalMaxPerStay: 3_000_000,
  },
}

// Mã HĐ xe máy bắt đầu bằng PM, ô tô bằng PC; fallback theo tên gói.
export function resolveVehicleType(contractNumber: string, packageName?: string): VehicleType {
  if (contractNumber.includes('/PM-')) return 'motorcycle'
  if (contractNumber.includes('/PC-')) return 'car'
  if (packageName?.toLowerCase().includes('xe máy')) return 'motorcycle'
  return 'car'
}

export function getContractTerms(contractNumber: string, packageName?: string): ContractTerms {
  return CONTRACT_TERMS[resolveVehicleType(contractNumber, packageName)]
}
