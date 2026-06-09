export type ClaimFileStatus = 'da-thanh-toan' | 'cho-thanh-toan' | 'tu-choi' | 'da-huy'

export interface ClaimFileRow {
  id: string
  claimRequestNumber: string // Số yêu cầu bồi thường — 26TT000444
  claimFileCode: string // Mã Hồ sơ bồi thường — JOB2600000134
  accidentDate: string // Ngày xảy ra tai nạn (ISO date)
  driverCode: string // Mã tài xế
  customerName: string // Họ và tên
  masterPolicyNumber: string // Số HĐNT — 24/PM-GSM/013203
  customerRequested: number // Khách hàng yêu cầu (đ)
  estimatedClaim: number // Ước bồi thường (đ)
  paidAmount: number // Đã chi trả (đ)
  paidAt: string // Ngày thực hiện chi trả (ISO datetime)
  status: ClaimFileStatus
}

export type SortOrder = 'newest' | 'oldest'

// Mock assumption (spec §9.1): only "Đã thanh toán" is confirmed from the design.
// The other three are placeholders so the status filter dropdown functions.
export const STATUS_CONFIG: Record<
  ClaimFileStatus,
  { selectLabel: string; tagLabel: string; color: string }
> = {
  'da-thanh-toan': { selectLabel: 'Đã thanh toán', tagLabel: 'Đã thanh toán', color: 'green' },
  'cho-thanh-toan': { selectLabel: 'Chờ thanh toán', tagLabel: 'Chờ thanh toán', color: 'gold' },
  'tu-choi': { selectLabel: 'Từ chối', tagLabel: 'Từ chối', color: 'red' },
  'da-huy': { selectLabel: 'Đã hủy', tagLabel: 'Đã hủy', color: 'default' },
}

export const statusOptions = (Object.keys(STATUS_CONFIG) as ClaimFileStatus[]).map((value) => ({
  value,
  label: STATUS_CONFIG[value].selectLabel,
}))

export const sortOptions: { value: SortOrder; label: string }[] = [
  { value: 'newest', label: 'Xếp theo mới nhất' },
  { value: 'oldest', label: 'Xếp theo cũ nhất' },
]

