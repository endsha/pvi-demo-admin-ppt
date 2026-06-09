# GSM PPT Search Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `tra-cuu-gsm` placeholder with a real "Tra cứu thông tin GSM PPT" search page — a pixel-faithful centered search form that renders a result table from local mock data on submit.

**Architecture:** A feature folder under `src/pages/gsm-search/` following the exact pattern of `policies/` and `invoice-requests/`: a page container owning search state, a presentational form component, a presentational result component, a pure search-logic file, and a mock-data file. No API, no fetch layer — the submit runs a synchronous filter behind a ~400ms cosmetic delay.

**Tech Stack:** React 19 + TypeScript, AntD v6 (`Form`/`Input`/`Select`/`Button`/`Table`/`Tag`/`Empty`), Tailwind v4 utilities, react-router v7. Verification by `npm run build` + `npm run lint` + Playwright (no test runner in this repo).

**Spec:** `docs/superpowers/specs/2026-06-09-gsm-search-design.md`

**Conventions reused (read before starting):**
- `src/pages/invoice-requests/components/InvoiceTable.tsx` — AntD `Table` pattern (`import type { ColumnsType } from 'antd/es/table'`, `Table<Row>`, `scroll={{ x: 'max-content' }}`, `rowKey="id"`).
- `src/pages/invoice-requests/components/InvoiceFilters.tsx` — AntD `Form` (`layout="vertical"`, `Form.useForm`) + card styling `rounded-lg border border-gray-100 bg-white p-5 shadow-sm`.
- `src/pages/policies/mock-data.ts` — `PolicyRow`, `STATUS_CONFIG`, `formatPremium`, `formatDateTime` (imported, never duplicated).

> The screenshot shows ONLY the centered card and the page footer (the footer already lives in `AdminLayout`). Per `docs/rules/ui-ux-strict.md`, do **not** add a breadcrumb or page `<h1>` to this page — unlike the list pages. The result table appears below the form only after a search (approved, invented layout).

---

### Task 1: Mock data + types

**Files:**
- Create: `src/pages/gsm-search/mock-data.ts`

- [ ] **Step 1: Create the mock-data file**

