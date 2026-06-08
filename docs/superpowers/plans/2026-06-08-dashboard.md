# Dashboard Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the PVI Admin Center dashboard page (UI + mock data only, no API) matching `docs/ui/dashboard.png`.

**Architecture:** Full app shell (AntD `Layout` = Sider + Header + Content) with real `react-router` routing; only the dashboard route is fully built, other menu routes render a shared placeholder. Tailwind owns layout/spacing, AntD owns interactive components, Recharts renders the two combo (bar+line) charts. All numbers come from a static `mock-data.ts`.

**Tech Stack:** React 19, TypeScript, Vite 8, Tailwind CSS v4, Ant Design 5 (+ React-19 patch), Recharts v3, react-router v7.

**Spec:** `docs/superpowers/specs/2026-06-08-dashboard-design.md`

**Verification model:** No unit-test runner is installed and the spec is UI-only; per the project's web-testing rules, visual regression beats brittle markup tests for visual components. Each task is verified by `yarn build` (tsc typecheck + vite build) passing, and the final task does a Playwright visual check against the screenshot.

**Conventions (from `docs/rules/`):**
- `verbatimModuleSyntax` is on → use `import type { X }` for type-only imports.
- `erasableSyntaxOnly` is on → no `enum`/`namespace`; use `as const` + string-literal unions.
- Tailwind for layout, AntD for components; never target `.ant-*` internals; use `cn()` for conditional classes.

---

### Task 1: Install dependencies & build config

**Files:**
- Modify: `package.json` (via yarn add)
- Create: `vite.config.ts`
- Create: `src/app/globals.css`
- Create: `src/app/theme.ts`

- [ ] **Step 1: Install runtime + dev dependencies**

```bash
yarn add antd @ant-design/icons @ant-design/v5-patch-for-react-19 recharts react-router-dom clsx tailwind-merge
yarn add -D tailwindcss @tailwindcss/vite prettier-plugin-tailwindcss
```

- [ ] **Step 2: Create `vite.config.ts`**

