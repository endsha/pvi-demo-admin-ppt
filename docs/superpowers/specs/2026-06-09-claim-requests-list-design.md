# Claim Requests List — Design Spec

**Date:** 2026-06-09
**Page:** Yêu cầu bồi thường / Bảo hiểm tích lũy tài xế (Claim Requests for driver-savings)
**Source design:** `docs/ui/claim-requests-list.png`
**Scope:** UI + mock data only. No API, no data fetching, no real CSV export.

---

## 1. Overview

A list page for claim requests ("Yêu cầu bồi thường") tied to the driver-savings
("Bảo hiểm tích lũy tài xế") product. It mirrors the established list-page pattern
already used by `src/pages/driver-savings/` (page shell + filters bar + summary/toolbar
+ AntD table + status badge + in-memory mock data and filtering).

The page is reached from the **Yêu cầu bồi thường** sidebar group, which currently has
no children.

## 2. File structure

New feature folder `src/pages/claim-requests/`:

```
claim-requests/
├── ClaimRequestsListPage.tsx          # page shell: breadcrumb, title, filters, toolbar, table
├── claim-requests-filters.ts          # filter types, DEFAULT_FILTERS, applyFilters()
├── mock-data.ts                        # row type, STATUS_CONFIG, source/sort options, rows, formatters
└── components/
    ├── ClaimRequestsFilters.tsx        # the filter form bar
    ├── ClaimRequestsToolbar.tsx        # "Danh sách Yêu cầu bồi thường" + Thêm mới / Xuất CSV / icon buttons
    ├── ClaimRequestsTable.tsx          # the AntD table with multi-field cells
    └── ClaimRequestStatusBadge.tsx     # status Tag
```

Rationale: each file stays small and single-purpose, matching `driver-savings`. Non-component
exports (constants, options, formatters) live in `mock-data.ts` / `claim-requests-filters.ts`
so component files only export components (satisfies `react-refresh/only-export-components`).

## 3. Data model

```ts
export type ClaimRequestStatus = 'ho-so-chua-tao' | /* placeholders */ ...

export interface ClaimRequestRow {
  id: string
  source: string | null            // Nguồn tiếp nhận — null renders as "-"
  requestedAt: string              // Ngày yêu cầu bồi thường (ISO)
  lossNoticeNumber: string         // Số thông báo tổn thất (e.g. 26TT000819)
  // Thông tin khách hàng
  driverCode: string               // Mã tài xế
  masterPolicyNumber: string       // Số HĐNT (e.g. 25/PC-GSM/10819478)
  customerName: string             // Tên
  phone: string                    // Số điện thoại
  // Thông tin về tai nạn
  accidentDate: string             // Ngày xảy ra tai nạn (ISO date)
  accidentPlace: string            // Nơi xảy ra tai nạn
  accidentConsequence: string      // Hậu quả tai nạn
  claimAmount: number              // Số tiền yêu cầu chi trả (đ)
  status: ClaimRequestStatus
}
```

Formatters in `mock-data.ts`:
- `formatDateTime(iso)` → `dd/mm/yyyy hh:mm` (reuse the driver-savings implementation).
- `formatDate(iso)` → `dd/mm/yyyy` (accident date has no time in the design).
- `formatAmount(n)` → `n.toLocaleString('vi-VN')` then ` đ` suffix → `1.725.000 đ`.

~12 mock rows seeded from the values visible in the design (driver codes, loss-notice
numbers, amounts, accident text), all with status `Hồ sơ chưa tạo` plus a couple of rows
using placeholder statuses so the filter is demonstrable.

## 4. Status config (assumptions)

Only **Hồ sơ chưa tạo** (orange) is confirmed from the design. Per user decision
("Precedent + placeholders"), add a few placeholder statuses so the filter functions,
with a code comment marking them as assumptions:

```ts
export const STATUS_CONFIG: Record<ClaimRequestStatus, { selectLabel; tagLabel; color }> = {
  'ho-so-chua-tao': { selectLabel: 'Hồ sơ chưa tạo', tagLabel: 'Hồ sơ chưa tạo', color: 'orange' },
  // --- placeholders (not confirmed from design) ---
  'da-tao-ho-so':   { selectLabel: 'Đã tạo hồ sơ',   tagLabel: 'Đã tạo hồ sơ',   color: 'blue' },
  'dang-xu-ly':     { selectLabel: 'Đang xử lý',      tagLabel: 'Đang xử lý',      color: 'gold' },
  'hoan-thanh':     { selectLabel: 'Hoàn thành',      tagLabel: 'Hoàn thành',      color: 'green' },
  'tu-choi':        { selectLabel: 'Từ chối',         tagLabel: 'Từ chối',         color: 'red' },
}
```

`statusOptions` derived from `STATUS_CONFIG` keys.

## 5. Filters bar (`ClaimRequestsFilters.tsx`)

AntD `Form` (`layout="vertical"`), white rounded card, two `Row`s. Field labels and
placeholders copied verbatim from the design.

Row 1 (`gutter={16}`):
- **Tìm kiếm** — `Col md={6}`. `Input` with `allowClear`, placeholder `Nhập từ khoá tìm kiếm`.
  Label has an info icon (`<InfoCircleOutlined />` inside a `Tooltip`) — the ⓘ in the design.
- **Sắp xếp theo** — `Col md={6}`. `Select`, default value `Xếp theo mới nhất`.
  Options: `Xếp theo mới nhất`, `Xếp theo cũ nhất` (sort by `requestedAt`).
- **Ngày yêu cầu bồi thường** — `Col md={6}`. `RangePicker`, placeholder `['Từ ngày','Đến ngày']`.
- **Nguồn tiếp nhận** — `Col md={6}`. `Select` `allowClear`, placeholder `Vui lòng chọn`.
  Placeholder options (assumptions): e.g. `App tài xế`, `Tổng đài`, `Email`.

Row 2 (`align="bottom"`):
- **Tình trạng yêu cầu bồi thường** — `Col md={6}`. `Select` `allowClear`,
  placeholder `Vui lòng chọn`, options = `statusOptions`.
- Spacer + **Làm lại** (default button) / **Tìm kiếm** (primary) right-aligned.

Filter state shape and `applyFilters` live in `claim-requests-filters.ts`.

## 6. Filtering logic (`claim-requests-filters.ts`)

```ts
export interface ClaimRequestFilters {
  keyword: string                       // matches driverCode | customerName | phone | lossNoticeNumber
  sort: 'newest' | 'oldest'             // by requestedAt
  requestedRange: [string, string] | null
  source: string | null
  status: ClaimRequestStatus | null
}
```

`DEFAULT_FILTERS` → empty keyword, `sort: 'newest'`, null ranges/source/status.
`applyFilters(rows, filters)`:
1. keyword: case-insensitive substring over the four customer/notice fields.
2. requestedRange: `requestedAt` date within inclusive range.
3. source / status: equality when set.
4. sort: by `requestedAt` ascending/descending.

Pure function, returns a new array (no mutation).

## 7. Toolbar (`ClaimRequestsToolbar.tsx`)

Row inside a white card, space-between:
- Left: heading **Danh sách Yêu cầu bồi thường**.
- Right (in order):
  - **+ Thêm mới** — primary `Button`, `PlusOutlined`. Navigates to placeholder route
    `/yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe/them-moi`.
  - **Xuất danh sách yêu cầu bồi thường CSV** — default `Button` with export icon. No-op
    (UI only; no real export).
  - Three icon `Button`s: refresh, columns, settings — decorative no-ops matching the design.

## 8. Table (`ClaimRequestsTable.tsx`)

AntD `Table`, `rowKey="id"`, `scroll={{ x: 'max-content' }}`, pagination
`pageSize: 10`, `showSizeChanger: false`. White rounded card wrapper. A small
`Field` helper renders `label: value` lines inside multi-field cells (same as
driver-savings).

Columns (order and headers verbatim from design):

