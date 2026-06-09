# Update Claim Request Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `Chỉnh sửa yêu cầu bồi thường` (Update Claim Request) page at `/yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe/:id/cap-nhat`, reusing the New Claim Request form sections pre-filled with mock data.

**Architecture:** Extract the five existing claim-form sections + form module into a shared `claim-form/` folder consumed by both the New and Update pages. The Update page renders the same AntD `<Form>` pre-filled from a per-id mock lookup, hides the customer-search field, adds a read-only claim-file history table, and uses a three-button footer.

**Tech Stack:** React + TypeScript, React Router (`useParams`), Ant Design v6, Tailwind, dayjs (transitive via antd). **No test runner exists** (no vitest) — each task is verified with `npm run build` (`tsc -b && vite build`) and `npm run lint`, then a final browser check. Follow the project convention: UI + mock only, no API.

**Spec:** `docs/superpowers/specs/2026-06-09-update-claim-request-design.md`

---

## File Structure

| File | Responsibility |
|---|---|
| `src/pages/claim-requests/claim-form/claim-form.ts` | (moved) Types, option lists, `initialValues`, mock customers, `findCustomer`. Type renamed `NewClaimRequestForm` → `ClaimForm`. |
| `src/pages/claim-requests/claim-form/components/GeneralInfoSection.tsx` | (moved) Thông tin chung |
| `src/pages/claim-requests/claim-form/components/InsuredPersonSection.tsx` | (moved) Thông tin về người được bảo hiểm + new `showCustomerSearch` prop |
| `src/pages/claim-requests/claim-form/components/AccidentInfoSection.tsx` | (moved) Thông tin về tai nạn và khám chữa |
| `src/pages/claim-requests/claim-form/components/ClaimAmountSection.tsx` | (moved) Nội dung yêu cầu chi trả bảo hiểm |
| `src/pages/claim-requests/claim-form/components/BeneficiarySection.tsx` | (moved) Thông tin người thụ hưởng |
| `src/pages/claim-requests/new-claim-request/NewClaimRequestPage.tsx` | (modify) Update imports to `../claim-form/...` |
| `src/pages/claim-requests/update-claim-request/update-claim-request-mock.ts` | (new) Per-id mock claim lookup + history-row type |
| `src/pages/claim-requests/update-claim-request/components/ClaimHistorySection.tsx` | (new) `Thông tin Hồ sơ bồi thường đã tạo` table |
| `src/pages/claim-requests/update-claim-request/UpdateClaimRequestPage.tsx` | (new) Page shell + form + footer |
| `src/app/router.tsx` | (modify) Replace `PlaceholderPage` at `.../:id/cap-nhat` |

---

## Task 1: Move form module into shared `claim-form/` folder

**Files:**
- Move: `src/pages/claim-requests/new-claim-request/new-claim-request-form.ts` → `src/pages/claim-requests/claim-form/claim-form.ts`

- [ ] **Step 1: git-move the file into the new folder**

```bash
cd /Users/endsha/Documents/pvi/ppt/demo-admin-ppt
mkdir -p src/pages/claim-requests/claim-form/components
git mv src/pages/claim-requests/new-claim-request/new-claim-request-form.ts \
       src/pages/claim-requests/claim-form/claim-form.ts
```

- [ ] **Step 2: Rename the exported type `NewClaimRequestForm` → `ClaimForm`**

In `src/pages/claim-requests/claim-form/claim-form.ts`, change the interface declaration line:

```ts
export interface ClaimForm {
```

(was `export interface NewClaimRequestForm {`). Everything else in the file is unchanged. The `initialValues` typing becomes:

```ts
export const initialValues: Partial<ClaimForm> = {
  claimCases: [],
}
```

- [ ] **Step 3: Verify the file lints in isolation (importers fixed in later tasks)**

Run: `npm run lint -- src/pages/claim-requests/claim-form/claim-form.ts`
Expected: PASS for this file (importers still point at the old path — those are fixed in Tasks 2–3, so do NOT run a full build yet).

- [ ] **Step 4: Commit**

```bash
git add -A src/pages/claim-requests/claim-form/claim-form.ts
git commit -m "refactor(claim-requests): move claim form module to shared claim-form/ folder"
```

---

## Task 2: Move section components into `claim-form/components/`

**Files:**
- Move: `new-claim-request/components/{GeneralInfoSection,InsuredPersonSection,AccidentInfoSection,ClaimAmountSection,BeneficiarySection}.tsx` → `claim-form/components/`

- [ ] **Step 1: git-move all five section files**

