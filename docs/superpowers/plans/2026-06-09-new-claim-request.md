# New Claim Request Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `Thêm yêu cầu bồi thường` (New Claim Request) form page with mock data only — no API — matching `docs/ui/new-claim-request-ppt-01.png` and `-02.png` pixel/label-exact.

**Architecture:** A single AntD `<Form layout="vertical">` inside one white card, composed of five section components. Non-component exports (types, options, mock customers, initial values) live in a `.ts` module so every `.tsx` exports only components (passes `react-refresh/only-export-components`). Section components read the form via `Form.useFormInstance()` / `Form.useWatch` — no prop drilling. Selecting a mock customer autofills insured-person fields. Save validates client-side, shows a success toast, and navigates back to the list.

**Tech Stack:** React 19, TypeScript, Ant Design v6 (`antd`), `@ant-design/icons`, `dayjs`, `react-router-dom` v7, Tailwind v4. Package manager: **yarn**.

**Testing note:** This repo has **no test runner** (consistent with all existing pages). Verification per task is **typecheck + lint** (`npx tsc -b` / `yarn lint`), a full `yarn build` at the end, and visual comparison against the two screenshots. Do not add a test framework.

---

## File Structure

All new files under `src/pages/claim-requests/new-claim-request/`:

| File | Responsibility |
|---|---|
| `new-claim-request-form.ts` | Types, option lists, `initialValues`, `mockCustomers`, `findCustomer` helper. No JSX. |
| `components/GeneralInfoSection.tsx` | Section "Thông tin chung" (Nguồn tiếp nhận). |
| `components/InsuredPersonSection.tsx` | Section "Thông tin về người được bảo hiểm" + customer autofill + read-only displays. |
| `components/AccidentInfoSection.tsx` | Section "Thông tin về tai nạn và khám chữa". |
| `components/ClaimAmountSection.tsx` | Section "Nội dung yêu cầu chi trả bảo hiểm". |
| `components/BeneficiarySection.tsx` | Section "Thông tin người thụ hưởng" + `Upload.Dragger`. |
| `NewClaimRequestPage.tsx` | Page shell, `<Form>`, section assembly, footer buttons, save/reset. |

Modified files:
- `src/app/router.tsx` — swap the `them-moi` PlaceholderPage for `<NewClaimRequestPage />`.
- `src/main.tsx` — wrap `<RouterProvider>` in AntD `<App>` so `App.useApp()` message works app-wide.

---

## Task 1: Form module — types, options, mock data

**Files:**
- Create: `src/pages/claim-requests/new-claim-request/new-claim-request-form.ts`

- [ ] **Step 1: Create the module with all non-component exports**

```ts
import type { Dayjs } from 'dayjs'

export interface NewClaimRequestForm {
  receivingSource?: string
  customerSearch?: string
  driverCode?: string
  fullName?: string
  gender?: string
  idNumber?: string
  dob?: string
  phone?: string
  email?: string
  zalo?: string
  accidentDate?: Dayjs
  accidentPlace?: string
  examDate?: Dayjs
  admissionDate?: Dayjs
  treatmentPlace?: string
  diagnosis?: string
  consequence?: string
  treatmentType?: 'outpatient' | 'inpatient'
  fromDate?: Dayjs
  toDate?: Dayjs
  claimAmount?: number
  claimCases?: string[]
  beneficiary?: string
  accountNumber?: string
  bankName?: string
  bankAddress?: string
}

export interface MockCustomer {
  value: string
  label: string
  driverCode: string
  fullName: string
  gender: string
  idNumber: string
  dob: string
  phone: string
  email: string
  zalo: string
}

export const receivingSourceOptions = [
  { value: 'call_center', label: 'Tổng đài' },
  { value: 'email', label: 'Email' },
  { value: 'gsm_app', label: 'Ứng dụng GSM' },
  { value: 'counter', label: 'Trực tiếp tại quầy' },
]

export const genderOptions = [
  { value: 'Nam', label: 'Nam' },
  { value: 'Nữ', label: 'Nữ' },
  { value: 'Khác', label: 'Khác' },
]

export const claimCaseOptions = [
  { value: 'death', label: 'Tử vong' },
  { value: 'permanent_disability', label: 'Thương tật vĩnh viễn' },
  { value: 'medical', label: 'Chi phí y tế' },
  { value: 'hospital_allowance', label: 'Trợ cấp nằm viện' },
]

export const mockCustomers: MockCustomer[] = [
  {
    value: 'GSM-000123',
    label: 'GSM-000123 — Nguyễn Văn An — 0901234567',
    driverCode: 'GSM-000123',
    fullName: 'Nguyễn Văn An',
    gender: 'Nam',
    idNumber: '079090001234',
    dob: '12/05/1990',
    phone: '0901234567',
    email: 'an.nguyen@example.com',
    zalo: '0901234567',
  },
  {
    value: 'GSM-000456',
    label: 'GSM-000456 — Trần Thị Bình — 0912345678',
    driverCode: 'GSM-000456',
    fullName: 'Trần Thị Bình',
    gender: 'Nữ',
    idNumber: '079185004567',
    dob: '03/11/1985',
    phone: '0912345678',
    email: 'binh.tran@example.com',
    zalo: '0912345678',
  },
  {
    value: 'GSM-000789',
    label: 'GSM-000789 — Lê Hoàng Cường — 0987654321',
    driverCode: 'GSM-000789',
    fullName: 'Lê Hoàng Cường',
    gender: 'Nam',
    idNumber: '079092007890',
    dob: '27/08/1992',
    phone: '0987654321',
    email: 'cuong.le@example.com',
    zalo: '0987654321',
  },
]

export const customerOptions = mockCustomers.map((c) => ({
  value: c.value,
  label: c.label,
}))

export function findCustomer(value?: string): MockCustomer | undefined {
  return mockCustomers.find((c) => c.value === value)
}

export const initialValues: Partial<NewClaimRequestForm> = {
  claimCases: [],
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc -b`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/claim-requests/new-claim-request/new-claim-request-form.ts
git commit -m "feat(claim-requests): new claim request form types and mock data"
```

---

## Task 2: GeneralInfoSection — "Thông tin chung"

**Files:**
- Create: `src/pages/claim-requests/new-claim-request/components/GeneralInfoSection.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { Col, Form, Row, Select } from 'antd'
import { receivingSourceOptions } from '../new-claim-request-form'