```ts
import type { PolicyRow } from '../policies/mock-data'

// Mock assumption (spec §8.1): the GSM products from the sidebar.
// Not present in the screenshot — kept as a flagged assumption.
export const INSURANCE_TYPES = [
  'Tai nạn hành khách theo chuyến',
  'Bảo hiểm hàng hoá',
  'Bảo hiểm tích lũy tài xế',
  'Bảo hiểm FoodCare',
] as const

export const ALL_INSURANCE = 'Tất cả'

export interface GsmRecord extends PolicyRow {
  driverCode: string // "Mã tài xế GSM"
  insuranceType: string // "Loại bảo hiểm" label
}

export const insuranceTypeOptions = [
  { value: ALL_INSURANCE, label: ALL_INSURANCE },
  ...INSURANCE_TYPES.map((t) => ({ value: t, label: t })),
]

export const gsmRecords: GsmRecord[] = [
  {
    id: '1', tripId: '01K5ZFKYE36CXTC6TCVN18R6AZ', premium: 2000, plate: '68H-077.46',
    bookerName: 'lê xuyên', bookerPhone: '0869056332', riderName: 'lê xuyên', riderPhone: '0869056332',
    startAt: '2026-06-01T00:00:00', endAt: '2026-06-01T00:03:00',
    fromAddress: 'Dương Đông, Phú Quốc, Kiên Giang', toAddress: 'Đặc khu Phú Quốc, Tỉnh An Giang, Việt Nam',
    createdAt: '2026-06-01T00:00:00', status: 'hoan-thanh',
    driverCode: 'GSM-100245', insuranceType: 'Tai nạn hành khách theo chuyến',
  },
  {
    id: '2', tripId: '01K5ZFKMNMJGH4E3JXVG6TFN7X', premium: 2000, plate: '22H-030.63',
    bookerName: 'Kiến', bookerPhone: '0975789021', riderName: 'Kiến', riderPhone: '0975789021',
    startAt: '2026-06-01T00:02:00', endAt: '2026-06-01T00:05:00',
    fromAddress: 'Phường Hà Giang 1, Tỉnh Tuyên Quang, Việt Nam', toAddress: 'Tổ 10, Phường Hà Giang 2, Tỉnh Tuyên Quang, Việt Nam',
    createdAt: '2026-06-01T00:02:00', status: 'hoan-thanh',
    driverCode: 'GSM-100312', insuranceType: 'Tai nạn hành khách theo chuyến',
  },
  {
    id: '3', tripId: '01K5ZFEWDO1V9NF9E6WGZS1K9Z', premium: 2000, plate: '36H-157.02',
    bookerName: 'mai văn mạnh', bookerPhone: '0968966332', riderName: 'mai văn mạnh', riderPhone: '0968966332',
    startAt: '2026-06-01T00:00:00', endAt: '2026-06-01T00:04:00',
    fromAddress: 'P.Điện Biên, Tp.Thanh Hóa, Thanh Hóa, 40000, Vietnam', toAddress: 'Phường Hàm Rồng, Tp.Thanh Hóa, Thanh Hóa, Việt Nam',
    createdAt: '2026-06-01T00:00:00', status: 'hoan-thanh',
    driverCode: 'GSM-100487', insuranceType: 'Bảo hiểm tích lũy tài xế',
  },
  {
    id: '4', tripId: '01K5ZF8QK2M4P7RTYHN3DLWA2C', premium: 2000, plate: '29H-512.88',
    bookerName: 'Trần Hùng', bookerPhone: '0901234567', riderName: 'Trần Hùng', riderPhone: '0901234567',
    startAt: '2026-06-02T08:15:00', endAt: '2026-06-02T08:40:00',
    fromAddress: 'Quận Cầu Giấy, Hà Nội, Việt Nam', toAddress: 'Quận Đống Đa, Hà Nội, Việt Nam',
    createdAt: '2026-06-02T08:15:00', status: 'hoan-thanh',
    driverCode: 'GSM-100529', insuranceType: 'Tai nạn hành khách theo chuyến',
  },
  {
    id: '5', tripId: '01K5ZF6BNV8XQ2WCEDR4TMK1HF', premium: 2000, plate: '51H-883.21',
    bookerName: 'Nguyễn Lan', bookerPhone: '0912345678', riderName: 'Nguyễn Lan', riderPhone: '0912345678',
    startAt: '2026-06-02T12:30:00', endAt: '2026-06-02T12:55:00',
    fromAddress: 'Quận 1, TP. Hồ Chí Minh, Việt Nam', toAddress: 'Quận 3, TP. Hồ Chí Minh, Việt Nam',
    createdAt: '2026-06-02T12:30:00', status: 'hieu-luc',
    driverCode: 'GSM-100618', insuranceType: 'Bảo hiểm hàng hoá',
  },
  {
    id: '6', tripId: '01K5ZF4RPC7YHM9XGAT2VBLE5N', premium: 2000, plate: '43H-201.55',
    bookerName: 'Phạm Đức', bookerPhone: '0923456789', riderName: 'Phạm Đức', riderPhone: '0923456789',
    startAt: '2026-06-03T06:45:00', endAt: '2026-06-03T07:10:00',
    fromAddress: 'Quận Hải Châu, Đà Nẵng, Việt Nam', toAddress: 'Quận Sơn Trà, Đà Nẵng, Việt Nam',
    createdAt: '2026-06-03T06:45:00', status: 'hoan-thanh',
    driverCode: 'GSM-100733', insuranceType: 'Bảo hiểm FoodCare',
  },
  {
    id: '7', tripId: '01K5ZF2WTE5JKD8FNQR7YHSC3M', premium: 2000, plate: '92H-446.10',
    bookerName: 'Võ Minh', bookerPhone: '0934567890', riderName: 'Võ Minh', riderPhone: '0934567890',
    startAt: '2026-06-03T18:20:00', endAt: '2026-06-03T18:50:00',
    fromAddress: 'TP. Tam Kỳ, Quảng Nam, Việt Nam', toAddress: 'TP. Hội An, Quảng Nam, Việt Nam',
    createdAt: '2026-06-03T18:20:00', status: 'hoan-thanh',
    driverCode: 'GSM-100815', insuranceType: 'Tai nạn hành khách theo chuyến',
  },
  {
    id: '8', tripId: '01K5ZF1HXA3QWE6RGZP9TMUD4B', premium: 2000, plate: '30H-778.93',
    bookerName: 'Đỗ Thu', bookerPhone: '0945678901', riderName: 'Đỗ Thu', riderPhone: '0945678901',
    startAt: '2026-06-04T09:05:00', endAt: '2026-06-04T09:35:00',
    fromAddress: 'Quận Hoàn Kiếm, Hà Nội, Việt Nam', toAddress: 'Quận Tây Hồ, Hà Nội, Việt Nam',
    createdAt: '2026-06-04T09:05:00', status: 'het-hieu-luc',
    driverCode: 'GSM-100922', insuranceType: 'Bảo hiểm tích lũy tài xế',
  },
  {
    id: '9', tripId: '01K5ZF0DMB9YUT2KFHWA5NRQ6P', premium: 2000, plate: '47H-330.62',
    bookerName: 'Bùi Sơn', bookerPhone: '0956789012', riderName: 'Bùi Sơn', riderPhone: '0956789012',
    startAt: '2026-06-04T15:40:00', endAt: '2026-06-04T16:05:00',
    fromAddress: 'TP. Buôn Ma Thuột, Đắk Lắk, Việt Nam', toAddress: 'Huyện Cư Mgar, Đắk Lắk, Việt Nam',
    createdAt: '2026-06-04T15:40:00', status: 'hoan-thanh',
    driverCode: 'GSM-101044', insuranceType: 'Tai nạn hành khách theo chuyến',
  },
  {
    id: '10', tripId: '01K5ZEYZQF6WRC4XHNTD8LMK2J', premium: 2000, plate: '60H-915.47',
    bookerName: 'Hồ Yến', bookerPhone: '0967890123', riderName: 'Hồ Yến', riderPhone: '0967890123',
    startAt: '2026-06-05T07:25:00', endAt: '2026-06-05T07:55:00',
    fromAddress: 'TP. Biên Hòa, Đồng Nai, Việt Nam', toAddress: 'Huyện Long Thành, Đồng Nai, Việt Nam',
    createdAt: '2026-06-05T07:25:00', status: 'hoan-thanh',
    driverCode: 'GSM-101187', insuranceType: 'Bảo hiểm hàng hoá',
  },
  {
    id: '11', tripId: '01K5ZEX4WG2TMD7YKHRA9NPC5V', premium: 2000, plate: '72H-188.34',
    bookerName: 'Dương Khoa', bookerPhone: '0978901234', riderName: 'Dương Khoa', riderPhone: '0978901234',
    startAt: '2026-06-05T20:10:00', endAt: '2026-06-05T20:38:00',
    fromAddress: 'TP. Vũng Tàu, Bà Rịa - Vũng Tàu, Việt Nam', toAddress: 'TP. Bà Rịa, Bà Rịa - Vũng Tàu, Việt Nam',
    createdAt: '2026-06-05T20:10:00', status: 'da-huy',
    driverCode: 'GSM-101259', insuranceType: 'Bảo hiểm FoodCare',
  },
  {
    id: '12', tripId: '01K5ZEW8YH5KNF3RDTQA7MLB6X', premium: 2000, plate: '88H-177.08',
    bookerName: 'Lý Hà', bookerPhone: '0989012345', riderName: 'Lý Hà', riderPhone: '0989012345',
    startAt: '2026-06-06T11:50:00', endAt: '2026-06-06T12:20:00',
    fromAddress: 'TP. Cần Thơ, Việt Nam', toAddress: 'Huyện Phong Điền, Cần Thơ, Việt Nam',
    createdAt: '2026-06-06T11:50:00', status: 'hoan-thanh',
    driverCode: 'GSM-101376', insuranceType: 'Bảo hiểm tích lũy tài xế',
  },
]
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: PASS (the file is not yet imported anywhere, but tsc must accept it — confirms `PolicyRow` import path and `GsmRecord` shape are valid).

- [ ] **Step 3: Commit**

```bash
git add src/pages/gsm-search/mock-data.ts
git commit -m "feat(gsm-search): add mock GSM records and insurance type options"
```

---

### Task 2: Search logic

**Files:**
- Create: `src/pages/gsm-search/gsm-search.ts`

- [ ] **Step 1: Create the logic file**

```ts
import { ALL_INSURANCE, type GsmRecord } from './mock-data'