```bash
cd /Users/endsha/Documents/pvi/ppt/demo-admin-ppt
git mv src/pages/claim-requests/new-claim-request/components/GeneralInfoSection.tsx   src/pages/claim-requests/claim-form/components/GeneralInfoSection.tsx
git mv src/pages/claim-requests/new-claim-request/components/InsuredPersonSection.tsx src/pages/claim-requests/claim-form/components/InsuredPersonSection.tsx
git mv src/pages/claim-requests/new-claim-request/components/AccidentInfoSection.tsx  src/pages/claim-requests/claim-form/components/AccidentInfoSection.tsx
git mv src/pages/claim-requests/new-claim-request/components/ClaimAmountSection.tsx   src/pages/claim-requests/claim-form/components/ClaimAmountSection.tsx
git mv src/pages/claim-requests/new-claim-request/components/BeneficiarySection.tsx   src/pages/claim-requests/claim-form/components/BeneficiarySection.tsx
```

- [ ] **Step 2: Fix the form-module import in `GeneralInfoSection.tsx`**

Change line 2:

```ts
import { receivingSourceOptions } from '../claim-form'
```

(was `from '../new-claim-request-form'`).

- [ ] **Step 3: Fix the form-module import in `ClaimAmountSection.tsx`**

Change line 2:

```ts
import { claimCaseOptions } from '../claim-form'
```

- [ ] **Step 4: Add the `showCustomerSearch` prop to `InsuredPersonSection.tsx`**

Replace the import line, the function signature, and wrap the customer-search `Col` in a conditional. Full new top of file (down to the conditional block):

```tsx
import { Col, Form, Input, Row, Select } from 'antd'
import { customerOptions, findCustomer, genderOptions } from '../claim-form'

interface InsuredPersonSectionProps {
  showCustomerSearch?: boolean
}

export function InsuredPersonSection({ showCustomerSearch = true }: InsuredPersonSectionProps) {
  const form = Form.useFormInstance()
  const idNumber = Form.useWatch<string | undefined>('idNumber', form)
  const dob = Form.useWatch<string | undefined>('dob', form)

  const handleSelectCustomer = (value: string) => {
    const customer = findCustomer(value)
    if (!customer) return
    form.setFieldsValue({
      driverCode: customer.driverCode,
      fullName: customer.fullName,
      gender: customer.gender,
      idNumber: customer.idNumber,
      dob: customer.dob,
      phone: customer.phone,
      email: customer.email,
      zalo: customer.zalo,
    })
  }

  return (
    <section>
      <h2 className="mb-4 text-base font-semibold text-gray-800">
        Thông tin về người được bảo hiểm
      </h2>
      <Row gutter={[16, 0]}>
        {showCustomerSearch && (
          <Col xs={24}>
            <Form.Item
              label="Tìm thông tin khách hàng"
              name="customerSearch"
              rules={[{ required: true, message: 'Vui lòng chọn khách hàng' }]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                options={customerOptions}
                onChange={handleSelectCustomer}
                placeholder="Nhập số hợp đồng nguyên tắc, số điện thoại hoặc mã tài xế GSM để tìm kiếm"
              />
            </Form.Item>
          </Col>
        )}
```

Leave the rest of the file (the `Mã Tài xế GSM` row onward, ending with the closing `</Row></section>` and `}`) exactly as-is.

- [ ] **Step 5: Lint the moved component files**

Run: `npm run lint -- src/pages/claim-requests/claim-form/components/`
Expected: PASS (no unresolved imports within these files).

- [ ] **Step 6: Commit**

```bash
git add -A src/pages/claim-requests/claim-form/components/
git commit -m "refactor(claim-requests): move form sections to claim-form/, add showCustomerSearch prop"
```

---

## Task 3: Re-point the New page imports and remove the empty old folder

**Files:**
- Modify: `src/pages/claim-requests/new-claim-request/NewClaimRequestPage.tsx`

- [ ] **Step 1: Update imports in `NewClaimRequestPage.tsx`**

Replace lines 3–8 (the form + section imports) with:

```tsx
import { initialValues, type ClaimForm } from '../claim-form/claim-form'
import { GeneralInfoSection } from '../claim-form/components/GeneralInfoSection'
import { InsuredPersonSection } from '../claim-form/components/InsuredPersonSection'
import { AccidentInfoSection } from '../claim-form/components/AccidentInfoSection'
import { ClaimAmountSection } from '../claim-form/components/ClaimAmountSection'
import { BeneficiarySection } from '../claim-form/components/BeneficiarySection'
```

- [ ] **Step 2: Update the form generic type reference**

