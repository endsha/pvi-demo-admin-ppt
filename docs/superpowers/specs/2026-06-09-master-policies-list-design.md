# Master Policies List — Bảo hiểm tích luỹ tài xế

**Date:** 2026-06-09
**Status:** Approved
**Scope:** UI + static mock data only. No API/query layer (per request: "Mock data and UI only, do not mock API").
**Design source:** `docs/ui/master-policies-list.png`
**Reference implementation:** `src/pages/driver-savings/` (closest sibling list page)

---

## 1. Goal

Implement the **master policies list** page ("Danh sách Hợp đồng nguyên tắc") for the
Driver Savings product, pixel/behavior-faithful to `docs/ui/master-policies-list.png`,
mirroring the structure and quality of the existing Driver Savings list page.

Out of scope: the master-policy **detail** page (exists in `docs/ui/master-policy-detail.png`
but is a separate task). All links/actions that would navigate to it are rendered but inert.

## 2. Placement & Routing

- Lives under the existing **"Hợp đồng nguyên tắc"** sidebar group (menu key `hop-dong`),
  which currently has empty `children`. Add one child:
  - label: `Bảo hiểm tích luỹ tài xế`
  - key/route: `/hop-dong-nguyen-tac/bao-hiem-tich-luy-tai-xe`
- Register route in `src/app/router.tsx` → `<MasterPoliciesListPage />`.
- Breadcrumb: `Hợp đồng nguyên tắc` / `Bảo hiểm tích luỹ tài xế`.
- Page `<h1>`: **Bảo hiểm tích luỹ tài xế** (spelling "luỹ" exactly as in the screenshot).

## 3. File Structure

Mirrors `src/pages/driver-savings/`. Static mock imported directly by components
(no TanStack Query / mock-api layer).

```
src/pages/master-policies/
├── MasterPoliciesListPage.tsx        — composes breadcrumb + filters + table; owns filter + page state
├── mock-data.ts                      — MasterPolicyRow type, mock rows, format + option helpers
├── master-policies-filters.ts        — MasterPoliciesFilters type, DEFAULT_FILTERS, applyFilters (+ sort)
└── components/
    ├── MasterPoliciesFilters.tsx     — 4-field filter card + Làm lại / Tìm kiếm buttons
    └── MasterPoliciesTable.tsx       — section-header toolbar + AntD table + pagination
```

Non-component exports (constants, defaults, helpers) stay out of component files
(in `mock-data.ts` / `master-policies-filters.ts`) to satisfy `react-refresh/only-export-components`.

## 4. Filter Card (wired client-side)

One row, 4 fields + right-aligned buttons. Filters apply on **Tìm kiếm** click
(apply-on-search, same as Driver Savings — not live-as-you-type).

| Label | Control | Behavior |
|---|---|---|
| `Tìm kiếm` (with ⓘ help icon) | `Input`, placeholder `Nhập từ khoá tìm kiếm` | keyword match across contract no. / driver code / customer name / phone |
| `Sắp xếp theo` | `Select`, default `Xếp theo mới nhất` | sort by effective start date; options: `Xếp theo mới nhất` (desc), `Xếp theo cũ nhất` (asc) |
| `Thời gian bắt đầu hiệu lực` | `RangePicker`, placeholders `Từ ngày` / `Đến ngày` | filter rows by effective start date within range |
| `Loại bảo hiểm` | `Select`, placeholder `Vui lòng chọn` | options derived from mock data package names (`Gói Xe máy PPT`, `Gói Taxi PPT`, …) |

Buttons: **Làm lại** (default — resets to `DEFAULT_FILTERS`) + **Tìm kiếm** (primary — applies current form values). Reset also returns page to 1.

`master-policies-filters.ts` exposes:
- `MasterPoliciesFilters` type: `{ keyword: string; sort: 'newest' | 'oldest'; effectiveRange: [string, string] | null; packageType: string | null }`
- `DEFAULT_FILTERS`
- `applyFilters(rows, filters)` — pure function returning filtered + sorted rows.

## 5. Table

Card with a header bar: **Danh sách Hợp đồng nguyên tắc** title on the left, 3 **inert**
toolbar icons on the right (reload / column-height / settings — decorative, matching the
screenshot). AntD `Table` keeps default column headers (titles above), consistent with the
Driver Savings table.

Columns (multi-line stacked cells via a shared `Field` label/value sub-component):

1. **STT** — `(page - 1) * PAGE_SIZE + index + 1`, width ~60
2. **Thông tin khách hàng**
   - `Số hợp đồng nguyên tắc` (e.g. `26/PM-GSM/034210`)
   - `Mã tài xế` (e.g. `5000142871`)
   - `Tên khách hàng` (e.g. `Nguyễn Thanh Phong`)
   - `SĐT` (e.g. `+84354619744`)