export interface GsmSearchCriteria {
  phone: string
  driverCode: string
  insuranceType: string
}

export const DEFAULT_CRITERIA: GsmSearchCriteria = {
  phone: '',
  driverCode: '',
  insuranceType: ALL_INSURANCE,
}

// Pure filter. Blank inputs are ignored; all active conditions are AND-ed.
export function applySearch(
  records: GsmRecord[],
  criteria: GsmSearchCriteria,
): GsmRecord[] {
  const phone = criteria.phone.trim().toLowerCase()
  const driverCode = criteria.driverCode.trim().toLowerCase()
  const { insuranceType } = criteria

  return records.filter((r) => {
    const phoneMatch =
      !phone ||
      r.riderPhone.toLowerCase().includes(phone) ||
      r.bookerPhone.toLowerCase().includes(phone)
    const driverMatch = !driverCode || r.driverCode.toLowerCase().includes(driverCode)
    const typeMatch = insuranceType === ALL_INSURANCE || r.insuranceType === insuranceType
    return phoneMatch && driverMatch && typeMatch
  })
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/gsm-search/gsm-search.ts
git commit -m "feat(gsm-search): add applySearch filter logic"
```

---

### Task 3: Search form component

**Files:**
- Create: `src/pages/gsm-search/components/GsmSearchForm.tsx`

- [ ] **Step 1: Create the form component**

```tsx
import { Button, Form, Input, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { insuranceTypeOptions } from '../mock-data'
import { DEFAULT_CRITERIA, type GsmSearchCriteria } from '../gsm-search'

interface GsmSearchFormProps {
  loading: boolean
  onSearch: (criteria: GsmSearchCriteria) => void
}

interface FormShape {
  phone?: string
  driverCode?: string
  insuranceType: string
}

const initialValues: FormShape = {
  phone: '',
  driverCode: '',
  insuranceType: DEFAULT_CRITERIA.insuranceType,
}

export function GsmSearchForm({ loading, onSearch }: GsmSearchFormProps) {
  const [form] = Form.useForm<FormShape>()

  const handleFinish = (values: FormShape) => {
    onSearch({
      phone: values.phone ?? '',
      driverCode: values.driverCode ?? '',
      insuranceType: values.insuranceType,
    })
  }

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleFinish}
        requiredMark
        className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-5 text-base font-semibold text-gray-800">
          Tra cứu thông tin GSM PPT
        </h2>
        <Form.Item label="Số điện thoại" name="phone" className="mb-4">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Nhập số điện thoại"
            allowClear
          />
        </Form.Item>
        <Form.Item label="Mã tài xế GSM" name="driverCode" className="mb-4">
          <Input placeholder="Nhập mã tài xế (nếu có)" allowClear />
        </Form.Item>
        <Form.Item
          label="Loại bảo hiểm"
          name="insuranceType"
          className="mb-5"
          rules={[{ required: true, message: 'Vui lòng chọn loại bảo hiểm' }]}
        >
          <Select options={insuranceTypeOptions} placeholder="Chọn loại bảo hiểm" />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          icon={<SearchOutlined />}
          loading={loading}
          block
        >
          Tra cứu
        </Button>
      </Form>
    </div>
  )
}
```

> Note: `rules={[{ required: true }]}` makes AntD render the `*` next to "Loại bảo hiểm" automatically, matching the screenshot. `requiredMark` is the default but is set explicitly for clarity.

- [ ] **Step 2: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: PASS. (Component is not yet mounted; this confirms imports and types.)

- [ ] **Step 3: Commit**

```bash
git add src/pages/gsm-search/components/GsmSearchForm.tsx
git commit -m "feat(gsm-search): add search form card"
```

---

### Task 4: Result table component

**Files:**
- Create: `src/pages/gsm-search/components/GsmSearchResult.tsx`

- [ ] **Step 1: Create the result component**

```tsx
import { Empty, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { GsmRecord } from '../mock-data'
import { STATUS_CONFIG, formatPremium, formatDateTime } from '../../policies/mock-data'

interface GsmSearchResultProps {
  records: GsmRecord[]
}

const columns: ColumnsType<GsmRecord> = [
  { title: 'Mã chuyến', dataIndex: 'tripId', key: 'tripId' },
  { title: 'Biển số', dataIndex: 'plate', key: 'plate' },
  { title: 'Tên người đi', dataIndex: 'riderName', key: 'riderName' },
  { title: 'SĐT', dataIndex: 'riderPhone', key: 'riderPhone' },
  { title: 'Loại bảo hiểm', dataIndex: 'insuranceType', key: 'insuranceType' },
  {
    title: 'Phí (đ)',
    dataIndex: 'premium',
    key: 'premium',
    align: 'right',
    render: (value: number) => formatPremium(value),
  },
  {
    title: 'Thời gian',
    dataIndex: 'startAt',
    key: 'startAt',
    render: (value: string) => formatDateTime(value),
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status: GsmRecord['status']) => {
      const cfg = STATUS_CONFIG[status]
      return <Tag color={cfg.color}>{cfg.tagLabel}</Tag>
    },
  },
]