In the same file, change the `useForm` line:

```tsx
  const [form] = Form.useForm<ClaimForm>()
```

(was `Form.useForm<NewClaimRequestForm>()`). No other change — the New page still renders `<InsuredPersonSection />` with no prop (search field shows by default).

- [ ] **Step 3: Confirm the old `new-claim-request/components/` folder is empty and remove it**

```bash
cd /Users/endsha/Documents/pvi/ppt/demo-admin-ppt
rmdir src/pages/claim-requests/new-claim-request/components 2>/dev/null || true
ls src/pages/claim-requests/new-claim-request/
```

Expected: only `NewClaimRequestPage.tsx` remains.

- [ ] **Step 4: Full build + lint — the New page must still compile end-to-end**

Run: `npm run build && npm run lint`
Expected: PASS, no TypeScript errors. This proves the refactor is behavior-neutral.

- [ ] **Step 5: Commit**

```bash
git add -A src/pages/claim-requests/new-claim-request/
git commit -m "refactor(claim-requests): point New page at shared claim-form module"
```

---

## Task 4: Create the per-id mock claim lookup

**Files:**
- Create: `src/pages/claim-requests/update-claim-request/update-claim-request-mock.ts`

- [ ] **Step 1: Write the mock module**

Create `src/pages/claim-requests/update-claim-request/update-claim-request-mock.ts` with exactly:

```ts
import dayjs from 'dayjs'
import type { ClaimForm } from '../claim-form/claim-form'

export interface ClaimHistoryRow {
  id: string
  claimFileCode: string // Mã Hồ sơ bồi thường
  masterPolicyNumber: string // Mã hợp đồng nguyên tắc
  createdBy: string // Người tạo
  createdAt: string // Ngày tạo
  status: string // Trạng thái
}

export interface MockClaim extends ClaimForm {
  historyRows: ClaimHistoryRow[]
}

// Matches docs/ui/update-claim-request-ppt-01.png / -02.png
const defaultClaim: MockClaim = {
  receivingSource: undefined,
  driverCode: '6123723',
  fullName: 'Phạm Xuân Đông Hải',
  gender: 'male',
  idNumber: undefined,
  dob: undefined,
  phone: '+84968532564',
  email: undefined,
  zalo: undefined,
  accidentDate: dayjs('2026-05-31'),
  accidentPlace: 'Phường thới an',
  examDate: dayjs('2026-06-03'),
  admissionDate: undefined,
  treatmentPlace: 'Tiêm chủng Long Châu',
  diagnosis: 'Chó cắn',
  consequence: 'Tiêm vắc xin',
  treatmentType: 'outpatient',
  fromDate: undefined,
  toDate: undefined,
  claimAmount: 1725000,
  claimCases: ['medical'],
  beneficiary: 'Phạm Xuân Đông Hải',
  accountNumber: '060194546850',
  bankName: 'Sacombank',
  bankAddress: '207 Lê Văn Khương, phường thới an, tp Hồ Chí Minh',
  historyRows: [],
}

// Keyed by claim-requests list row ids (src/pages/claim-requests/mock-data.ts).
// Row id '1' is this exact driver (6123723 / Phạm Xuân Đông Hải).
export const mockClaimsById: Record<string, MockClaim> = {
  '1': defaultClaim,
}

export function findClaim(id?: string): MockClaim {
  return (id && mockClaimsById[id]) || defaultClaim
}
```

- [ ] **Step 2: Lint + typecheck the module**

