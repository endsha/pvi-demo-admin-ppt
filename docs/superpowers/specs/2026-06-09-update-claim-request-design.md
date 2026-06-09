# Update Claim Request Page — Design Spec

**Date:** 2026-06-09
**Feature:** `Chỉnh sửa yêu cầu bồi thường` (Update Claim Request form) for `Bảo hiểm tích lũy tài xế`
**Scope:** UI + mock data only. **No API** (no fetch/axios; Save/Create are client-side only).
**Source of truth:** `docs/ui/update-claim-request-ppt-01.png`, `docs/ui/update-claim-request-ppt-02.png`

Governed by `docs/rules/ui-ux-strict.md`: labels, placeholders, section order, grid, and
required-marks are copied pixel-exact from the screenshots. No invented fields or conditional logic.

This page is a near-twin of the New Claim Request form
(`docs/superpowers/specs/2026-06-09-new-claim-request-design.md`); it reuses the same form
sections, pre-filled in edit mode, with three deltas: no customer-search field, an added
claim-file history table, and a different footer.

---

## 1. Route & entry point

- Replace the existing `PlaceholderPage` at route
  `yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe/:id/cap-nhat` (in `src/app/router.tsx`)
  with `<UpdateClaimRequestPage />`.
- The claim-requests list **Edit** action (`ClaimRequestsTable` → `onEdit`) already navigates
  to this route — no list/table change needed.

## 2. Refactor — extract shared claim form

The five form sections are already pure form-context components (they read/write through AntD
`Form` and only import option lists). Promote them, plus the form module, into a shared folder
imported by **both** the New and Update pages (DRY; avoids cross-folder coupling to a `new-`
prefixed path).

Target layout under `src/pages/claim-requests/`:

```
claim-form/                       # NEW shared folder
├── claim-form.ts                 # moved from new-claim-request/new-claim-request-form.ts
│                                 #   (types, option lists, initialValues, mock customers, findCustomer)
└── components/
    ├── GeneralInfoSection.tsx
    ├── InsuredPersonSection.tsx  # + showCustomerSearch?: boolean (default true)
    ├── AccidentInfoSection.tsx
    ├── ClaimAmountSection.tsx
    └── BeneficiarySection.tsx
new-claim-request/
└── NewClaimRequestPage.tsx       # imports updated: ./new-claim-request-form → ../claim-form/claim-form
                                  #   and ./components/* → ../claim-form/components/*
update-claim-request/             # NEW
├── UpdateClaimRequestPage.tsx
├── update-claim-request-mock.ts  # per-id mock claim lookup + history rows
└── components/
    └── ClaimHistorySection.tsx
```

Moves:
- `new-claim-request/new-claim-request-form.ts` → `claim-form/claim-form.ts`.
  Rename the exported type `NewClaimRequestForm` → `ClaimForm` (it now serves both pages) and
  update the one import in `NewClaimRequestPage.tsx`.
- `new-claim-request/components/*` → `claim-form/components/*`. Update their internal import
  `../new-claim-request-form` → `../claim-form`.

Non-component exports (types, options, `initialValues`, mock customers) stay in `claim-form.ts`
so every `.tsx` exports only components (passes `react-refresh/only-export-components`).

### `InsuredPersonSection` change

Add an optional prop:

```ts
interface InsuredPersonSectionProps {
  showCustomerSearch?: boolean // default true
}
```

- New page: renders default (search field shown — unchanged behavior).
- Update page: passes `showCustomerSearch={false}` — the `Tìm thông tin khách hàng` `Form.Item`
  is not rendered (the edit screenshot has no search field; insured section starts at
  `Mã Tài xế GSM`). Everything else in the section is identical.

## 3. UpdateClaimRequestPage

Mirrors `NewClaimRequestPage` shell:

- `<Breadcrumb>` items: `Yêu cầu bồi thường` / `Bảo hiểm tích lũy tài xế` / `Chỉnh sửa yêu cầu bồi thường`.
- `<h1 className="text-xl font-semibold text-gray-800">Chỉnh sửa yêu cầu bồi thường</h1>`.
- `const { id } = useParams()` → `const claim = findClaim(id)` from `update-claim-request-mock.ts`.
- One white card `rounded-lg border border-gray-100 bg-white p-6 shadow-sm` with a single
  `<Form form={form} layout="vertical" requiredMark initialValues={claim} onFinish={handleSave}>`.
- Section order (top → bottom):
  1. `<GeneralInfoSection />`
  2. `<InsuredPersonSection showCustomerSearch={false} />`
  3. `<AccidentInfoSection />`
  4. `<ClaimAmountSection />`
  5. `<BeneficiarySection />`
  6. `<ClaimHistorySection rows={claim.historyRows} />`
  7. Footer button bar (section 5 below).
- `message.useMessage()` for toasts (same pattern as New page).

## 4. ClaimHistorySection (new — Update only)

Read-only display block beneath the beneficiary section.

- Heading: `<h2 className="mb-4 text-base font-semibold text-gray-800">Thông tin Hồ sơ bồi thường đã tạo</h2>`.
- AntD `<Table>` with columns, in this exact order and exact Vietnamese text:

  | Column header | Notes |
  |---|---|
  | `Mã Hồ sơ bồi thường` | |
  | `Mã hợp đồng nguyên tắc` | |
  | `Người tạo` | |
  | `Ngày tạo` | |
  | `Trạng thái` | |
  | `Hành động` | |

