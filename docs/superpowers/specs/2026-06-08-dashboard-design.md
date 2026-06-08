# Dashboard Page — Design Spec

**Date:** 2026-06-08
**Status:** Approved (design phase)
**Source of truth:** `docs/ui/dashboard.png` (PVI Admin Center dashboard)

## Goal

Build the **PVI Admin Center dashboard page** — UI only, with mock data. No API
calls and no mock-API layer. The page must match `docs/ui/dashboard.png` per
`docs/rules/ui-ux-strict.md` (exact labels, layout, section order).

## Decisions

| Decision | Choice |
|---|---|
| Tech stack | Tailwind CSS + Ant Design 5 (per `docs/rules/styling-tailwind-antd.md`) |
| Scope | Full shell (Sider + Header + Content) with **real `react-router` routing** |
| Non-dashboard routes | Simple placeholder page (menu items navigate, but only dashboard is built) |
| Charts | **Recharts**, interactive (`ComposedChart`, tooltip + legend) |
| Theme | Light only, `colorPrimary` indigo `#4f46e5` |
| Data | Static mock data in a co-located `mock-data.ts`; no API, no mock-API |

## Dependencies to add

- `antd` (Ant Design 5)
- `tailwindcss` + `@tailwindcss/vite` (or PostCSS setup), `prettier-plugin-tailwindcss`
- `recharts`
- `react-router` (v7 / `react-router-dom`)
- `clsx` + `tailwind-merge` (for `cn()`)

## Architecture & file structure

```
src/
├── main.tsx                      # ConfigProvider + RouterProvider
├── app/
│   ├── theme.ts                  # AntD themeTokens (single source of truth)
│   ├── router.tsx                # react-router routes
│   └── globals.css               # Tailwind directives + resets
├── layouts/
│   └── AdminLayout/
│       ├── AdminLayout.tsx       # Sider + Header + Content shell
│       ├── SidebarNav.tsx        # left menu (AntD Menu)
│       └── Topbar.tsx            # logo + user avatar
├── pages/
│   ├── dashboard/
│   │   ├── DashboardPage.tsx     # composes the sections below
│   │   ├── components/
│   │   │   ├── GreetingBar.tsx       # "Xin chào..." + Đối tác select
│   │   │   ├── InfoBanner.tsx        # info banner
│   │   │   ├── KpiCards.tsx          # 4 revenue cards
│   │   │   ├── RevenueDailyChart.tsx # "Doanh thu thực tế (14 ngày...)"
│   │   │   ├── RevenueMonthlyChart.tsx
│   │   │   ├── OrderAverages.tsx     # "Số lượng đơn trung bình" (3 sub)
│   │   │   └── ProcessingTimes.tsx   # "Thời gian xử lý trung bình" (3 sub)
│   │   └── mock-data.ts          # all mock numbers + chart series
│   └── placeholder/
│       └── PlaceholderPage.tsx   # for non-dashboard routes
├── components/ui/
│   ├── PanelCard.tsx             # white rounded panel w/ title + expand icon
│   └── StatCard.tsx              # KPI / sub-stat card
└── utils/cn.ts                   # clsx + tailwind-merge
```

### Styling division of labour (per `styling-tailwind-antd.md`)

- **Tailwind**: layout, spacing, grid, responsive, raw-HTML typography/color.
- **AntD**: every interactive component — `Layout`, `Menu`, `Select`, `Avatar`,
  `Card`, `Tooltip`, etc.
- One `<ConfigProvider theme={{ token: themeTokens }}>` at app root.
- `cn()` helper for conditional classes. No CSS-in-JS, no `*.module.css`,
  no `!important`, no targeting `.ant-*` internals.

## Exact content (copied from screenshot)

### Topbar
PVI logo (red) + `Admin Center`. Right: avatar `AD` + `PVI Digital`.

### Sidebar menu
Active item: `Bảng điều khiển`. Items marked `▾` are expandable groups
(visual only / collapsible submenus):

