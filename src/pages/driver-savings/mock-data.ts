export type DriverSavingsStatus = 'hoan-thanh' | 'hieu-luc' | 'het-hieu-luc' | 'da-huy'

export interface DriverSavingsRow {
  id: string
  phone: string // SĐT
  tripId: string // ID chuyến đi
  plate: string // Biển số xe (filter only; not shown in cells)
  driverCode: string // Mã tài xế
  customerName: string // Tên
  premium: number // Phí bảo hiểm (đ)
  policyNumber: string // Số đơn
  insuranceType: string // Loại bảo hiểm
  effectiveStart: string // Thời gian bắt đầu (ISO)
  effectiveEnd: string // Thời gian kết thúc (ISO)
  createdAt: string // Thời gian tạo / mua (ISO) — for create-date filter
  status: DriverSavingsStatus
}

// Mock assumption (spec §9.1): only "Hoàn thành" is confirmed from the design.
// The other three are placeholders so the filter dropdown functions.
export const STATUS_CONFIG: Record<
  DriverSavingsStatus,
  { selectLabel: string; tagLabel: string; color: string }
> = {
  'hoan-thanh': { selectLabel: 'Đã hoàn thành', tagLabel: 'Hoàn thành', color: 'green' },
  'hieu-luc': { selectLabel: 'Hiệu lực', tagLabel: 'Hiệu lực', color: 'blue' },
  'het-hieu-luc': { selectLabel: 'Hết hiệu lực', tagLabel: 'Hết hiệu lực', color: 'default' },
  'da-huy': { selectLabel: 'Đã hủy', tagLabel: 'Đã hủy', color: 'red' },
}

export const statusOptions = (Object.keys(STATUS_CONFIG) as DriverSavingsStatus[]).map((value) => ({
  value,
  label: STATUS_CONFIG[value].selectLabel,
}))

// Static headline totals — verbatim from the design (server-side totals, spec §9.2).
export const headlineTotalOrders = 7479138
export const headlineTotalPremium = 1238722150

export function formatInt(n: number): string {
  return n.toLocaleString('en-US') // 7,479,138
}

