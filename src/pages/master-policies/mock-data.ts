export interface MasterPolicyRow {
  id: string
  contractNumber: string // Số hợp đồng nguyên tắc
  driverCode: string // Mã tài xế
  customerName: string // Tên khách hàng
  phone: string // SĐT
  packageName: string // Tên gói (also drives the "Loại bảo hiểm" filter)
  premium: number // Phí (đ)
  maxBenefit: number // Quyền lợi tối đa (đ)
  accumulated: number // Số tiền đã tích luỹ (đ)
  effectiveStart: string // Ngày bắt đầu (ISO)
  effectiveEnd: string // Ngày kết thúc (ISO)
}

export const sortOptions = [
  { value: 'newest', label: 'Xếp theo mới nhất' },
  { value: 'oldest', label: 'Xếp theo cũ nhất' },
]

export function formatMoney(n: number): string {
  return n.toLocaleString('vi-VN') // 300.000.000
}

export function formatDateTimeSeconds(iso: string): string {
  const d = new Date(iso)
  const pad = (x: number) => String(x).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export const masterPolicyRows: MasterPolicyRow[] = [
  {
    id: '1', contractNumber: '26/PC-GRAB/067426', driverCode: '8000075456',
    customerName: 'Lê Văn Hùng', phone: '+84865039991', packageName: 'Gói Taxi PPT',
    premium: 200, maxBenefit: 300000000, accumulated: 500000,
    effectiveStart: '2026-06-08T23:16:08', effectiveEnd: '2027-06-08T23:16:07',
  },
  {
    id: '2', contractNumber: '26/PM-GRAB/034210', driverCode: '5000142871',
    customerName: 'Nguyễn Thanh Phong', phone: '+84354619744', packageName: 'Gói Xe máy PPT',
    premium: 100, maxBenefit: 300000000, accumulated: 125000,
    effectiveStart: '2026-06-08T23:43:22', effectiveEnd: '2027-06-08T23:43:21',
  },
  {
    id: '3', contractNumber: '26/PM-GRAB/034212', driverCode: '5000142775',
    customerName: 'Nguyễn Tấn Phát', phone: '+84846133092', packageName: 'Gói Xe máy PPT',
    premium: 100, maxBenefit: 300000000, accumulated: 125000,
    effectiveStart: '2026-06-08T23:34:14', effectiveEnd: '2027-06-08T23:34:13',
  },
  {
    id: '4', contractNumber: '26/PC-GRAB/067429', driverCode: '8000075512',
    customerName: 'Trần Quốc Bảo', phone: '+84901234567', packageName: 'Gói Taxi PPT',
    premium: 200, maxBenefit: 300000000, accumulated: 250000,
    effectiveStart: '2026-06-08T23:16:08', effectiveEnd: '2027-06-08T23:16:07',
  },
  {
    id: '5', contractNumber: '26/PM-GRAB/034215', driverCode: '5000143001',
    customerName: 'Phạm Thị Hoa', phone: '+84912345678', packageName: 'Gói Xe máy PPT',
    premium: 100, maxBenefit: 300000000, accumulated: 75000,
    effectiveStart: '2026-06-07T20:11:05', effectiveEnd: '2027-06-07T20:11:04',
  },
  {
    id: '6', contractNumber: '26/PC-GRAB/067433', driverCode: '8000075623',
    customerName: 'Vũ Đình Long', phone: '+84923456789', packageName: 'Gói Taxi PPT',
    premium: 200, maxBenefit: 300000000, accumulated: 600000,
    effectiveStart: '2026-06-07T18:45:30', effectiveEnd: '2027-06-07T18:45:29',
  },
  {
    id: '7', contractNumber: '26/PM-GRAB/034220', driverCode: '5000143188',
    customerName: 'Đỗ Minh Quân', phone: '+84934567890', packageName: 'Gói Xe máy PPT',
    premium: 100, maxBenefit: 300000000, accumulated: 100000,
    effectiveStart: '2026-06-06T09:22:47', effectiveEnd: '2027-06-06T09:22:46',
  },
  {
    id: '8', contractNumber: '26/PC-GRAB/067440', driverCode: '8000075781',
    customerName: 'Hoàng Văn Nam', phone: '+84945678901', packageName: 'Gói Taxi PPT',
    premium: 200, maxBenefit: 300000000, accumulated: 425000,
    effectiveStart: '2026-06-06T07:30:12', effectiveEnd: '2027-06-06T07:30:11',
  },
  {
    id: '9', contractNumber: '26/PM-GRAB/034228', driverCode: '5000143356',
    customerName: 'Bùi Thị Lan', phone: '+84956789012', packageName: 'Gói Xe máy PPT',
    premium: 100, maxBenefit: 300000000, accumulated: 150000,
    effectiveStart: '2026-06-05T15:08:33', effectiveEnd: '2027-06-05T15:08:32',
  },
  {
    id: '10', contractNumber: '26/PC-GRAB/067451', driverCode: '8000075902',
    customerName: 'Ngô Gia Bảo', phone: '+84967890123', packageName: 'Gói Taxi PPT',
    premium: 200, maxBenefit: 300000000, accumulated: 350000,
    effectiveStart: '2026-06-05T11:54:19', effectiveEnd: '2027-06-05T11:54:18',
  },
  {
    id: '11', contractNumber: '26/PM-GRAB/034235', driverCode: '5000143502',
    customerName: 'Dương Văn Khoa', phone: '+84978901234', packageName: 'Gói Xe máy PPT',
    premium: 100, maxBenefit: 300000000, accumulated: 200000,
    effectiveStart: '2026-06-04T22:17:06', effectiveEnd: '2027-06-04T22:17:05',
  },
  {
    id: '12', contractNumber: '26/PC-GRAB/067463', driverCode: '8000076044',
    customerName: 'Lý Thị Hà', phone: '+84989012345', packageName: 'Gói Taxi PPT',
    premium: 200, maxBenefit: 300000000, accumulated: 475000,
    effectiveStart: '2026-06-04T08:40:51', effectiveEnd: '2027-06-04T08:40:50',
  },
]

export const packageTypeOptions = Array.from(
  new Set(masterPolicyRows.map((row) => row.packageName)),
).map((name) => ({ value: name, label: name }))