- `dataSource={rows}`. With the default mock (`historyRows: []`), the table shows AntD's
  built-in empty state ("Trống"), matching the screenshot.
- No pagination needed (`pagination={false}`); `scroll={{ x: 'max-content' }}` for parity
  with the list table.

## 5. Footer buttons

Left-aligned group (replaces the New page's `Làm lại` / `Lưu` pair):

| Order | Label | Style | Action (UI only) |
|---|---|---|---|
| 1 | `Tạo Hồ sơ bồi thường` | green primary (custom color) | `messageApi.success('Đã tạo Hồ sơ bồi thường')` — no navigation |
| 2 | `Làm lại` | default | `form.resetFields()` (resets to loaded `initialValues`) |
| 3 | `Lưu` | primary (blue), `htmlType="submit"`, wrapped in `<Tooltip title="Cập nhật Yêu cầu bồi thường">` | AntD validation → `messageApi.success('Đã cập nhật yêu cầu bồi thường')` → `navigate('/yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe')` |

Green button: use AntD v5 `color`/`variant` if available, else a Tailwind/`style` override to a
green background. The dark `Cập nhật Yêu cầu bồi thường` box in the screenshot is the `Lưu`
button's tooltip, not a separate button.

## 6. Mock data (`update-claim-request-mock.ts`)

Exports a per-id lookup plus a fallback record. Values copied verbatim from the screenshots.

```ts
import dayjs from 'dayjs'
import type { ClaimForm } from '../claim-form/claim-form'

export interface ClaimHistoryRow {
  id: string
  claimFileCode: string
  masterPolicyNumber: string
  createdBy: string
  createdAt: string
  status: string
}

export interface MockClaim extends ClaimForm {
  historyRows: ClaimHistoryRow[]
}

const defaultClaim: MockClaim = { /* fields below */ }

export const mockClaimsById: Record<string, MockClaim> = {
  // keyed by the claim-requests list row ids so Edit opens matching data
}

export function findClaim(id?: string): MockClaim {
  return (id && mockClaimsById[id]) || defaultClaim
}
```

Default record (matches `update-claim-request-ppt-01/02.png`):

| Field | Value |
|---|---|
| `receivingSource` | `undefined` (empty → placeholder; required, so Lưu flags it) |
| `driverCode` | `6123723` |
| `fullName` | `Phạm Xuân Đông Hải` |
| `gender` | `male` (renders `Nam`) |
| `idNumber` | `undefined` (read-only field shows `-`) |
| `dob` | `undefined` (read-only field shows `-`) |
| `phone` | `+84968532564` |
| `email` | `undefined` |
| `zalo` | `undefined` |
| `accidentDate` | `dayjs('31/05/2026', 'DD/MM/YYYY')` |
| `accidentPlace` | `Phường thới an` |
| `examDate` | `dayjs('03/06/2026', 'DD/MM/YYYY')` |
| `admissionDate` | `undefined` |
| `treatmentPlace` | `Tiêm chủng Long Châu` |
| `diagnosis` | `Chó cắn` |
| `consequence` | `Tiêm vắc xin` |
| `treatmentType` | `outpatient` (Ngoại trú) |
| `fromDate` / `toDate` | `undefined` |
| `claimAmount` | `1725000` |
| `claimCases` | `['medical']` (Chi phí y tế) |
| `beneficiary` | `Phạm Xuân Đông Hải` |
| `accountNumber` | `060194546850` |
| `bankName` | `Sacombank` |
| `bankAddress` | `207 Lê Văn Khương, phường thới an, tp Hồ Chí Minh` |
| `historyRows` | `[]` |

Keys for `mockClaimsById` come from the existing `claimRequestRows` ids in
`src/pages/claim-requests/mock-data.ts` (map at least the first row's id to `defaultClaim`;
other ids fall back via `findClaim`). All ids resolve to a valid record so any Edit click works.

## 7. Out of scope
- No API / network calls.
- No real file persistence (upload stays display-only, `beforeUpload={() => false}`).
- No backend validation; client-side AntD validation only.
- No real claim-file creation (the green button only toasts).
- The `Giấy YCBT` page (separate route) is NOT part of this work.

## 8. Verification
- App builds / lint clean (`react-refresh/only-export-components` passes after the move).
- New Claim Request page still renders identically (shared-section refactor is behavior-neutral;
  search field still present there).
- From claim-requests list, clicking **Edit** on a row renders the Update form pre-filled with
  the mock values; `Số CMND` / `Ngày sinh` show `-`; Giới tính shows `Nam`; dates populate.
- Insured section has **no** `Tìm thông tin khách hàng` field.
- `Thông tin Hồ sơ bồi thường đã tạo` table renders the six headers with an empty state.
- `Tạo Hồ sơ bồi thường` → success toast, no navigation. `Làm lại` → resets to loaded values.
- `Lưu` (tooltip `Cập nhật Yêu cầu bồi thường`) → validation → success toast → back to list.
