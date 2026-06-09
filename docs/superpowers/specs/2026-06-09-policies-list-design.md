# Policies List Page — UI Design Spec

**Date:** 2026-06-09
**Scope:** UI only + in-memory mock data. **No API, no mock API, no tests** (per request).
**Design source:** `docs/ui/policies-list.png`
**Page:** "Tai nạn hành khách theo chuyến" (passenger-accident-per-trip policy list).

This spec follows `docs/rules/ui-ux-strict.md` — labels are copied verbatim from the
screenshot; nothing is invented beyond the two flagged mock assumptions below.

---

## 1. Goal

Replicate the policies-list screen pixel-and-label-faithfully as a standalone page in the
existing AntD v6 + Tailwind v4 + react-router v7 admin app, with a **functional
client-side filter** over ~12 mock rows and real table pagination. Reachable from a new
sidebar entry and route.

---

## 2. Approach

Mirror the existing dashboard pattern (`src/pages/dashboard/`): a page folder containing
the page component, a `mock-data.ts`, a pure filter util, and a `components/` folder of
focused presentational pieces.

---

## 3. File Layout

```
src/pages/policies/
├── PoliciesListPage.tsx        // breadcrumb + title; owns draft/applied filter state + pagination; composes sections
├── mock-data.ts                // PolicyRow type, PolicyStatus union, ~12 mock rows, status options, headline totals
├── policies-filters.ts         // PolicyFilters type + pure applyFilters(rows, filters)
└── components/
    ├── PolicyFilters.tsx       // AntD Form: 6 fields in 24-col grid; Làm lại / Tìm kiếm
    ├── PolicySummaryBar.tsx    // Tổng số đơn / Tổng phí + CSV link + 3 icon buttons
    ├── PolicyTable.tsx         // AntD Table; multi-line stacked cells; status tag; action button
    └── PolicyStatusBadge.tsx   // colored Tag keyed by status
```

Wiring changes:
- `src/app/router.tsx` — add route for the new page (+ placeholder routes for sibling menu items).
- `src/layouts/AdminLayout/SidebarNav.tsx` — populate the `Đơn bảo hiểm` submenu children.

---

## 4. Exact Labels (verbatim from screenshot)

### Breadcrumb & title
- Breadcrumb: `Đơn bảo hiểm` / `Tai nạn hành khách theo chuyến`
- Page title (h1): `Tai nạn hành khách theo chuyến`

### Sidebar — `Đơn bảo hiểm` submenu children
1. `Tất cả Đơn bảo hiểm`
2. `Tai nạn hành khách theo chuyến`  ← active, routes to this page
3. `Bảo hiểm hàng hoá`
4. `Bảo hiểm tích lũy tài xế`
5. `Bảo hiểm FoodCare`

### Filter bar
Row 1 (4 columns):
| Label | Control | Placeholder |
|---|---|---|
| `Số điện thoại` | Input | `Nhập số điện thoại` |
| `ID chuyến đi` | Input | `Nhập ID chuyến đi` |
| `Biển số xe` | Input | `Nhập biển số xe` |
| `Thời gian bắt đầu hiệu lực` | RangePicker (2 inputs) | `Từ ngày` / `Đến ngày` |

Row 2:
| Label | Control | Default |
|---|---|---|
| `Thời gian tạo đơn bảo hiểm` | RangePicker (2 inputs) | `2026-06-01` / `2026-06-08` |
| `Trạng thái đơn bảo hiểm` | Select | `Đã hoàn thành` |

Right-aligned actions on row 2: `Làm lại` (default button) · `Tìm kiếm` (primary button).

### Summary bar
- `Tổng số đơn : 721,084`
- `Tổng phí bảo hiểm : 1.442.168.000 đ`
- Right: `Xuất danh sách đơn bảo hiểm CSV` (export icon) + 3 icon-only buttons: reload, row-height, settings (gear).

### Table columns
| Header | Cell contents (stacked, bold label + value) |
|---|---|
| `STT` | row number |
| `Thông tin chuyến đi` | `ID chuyến đi: <code>` · `Phí bảo hiểm: <amount> đ` · `Biển số xe: <plate>` |
| `Thông tin khách hàng` | `Tên người đặt: <name>` · `SĐT người đặt: <phone>` · `Tên người đi: <name>` · `SĐT người đi: <phone>` |
| `Thời gian và địa điểm` | `Thời gian bắt đầu: <dt>` · `Thời gian kết thúc: <dt>` · `Địa chỉ đi: <addr>` · `Địa chỉ đến: <addr>` |
| `Trạng thái đơn bảo hiểm` | colored Tag, e.g. green `Hoàn thành` |
| `Hành động` | blue icon button (eye / view) |

---

## 5. Data Model