Run: `npm run lint -- src/pages/claim-requests/update-claim-request/update-claim-request-mock.ts`
Expected: PASS. (If `dayjs` default import errors, note the project already uses `import type { Dayjs } from 'dayjs'`; `import dayjs from 'dayjs'` resolves via antd's dependency under `esModuleInterop`.)

- [ ] **Step 3: Commit**

```bash
git add -A src/pages/claim-requests/update-claim-request/update-claim-request-mock.ts
git commit -m "feat(claim-requests): add update claim mock lookup"
```

---

## Task 5: Create the claim-file history section

**Files:**
- Create: `src/pages/claim-requests/update-claim-request/components/ClaimHistorySection.tsx`

- [ ] **Step 1: Write the component**

Create `src/pages/claim-requests/update-claim-request/components/ClaimHistorySection.tsx` with exactly:

```tsx
import { Button, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { ClaimHistoryRow } from '../update-claim-request-mock'

interface ClaimHistorySectionProps {
  rows: ClaimHistoryRow[]
}

const columns: ColumnsType<ClaimHistoryRow> = [
  { title: 'Mã Hồ sơ bồi thường', dataIndex: 'claimFileCode', key: 'claimFileCode' },
  { title: 'Mã hợp đồng nguyên tắc', dataIndex: 'masterPolicyNumber', key: 'masterPolicyNumber' },
  { title: 'Người tạo', dataIndex: 'createdBy', key: 'createdBy' },
  { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt' },
  { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
  {
    title: 'Hành động',
    key: 'action',
    width: 90,
    render: () => <Button type="link">Xem</Button>,
  },
]

export function ClaimHistorySection({ rows }: ClaimHistorySectionProps) {
  return (
    <section>
      <h2 className="mb-4 text-base font-semibold text-gray-800">
        Thông tin Hồ sơ bồi thường đã tạo
      </h2>
      <Table<ClaimHistoryRow>
        rowKey="id"
        columns={columns}
        dataSource={rows}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </section>
  )
}
```

- [ ] **Step 2: Lint the component**

Run: `npm run lint -- src/pages/claim-requests/update-claim-request/components/ClaimHistorySection.tsx`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add -A src/pages/claim-requests/update-claim-request/components/ClaimHistorySection.tsx
git commit -m "feat(claim-requests): add claim file history section"
```

---

## Task 6: Create the Update page

**Files:**
- Create: `src/pages/claim-requests/update-claim-request/UpdateClaimRequestPage.tsx`

- [ ] **Step 1: Write the page**

Create `src/pages/claim-requests/update-claim-request/UpdateClaimRequestPage.tsx` with exactly:

```tsx
import { Breadcrumb, Button, Form, Tooltip, message } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { type ClaimForm } from '../claim-form/claim-form'
import { GeneralInfoSection } from '../claim-form/components/GeneralInfoSection'
import { InsuredPersonSection } from '../claim-form/components/InsuredPersonSection'
import { AccidentInfoSection } from '../claim-form/components/AccidentInfoSection'
import { ClaimAmountSection } from '../claim-form/components/ClaimAmountSection'
import { BeneficiarySection } from '../claim-form/components/BeneficiarySection'
import { ClaimHistorySection } from './components/ClaimHistorySection'
import { findClaim } from './update-claim-request-mock'

const LIST_PATH = '/yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe'

export function UpdateClaimRequestPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const claim = findClaim(id)
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm<ClaimForm>()

  const handleFinish = () => {
    messageApi.success('Đã cập nhật yêu cầu bồi thường')
    navigate(LIST_PATH)
  }

  const handleReset = () => form.resetFields()

  const handleCreateClaimFile = () => {
    messageApi.success('Đã tạo Hồ sơ bồi thường')
  }

  return (
    <div className="flex flex-col gap-4">
      {contextHolder}
      <div className="flex flex-col gap-1">
        <Breadcrumb
          items={[
            { title: 'Yêu cầu bồi thường' },
            { title: 'Bảo hiểm tích lũy tài xế' },
            { title: 'Chỉnh sửa yêu cầu bồi thường' },
          ]}
        />
        <h1 className="text-xl font-semibold text-gray-800">Chỉnh sửa yêu cầu bồi thường</h1>
      </div>

      <Form
        form={form}
        layout="vertical"
        requiredMark
        initialValues={claim}
        onFinish={handleFinish}
        className="flex flex-col gap-8 rounded-lg border border-gray-100 bg-white p-6 shadow-sm"
      >
        <GeneralInfoSection />
        <InsuredPersonSection showCustomerSearch={false} />
        <AccidentInfoSection />
        <ClaimAmountSection />
        <BeneficiarySection />
        <ClaimHistorySection rows={claim.historyRows} />

        <div className="flex items-center gap-3">
          <Button color="green" variant="solid" onClick={handleCreateClaimFile}>
            Tạo Hồ sơ bồi thường
          </Button>
          <Button onClick={handleReset}>Làm lại</Button>
          <Tooltip title="Cập nhật Yêu cầu bồi thường">
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Tooltip>
        </div>
      </Form>
    </div>
  )
}
```

- [ ] **Step 2: Lint the page**

Run: `npm run lint -- src/pages/claim-requests/update-claim-request/UpdateClaimRequestPage.tsx`
Expected: PASS. If `<Button color="green" variant="solid">` raises a type error on this antd version, replace that one button with:

```tsx
<Button type="primary" className="!bg-green-600 hover:!bg-green-700 !border-green-600" onClick={handleCreateClaimFile}>
  Tạo Hồ sơ bồi thường
