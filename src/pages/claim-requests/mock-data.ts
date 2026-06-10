export type ClaimRequestStatus =
  | 'ho-so-chua-tao'
  | 'da-tao-ho-so'
  | 'dang-xu-ly'
  | 'hoan-thanh'
  | 'tu-choi'

export interface ClaimRequestRow {
  id: string
  source: string | null // Nguồn tiếp nhận — null renders as "-"
  requestedAt: string // Ngày yêu cầu bồi thường (ISO)
  lossNoticeNumber: string // Số thông báo tổn thất
  // Thông tin khách hàng
  driverCode: string // Mã tài xế
  masterPolicyNumber: string // Số HĐNT
  customerName: string // Tên
  phone: string // Số điện thoại
  // Thông tin về tai nạn
  accidentDate: string // Ngày xảy ra tai nạn (ISO date)
  accidentPlace: string // Nơi xảy ra tai nạn
  accidentConsequence: string // Hậu quả tai nạn
  claimAmount: number // Số tiền yêu cầu chi trả (đ)
  status: ClaimRequestStatus
}

// Only "Hồ sơ chưa tạo" is confirmed from the design. The rest are placeholders
// so the status filter is demonstrable; replace when BE/business confirms.
export const STATUS_CONFIG: Record<
  ClaimRequestStatus,
  { selectLabel: string; tagLabel: string; color: string }
> = {
  'ho-so-chua-tao': { selectLabel: 'Hồ sơ chưa tạo', tagLabel: 'Hồ sơ chưa tạo', color: 'orange' },
  'da-tao-ho-so': { selectLabel: 'Đã tạo hồ sơ', tagLabel: 'Đã tạo hồ sơ', color: 'blue' },
  'dang-xu-ly': { selectLabel: 'Đang xử lý', tagLabel: 'Đang xử lý', color: 'gold' },
  'hoan-thanh': { selectLabel: 'Hoàn thành', tagLabel: 'Hoàn thành', color: 'green' },
  'tu-choi': { selectLabel: 'Từ chối', tagLabel: 'Từ chối', color: 'red' },
}

export const statusOptions = (Object.keys(STATUS_CONFIG) as ClaimRequestStatus[]).map((value) => ({
  value,
  label: STATUS_CONFIG[value].selectLabel,
}))

// Placeholder receiving channels (not confirmed from design).
export const sourceOptions = [
  { value: 'app-tai-xe', label: 'App tài xế' },
  { value: 'tong-dai', label: 'Tổng đài' },
  { value: 'email', label: 'Email' },
]

export type SortOrder = 'newest' | 'oldest'

export const sortOptions: { value: SortOrder; label: string }[] = [
  { value: 'newest', label: 'Xếp theo mới nhất' },
  { value: 'oldest', label: 'Xếp theo cũ nhất' },
]

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  const pad = (x: number) => String(x).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  const pad = (x: number) => String(x).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}

export function formatAmount(n: number): string {
  return `${n.toLocaleString('vi-VN')} đ`
}

