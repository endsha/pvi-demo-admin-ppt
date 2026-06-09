# GSM PPT Search Page — Design

**Date:** 2026-06-09
**Route:** `/tra-cuu-gsm`
**Scope:** UI + mock data only. No API, no API mocking layer.
**Reference:** `docs/ui/policy-search.png`

---

## 1. Goal

Replace the current `PlaceholderPage` mounted at `tra-cuu-gsm` with a real "Tra cứu thông tin GSM PPT" search page. The page renders the search-form card from the screenshot pixel-faithfully, and — on submit — shows a result table populated from local mock data.

The sidebar entry already exists (`SidebarNav.tsx`: `{ key: '/tra-cuu-gsm', icon: <SearchOutlined />, label: 'Tra cứu GSM PPT' }`) and the `Powered by PVI Digital` footer already lives in `AdminLayout`. Neither needs changes.

## 2. Conventions

Follow the existing feature-folder pattern used by `src/pages/policies/` and `src/pages/invoice-requests/`:
- One feature folder with a page container, a `components/` subfolder, a logic file, and `mock-data.ts`.
- AntD `Form` (`layout="vertical"`), `Input`, `Select`, `Button`, `Table`, `Tag`.
- Tailwind utility classes for layout, matching the card styling already in use
  (`rounded-lg border border-gray-100 bg-white p-5 shadow-sm`).
- Immutable state updates; explicit prop types; no `any`.

## 3. File structure

```
src/pages/gsm-search/
├── GsmSearchPage.tsx          # container: owns query + results + status state, runs mock search
├── components/
│   ├── GsmSearchForm.tsx      # centered search card (the screenshot)
│   └── GsmSearchResult.tsx    # result table + empty / no-result states
├── gsm-search.ts              # types, search criteria, applySearch() logic
└── mock-data.ts               # GSM records + insuranceTypeOptions + formatters/reuse
```

Router change (`src/app/router.tsx`): swap
`{ path: 'tra-cuu-gsm', element: <PlaceholderPage title="Tra cứu GSM PPT" /> }`
for `{ path: 'tra-cuu-gsm', element: <GsmSearchPage /> }` and add the import.

## 4. Search form card (faithful to screenshot)

Centered column, card max-width ~640px, white card with title **"Tra cứu thông tin GSM PPT"**.

| Field | Control | Label (exact) | Placeholder (exact) | Required |
|---|---|---|---|---|
| Phone | `Input` w/ search-icon prefix | `Số điện thoại` | `Nhập số điện thoại` | No |
| Driver code | `Input` | `Mã tài xế GSM` | `Nhập mã tài xế (nếu có)` | No |
| Insurance type | `Select` | `Loại bảo hiểm` (with `*`) | default value `Tất cả` | **Yes** |

- Submit button: primary, **full-width**, search icon, label **`Tra cứu`**.
- Required validation on `Loại bảo hiểm`: blocks submit when empty (it defaults to `Tất cả`, so this only triggers if the user clears it).
- Phone and driver code are optional.

## 5. Search behavior & states

On submit:
1. Validate the form (required `Loại bảo hiểm`).
2. Set status to `loading`; simulate a ~400ms delay via `setTimeout` so the button shows a loading state. **This is a UI affordance only — there is no API call and no fetch/mock-fetch layer.**
3. Run `applySearch(records, criteria)` against the local mock array.
4. Set results and status to `done`.

State machine (in `GsmSearchPage`):

| State | Result area |
|---|---|
| `idle` (before first search) | hidden |
| `loading` | button loading; optional spinner |
| `done` + results | result table |
| `done` + 0 results | AntD `Empty`-style state: `Không tìm thấy thông tin phù hợp` |

`applySearch` filter rules (all conditions AND-ed; blank inputs are ignored):
- Phone: case-insensitive substring match against `riderPhone` **or** `bookerPhone`.
- Driver code: case-insensitive substring match against the record's `driverCode`.
- Insurance type: exact match unless value is `Tất cả` (matches all).

Layout: the form stays centered/narrow; the result table renders full content-width below it.

## 6. Result table

AntD `Table`, columns:

| Column | Source | Format |
|---|---|---|
| Mã chuyến | `tripId` | text |
| Biển số | `plate` | text |
| Tên người đi | `riderName` | text |
| SĐT | `riderPhone` | text |
| Loại bảo hiểm | `insuranceType` | text |
| Phí (đ) | `premium` | `formatPremium` |
| Thời gian | `startAt` | `formatDateTime` |
| Trạng thái | `status` | colored `Tag` |

Status tag colors and labels reuse the existing `STATUS_CONFIG` / formatter helpers from
`src/pages/policies/mock-data.ts` (imported — no duplication).

## 7. Mock data model

The GSM record extends the existing `PolicyRow` shape with two fields needed by this page's
search inputs:

```ts
export interface GsmRecord extends PolicyRow {
  driverCode: string      // "Mã tài xế GSM"
  insuranceType: string   // "Loại bảo hiểm" label
}
```

Seed ~12 records reusing realistic values consistent with `policies/mock-data.ts`
(phones, plates, trip IDs, premiums, statuses), assigning `driverCode` and `insuranceType`
across the product set so each filter exercises a non-empty result.

## 8. Mock assumptions (flagged — not in screenshot)

1. **`Loại bảo hiểm` option list:** `Tất cả` + the GSM products from the sidebar —
   `Tai nạn hành khách theo chuyến`, `Bảo hiểm hàng hoá`, `Bảo hiểm tích lũy tài xế`,
   `Bảo hiểm FoodCare`. Marked as an assumption in code comments.
2. **Result table layout:** the screenshot shows only the form; the result table columns and
   styling are an invented, codebase-consistent layout (approved by the user).
3. **~400ms loading delay:** a UI affordance, not a simulated network request.

## 9. Out of scope

- No real API, no fetch wrapper, no API-mock library.
- No pagination/sorting/export on the result table unless trivially provided by AntD defaults.
- No changes to sidebar, layout, or footer.
- No row-detail / drill-down view.

## 10. Testing

Per web testing rules, prioritize visual + behavioral checks:
- Form renders with exact labels/placeholders; required validation fires when `Loại bảo hiểm` is cleared.
- Submitting with a known phone returns matching rows; an unknown phone shows the no-result state.
- Idle state hides the result area.
- Unit-test `applySearch` (substring/AND/`Tất cả` rules) as the one piece of real logic.