export function formatPremium(n: number): string {
  return n.toLocaleString('vi-VN') // 1.238.722.150
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  const pad = (x: number) => String(x).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// All policies are 6-month accumulation cover starting 01/06/2026 00:00,
// ending 27/11/2026 23:59 — matching the design. createdAt varies for the date filter.
export const driverSavingsRows: DriverSavingsRow[] = [
  {
    id: '1', phone: '+84375689232', tripId: '01KSZFCYNB2QZD8P6D4MSWPJM0', plate: '68H-077.46',
    driverCode: '6006389', customerName: 'Bùi Đức Tầm', premium: 200,
    policyNumber: '25/PC-GSM/6950974/012426', insuranceType: 'Gói Taxi PPT',
    effectiveStart: '2026-06-01T00:00:00', effectiveEnd: '2026-11-27T23:59:00',
    createdAt: '2026-06-01T00:00:00', status: 'hoan-thanh',
  },
  {
    id: '2', phone: '+84387764274', tripId: '01KSZFMSQEKGN3GSBQ0M5WKZV6', plate: '22H-030.63',
    driverCode: '6009542', customerName: 'Nguyễn Duy Tích', premium: 200,
    policyNumber: '25/PC-GSM/7392019/013969', insuranceType: 'Gói Taxi PPT',
    effectiveStart: '2026-06-01T00:00:00', effectiveEnd: '2026-11-27T23:59:00',
    createdAt: '2026-06-01T00:02:00', status: 'hoan-thanh',
  },
  {
    id: '3', phone: '+84936806555', tripId: '01KSZFLNJF367460ND4NDCO3KVP', plate: '36H-157.02',
    driverCode: '6022429', customerName: 'Vũ Gấp Dẫn', premium: 200,
    policyNumber: '25/PC-GSM/7291660/012646', insuranceType: 'Gói Taxi PPT',
    effectiveStart: '2026-06-01T00:00:00', effectiveEnd: '2026-11-27T23:59:00',
    createdAt: '2026-06-02T08:15:00', status: 'hoan-thanh',
  },
  {
    id: '4', phone: '+84901234567', tripId: '01KSZF8QK2M4P7RTYHN3DLWA2C', plate: '29H-512.88',
    driverCode: '6031007', customerName: 'Trần Hùng', premium: 200,
    policyNumber: '25/PC-GSM/7410882/014203', insuranceType: 'Gói Taxi PPT',
    effectiveStart: '2026-06-01T00:00:00', effectiveEnd: '2026-11-27T23:59:00',
    createdAt: '2026-06-02T12:30:00', status: 'hoan-thanh',
  },
  {
    id: '5', phone: '+84912345678', tripId: '01KSZF6BNV8XQ2WCEDR4TMK1HF', plate: '51H-883.21',
    driverCode: '6044318', customerName: 'Nguyễn Lan', premium: 200,
    policyNumber: '25/PC-GSM/7522930/014977', insuranceType: 'Gói Taxi PPT',
    effectiveStart: '2026-06-01T00:00:00', effectiveEnd: '2026-11-27T23:59:00',
    createdAt: '2026-06-03T06:45:00', status: 'hieu-luc',
  },
  {
    id: '6', phone: '+84923456789', tripId: '01KSZF4RPC7YHM9XGAT2VBLE5N', plate: '43H-201.55',
    driverCode: '6058640', customerName: 'Phạm Đức', premium: 200,
    policyNumber: '25/PC-GSM/7639114/015628', insuranceType: 'Gói Taxi PPT',
    effectiveStart: '2026-06-01T00:00:00', effectiveEnd: '2026-11-27T23:59:00',
    createdAt: '2026-06-03T18:20:00', status: 'hoan-thanh',
  },
  {
    id: '7', phone: '+84934567890', tripId: '01KSZF2WTE5JKD8FNQR7YHSC3M', plate: '92H-446.10',
    driverCode: '6061285', customerName: 'Võ Minh', premium: 200,
    policyNumber: '25/PC-GSM/7741250/016304', insuranceType: 'Gói Taxi PPT',
    effectiveStart: '2026-06-01T00:00:00', effectiveEnd: '2026-11-27T23:59:00',
    createdAt: '2026-06-04T09:05:00', status: 'hoan-thanh',
  },
  {
    id: '8', phone: '+84945678901', tripId: '01KSZF1HXA3QWE6RGZP9TMUD4B', plate: '30H-778.93',
    driverCode: '6075992', customerName: 'Đỗ Thu', premium: 200,
    policyNumber: '25/PC-GSM/7858663/017011', insuranceType: 'Gói Taxi PPT',
    effectiveStart: '2026-06-01T00:00:00', effectiveEnd: '2026-11-27T23:59:00',
    createdAt: '2026-06-04T15:40:00', status: 'het-hieu-luc',
  },
  {
    id: '9', phone: '+84956789012', tripId: '01KSZF0DMB9YUT2KFHWA5NRQ6P', plate: '47H-330.62',
    driverCode: '6082137', customerName: 'Bùi Sơn', premium: 200,
    policyNumber: '25/PC-GSM/7960441/017788', insuranceType: 'Gói Taxi PPT',
    effectiveStart: '2026-06-01T00:00:00', effectiveEnd: '2026-11-27T23:59:00',
    createdAt: '2026-06-05T07:25:00', status: 'hoan-thanh',
  },
  {
    id: '10', phone: '+84967890123', tripId: '01KSZEYZQF6WRC4XHNTD8LMK2J', plate: '60H-915.47',
    driverCode: '6098450', customerName: 'Hồ Yến', premium: 200,
    policyNumber: '25/PC-GSM/8072119/018465', insuranceType: 'Gói Taxi PPT',
    effectiveStart: '2026-06-01T00:00:00', effectiveEnd: '2026-11-27T23:59:00',
    createdAt: '2026-06-05T20:10:00', status: 'hoan-thanh',
  },
  {
    id: '11', phone: '+84978901234', tripId: '01KSZEX4WG2TMD7YKHRA9NPC5V', plate: '72H-188.34',
    driverCode: '6103776', customerName: 'Dương Khoa', premium: 200,
    policyNumber: '25/PC-GSM/8183507/019142', insuranceType: 'Gói Taxi PPT',
    effectiveStart: '2026-06-01T00:00:00', effectiveEnd: '2026-11-27T23:59:00',
    createdAt: '2026-06-06T11:50:00', status: 'da-huy',
  },
  {
    id: '12', phone: '+84989012345', tripId: '01KSZEW8YH5KNF3RDTQA7MLB6X', plate: '88H-177.08',
    driverCode: '6117039', customerName: 'Lý Hà', premium: 200,
    policyNumber: '25/PC-GSM/8294885/019819', insuranceType: 'Gói Taxi PPT',
    effectiveStart: '2026-06-01T00:00:00', effectiveEnd: '2026-11-27T23:59:00',
    createdAt: '2026-06-08T07:30:00', status: 'hoan-thanh',
  },
]
