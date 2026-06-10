// Tải về file PDF Hợp đồng nguyên tắc: dùng đúng mẫu PDF gốc theo loại tài xế,
// chỉ điền các biến của dòng (row) — giữ nguyên 100% bố cục template.
import templateMotorcycleUrl from '../../assets/hdbh_templates/20240925_HDBH_Tai_xe_XE_MAY.pdf?url'
import templateCarUrl from '../../assets/hdbh_templates/20240925_HDBH_Tai_xe_XE_O_TO.pdf?url'
import robotoUrl from '../../assets/fonts/Roboto-Regular.ttf?url'
import { resolveVehicleType } from '../master-policy-detail/contract-terms'
import type { MasterPolicyRow } from './mock-data'

async function fetchBytes(url: string): Promise<Uint8Array> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Không tải được tài nguyên: ${url}`)
  return new Uint8Array(await res.arrayBuffer())
}

function fileNameFor(row: MasterPolicyRow): string {
  return `HDNT_${row.contractNumber.replace(/[^\w]+/g, '_')}.pdf`
}

function triggerDownload(bytes: Uint8Array, fileName: string): void {
  const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}

export async function downloadContractPdf(row: MasterPolicyRow): Promise<void> {
  // pdf-lib + fontkit là phần nặng → nạp động, giữ bundle chính gọn nhẹ.
  const { fillContractPdf, buildPlaceholderValues } = await import('./contract-fill')

  const templateUrl =
    resolveVehicleType(row.contractNumber, row.packageName) === 'motorcycle'
      ? templateMotorcycleUrl
      : templateCarUrl

  const [templateBytes, fontBytes] = await Promise.all([
    fetchBytes(templateUrl),
    fetchBytes(robotoUrl),
  ])

  const filled = await fillContractPdf(templateBytes, fontBytes, buildPlaceholderValues(row))
  triggerDownload(filled, fileNameFor(row))
}
