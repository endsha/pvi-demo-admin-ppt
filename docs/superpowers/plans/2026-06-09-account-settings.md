# Account Settings Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `cai-dat-tai-khoan` placeholder with a real "Cài đặt tài khoản" page — a centered card form pre-filled from a mock account profile, with a conditional password-change block and a success-message submit (no API).

**Architecture:** A small feature folder under `src/pages/account-settings/` following the `gsm-search/` pattern: a single page component holding the AntD form, plus a `mock-data.ts` for the pre-fill profile. The password block is conditionally rendered via `Form.useWatch`. Submit shows an AntD `message.success`; reset restores the mock values.

**Tech Stack:** React 19 + TypeScript, AntD v6 (`Form`/`Input`/`Input.Password`/`Switch`/`Button`/`message`), Tailwind v4 utilities, react-router v7. Verified by `npm run build` + `npm run lint` + Playwright (no test runner in this repo).

**Spec:** `docs/superpowers/specs/2026-06-09-account-settings-design.md`

**Conventions reused (read before starting):**
- `src/pages/gsm-search/components/GsmSearchForm.tsx` — AntD `Form` (`layout="vertical"`, `Form.useForm`, `initialValues`), centered card `mx-auto w-full max-w-[640px]` + `rounded-lg border border-gray-100 bg-white p-6 shadow-sm`.
- `docs/rules/ui-ux-strict.md` rule #2 — toggle must conditionally reveal its block via `Form.useWatch` + `{flag && <block/>}`.

> The screenshot shows only the centered card and the page footer (the footer already lives in `AdminLayout`). Per `docs/rules/ui-ux-strict.md`, do **not** add a breadcrumb or page `<h1>` — the card's centered `<h2>` "Cài đặt tài khoản" is the only heading.

---

### Task 1: Mock account profile

**Files:**
- Create: `src/pages/account-settings/mock-data.ts`

- [ ] **Step 1: Create the mock-data file**

```ts
export interface AccountProfile {
  name: string
  phone: string
  email: string
}

// Mock pre-fill values from the screenshot (spec §7). UI-only, no API/persistence.
export const defaultAccount: AccountProfile = {
  name: 'PVI Digital',
  phone: '02899998386',
  email: 'admin@pvi.digital',
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: PASS (file not yet imported; confirms it type-checks).

- [ ] **Step 3: Commit**

```bash
git add src/pages/account-settings/mock-data.ts
git commit -m "feat(account-settings): add mock account profile"
```

---

### Task 2: Account settings page (form)

**Files:**
- Create: `src/pages/account-settings/AccountSettingsPage.tsx`

- [ ] **Step 1: Create the page component**

```tsx
import { Button, Form, Input, Switch, message } from 'antd'
import { defaultAccount } from './mock-data'

interface FormShape {
  name: string
  phone?: string
  email: string
  changePassword: boolean
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}

const initialValues: FormShape = {
  name: defaultAccount.name,
  phone: defaultAccount.phone,
  email: defaultAccount.email,
  changePassword: false,
}

export function AccountSettingsPage() {
  const [form] = Form.useForm<FormShape>()
  const [messageApi, contextHolder] = message.useMessage()
  const changePassword = Form.useWatch('changePassword', form)

  const handleFinish = () => {
    // UI only — no API call (spec §6). Edited values are kept in form state.
    messageApi.success('Cập nhật thành công')
  }

  const handleReset = () => {
    form.resetFields()
  }

  return (
    <div className="mx-auto w-full max-w-[640px]">
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleFinish}
        requiredMark
        className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-5 text-center text-base font-semibold text-gray-800">
          Cài đặt tài khoản
        </h2>

        <Form.Item
          label="Tên"
          name="name"
          className="mb-4"
          rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
        >
          <Input placeholder="Nhập tên" allowClear />
        </Form.Item>

        <Form.Item label="Số điện thoại" name="phone" className="mb-4">
          <Input placeholder="Nhập số điện thoại" allowClear />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          className="mb-4"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input placeholder="Nhập email" allowClear />
        </Form.Item>

        <Form.Item
          label="Thay đổi mật khẩu"
          name="changePassword"
          valuePropName="checked"
          className="mb-4"
        >
          <Switch />
        </Form.Item>

        {changePassword && (
          <>
            <Form.Item
              label="Mật khẩu hiện tại"
              name="currentPassword"
              className="mb-4"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
            >
              <Input.Password placeholder="Nhập mật khẩu hiện tại" />
            </Form.Item>
            <Form.Item
              label="Mật khẩu mới"
              name="newPassword"
              className="mb-4"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
            >
              <Input.Password placeholder="Nhập mật khẩu mới" />
            </Form.Item>
            <Form.Item
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              className="mb-4"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp'))
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Nhập lại mật khẩu mới" />
            </Form.Item>
          </>
        )}

        <div className="flex gap-2">
          <Button onClick={handleReset}>Làm lại</Button>
          <Button type="primary" htmlType="submit">
            Cập nhật
          </Button>
        </div>
      </Form>
    </div>
  )
}
```

> Notes:
> - `Form.useWatch('changePassword', form)` drives the conditional block (ui-ux-strict rule #2). Hidden fields are not validated by AntD.
> - `message.useMessage()` is the hook form; `{contextHolder}` must be rendered for the toast to appear.
> - `required` rules on Tên/Email auto-render the `*` markers matching the screenshot.

- [ ] **Step 2: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: PASS. (Component not yet mounted; confirms imports/types and the `react-refresh/only-export-components` rule — this file exports only the component.)

- [ ] **Step 3: Commit**

```bash
git add src/pages/account-settings/AccountSettingsPage.tsx
git commit -m "feat(account-settings): add settings form with conditional password block"
```

---

### Task 3: Wire the route

**Files:**
- Modify: `src/app/router.tsx`

- [ ] **Step 1: Add the import**

In `src/app/router.tsx`, add next to the other page imports:

```tsx
import { AccountSettingsPage } from '../pages/account-settings/AccountSettingsPage'
```

- [ ] **Step 2: Swap the route element**

Replace this line:

```tsx
      { path: 'cai-dat-tai-khoan', element: <PlaceholderPage title="Cài đặt tài khoản" /> },
