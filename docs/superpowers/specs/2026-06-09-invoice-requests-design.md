# Yêu cầu hoá đơn (Invoice Request) — UI Design Spec

**Date:** 2026-06-09
**Scope:** Mock-data UI only. No API, no API stub. Client-side filtering/sort on mock rows.
**Reference design:** `docs/ui/invoice-request.png`
**Pattern source:** mirrors the existing `src/pages/policies/` and `src/pages/reports/` features (same AntD v6 + Tailwind v4 house style).

---

## 1. Goal

Build the **Yêu cầu hoá đơn** (invoice request) list page — a read-only data table of
invoice requests with a two-field filter bar and a panel toolbar. All data is mock;
the keyword search and sort actually filter the mock rows client-side; the table
paginates. There are no row actions, status badges, switches, or add button in the
design, so none are built.

Decisions confirmed with the user:
- **Direct leaf page** — the sidebar `Yêu cầu hoá đơn` item becomes a direct link to
  the new page (route `/yeu-cau-hoa-don`), matching the design's active state with no
  submenu. (Currently it is an empty expandable parent.)
- **Filters work + table paginates** — `Tìm kiếm` (keyword) and `Sắp xếp theo` filter
  and sort the mock rows; table paginates 10/page; toolbar icons are visual-only.
- Breadcrumb is a **single crumb** `Yêu cầu hoá đơn` (top-level page).
- `Ngày tạo yêu cầu` renders as **date only** (`dd/mm/yyyy`).

---

## 2. File structure

```
src/pages/invoice-requests/
├── InvoiceRequestsListPage.tsx   // breadcrumb + title; owns appliedFilters + page; composes sections
├── mock-data.ts                  // InvoiceRequestRow type, sortOptions, mock rows, formatters
├── invoice-filters.ts            // InvoiceFilters type, DEFAULT_FILTERS, pure applyFilters()
└── components/
    ├── InvoiceFilters.tsx        // label-above bar: Tìm kiếm + Sắp xếp theo + Làm lại/Tìm kiếm
    ├── InvoiceToolbar.tsx        // "Danh sách Yêu cầu hóa đơn" + reload/column-height/settings icons
    └── InvoiceTable.tsx          // AntD Table: 12 columns, stacked Thời hạn cell, pagination
```
Routing/sidebar edits: `src/app/router.tsx`, `src/layouts/AdminLayout/SidebarNav.tsx`.

---

## 3. Data model (`mock-data.ts`)

```ts
export interface InvoiceRequestRow {
  id: string
  contractNo: string   // Số hợp đồng bảo hiểm (may be "-")
  holderName: string   // Tên chủ hợp đồng
  phone: string        // Số điện thoại (may be "-")
  receiverName: string // Tên người nhận
  partner: string      // Đối tác
  product: string      // Sản phẩm
  createdAt: string    // Ngày tạo yêu cầu (ISO; rendered dd/mm/yyyy)
  coverageFrom: string // Thời hạn bảo hiểm — Từ (ISO; rendered dd/mm/yyyy HH:mm)
  coverageTo: string   // Thời hạn bảo hiểm — Đến (ISO; rendered dd/mm/yyyy HH:mm)
  email: string        // Email người nhận
  taxCode: string      // Mã số thuế
  address: string      // Địa chỉ người nhận
}
```

- `sortOptions`: `Xếp theo mới nhất` (value `moi-nhat`, default) + `Xếp theo cũ nhất`
  (value `cu-nhat`).
- Formatters:
  - `formatDate(iso)` → `dd/mm/yyyy` (for Ngày tạo yêu cầu).
  - `formatDateTime(iso)` → `dd/mm/yyyy HH:mm` (for Thời hạn Từ/Đến).
- `invoiceRows: InvoiceRequestRow[]` — ~13 mock rows mirroring the design's shape:
  varied partners (`PVI Plus`, `VNPOS T`, `RABBIT CARE`), products (`Bảo hiểm Du lịch
  quốc tế`, `Bảo hiểm Cháy và các loại rủi ro đặc biệt cho hộ kinh doanh`), some rows
  with `-` for `contractNo` and/or `phone`, distinct `createdAt` so sorting is visible.

Mock assumptions are documented inline in `mock-data.ts` the same way
`policies/mock-data.ts` and `reports/mock-data.ts` flag theirs.

---

## 4. Filter bar (`InvoiceFilters.tsx`)

