import { ALL_INSURANCE, type GsmRecord } from './mock-data'

export interface GsmSearchCriteria {
  phone: string
  driverCode: string
  insuranceType: string
}

export const DEFAULT_CRITERIA: GsmSearchCriteria = {
  phone: '',
  driverCode: '',
  insuranceType: ALL_INSURANCE,
}

// Pure filter. Blank inputs are ignored; all active conditions are AND-ed.
export function applySearch(
  records: GsmRecord[],
  criteria: GsmSearchCriteria,
): GsmRecord[] {
  const phone = criteria.phone.trim().toLowerCase()
  const driverCode = criteria.driverCode.trim().toLowerCase()
  const { insuranceType } = criteria

  return records.filter((r) => {
    const phoneMatch =
      !phone ||
      r.riderPhone.toLowerCase().includes(phone) ||
      r.bookerPhone.toLowerCase().includes(phone)
    const driverMatch = !driverCode || r.driverCode.toLowerCase().includes(driverCode)
    const typeMatch = insuranceType === ALL_INSURANCE || r.insuranceType === insuranceType
    return phoneMatch && driverMatch && typeMatch
  })
}