```

with:

```tsx
      { path: 'cai-dat-tai-khoan', element: <AccountSettingsPage /> },
```

(Leave the `PlaceholderPage` import — it is still used by other routes.)

- [ ] **Step 3: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/app/router.tsx
git commit -m "feat(account-settings): wire page to /cai-dat-tai-khoan route"
```

---

### Task 4: Visual verification (Playwright)

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev` (background). Note the URL (Vite default: `http://localhost:5173`).

- [ ] **Step 2: Verify the pre-filled form**

Open `http://localhost:5173/cai-dat-tai-khoan`. Confirm:
- Centered card with centered heading "Cài đặt tài khoản".
- "Tên" (red `*`) pre-filled `PVI Digital`; "Số điện thoại" pre-filled `02899998386` (no `*`); "Email" (red `*`) pre-filled `admin@pvi.digital`; each input shows a clear (`×`) affordance.
- "Thay đổi mật khẩu" switch is OFF; no password fields visible.
- "Làm lại" (default) and "Cập nhật" (primary) buttons. No breadcrumb / page heading. Footer "Powered by PVI Digital" present.

Take a screenshot at 1440 width.

- [ ] **Step 3: Verify required + email validation**

Clear "Tên" and press "Cập nhật" → error "Vui lòng nhập tên". Restore Tên. Set "Email" to `not-an-email`, press "Cập nhật" → error "Email không hợp lệ".

- [ ] **Step 4: Verify password reveal + match rule**

Restore a valid email. Toggle "Thay đổi mật khẩu" ON → confirm three fields appear: "Mật khẩu hiện tại", "Mật khẩu mới", "Xác nhận mật khẩu". Enter `abc123` in "Mật khẩu mới" and `xyz999` in "Xác nhận mật khẩu", press "Cập nhật" → error "Mật khẩu xác nhận không khớp". Toggle OFF → the three fields disappear.

- [ ] **Step 5: Verify successful submit**

With the toggle OFF and valid Tên/Email, press "Cập nhật" → a success toast "Cập nhật thành công" appears.

- [ ] **Step 6: Verify reset**

Edit "Tên" to something else, press "Làm lại" → "Tên" returns to `PVI Digital` and the password switch is off.

- [ ] **Step 7: Final build + lint gate**

Run: `npm run build && npm run lint`
Expected: PASS. Stop the dev server.

---

## Self-Review

**Spec coverage:**
- §3 file structure (page + mock-data) → Tasks 1–2; router change → Task 3. ✓
- §4 form fields (exact labels, pre-filled values, allowClear, required Tên/Email + email format, button order) → Task 2. ✓
- §5 conditional password block (Form.useWatch, 3 fields, confirm-matches-new validator) → Task 2. ✓
- §6 behavior (success message, keep edited values, reset to defaults, hidden fields not validated) → Task 2 + Task 4. ✓
- §7 mock data (`AccountProfile` + `defaultAccount`) → Task 1. ✓
- §8 mock assumptions (password block, message text) → Task 2 comments + spec. ✓
- §10 testing via build + lint + Playwright → Tasks 1–4. ✓

**Placeholder scan:** No TBD/TODO; every code step shows complete code. ✓

**Type consistency:** `AccountProfile` / `defaultAccount` (mock-data) consumed by `AccountSettingsPage`'s `initialValues`; `FormShape` field names (`name`, `phone`, `email`, `changePassword`, `currentPassword`, `newPassword`, `confirmPassword`) used consistently across `Form.Item` `name` props, the `useWatch` key, and the `getFieldValue('newPassword')` validator. ✓
