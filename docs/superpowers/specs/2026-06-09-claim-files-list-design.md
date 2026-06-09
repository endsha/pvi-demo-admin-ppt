# Claim Files List — Design Spec

**Date:** 2026-06-09
**Page:** Hồ sơ bồi thường — Bảo hiểm tích lũy tài xế (Claim Files List)
**Source design:** `docs/ui/claim-files-list.png`
**Scope:** Mock data + UI only. No API, no mock-API interceptor.

---

## 1. Goal

Add a read-only "Claim Files List" page that displays settled claim-file (hồ sơ bồi
thường) records for the driver-accumulation product, filterable and sortable
entirely client-side over a static mock array. Mirrors the existing
`claim-requests` list-page pattern.

## 2. Approach

Mirror the established list-page convention already used by `claim-requests` and
`driver-savings`:

```
src/pages/claim-files/
├── ClaimFilesListPage.tsx          # page shell: breadcrumb + filters + toolbar + table
├── mock-data.ts                    # row type, STATUS_CONFIG, options, formatters, rows
├── claim-files-filters.ts          # filter type, DEFAULT_FILTERS, applyFilters
└── components/
    ├── ClaimFilesFilters.tsx        # filter form card
    ├── ClaimFilesToolbar.tsx        # title + decorative icon buttons
    ├── ClaimFilesTable.tsx          # AntD Table with stacked-field columns
    └── ClaimFileStatusBadge.tsx     # AntD Tag from STATUS_CONFIG
```

Rejected alternatives:
- **Single-file page** — violates the repo's small-files + colocation convention.
- **Generic shared `<DataList>`** — YAGNI; only one page needs it.

## 3. Routing & navigation

| Path | Element |
|---|---|
| `ho-so-boi-thuong/tat-ca` | `PlaceholderPage title="Tất cả hồ sơ bồi thường"` |
| `ho-so-boi-thuong/tai-nan-hanh-khach-theo-chuyen` | `PlaceholderPage title="Tai nạn hành khách theo chuyến"` |
| `ho-so-boi-thuong/bao-hiem-hang-hoa` | `PlaceholderPage title="Bảo hiểm hàng hoá"` |
| `ho-so-boi-thuong/bao-hiem-tich-luy-tai-xe` | `ClaimFilesListPage` (new) |
| `ho-so-boi-thuong/bao-hiem-tich-luy-tai-xe/:id` | `PlaceholderPage title="Chi tiết hồ sơ bồi thường"` (pencil target) |

**Sidebar (`SidebarNav.tsx`):** fill the currently-empty `ho-so-boi-thuong` group
with the 4 children above (3 placeholders + the new page), matching the screenshot.
The detail `:id` route is reachable only via the table pencil, not the sidebar.

## 4. Page layout (top → bottom)

1. **Breadcrumb:** `Hồ sơ bồi thường / Bảo hiểm tích lũy tài xế`
   **Heading:** `<h1>` "Bảo hiểm tích lũy tài xế"
2. **Filters card** — one row, 4 fields, then right-aligned buttons:
   1. **Tìm kiếm** — `Input` + info `Tooltip`, placeholder `"Nhập từ khoá tìm kiếm"`
   2. **Sắp xếp theo** — `Select`, default `"Xếp theo mới nhất"`
   3. **Tình trạng Hồ sơ bồi thường** — `Select`, placeholder `"Lọc theo trạng thái"`
   4. **Ngày thực hiện chi trả bồi thường** — `RangePicker`, placeholders `["Từ ngày", "Đến ngày"]`
   - Buttons: **Làm lại** (reset, default) + **Tìm kiếm** (primary)
3. **Toolbar card** — title `"Danh sách Hồ sơ bồi thường"` (left) + 3 decorative icon
   buttons on the right: reload, columns, settings. **No** Add button, **no** CSV
   button (not present in this design).
4. **Table card**

## 5. Table columns

| # | Column | Content (stacked fields where noted) |
|---|--------|--------|
| 1 | STT | `(page-1)*PAGE_SIZE + index + 1` |
| 2 | **Số yêu cầu bồi thường** | Số yêu cầu bồi thường: `26TT000444` · Mã Hồ sơ bồi thường: `JOB2600000134` · Ngày xảy ra tai nạn: `14/11/2025` |
| 3 | **Thông tin khách hàng** | Mã tài xế: `3000000761` · Họ và tên: `Phạm Minh Hoà` · Số HĐNT: `24/PM-GSM/013203` |
| 4 | **Số tiền chi trả** | Khách hàng yêu cầu: `16.232.506 đ` · Ước bồi thường: `0 đ` · Đã chi trả: `17.732.506 đ` |
| 5 | Ngày thực hiện chi trả | `13/02/2026 14:40` |
| 6 | Trạng thái | `Tag` "Đã thanh toán" (green) |
| 7 | Hành động | `Button type="primary"` with `EditOutlined` → detail route |