The repo currently has no vite config (it relied on esbuild's default JSX). Add one wiring the React plugin (already a devDep) and the Tailwind v4 plugin.

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

- [ ] **Step 3: Create `src/app/globals.css`**

Tailwind v4 uses a single import. Add base page styling here.

```css
@import 'tailwindcss';

:root {
  font-family: Inter, system-ui, 'Segoe UI', Roboto, sans-serif;
}

html,
body,
#root {
  margin: 0;
  height: 100%;
}

body {
  background: #f5f6fa;
  color: #1f2330;
}
```

- [ ] **Step 4: Create `src/app/theme.ts`**

```ts
import type { ThemeConfig } from 'antd'

export const themeTokens = {
  colorPrimary: '#4f46e5',
  colorSuccess: '#52c41a',
  colorError: '#ff4d4f',
  borderRadius: 8,
  fontFamily: 'Inter, system-ui, sans-serif',
} as const

export const antdTheme: ThemeConfig = {
  token: themeTokens,
}

// Chart palette (shared by both chart components)
export const chartColors = {
  doanhThuKyTruoc: '#c7d2fe', // light purple bar
  doanhThu: '#312e81', // navy bar
  soDonKyTruoc: '#ef4444', // red dashed line
  soDon: '#4f46e5', // indigo solid line
} as const
```

- [ ] **Step 5: Verify install/build wiring**

Run: `yarn build`
Expected: PASS (tsc + vite build succeed). The old starter `App.tsx`/`index.css` still exist and compile; they are removed in Task 9.

- [ ] **Step 6: Commit**

```bash
git add package.json yarn.lock vite.config.ts src/app/globals.css src/app/theme.ts
git commit -m "build: add tailwind, antd, recharts, router deps + theme"
```

---

### Task 2: Shared utilities & UI primitives

**Files:**
- Create: `src/utils/cn.ts`
- Create: `src/components/ui/StatCard.tsx`
- Create: `src/components/ui/PanelCard.tsx`

- [ ] **Step 1: Create `src/utils/cn.ts`**

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 2: Create `src/components/ui/StatCard.tsx`**

Reusable card for KPI cards and the small sub-stat cards. `accent` renders the lavender highlighted variant (year-revenue card).

```tsx
import { cn } from '../../utils/cn'

interface StatCardProps {
  label: string
  value: string
  sub?: string
  accent?: boolean
  className?: string
}

export function StatCard({ label, value, sub, accent, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-lg border p-5',
        accent
          ? 'border-indigo-200 bg-indigo-50'
          : 'border-gray-100 bg-white shadow-sm',
        className,
      )}
    >
      <span className="text-sm text-gray-500">{label}</span>
      <span
        className={cn(
          'text-2xl font-semibold',
          accent ? 'text-indigo-700' : 'text-gray-800',
        )}
      >
        {value}
      </span>
      {sub ? <span className="text-xs text-rose-500">{sub}</span> : null}
    </div>
  )
}
```

- [ ] **Step 3: Create `src/components/ui/PanelCard.tsx`**

White rounded panel with a title and an expand icon top-right (visual only).

```tsx
import type { ReactNode } from 'react'
import { FullscreenOutlined } from '@ant-design/icons'
import { cn } from '../../utils/cn'

interface PanelCardProps {
  title: string
  children: ReactNode
  className?: string
}

export function PanelCard({ title, children, className }: PanelCardProps) {
  return (
    <section
      className={cn(
        'flex flex-col rounded-lg border border-gray-100 bg-white p-5 shadow-sm',
        className,
      )}
    >
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
        <FullscreenOutlined className="cursor-pointer text-gray-400 hover:text-gray-600" />
      </header>
      {children}
    </section>
  )
}
```

- [ ] **Step 4: Verify build**

Run: `yarn build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/cn.ts src/components/ui/StatCard.tsx src/components/ui/PanelCard.tsx
git commit -m "feat: add cn helper, StatCard and PanelCard primitives"
```

---

### Task 3: Mock data

**Files:**
- Create: `src/pages/dashboard/mock-data.ts`

- [ ] **Step 1: Create `src/pages/dashboard/mock-data.ts`**

Defines every type and value the dashboard renders. Chart points use non-zero invented numbers so bars/lines are visible.

```ts
export interface KpiCardData {
  label: string
  value: string
  sub?: string
  accent?: boolean
}

export interface StatItemData {
  label: string
  value: string
}

export interface ChartPoint {
  label: string
  doanhThuKyTruoc: number
  doanhThu: number
  soDonKyTruoc: number
  soDon: number
}

export const partnerOptions = [{ value: 'PVID', label: 'PVID' }] as const

export const kpiCards: KpiCardData[] = [
  { label: 'Doanh thu hôm nay', value: '0' },
  { label: 'Doanh thu tháng này', value: '0' },
  {
    label: 'Doanh thu năm nay',
    value: '645,000 VND',
    sub: '95% ↓ so với năm trước',
    accent: true,
  },
  { label: 'Doanh thu trung bình theo ngày', value: '0' },
]

export const orderAverages: StatItemData[] = [
  { label: 'Số lượng theo ngày', value: '0' },
  { label: 'Số lượng theo giờ', value: '0' },
  { label: 'Số lượng theo phút', value: '0' },
]

export const processingTimes: StatItemData[] = [
  { label: 'API cấp đơn', value: '0.05 s' },
  { label: 'API hủy đơn', value: '0.04 s' },
  { label: 'Bình GCNĐH', value: '2.00 s' },
]

// 14 days: 26.05 -> 08.06
export const dailyRevenue: ChartPoint[] = [
  { label: '26.05', doanhThuKyTruoc: 120000000, doanhThu: 80000000, soDonKyTruoc: 6, soDon: 4 },
  { label: '27.05', doanhThuKyTruoc: 300000000, doanhThu: 150000000, soDonKyTruoc: 8, soDon: 5 },
  { label: '28.05', doanhThuKyTruoc: 220000000, doanhThu: 260000000, soDonKyTruoc: 5, soDon: 7 },
  { label: '29.05', doanhThuKyTruoc: 480000000, doanhThu: 320000000, soDonKyTruoc: 9, soDon: 6 },
  { label: '30.05', doanhThuKyTruoc: 360000000, doanhThu: 410000000, soDonKyTruoc: 7, soDon: 8 },
  { label: '31.05', doanhThuKyTruoc: 520000000, doanhThu: 300000000, soDonKyTruoc: 10, soDon: 6 },
  { label: '01.06', doanhThuKyTruoc: 280000000, doanhThu: 540000000, soDonKyTruoc: 6, soDon: 9 },
  { label: '02.06', doanhThuKyTruoc: 610000000, doanhThu: 470000000, soDonKyTruoc: 11, soDon: 8 },
  { label: '03.06', doanhThuKyTruoc: 450000000, doanhThu: 620000000, soDonKyTruoc: 8, soDon: 10 },
  { label: '04.06', doanhThuKyTruoc: 700000000, doanhThu: 550000000, soDonKyTruoc: 12, soDon: 9 },
  { label: '05.06', doanhThuKyTruoc: 520000000, doanhThu: 730000000, soDonKyTruoc: 9, soDon: 12 },
  { label: '06.06', doanhThuKyTruoc: 660000000, doanhThu: 600000000, soDonKyTruoc: 11, soDon: 10 },
  { label: '07.06', doanhThuKyTruoc: 480000000, doanhThu: 790000000, soDonKyTruoc: 8, soDon: 13 },
  { label: '08.06', doanhThuKyTruoc: 540000000, doanhThu: 650000000, soDonKyTruoc: 9, soDon: 11 },
]

// 11 months: 01.2026 -> 11.2026
export const monthlyRevenue: ChartPoint[] = [
  { label: '01.2026', doanhThuKyTruoc: 1200000, doanhThu: 900000, soDonKyTruoc: 3, soDon: 2 },
  { label: '02.2026', doanhThuKyTruoc: 2600000, doanhThu: 1800000, soDonKyTruoc: 6, soDon: 4 },
  { label: '03.2026', doanhThuKyTruoc: 4800000, doanhThu: 3200000, soDonKyTruoc: 9, soDon: 7 },
  { label: '04.2026', doanhThuKyTruoc: 3400000, doanhThu: 4100000, soDonKyTruoc: 7, soDon: 8 },
  { label: '05.2026', doanhThuKyTruoc: 5000000, doanhThu: 4600000, soDonKyTruoc: 10, soDon: 9 },
  { label: '06.2026', doanhThuKyTruoc: 2800000, doanhThu: 3300000, soDonKyTruoc: 6, soDon: 7 },
  { label: '07.2026', doanhThuKyTruoc: 3600000, doanhThu: 2900000, soDonKyTruoc: 7, soDon: 6 },
  { label: '08.2026', doanhThuKyTruoc: 1800000, doanhThu: 2200000, soDonKyTruoc: 4, soDon: 5 },
  { label: '09.2026', doanhThuKyTruoc: 2400000, doanhThu: 1600000, soDonKyTruoc: 5, soDon: 3 },
  { label: '10.2026', doanhThuKyTruoc: 1500000, doanhThu: 2000000, soDonKyTruoc: 3, soDon: 4 },
  { label: '11.2026', doanhThuKyTruoc: 2000000, doanhThu: 1200000, soDonKyTruoc: 4, soDon: 2 },
]
```

- [ ] **Step 2: Verify build**

Run: `yarn build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/dashboard/mock-data.ts
git commit -m "feat: add dashboard mock data"
```

---

### Task 4: App shell — Topbar, SidebarNav, AdminLayout

**Files:**
- Create: `src/layouts/AdminLayout/Topbar.tsx`
- Create: `src/layouts/AdminLayout/SidebarNav.tsx`
- Create: `src/layouts/AdminLayout/AdminLayout.tsx`

- [ ] **Step 1: Create `src/layouts/AdminLayout/Topbar.tsx`**

```tsx
import { Avatar } from 'antd'

export function Topbar() {
  return (
    <div className="flex h-full items-center justify-between bg-white px-6">
      <div className="flex items-center gap-2">
        <span className="text-xl font-extrabold tracking-tight text-rose-600">
          PVI
        </span>
        <span className="text-base font-medium text-gray-700">Admin Center</span>
      </div>
      <div className="flex items-center gap-2">
        <Avatar size={28} className="bg-indigo-600 text-xs">
          AD
        </Avatar>
        <span className="text-sm text-gray-600">PVI Digital</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/layouts/AdminLayout/SidebarNav.tsx`**

Leaf items navigate; the `▾` items are SubMenus (collapsible chevron, no invented child labels per `ui-ux-strict.md`).

```tsx
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  FileProtectOutlined,
  FileTextOutlined,
  SolutionOutlined,
  FolderOpenOutlined,
  FileDoneOutlined,
  SettingOutlined,
  SearchOutlined,
  BarChartOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'

const items: MenuProps['items'] = [
  { key: '/', icon: <AppstoreOutlined />, label: 'Bảng điều khiển' },
  { key: 'muc-luc', icon: <UnorderedListOutlined />, label: 'Mục lục', children: [] },
  { key: 'don-bao-hiem', icon: <FileProtectOutlined />, label: 'Đơn bảo hiểm', children: [] },
  { key: 'hop-dong', icon: <FileTextOutlined />, label: 'Hợp đồng nguyên tắc', children: [] },
  { key: 'yeu-cau-boi-thuong', icon: <SolutionOutlined />, label: 'Yêu cầu bồi thường', children: [] },
  { key: 'ho-so-boi-thuong', icon: <FolderOpenOutlined />, label: 'Hồ sơ bồi thường', children: [] },
  { key: 'yeu-cau-hoa-don', icon: <FileDoneOutlined />, label: 'Yêu cầu hoá đơn', children: [] },
  { key: 'quan-tri', icon: <SettingOutlined />, label: 'Quản trị', children: [] },
  { key: '/tra-cuu-gsm', icon: <SearchOutlined />, label: 'Tra cứu GSM PPT' },
  { key: '/bao-cao-power-bi', icon: <BarChartOutlined />, label: 'Báo cáo Power BI' },
  { key: '/cai-dat-tai-khoan', icon: <UserOutlined />, label: 'Cài đặt tài khoản' },
]

export function SidebarNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key.startsWith('/')) navigate(key)
  }

  return (
    <Menu
      mode="inline"
      items={items}
      selectedKeys={[pathname]}
      onClick={onClick}
      className="h-full border-r-0"
    />
  )
}
```

- [ ] **Step 3: Create `src/layouts/AdminLayout/AdminLayout.tsx`**

```tsx
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import { Topbar } from './Topbar'
import { SidebarNav } from './SidebarNav'

const { Header, Sider, Content } = Layout

export function AdminLayout() {
  return (
    <Layout className="min-h-screen">
      <Header className="!h-14 !bg-white px-0 shadow-sm" style={{ lineHeight: 'normal' }}>
        <Topbar />
      </Header>
      <Layout>
        <Sider width={240} theme="light" className="!bg-white">
          <SidebarNav />
        </Sider>
        <Content className="p-6">
          <Outlet />
          <footer className="mt-8 text-center text-xs text-gray-400">
            Powered by PVI Digital
          </footer>
        </Content>
      </Layout>
    </Layout>
  )
}
```

- [ ] **Step 4: Verify build**

Run: `yarn build`
Expected: PASS. (Router wiring lands in Task 5; these compile standalone.)

- [ ] **Step 5: Commit**

```bash
git add src/layouts/AdminLayout
git commit -m "feat: add admin layout shell (topbar, sidebar, layout)"
```

---

### Task 5: Routing, placeholder page, app entry

**Files:**
- Create: `src/pages/placeholder/PlaceholderPage.tsx`
- Create: `src/pages/dashboard/DashboardPage.tsx` (temporary stub, fleshed out in Tasks 6–9)
- Create: `src/app/router.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: Create `src/pages/placeholder/PlaceholderPage.tsx`**

```tsx
interface PlaceholderPageProps {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="flex h-64 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-400 shadow-sm">
      {title}
    </div>
  )
}
```

- [ ] **Step 2: Create temporary `src/pages/dashboard/DashboardPage.tsx` stub**

```tsx
export function DashboardPage() {
  return <div>Dashboard</div>
}
```

- [ ] **Step 3: Create `src/app/router.tsx`**

```tsx
import { createBrowserRouter } from 'react-router-dom'
import { AdminLayout } from '../layouts/AdminLayout/AdminLayout'
import { DashboardPage } from '../pages/dashboard/DashboardPage'
import { PlaceholderPage } from '../pages/placeholder/PlaceholderPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'tra-cuu-gsm', element: <PlaceholderPage title="Tra cứu GSM PPT" /> },
      { path: 'bao-cao-power-bi', element: <PlaceholderPage title="Báo cáo Power BI" /> },
      { path: 'cai-dat-tai-khoan', element: <PlaceholderPage title="Cài đặt tài khoản" /> },
    ],
  },
])
```

- [ ] **Step 4: Replace `src/main.tsx`**

Full new contents (imports the React-19 AntD patch, mounts `ConfigProvider` + `RouterProvider`, uses `globals.css` instead of the old `index.css`):

```tsx
import '@ant-design/v5-patch-for-react-19'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import { RouterProvider } from 'react-router-dom'
import { antdTheme } from './app/theme'
import { router } from './app/router'
import './app/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={antdTheme}>
      <RouterProvider router={router} />
    </ConfigProvider>
  </StrictMode>,
)
```

- [ ] **Step 5: Verify build + dev render**

Run: `yarn build`
Expected: PASS.
Run: `yarn dev`, open the printed URL.
Expected: Shell renders — PVI topbar, left sidebar with the 11 menu items, "Dashboard" stub in content, "Powered by PVI Digital" footer. Clicking `Tra cứu GSM PPT` shows its placeholder.

- [ ] **Step 6: Commit**

```bash
git add src/app/router.tsx src/main.tsx src/pages/placeholder src/pages/dashboard/DashboardPage.tsx
git commit -m "feat: wire router, config provider, placeholder page"
```

---

### Task 6: Dashboard top sections — GreetingBar, InfoBanner, KpiCards

**Files:**
- Create: `src/pages/dashboard/components/GreetingBar.tsx`
- Create: `src/pages/dashboard/components/InfoBanner.tsx`
- Create: `src/pages/dashboard/components/KpiCards.tsx`

- [ ] **Step 1: Create `src/pages/dashboard/components/GreetingBar.tsx`**

```tsx
import { Select } from 'antd'
import { partnerOptions } from '../mock-data'

