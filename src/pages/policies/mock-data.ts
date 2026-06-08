export type PolicyStatus = 'hoan-thanh' | 'hieu-luc' | 'het-hieu-luc' | 'da-huy'

export interface PolicyRow {
  id: string
  tripId: string // ID chuyến đi
  premium: number // Phí bảo hiểm (đ)
  plate: string // Biển số xe
  bookerName: string // Tên người đặt
  bookerPhone: string // SĐT người đặt
  riderName: string // Tên người đi
  riderPhone: string // SĐT người đi
  startAt: string // Thời gian bắt đầu (ISO)
  endAt: string // Thời gian kết thúc (ISO)
  fromAddress: string // Địa chỉ đi
  toAddress: string // Địa chỉ đến
  createdAt: string // Thời gian tạo đơn (ISO)
  status: PolicyStatus
}

// Mock assumption (spec §9.1): only "Hoàn thành" is confirmed from the design.
// The other three are placeholders so the filter dropdown functions.
export const STATUS_CONFIG: Record<
  PolicyStatus,
  { selectLabel: string; tagLabel: string; color: string }
> = {
  'hoan-thanh': { selectLabel: 'Đã hoàn thành', tagLabel: 'Hoàn thành', color: 'green' },
  'hieu-luc': { selectLabel: 'Hiệu lực', tagLabel: 'Hiệu lực', color: 'blue' },
  'het-hieu-luc': { selectLabel: 'Hết hiệu lực', tagLabel: 'Hết hiệu lực', color: 'default' },
  'da-huy': { selectLabel: 'Đã hủy', tagLabel: 'Đã hủy', color: 'red' },
}

export const statusOptions = (Object.keys(STATUS_CONFIG) as PolicyStatus[]).map((value) => ({
  value,
  label: STATUS_CONFIG[value].selectLabel,
}))

// Static headline totals — verbatim from the design (server-side totals, spec §9.2).
export const headlineTotalOrders = 721084
export const headlineTotalPremium = 1442168000

export function formatInt(n: number): string {
  return n.toLocaleString('en-US') // 721,084
}

