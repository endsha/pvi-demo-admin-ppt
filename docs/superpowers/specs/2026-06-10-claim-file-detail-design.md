# Claim File Detail page — Design

**Date:** 2026-06-10
**Feature:** `Chỉnh sửa hồ sơ bồi thường` (Claim File Detail) for *Bảo hiểm tích lũy tài xế*
**Scope:** UI + mock data only. No API integration.
**Source design:** `docs/ui/claim-file-detail-01.png`, `-02.png`, `-03.png`

---

## 1. Goal

Implement the Claim File Detail page that the claim-files list links to. The route already
exists as a stub (`ho-so-boi-thuong/bao-hiem-tich-luy-tai-xe/:id` → `PlaceholderPage`); this
feature replaces the stub with the real page.

Per `docs/rules/ui-ux-strict.md`, the page must match the screenshots pixel- and
label-faithfully — no invented fields, labels, or sections.

## 2. Interaction model (decided)

- The page is a **read-only detail view** with **two interactive `Select`s** at the top:
  - `Chọn Hợp đồng nguyên tắc *`
  - `Trạng thái Hồ sơ bồi thường *`
- All other blocks (insured person, beneficiary, accident info, and the three tables) are
  **read-only display**.
- **No bottom action buttons** (no Lưu / Làm lại). The two selects update local state only;
  there is no save and no API.

## 3. Mock data continuity (important)

The claim-files list (`src/pages/claim-files/mock-data.ts`) row **`id: '1'`** is the exact
record shown in design image 01:

| Field | Value |
|---|---|
| Mã Tài xế GSM | `3000000761` |
| Họ và tên | `Phạm Minh Hoà` |
| Số HĐNT | `24/PM-GSM/013203` |
| Ngày tai nạn | `14/11/2025` |
| Người thụ hưởng | `PHẠM MINH HOÀ` |
| Số tài khoản | `925951661995` |
| Ngân hàng | `TECHCOMBANK` |
| Số điện thoại | `+84343868396` |

The detail mock for `id '1'` MUST mirror these values. `findClaimFileDetail(id)` returns the
single mock record for any id (same UI-only pattern as `getMasterPolicyDetail`).

## 4. Component reuse strategy (decided)

**Extract the two shared tables, build the rest new.**

- Move `BenefitTable` + `AccumulationTable` and their supporting types (`BenefitRow`,
  `AccumulationTrip`) and helpers (`formatMoney`, `formatDateTimeSeconds`) out of
  `src/pages/master-policy-detail/` into a shared module:
  - `src/components/insurance/BenefitTable.tsx`
  - `src/components/insurance/AccumulationTable.tsx`
  - `src/components/insurance/types.ts` (or co-located) + `format.ts` helpers
- Update `master-policy-detail` to import from the shared module (contained change, no
  behavior change).
- Build new components for what is genuinely new (`InfoTable`, `PaymentTable`).

Rationale: `BenefitTable` columns match the design's "Bảng Quyền lợi bảo hiểm" exactly, and
`AccumulationTable` matches the bottom GSM-trips table closely. These now serve two features,
so a shared module is the DRY-correct location.

Rejected alternatives:
- Direct cross-feature import (claim-files importing from master-policy-detail) — sibling
  coupling smell.
- Duplicating the tables — violates DRY.

## 5. File structure

New feature folder `src/pages/claim-file-detail/`:

- `ClaimFileDetailPage.tsx` — page shell: breadcrumb, h1, white card, section composition,
  local state for the two selects.
- `claim-file-detail-mock.ts` — types + one mock record keyed to list `id '1'`, plus
  `findClaimFileDetail(id)`, plus status options for the status select.
- `components/InfoTable.tsx` — reusable read-only bordered label/value table (gray label
  column + value cell, one row per field, `–` for blanks). The design's "Descriptions" look.
- `components/PaymentTable.tsx` — "Bảng thanh toán bồi thường" *(columns: see §8)*.

Shared (new):
- `src/components/insurance/BenefitTable.tsx`, `AccumulationTable.tsx`, types + helpers.

## 6. Page composition (top → bottom)

1. **Header**
   - Breadcrumb: `Hồ sơ bồi thường` / `Bảo hiểm tích lũy tài xế` / `Chỉnh sửa hồ sơ bồi thường`
   - h1: `Chỉnh sửa hồ sơ bồi thường`
2. **White card** (`rounded-lg border border-gray-100 bg-white p-6 shadow-sm`, matching
   sibling pages):
   - `Chọn Hợp đồng nguyên tắc *` — `Select`, value `24/PM-GSM/013203`
   - `Trạng thái Hồ sơ bồi thường *` — `Select`, value `Thanh toán bồi thường`
   - Collapsible **`Thông tin yêu cầu bồi thường`** containing read-only `InfoTable`s:
     - **Thông tin người được bảo hiểm:** Mã Tài xế GSM, Họ và tên, Giới tính,
       Số CMND/CCCD/ Hộ chiếu, Ngày sinh, Số điện thoại, Email, Số điện thoại sử dụng Zalo
     - **Thông tin người thụ hưởng:** Người thụ hưởng, Số tài khoản, Ngân hàng,
       Địa chỉ ngân hàng
     - **Thông tin về tai nạn và khám chữa:** Ngày tai nạn + remaining fields *(see §8)*;
       includes a `Tải ảnh kèm` display-only upload box
   - **Bảng Quyền lợi bảo hiểm** — reused `BenefitTable`
   - **Bảng thanh toán bồi thường** — new `PaymentTable` *(see §8)*
   - **GSM trips table** — reused `AccumulationTable` *(see §8)*
3. No bottom action buttons.

## 7. Routing

In `src/app/router.tsx`, replace:

```tsx
{ path: 'ho-so-boi-thuong/bao-hiem-tich-luy-tai-xe/:id',
  element: <PlaceholderPage title="Chi tiết hồ sơ bồi thường" /> }
```

with the new `ClaimFileDetailPage`. The list page's `handleEdit` already navigates here.

## 8. Open items — confirm against the design before/at implementation

These are low-resolution in the screenshots and must be confirmed (not guessed), per
`ui-ux-strict.md` principle 8:

- **(a)** Exact field list + labels for read-only **Thông tin về tai nạn và khám chữa**.
- **(b)** Column headers for **Bảng thanh toán bồi thường**.
- **(c)** Bottom trips-table header labels (`ID chuyến đi GSM` vs `ID chuyến xe GSM`;
  `STMĐ chuyến` vs `STBH/ chuyến`) and whether its rows expand (master `AccumulationTable`
  rows expand to a per-trip benefit table — confirm whether the claim detail does too).

## 9. Testing

Per web testing rules:
- Playwright visual check at the page route (1440 breakpoint): verify the three info
  sections + three tables render, and both selects are interactive.
- No unit tests needed for static display components.

## 10. Out of scope

- API integration of any kind.
- Editing/saving the insured/beneficiary/accident data.
- Status workflow logic beyond the local select value.
