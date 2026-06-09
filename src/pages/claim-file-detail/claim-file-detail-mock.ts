import type { InfoItem } from './components/InfoTable'
import type { PaymentRow } from './components/PaymentTable'
import type { BenefitRow, AccumulationTrip } from '../../components/insurance/types'
import { formatMoney } from '../../components/insurance/format'

export interface ClaimFileDetail {
  id: string
  masterPolicyNumber: string // Chọn Hợp đồng nguyên tắc (select value)
  status: string // Trạng thái Hồ sơ bồi thường (select value)
  insured: InfoItem[]
  beneficiary: InfoItem[]
  accident: InfoItem[]
  attachments: string[] // Tải ảnh kèm — display-only thumbnails
  benefits: BenefitRow[]
  payments: PaymentRow[]
  trips: AccumulationTrip[]
}

// HĐNT select options — '24/PM-GSM/013203' is from the design; others are
// plausible fillers so the select is functional (UI-only, no API).
export const masterPolicyOptions = [
  { value: '24/PM-GSM/013203', label: '24/PM-GSM/013203' },
  { value: '25/PM-GSM/3854282', label: '25/PM-GSM/3854282' },
  { value: '24/PC-GSM/028080', label: '24/PC-GSM/028080' },
]

// Status options — 'Thanh toán bồi thường' is from the design; others are
// plausible fillers. // VERIFY vs design (exact option set unknown).
export const claimFileStatusOptions = [
  { value: 'tiep-nhan', label: 'Tiếp nhận hồ sơ' },
  { value: 'tham-dinh', label: 'Thẩm định bồi thường' },
  { value: 'thanh-toan', label: 'Thanh toán bồi thường' },
  { value: 'hoan-thanh', label: 'Hoàn thành' },
]

function money(n: number): string {
  return `${formatMoney(n)} đ`
}

// 4 standard benefit lines (same metadata as master-policy-detail).
// VERIFY vs design (images 02/03) for exact amounts on this claim.
const benefits: BenefitRow[] = [
  { key: 'death', name: 'Tử vong do tai nạn', hanMuc: money(20000000), daChiTra: money(0), uocBoiThuong: money(0), hanMucConLai: money(20000000) },
  { key: 'disability', name: 'Thương tật toàn bộ vĩnh viễn do tai nạn', hanMuc: money(20000000), daChiTra: money(0), uocBoiThuong: money(0), hanMucConLai: money(20000000) },
  {
    key: 'hospital',
    name: 'Trợ cấp nằm viện do tai nạn',
    sub: 'Chi trả trợ cấp nằm viện do Tai nạn từ trọn 2 ngày trở lên',
    hanMuc: money(1500000), daChiTra: money(1500000), uocBoiThuong: money(0), hanMucConLai: money(0),
  },
  {
    key: 'medical',
    name: 'Chi phí y tế do tai nạn',
    sub: 'Chỉ chi trả các CPYT phát sinh trong thời hạn BH',
    hanMuc: money(15000000), daChiTra: money(16232506), uocBoiThuong: money(0), hanMucConLai: money(0),
  },
]

// "Bảng thanh toán bồi thường". // VERIFY vs design (image 02) — exact columns
// unreadable in screenshot; see PaymentTable for the column set.
const payments: PaymentRow[] = [
  { key: 'p1', benefit: 'Trợ cấp nằm viện do tai nạn', requested: money(1500000), approved: money(1500000), note: null },
  { key: 'p2', benefit: 'Chi phí y tế do tai nạn', requested: money(16232506), approved: money(16232506), note: null },
]

const trips: AccumulationTrip[] = [
  {
    id: 't1',
    gsmTripId: '01KTM096HKQ98CG7ZTZWC8NJM0',
    transferContractNo: '24/PM-GSM/013203/000012',
    completedAt: '2025-11-14T08:12:03',
    effectiveStart: '2025-11-14T08:12:03',
    effectiveEnd: '2026-05-13T08:12:02',
    sumInsured: 250000,
    benefits,
  },
  {
    id: 't2',
    gsmTripId: '01KTM23ECWFBJT4P34KBTNJN4P',
    transferContractNo: '24/PM-GSM/013203/000024',
    completedAt: '2025-11-14T09:30:41',
    effectiveStart: '2025-11-14T09:30:41',
    effectiveEnd: '2026-05-13T09:30:40',
    sumInsured: 250000,
    benefits,
  },
]

// Mirrors claim-files list row id '1' (src/pages/claim-files/mock-data.ts) + image 01.
const defaultDetail: ClaimFileDetail = {
  id: '1',
  masterPolicyNumber: '24/PM-GSM/013203',
  status: 'thanh-toan',
  insured: [
    { label: 'Mã Tài xế GSM', value: '3000000761' },
    { label: 'Họ và tên', value: 'Phạm Minh Hòa' },
    { label: 'Giới tính', value: 'Nam' },
    { label: 'Số CMND/CCCD/ Hộ chiếu', value: null },
    { label: 'Ngày sinh', value: null },
    { label: 'Số điện thoại', value: '+84343868396' },
    { label: 'Email', value: null },
    { label: 'Số điện thoại sử dụng Zalo', value: null },
  ],
  beneficiary: [
    { label: 'Người thụ hưởng', value: 'PHẠM MINH HOÀ' },
    { label: 'Số tài khoản', value: '925951661995' },
    { label: 'Ngân hàng', value: 'TECHCOMBANK' },
    { label: 'Địa chỉ ngân hàng', value: null },
  ],
  // VERIFY vs design (image 02): field list/labels are low-res. Best-effort below.
  accident: [
    { label: 'Ngày tai nạn', value: '14/11/2025' },
    { label: 'Nơi xảy ra tai nạn', value: null },
    { label: 'Ngày khám bệnh', value: null },
    { label: 'Ngày nhập viện', value: null },
    { label: 'Nơi điều trị', value: null },
    { label: 'Nguyên nhân / Chẩn đoán về tai nạn', value: null },
    { label: 'Hậu quả', value: null },
    { label: 'Hình thức điều trị', value: null },
  ],
  attachments: [],
  benefits,
  payments,
  trips,
}

// Mock lookup: any id returns the single mock record (UI-only, no API).
export function findClaimFileDetail(_id?: string): ClaimFileDetail {
  return defaultDetail
}