export function GsmSearchResult({ records }: GsmSearchResultProps) {
  return (
    <section className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-800">Kết quả tra cứu</h2>
      {records.length === 0 ? (
        <Empty description="Không tìm thấy thông tin phù hợp" />
      ) : (
        <Table<GsmRecord>
          rowKey="id"
          columns={columns}
          dataSource={records}
          pagination={{ pageSize: 10, hideOnSinglePage: true, showSizeChanger: false }}
          scroll={{ x: 'max-content' }}
        />
      )}
    </section>
  )
}
```

- [ ] **Step 2: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/gsm-search/components/GsmSearchResult.tsx
git commit -m "feat(gsm-search): add result table with empty state"
```

---

### Task 5: Page container + router wiring

**Files:**
- Create: `src/pages/gsm-search/GsmSearchPage.tsx`
- Modify: `src/app/router.tsx`

- [ ] **Step 1: Create the page container**

```tsx
import { useState } from 'react'
import { GsmSearchForm } from './components/GsmSearchForm'
import { GsmSearchResult } from './components/GsmSearchResult'
import { gsmRecords, type GsmRecord } from './mock-data'
import { applySearch, type GsmSearchCriteria } from './gsm-search'

type SearchStatus = 'idle' | 'loading' | 'done'

// UI affordance only — there is no API call (spec §5).
const SEARCH_DELAY_MS = 400

export function GsmSearchPage() {
  const [status, setStatus] = useState<SearchStatus>('idle')
  const [results, setResults] = useState<GsmRecord[]>([])

  const handleSearch = (criteria: GsmSearchCriteria) => {
    setStatus('loading')
    setTimeout(() => {
      setResults(applySearch(gsmRecords, criteria))
      setStatus('done')
    }, SEARCH_DELAY_MS)
  }

  return (
    <div className="flex flex-col gap-4">
      <GsmSearchForm loading={status === 'loading'} onSearch={handleSearch} />
      {status === 'done' && <GsmSearchResult records={results} />}
    </div>
  )
}
```