1. `Bảng điều khiển` (active)
2. `Mục lục ▾`
3. `Đơn bảo hiểm ▾`
4. `Hợp đồng nguyên tắc ▾`
5. `Yêu cầu bồi thường ▾`
6. `Hồ sơ bồi thường ▾`
7. `Yêu cầu hoá đơn ▾`
8. `Quản trị ▾`
9. `Tra cứu GSM PPT`
10. `Báo cáo Power BI`
11. `Cài đặt tài khoản`

Each leaf route navigates; only `Bảng điều khiển` renders the real dashboard,
the rest render `PlaceholderPage`.

### Greeting bar
- Heading: `Xin chào PVI Digital!`
- Right: label `Đối tác` + AntD `Select` with value `PVID`.

### Info banner
`PVI Digital – Bảo hiểm tốt hơn cho mọi người`

### KPI cards (4, in one row)

| Label | Value | Notes |
|---|---|---|
| `Doanh thu hôm nay` | `0` | plain |
| `Doanh thu tháng này` | `0` | plain |
| `Doanh thu năm nay` | `645,000 VND` | accent/highlighted card + sub line `95% ↓ so với năm trước` |
| `Doanh thu trung bình theo ngày` | `0` | plain |

### Charts (2 panels side by side)

Each panel is a `PanelCard` with title + expand (⤢) icon top-right.

- Left: `Doanh thu thực tế (14 ngày gần nhất)`
- Right: `Doanh thu theo tháng`
- Shared legend / series:
  - `Doanh thu kỳ trước` — bar, light purple, left Y-axis
  - `Doanh thu` — bar, navy, left Y-axis
  - `Số đơn kỳ trước` — line, red **dashed**, right Y-axis
  - `Số đơn` — line, solid, right Y-axis
- Daily X-axis: 14 dates `26.05 → 07.06`.
- Monthly X-axis: `01.2026, 02.2026 … 11.2026`.
- Implemented with Recharts `ComposedChart` (`Bar` + `Line`, dual `YAxis`),
  `Tooltip` + `Legend` enabled.

### Order averages panel
Title `Số lượng đơn trung bình`, 3 sub-cards:
- `Số lượng theo ngày` → `0`
- `Số lượng theo giờ` → `0`
- `Số lượng theo phút` → `0`

### Processing times panel
Title `Thời gian xử lý trung bình`, 3 sub-cards:
- `API cấp đơn` → `0.05 s`
- `API hủy đơn` → `0.04 s`
- `Bình GCNĐH` → `2.00 s`

### Footer
`Powered by PVI Digital`

## Theme tokens (`app/theme.ts`)

```ts
export const themeTokens = {
  colorPrimary: '#4f46e5', // indigo — matches lavender accent + active states
  colorSuccess: '#52c41a',
  colorError: '#ff4d4f',
  borderRadius: 8,
  fontFamily: 'Inter, system-ui, sans-serif',
} as const;
```

- Page background: light gray `#f5f6fa`.
- Panels/cards: white, `borderRadius` 8, soft shadow.
- Year-revenue KPI card: lavender accent fill (`colorPrimary` tint).
- Chart bar colors: light purple `#c7d2fe` (kỳ trước), navy `#312e81` (current).
- Chart line colors: red dashed `#ef4444` (số đơn kỳ trước), indigo solid
  `#4f46e5` (số đơn).

## Mock data (`mock-data.ts`)

- KPI values, sub-card values, and Select options as above.
- Daily chart: array of 14 points `{ label, doanhThuKyTruoc, doanhThu, soDonKyTruoc, soDon }`
  with realistic invented numbers so bars/lines render visibly (the screenshot's
  flat-zero state is not visually useful for a demo).
- Monthly chart: array of 11 points with the same shape.
- All values are plain constants — no fetching, no async, no API mock.

## Out of scope

- No real data fetching, API, or mock-API layer.
- No build-out of non-dashboard pages beyond a shared placeholder.
- No dark mode.
- No auth, no i18n wiring (Vietnamese strings inline).

## Testing / verification

- `yarn build` (tsc + vite) passes.
- `yarn dev` renders the dashboard at `/` matching the screenshot.
- Visual check at common widths; charts show tooltips/legend on hover.
