import dayjs from 'dayjs'
import type { ClaimForm } from '../claim-form/claim-form'

export interface ClaimHistoryRow {
  id: string
  claimFileCode: string // Mã Hồ sơ bồi thường
  masterPolicyNumber: string // Mã hợp đồng nguyên tắc
  createdBy: string // Người tạo
  createdAt: string // Ngày tạo
  status: string // Trạng thái
}

export interface MockClaim extends ClaimForm {
  historyRows: ClaimHistoryRow[]
}

// Matches docs/ui/update-claim-request-ppt-01.png / -02.png
const defaultClaim: MockClaim = {
  receivingSource: undefined,
  driverCode: '6123723',
  fullName: 'Phạm Xuân Đông Hải',
  gender: 'male',
  idNumber: undefined,
  dob: undefined,
  phone: '+84968532564',
  email: undefined,
  zalo: undefined,
  accidentDate: dayjs('2026-05-31'),
  accidentPlace: 'Phường thới an',
  examDate: dayjs('2026-06-03'),
  admissionDate: undefined,
  treatmentPlace: 'Tiêm chủng Long Châu',
  diagnosis: 'Chó cắn',
  consequence: 'Tiêm vắc xin',
  treatmentType: 'outpatient',
  fromDate: undefined,
  toDate: undefined,
  claimAmount: 1725000,
  claimCases: ['medical'],
  beneficiary: 'Phạm Xuân Đông Hải',
  accountNumber: '060194546850',
  bankName: 'Sacombank',
  bankAddress: '207 Lê Văn Khương, phường thới an, tp Hồ Chí Minh',
  historyRows: [],
}

// Keyed by claim-requests list row ids (src/pages/claim-requests/mock-data.ts).
// Row id '1' is this exact driver (6123723 / Phạm Xuân Đông Hải).
export const mockClaimsById: Record<string, MockClaim> = {
  '1': defaultClaim,
}

export function findClaim(id?: string): MockClaim {
  return (id && mockClaimsById[id]) || defaultClaim
}