export function GeneralInfoSection() {
  return (
    <section>
      <h2 className="mb-4 text-base font-semibold text-gray-800">Thông tin chung</h2>
      <Row gutter={[16, 0]}>
        <Col xs={24} md={8}>
          <Form.Item
            label="Nguồn tiếp nhận"
            name="receivingSource"
            rules={[{ required: true, message: 'Vui lòng chọn nguồn tiếp nhận' }]}
          >
            <Select options={receivingSourceOptions} placeholder="Vui lòng chọn nguồn tiếp nhận" />
          </Form.Item>
        </Col>
      </Row>
    </section>
  )
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `npx tsc -b && yarn lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/claim-requests/new-claim-request/components/GeneralInfoSection.tsx
git commit -m "feat(claim-requests): add general info section"
```

---

## Task 3: InsuredPersonSection — "Thông tin về người được bảo hiểm" (+ autofill)

**Files:**
- Create: `src/pages/claim-requests/new-claim-request/components/InsuredPersonSection.tsx`

Behavior: the `Tìm thông tin khách hàng` Select autofills the editable fields and the two
read-only displays via `form.setFieldsValue`. Số CMND/ CCCD/ Hộ chiếu and Ngày sinh are stored
in the form (fields `idNumber`, `dob`) but rendered as plain text via `Form.useWatch`, showing
`-` until a customer is selected.

- [ ] **Step 1: Create the component**

```tsx
import { Col, Form, Input, Row, Select } from 'antd'
import { customerOptions, findCustomer, genderOptions } from '../new-claim-request-form'

export function InsuredPersonSection() {
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

        <Col xs={24} md={8}>
          <Form.Item
            label="Mã Tài xế GSM"
            name="driverCode"
            rules={[{ required: true, message: 'Vui lòng nhập Mã Tài xế GSM' }]}
          >
            <Input placeholder="Vui lòng nhập Mã Tài xế GSM" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập Họ và tên' }]}
          >
            <Input placeholder="Vui lòng nhập Họ và tên" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item label="Giới tính" name="gender">
            <Select options={genderOptions} placeholder="Vui lòng chọn Giới tính" />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item label="Số CMND/ CCCD/ Hộ chiếu">
            <span className="text-gray-700">{idNumber || '-'}</span>
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item label="Ngày sinh">
            <span className="text-gray-700">{dob || '-'}</span>
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập Số điện thoại' }]}
          >
            <Input placeholder="Vui lòng nhập Số điện thoại" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item label="Email" name="email">
            <Input placeholder="Nhập Email" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Số điện thoại sử dụng Zalo" name="zalo">
            <Input placeholder="Nhập Số điện thoại sử dụng Zalo" />
          </Form.Item>
        </Col>
      </Row>
    </section>
  )
}
```

> Note: hidden form fields `idNumber` and `dob` are written by `setFieldsValue` even though
> they have no input control; AntD stores them and `useWatch` reads them. This is intentional.

- [ ] **Step 2: Typecheck + lint**

Run: `npx tsc -b && yarn lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/claim-requests/new-claim-request/components/InsuredPersonSection.tsx
git commit -m "feat(claim-requests): add insured person section with customer autofill"
```

---

## Task 4: AccidentInfoSection — "Thông tin về tai nạn và khám chữa"

**Files:**
- Create: `src/pages/claim-requests/new-claim-request/components/AccidentInfoSection.tsx`

All rows 2-col (`md={12}`). DatePickers full width. Từ ngày / Đến ngày always visible (no toggle).

- [ ] **Step 1: Create the component**

```tsx
import { Col, DatePicker, Form, Input, Radio, Row } from 'antd'

const datePickerProps = { className: 'w-full', format: 'DD/MM/YYYY' } as const

export function AccidentInfoSection() {
  return (
    <section>
      <h2 className="mb-4 text-base font-semibold text-gray-800">
        Thông tin về tai nạn và khám chữa
      </h2>
      <Row gutter={[16, 0]}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Ngày tai nạn"
            name="accidentDate"
            rules={[{ required: true, message: 'Vui lòng chọn ngày tai nạn' }]}
          >
            <DatePicker {...datePickerProps} placeholder="Vui lòng chọn ngày tai nạn" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Nơi xảy ra tai nạn"
            name="accidentPlace"
            rules={[{ required: true, message: 'Vui lòng nhập nơi xảy ra tai nạn' }]}
          >
            <Input placeholder="Vui lòng nhập nơi xảy ra tai nạn" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Ngày khám bệnh"
            name="examDate"
            rules={[{ required: true, message: 'Vui lòng chọn ngày khám bệnh' }]}
          >
            <DatePicker {...datePickerProps} placeholder="Vui lòng chọn ngày khám bệnh" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Ngày nhập viện" name="admissionDate">
            <DatePicker {...datePickerProps} placeholder="Vui lòng chọn ngày nhập viện" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item label="Nơi điều trị" name="treatmentPlace">
            <Input placeholder="Vui lòng nhập nơi điều trị" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Nguyên nhân / Chẩn đoán về tai nạn"
            name="diagnosis"
            rules={[{ required: true, message: 'Vui lòng nhập nguyên nhân / chẩn đoán về tai nạn' }]}
          >
            <Input placeholder="Vui lòng nhập nguyên nhân / chẩn đoán về tai nạn" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Hậu quả"
            name="consequence"
            rules={[{ required: true, message: 'Vui lòng nhập hậu quả' }]}
          >
            <Input placeholder="Vui lòng nhập hậu quả" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Hình thức điều trị"
            name="treatmentType"
            rules={[{ required: true, message: 'Vui lòng chọn hình thức điều trị' }]}
          >
            <Radio.Group>
              <Radio value="outpatient">Ngoại trú</Radio>
              <Radio value="inpatient">Nội trú</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item label="Từ ngày" name="fromDate">
            <DatePicker {...datePickerProps} placeholder="Vui lòng chọn ngày bắt đầu" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Đến ngày" name="toDate">
            <DatePicker {...datePickerProps} placeholder="Vui lòng chọn ngày kết thúc" />
          </Form.Item>
        </Col>
      </Row>
    </section>
  )
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `npx tsc -b && yarn lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/claim-requests/new-claim-request/components/AccidentInfoSection.tsx
git commit -m "feat(claim-requests): add accident and treatment info section"
```

---

## Task 5: ClaimAmountSection — "Nội dung yêu cầu chi trả bảo hiểm"

**Files:**
- Create: `src/pages/claim-requests/new-claim-request/components/ClaimAmountSection.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { Checkbox, Col, Form, InputNumber, Row } from 'antd'
import { claimCaseOptions } from '../new-claim-request-form'

export function ClaimAmountSection() {
  return (
    <section>
      <h2 className="mb-4 text-base font-semibold text-gray-800">
        Nội dung yêu cầu chi trả bảo hiểm
      </h2>
      <Row gutter={[16, 0]}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Tổng số tiền yêu cầu chi trả"
            name="claimAmount"
            rules={[{ required: true, message: 'Vui lòng nhập tổng số tiền yêu cầu chi trả' }]}
          >
            <InputNumber<number>
              className="w-full"
              addonAfter="đ"
              min={0}
              controls={false}
              formatter={(value) => `${value ?? ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => Number((value ?? '').replace(/,/g, ''))}
              placeholder="Vui lòng nhập tổng số tiền yêu cầu chi trả"
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Chi trả bảo hiểm cho trường hợp" name="claimCases">
            <Checkbox.Group options={claimCaseOptions} />
          </Form.Item>
        </Col>
      </Row>
    </section>
  )
}
```

> The `InputNumber<number>` generic fixes the `formatter`/`parser` types to `number`, so the
> parser may return a plain `number` with no cast. If tsc still complains about the `addonAfter`
> prop on this AntD version, replace it with `suffix="đ"`.

- [ ] **Step 2: Typecheck + lint**

Run: `npx tsc -b && yarn lint`
Expected: no errors. If `addonAfter` is rejected, switch to `suffix="đ"` and re-run.

- [ ] **Step 3: Commit**

```bash
git add src/pages/claim-requests/new-claim-request/components/ClaimAmountSection.tsx
git commit -m "feat(claim-requests): add claim amount section"
```

---

## Task 6: BeneficiarySection — "Thông tin người thụ hưởng" (+ upload)

**Files:**
- Create: `src/pages/claim-requests/new-claim-request/components/BeneficiarySection.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { Col, Form, Input, Row, Upload } from 'antd'
import { InboxOutlined } from '@ant-design/icons'

const { Dragger } = Upload

export function BeneficiarySection() {
  return (
    <section>
      <h2 className="mb-4 text-base font-semibold text-gray-800">Thông tin người thụ hưởng</h2>
      <Row gutter={[16, 0]}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Người thụ hưởng"
            name="beneficiary"
            rules={[{ required: true, message: 'Vui lòng nhập tên người thụ hưởng' }]}
          >
            <Input placeholder="Vui lòng nhập tên người thụ hưởng" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Số tài khoản"
            name="accountNumber"
            rules={[{ required: true, message: 'Vui lòng nhập số tài khoản' }]}
          >
            <Input placeholder="Vui lòng nhập số tài khoản" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Ngân hàng"
            name="bankName"
            rules={[{ required: true, message: 'Vui lòng nhập tên ngân hàng' }]}
          >
            <Input placeholder="Vui lòng nhập tên ngân hàng" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Địa chỉ ngân hàng" name="bankAddress">
            <Input placeholder="Vui lòng nhập địa chỉ ngân hàng" />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item label="Tài liệu đính kèm">
            <Dragger
              multiple
              beforeUpload={() => false}
              accept=".png,.jpg,.jpeg,.pdf,.docx,.xlsx,.mp4"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Nhấn để tải lên hoặc kéo thả vào đây</p>
              <p className="ant-upload-hint">
                Định dạng: PNG, JPG, JPEG, PDF, DOCX, XLSX, MP4
              </p>
            </Dragger>
          </Form.Item>
        </Col>
      </Row>
    </section>
  )
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `npx tsc -b && yarn lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/claim-requests/new-claim-request/components/BeneficiarySection.tsx
git commit -m "feat(claim-requests): add beneficiary section with file upload"
```

---

## Task 7: NewClaimRequestPage — assemble form, footer, save/reset

**Files:**
- Create: `src/pages/claim-requests/new-claim-request/NewClaimRequestPage.tsx`

- [ ] **Step 1: Create the page**

```tsx
import { App, Breadcrumb, Button, Form } from 'antd'
import { useNavigate } from 'react-router-dom'
import { initialValues, type NewClaimRequestForm } from './new-claim-request-form'
import { GeneralInfoSection } from './components/GeneralInfoSection'
import { InsuredPersonSection } from './components/InsuredPersonSection'
import { AccidentInfoSection } from './components/AccidentInfoSection'
import { ClaimAmountSection } from './components/ClaimAmountSection'
import { BeneficiarySection } from './components/BeneficiarySection'

const LIST_PATH = '/yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe'

export function NewClaimRequestPage() {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [form] = Form.useForm<NewClaimRequestForm>()

  const handleSave = () => {
    // UI only: no API call. Validation already passed via onFinish.
    message.success('Đã lưu yêu cầu bồi thường')
    navigate(LIST_PATH)
  }

  const handleReset = () => form.resetFields()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Breadcrumb
          items={[
            { title: 'Yêu cầu bồi thường' },
            { title: 'Bảo hiểm tích luỹ tài xế' },
            { title: 'Thêm yêu cầu bồi thường' },
          ]}
        />
        <h1 className="text-xl font-semibold text-gray-800">Thêm yêu cầu bồi thường</h1>
      </div>

      <Form
        form={form}
        layout="vertical"
        requiredMark
        initialValues={initialValues}
        onFinish={handleSave}
        className="flex flex-col gap-8 rounded-lg border border-gray-100 bg-white p-6 shadow-sm"
      >
        <GeneralInfoSection />
        <InsuredPersonSection />
        <AccidentInfoSection />
        <ClaimAmountSection />
        <BeneficiarySection />

        <div className="flex items-center gap-3">
          <Button onClick={handleReset}>Làm lại</Button>
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </div>
      </Form>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `npx tsc -b && yarn lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/claim-requests/new-claim-request/NewClaimRequestPage.tsx
git commit -m "feat(claim-requests): compose new claim request page"
```

---

## Task 8: Wire route + App provider; final build & visual check

**Files:**
- Modify: `src/main.tsx`
- Modify: `src/app/router.tsx`

- [ ] **Step 1: Wrap RouterProvider in AntD `<App>` (enables `App.useApp()` message)**

In `src/main.tsx`, change the import to include `App` and wrap the router:

```tsx
import { App, ConfigProvider } from 'antd'
```

Replace the render body so `<App>` sits inside `<ConfigProvider>` and wraps `<RouterProvider>`:

```tsx
  <StrictMode>
    <ConfigProvider theme={antdTheme}>
      <App>
        <RouterProvider router={router} />
      </App>
    </ConfigProvider>
  </StrictMode>,
```

> AntD `<App>` is a context-only wrapper (no visual change) that provides the `message`,
> `notification`, and `modal` instances consumed by `App.useApp()`.

- [ ] **Step 2: Register the page route**

In `src/app/router.tsx`, add the import (next to the existing `ClaimRequestsListPage` import):

```tsx
import { NewClaimRequestPage } from '../pages/claim-requests/new-claim-request/NewClaimRequestPage'
```

Replace the existing `them-moi` route element:

```tsx
      {
        path: 'yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe/them-moi',
        element: <NewClaimRequestPage />,
      },
```

(Remove the `PlaceholderPage title="Thêm mới Yêu cầu bồi thường"` usage. Leave the
`:id/cap-nhat` and `:id/giay-ycbt` placeholder routes untouched — they are out of scope.)

- [ ] **Step 3: Full build**

Run: `yarn build`
Expected: `tsc -b` passes and `vite build` completes with no errors.

- [ ] **Step 4: Lint**

Run: `yarn lint`
Expected: no errors/warnings (notably no `react-refresh/only-export-components`).

- [ ] **Step 5: Visual verification against screenshots**

Run: `yarn dev`, open the app, go to the claim-requests list
(`/yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe`), click **Thêm mới**. Confirm against
`docs/ui/new-claim-request-ppt-01.png` and `-02.png`:
- All five sections render in order with the exact headings.
- Every label/placeholder matches (spot-check the slashed labels and "Nhập"/"Vui lòng nhập" prefixes).
- Selecting a customer in "Tìm thông tin khách hàng" fills the insured fields and the
  read-only Số CMND / Ngày sinh show the customer's values (`-` before selection).
- Submitting empty → required errors only on the starred fields.
- Fill required fields + **Lưu** → success toast + redirect to list. **Làm lại** clears the form.

- [ ] **Step 6: Commit**

```bash
git add src/main.tsx src/app/router.tsx
git commit -m "feat(claim-requests): register new claim request route and app provider"
```

---

## Self-Review (completed by plan author)

- **Spec coverage:** Route swap (Task 8) ✓; file layout (Tasks 1–7) ✓; page shell (Task 7) ✓;
  all five sections with exact labels/placeholders/required-marks (Tasks 2–6) ✓; customer
  autofill + read-only displays (Task 3) ✓; Từ ngày/Đến ngày always visible (Task 4) ✓;
  amount with `đ` + checkbox group (Task 5) ✓; beneficiary + Upload.Dragger (Task 6) ✓;
  footer Làm lại/Lưu with validate→toast→navigate (Task 7) ✓; mock data, no API (Task 1) ✓.
- **Placeholder scan:** none — every code step is complete.
- **Type consistency:** field names (`receivingSource`, `customerSearch`, `driverCode`,
  `idNumber`, `dob`, `treatmentType`, `claimAmount`, `claimCases`, `bankName`, `bankAddress`…)
  are identical across the `NewClaimRequestForm` type, the section `name=` props, and the
  `setFieldsValue` autofill call. `findCustomer` / `customerOptions` / `mockCustomers` /
  `claimCaseOptions` / `genderOptions` / `receivingSourceOptions` / `initialValues` are all
  defined in Task 1 and consumed by name in later tasks.
