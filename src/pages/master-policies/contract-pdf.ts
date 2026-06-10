// Sinh & tải file PDF Hợp đồng nguyên tắc theo dữ liệu của một dòng (row) trong mock data.
// Nội dung dựng lại từ 2 mẫu HĐBH (xe máy / ô tô); thông số lấy theo loại tài xế.
import type { TDocumentDefinitions, Content } from 'pdfmake/interfaces'
import { formatMoney, type MasterPolicyRow } from './mock-data'
import { getContractTerms, type ContractTerms } from '../master-policy-detail/contract-terms'

// pdfmake là thư viện nặng → nạp động khi cần, giữ bundle chính gọn nhẹ.
interface PdfDownloadable {
  download: (defaultFileName?: string) => void
}
interface PdfMakeClient {
  addVirtualFileSystem: (vfs: Record<string, string>) => void
  createPdf: (documentDefinition: TDocumentDefinitions) => PdfDownloadable
}

async function loadPdfMake(): Promise<PdfMakeClient> {
  const [pdfMakeMod, vfsMod] = await Promise.all([
    import('pdfmake/build/pdfmake'),
    import('pdfmake/build/vfs_fonts'),
  ])
  const pdfMake = ((pdfMakeMod as { default?: unknown }).default ?? pdfMakeMod) as PdfMakeClient
  const vfs = ((vfsMod as { default?: unknown }).default ?? vfsMod) as Record<string, string>
  pdfMake.addVirtualFileSystem(vfs)
  return pdfMake
}

function vnd(n: number): string {
  return `${formatMoney(n)} VND`
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const pad = (x: number) => String(x).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}

const COLOR_PRIMARY = '#0b3d91'
const COLOR_MUTED = '#666666'

function headerBlock(): Content {
  return {
    stack: [
      { text: 'TỔNG CÔNG TY BẢO HIỂM PVI', bold: true, color: COLOR_PRIMARY, fontSize: 11 },
      {
        text: 'Trụ sở: Tòa nhà PVI Tower, Số 1 Phạm Văn Bạch – Cầu Giấy – Hà Nội\nTel: 024 3733 5588 – Website: www.pvi.com.vn',
        fontSize: 8,
        color: COLOR_MUTED,
        margin: [0, 2, 0, 0],
      },
    ],
  }
}

// Bảng nhãn–giá trị không viền, 2 cột.
function labelValueTable(rows: Array<[string, string]>): Content {
  return {
    table: {
      widths: ['40%', '60%'],
      body: rows.map(([label, value]) => [
        { text: label, fontSize: 9, color: COLOR_MUTED },
        { text: value, fontSize: 9, bold: true },
      ]),
    },
    layout: 'noBorders',
    margin: [0, 4, 0, 8],
  }
}

function sectionTitle(text: string): Content {
  return {
    text,
    bold: true,
    color: COLOR_PRIMARY,
    fontSize: 10,
    margin: [0, 10, 0, 4],
  }
}

function benefitsTable(terms: ContractTerms): Content {
  const headerCell = (text: string) => ({
    text,
    bold: true,
    fontSize: 9,
    color: 'white',
    fillColor: COLOR_PRIMARY,
    margin: [2, 4, 2, 4] as [number, number, number, number],
  })
  const cell = (text: string) => ({ text, fontSize: 9, margin: [2, 3, 2, 3] as [number, number, number, number] })
  return {
    table: {
      widths: ['6%', '64%', '30%'],
      body: [
        [headerCell('STT'), headerCell('Quyền lợi bảo hiểm'), headerCell('Giới hạn mỗi Đơn tích lũy')],
        [cell('1'), cell('Tử vong / Thương tật toàn bộ vĩnh viễn do tai nạn'), cell(vnd(terms.deathDisabilityLimit))],
        [cell('2'), cell('Trợ cấp nằm viện do tai nạn'), cell(vnd(terms.hospitalLimitPerPolicy))],
        [cell('3'), cell('Chi phí y tế điều trị thương tật do tai nạn'), cell(vnd(terms.medicalLimitPerPolicy))],
      ],
    },
    layout: {
      hLineColor: () => '#d9d9d9',
      vLineColor: () => '#d9d9d9',
    },
    margin: [0, 4, 0, 6],
  }
}

