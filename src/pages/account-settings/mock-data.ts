export interface AccountProfile {
  name: string
  phone: string
  email: string
}

// Mock pre-fill values from the screenshot (spec §7). UI-only, no API/persistence.
export const defaultAccount: AccountProfile = {
  name: 'PVI Digital',
  phone: '02899998386',
  email: 'admin@pvi.digital',
}