| # | Header | Render |
|---|--------|--------|
| 1 | STT | `(page-1)*PAGE_SIZE + index + 1` |
| 2 | Nguồn tiếp nhận | `row.source ?? '-'` |
| 3 | Ngày yêu cầu bồi thường | `formatDateTime(requestedAt)` |
| 4 | Số thông báo tổn thất | `lossNoticeNumber` |
| 5 | Thông tin khách hàng | Fields: Mã tài xế / Số HĐNT / Tên / Số điện thoại |
| 6 | Thông tin về tai nạn | Fields: Ngày xảy ra tai nạn / Nơi xảy ra tai nạn / Hậu quả tai nạn |
| 7 | Số tiền yêu cầu chi trả | `formatAmount(claimAmount)` |
| 8 | Tình trạng yêu cầu bồi thường | `<ClaimRequestStatusBadge status={status} />` |
| 9 | Liên kết | `Xem giấy YCBT` link → placeholder route `…/:id/giay-ycbt` |
| 10 | Hành động | blue edit icon `Button` → placeholder route `…/:id/cap-nhat` |

Field label text is copied exactly from the design including the `:` separator and spacing.

## 9. Status badge (`ClaimRequestStatusBadge.tsx`)

`Tag` colored per `STATUS_CONFIG[status].color`, text `STATUS_CONFIG[status].tagLabel`.
Orange `Hồ sơ chưa tạo` matches the design.

## 10. Page shell (`ClaimRequestsListPage.tsx`)

```
<div className="flex flex-col gap-4">
  <Breadcrumb items={[{title:'Yêu cầu bồi thường'}, {title:'Bảo hiểm tích lũy tài xế'}]} />
  <h1>Bảo hiểm tích lũy tài xế</h1>
  <ClaimRequestsFilters onSearch={...} onReset={...} />
  <ClaimRequestsToolbar onAdd={...} />
  <ClaimRequestsTable rows={filteredRows} page={page} onPageChange={setPage} />
</div>
```

`useState` for `appliedFilters` (default `DEFAULT_FILTERS`) and `page`. `filteredRows`
via `useMemo(applyFilters(...))`. Search/reset set filters and reset page to 1. Navigation
handlers use `useNavigate`.

## 11. Routing & navigation

`src/app/router.tsx` — add under `AdminLayout` children:
- `yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe` → `ClaimRequestsListPage`
- `yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe/them-moi` → `PlaceholderPage title="Thêm mới Yêu cầu bồi thường"`
- `yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe/:id/cap-nhat` → `PlaceholderPage title="Cập nhật Yêu cầu bồi thường"`
- `yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe/:id/giay-ycbt` → `PlaceholderPage title="Giấy yêu cầu bồi thường"`

`src/layouts/AdminLayout/SidebarNav.tsx` — give the existing `yeu-cau-boi-thuong` group a child:
```ts
{ key: 'yeu-cau-boi-thuong', icon: <SolutionOutlined />, label: 'Yêu cầu bồi thường', children: [
  { key: '/yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe', label: 'Bảo hiểm tích lũy tài xế' },
] },
```
Add `yeu-cau-boi-thuong` to `defaultOpenKeys`.

## 12. Out of scope / explicit non-goals

- No API calls, no `fetch`, no adapters — mock data only.
- CSV export, refresh, and column/settings toolbar icons are non-functional.
- Status values beyond `Hồ sơ chưa tạo` and all `Nguồn tiếp nhận` options are placeholders
  (commented as assumptions), to be replaced when BE/business confirms.
- Target pages for Thêm mới / Cập nhật / Giấy YCBT are placeholders, not built here.

## 13. Conventions followed

- AntD 6 + Tailwind 4, file size < 800 lines, immutable filter logic.
- Component files export only components; constants/options/formatters in `*-filters.ts` / `mock-data.ts`.
- Verbatim Vietnamese labels per `docs/rules/ui-ux-strict.md`.
- Mirrors `src/pages/driver-savings/` structure for consistency.
