import type { BenefitRow, AccumulationTrip } from '../../components/insurance/types'
import { formatMoney } from '../../components/insurance/format'
import { masterPolicyRows, type MasterPolicyRow } from '../master-policies/mock-data'
import { getContractTerms, type ContractTerms } from './contract-terms'

export interface MasterPolicyDetail {
  id: string
  driverCode: string // Mã Tài xế Grab
  fullName: string // Họ và tên
  dob: string | null // Ngày sinh
  idNumber: string | null // Số CMND/CCCD/Hộ chiếu
  gender: string // Giới tính
  contractNumber: string // Số hợp đồng nguyên tắc
  accumulationPeriod: string | null // STBH tích lũy trong thời gian
  terms: ContractTerms // Thông số HĐ nguyên tắc theo loại tài xế (xe máy/ô tô)
  benefits: BenefitRow[]
  trips: AccumulationTrip[]
}

function money(n: number): string {
  return `${formatMoney(n)} đ`
}

function formatDob(iso: string): string {
  const d = new Date(iso)
  const pad = (x: number) => String(x).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
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

// Master-level table: tất cả gạch ngang, riêng dòng nằm viện hiển thị hạn mức theo loại tài xế.
function buildMasterBenefits(terms: ContractTerms): BenefitRow[] {
  const hanMucByKey: Record<string, string | null> = {
    death: null,
    disability: null,
    hospital: `Tối đa mỗi đợt nằm viện VND ${formatMoney(terms.hospitalMaxPerStay)}`,
    medical: null,
  }
  return BENEFIT_META.map((m) => ({
    ...m,
    hanMuc: hanMucByKey[m.key],
    daChiTra: null,
    uocBoiThuong: null,
    hanMucConLai: null,
  }))
}

// Per-trip table: HẠN MỨC = HẠN MỨC CÒN LẠI = giới hạn; ĐÃ CHI TRẢ = ƯỚC BỒI THƯỜNG = 0 đ.
function buildTripBenefits(terms: ContractTerms): BenefitRow[] {
  const limitByKey: Record<string, number> = {
    death: terms.deathDisabilityLimit,
    disability: terms.deathDisabilityLimit,
    hospital: terms.hospitalLimitPerPolicy,
    medical: terms.medicalLimitPerPolicy,
  }
  return BENEFIT_META.map((m) => ({
    ...m,
    hanMuc: money(limitByKey[m.key]),
    daChiTra: money(0),
    uocBoiThuong: money(0),
    hanMucConLai: money(limitByKey[m.key]),
  }))
}

// Hai đơn tích lũy mẫu (ID chuyến & mốc thời gian cố định cho demo).
const SAMPLE_TRIPS: Array<{
  grabTripId: string
  seq: string
  completedAt: string
  effectiveStart: string
  effectiveEnd: string
}> = [
  {
    grabTripId: '01KTM096HKQ98CG7ZTZWC8NJM0',
    seq: '000012',
    completedAt: '2026-06-08T23:48:14',
    effectiveStart: '2026-06-08T23:48:14',
    effectiveEnd: '2026-12-05T23:48:13',
  },
  {
    grabTripId: '01KTM23ECWFBJT4P34KBTNJN4P',
    seq: '000024',
    completedAt: '2026-06-08T23:58:54',
    effectiveStart: '2026-06-08T23:58:54',
    effectiveEnd: '2026-12-05T23:58:53',
  },
]

function buildTrips(row: MasterPolicyRow, terms: ContractTerms): AccumulationTrip[] {
  return SAMPLE_TRIPS.map((t, i) => ({
    id: `t${i + 1}`,
    grabTripId: t.grabTripId,
    transferContractNo: `${row.contractNumber}/${t.seq}`,
    completedAt: t.completedAt,
    effectiveStart: t.effectiveStart,
    effectiveEnd: t.effectiveEnd,
    sumInsured: terms.accumMaxPerPolicy,
    benefits: buildTripBenefits(terms),
  }))
}

function buildDetail(row: MasterPolicyRow): MasterPolicyDetail {
  const terms = getContractTerms(row.contractNumber, row.packageName)
  return {
    id: row.id,
    driverCode: row.driverCode,
    fullName: row.customerName,
    dob: formatDob(row.dob),
    idNumber: row.idNumber,
    gender: row.gender,
    contractNumber: row.contractNumber,
    accumulationPeriod: null,
    terms,
    benefits: buildMasterBenefits(terms),
    trips: buildTrips(row, terms),
  }
}

// Lookup theo id của hàng được bấm "Xem hợp đồng nguyên tắc"; fallback về hàng đầu tiên.
export function getMasterPolicyDetail(id: string): MasterPolicyDetail {
  const row = masterPolicyRows.find((r) => r.id === id) ?? masterPolicyRows[0]
  return buildDetail(row)
}
