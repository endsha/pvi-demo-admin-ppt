import type { PolicyRow } from '../policies/mock-data'

// Mock assumption (spec §8.1): the Grab products from the sidebar.
// Not present in the screenshot — kept as a flagged assumption.
export const INSURANCE_TYPES = [
  'Tai nạn hành khách theo chuyến',
  'Bảo hiểm hàng hoá',
  'Bảo hiểm tích lũy tài xế',
  'Bảo hiểm FoodCare',
] as const

export const ALL_INSURANCE = 'Tất cả'

export interface GrabRecord extends PolicyRow {
  driverCode: string // "Mã tài xế Grab"
  insuranceType: string // "Loại bảo hiểm" label
}

export const insuranceTypeOptions = [
  { value: ALL_INSURANCE, label: ALL_INSURANCE },
  ...INSURANCE_TYPES.map((t) => ({ value: t, label: t })),
]

export const grabRecords: GrabRecord[] = [
  {
    id: '1', tripId: '01K5ZFKYE36CXTC6TCVN18R6AZ', premium: 2000, plate: '68H-077.46',
    bookerName: 'lê xuyên', bookerPhone: '0869056332', riderName: 'lê xuyên', riderPhone: '0869056332',
    startAt: '2026-06-01T00:00:00', endAt: '2026-06-01T00:03:00',
    fromAddress: 'Dương Đông, Phú Quốc, Kiên Giang', toAddress: 'Đặc khu Phú Quốc, Tỉnh An Giang, Việt Nam',
    createdAt: '2026-06-01T00:00:00', status: 'hoan-thanh',
    driverCode: 'GRAB-100245', insuranceType: 'Tai nạn hành khách theo chuyến',
  },
  {
    id: '2', tripId: '01K5ZFKMNMJGH4E3JXVG6TFN7X', premium: 2000, plate: '22H-030.63',
    bookerName: 'Kiến', bookerPhone: '0975789021', riderName: 'Kiến', riderPhone: '0975789021',
    startAt: '2026-06-01T00:02:00', endAt: '2026-06-01T00:05:00',
    fromAddress: 'Phường Hà Giang 1, Tỉnh Tuyên Quang, Việt Nam', toAddress: 'Tổ 10, Phường Hà Giang 2, Tỉnh Tuyên Quang, Việt Nam',
    createdAt: '2026-06-01T00:02:00', status: 'hoan-thanh',
    driverCode: 'GRAB-100312', insuranceType: 'Tai nạn hành khách theo chuyến',
  },
  {
    id: '3', tripId: '01K5ZFEWDO1V9NF9E6WGZS1K9Z', premium: 2000, plate: '36H-157.02',
    bookerName: 'mai văn mạnh', bookerPhone: '0968966332', riderName: 'mai văn mạnh', riderPhone: '0968966332',
    startAt: '2026-06-01T00:00:00', endAt: '2026-06-01T00:04:00',
    fromAddress: 'P.Điện Biên, Tp.Thanh Hóa, Thanh Hóa, 40000, Vietnam', toAddress: 'Phường Hàm Rồng, Tp.Thanh Hóa, Thanh Hóa, Việt Nam',
    createdAt: '2026-06-01T00:00:00', status: 'hoan-thanh',
    driverCode: 'GRAB-100487', insuranceType: 'Bảo hiểm tích lũy tài xế',
  },
  {
    id: '4', tripId: '01K5ZF8QK2M4P7RTYHN3DLWA2C', premium: 2000, plate: '29H-512.88',
    bookerName: 'Trần Hùng', bookerPhone: '0901234567', riderName: 'Trần Hùng', riderPhone: '0901234567',
    startAt: '2026-06-02T08:15:00', endAt: '2026-06-02T08:40:00',
    fromAddress: 'Quận Cầu Giấy, Hà Nội, Việt Nam', toAddress: 'Quận Đống Đa, Hà Nội, Việt Nam',
    createdAt: '2026-06-02T08:15:00', status: 'hoan-thanh',
    driverCode: 'GRAB-100529', insuranceType: 'Tai nạn hành khách theo chuyến',
  },
  {
    id: '5', tripId: '01K5ZF6BNV8XQ2WCEDR4TMK1HF', premium: 2000, plate: '51H-883.21',
    bookerName: 'Nguyễn Lan', bookerPhone: '0912345678', riderName: 'Nguyễn Lan', riderPhone: '0912345678',
    startAt: '2026-06-02T12:30:00', endAt: '2026-06-02T12:55:00',
    fromAddress: 'Quận 1, TP. Hồ Chí Minh, Việt Nam', toAddress: 'Quận 3, TP. Hồ Chí Minh, Việt Nam',
    createdAt: '2026-06-02T12:30:00', status: 'hieu-luc',
    driverCode: 'GRAB-100618', insuranceType: 'Bảo hiểm hàng hoá',
  },
  {
    id: '6', tripId: '01K5ZF4RPC7YHM9XGAT2VBLE5N', premium: 2000, plate: '43H-201.55',
    bookerName: 'Phạm Đức', bookerPhone: '0923456789', riderName: 'Phạm Đức', riderPhone: '0923456789',
    startAt: '2026-06-03T06:45:00', endAt: '2026-06-03T07:10:00',
    fromAddress: 'Quận Hải Châu, Đà Nẵng, Việt Nam', toAddress: 'Quận Sơn Trà, Đà Nẵng, Việt Nam',
    createdAt: '2026-06-03T06:45:00', status: 'hoan-thanh',
    driverCode: 'GRAB-100733', insuranceType: 'Bảo hiểm FoodCare',
  },
  {
    id: '7', tripId: '01K5ZF2WTE5JKD8FNQR7YHSC3M', premium: 2000, plate: '92H-446.10',
    bookerName: 'Võ Minh', bookerPhone: '0934567890', riderName: 'Võ Minh', riderPhone: '0934567890',
    startAt: '2026-06-03T18:20:00', endAt: '2026-06-03T18:50:00',
    fromAddress: 'TP. Tam Kỳ, Quảng Nam, Việt Nam', toAddress: 'TP. Hội An, Quảng Nam, Việt Nam',
    createdAt: '2026-06-03T18:20:00', status: 'hoan-thanh',
    driverCode: 'GRAB-100815', insuranceType: 'Tai nạn hành khách theo chuyến',
  },
  {
    id: '8', tripId: '01K5ZF1HXA3QWE6RGZP9TMUD4B', premium: 2000, plate: '30H-778.93',
    bookerName: 'Đỗ Thu', bookerPhone: '0945678901', riderName: 'Đỗ Thu', riderPhone: '0945678901',
    startAt: '2026-06-04T09:05:00', endAt: '2026-06-04T09:35:00',
    fromAddress: 'Quận Hoàn Kiếm, Hà Nội, Việt Nam', toAddress: 'Quận Tây Hồ, Hà Nội, Việt Nam',
    createdAt: '2026-06-04T09:05:00', status: 'het-hieu-luc',
    driverCode: 'GRAB-100922', insuranceType: 'Bảo hiểm tích lũy tài xế',
  },
  {
    id: '9', tripId: '01K5ZF0DMB9YUT2KFHWA5NRQ6P', premium: 2000, plate: '47H-330.62',
    bookerName: 'Bùi Sơn', bookerPhone: '0956789012', riderName: 'Bùi Sơn', riderPhone: '0956789012',
    startAt: '2026-06-04T15:40:00', endAt: '2026-06-04T16:05:00',
    fromAddress: 'TP. Buôn Ma Thuột, Đắk Lắk, Việt Nam', toAddress: 'Huyện Cư Mgar, Đắk Lắk, Việt Nam',
    createdAt: '2026-06-04T15:40:00', status: 'hoan-thanh',
    driverCode: 'Grab-101044', insuranceType: 'Tai nạn hành khách theo chuyến',
  },
  {
    id: '10', tripId: '01K5ZEYZQF6WRC4XHNTD8LMK2J', premium: 2000, plate: '60H-915.47',
    bookerName: 'Hồ Yến', bookerPhone: '0967890123', riderName: 'Hồ Yến', riderPhone: '0967890123',
    startAt: '2026-06-05T07:25:00', endAt: '2026-06-05T07:55:00',
    fromAddress: 'TP. Biên Hòa, Đồng Nai, Việt Nam', toAddress: 'Huyện Long Thành, Đồng Nai, Việt Nam',
    createdAt: '2026-06-05T07:25:00', status: 'hoan-thanh',
    driverCode: 'Grab-101187', insuranceType: 'Bảo hiểm hàng hoá',
  },
  {
    id: '11', tripId: '01K5ZEX4WG2TMD7YKHRA9NPC5V', premium: 2000, plate: '72H-188.34',
    bookerName: 'Dương Khoa', bookerPhone: '0978901234', riderName: 'Dương Khoa', riderPhone: '0978901234',
    startAt: '2026-06-05T20:10:00', endAt: '2026-06-05T20:38:00',
    fromAddress: 'TP. Vũng Tàu, Bà Rịa - Vũng Tàu, Việt Nam', toAddress: 'TP. Bà Rịa, Bà Rịa - Vũng Tàu, Việt Nam',
    createdAt: '2026-06-05T20:10:00', status: 'da-huy',
    driverCode: 'Grab-101259', insuranceType: 'Bảo hiểm FoodCare',
  },
  {
    id: '12', tripId: '01K5ZEW8YH5KNF3RDTQA7MLB6X', premium: 2000, plate: '88H-177.08',
    bookerName: 'Lý Hà', bookerPhone: '0989012345', riderName: 'Lý Hà', riderPhone: '0989012345',
    startAt: '2026-06-06T11:50:00', endAt: '2026-06-06T12:20:00',
    fromAddress: 'TP. Cần Thơ, Việt Nam', toAddress: 'Huyện Phong Điền, Cần Thơ, Việt Nam',
    createdAt: '2026-06-06T11:50:00', status: 'hoan-thanh',
    driverCode: 'Grab-101376', insuranceType: 'Bảo hiểm tích lũy tài xế',
  },
]
