export interface InvoiceRequestRow {
  id: string
  contractNo: string // Số hợp đồng bảo hiểm (may be "-")
  holderName: string // Tên chủ hợp đồng
  phone: string // Số điện thoại (may be "-")
  receiverName: string // Tên người nhận
  partner: string // Đối tác
  product: string // Sản phẩm
  createdAt: string // Ngày tạo yêu cầu (ISO; rendered dd/mm/yyyy)
  coverageFrom: string // Thời hạn bảo hiểm — Từ (ISO; rendered dd/mm/yyyy HH:mm)
  coverageTo: string // Thời hạn bảo hiểm — Đến (ISO; rendered dd/mm/yyyy HH:mm)
  email: string // Email người nhận
  taxCode: string // Mã số thuế
  address: string // Địa chỉ người nhận
}

// "Sắp xếp theo" options — verbatim from the design ("Xếp theo mới nhất" default).
export const sortOptions = [
  { value: 'moi-nhat', label: 'Xếp theo mới nhất' },
  { value: 'cu-nhat', label: 'Xếp theo cũ nhất' },
]

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// Mock assumption: rows are synthetic, mirroring the design's shape — some rows use
// "-" for contractNo/phone/receiver/email/address as the screenshot shows.
export const invoiceRows: InvoiceRequestRow[] = [
  { id: '1', contractNo: '260247641', holderName: 'Trần Minh Huy', phone: '0905071648', receiverName: 'CHI NHÁNH ĐÀ NẴNG - CÔNG TY CỔ PHẦN VINPEARL', partner: 'PVI Plus', product: 'Bảo hiểm Du lịch quốc tế', createdAt: '2026-06-08T09:12:00', coverageFrom: '2026-06-11T00:00:00', coverageTo: '2026-06-15T23:59:00', email: 'huy.m.tran@marriott.com', taxCode: '4200456848-008', address: 'SỐ 07 TRƯỜNG SA, PHƯỜNG NGŨ HÀNH SƠN, THÀNH PHỐ ĐÀ NẴNG, VIỆT NAM' },
  { id: '2', contractNo: '-', holderName: 'Hộ Kinh Doanh Lại Thị Huệ', phone: '0983756196', receiverName: '-', partner: 'VNPOS T', product: 'Bảo hiểm Cháy và các loại rủi ro đặc biệt cho hộ kinh doanh', createdAt: '2026-06-06T15:39:00', coverageFrom: '2026-06-06T15:39:00', coverageTo: '2026-06-07T23:59:00', email: '-', taxCode: '0331820076-96', address: '-' },
  { id: '3', contractNo: '-', holderName: 'Lê Thị Hằng', phone: '0978008269', receiverName: '-', partner: 'VNPOS T', product: 'Bảo hiểm Cháy và các loại rủi ro đặc biệt cho hộ kinh doanh', createdAt: '2026-06-06T18:21:00', coverageFrom: '2026-06-06T18:21:00', coverageTo: '2026-06-07T23:59:00', email: '-', taxCode: '0011870269-81', address: '-' },
  { id: '4', contractNo: '-', holderName: 'Nguyễn Mạnh Hùng', phone: '0915604088', receiverName: '-', partner: 'VNPOS T', product: 'Bảo hiểm Cháy và các loại rủi ro đặc biệt cho hộ kinh doanh', createdAt: '2026-06-06T17:06:00', coverageFrom: '2026-06-06T17:06:00', coverageTo: '2026-06-07T23:59:00', email: '-', taxCode: '0110840077-34', address: '-' },
  { id: '5', contractNo: '260241595', holderName: 'Phạm Phương Chi', phone: '0982906817', receiverName: 'CONNECT-GIFT DEVELOPMENT INVESTMENT AND TRADING JOINT STOCK COMPANY', partner: 'RABBIT CARE', product: 'Bảo hiểm Du lịch quốc tế', createdAt: '2026-06-04T10:05:00', coverageFrom: '2026-06-19T08:00:00', coverageTo: '2026-06-23T23:59:00', email: 'pchiphm@gmail.com', taxCode: '0107062746', address: '5/12/1 Nguyen Van Troi, Phuong Liet ward, Hanoi' },
  { id: '6', contractNo: '260241128', holderName: 'Lương Nguyễn Vĩnh Hưng', phone: '0934985566', receiverName: 'Công ty TNHH Một Thành viên SAP Việt Nam', partner: 'RABBIT CARE', product: 'Bảo hiểm Du lịch quốc tế', createdAt: '2026-06-03T08:47:00', coverageFrom: '2026-06-18T07:00:00', coverageTo: '2026-06-22T23:59:00', email: 'hung.luong@sap.com', taxCode: '0311183701', address: 'Phòng 1 và Phòng 2 của Tầng 27, Tầng 28, 29, 31, 32, Toà Nhà The Nexus, Số 3A-3B, Đường Tôn Đức Thắng, Phường Sài Gòn, Thành phố Hồ Chí Minh, Việt Nam' },
  { id: '7', contractNo: '260239900', holderName: 'Đặng Quốc Toản', phone: '0907123456', receiverName: 'Công ty Cổ phần Du lịch Việt', partner: 'PVI Plus', product: 'Bảo hiểm Du lịch quốc tế', createdAt: '2026-06-02T13:30:00', coverageFrom: '2026-06-10T00:00:00', coverageTo: '2026-06-14T23:59:00', email: 'toan.dq@dulichviet.com', taxCode: '0101245678', address: '12 Hàng Bài, Hoàn Kiếm, Hà Nội, Việt Nam' },
  { id: '8', contractNo: '-', holderName: 'Hộ Kinh Doanh Trần Văn Bình', phone: '0961122334', receiverName: '-', partner: 'VNPOS T', product: 'Bảo hiểm Cháy và các loại rủi ro đặc biệt cho hộ kinh doanh', createdAt: '2026-06-02T09:15:00', coverageFrom: '2026-06-02T09:15:00', coverageTo: '2026-06-03T23:59:00', email: '-', taxCode: '0312456789-01', address: '-' },
  { id: '9', contractNo: '260238771', holderName: 'Vũ Thị Mai', phone: '0922334455', receiverName: 'Công ty TNHH Thương mại Mai Vũ', partner: 'RABBIT CARE', product: 'Bảo hiểm Du lịch quốc tế', createdAt: '2026-06-01T11:20:00', coverageFrom: '2026-06-12T06:00:00', coverageTo: '2026-06-16T23:59:00', email: 'mai.vu@maivu.vn', taxCode: '0309876543', address: '88 Lê Lợi, Quận 1, TP. Hồ Chí Minh, Việt Nam' },
  { id: '10', contractNo: '-', holderName: 'Lê Hoàng Nam', phone: '0938877665', receiverName: '-', partner: 'VNPOS T', product: 'Bảo hiểm Cháy và các loại rủi ro đặc biệt cho hộ kinh doanh', createdAt: '2026-05-31T14:00:00', coverageFrom: '2026-05-31T14:00:00', coverageTo: '2026-06-01T23:59:00', email: '-', taxCode: '0345678912-22', address: '-' },
  { id: '11', contractNo: '260236540', holderName: 'Phan Thị Thu', phone: '0911223344', receiverName: 'Công ty Cổ phần Đầu tư Thu Phan', partner: 'PVI Plus', product: 'Bảo hiểm Du lịch quốc tế', createdAt: '2026-05-30T16:40:00', coverageFrom: '2026-06-08T00:00:00', coverageTo: '2026-06-12T23:59:00', email: 'thu.phan@thuphan.com', taxCode: '0102345671', address: '45 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội, Việt Nam' },
  { id: '12', contractNo: '260235012', holderName: 'Trịnh Văn Long', phone: '0945566778', receiverName: 'Công ty TNHH Long Trịnh', partner: 'RABBIT CARE', product: 'Bảo hiểm Du lịch quốc tế', createdAt: '2026-05-29T09:05:00', coverageFrom: '2026-06-09T07:30:00', coverageTo: '2026-06-13T23:59:00', email: 'long.trinh@longtrinh.vn', taxCode: '0307654321', address: '23 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh, Việt Nam' },
  { id: '13', contractNo: '-', holderName: 'Hộ Kinh Doanh Đỗ Thị Lan', phone: '0956677889', receiverName: '-', partner: 'VNPOS T', product: 'Bảo hiểm Cháy và các loại rủi ro đặc biệt cho hộ kinh doanh', createdAt: '2026-05-28T10:45:00', coverageFrom: '2026-05-28T10:45:00', coverageTo: '2026-05-29T23:59:00', email: '-', taxCode: '0356789123-33', address: '-' },
]