</Button>
```

- [ ] **Step 3: Commit**

```bash
git add -A src/pages/claim-requests/update-claim-request/UpdateClaimRequestPage.tsx
git commit -m "feat(claim-requests): add update claim request page"
```

---

## Task 7: Wire the route

**Files:**
- Modify: `src/app/router.tsx`

- [ ] **Step 1: Add the import**

Near the other claim imports (around line 14), add:

```tsx
import { UpdateClaimRequestPage } from '../pages/claim-requests/update-claim-request/UpdateClaimRequestPage'
```

- [ ] **Step 2: Replace the placeholder route element**

Change the `.../:id/cap-nhat` route (currently lines ~52–55) to:

```tsx
      {
        path: 'yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe/:id/cap-nhat',
        element: <UpdateClaimRequestPage />,
      },
```

Leave the `.../:id/giay-ycbt` `PlaceholderPage` route untouched. `PlaceholderPage` stays imported (other routes still use it — verify with `grep -c PlaceholderPage src/app/router.tsx`; do not remove the import while count > 1).

- [ ] **Step 3: Full build + lint**

Run: `npm run build && npm run lint`
Expected: PASS, no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add -A src/app/router.tsx
git commit -m "feat(claim-requests): register update claim request route"
```

---

## Task 8: Browser verification against the screenshots

**Files:** none (manual/automated visual check)

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Expected: Vite serves on a local URL (e.g. http://localhost:5173).

- [ ] **Step 2: Open the Update page and compare to the screenshots**

Navigate to `http://localhost:5173/yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe/1/cap-nhat` (Playwright MCP browser or a real browser). Verify against `docs/ui/update-claim-request-ppt-01.png` / `-02.png`:

- Title + breadcrumb read `Chỉnh sửa yêu cầu bồi thường`.
- Insured section has **no** `Tìm thông tin khách hàng` field; starts at `Mã Tài xế GSM` = `6123723`, `Họ và tên` = `Phạm Xuân Đông Hải`, `Giới tính` = `Nam`.
- `Số CMND/ CCCD/ Hộ chiếu` and `Ngày sinh` show `-`. `Số điện thoại` = `+84968532564`.
- `Ngày tai nạn` = `31/05/2026`, `Nơi xảy ra tai nạn` = `Phường thới an`, `Ngày khám bệnh` = `03/06/2026`, `Nơi điều trị` = `Tiêm chủng Long Châu`, `Nguyên nhân / Chẩn đoán về tai nạn` = `Chó cắn`, `Hậu quả` = `Tiêm vắc xin`, `Hình thức điều trị` = `Ngoại trú` selected.
- `Tổng số tiền yêu cầu chi trả` = `1,725,000`, `Chi phí y tế` checkbox checked.
- `Người thụ hưởng` = `Phạm Xuân Đông Hải`, `Số tài khoản` = `060194546850`, `Ngân hàng` = `Sacombank`, `Địa chỉ ngân hàng` = `207 Lê Văn Khương, phường thới an, tp Hồ Chí Minh`.
- `Thông tin Hồ sơ bồi thường đã tạo` table shows the six headers and an empty state.
- Footer: green `Tạo Hồ sơ bồi thường`, default `Làm lại`, primary `Lưu`.

- [ ] **Step 3: Verify interactions**

- Click `Tạo Hồ sơ bồi thường` → success toast `Đã tạo Hồ sơ bồi thường`, no navigation.
- Hover `Lưu` → tooltip `Cập nhật Yêu cầu bồi thường`. Click `Lưu` → success toast `Đã cập nhật yêu cầu bồi thường` → returns to the list page.
- Click `Làm lại` after editing a field → field reverts to the loaded value.
- From the list page, clicking the Edit (pencil) icon on a row opens this page.

- [ ] **Step 4: Final full check**

Run: `npm run build && npm run lint`
Expected: PASS. Stop the dev server.

---

## Self-Review Notes

- **Spec coverage:** Route swap (Task 7), shared-folder refactor + `showCustomerSearch` (Tasks 1–3), page shell + section order (Task 6), history table with exact headers (Task 5), three-button footer with exact labels + tooltip (Task 6), per-id mock with verbatim values (Task 4), verification (Task 8). All spec sections mapped.
- **Type consistency:** `ClaimForm` defined in Task 1, consumed in Tasks 3/4/6. `MockClaim`/`ClaimHistoryRow`/`findClaim` defined in Task 4, consumed in Tasks 5/6. `showCustomerSearch` defined in Task 2, used in Task 6.
- **No test runner:** verification uses `npm run build` + `npm run lint` + browser, per project reality (no vitest). This is the same convention the New Claim Request page followed.
