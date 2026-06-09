# Master Policy Detail Page — Design

**Date:** 2026-06-09
**Status:** Approved
**Scope:** UI + mock data only. **No API integration.**

Implements the "Xem Hợp đồng nguyên tắc" (View Master Policy) detail page from the
design screenshots in `docs/ui/master-policy-detail-01.png`,
`docs/ui/master-policy-detail-02.png`, and `docs/ui/master-policy-detail-03.png`
(expanded-row state).

---

## 1. Content (copied exactly from the design — do not paraphrase)

### Page

- **Title:** `Xem Hợp đồng nguyên tắc`
- **Breadcrumb:** `Hợp đồng nguyên tắc` / `Bảo hiểm tích luỹ tài xế` / `Xem Hợp đồng nguyên tắc`

### Section 1 — `Thông tin chung` (3-column stacked grid)

| Field label | Mock value |
|---|---|
| `Mã Tài xế GSM` | `8000075529` |
| `Họ và tên` | `Chu Xuân Hưởng` |
| `Ngày sinh` | `-` |
| `Số CMND/CCCD/Hộ chiếu` | `-` |
| `Giới tính` | `Male` |
| `Số hợp đồng nguyên tắc` | `26/PC-GSM/067426` |
| `STBH tích lũy trong thời gian` | `-` |

Grid order is left→right, top→bottom: row 1 = Mã Tài xế GSM / Họ và tên / Ngày sinh;
row 2 = Số CMND/CCCD/Hộ chiếu / Giới tính / Số hợp đồng nguyên tắc; row 3 = STBH tích lũy
trong thời gian (then two empty cells). No button in this section (the earlier low-res
screenshot appeared to show one; the high-res design is authoritative — there is none).

### Section 2 — `Bảng Quyền lợi bảo hiểm`

Columns (exact):
`QUYỀN LỢI BẢO HIỂM` · `HẠN MỨC BẢO HIỂM` · `ĐÃ CHI TRẢ` · `ƯỚC BỒI THƯỜNG` · `HẠN MỨC CÒN LẠI`