```ts
type PolicyStatus = 'hoan-thanh' | 'hieu-luc' | 'het-hieu-luc' | 'da-huy'

interface PolicyRow {
  id: string
  tripId: string          // ID chuyến đi
  premium: number         // Phí bảo hiểm (đ)
  plate: string           // Biển số xe
  bookerName: string      // Tên người đặt
  bookerPhone: string     // SĐT người đặt
  riderName: string       // Tên người đi
  riderPhone: string      // SĐT người đi
  startAt: string         // Thời gian bắt đầu (ISO)
  endAt: string           // Thời gian kết thúc (ISO)
  fromAddress: string     // Địa chỉ đi
  toAddress: string       // Địa chỉ đến
  createdAt: string       // Thời gian tạo đơn (ISO) — for create-date filter
  status: PolicyStatus
}
```

- ~12 mock rows, values styled after the screenshot (Phú Quốc / Hà Giang / Thanh Hoá
  addresses, `01K5ZF…` trip IDs, `2.000 đ` premiums, `68H-077.46` plates, 01/06/2026 times).
- `headlineTotalOrders = 721084`, `headlineTotalPremium = 1442168000` — static constants
  rendered in the summary bar verbatim from the design.

---

## 6. Filter Behavior (functional, client-side)

`policies-filters.ts` exports a pure function:

```ts
interface PolicyFilters {
  phone: string
  tripId: string
  plate: string
  effectiveRange: [string, string] | null  // Thời gian bắt đầu hiệu lực
  createdRange: [string, string] | null     // Thời gian tạo đơn bảo hiểm
  status: PolicyStatus | null
}

function applyFilters(rows: PolicyRow[], f: PolicyFilters): PolicyRow[]
```

Matching rules:
- `phone` — substring match against `bookerPhone` OR `riderPhone`.
- `tripId` — case-insensitive substring of `tripId`.
- `plate` — case-insensitive substring of `plate`.
- `status` — exact match (null = all).
- `effectiveRange` — `startAt` within [from, to] inclusive.
- `createdRange` — `createdAt` within [from, to] inclusive.
- Empty / null filter fields are ignored.

### State flow (page-owned)
- `draftFilters` is bound to the AntD Form (live edits).
- `appliedFilters` drives `applyFilters`.
- `Tìm kiếm` → `appliedFilters = draftFilters`, reset pagination to page 1.
- `Làm lại` → reset both to defaults (status `Đã hoàn thành`, created range 2026-06-01..2026-06-08, others empty).
- `filteredRows = applyFilters(rows, appliedFilters)`.
- Table pager: `pageSize = 10`, `total = filteredRows.length` → page 1 shows 10 rows, page 2 the remainder. This is independent of the static headline `721,084`.

---

## 7. Styling Notes

- Reuse the white rounded card surface used across the app
  (`rounded-lg border border-gray-100 bg-white p-5 shadow-sm`, cf. `PanelCard`).
- Filter grid: AntD 24-col — row 1 four columns `Col xs={24} md={6}`; row 2 lays out the
  two range fields + select with the action buttons pushed right.
- Table cells stack lines with a small vertical gap; labels bold/gray, values darker.
- Status Tag colors: `Hoàn thành` → green (success). Other statuses get distinct AntD tag
  colors (see mock-assumption #1).
- Primary color from theme is `#4f46e5` (indigo) — `Tìm kiếm` and the action button use it.

---

## 8. Routing & Navigation

- New route path: `/don-bao-hiem/tai-nan-hanh-khach-theo-chuyen` → `PoliciesListPage`.
- Sibling submenu items route to the existing `PlaceholderPage` (consistent with current
  app behavior) so the `Đơn bảo hiểm` menu matches the screenshot without dead clicks.
- `SidebarNav` marks the target item active when on its route; parent `Đơn bảo hiểm`
  opens by default on these routes.

---

## 9. Mock Assumptions (flagged — rule #8)

1. **Status options beyond `Hoàn thành`.** Only `Hoàn thành` / `Đã hoàn thành` is visible
   in the design. To make the filter dropdown functional, the spec adds placeholder
   statuses `Hiệu lực`, `Hết hiệu lực`, `Đã hủy`. These are mock-only and should be
   confirmed/replaced with the real status set.
2. **Headline vs. table totals.** `721,084` / `1.442.168.000 đ` are shown as static design
   constants (server-side totals) while the table pager counts actual mock rows. Accepted
   as an intentional fidelity-vs-coherence tradeoff.

---

## 10. Out of Scope

- No API, no mock API layer, no data fetching.
- No automated tests (the pure `applyFilters` is the natural unit-test seam if added later).
- Sibling product pages (Bảo hiểm hàng hoá, etc.) remain placeholders.
- CSV export, reload, row-height, and settings icon buttons are visual only (no-op).
