export interface MasterPolicyRow {
  id: string
  contractNumber: string // Số hợp đồng nguyên tắc
  driverCode: string // Mã tài xế
  customerName: string // Tên khách hàng
  phone: string // SĐT
  dob: string // Ngày sinh (ISO date, YYYY-MM-DD)
  idNumber: string // Số CMND/CCCD/Hộ chiếu
  gender: string // Giới tính (Nam/Nữ)
  email: string // Email
  address: string // Địa chỉ
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
    customerName: 'Lê Văn Hùng', phone: '+84865039991',
    dob: '1988-03-15', idNumber: '079088001234', gender: 'Nam',
    email: 'hung.le@example.com', address: '12 Nguyễn Huệ, P. Bến Nghé, Q.1, TP.HCM',
    packageName: 'Gói Taxi PPT',
    premium: 200, maxBenefit: 300000000, accumulated: 500000,
    effectiveStart: '2026-06-08T23:16:08', effectiveEnd: '2027-06-08T23:16:07',
  },
  {
    id: '2', contractNumber: '26/PM-GRAB/034210', driverCode: '5000142871',
    customerName: 'Nguyễn Thanh Phong', phone: '+84354619744',
    dob: '1992-07-22', idNumber: '079092002345', gender: 'Nam',
    email: 'phong.nguyen@example.com', address: '45 Lê Lợi, P. Bến Thành, Q.1, TP.HCM',
    packageName: 'Gói Xe máy PPT',
    premium: 100, maxBenefit: 300000000, accumulated: 125000,
    effectiveStart: '2026-06-08T23:43:22', effectiveEnd: '2027-06-08T23:43:21',
  },
  {
    id: '3', contractNumber: '26/PM-GRAB/034212', driverCode: '5000142775',
    customerName: 'Nguyễn Tấn Phát', phone: '+84846133092',
    dob: '1990-11-09', idNumber: '079090003456', gender: 'Nam',
    email: 'phat.nguyen@example.com', address: '78 Cách Mạng Tháng 8, P.6, Q.3, TP.HCM',
    packageName: 'Gói Xe máy PPT',
    premium: 100, maxBenefit: 300000000, accumulated: 125000,
    effectiveStart: '2026-06-08T23:34:14', effectiveEnd: '2027-06-08T23:34:13',
  },
  {
    id: '4', contractNumber: '26/PC-GRAB/067429', driverCode: '8000075512',
    customerName: 'Trần Quốc Bảo', phone: '+84901234567',
    dob: '1995-01-30', idNumber: '079095004567', gender: 'Nam',
    email: 'bao.tran@example.com', address: '23 Phan Xích Long, P.2, Q. Phú Nhuận, TP.HCM',
    packageName: 'Gói Taxi PPT',
    premium: 200, maxBenefit: 300000000, accumulated: 250000,
    effectiveStart: '2026-06-08T23:16:08', effectiveEnd: '2027-06-08T23:16:07',
  },
  {
    id: '5', contractNumber: '26/PM-GRAB/034215', driverCode: '5000143001',
    customerName: 'Phạm Thị Hoa', phone: '+84912345678',
    dob: '1993-05-18', idNumber: '079193005678', gender: 'Nữ',
    email: 'hoa.pham@example.com', address: '56 Hai Bà Trưng, P. Đa Kao, Q.1, TP.HCM',
    packageName: 'Gói Xe máy PPT',
    premium: 100, maxBenefit: 300000000, accumulated: 75000,
    effectiveStart: '2026-06-07T20:11:05', effectiveEnd: '2027-06-07T20:11:04',
  },
  {
    id: '6', contractNumber: '26/PC-GRAB/067433', driverCode: '8000075623',
    customerName: 'Vũ Đình Long', phone: '+84923456789',
    dob: '1987-09-12', idNumber: '079087006789', gender: 'Nam',
    email: 'long.vu@example.com', address: '101 Điện Biên Phủ, P.15, Q. Bình Thạnh, TP.HCM',
    packageName: 'Gói Taxi PPT',
    premium: 200, maxBenefit: 300000000, accumulated: 600000,
    effectiveStart: '2026-06-07T18:45:30', effectiveEnd: '2027-06-07T18:45:29',
  },
  {
    id: '7', contractNumber: '26/PM-GRAB/034220', driverCode: '5000143188',
    customerName: 'Đỗ Minh Quân', phone: '+84934567890',
    dob: '1991-12-03', idNumber: '079091007890', gender: 'Nam',
    email: 'quan.do@example.com', address: '9 Nguyễn Thị Minh Khai, P. Đa Kao, Q.1, TP.HCM',
    packageName: 'Gói Xe máy PPT',
    premium: 100, maxBenefit: 300000000, accumulated: 100000,
    effectiveStart: '2026-06-06T09:22:47', effectiveEnd: '2027-06-06T09:22:46',
  },
  {
    id: '8', contractNumber: '26/PC-GRAB/067440', driverCode: '8000075781',
    customerName: 'Hoàng Văn Nam', phone: '+84945678901',
    dob: '1989-04-27', idNumber: '079089008901', gender: 'Nam',
    email: 'nam.hoang@example.com', address: '34 Võ Văn Tần, P.6, Q.3, TP.HCM',
    packageName: 'Gói Taxi PPT',
    premium: 200, maxBenefit: 300000000, accumulated: 425000,
    effectiveStart: '2026-06-06T07:30:12', effectiveEnd: '2027-06-06T07:30:11',
  },
  {
    id: '9', contractNumber: '26/PM-GRAB/034228', driverCode: '5000143356',
    customerName: 'Bùi Thị Lan', phone: '+84956789012',
    dob: '1994-08-14', idNumber: '079194009012', gender: 'Nữ',
    email: 'lan.bui@example.com', address: '67 Lý Thường Kiệt, P.7, Q.10, TP.HCM',
    packageName: 'Gói Xe máy PPT',
    premium: 100, maxBenefit: 300000000, accumulated: 150000,
    effectiveStart: '2026-06-05T15:08:33', effectiveEnd: '2027-06-05T15:08:32',
  },
  {
    id: '10', contractNumber: '26/PC-GRAB/067451', driverCode: '8000075902',
    customerName: 'Ngô Gia Bảo', phone: '+84967890123',
    dob: '1996-02-21', idNumber: '079096010123', gender: 'Nam',
    email: 'bao.ngo@example.com', address: '88 Trường Chinh, P.15, Q. Tân Bình, TP.HCM',
    packageName: 'Gói Taxi PPT',
    premium: 200, maxBenefit: 300000000, accumulated: 350000,
    effectiveStart: '2026-06-05T11:54:19', effectiveEnd: '2027-06-05T11:54:18',
  },
  {
    id: '11', contractNumber: '26/PM-GRAB/034235', driverCode: '5000143502',
    customerName: 'Dương Văn Khoa', phone: '+84978901234',
    dob: '1990-06-08', idNumber: '079090011234', gender: 'Nam',
    email: 'khoa.duong@example.com', address: '120 Nguyễn Văn Cừ, P.2, Q.5, TP.HCM',
    packageName: 'Gói Xe máy PPT',
    premium: 100, maxBenefit: 300000000, accumulated: 200000,
    effectiveStart: '2026-06-04T22:17:06', effectiveEnd: '2027-06-04T22:17:05',
  },
  {
    id: '12', contractNumber: '26/PC-GRAB/067463', driverCode: '8000076044',
    customerName: 'Lý Thị Hà', phone: '+84989012345',
    dob: '1992-10-25', idNumber: '079192012345', gender: 'Nữ',
    email: 'ha.ly@example.com', address: '15 Pasteur, P. Bến Nghé, Q.1, TP.HCM',
    packageName: 'Gói Taxi PPT',
    premium: 200, maxBenefit: 300000000, accumulated: 475000,
    effectiveStart: '2026-06-04T08:40:51', effectiveEnd: '2027-06-04T08:40:50',
  },
]

export const packageTypeOptions = Array.from(
  new Set(masterPolicyRows.map((row) => row.packageName)),
).map((name) => ({ value: name, label: name }))
