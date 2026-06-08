export interface KpiCardData {
  label: string
  value: string
  sub?: string
  accent?: boolean
}

export interface StatItemData {
  label: string
  value: string
}

export interface ChartPoint {
  label: string
  doanhThuKyTruoc: number
  doanhThu: number
  soDonKyTruoc: number
  soDon: number
}

export const partnerOptions = [{ value: 'PVID', label: 'PVID' }] as const

export const kpiCards: KpiCardData[] = [
  { label: 'Doanh thu hôm nay', value: '0' },
  { label: 'Doanh thu tháng này', value: '0' },
  {
    label: 'Doanh thu năm nay',
    value: '645,000 VND',
    sub: '95% ↓ so với năm trước',
    accent: true,
  },
  { label: 'Doanh thu trung bình theo ngày', value: '0' },
]

export const orderAverages: StatItemData[] = [
  { label: 'Số lượng theo ngày', value: '0' },
  { label: 'Số lượng theo giờ', value: '0' },
  { label: 'Số lượng theo phút', value: '0' },
]

export const processingTimes: StatItemData[] = [
  { label: 'API cấp đơn', value: '0.05 s' },
  { label: 'API hủy đơn', value: '0.04 s' },
  { label: 'Bình GCNĐH', value: '2.00 s' },
]

// 14 days: 26.05 -> 08.06
export const dailyRevenue: ChartPoint[] = [
  { label: '26.05', doanhThuKyTruoc: 120000000, doanhThu: 80000000, soDonKyTruoc: 6, soDon: 4 },
  { label: '27.05', doanhThuKyTruoc: 300000000, doanhThu: 150000000, soDonKyTruoc: 8, soDon: 5 },
  { label: '28.05', doanhThuKyTruoc: 220000000, doanhThu: 260000000, soDonKyTruoc: 5, soDon: 7 },
  { label: '29.05', doanhThuKyTruoc: 480000000, doanhThu: 320000000, soDonKyTruoc: 9, soDon: 6 },
  { label: '30.05', doanhThuKyTruoc: 360000000, doanhThu: 410000000, soDonKyTruoc: 7, soDon: 8 },
  { label: '31.05', doanhThuKyTruoc: 520000000, doanhThu: 300000000, soDonKyTruoc: 10, soDon: 6 },
  { label: '01.06', doanhThuKyTruoc: 280000000, doanhThu: 540000000, soDonKyTruoc: 6, soDon: 9 },
  { label: '02.06', doanhThuKyTruoc: 610000000, doanhThu: 470000000, soDonKyTruoc: 11, soDon: 8 },
  { label: '03.06', doanhThuKyTruoc: 450000000, doanhThu: 620000000, soDonKyTruoc: 8, soDon: 10 },
  { label: '04.06', doanhThuKyTruoc: 700000000, doanhThu: 550000000, soDonKyTruoc: 12, soDon: 9 },
  { label: '05.06', doanhThuKyTruoc: 520000000, doanhThu: 730000000, soDonKyTruoc: 9, soDon: 12 },
  { label: '06.06', doanhThuKyTruoc: 660000000, doanhThu: 600000000, soDonKyTruoc: 11, soDon: 10 },
  { label: '07.06', doanhThuKyTruoc: 480000000, doanhThu: 790000000, soDonKyTruoc: 8, soDon: 13 },
  { label: '08.06', doanhThuKyTruoc: 540000000, doanhThu: 650000000, soDonKyTruoc: 9, soDon: 11 },
]

// 11 months: 01.2026 -> 11.2026
export const monthlyRevenue: ChartPoint[] = [
  { label: '01.2026', doanhThuKyTruoc: 1200000, doanhThu: 900000, soDonKyTruoc: 3, soDon: 2 },
  { label: '02.2026', doanhThuKyTruoc: 2600000, doanhThu: 1800000, soDonKyTruoc: 6, soDon: 4 },
  { label: '03.2026', doanhThuKyTruoc: 4800000, doanhThu: 3200000, soDonKyTruoc: 9, soDon: 7 },
  { label: '04.2026', doanhThuKyTruoc: 3400000, doanhThu: 4100000, soDonKyTruoc: 7, soDon: 8 },
  { label: '05.2026', doanhThuKyTruoc: 5000000, doanhThu: 4600000, soDonKyTruoc: 10, soDon: 9 },
  { label: '06.2026', doanhThuKyTruoc: 2800000, doanhThu: 3300000, soDonKyTruoc: 6, soDon: 7 },
  { label: '07.2026', doanhThuKyTruoc: 3600000, doanhThu: 2900000, soDonKyTruoc: 7, soDon: 6 },
  { label: '08.2026', doanhThuKyTruoc: 1800000, doanhThu: 2200000, soDonKyTruoc: 4, soDon: 5 },
  { label: '09.2026', doanhThuKyTruoc: 2400000, doanhThu: 1600000, soDonKyTruoc: 5, soDon: 3 },
  { label: '10.2026', doanhThuKyTruoc: 1500000, doanhThu: 2000000, soDonKyTruoc: 3, soDon: 4 },
  { label: '11.2026', doanhThuKyTruoc: 2000000, doanhThu: 1200000, soDonKyTruoc: 4, soDon: 2 },
]