**Label-above** vertical layout inside the white rounded card
(`rounded-lg border border-gray-100 bg-white shadow-sm`) — same style as
`PolicyFilters` (this differs from reports' inline-colon labels; match the screenshot).

- `Tìm kiếm` — `Input`, placeholder `Nhập từ khoá tìm kiếm`, `allowClear`
- `Sắp xếp theo` — `Select`, default `Xếp theo mới nhất`, options = `sortOptions`
- Right cluster: `Làm lại` (default `Button`) · `Tìm kiếm` (primary `Button`)

Exact strings (copy verbatim — see `docs/rules/ui-ux-strict.md` §3):
`Tìm kiếm`, `Nhập từ khoá tìm kiếm`, `Sắp xếp theo`, `Xếp theo mới nhất`, `Làm lại`,
`Tìm kiếm`. `onSearch(filters)` / `onReset()` lift state to the page (same shape as
`PolicyFilters` / `ReportFilters`).

---

## 5. Toolbar (`InvoiceToolbar.tsx`)

Panel header strip (white rounded card). Left: heading `Danh sách Yêu cầu hóa đơn`.
Right: reload (`ReloadOutlined`), column-height (`ColumnHeightOutlined`), settings gear
(`SettingOutlined`) — icon buttons with tooltips, visual-only. **No add button, no
totals/summary line** (the design has none).

---

## 6. Table (`InvoiceTable.tsx`)

AntD `Table<InvoiceRequestRow>`, `rowKey="id"`, white rounded card wrapper,
`scroll={{ x: 'max-content' }}`, page size **10**, `showSizeChanger: false`.
No `rowSelection`, no action column.

Columns, exact order and (wrapped) headers:

| # | Header | Render |
|---|--------|--------|
| 1 | `STT` | `(page-1)*10 + index + 1`, width 60 |
| 2 | `Số hợp đồng bảo hiểm` | `row.contractNo` |
| 3 | `Tên chủ hợp đồng` | `row.holderName` |
| 4 | `Số điện thoại` | `row.phone` |
| 5 | `Tên người nhận` | `row.receiverName` |
| 6 | `Đối tác` | `row.partner` |
| 7 | `Sản phẩm` | `row.product` |
| 8 | `Ngày tạo yêu cầu` | `formatDate(row.createdAt)` |
| 9 | `Thời hạn bảo hiểm` | stacked: `Từ: {formatDateTime(coverageFrom)}` / `Đến: {formatDateTime(coverageTo)}` |
| 10 | `Email người nhận` | `row.email` |
| 11 | `Mã số thuế` | `row.taxCode` |
| 12 | `Địa chỉ người nhận` | `row.address` |

The `Thời hạn bảo hiểm` cell uses a small stacked render (two lines, label muted +
value), same idiom as `PolicyTable`'s `Field`. Long text columns wrap naturally; `-`
is shown verbatim where the mock value is `-`. Default AntD `Empty` is used if a filter
yields no rows (the design shows no custom empty state).

---

## 7. Filtering (`invoice-filters.ts`)

Pure, client-side, mirroring `reports-filters.ts`:

```ts
export interface InvoiceFilters {
  keyword: string                  // Tìm kiếm — contractNo + holderName + receiverName + phone + taxCode
  sort: 'moi-nhat' | 'cu-nhat'
}

export const DEFAULT_FILTERS: InvoiceFilters = { keyword: '', sort: 'moi-nhat' }

export function applyFilters(rows: InvoiceRequestRow[], f: InvoiceFilters): InvoiceRequestRow[]
```

`applyFilters` filters by case-insensitive keyword across the five fields, then sorts by
`createdAt` (`moi-nhat` = newest first / descending, `cu-nhat` = oldest first). Returns a
new array (immutable).

---

## 8. Page shell (`InvoiceRequestsListPage.tsx`)

Same composition as `PoliciesListPage` / `ReportsListPage`:
- `Breadcrumb`: single crumb `Yêu cầu hoá đơn`
- `<h1>`: `Yêu cầu hoá đơn`
- `<InvoiceFilters onSearch onReset />`
- `<InvoiceToolbar />`
- `<InvoiceTable rows page onPageChange ... />`
- Holds `appliedFilters` + `page`; derives `filteredRows` via `useMemo(applyFilters)`.
  `handleSearch` resets to page 1; `handleReset` restores `DEFAULT_FILTERS`.

---

## 9. Sidebar + routing

The design shows `Yêu cầu hoá đơn` as the active top-level page (no submenu). The current
`SidebarNav` item is `{ key: 'yeu-cau-hoa-don', icon: <FileDoneOutlined />, label: 'Yêu cầu hoá đơn', children: [] }`.

`SidebarNav.tsx` — replace that item with a leaf:
```ts
  { key: '/yeu-cau-hoa-don', icon: <FileDoneOutlined />, label: 'Yêu cầu hoá đơn' },
```
The existing `onClick` already navigates for keys starting with `/`, and
`selectedKeys={[pathname]}` highlights it — no further change.

`router.tsx` — add a route (the page currently has none):
```ts
  { path: 'yeu-cau-hoa-don', element: <InvoiceRequestsListPage /> },
```

---

## 10. Conventions / guardrails

- AntD v6 + Tailwind v4 utilities, `react-router` v7 — reuse existing patterns.
- Match `ui-ux-strict.md`: copy Vietnamese strings exactly; do not invent columns,
  filters, actions, or sections beyond what is specified here.
- Keep files focused (<800 lines); split per component as listed.
- No API URLs touched (this feature has no endpoint).
- Non-component exports (sort options, mock rows, formatters) live in `mock-data.ts` /
  `invoice-filters.ts`, never colocated with a component — satisfies
  `react-refresh/only-export-components`.

---

## 11. Out of scope

- Real CRUD, persistence, or any network call.
- Row actions, status, selection, add/create flow (none in the design).
- Column-settings / row-height behavior behind the toolbar icons.
- Any change to the other sidebar items.
