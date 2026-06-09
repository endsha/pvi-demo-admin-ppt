# Driver Savings Policies List Page — UI Design Spec

**Date:** 2026-06-09
**Scope:** UI only + in-memory mock data. **No API, no mock API, no tests** (per request).
**Design source:** `docs/ui/ppt-policies-list.png`
**Page:** "Bảo hiểm tích lũy tài xế" (driver accumulation / savings insurance policy list).

This spec follows `docs/rules/ui-ux-strict.md` — labels are copied verbatim from the
screenshot; nothing is invented beyond the two flagged mock assumptions below.

---

## 1. Goal

Replicate the "Bảo hiểm tích lũy tài xế" policy-list screen pixel-and-label-faithfully as a
standalone page in the existing AntD v6 + Tailwind v4 + react-router v7 admin app, with a
**functional client-side filter** over ~12 mock rows and real table pagination. Reachable
from the **already-existing** sidebar entry / route
`/don-bao-hiem/bao-hiem-tich-luy-tai-xe` (currently a `PlaceholderPage`).

---

## 2. Approach

New **self-contained** page folder `src/pages/driver-savings/` that mirrors the sibling
`src/pages/policies/` structure (page component, `mock-data.ts`, pure filter util, and a
`components/` folder of focused presentational pieces). The existing `policies/` page is
**not touched**; the visually-identical summary bar and status badge are re-implemented
locally to keep this page self-contained (chosen over a shared-component refactor).

---

## 3. File Layout

```
src/pages/driver-savings/
├── DriverSavingsListPage.tsx        // breadcrumb + title; owns applied filter state + pagination; composes sections
├── mock-data.ts                     // DriverSavingsRow type, DriverSavingsStatus union, ~12 mock rows, status options, headline totals, formatters
├── driver-savings-filters.ts        // DriverSavingsFilters type + pure applyFilters(rows, filters)
└── components/
    ├── DriverSavingsFilters.tsx     // AntD Form: 7 fields in 24-col grid; Làm lại / Tìm kiếm
    ├── DriverSavingsSummaryBar.tsx  // Tổng số đơn / Tổng phí bảo hiểm + CSV link + 3 icon buttons
    ├── DriverSavingsTable.tsx       // AntD Table; multi-line stacked cells; status tag; NO action column
    └── DriverSavingsStatusBadge.tsx // colored Tag keyed by status
```

Wiring change (one line):
- `src/app/router.tsx` — replace the `bao-hiem-tich-luy-tai-xe` `PlaceholderPage` element
  with `<DriverSavingsListPage />`.

No `SidebarNav` change — the menu item already exists and points at this route.

---

## 4. Exact Labels (verbatim from screenshot)

### Breadcrumb & title
- Breadcrumb: `Đơn bảo hiểm` / `Bảo hiểm tích lũy tài xế`
- Page title (h1): `Bảo hiểm tích lũy tài xế`

### Filter bar
Row 1 (4 columns):
| Label | Control | Placeholder |
|---|---|---|
| `Số điện thoại` | Input | `Nhập số điện thoại` |
| `ID chuyến đi` | Input | `Nhập ID chuyến đi` |
| `Biển số xe` | Input | `Nhập biển số xe` |
| `Mã tài xế` | Input | `Nhập mã tài xế` |

Row 2:
| Label | Control | Default |
|---|---|---|
| `Thời gian bắt đầu hiệu lực` | RangePicker (2 inputs) | empty (`Từ ngày` / `Đến ngày`) |
| `Thời gian tạo (Thời gian mua)` | RangePicker (2 inputs) | `2026-06-01` / `2026-06-09` |
| `Trạng thái đơn bảo hiểm` | Select | `Đã hoàn thành` |

Right-aligned actions on row 2: `Làm lại` (default button) · `Tìm kiếm` (primary button).

### Summary bar
- `Tổng số đơn : 7,479,138`
- `Tổng phí bảo hiểm : 1.238.722.150 đ`
- Right: `Xuất danh sách đơn bảo hiểm CSV` (export icon) + 3 icon-only buttons: reload,
  row-height, settings (gear).

### Table columns
| Header | Cell contents (stacked, bold label + value) |
|---|---|
| `STT` | row number |
| `Thông tin khách hàng` | `Mã tài xế: <code>` · `Tên: <name>` · `SĐT: <phone>` |
| `Thông tin đơn bảo hiểm` | `ID chuyến đi: <code>` · `Phí bảo hiểm: <amount> đ` · `Số đơn: <policyNo>` · `Loại bảo hiểm: <type>` |
| `Thời gian hiệu lực` | `Thời gian bắt đầu: <dt>` · `Thời gian kết thúc: <dt>` |
| `Trạng thái đơn bảo hiểm` | colored Tag, e.g. green `Hoàn thành` |

There is **no** "Hành động" / action column in this design.

---

## 5. Data Model