- [ ] **Step 2: Wire the route**

In `src/app/router.tsx`:

Add the import next to the other page imports:

```tsx
import { GsmSearchPage } from '../pages/gsm-search/GsmSearchPage'
```

Replace this line:

```tsx
      { path: 'tra-cuu-gsm', element: <PlaceholderPage title="Tra cứu GSM PPT" /> },
```

with:

```tsx
      { path: 'tra-cuu-gsm', element: <GsmSearchPage /> },
```

(Leave the `PlaceholderPage` import — it is still used by other routes.)

- [ ] **Step 3: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/pages/gsm-search/GsmSearchPage.tsx src/app/router.tsx
git commit -m "feat(gsm-search): wire GSM search page to /tra-cuu-gsm route"
```

---

### Task 6: Visual verification (Playwright)

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev` (background). Note the URL (Vite default: `http://localhost:5173`).

- [ ] **Step 2: Navigate and verify the idle form**

Open `http://localhost:5173/tra-cuu-gsm`. Confirm:
- Centered card titled "Tra cứu thông tin GSM PPT".
- Fields "Số điện thoại" (placeholder "Nhập số điện thoại", search icon), "Mã tài xế GSM" (placeholder "Nhập mã tài xế (nếu có)"), "Loại bảo hiểm" with a red `*`, defaulting to "Tất cả".
- Full-width primary "Tra cứu" button with a search icon.
- No result area visible. No breadcrumb / page heading. Footer "Powered by PVI Digital" present.