// Rows 1-4 use values read from docs/ui/claim-requests-list.png; rows 5-12 are
// synthetic but plausible. Source is null on every row to match the design ("-").
export const claimRequestRows: ClaimRequestRow[] = [
  {
    id: '1', source: null, requestedAt: '2026-06-03T14:12:00', lossNoticeNumber: '26TT000819',
    driverCode: '6123723', masterPolicyNumber: '25/PC-GRAB/10819478', customerName: 'Phạm Xuân Đông Hải',
    phone: '+84968532564', accidentDate: '2026-05-31', accidentPlace: 'Phường thới an',
    accidentConsequence: 'Tiêm vắc xin', claimAmount: 1725000, status: 'ho-so-chua-tao',
  },
  {
    id: '2', source: null, requestedAt: '2026-06-01T14:11:00', lossNoticeNumber: '26TT000800',
    driverCode: '6014097', masterPolicyNumber: '25/PC-GRAB/10782791', customerName: 'Nguyễn Văn Dương',
    phone: '+84368258977', accidentDate: '2026-05-05', accidentPlace: 'Nhật Nhất Quảng Ninh',
    accidentConsequence: 'Khâu vết thương, kháng sinh, giảm đau, theo dõi tri giác',
    claimAmount: 3000000, status: 'ho-so-chua-tao',
  },
  {
    id: '3', source: null, requestedAt: '2026-05-26T06:21:00', lossNoticeNumber: '26TT000793',
    driverCode: '6098214', masterPolicyNumber: '25/PC-GRAB/6591302', customerName: 'Phạm Việt Hoàng',
    phone: '+84971853978', accidentDate: '2026-05-25', accidentPlace: 'Trường Bình Phú, Quận 6',
    accidentConsequence: 'Dập cơ, dập gân', claimAmount: 2425000, status: 'ho-so-chua-tao',
  },
  {
    id: '4', source: null, requestedAt: '2026-05-25T16:00:00', lossNoticeNumber: '26TT000784',
    driverCode: '6142637', masterPolicyNumber: '26/PC-GRAB/026202', customerName: 'Tăng Cóng Vửng',
    phone: '+84357283152', accidentDate: '2026-05-01', accidentPlace: 'Trường trinh , chế Lan viên',
    accidentConsequence: 'Ngoài da', claimAmount: 1800000, status: 'ho-so-chua-tao',
  },
  {
    id: '5', source: null, requestedAt: '2026-05-24T09:30:00', lossNoticeNumber: '26TT000771',
    driverCode: '6033188', masterPolicyNumber: '25/PC-GRAB/7392019', customerName: 'Nguyễn Duy Tích',
    phone: '+84387764274', accidentDate: '2026-05-20', accidentPlace: 'Quận Long Biên, Hà Nội',
    accidentConsequence: 'Gãy tay phải', claimAmount: 4200000, status: 'da-tao-ho-so',
  },
  {
    id: '6', source: null, requestedAt: '2026-05-22T11:05:00', lossNoticeNumber: '26TT000760',
    driverCode: '6022429', masterPolicyNumber: '25/PC-GRAB/7291660', customerName: 'Vũ Gấp Dẫn',
    phone: '+84936806555', accidentDate: '2026-05-18', accidentPlace: 'TP Biên Hoà, Đồng Nai',
    accidentConsequence: 'Chấn thương đầu gối', claimAmount: 2750000, status: 'dang-xu-ly',
  },
  {
    id: '7', source: null, requestedAt: '2026-05-20T08:45:00', lossNoticeNumber: '26TT000742',
    driverCode: '6031007', masterPolicyNumber: '25/PC-GRAB/7410882', customerName: 'Trần Hùng',
    phone: '+84901234567', accidentDate: '2026-05-15', accidentPlace: 'Quận 7, TP HCM',
    accidentConsequence: 'Trầy xước phần mềm', claimAmount: 1500000, status: 'hoan-thanh',
  },
  {
    id: '8', source: null, requestedAt: '2026-05-18T17:20:00', lossNoticeNumber: '26TT000730',
    driverCode: '6044318', masterPolicyNumber: '25/PC-GRAB/7522930', customerName: 'Nguyễn Lan',
    phone: '+84912345678', accidentDate: '2026-05-12', accidentPlace: 'Quận Hải Châu, Đà Nẵng',
    accidentConsequence: 'Bong gân cổ chân', claimAmount: 1950000, status: 'tu-choi',
  },
  {
    id: '9', source: null, requestedAt: '2026-05-16T13:10:00', lossNoticeNumber: '26TT000718',
    driverCode: '6058640', masterPolicyNumber: '25/PC-GRAB/7639114', customerName: 'Phạm Đức',
    phone: '+84923456789', accidentDate: '2026-05-10', accidentPlace: 'TP Vũng Tàu',
    accidentConsequence: 'Khâu 5 mũi vùng cẳng tay', claimAmount: 2100000, status: 'ho-so-chua-tao',
  },
  {
    id: '10', source: null, requestedAt: '2026-05-14T07:55:00', lossNoticeNumber: '26TT000705',
    driverCode: '6061285', masterPolicyNumber: '25/PC-GRAB/7741250', customerName: 'Võ Minh',
    phone: '+84934567890', accidentDate: '2026-05-08', accidentPlace: 'TP Cần Thơ',
    accidentConsequence: 'Theo dõi chấn động não', claimAmount: 3600000, status: 'da-tao-ho-so',
  },
  {
    id: '11', source: null, requestedAt: '2026-05-12T15:40:00', lossNoticeNumber: '26TT000691',
    driverCode: '6075992', masterPolicyNumber: '25/PC-GRAB/7858663', customerName: 'Đỗ Thu',
    phone: '+84945678901', accidentDate: '2026-05-06', accidentPlace: 'Quận Ninh Kiều, Cần Thơ',
    accidentConsequence: 'Gãy xương đòn', claimAmount: 5000000, status: 'dang-xu-ly',
  },
  {
    id: '12', source: null, requestedAt: '2026-05-10T10:25:00', lossNoticeNumber: '26TT000680',
    driverCode: '6082137', masterPolicyNumber: '25/PC-GRAB/7960441', customerName: 'Bùi Sơn',
    phone: '+84956789012', accidentDate: '2026-05-03', accidentPlace: 'TP Nha Trang',
    accidentConsequence: 'Trật khớp vai', claimAmount: 2300000, status: 'hoan-thanh',
  },
]