```ts
type DriverSavingsStatus = 'hoan-thanh' | 'hieu-luc' | 'het-hieu-luc' | 'da-huy'

interface DriverSavingsRow {
  id: string
  phone: string           // SĐT — used by phone filter + customer cell
  tripId: string          // ID chuyến đi
  plate: string           // Biển số xe (filter only; not shown in cells)
  driverCode: string      // Mã tài xế
  customerName: string    // Tên
  premium: number         // Phí bảo hiểm (đ)
  policyNumber: string    // Số đơn (e.g. 25/PC-GSM/6950974/012426)
  insuranceType: string   // Loại bảo hiểm (e.g. Gói Taxi PPT)
  effectiveStart: string  // Thời gian bắt đầu (ISO)
  effectiveEnd: string    // Thời gian kết thúc (ISO)
  createdAt: string       // Thời gian tạo / mua (ISO) — for create-date filter
  status: DriverSavingsStatus
}
```

- ~12 mock rows styled after the screenshot: driver codes like `6006389`, names like
  `Bùi Đức Tầm`, phones like `+84375689232`, trip IDs `01KSZF…`, `200 đ` premiums, policy
  numbers `25/PC-GSM/<n>/<n>`, `Gói Taxi PPT` type, effective `01/06/2026 00:00` →
  `27/11/2026 23:59`.
- `headlineTotalOrders = 7479138`, `headlineTotalPremium = 1238722150` — static constants
  rendered in the summary bar verbatim from the design.
- Formatters: `formatInt` (`7,479,138`, en-US grouping), `formatPremium` (`1.238.722.150`,
  vi-VN grouping), `formatDateTime` (`DD/MM/YYYY HH:mm`).

---

## 6. Filter Behavior (functional, client-side)

`driver-savings-filters.ts` exports a pure function:

```ts
interface DriverSavingsFilters {
  phone: string
  tripId: string
  plate: string
  driverCode: string
  effectiveRange: [string, string] | null  // Thời gian bắt đầu hiệu lực
  createdRange: [string, string] | null     // Thời gian tạo (Thời gian mua)
  status: DriverSavingsStatus | null
}

function applyFilters(rows: DriverSavingsRow[], f: DriverSavingsFilters): DriverSavingsRow[]
```

Matching rules:
- `phone` — case-insensitive substring of `phone`.
- `tripId` — case-insensitive substring of `tripId`.
- `plate` — case-insensitive substring of `plate`.
- `driverCode` — case-insensitive substring of `driverCode`.
- `status` — exact match (null = all).
- `effectiveRange` — `effectiveStart` within [from, to] inclusive.
- `createdRange` — `createdAt` within [from, to] inclusive.
- Empty / null filter fields are ignored.

### State flow (page-owned)
- AntD Form holds live edits; `appliedFilters` drives `applyFilters`.
- `Tìm kiếm` → `appliedFilters = form values`, reset pagination to page 1.
- `Làm lại` → reset form + `appliedFilters` to defaults (status `Đã hoàn thành`, created
  range `2026-06-01`..`2026-06-09`, others empty).
- `filteredRows = applyFilters(rows, appliedFilters)`.
- Table pager: `pageSize = 10`, `total = filteredRows.length`. Independent of the static
  headline `7,479,138`.

---

## 7. Styling Notes

- Reuse the white rounded card surface used across the app
  (`rounded-lg border border-gray-100 bg-white p-5 shadow-sm`, cf. `PanelCard`).
- Filter grid: AntD 24-col — row 1 four columns `Col xs={24} md={6}`; row 2 lays out the
  two range fields + select with the action buttons pushed right.
- Table cells stack lines with a small vertical gap; labels bold/gray, values darker
  (same `Field` helper pattern as `PolicyTable`).
- Status Tag colors: `Hoàn thành` → green (success). Other placeholder statuses get
  distinct AntD tag colors (see mock-assumption #1).
- Primary color from theme is used for `Tìm kiếm`.

---

## 8. Routing & Navigation

- Route path `/don-bao-hiem/bao-hiem-tich-luy-tai-xe` already exists → swap element from
  `<PlaceholderPage title="Bảo hiểm tích lũy tài xế" />` to `<DriverSavingsListPage />`.
- Sidebar entry already present and active on this route — no change.

---

## 9. Mock Assumptions (flagged — rule #8)

1. **Status options beyond `Hoàn thành`.** Only `Hoàn thành` / `Đã hoàn thành` is visible
   in the design. To make the filter dropdown functional, the spec adds placeholder
   statuses `Hiệu lực`, `Hết hiệu lực`, `Đã hủy`. Mock-only; confirm/replace with the real
   status set when known. (Mirrors the sibling `policies/` page for consistency.)
2. **Headline vs. table totals.** `7,479,138` / `1.238.722.150 đ` are shown as static
   design constants (server-side totals) while the table pager counts actual mock rows.
   Accepted as an intentional fidelity-vs-coherence tradeoff.

---

## 10. Out of Scope

- No API, no mock API layer, no data fetching.
- No automated tests (the pure `applyFilters` is the natural unit-test seam if added later).
- CSV export, reload, row-height, and settings icon buttons are visual only (no-op).
- The existing `policies/` page and shared component extraction are untouched.