function buildDocDefinition(row: MasterPolicyRow): TDocumentDefinitions {
  const terms = getContractTerms(row.contractNumber, row.packageName)

  return {
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 50],
    defaultStyle: { font: 'Roboto', fontSize: 9, lineHeight: 1.2 },
    content: [
      headerBlock(),
      { text: 'HỢP ĐỒNG BẢO HIỂM', alignment: 'center', bold: true, fontSize: 14, margin: [0, 14, 0, 2] },
      {
        text: terms.programName.toUpperCase(),
        alignment: 'center',
        bold: true,
        color: COLOR_PRIMARY,
        fontSize: 12,
      },
      { text: `Số: ${row.contractNumber}`, alignment: 'center', fontSize: 9, margin: [0, 4, 0, 10] },
      {
        text: 'Trên cơ sở yêu cầu bảo hiểm tai nạn tích lũy thông qua ứng dụng Xanh Driver, Bảo hiểm PVI cấp Hợp đồng bảo hiểm theo các thông tin dưới đây:',
        fontSize: 9,
        margin: [0, 0, 0, 4],
      },

      sectionTitle('BÊN MUA BẢO HIỂM & NGƯỜI ĐƯỢC BẢO HIỂM (NĐBH)'),
      labelValueTable([
        ['Mã Tài xế GSM', row.driverCode],
        ['Họ và tên', row.customerName],
        ['Số điện thoại', row.phone],
        ['Đối tượng', terms.vehicleLabel],
      ]),

      sectionTitle('CHƯƠNG TRÌNH BẢO HIỂM'),
      labelValueTable([
        ['Chương trình bảo hiểm', terms.programName],
        ['Tên gói', row.packageName],
        ['Quy tắc bảo hiểm', terms.insuranceRule],
        ['Phạm vi địa lý', terms.territory],
        ['Điều kiện tham gia', `Tài xế GSM, độ tuổi ${terms.ageRange.toLowerCase()}`],
      ]),

      sectionTitle('SỐ TIỀN BẢO HIỂM & PHÍ'),
      labelValueTable([
        ['Số tiền bảo hiểm tối đa của Hợp đồng', vnd(terms.masterMaxBenefit)],
        ['STBH tối đa cho mỗi Đơn tích lũy', vnd(terms.accumMaxPerPolicy)],
        ['Phí bảo hiểm cố định cho mỗi Đơn', vnd(terms.fixedPremiumPerPolicy)],
        ['Trợ cấp nằm viện tối đa mỗi đợt', vnd(terms.hospitalMaxPerStay)],
        ['Số tiền đã tích lũy', vnd(row.accumulated)],
      ]),

      sectionTitle('QUYỀN LỢI BẢO HIỂM (mỗi Đơn bảo hiểm tích lũy)'),
      benefitsTable(terms),
      {
        text: 'Tổng số tiền bảo hiểm chi trả cho các quyền lợi từ 1 đến 3 sẽ không vượt quá Số tiền bảo hiểm tối đa của Hợp đồng.',
        fontSize: 8,
        italics: true,
        color: COLOR_MUTED,
        margin: [0, 0, 0, 4],
      },

      sectionTitle('THỜI HẠN VÀ HIỆU LỰC BẢO HIỂM'),
      labelValueTable([
        ['Thời hạn Hợp đồng bảo hiểm', terms.contractTerm],
        ['Ngày bắt đầu hiệu lực', formatDate(row.effectiveStart)],
        ['Ngày kết thúc hiệu lực', formatDate(row.effectiveEnd)],
        ['Thời hạn Đơn bảo hiểm tích lũy', terms.accumPolicyTerm],
        ['Điều kiện hủy hợp đồng', terms.cancellationNotice],
      ]),

      {
        columns: [
          { text: '', width: '*' },
          {
            width: 'auto',
            alignment: 'center',
            stack: [
              { text: 'TỔNG CÔNG TY BẢO HIỂM PVI', bold: true, fontSize: 9, margin: [0, 16, 0, 0] },
              { text: 'CHI NHÁNH BẢO HIỂM PVI DIGITAL', bold: true, fontSize: 9 },
              { text: '(Ký, đóng dấu)', italics: true, fontSize: 8, color: COLOR_MUTED, margin: [0, 30, 0, 0] },
            ],
          },
        ],
      },
    ],
    footer: (currentPage: number, pageCount: number): Content => ({
      text: `Trang ${currentPage}/${pageCount} — Tổng đài hỗ trợ 24/7: 1900 54 54 58`,
      alignment: 'center',
      fontSize: 7,
      color: COLOR_MUTED,
      margin: [0, 10, 0, 0],
    }),
  }
}

function fileNameFor(row: MasterPolicyRow): string {
  const safeNumber = row.contractNumber.replace(/[^\w]+/g, '_')
  return `HDNT_${safeNumber}.pdf`
}

export async function downloadContractPdf(row: MasterPolicyRow): Promise<void> {
  const pdfMake = await loadPdfMake()
  pdfMake.createPdf(buildDocDefinition(row)).download(fileNameFor(row))
}