Take a screenshot at 1440 width.

- [ ] **Step 3: Verify required validation**

Clear the "Loại bảo hiểm" select, press "Tra cứu". Confirm the field shows the error "Vui lòng chọn loại bảo hiểm" and no result area appears.

- [ ] **Step 4: Verify a matching search**

Reset "Loại bảo hiểm" to "Tất cả". Type `0901234567` into "Số điện thoại", press "Tra cứu". Confirm the button briefly shows loading, then a "Kết quả tra cứu" table appears with the row for "Trần Hùng" / plate `29H-512.88`.

- [ ] **Step 5: Verify a no-match search**

Change "Số điện thoại" to `0000000000`, press "Tra cứu". Confirm the result section shows the empty state "Không tìm thấy thông tin phù hợp".

- [ ] **Step 6: Verify type filter**

Clear the phone, set "Loại bảo hiểm" to "Bảo hiểm FoodCare", press "Tra cứu". Confirm only FoodCare rows (ids 6 and 11 → "Phạm Đức", "Dương Khoa") appear.

- [ ] **Step 7: Final build + lint gate**

Run: `npm run build && npm run lint`
Expected: PASS. Stop the dev server.

---

## Self-Review

**Spec coverage:**
- §3 file structure → Tasks 1–5 create every listed file; §3 router change → Task 5 Step 2. ✓
- §4 form (exact labels/placeholders, required select, full-width button) → Task 3. ✓
- §5 behavior/states (idle/loading/done, ~400ms delay, AND filter, `Tất cả`) → Task 2 (`applySearch`) + Task 5 (state machine) + Task 6 (verification). ✓
- §6 result table columns + status tag reuse → Task 4. ✓
- §7 `GsmRecord extends PolicyRow` + ~12 records → Task 1. ✓
- §8 mock assumptions (option list, table layout, delay) → encoded in Task 1 comments + Task 5 comment. ✓
- §10 testing via build + lint + Playwright → Tasks 1–6 verification steps. ✓

**Placeholder scan:** No TBD/TODO; every code step shows complete code. ✓

**Type consistency:** `GsmRecord` (mock-data) reused everywhere; `GsmSearchCriteria` + `DEFAULT_CRITERIA` + `applySearch` (gsm-search) match across form/page; `ALL_INSURANCE` defined once in mock-data and imported by gsm-search; `STATUS_CONFIG`/`formatPremium`/`formatDateTime` imported from policies/mock-data (not redefined). ✓
