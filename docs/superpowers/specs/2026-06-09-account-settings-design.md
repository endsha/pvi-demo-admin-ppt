# Account Settings Page — Design

**Date:** 2026-06-09
**Route:** `/cai-dat-tai-khoan`
**Scope:** UI + mock data only. No API, no API mocking layer.
**Reference:** `docs/ui/account-setting.png`

---

## 1. Goal

Replace the current `PlaceholderPage` mounted at `cai-dat-tai-khoan` with a real "Cài đặt tài khoản"
page: a centered card form, pre-filled from a mock account profile, with profile fields, a
conditional "change password" block, and Reset / Update buttons. Submitting shows a success
message — there is no API call.

The sidebar entry already exists (`SidebarNav.tsx`:
`{ key: '/cai-dat-tai-khoan', icon: <UserOutlined />, label: 'Cài đặt tài khoản' }`) and the
`Powered by PVI Digital` footer already lives in `AdminLayout`. Neither needs changes.

## 2. Conventions

Follow the existing feature-folder pattern used by `src/pages/gsm-search/`:
- A page container plus a `mock-data.ts` file.
- AntD `Form` (`layout="vertical"`), `Input`, `Input.Password`, `Switch`, `Button`, `message`.
- Tailwind card styling already in use (`rounded-lg border border-gray-100 bg-white p-6 shadow-sm`).
- Immutable updates; explicit prop/types; no `any`.
- Conditional reveal via `Form.useWatch` + `{flag && <block/>}`, per `docs/rules/ui-ux-strict.md` rule #2.

## 3. File structure

```
src/pages/account-settings/
├── AccountSettingsPage.tsx     # centered card: profile fields + password toggle/block + buttons + submit
└── mock-data.ts                # AccountProfile type + defaultAccount pre-fill values
```

Router change (`src/app/router.tsx`): swap
`{ path: 'cai-dat-tai-khoan', element: <PlaceholderPage title="Cài đặt tài khoản" /> }`
for `{ path: 'cai-dat-tai-khoan', element: <AccountSettingsPage /> }` and add the import.
Leave the `PlaceholderPage` import (still used by other routes).

## 4. Form (faithful to screenshot)

Centered card, ~max-width 640px, centered heading **"Cài đặt tài khoản"**.
All text inputs use `allowClear` (the `×` clear icon shown in the design).

| Field | Control | Label (exact) | Pre-filled value | Required |
|---|---|---|---|---|
| Name | `Input` | `Tên` (with `*`) | `PVI Digital` | **Yes** |
| Phone | `Input` | `Số điện thoại` | `02899998386` | No |
| Email | `Input` | `Email` (with `*`) | `admin@pvi.digital` | **Yes** + email format |
| Change password | `Switch` | `Thay đổi mật khẩu` | off | — |

Buttons below (left-aligned, in this order): **`Làm lại`** (default) and **`Cập nhật`** (primary).

The `*` on Tên / Email comes from AntD `required` rules (auto-rendered marker).

## 5. Conditional password block

A boolean form field `changePassword` backs the `Switch`. Watched with
`Form.useWatch('changePassword', form)`. When **true**, render below the switch:

| Field | Control | Label (exact) | Rules |
|---|---|---|---|
| Current password | `Input.Password` | `Mật khẩu hiện tại` | required |
| New password | `Input.Password` | `Mật khẩu mới` | required |
| Confirm password | `Input.Password` | `Xác nhận mật khẩu` | required; must equal `Mật khẩu mới` |

The confirm rule uses AntD's validator pattern (`getFieldValue('newPassword')`).
When the switch is **off**, the block is not rendered and its fields are not validated.

## 6. Behavior (no API)

- **Cập nhật** (`htmlType="submit"`, `onFinish`): AntD validates required Tên/Email, email format,
  and the password rules **only when** `changePassword` is on. On success →
  `message.success('Cập nhật thành công')`. The form keeps its edited values. No API call,
  no fetch/mock-fetch layer.
- **Làm lại**: `form.resetFields()` restores the original mock values (`defaultAccount`) and turns
  the password switch off (back to `initialValues`).
- Toggling the switch off hides the password block; hidden fields are not validated.

## 7. Mock data

```ts
export interface AccountProfile {
  name: string
  phone: string
  email: string
}

export const defaultAccount: AccountProfile = {
  name: 'PVI Digital',
  phone: '02899998386',
  email: 'admin@pvi.digital',
}
```

The form's `initialValues` derive from `defaultAccount` plus `changePassword: false`.

## 8. Mock assumptions (flagged — not in screenshot)

1. **Password fields:** the screenshot shows the toggle OFF only. The revealed block
   (Mật khẩu hiện tại / Mật khẩu mới / Xác nhận mật khẩu, with confirm-matches-new) is an
   approved, invented layout — marked in code comments.
2. **Success message text** `Cập nhật thành công` is an invented, codebase-consistent string.

## 9. Out of scope

- No real API, no fetch wrapper, no API-mock library.
- No avatar upload, no extra profile fields beyond the screenshot.
- No changes to sidebar, layout, or footer.
- No persistence — edited values live only in component/form state for the session.

## 10. Testing

This project has **no unit-test runner** (no vitest/jest); existing pages ship verified by
`build` + `lint` + Playwright visual checks. This page follows that convention — no test
framework is introduced.

Verification:
- After each task: `npm run build` (tsc + vite) and `npm run lint` must pass.
- Full-flow visual check with Playwright on `/cai-dat-tai-khoan`:
  - Form renders pre-filled with exact labels/values and `*` on Tên / Email.
  - Clearing Tên or Email and pressing Cập nhật shows the required error.
  - An invalid Email shows the email-format error.
  - Toggling `Thay đổi mật khẩu` ON reveals the 3 password fields; OFF hides them.
  - With the toggle ON, mismatched confirm shows the "must match" error.
  - A valid submit shows `Cập nhật thành công`.
  - `Làm lại` restores the original mock values and turns the toggle off.