Master-level rows (values all `-` except row 3's HẠN MỨC BẢO HIỂM):

1. `Tử vong do tai nạn` — `-` / `-` / `-` / `-`
2. `Thương tật toàn bộ vĩnh viễn do tai nạn` — `-` / `-` / `-` / `-`
3. `Trợ cấp nằm viện do tai nạn`
   - sub-line (italic, gray): `Chi trả trợ cấp nằm viện do Tai nạn từ trọn 2 ngày trở lên`
   - HẠN MỨC BẢO HIỂM: `Tối đa mỗi đợt nằm viện VND 1.500.000 đối với tài xế xe máy & VND 3.000.000 đối với tài xế ô tô`
   - ĐÃ CHI TRẢ / ƯỚC BỒI THƯỜNG / HẠN MỨC CÒN LẠI: `-` / `-` / `-`
4. `Chi phí y tế do tai nạn`
   - sub-line (italic, gray): `Chỉ chi trả các CPYT phát sinh trong thời hạn BH`
   - `-` / `-` / `-` / `-`

### Section 3 — `Bảng Danh sách đơn tích luỹ` (expandable table)

Columns (exact):
`STT` · `ID chuyến xe GSM` · `Mã hợp đồng bảo hiểm chuyến` · `Thời gian hoàn thành chuyến`
· `Thời gian bắt đầu bảo hiểm` · `Thời gian kết thúc bảo hiểm` · `STBH/ chuyến`

Sort arrows are shown on the sortable-looking columns but are **cosmetic only** (no real
sorting).

Mock rows:

| STT | ID chuyến xe GSM | Mã hợp đồng bảo hiểm chuyến | Thời gian hoàn thành chuyến | Thời gian bắt đầu bảo hiểm | Thời gian kết thúc bảo hiểm | STBH/ chuyến |
|---|---|---|---|---|---|---|
| 1 | `01KTM096HKQ98CG7ZTZWC8NJM0` | `26/PC-GSM/067426/000012` | `08/06/2026 23:48:14` | `08/06/2026 23:48:14` | `05/12/2026 23:48:13` | `250.000 đ` |
| 2 | `01KTM23ECWFBJT4P34KBTNJN4P` | `26/PC-GSM/067426/000024` | `08/06/2026 23:58:54` | `08/06/2026 23:58:54` | `05/12/2026 23:58:53` | `250.000 đ` |

Footer: `1-2 trên 2 mặt hàng`, single page.

### Expanded row content (per trip)

Expanding a trip row reveals a **nested benefits table** with the same 5 columns as
Section 2, with per-trip numeric values. For trip 1:

1. `Tử vong do tai nạn` — `250.000 đ` / `0 đ` / `0 đ` / `250.000 đ`
2. `Thương tật toàn bộ vĩnh viễn do tai nạn` — `250.000 đ` / `0 đ` / `0 đ` / `250.000 đ`
3. `Trợ cấp nằm viện do tai nạn` (same sub-line as master) — `15.000 đ` / `0 đ` / `0 đ` / `15.000 đ`
4. `Chi phí y tế do tai nạn` (same sub-line as master) — `15.000 đ` / `0 đ` / `0 đ` / `15.000 đ`

Trip 2 uses the same structure (mock numeric values).

---

## 2. Architecture

### Routing (`react-router-dom` — the actual stack in this repo)

> Note: `docs/rules/routing.md` describes TanStack Router, but the codebase uses
> `react-router-dom` `createBrowserRouter`. Follow the real code.

- Add child route to `src/app/router.tsx` under `AdminLayout`:
  `hop-dong-nguyen-tac/bao-hiem-tich-luy-tai-xe/:id` → `<MasterPolicyDetailPage />`.
- `MasterPoliciesTable` row navigation: the existing `Xem hợp đồng nguyên tắc` link and
  the zoom action button call `navigate()` to the detail route for that row's id.
- The detail page reads `:id` via `useParams`, looks up a mock record, and falls back to
  a default mock so any id renders.

### File structure (`src/pages/master-policy-detail/`)

```
MasterPolicyDetailPage.tsx     # breadcrumb + title + 3 sections, reads :id
mock-data.ts                   # types, mock detail record, formatMoney/formatDateTimeSeconds
components/
  GeneralInfoCard.tsx          # "Thông tin chung" 3-col stacked grid
  BenefitTable.tsx             # reusable 5-col benefits table (master + nested)
  AccumulationTable.tsx        # "Bảng Danh sách đơn tích luỹ" expandable table
```

Formatters (`formatMoney`, `formatDateTimeSeconds`) are duplicated per-feature in
`mock-data.ts`, matching the existing convention in `master-policies`, `policies`, and
`driver-savings`.

### Data model

```ts
interface BenefitRow {
  key: string
  name: string
  sub?: string
  hanMuc: string | null        // null => render "-"
  daChiTra: string | null
  uocBoiThuong: string | null
  hanMucConLai: string | null
}

interface AccumulationTrip {
  id: string
  gsmTripId: string            // ID chuyến xe GSM
  transferContractNo: string   // Mã hợp đồng bảo hiểm chuyến
  completedAt: string          // ISO, Thời gian hoàn thành chuyến
  effectiveStart: string       // ISO, Thời gian bắt đầu bảo hiểm
  effectiveEnd: string         // ISO, Thời gian kết thúc bảo hiểm
  sumInsured: number           // STBH/ chuyến
  benefits: BenefitRow[]       // nested benefit table
}

interface MasterPolicyDetail {
  id: string
  driverCode: string           // Mã Tài xế GSM
  fullName: string             // Họ và tên
  dob: string | null           // Ngày sinh
  idNumber: string | null      // Số CMND/CCCD/Hộ chiếu
  gender: string               // Giới tính
  contractNumber: string       // Số hợp đồng nguyên tắc
  accumulationPeriod: string | null // STBH tích lũy trong thời gian
  benefits: BenefitRow[]       // master-level benefit table (all dashes)
  trips: AccumulationTrip[]
}
```

### Components

- **GeneralInfoCard** — Tailwind grid `grid-cols-1 md:grid-cols-3`, each cell a stacked
  label (gray, small, top) + value (dark, below). `-` for empty values.
- **BenefitTable** — AntD `Table`, 5 columns. Benefit cell = bold name + optional italic
  gray sub-line. `null` cell value renders `-`. Reused for master section and nested
  expanded rows.
- **AccumulationTable** — AntD `Table` with `expandable`, 7 columns + expand control.
  `expandedRowRender` → `<BenefitTable rows={trip.benefits} />`. Sort arrows cosmetic.
  AntD default `+`/`−` expand icons match the design. Footer text via `pagination` locale.

### Layout

Single white surface card (`bg-white rounded-lg border border-gray-100 shadow-sm`)
containing the three sections stacked with spacing and bold headings, matching the
existing `MasterPoliciesTable` card styling. Card boundaries fine-tuned visually against
the design PNGs.

---

## 3. Verification

- `yarn build` (or `tsc --noEmit`) passes.
- Run dev server, navigate to the route, screenshot at 1440px, compare against the three
  design PNGs — including an expanded trip row.
- Render smoke check only; no heavy unit tests for this static/visual page.

---

## 4. Out of scope

- API integration / data fetching (mock only).
- Functional sorting, filtering, or pagination beyond the cosmetic single page.
- Any field, section, button, or behavior not present in the design screenshots.
