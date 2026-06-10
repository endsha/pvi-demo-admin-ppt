// Điền biến vào mẫu HĐBH gốc: giữ nguyên template, chỉ che vùng [placeholder] và vẽ giá trị mới.
// Hàm thuần (không phụ thuộc trình duyệt) để có thể tái dùng & kiểm thử trong Node.
import { PDFDocument, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { PLACEHOLDER_BOXES, type PlaceholderKey } from './contract-placeholders'
import type { MasterPolicyRow } from './mock-data'

export type PlaceholderValues = Partial<Record<PlaceholderKey, string>>

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`
}

// Lấy giá trị biến từ một dòng dữ liệu. Các trường mock không có (DOB, CCCD, email...)
// được bỏ qua → placeholder chỉ bị xóa, không vẽ chữ.
export function buildPlaceholderValues(row: MasterPolicyRow): PlaceholderValues {
  const start = new Date(row.effectiveStart)
  return {
    Master_Policy_Number: row.contractNumber,
    Driver_GSM_ID_Code: row.driverCode,
    Driver_Full_Name: row.customerName,
    Driver_Mobile_Number: row.phone,
    current_date: formatDate(row.effectiveStart),
    end_date: formatDate(row.effectiveEnd),
    NG_C: pad2(start.getDate()),
    TG_C: pad2(start.getMonth() + 1),
    N_C: String(start.getFullYear()),
  }
}

// Khoảng cách từ đáy bbox placeholder lên baseline (theo tỉ lệ cỡ chữ) để chữ mới
// nằm đúng dòng như chữ gốc.
const BASELINE_FACTOR = 0.2

export async function fillContractPdf(
  templateBytes: Uint8Array,
  fontBytes: Uint8Array,
  values: PlaceholderValues,
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(templateBytes)
  pdfDoc.registerFontkit(fontkit)
  const font = await pdfDoc.embedFont(fontBytes, { subset: true })
  const pages = pdfDoc.getPages()

  for (const box of PLACEHOLDER_BOXES) {
    const page = pages[box.page]
    if (!page) continue

    const width = box.x1 - box.x0
    const height = box.y1 - box.y0
    // Xóa text placeholder gốc bằng hình chữ nhật trắng (vùng nền là màu trắng).
    page.drawRectangle({
      x: box.x0 - 1,
      y: box.y0 - 1.5,
      width: width + 2,
      height: height + 3,
      color: rgb(1, 1, 1),
    })

    const value = values[box.key]
    if (!value) continue
    page.drawText(value, {
      x: box.x0,
      y: box.y0 + box.size * BASELINE_FACTOR,
      size: box.size,
      font,
      color: rgb(0, 0, 0),
    })
  }

  return pdfDoc.save()
}
