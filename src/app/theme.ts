import type { ThemeConfig } from 'antd'

// antd Layout header height token (also the sticky-header offset).
export const HEADER_HEIGHT = 56

export const themeTokens = {
  colorPrimary: '#4f46e5',
  colorSuccess: '#52c41a',
  colorError: '#ff4d4f',
  borderRadius: 8,
  fontFamily: 'Inter, system-ui, sans-serif',
} as const

export const antdTheme: ThemeConfig = {
  token: themeTokens,
  components: {
    Layout: {
      headerBg: '#ffffff',
      headerHeight: HEADER_HEIGHT,
      siderBg: '#ffffff',
    },
  },
}

// Chart palette (shared by both chart components)
export const chartColors = {
  doanhThuKyTruoc: '#c7d2fe', // light purple bar
  doanhThu: '#312e81', // navy bar
  soDonKyTruoc: '#ef4444', // red dashed line
  soDon: '#4f46e5', // indigo solid line
} as const