- Stacked-field cells use the same `Field` helper pattern as `ClaimRequestsTable`
  (`<span className="font-medium text-gray-500">{label}: </span>` + value).
- Pagination: `PAGE_SIZE = 10`, `showSizeChanger: false`.
- `scroll={{ x: 'max-content' }}`, card wrapper `rounded-lg border border-gray-100 bg-white p-2 shadow-sm`.

## 6. Data model (`mock-data.ts`)

```ts
export type ClaimFileStatus = 'da-thanh-toan' | 'cho-thanh-toan' | 'tu-choi' | 'da-huy'

export interface ClaimFileRow {
  id: string
  claimRequestNumber: string   // Số yêu cầu bồi thường — 26TT000444
  claimFileCode: string        // Mã Hồ sơ bồi thường — JOB2600000134
  accidentDate: string         // Ngày xảy ra tai nạn (ISO date)
  driverCode: string           // Mã tài xế
  customerName: string         // Họ và tên
  masterPolicyNumber: string   // Số HĐNT — 24/PM-GSM/013203
  customerRequested: number    // Khách hàng yêu cầu (đ)
  estimatedClaim: number       // Ước bồi thường (đ)
  paidAmount: number           // Đã chi trả (đ)
  paidAt: string               // Ngày thực hiện chi trả (ISO datetime)
  status: ClaimFileStatus
}
```

- **`STATUS_CONFIG`:** `da-thanh-toan` → `{ tagLabel: 'Đã thanh toán', color: 'green' }`
  is the only status confirmed from the design. `cho-thanh-toan`, `tu-choi`,
  `da-huy` are **documented placeholders** so the status filter functions (same
  convention as `driver-savings` mock-data §9.1). A comment records this assumption.
- **Formatters:** `formatAmount(n)` → `"16.232.506 đ"` (vi-VN grouping + " đ"),
  `formatDate(iso)` → `"14/11/2025"`, `formatDateTime(iso)` → `"13/02/2026 14:40"`.
- **Rows:** ~12 rows seeded from the screenshot's visible rows (Phạm Minh Hoà,
  Nguyễn Văn Huân, Trịnh Văn Long, Võ Văn Vĩnh, Vũ Trọng Nghĩa, …) plus plausible
  extras to fill a page. All visible rows use `da-thanh-toan`; a few extras use
  placeholder statuses so filtering is demonstrable.
- `sortOptions` (Xếp theo mới nhất / cũ nhất) and `statusOptions` (from `STATUS_CONFIG`).

## 7. Filters (`claim-files-filters.ts`)

```ts
export interface ClaimFileFilters {
  keyword: string                       // claimRequestNumber | claimFileCode | driverCode | customerName | masterPolicyNumber
  sort: 'newest' | 'oldest'             // by paidAt
  paidRange: [string, string] | null    // [YYYY-MM-DD, YYYY-MM-DD] over paidAt
  status: ClaimFileStatus | null
}
```

`applyFilters` filters by keyword substring, `paidAt` date range, and status, then
sorts by `paidAt` (newest/oldest). Pure function, returns a new array (immutable).

## 8. Scope guardrails

- Mock data + UI only — static array like `driver-savings`; no axios, no interceptor.
- Reset / Search / sort / filter all operate client-side on the mock array.
- No automated tests for this UI-only demo; verify visually against
  `docs/ui/claim-files-list.png`.
- Detail page (`claim-file-detail-*.png`) is **out of scope** — pencil only wires to
  a `PlaceholderPage` route.

## 9. Assumptions

1. Only "Đã thanh toán" status is confirmed; other statuses are placeholders.
2. Search keyword fields chosen to cover the identifiers visible in columns 2–3.
3. Sort + date-range filter both key off the payment date (`paidAt`), since that is
   the date column and the date filter is labelled "Ngày thực hiện chi trả bồi thường".
4. Breadcrumb root label is the sidebar group name "Hồ sơ bồi thường".
