import type { Dayjs } from 'dayjs'

export interface NewClaimRequestForm {
  receivingSource?: string
  customerSearch?: string
  driverCode?: string
  fullName?: string
  gender?: string
  idNumber?: string
  dob?: string
  phone?: string
  email?: string
  zalo?: string
  accidentDate?: Dayjs
  accidentPlace?: string
  examDate?: Dayjs
  admissionDate?: Dayjs
  treatmentPlace?: string
  diagnosis?: string
  consequence?: string
  treatmentType?: 'outpatient' | 'inpatient'
  fromDate?: Dayjs
  toDate?: Dayjs
  claimAmount?: number
  claimCases?: string[]
  beneficiary?: string
  accountNumber?: string
  bankName?: string
  bankAddress?: string
}

export interface MockCustomer {
  value: string
  label: string
  driverCode: string
  fullName: string
  gender: string
  idNumber: string
  dob: string
  phone: string
  email: string
  zalo: string
}

export const receivingSourceOptions = [
  { value: 'call_center', label: 'Tổng đài' },
  { value: 'email', label: 'Email' },
  { value: 'gsm_app', label: 'Ứng dụng GSM' },
  { value: 'counter', label: 'Trực tiếp tại quầy' },
]

export const genderOptions = [
  { value: 'Nam', label: 'Nam' },
  { value: 'Nữ', label: 'Nữ' },
  { value: 'Khác', label: 'Khác' },
]

export const claimCaseOptions = [
  { value: 'death', label: 'Tử vong' },
  { value: 'permanent_disability', label: 'Thương tật vĩnh viễn' },
  { value: 'medical', label: 'Chi phí y tế' },
  { value: 'hospital_allowance', label: 'Trợ cấp nằm viện' },
]

export const mockCustomers: MockCustomer[] = [
  {
    value: 'GSM-000123',
    label: 'GSM-000123 — Nguyễn Văn An — 0901234567',
    driverCode: 'GSM-000123',
    fullName: 'Nguyễn Văn An',
    gender: 'Nam',
    idNumber: '079090001234',
    dob: '12/05/1990',
    phone: '0901234567',
    email: 'an.nguyen@example.com',
    zalo: '0901234567',
  },
  {
    value: 'GSM-000456',
    label: 'GSM-000456 — Trần Thị Bình — 0912345678',
    driverCode: 'GSM-000456',
    fullName: 'Trần Thị Bình',
    gender: 'Nữ',
    idNumber: '079185004567',
    dob: '03/11/1985',
    phone: '0912345678',
    email: 'binh.tran@example.com',
    zalo: '0912345678',
  },
  {
    value: 'GSM-000789',
    label: 'GSM-000789 — Lê Hoàng Cường — 0987654321',
    driverCode: 'GSM-000789',
    fullName: 'Lê Hoàng Cường',
    gender: 'Nam',
    idNumber: '079092007890',
    dob: '27/08/1992',
    phone: '0987654321',
    email: 'cuong.le@example.com',
    zalo: '0987654321',
  },
]

export const customerOptions = mockCustomers.map((c) => ({
  value: c.value,
  label: c.label,
}))

export function findCustomer(value?: string): MockCustomer | undefined {
  return mockCustomers.find((c) => c.value === value)
}

export const initialValues: Partial<NewClaimRequestForm> = {
  claimCases: [],
}