export function formatPremium(n: number): string {
  return n.toLocaleString('vi-VN') // 1.442.168.000
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  const pad = (x: number) => String(x).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export const policyRows: PolicyRow[] = [
  {
    id: '1', tripId: '01K5ZFKYE36CXTC6TCVN18R6AZ', premium: 2000, plate: '68H-077.46',
    bookerName: 'lê xuyên', bookerPhone: '0869056332', riderName: 'lê xuyên', riderPhone: '0869056332',
    startAt: '2026-06-01T00:00:00', endAt: '2026-06-01T00:03:00',
    fromAddress: 'Dương Đông, Phú Quốc, Kiên Giang', toAddress: 'Đặc khu Phú Quốc, Tỉnh An Giang, Việt Nam',
    createdAt: '2026-06-01T00:00:00', status: 'hoan-thanh',
  },
  {
    id: '2', tripId: '01K5ZFKMNMJGH4E3JXVG6TFN7X', premium: 2000, plate: '22H-030.63',
    bookerName: 'Kiến', bookerPhone: '0975789021', riderName: 'Kiến', riderPhone: '0975789021',
    startAt: '2026-06-01T00:02:00', endAt: '2026-06-01T00:05:00',
    fromAddress: 'Phường Hà Giang 1, Tỉnh Tuyên Quang, Việt Nam', toAddress: 'Tổ 10, Phường Hà Giang 2, Tỉnh Tuyên Quang, Việt Nam',
    createdAt: '2026-06-01T00:02:00', status: 'hoan-thanh',
  },
  {
    id: '3', tripId: '01K5ZFEWDO1V9NF9E6WGZS1K9Z', premium: 2000, plate: '36H-157.02',
    bookerName: 'mai văn mạnh', bookerPhone: '0968966332', riderName: 'mai văn mạnh', riderPhone: '0968966332',
    startAt: '2026-06-01T00:00:00', endAt: '2026-06-01T00:04:00',
    fromAddress: 'P.Điện Biên, Tp.Thanh Hóa, Thanh Hóa, 40000, Vietnam', toAddress: 'Phường Hàm Rồng, Tp.Thanh Hóa, Thanh Hóa, Việt Nam',
    createdAt: '2026-06-01T00:00:00', status: 'hoan-thanh',
  },
  {
    id: '4', tripId: '01K5ZF8QK2M4P7RTYHN3DLWA2C', premium: 2000, plate: '29H-512.88',
    bookerName: 'Trần Hùng', bookerPhone: '0901234567', riderName: 'Trần Hùng', riderPhone: '0901234567',
    startAt: '2026-06-02T08:15:00', endAt: '2026-06-02T08:40:00',
    fromAddress: 'Quận Cầu Giấy, Hà Nội, Việt Nam', toAddress: 'Quận Đống Đa, Hà Nội, Việt Nam',
    createdAt: '2026-06-02T08:15:00', status: 'hoan-thanh',
  },
  {
    id: '5', tripId: '01K5ZF6BNV8XQ2WCEDR4TMK1HF', premium: 2000, plate: '51H-883.21',
    bookerName: 'Nguyễn Lan', bookerPhone: '0912345678', riderName: 'Nguyễn Lan', riderPhone: '0912345678',
    startAt: '2026-06-02T12:30:00', endAt: '2026-06-02T12:55:00',
    fromAddress: 'Quận 1, TP. Hồ Chí Minh, Việt Nam', toAddress: 'Quận 3, TP. Hồ Chí Minh, Việt Nam',
    createdAt: '2026-06-02T12:30:00', status: 'hieu-luc',
  },
  {
    id: '6', tripId: '01K5ZF4RPC7YHM9XGAT2VBLE5N', premium: 2000, plate: '43H-201.55',
    bookerName: 'Phạm Đức', bookerPhone: '0923456789', riderName: 'Phạm Đức', riderPhone: '0923456789',
    startAt: '2026-06-03T06:45:00', endAt: '2026-06-03T07:10:00',
    fromAddress: 'Quận Hải Châu, Đà Nẵng, Việt Nam', toAddress: 'Quận Sơn Trà, Đà Nẵng, Việt Nam',
    createdAt: '2026-06-03T06:45:00', status: 'hoan-thanh',
  },
  {
    id: '7', tripId: '01K5ZF2WTE5JKD8FNQR7YHSC3M', premium: 2000, plate: '92H-446.10',
    bookerName: 'Võ Minh', bookerPhone: '0934567890', riderName: 'Võ Minh', riderPhone: '0934567890',
    startAt: '2026-06-03T18:20:00', endAt: '2026-06-03T18:50:00',
    fromAddress: 'TP. Tam Kỳ, Quảng Nam, Việt Nam', toAddress: 'TP. Hội An, Quảng Nam, Việt Nam',
    createdAt: '2026-06-03T18:20:00', status: 'hoan-thanh',
  },
  {
    id: '8', tripId: '01K5ZF1HXA3QWE6RGZP9TMUD4B', premium: 2000, plate: '30H-778.93',
    bookerName: 'Đỗ Thu', bookerPhone: '0945678901', riderName: 'Đỗ Thu', riderPhone: '0945678901',
    startAt: '2026-06-04T09:05:00', endAt: '2026-06-04T09:35:00',
    fromAddress: 'Quận Hoàn Kiếm, Hà Nội, Việt Nam', toAddress: 'Quận Tây Hồ, Hà Nội, Việt Nam',
    createdAt: '2026-06-04T09:05:00', status: 'het-hieu-luc',
  },
  {
    id: '9', tripId: '01K5ZF0DMB9YUT2KFHWA5NRQ6P', premium: 2000, plate: '47H-330.62',
    bookerName: 'Bùi Sơn', bookerPhone: '0956789012', riderName: 'Bùi Sơn', riderPhone: '0956789012',
    startAt: '2026-06-04T15:40:00', endAt: '2026-06-04T16:05:00',
    fromAddress: 'TP. Buôn Ma Thuột, Đắk Lắk, Việt Nam', toAddress: 'Huyện Cư Mgar, Đắk Lắk, Việt Nam',
    createdAt: '2026-06-04T15:40:00', status: 'hoan-thanh',
  },
  {
    id: '10', tripId: '01K5ZEYZQF6WRC4XHNTD8LMK2J', premium: 2000, plate: '60H-915.47',
    bookerName: 'Hồ Yến', bookerPhone: '0967890123', riderName: 'Hồ Yến', riderPhone: '0967890123',
    startAt: '2026-06-05T07:25:00', endAt: '2026-06-05T07:55:00',
    fromAddress: 'TP. Biên Hòa, Đồng Nai, Việt Nam', toAddress: 'Huyện Long Thành, Đồng Nai, Việt Nam',
    createdAt: '2026-06-05T07:25:00', status: 'hoan-thanh',
  },
  {
    id: '11', tripId: '01K5ZEX4WG2TMD7YKHRA9NPC5V', premium: 2000, plate: '72H-188.34',
    bookerName: 'Dương Khoa', bookerPhone: '0978901234', riderName: 'Dương Khoa', riderPhone: '0978901234',
    startAt: '2026-06-05T20:10:00', endAt: '2026-06-05T20:38:00',
    fromAddress: 'TP. Vũng Tàu, Bà Rịa - Vũng Tàu, Việt Nam', toAddress: 'TP. Bà Rịa, Bà Rịa - Vũng Tàu, Việt Nam',
    createdAt: '2026-06-05T20:10:00', status: 'da-huy',
  },
  {
    id: '12', tripId: '01K5ZEW8YH5KNF3RDTQA7MLB6X', premium: 2000, plate: '88H-177.08',
    bookerName: 'Lý Hà', bookerPhone: '0989012345', riderName: 'Lý Hà', riderPhone: '0989012345',
    startAt: '2026-06-06T11:50:00', endAt: '2026-06-06T12:20:00',
    fromAddress: 'TP. Cần Thơ, Việt Nam', toAddress: 'Huyện Phong Điền, Cần Thơ, Việt Nam',
    createdAt: '2026-06-06T11:50:00', status: 'hoan-thanh',
  },
]