export function formatAmount(n: number): string {
  return `${n.toLocaleString('vi-VN')} đ` // 16.232.506 đ
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  const pad = (x: number) => String(x).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  const pad = (x: number) => String(x).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// Rows 1-5 are seeded verbatim from the design screenshot; the rest are plausible
// fillers. A few use placeholder statuses so the filter is demonstrable.
export const claimFileRows: ClaimFileRow[] = [
  {
    id: '1', claimRequestNumber: '26TT000444', claimFileCode: 'JOB2600000134',
    accidentDate: '2025-11-14', driverCode: '3000000761', customerName: 'Phạm Minh Hoà',
    masterPolicyNumber: '24/PM-GSM/013203', customerRequested: 16232506, estimatedClaim: 0,
    paidAmount: 17732506, paidAt: '2026-02-13T14:40:00', status: 'da-thanh-toan',
  },
  {
    id: '2', claimRequestNumber: '26TT000435', claimFileCode: 'JOB2600000133',
    accidentDate: '2025-11-10', driverCode: '5000001322', customerName: 'Nguyễn Văn Huân',
    masterPolicyNumber: '25/PM-GSM/3854282', customerRequested: 950000, estimatedClaim: 0,
    paidAmount: 950000, paidAt: '2026-02-13T14:29:00', status: 'da-thanh-toan',
  },
  {
    id: '3', claimRequestNumber: '26TT000428', claimFileCode: 'JOB2600000128',
    accidentDate: '2025-10-28', driverCode: '6073429', customerName: 'Trịnh Văn Long',
    masterPolicyNumber: '24/PC-GSM/028080', customerRequested: 4546721, estimatedClaim: 0,
    paidAmount: 7546721, paidAt: '2026-02-13T14:23:00', status: 'da-thanh-toan',
  },
  {
    id: '4', claimRequestNumber: '26TT000401', claimFileCode: 'JOB2600000101',
    accidentDate: '2025-12-02', driverCode: '5000047147', customerName: 'Võ Văn Vĩnh',
    masterPolicyNumber: '24/PM-GSM/011170', customerRequested: 7715127, estimatedClaim: 0,
    paidAmount: 9215127, paidAt: '2026-01-03T17:00:00', status: 'da-thanh-toan',
  },
  {
    id: '5', claimRequestNumber: '26TT000399', claimFileCode: 'JOB2600000099',
    accidentDate: '2025-12-01', driverCode: '6020823', customerName: 'Vũ Trọng Nghĩa',
    masterPolicyNumber: '24/PC-GSM/006536', customerRequested: 20020603, estimatedClaim: 0,
    paidAmount: 20020603, paidAt: '2026-01-03T16:57:00', status: 'da-thanh-toan',
  },
  {
    id: '6', claimRequestNumber: '26TT000388', claimFileCode: 'JOB2600000088',
    accidentDate: '2025-11-22', driverCode: '5000049129', customerName: 'Đặng Thị Hồng',
    masterPolicyNumber: '24/PM-GSM/009921', customerRequested: 10757500, estimatedClaim: 0,
    paidAmount: 10757500, paidAt: '2026-01-02T11:12:00', status: 'da-thanh-toan',
  },
  {
    id: '7', claimRequestNumber: '26TT000372', claimFileCode: 'JOB2600000072',
    accidentDate: '2025-11-05', driverCode: '6041288', customerName: 'Lê Quang Huy',
    masterPolicyNumber: '24/PC-GSM/004417', customerRequested: 3120000, estimatedClaim: 0,
    paidAmount: 3120000, paidAt: '2025-12-28T09:40:00', status: 'da-thanh-toan',
  },
  {
    id: '8', claimRequestNumber: '26TT000361', claimFileCode: 'JOB2600000061',
    accidentDate: '2025-10-19', driverCode: '5000052310', customerName: 'Hoàng Văn Nam',
    masterPolicyNumber: '25/PM-GSM/2210984', customerRequested: 6480000, estimatedClaim: 6480000,
    paidAmount: 0, paidAt: '2025-12-20T15:05:00', status: 'cho-thanh-toan',
  },
  {
    id: '9', claimRequestNumber: '26TT000350', claimFileCode: 'JOB2600000050',
    accidentDate: '2025-10-11', driverCode: '6058120', customerName: 'Bùi Thị Lan',
    masterPolicyNumber: '24/PC-GSM/002288', customerRequested: 12500000, estimatedClaim: 0,
    paidAmount: 0, paidAt: '2025-12-15T10:30:00', status: 'tu-choi',
  },
  {
    id: '10', claimRequestNumber: '26TT000344', claimFileCode: 'JOB2600000044',
    accidentDate: '2025-09-30', driverCode: '5000061472', customerName: 'Ngô Đức Thắng',
    masterPolicyNumber: '25/PM-GSM/1905533', customerRequested: 8900000, estimatedClaim: 0,
    paidAmount: 8900000, paidAt: '2025-12-10T13:18:00', status: 'da-thanh-toan',
  },
  {
    id: '11', claimRequestNumber: '26TT000330', claimFileCode: 'JOB2600000030',
    accidentDate: '2025-09-18', driverCode: '6066903', customerName: 'Phan Thị Mai',
    masterPolicyNumber: '24/PC-GSM/001150', customerRequested: 2150000, estimatedClaim: 0,
    paidAmount: 2150000, paidAt: '2025-12-05T08:02:00', status: 'da-huy',
  },
  {
    id: '12', claimRequestNumber: '26TT000318', claimFileCode: 'JOB2600000018',
    accidentDate: '2025-09-09', driverCode: '5000070019', customerName: 'Đỗ Văn Sơn',
    masterPolicyNumber: '25/PM-GSM/1620447', customerRequested: 5400000, estimatedClaim: 0,
    paidAmount: 5400000, paidAt: '2025-11-30T16:45:00', status: 'da-thanh-toan',
  },
]
