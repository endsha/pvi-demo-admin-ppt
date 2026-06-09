# Quản lý báo cáo (Reports Management) — UI Design Spec

**Date:** 2026-06-09
**Scope:** Mock-data UI only. No API, no API stub. Client-side filtering on mock rows.
**Reference design:** `docs/ui/reports-management.png`
**Pattern source:** mirrors the existing `src/pages/policies/` feature (same AntD + Tailwind house style).

---

## 1. Goal

Build the **Quản lý báo cáo** page under **Báo cáo Power BI** — a Power BI report
management list with an inline filter bar (plus an expandable advanced section), a
panel toolbar, and a data table with row selection, a status badge column, an
enable/disable switch column, and row actions. All data is mock; filters work
client-side; actions and switches are visual / local-state only.

Decisions confirmed with the user:
- Table is **populated with mock rows** (~14) so pagination + both status columns
  are demonstrable. The empty `Trống` state still shows when a filter matches nothing.
- The two `Trạng thái` columns render as **badge (mid) + Switch toggle (right-fixed)**.
- `Mở rộng` **reveals a second row of advanced filters** (toggle, collapsed by default).
- Filters **actually filter** the mock rows; row actions, `+ Thêm báo cáo`, toolbar
  icons, and switches are **visual / no-op** (switch keeps local state).

---

## 2. File structure

```
src/pages/reports/
├── ReportsListPage.tsx          # page shell: breadcrumb, title, compose children
├── mock-data.ts                 # ReportRow type, mock rows, option lists, status config, formatters
├── reports-filters.ts           # ReportFilters type + DEFAULT_FILTERS + pure applyFilters()
└── components/
    ├── ReportFilters.tsx        # inline filter bar + "Mở rộng" advanced reveal
    ├── ReportToolbar.tsx        # panel header + "Thêm báo cáo" + icon buttons
    ├── ReportTable.tsx          # AntD Table: columns, rowSelection, pagination, empty state
    └── ReportStatusBadge.tsx    # colored Tag for the mid-table "Trạng thái"
```

Routing/sidebar edits: `src/app/router.tsx`, `src/layouts/AdminLayout/SidebarNav.tsx`.

---

## 3. Data model (`mock-data.ts`)

```ts
export type ReportStatus = 'hoat-dong' | 'tam-dung'
export type ReportAccess = 'cong-khai' | 'noi-bo' | 'rieng-tu'

export interface ReportRow {
  id: string
  title: string          // Tiêu đề
  reportType: string      // Loại báo cáo
  partnerCode: string     // Mã đối tác
  productCode: string     // Mã sản phẩm
  order: number           // Thứ tự
  access: ReportAccess    // Quyền truy cập
  status: ReportStatus    // mid "Trạng thái" → badge
  enabled: boolean        // right-fixed "Trạng thái" → Switch
}
```

- `STATUS_CONFIG: Record<ReportStatus, { label: string; color: string }>`
  - `hoat-dong` → `{ label: 'Hoạt động', color: 'green' }`
  - `tam-dung`  → `{ label: 'Tạm dừng', color: 'default' }`
- `ACCESS_CONFIG: Record<ReportAccess, { label: string }>`
  - `cong-khai` → `Công khai`, `noi-bo` → `Nội bộ`, `rieng-tu` → `Riêng tư`
- `statusOptions` / `accessOptions` derived from the configs for the Select fields.
- `reportTypeOptions`: a small fixed list (e.g. `Doanh thu`, `Bồi thường`, `Tổng hợp`,
  `Vận hành`) — mock assumption, not pinned by the screenshot.
- `sortOptions`: `Xếp theo mới nhất` (default) + `Xếp theo cũ nhất`.
- `reportRows: ReportRow[]` — ~14 mock rows spanning both statuses, all access levels,
  varied types/codes, sequential `order`.

Mock assumptions (not visible in the empty-table screenshot) are documented inline in
`mock-data.ts` the same way `policies/mock-data.ts` flags its placeholders.

---

## 4. Filter bar (`ReportFilters.tsx`)

Inline single-row layout — label-left with a colon (this differs from the policies
vertical-card filter; match the screenshot). Wrapped in the same white rounded card
shell (`rounded-lg border border-gray-100 bg-white shadow-sm`).

**Primary row:**
- `Tìm kiếm :` — `Input`, placeholder `Nhập từ khoá tìm kiếm`, `allowClear`
- `Sắp xếp theo :` — `Select`, default `Xếp theo mới nhất`, options = `sortOptions`
- `Tiêu đề :` — `Input`, placeholder `nhập dữ liệu`, `allowClear`
- Right cluster: `Làm lại` (default button) · `Tìm kiếm` (primary) · `Mở rộng ⌄`
  (link-style button; chevron flips when expanded)

**Advanced row (revealed by `Mở rộng`):**
- Local `expanded` boolean state, **collapsed by default**; `{expanded && <AdvancedRow/>}`.
- Fields (mock, confirmed with user): `Loại báo cáo` (Select, `reportTypeOptions`),
  `Mã đối tác` (Input), `Trạng thái` (Select, `statusOptions`). All `allowClear`.
- `Mở rộng` label toggles to `Thu gọn` when expanded (chevron rotates).

Exact Vietnamese strings (copy verbatim — see `ui-ux-strict.md` §3):
`Tìm kiếm`, `Nhập từ khoá tìm kiếm`, `Sắp xếp theo`, `Xếp theo mới nhất`,
`Tiêu đề`, `nhập dữ liệu`, `Làm lại`, `Tìm kiếm`, `Mở rộng`.

`onSearch(filters)` / `onReset()` callbacks lift state to the page, identical in shape
to `PolicyFilters`.

---

## 5. Toolbar (`ReportToolbar.tsx`)