export function GreetingBar() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-800">Xin chào PVI Digital!</h1>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Đối tác</span>
        <Select
          defaultValue="PVID"
          options={[...partnerOptions]}
          className="w-40"
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/pages/dashboard/components/InfoBanner.tsx`**

```tsx
export function InfoBanner() {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-500">
      PVI Digital – Bảo hiểm tốt hơn cho mọi người
    </div>
  )
}
```

- [ ] **Step 3: Create `src/pages/dashboard/components/KpiCards.tsx`**

```tsx
import { StatCard } from '../../../components/ui/StatCard'
import { kpiCards } from '../mock-data'

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpiCards.map((card) => (
        <StatCard
          key={card.label}
          label={card.label}
          value={card.value}
          sub={card.sub}
          accent={card.accent}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Verify build**

Run: `yarn build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/dashboard/components/GreetingBar.tsx src/pages/dashboard/components/InfoBanner.tsx src/pages/dashboard/components/KpiCards.tsx
git commit -m "feat: add dashboard greeting, banner and KPI cards"
```

---

### Task 7: Chart components — RevenueDailyChart, RevenueMonthlyChart

**Files:**
- Create: `src/pages/dashboard/components/RevenueChart.tsx` (shared chart body)
- Create: `src/pages/dashboard/components/RevenueDailyChart.tsx`
- Create: `src/pages/dashboard/components/RevenueMonthlyChart.tsx`

- [ ] **Step 1: Create shared `src/pages/dashboard/components/RevenueChart.tsx`**

One DRY combo chart used by both panels. Bars on the left axis, lines on the right axis.

```tsx
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { ChartPoint } from '../mock-data'
import { chartColors } from '../../../app/theme'

interface RevenueChartProps {
  data: ChartPoint[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} />
        <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#9ca3af' }} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#9ca3af' }} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar yAxisId="left" dataKey="doanhThuKyTruoc" name="Doanh thu kỳ trước" fill={chartColors.doanhThuKyTruoc} barSize={10} radius={[2, 2, 0, 0]} />
        <Bar yAxisId="left" dataKey="doanhThu" name="Doanh thu" fill={chartColors.doanhThu} barSize={10} radius={[2, 2, 0, 0]} />
        <Line yAxisId="right" type="monotone" dataKey="soDonKyTruoc" name="Số đơn kỳ trước" stroke={chartColors.soDonKyTruoc} strokeDasharray="5 5" dot={false} />
        <Line yAxisId="right" type="monotone" dataKey="soDon" name="Số đơn" stroke={chartColors.soDon} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
```

- [ ] **Step 2: Create `src/pages/dashboard/components/RevenueDailyChart.tsx`**

```tsx
import { PanelCard } from '../../../components/ui/PanelCard'
import { RevenueChart } from './RevenueChart'
import { dailyRevenue } from '../mock-data'

export function RevenueDailyChart() {
  return (
    <PanelCard title="Doanh thu thực tế (14 ngày gần nhất)">
      <RevenueChart data={dailyRevenue} />
    </PanelCard>
  )
}
```

- [ ] **Step 3: Create `src/pages/dashboard/components/RevenueMonthlyChart.tsx`**

```tsx
import { PanelCard } from '../../../components/ui/PanelCard'
import { RevenueChart } from './RevenueChart'
import { monthlyRevenue } from '../mock-data'

export function RevenueMonthlyChart() {
  return (
    <PanelCard title="Doanh thu theo tháng">
      <RevenueChart data={monthlyRevenue} />
    </PanelCard>
  )
}
```

- [ ] **Step 4: Verify build**

Run: `yarn build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/dashboard/components/RevenueChart.tsx src/pages/dashboard/components/RevenueDailyChart.tsx src/pages/dashboard/components/RevenueMonthlyChart.tsx
git commit -m "feat: add revenue combo charts (daily + monthly)"
```

---

### Task 8: Bottom panels — OrderAverages, ProcessingTimes

**Files:**
- Create: `src/pages/dashboard/components/OrderAverages.tsx`
- Create: `src/pages/dashboard/components/ProcessingTimes.tsx`

- [ ] **Step 1: Create `src/pages/dashboard/components/OrderAverages.tsx`**

```tsx
import { PanelCard } from '../../../components/ui/PanelCard'
import { StatCard } from '../../../components/ui/StatCard'
import { orderAverages } from '../mock-data'

export function OrderAverages() {
  return (
    <PanelCard title="Số lượng đơn trung bình">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {orderAverages.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} />
        ))}
      </div>
    </PanelCard>
  )
}
```

- [ ] **Step 2: Create `src/pages/dashboard/components/ProcessingTimes.tsx`**

```tsx
import { PanelCard } from '../../../components/ui/PanelCard'
import { StatCard } from '../../../components/ui/StatCard'
import { processingTimes } from '../mock-data'

export function ProcessingTimes() {
  return (
    <PanelCard title="Thời gian xử lý trung bình">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {processingTimes.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} />
        ))}
      </div>
    </PanelCard>
  )
}
```

- [ ] **Step 3: Verify build**

Run: `yarn build`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/pages/dashboard/components/OrderAverages.tsx src/pages/dashboard/components/ProcessingTimes.tsx
git commit -m "feat: add order-averages and processing-times panels"
```

---

### Task 9: Compose DashboardPage + remove starter cruft + final verify

**Files:**
- Modify: `src/pages/dashboard/DashboardPage.tsx` (replace stub)
- Delete: `src/App.tsx`, `src/App.css`, `src/index.css`, `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`

- [ ] **Step 1: Replace `src/pages/dashboard/DashboardPage.tsx`**

```tsx
import { GreetingBar } from './components/GreetingBar'
import { InfoBanner } from './components/InfoBanner'
import { KpiCards } from './components/KpiCards'
import { RevenueDailyChart } from './components/RevenueDailyChart'
import { RevenueMonthlyChart } from './components/RevenueMonthlyChart'
import { OrderAverages } from './components/OrderAverages'
import { ProcessingTimes } from './components/ProcessingTimes'

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-5">
      <GreetingBar />
      <InfoBanner />
      <KpiCards />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <RevenueDailyChart />
        <RevenueMonthlyChart />
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <OrderAverages />
        <ProcessingTimes />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Delete unused starter files**

```bash
git rm src/App.tsx src/App.css src/index.css src/assets/hero.png src/assets/react.svg src/assets/vite.svg
```

(No remaining file imports these — `main.tsx` was repointed to `globals.css` in Task 5. If `yarn build` reports a leftover import, remove it.)

- [ ] **Step 3: Verify build**

Run: `yarn build`
Expected: PASS with no unused-import or missing-module errors.

- [ ] **Step 4: Visual verification against the screenshot**

Run: `yarn dev`, then with Playwright MCP navigate to the dev URL and screenshot at 1440px width.
Expected, compared to `docs/ui/dashboard.png`:
- Topbar: `PVI` + `Admin Center` left, `AD` avatar + `PVI Digital` right.
- Sidebar: 11 items, `Bảng điều khiển` selected, `▾` items collapsible.
- Greeting `Xin chào PVI Digital!` + `Đối tác` Select `PVID`.
- Info banner text exact.
- 4 KPI cards; the `Doanh thu năm nay` card is lavender with `645,000 VND` + `95% ↓ so với năm trước`.
- Two combo charts render bars + (solid/dashed) lines with the 4-series legend; tooltips show on hover.
- `Số lượng đơn trung bình` (3 sub-cards) and `Thời gian xử lý trung bình` (3 sub-cards) with exact values.
- Footer `Powered by PVI Digital`.

Fix any visual deviations, then rebuild.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: compose dashboard page and remove starter template files"
```

---

## Self-Review

**Spec coverage:**
- Stack (Tailwind+AntD+Recharts+router) → Task 1. ✓
- `cn()`, PanelCard, StatCard → Task 2. ✓
- Mock data (KPI, sub-cards, 2 chart series, partner options) → Task 3. ✓
- Shell (Sider+Header+Content, 11 menu items, topbar) → Task 4. ✓
- Real routing + placeholder + ConfigProvider/theme entry → Task 5. ✓
- Greeting + Đối tác Select, info banner, 4 KPI cards (accent year card) → Task 6. ✓
- Two combo charts (4 series, dual axis, dashed line, tooltip/legend) → Task 7. ✓
- Order averages + processing times panels (exact labels/values) → Task 8. ✓
- DashboardPage composition + footer + starter cleanup → Task 9. ✓
- Theme tokens + chart palette → Task 1 (`theme.ts`). ✓
- Out-of-scope items (no API, no dark mode, no extra pages) respected. ✓

**Placeholder scan:** No TBD/TODO; every code step has complete content.

**Type consistency:** `ChartPoint`, `KpiCardData`, `StatItemData` defined in Task 3 and consumed unchanged in Tasks 6–8; `RevenueChart` `dataKey`s (`doanhThuKyTruoc`, `doanhThu`, `soDonKyTruoc`, `soDon`) match the `ChartPoint` fields; `chartColors` defined in Task 1 `theme.ts` and imported in Task 7; `StatCard`/`PanelCard` prop names consistent across Tasks 2, 6, 8.