3. **Thông tin chương trình bảo hiểm**
   - `Tên gói` (e.g. `Gói Xe máy PPT`)
   - `Phí` (e.g. `100 đ`)
   - `Quyền lợi tối đa` (e.g. `300.000.000 đ`)
   - `Số tiền đã tích luỹ` (e.g. `125.000 đ`)
4. **Thời hạn hiệu lực**
   - `Ngày bắt đầu` (e.g. `08/06/2026 23:43:22`)
   - `Ngày kết thúc` (e.g. `08/06/2027 23:43:21`)
5. **Liên kết** — `Xem hợp đồng nguyên tắc` blue link, **inert** (no-op)
6. **Hành động** — blue primary icon button (zoom-in icon), **inert** (no-op)

Pagination: AntD pagination at bottom, `pageSize = 10`, `showSizeChanger: false`,
`scroll={{ x: 'max-content' }}` — same as Driver Savings table.

Date/time display includes seconds (`DD/MM/YYYY HH:mm:ss`) to match the screenshot
(`08/06/2026 23:43:22`). Note: Driver Savings' `formatDateTime` shows `HH:mm` only; this
page needs a seconds-precision formatter — add a local `formatDateTimeSeconds` in this
page's `mock-data.ts` rather than changing the shared one.

## 6. Mock Data

`mock-data.ts` exports:
- `MasterPolicyRow` interface:
  ```ts
  interface MasterPolicyRow {
    id: string
    contractNumber: string   // Số hợp đồng nguyên tắc
    driverCode: string       // Mã tài xế
    customerName: string     // Tên khách hàng
    phone: string            // SĐT
    packageName: string      // Tên gói + Loại bảo hiểm filter
    premium: number          // Phí (đ)
    maxBenefit: number       // Quyền lợi tối đa (đ)
    accumulated: number      // Số tiền đã tích luỹ (đ)
    effectiveStart: string   // Ngày bắt đầu (ISO)
    effectiveEnd: string     // Ngày kết thúc (ISO)
  }
  ```
- `masterPolicyRows`: ~12 rows mirroring screenshot values (contract numbers like
  `26/PM-GSM/034210`, `26/PC-GSM/067426`; packages `Gói Xe máy PPT` / `Gói Taxi PPT`;
  premiums `100`/`200`; `maxBenefit` `300.000.000`; varied accumulated amounts; effective
  start/end dates spanning a year).
- `packageTypeOptions` — derived from distinct `packageName` values, for the `Loại bảo hiểm` select.
- `sortOptions` — `Xếp theo mới nhất` / `Xếp theo cũ nhất`.
- VN number formatting (`toLocaleString('vi-VN')`) and `formatDateTimeSeconds`.

## 7. Component Contracts

- `MasterPoliciesListPage` — no props. Holds `appliedFilters` + `page` state; computes
  `applyFilters(masterPolicyRows, appliedFilters)` via `useMemo`. Handlers `handleSearch`
  (set filters + reset page to 1) and `handleReset`.
- `MasterPoliciesFilters` — props `{ onSearch: (f) => void; onReset: () => void }`. Owns its
  own AntD `Form`; converts `RangePicker` dayjs values to ISO date strings on search.
- `MasterPoliciesTable` — props `{ rows: MasterPolicyRow[]; page: number; onPageChange: (p) => void }`.

## 8. Styling

Tailwind utility classes + AntD components, matching Driver Savings:
- Cards: `rounded-lg border border-gray-100 bg-white p-5 shadow-sm` (filter) /
  `... p-2 ...` (table).
- `Field`: `font-medium text-gray-500` label + `text-gray-800` value, `leading-5`.
- Header title: `text-xl font-semibold text-gray-800`.

## 9. Assumptions

1. **Column headers present** — the screenshot crops landed on data rows so a grey
   column-header row could not be 100% confirmed. Keeping AntD default headers (titles above),
   consistent with the sibling Driver Savings table. If the real design hides headers, that is
   a one-line change.
2. **Sort options** — only `Xếp theo mới nhất` is visible in the screenshot. Added
   `Xếp theo cũ nhất` so the select is functional. No other sort dimensions invented.
3. **Toolbar icons** (reload / column-height / settings) are decorative/inert — they appear in
   the screenshot but have no defined behavior; rendered to match, wired to nothing.
4. **Links/actions inert** — `Xem hợp đồng nguyên tắc` and the row action button render per
   design but perform no navigation (detail page out of scope).

## 10. Out of Scope

- Master-policy detail page.
- Real API / TanStack Query integration.
- Any change to shared components or the shared `formatDateTime` helper.
