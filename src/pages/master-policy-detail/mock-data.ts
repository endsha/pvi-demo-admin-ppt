import type { BenefitRow, AccumulationTrip } from '../../components/insurance/types'
import { formatMoney } from '../../components/insurance/format'

export interface MasterPolicyDetail {
  id: string
  driverCode: string // Mã Tài xế GSM
  fullName: string // Họ và tên
  dob: string | null // Ngày sinh
  idNumber: string | null // Số CMND/CCCD/Hộ chiếu
  gender: string // Giới tính
  contractNumber: string // Số hợp đồng nguyên tắc
  accumulationPeriod: string | null // STBH tích lũy trong thời gian
  benefits: BenefitRow[]
  trips: AccumulationTrip[]
}

function money(n: number): string {
  return `${formatMoney(n)} đ`
}

// Shared benefit name/sub metadata, in display order.
const BENEFIT_META: Array<{ key: string; name: string; sub?: string }> = [
  { key: 'death', name: 'Tử vong do tai nạn' },
  { key: 'disability', name: 'Thương tật toàn bộ vĩnh viễn do tai nạn' },
  {
    key: 'hospital',
    name: 'Trợ cấp nằm viện do tai nạn',
    sub: 'Chi trả trợ cấp nằm viện do Tai nạn từ trọn 2 ngày trở lên',
  },
  {
    key: 'medical',
    name: 'Chi phí y tế do tai nạn',
    sub: 'Chỉ chi trả các CPYT phát sinh trong thời hạn BH',
  },
]

// Master-level table: all dashes except the hospital row's HẠN MỨC BẢO HIỂM text.
const MASTER_HAN_MUC: Record<string, string | null> = {
  death: null,
  disability: null,
  hospital:
    'Tối đa mỗi đợt nằm viện VND 1.500.000 đối với tài xế xe máy & VND 3.000.000 đối với tài xế ô tô',
  medical: null,
}

const masterBenefits: BenefitRow[] = BENEFIT_META.map((m) => ({
  ...m,
  hanMuc: MASTER_HAN_MUC[m.key],
  daChiTra: null,
  uocBoiThuong: null,
  hanMucConLai: null,
}))

// Per-trip table: HẠN MỨC = HẠN MỨC CÒN LẠI = limit; ĐÃ CHI TRẢ = ƯỚC BỒI THƯỜNG = 0 đ.
function buildTripBenefits(limits: [number, number, number, number]): BenefitRow[] {
  return BENEFIT_META.map((m, i) => ({
    ...m,
    hanMuc: money(limits[i]),
    daChiTra: money(0),
    uocBoiThuong: money(0),
    hanMucConLai: money(limits[i]),
  }))
}

const TRIP_LIMITS: [number, number, number, number] = [250000, 250000, 15000, 15000]

export const masterPolicyDetail: MasterPolicyDetail = {
  id: '1',
  driverCode: '8000075529',
  fullName: 'Chu Xuân Hưởng',
  dob: null,
  idNumber: null,
  gender: 'Male',
  contractNumber: '26/PC-GSM/067426',
  accumulationPeriod: null,
  benefits: masterBenefits,
  trips: [
    {
      id: 't1',
      gsmTripId: '01KTM096HKQ98CG7ZTZWC8NJM0',
      transferContractNo: '26/PC-GSM/067426/000012',
      completedAt: '2026-06-08T23:48:14',
      effectiveStart: '2026-06-08T23:48:14',
      effectiveEnd: '2026-12-05T23:48:13',
      sumInsured: 250000,
      benefits: buildTripBenefits(TRIP_LIMITS),
    },
    {
      id: 't2',
      gsmTripId: '01KTM23ECWFBJT4P34KBTNJN4P',
      transferContractNo: '26/PC-GSM/067426/000024',
      completedAt: '2026-06-08T23:58:54',
      effectiveStart: '2026-06-08T23:58:54',
      effectiveEnd: '2026-12-05T23:58:53',
      sumInsured: 250000,
      benefits: buildTripBenefits(TRIP_LIMITS),
    },
  ],
}

// Mock lookup: any id returns the single mock record (UI-only, no API).
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getMasterPolicyDetail(_id: string): MasterPolicyDetail {
  return masterPolicyDetail
}
