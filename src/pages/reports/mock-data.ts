export type ReportStatus = 'hoat-dong' | 'tam-dung'
export type ReportAccess = 'cong-khai' | 'noi-bo' | 'rieng-tu'

export interface ReportRow {
  id: string
  title: string // Tiêu đề
  reportType: string // Loại báo cáo
  partnerCode: string // Mã đối tác
  productCode: string // Mã sản phẩm
  order: number // Thứ tự
  access: ReportAccess // Quyền truy cập
  status: ReportStatus // mid-table "Trạng thái" → badge
  enabled: boolean // right-fixed "Trạng thái" → Switch
}

// mid-table "Trạng thái" badge styling
export const STATUS_CONFIG: Record<ReportStatus, { label: string; color: string }> = {
  'hoat-dong': { label: 'Hoạt động', color: 'green' },
  'tam-dung': { label: 'Tạm dừng', color: 'default' },
}

// "Quyền truy cập" display labels
export const ACCESS_CONFIG: Record<ReportAccess, { label: string }> = {
  'cong-khai': { label: 'Công khai' },
  'noi-bo': { label: 'Nội bộ' },
  'rieng-tu': { label: 'Riêng tư' },
}

export const statusOptions = (Object.keys(STATUS_CONFIG) as ReportStatus[]).map((value) => ({
  value,
  label: STATUS_CONFIG[value].label,
}))

// Mock assumption: report categories aren't visible in the empty-table screenshot —
// these are placeholders so the advanced "Loại báo cáo" filter functions.
export const reportTypeOptions = ['Doanh thu', 'Bồi thường', 'Tổng hợp', 'Vận hành'].map((v) => ({
  value: v,
  label: v,
}))

// "Sắp xếp theo" options — verbatim from the design ("Xếp theo mới nhất" default).
export const sortOptions = [
  { value: 'moi-nhat', label: 'Xếp theo mới nhất' },
  { value: 'cu-nhat', label: 'Xếp theo cũ nhất' },
]

// Mock assumption: the design table is empty; these rows are synthetic so the
// table, pagination, badge column, and switch column are demonstrable.
export const reportRows: ReportRow[] = [
  { id: '1', title: 'Báo cáo doanh thu theo chuyến', reportType: 'Doanh thu', partnerCode: 'GRAB', productCode: 'PA-TRIP', order: 1, access: 'cong-khai', status: 'hoat-dong', enabled: true },
  { id: '2', title: 'Báo cáo bồi thường tai nạn', reportType: 'Bồi thường', partnerCode: 'PVI', productCode: 'PA-ACC', order: 2, access: 'noi-bo', status: 'hoat-dong', enabled: true },
  { id: '3', title: 'Báo cáo tổng hợp hợp đồng', reportType: 'Tổng hợp', partnerCode: 'GRAB', productCode: 'HD-001', order: 3, access: 'rieng-tu', status: 'tam-dung', enabled: false },
  { id: '4', title: 'Báo cáo vận hành đội xe', reportType: 'Vận hành', partnerCode: 'GRAB', productCode: 'VH-FLEET', order: 4, access: 'noi-bo', status: 'hoat-dong', enabled: true },
  { id: '5', title: 'Báo cáo doanh thu FoodCare', reportType: 'Doanh thu', partnerCode: 'GRAB', productCode: 'SP-FOOD', order: 5, access: 'cong-khai', status: 'hoat-dong', enabled: true },
  { id: '6', title: 'Báo cáo bồi thường hàng hoá', reportType: 'Bồi thường', partnerCode: 'PVI', productCode: 'SP-CARGO', order: 6, access: 'noi-bo', status: 'tam-dung', enabled: false },
  { id: '7', title: 'Báo cáo tổng hợp tài xế', reportType: 'Tổng hợp', partnerCode: 'GRAB', productCode: 'SP-DRIVER', order: 7, access: 'rieng-tu', status: 'hoat-dong', enabled: true },
  { id: '8', title: 'Báo cáo vận hành theo khu vực', reportType: 'Vận hành', partnerCode: 'GRAB', productCode: 'VH-AREA', order: 8, access: 'noi-bo', status: 'hoat-dong', enabled: false },
  { id: '9', title: 'Báo cáo doanh thu theo tháng', reportType: 'Doanh thu', partnerCode: 'PVI', productCode: 'DT-MONTH', order: 9, access: 'cong-khai', status: 'hoat-dong', enabled: true },
  { id: '10', title: 'Báo cáo bồi thường theo quý', reportType: 'Bồi thường', partnerCode: 'GRAB', productCode: 'BT-QUARTER', order: 10, access: 'noi-bo', status: 'tam-dung', enabled: false },
  { id: '11', title: 'Báo cáo tổng hợp đối tác', reportType: 'Tổng hợp', partnerCode: 'GRAB', productCode: 'TH-PARTNER', order: 11, access: 'rieng-tu', status: 'hoat-dong', enabled: true },
  { id: '12', title: 'Báo cáo vận hành realtime', reportType: 'Vận hành', partnerCode: 'GRAB', productCode: 'VH-RT', order: 12, access: 'noi-bo', status: 'hoat-dong', enabled: true },
  { id: '13', title: 'Báo cáo doanh thu tích luỹ', reportType: 'Doanh thu', partnerCode: 'PVI', productCode: 'DT-ACC', order: 13, access: 'cong-khai', status: 'tam-dung', enabled: false },
  { id: '14', title: 'Báo cáo bồi thường tổng hợp', reportType: 'Bồi thường', partnerCode: 'GRAB', productCode: 'BT-ALL', order: 14, access: 'noi-bo', status: 'hoat-dong', enabled: true },
]