Panel header strip (white rounded card). Left: heading `Quản lý báo cáo Power BI`.
Right cluster:
- `+ Thêm báo cáo` — primary `Button`, no-op
- reload icon (`ReloadOutlined`), column-height (`ColumnHeightOutlined`),
  settings gear (`SettingOutlined`) — icon buttons with tooltips, visual-only
  (same treatment as `PolicySummaryBar`).

---

## 6. Table (`ReportTable.tsx`)

AntD `Table<ReportRow>`, `rowKey="id"`, wrapped in white rounded card,
`scroll={{ x: 'max-content' }}`, page size **10**, `showSizeChanger: false`.

**`rowSelection`** enabled (leading checkbox column) — selection held in local state.

Columns, exact order and headers:

| # | Header | Render |
|---|--------|--------|
| — | (checkbox) | AntD `rowSelection` |
| 1 | `STT` | `(page-1)*10 + index + 1`, width 60 |
| 2 | `Tiêu đề` | `row.title` |
| 3 | `Loại báo cáo` | `row.reportType` |
| 4 | `Mã đối tác` | `row.partnerCode` |
| 5 | `Mã sản phẩm` | `row.productCode` |
| 6 | `Thứ tự` | `row.order` |
| 7 | `Quyền truy cập` | `ACCESS_CONFIG[row.access].label` |
| 8 | `Trạng thái` | `<ReportStatusBadge status={row.status} />` |
| 9 | `Trạng thái` | `<Switch>` bound to local `enabled` state, **fixed: 'right'** |
| 10 | `Hành động` | view (`EyeOutlined`) + edit (`EditOutlined`) + delete (`DeleteOutlined`) icon buttons, no-op, **fixed: 'right'** |

**Empty state:** when filtered rows are empty, AntD's default `Empty` renders the
inbox icon + text. Set the empty text to `Trống` to match the screenshot.

**Switch state:** the page (or table) holds an `enabledMap`/local row copy so toggles
persist within the session; no network call.

`ReportStatusBadge.tsx`: AntD `Tag` with `STATUS_CONFIG` color + label, pill radius —
identical structure to `PolicyStatusBadge`.

---

## 7. Filtering (`reports-filters.ts`)

Pure, client-side, mirroring `policies-filters.ts`:

```ts
export interface ReportFilters {
  keyword: string        // Tìm kiếm — matches title + partnerCode + productCode (case-insensitive)
  title: string          // Tiêu đề — substring match on title
  sort: 'moi-nhat' | 'cu-nhat'
  reportType: string | null   // advanced
  partnerCode: string         // advanced
  status: ReportStatus | null // advanced
}

export const DEFAULT_FILTERS: ReportFilters = {
  keyword: '', title: '', sort: 'moi-nhat',
  reportType: null, partnerCode: '', status: null,
}

export function applyFilters(rows: ReportRow[], f: ReportFilters): ReportRow[]
```

`applyFilters` filters then sorts (`moi-nhat` = descending `order`,
`cu-nhat` = ascending `order`). Returns a new array (immutable).

---

## 8. Page shell (`ReportsListPage.tsx`)

Same composition as `PoliciesListPage`:
- `Breadcrumb`: `Báo cáo Power BI` / `Quản lý báo cáo`
- `<h1>`: `Quản lý báo cáo`
- `<ReportFilters onSearch onReset />`
- `<ReportToolbar />`
- `<ReportTable rows page onPageChange ... />`
- Holds `appliedFilters`, `page`, derives `filteredRows` via `useMemo(applyFilters)`.
  `handleSearch` resets to page 1; `handleReset` restores `DEFAULT_FILTERS`.

---

## 9. Sidebar + routing

The design shows **Báo cáo Power BI** expanded into a submenu. Convert the current
leaf nav item into a parent with three children.

`SidebarNav.tsx` — replace
`{ key: '/bao-cao-power-bi', ... label: 'Báo cáo Power BI' }` with:
```ts
{
  key: 'bao-cao-power-bi', icon: <BarChartOutlined />, label: 'Báo cáo Power BI',
  children: [
    { key: '/bao-cao-power-bi/quan-ly-bao-cao', label: 'Quản lý báo cáo' },
    { key: '/bao-cao-power-bi/bao-cao-cong-khai', label: 'Báo cáo công khai' },
    { key: '/bao-cao-power-bi/bao-cao-doanh-thu', label: 'Báo cáo doanh thu' },
  ],
}
```

`router.tsx` — replace the single `bao-cao-power-bi` placeholder route with:
- `/bao-cao-power-bi/quan-ly-bao-cao` → `<ReportsListPage />`
- `/bao-cao-power-bi/bao-cao-cong-khai` → `<PlaceholderPage title="Báo cáo công khai" />`
- `/bao-cao-power-bi/bao-cao-doanh-thu` → `<PlaceholderPage title="Báo cáo doanh thu" />`

---

## 10. Conventions / guardrails

- AntD v6 + Tailwind v4 utility classes, `react-router` v7 — reuse existing patterns.
- Match `ui-ux-strict.md`: copy Vietnamese strings exactly; do not invent columns or
  sections beyond what is specified here (advanced fields + action icons were
  explicitly confirmed with the user as mock assumptions).
- Keep files focused (<800 lines); split per component as listed.
- No API URLs touched (this feature has no endpoint).
- Non-component exports (configs, option lists, mock rows) live in `mock-data.ts` /
  `reports-filters.ts`, never colocated with a component — satisfies
  `react-refresh/only-export-components`.

---

## 11. Out of scope

- Real CRUD, persistence, or any network call.
- The `Báo cáo công khai` and `Báo cáo doanh thu` sub-pages (placeholders only).
- `Thêm báo cáo` create flow / modal.
- Column-settings / row-height behavior behind the toolbar icons.
