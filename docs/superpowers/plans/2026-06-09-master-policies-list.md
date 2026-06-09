# Master Policies List (Bảo hiểm tích luỹ tài xế) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the master policies list page ("Danh sách Hợp đồng nguyên tắc") for the Driver Savings product, faithful to `docs/ui/master-policies-list.png`, with static mock data and client-side filtering/sorting.

**Architecture:** A new `src/pages/master-policies/` feature folder mirroring the existing `src/pages/driver-savings/` page exactly: a list page that owns filter + pagination state, a filter card component, a table component with multi-line stacked cells, and pure data/helper modules. Static mock rows are imported directly (no API/query layer). Wired into the router and the existing "Hợp đồng nguyên tắc" sidebar group.

**Tech Stack:** React + TypeScript, Ant Design (Table, Form, Select, DatePicker, Input, Button, Breadcrumb), Tailwind utility classes, react-router-dom, dayjs.

**Verification note:** This repo has **no test runner** (no `test` script, no test files). The reference page `driver-savings/` has no unit tests. Per-task verification is therefore **typecheck + lint**, with a final **visual verification** against the screenshot — the project's established sign-off mechanism (see the `docs/ui/z-*-done.png` convention). Commands used throughout:
- Typecheck: `npx tsc -b`
- Lint (scoped): `npx eslint src/pages/master-policies src/app/router.tsx src/layouts/AdminLayout/SidebarNav.tsx`

Branch `feat/master-policies-list` already exists; the spec is already committed.

---

## File Structure

```
src/pages/master-policies/
├── MasterPoliciesListPage.tsx        — composes breadcrumb + filters + table; owns filter + page state
├── mock-data.ts                      — MasterPolicyRow type, mock rows, format + option helpers
├── master-policies-filters.ts        — filter type, DEFAULT_FILTERS, applyFilters (filter + sort)
└── components/
    ├── MasterPoliciesFilters.tsx     — 4-field filter card + Làm lại / Tìm kiếm buttons
    └── MasterPoliciesTable.tsx       — section-header toolbar + AntD table + pagination
```
Modified: `src/app/router.tsx` (route), `src/layouts/AdminLayout/SidebarNav.tsx` (nav child).

---

## Task 1: Mock data module

**Files:**
- Create: `src/pages/master-policies/mock-data.ts`

- [ ] **Step 1: Create the mock data module**

```ts
export interface MasterPolicyRow {
  id: string
  contractNumber: string // Số hợp đồng nguyên tắc
  driverCode: string // Mã tài xế
  customerName: string // Tên khách hàng
  phone: string // SĐT
  packageName: string // Tên gói (also drives the "Loại bảo hiểm" filter)
  premium: number // Phí (đ)
  maxBenefit: number // Quyền lợi tối đa (đ)
  accumulated: number // Số tiền đã tích luỹ (đ)
  effectiveStart: string // Ngày bắt đầu (ISO)
  effectiveEnd: string // Ngày kết thúc (ISO)
}

export const sortOptions = [
  { value: 'newest', label: 'Xếp theo mới nhất' },
  { value: 'oldest', label: 'Xếp theo cũ nhất' },
]

export function formatMoney(n: number): string {
  return n.toLocaleString('vi-VN') // 300.000.000
}

export function formatDateTimeSeconds(iso: string): string {
  const d = new Date(iso)
  const pad = (x: number) => String(x).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export const masterPolicyRows: MasterPolicyRow[] = [
  {
    id: '1', contractNumber: '26/PC-GSM/067426', driverCode: '8000075456',
    customerName: 'Lê Văn Hùng', phone: '+84865039991', packageName: 'Gói Taxi PPT',
    premium: 200, maxBenefit: 300000000, accumulated: 500000,
    effectiveStart: '2026-06-08T23:16:08', effectiveEnd: '2027-06-08T23:16:07',
  },
  {
    id: '2', contractNumber: '26/PM-GSM/034210', driverCode: '5000142871',
    customerName: 'Nguyễn Thanh Phong', phone: '+84354619744', packageName: 'Gói Xe máy PPT',
    premium: 100, maxBenefit: 300000000, accumulated: 125000,
    effectiveStart: '2026-06-08T23:43:22', effectiveEnd: '2027-06-08T23:43:21',
  },
  {
    id: '3', contractNumber: '26/PM-GSM/034212', driverCode: '5000142775',
    customerName: 'Nguyễn Tấn Phát', phone: '+84846133092', packageName: 'Gói Xe máy PPT',
    premium: 100, maxBenefit: 300000000, accumulated: 125000,
    effectiveStart: '2026-06-08T23:34:14', effectiveEnd: '2027-06-08T23:34:13',
  },
  {
    id: '4', contractNumber: '26/PC-GSM/067429', driverCode: '8000075512',
    customerName: 'Trần Quốc Bảo', phone: '+84901234567', packageName: 'Gói Taxi PPT',
    premium: 200, maxBenefit: 300000000, accumulated: 250000,
    effectiveStart: '2026-06-08T23:16:08', effectiveEnd: '2027-06-08T23:16:07',
  },
  {
    id: '5', contractNumber: '26/PM-GSM/034215', driverCode: '5000143001',
    customerName: 'Phạm Thị Hoa', phone: '+84912345678', packageName: 'Gói Xe máy PPT',
    premium: 100, maxBenefit: 300000000, accumulated: 75000,
    effectiveStart: '2026-06-07T20:11:05', effectiveEnd: '2027-06-07T20:11:04',
  },
  {
    id: '6', contractNumber: '26/PC-GSM/067433', driverCode: '8000075623',
    customerName: 'Vũ Đình Long', phone: '+84923456789', packageName: 'Gói Taxi PPT',
    premium: 200, maxBenefit: 300000000, accumulated: 600000,
    effectiveStart: '2026-06-07T18:45:30', effectiveEnd: '2027-06-07T18:45:29',
  },
  {
    id: '7', contractNumber: '26/PM-GSM/034220', driverCode: '5000143188',
    customerName: 'Đỗ Minh Quân', phone: '+84934567890', packageName: 'Gói Xe máy PPT',
    premium: 100, maxBenefit: 300000000, accumulated: 100000,
    effectiveStart: '2026-06-06T09:22:47', effectiveEnd: '2027-06-06T09:22:46',
  },
  {
    id: '8', contractNumber: '26/PC-GSM/067440', driverCode: '8000075781',
    customerName: 'Hoàng Văn Nam', phone: '+84945678901', packageName: 'Gói Taxi PPT',
    premium: 200, maxBenefit: 300000000, accumulated: 425000,
    effectiveStart: '2026-06-06T07:30:12', effectiveEnd: '2027-06-06T07:30:11',
  },
  {
    id: '9', contractNumber: '26/PM-GSM/034228', driverCode: '5000143356',
    customerName: 'Bùi Thị Lan', phone: '+84956789012', packageName: 'Gói Xe máy PPT',
    premium: 100, maxBenefit: 300000000, accumulated: 150000,
    effectiveStart: '2026-06-05T15:08:33', effectiveEnd: '2027-06-05T15:08:32',
  },
  {
    id: '10', contractNumber: '26/PC-GSM/067451', driverCode: '8000075902',
    customerName: 'Ngô Gia Bảo', phone: '+84967890123', packageName: 'Gói Taxi PPT',
    premium: 200, maxBenefit: 300000000, accumulated: 350000,
    effectiveStart: '2026-06-05T11:54:19', effectiveEnd: '2027-06-05T11:54:18',
  },
  {
    id: '11', contractNumber: '26/PM-GSM/034235', driverCode: '5000143502',
    customerName: 'Dương Văn Khoa', phone: '+84978901234', packageName: 'Gói Xe máy PPT',
    premium: 100, maxBenefit: 300000000, accumulated: 200000,
    effectiveStart: '2026-06-04T22:17:06', effectiveEnd: '2027-06-04T22:17:05',
  },
  {
    id: '12', contractNumber: '26/PC-GSM/067463', driverCode: '8000076044',
    customerName: 'Lý Thị Hà', phone: '+84989012345', packageName: 'Gói Taxi PPT',
    premium: 200, maxBenefit: 300000000, accumulated: 475000,
    effectiveStart: '2026-06-04T08:40:51', effectiveEnd: '2027-06-04T08:40:50',
  },
]

export const packageTypeOptions = Array.from(
  new Set(masterPolicyRows.map((row) => row.packageName)),
).map((name) => ({ value: name, label: name }))
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc -b`
Expected: PASS (no errors).

- [ ] **Step 3: Commit**

```bash
git add src/pages/master-policies/mock-data.ts
git commit -m "feat(master-policies): add mock data, types and formatters"
```

---

## Task 2: Filter logic module

**Files:**
- Create: `src/pages/master-policies/master-policies-filters.ts`

- [ ] **Step 1: Create the filter module**

```ts
import type { MasterPolicyRow } from './mock-data'

export type MasterPoliciesSort = 'newest' | 'oldest'

export interface MasterPoliciesFilters {
  keyword: string
  sort: MasterPoliciesSort
  effectiveRange: [string, string] | null // Thời gian bắt đầu hiệu lực (YYYY-MM-DD)
  packageType: string | null // Loại bảo hiểm
}

export const DEFAULT_FILTERS: MasterPoliciesFilters = {
  keyword: '',
  sort: 'newest',
  effectiveRange: null,
  packageType: null,
}

function inRange(iso: string, range: [string, string] | null): boolean {
  if (!range) return true
  const day = iso.slice(0, 10) // YYYY-MM-DD; lexical compare is valid for ISO dates
  return day >= range[0] && day <= range[1]
}

function matchesKeyword(row: MasterPolicyRow, keyword: string): boolean {
  const q = keyword.trim().toLowerCase()
  if (!q) return true
  return [row.contractNumber, row.driverCode, row.customerName, row.phone].some((value) =>
    value.toLowerCase().includes(q),
  )
}

export function applyFilters(
  rows: MasterPolicyRow[],
  f: MasterPoliciesFilters,
): MasterPolicyRow[] {
  const filtered = rows.filter(
    (row) =>
      matchesKeyword(row, f.keyword) &&
      (f.packageType === null || row.packageName === f.packageType) &&
      inRange(row.effectiveStart, f.effectiveRange),
  )
  return [...filtered].sort((a, b) => {
    const cmp = a.effectiveStart.localeCompare(b.effectiveStart)
    return f.sort === 'newest' ? -cmp : cmp
  })
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/master-policies/master-policies-filters.ts
git commit -m "feat(master-policies): add client-side filter and sort logic"
```

---

## Task 3: Filter card component

**Files:**
- Create: `src/pages/master-policies/components/MasterPoliciesFilters.tsx`

- [ ] **Step 1: Create the filter component**

```tsx
import { Button, Col, DatePicker, Form, Input, Row, Select, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import type { Dayjs } from 'dayjs'
import { packageTypeOptions, sortOptions } from '../mock-data'
import {
  DEFAULT_FILTERS,
  type MasterPoliciesFilters,
  type MasterPoliciesSort,
} from '../master-policies-filters'

const { RangePicker } = DatePicker

interface MasterPoliciesFiltersProps {
  onSearch: (filters: MasterPoliciesFilters) => void
  onReset: () => void
}

interface FormShape {
  keyword?: string
  sort?: MasterPoliciesSort
  effectiveRange?: [Dayjs, Dayjs] | null
  packageType?: string | null
}

const initialValues: FormShape = {
  keyword: '',
  sort: DEFAULT_FILTERS.sort,
  effectiveRange: null,
  packageType: DEFAULT_FILTERS.packageType,
}

function toIsoRange(range?: [Dayjs, Dayjs] | null): [string, string] | null {
  if (!range || !range[0] || !range[1]) return null
  return [range[0].format('YYYY-MM-DD'), range[1].format('YYYY-MM-DD')]
}

export function MasterPoliciesFilters({ onSearch, onReset }: MasterPoliciesFiltersProps) {
  const [form] = Form.useForm<FormShape>()

  const handleSearch = () => {
    const v = form.getFieldsValue()
    onSearch({
      keyword: v.keyword ?? '',
      sort: v.sort ?? 'newest',
      effectiveRange: toIsoRange(v.effectiveRange),
      packageType: v.packageType ?? null,
    })
  }

  const handleReset = () => {
    form.resetFields()
    onReset()
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm"
    >
      <Row gutter={16} align="bottom">
        <Col xs={24} md={6}>
          <Form.Item
            label={
              <span className="inline-flex items-center gap-1">
                Tìm kiếm
                <Tooltip title="Tìm theo số hợp đồng, mã tài xế, tên khách hàng hoặc SĐT">
                  <QuestionCircleOutlined className="text-gray-400" />
                </Tooltip>
              </span>
            }
            name="keyword"
            className="mb-0"
          >
            <Input placeholder="Nhập từ khoá tìm kiếm" allowClear />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="Sắp xếp theo" name="sort" className="mb-0">
            <Select options={sortOptions} />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="Thời gian bắt đầu hiệu lực" name="effectiveRange" className="mb-0">
            <RangePicker
              className="w-full"
              format="YYYY-MM-DD"
              placeholder={['Từ ngày', 'Đến ngày']}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="Loại bảo hiểm" name="packageType" className="mb-0">
            <Select options={packageTypeOptions} allowClear placeholder="Vui lòng chọn" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={24} className="flex items-center justify-end gap-2 pt-4">
          <Button onClick={handleReset}>Làm lại</Button>
          <Button type="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </Col>
      </Row>
    </Form>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 3: Lint**

Run: `npx eslint src/pages/master-policies`
Expected: PASS (no errors).

- [ ] **Step 4: Commit**

```bash
git add src/pages/master-policies/components/MasterPoliciesFilters.tsx
git commit -m "feat(master-policies): add filter card component"
```

---

## Task 4: Table component

**Files:**
- Create: `src/pages/master-policies/components/MasterPoliciesTable.tsx`

- [ ] **Step 1: Create the table component**

```tsx
import type { ReactNode } from 'react'
import { Button, Table } from 'antd'
import {
  ColumnHeightOutlined,
  ReloadOutlined,
  SettingOutlined,
  ZoomInOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { formatDateTimeSeconds, formatMoney, type MasterPolicyRow } from '../mock-data'

const PAGE_SIZE = 10

interface MasterPoliciesTableProps {
  rows: MasterPolicyRow[]
  page: number
  onPageChange: (page: number) => void
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="leading-5">
      <span className="font-medium text-gray-500">{label}: </span>
      <span className="text-gray-800">{value}</span>
    </div>
  )
}

export function MasterPoliciesTable({ rows, page, onPageChange }: MasterPoliciesTableProps) {
  const columns: ColumnsType<MasterPolicyRow> = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      render: (_value, _row, index) => (page - 1) * PAGE_SIZE + index + 1,
    },
    {
      title: 'Thông tin khách hàng',
      key: 'customer',
      render: (_v, row) => (
        <div className="space-y-1">
          <Field label="Số hợp đồng nguyên tắc" value={row.contractNumber} />
          <Field label="Mã tài xế" value={row.driverCode} />
          <Field label="Tên khách hàng" value={row.customerName} />
          <Field label="SĐT" value={row.phone} />
        </div>
      ),
    },
    {
      title: 'Thông tin chương trình bảo hiểm',
      key: 'program',
      render: (_v, row) => (
        <div className="space-y-1">
          <Field label="Tên gói" value={row.packageName} />
          <Field label="Phí" value={`${formatMoney(row.premium)} đ`} />
          <Field label="Quyền lợi tối đa" value={`${formatMoney(row.maxBenefit)} đ`} />
          <Field label="Số tiền đã tích luỹ" value={`${formatMoney(row.accumulated)} đ`} />
        </div>
      ),
    },
    {
      title: 'Thời hạn hiệu lực',
      key: 'effective',
      render: (_v, row) => (
        <div className="space-y-1">
          <Field label="Ngày bắt đầu" value={formatDateTimeSeconds(row.effectiveStart)} />
          <Field label="Ngày kết thúc" value={formatDateTimeSeconds(row.effectiveEnd)} />
        </div>
      ),
    },
    {
      title: 'Liên kết',
      key: 'link',
      render: () => (
        <Button type="link" className="px-0">
          Xem hợp đồng nguyên tắc
        </Button>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      render: () => <Button type="primary" icon={<ZoomInOutlined />} />,
    },
  ]

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-2 shadow-sm">
      <div className="flex items-center justify-between px-2 py-3">
        <h2 className="text-base font-semibold text-gray-800">Danh sách Hợp đồng nguyên tắc</h2>
        <div className="flex items-center gap-3 text-gray-400">
          <ReloadOutlined />
          <ColumnHeightOutlined />
          <SettingOutlined />
        </div>
      </div>
      <Table<MasterPolicyRow>
        rowKey="id"
        columns={columns}
        dataSource={rows}
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total: rows.length,
          onChange: onPageChange,
          showSizeChanger: false,
        }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 3: Lint**

Run: `npx eslint src/pages/master-policies`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/pages/master-policies/components/MasterPoliciesTable.tsx
git commit -m "feat(master-policies): add table with stacked cells and pagination"
```

---

## Task 5: List page (composition)

**Files:**
- Create: `src/pages/master-policies/MasterPoliciesListPage.tsx`

- [ ] **Step 1: Create the page component**

```tsx
import { useMemo, useState } from 'react'
import { Breadcrumb } from 'antd'
import { masterPolicyRows } from './mock-data'
import { applyFilters, DEFAULT_FILTERS, type MasterPoliciesFilters } from './master-policies-filters'
import { MasterPoliciesFilters as MasterPoliciesFiltersBar } from './components/MasterPoliciesFilters'
import { MasterPoliciesTable } from './components/MasterPoliciesTable'

export function MasterPoliciesListPage() {
  const [appliedFilters, setAppliedFilters] = useState<MasterPoliciesFilters>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)

  const filteredRows = useMemo(
    () => applyFilters(masterPolicyRows, appliedFilters),
    [appliedFilters],
  )

  const handleSearch = (filters: MasterPoliciesFilters) => {
    setAppliedFilters(filters)
    setPage(1)
  }

  const handleReset = () => {
    setAppliedFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Breadcrumb
          items={[{ title: 'Hợp đồng nguyên tắc' }, { title: 'Bảo hiểm tích luỹ tài xế' }]}
        />
        <h1 className="text-xl font-semibold text-gray-800">Bảo hiểm tích luỹ tài xế</h1>
      </div>
      <MasterPoliciesFiltersBar onSearch={handleSearch} onReset={handleReset} />
      <MasterPoliciesTable rows={filteredRows} page={page} onPageChange={setPage} />
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 3: Lint**

Run: `npx eslint src/pages/master-policies`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/pages/master-policies/MasterPoliciesListPage.tsx
git commit -m "feat(master-policies): compose list page with filter + table state"
```

---

## Task 6: Wire route and sidebar nav

**Files:**
- Modify: `src/app/router.tsx`
- Modify: `src/layouts/AdminLayout/SidebarNav.tsx`

- [ ] **Step 1: Add the import to `src/app/router.tsx`**

After the existing `DriverSavingsListPage` import (line 10), add:

```tsx
import { MasterPoliciesListPage } from '../pages/master-policies/MasterPoliciesListPage'
```

- [ ] **Step 2: Add the route to `src/app/router.tsx`**

Inside the `children` array, immediately after the `cai-dat-tai-khoan` route (currently the last child), add:

```tsx
      {
        path: 'hop-dong-nguyen-tac/bao-hiem-tich-luy-tai-xe',
        element: <MasterPoliciesListPage />,
      },
```

- [ ] **Step 3: Populate the "Hợp đồng nguyên tắc" sidebar group in `src/layouts/AdminLayout/SidebarNav.tsx`**

Replace this line (currently line 33):

```tsx
  { key: 'hop-dong', icon: <FileTextOutlined />, label: 'Hợp đồng nguyên tắc', children: [] },
```

with:

```tsx
  {
    key: 'hop-dong',
    icon: <FileTextOutlined />,
    label: 'Hợp đồng nguyên tắc',
    children: [
      {
        key: '/hop-dong-nguyen-tac/bao-hiem-tich-luy-tai-xe',
        label: 'Bảo hiểm tích luỹ tài xế',
      },
    ],
  },
```

- [ ] **Step 4: Open the group by default in `src/layouts/AdminLayout/SidebarNav.tsx`**

Change the `defaultOpenKeys` prop (currently line 65) from:

```tsx
      defaultOpenKeys={['don-bao-hiem', 'bao-cao-power-bi']}
```

to:

```tsx
      defaultOpenKeys={['don-bao-hiem', 'hop-dong', 'bao-cao-power-bi']}
```

- [ ] **Step 5: Typecheck**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 6: Lint**

Run: `npx eslint src/app/router.tsx src/layouts/AdminLayout/SidebarNav.tsx`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/app/router.tsx src/layouts/AdminLayout/SidebarNav.tsx
git commit -m "feat(master-policies): wire route and sidebar nav entry"
```

---

## Task 7: Visual verification against the screenshot

**Files:** none (verification only).

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: Vite serves on `http://localhost:5173` (note the actual port printed).

- [ ] **Step 2: Navigate and compare to the design**

Open `http://localhost:5173/hop-dong-nguyen-tac/bao-hiem-tich-luy-tai-xe` (or click sidebar **Hợp đồng nguyên tắc → Bảo hiểm tích luỹ tài xế**). Compare side-by-side with `docs/ui/master-policies-list.png`. Verify, in order:
  - Breadcrumb reads `Hợp đồng nguyên tắc / Bảo hiểm tích luỹ tài xế`; page title `Bảo hiểm tích luỹ tài xế`.
  - Filter row: `Tìm kiếm` (with ⓘ icon, placeholder `Nhập từ khoá tìm kiếm`), `Sắp xếp theo` (default `Xếp theo mới nhất`), `Thời gian bắt đầu hiệu lực` (`Từ ngày`/`Đến ngày`), `Loại bảo hiểm` (`Vui lòng chọn`).
  - Buttons `Làm lại` + `Tìm kiếm` right-aligned.
  - Section header `Danh sách Hợp đồng nguyên tắc` with 3 toolbar icons on the right.
  - Table columns and stacked field labels match Section 5 of the spec (e.g. `Số tiền đã tích luỹ`, `Quyền lợi tối đa`, dates show seconds).
  - `Xem hợp đồng nguyên tắc` link + blue action icon button present per row.

- [ ] **Step 3: Functional spot-check**

  - Type a customer name fragment into `Tìm kiếm`, click `Tìm kiếm` → table filters.
  - Pick a `Loại bảo hiểm` (e.g. `Gói Taxi PPT`), click `Tìm kiếm` → only Taxi rows show.
  - Toggle `Sắp xếp theo` to `Xếp theo cũ nhất`, click `Tìm kiếm` → order flips.
  - Click `Làm lại` → filters reset, all rows return, pagination back to page 1.

- [ ] **Step 4: Capture a verification screenshot (optional, matches repo convention)**

If matching the `docs/ui/z-*-done.png` convention, save a screenshot of the finished page to `docs/ui/z-master-policies-list-done.png`.

- [ ] **Step 5: Final full lint + typecheck**

Run: `npx tsc -b && npm run lint`
Expected: both PASS with no errors.

- [ ] **Step 6: Stop the dev server**

Stop the `npm run dev` process (Ctrl+C / kill the background task).

- [ ] **Step 7: Commit any verification artifact**

```bash
git add -A
git commit -m "chore(master-policies): add verification screenshot" || echo "nothing to commit"
```

---

## Self-Review

**Spec coverage:**
- §2 Placement & routing → Task 6 (route + sidebar child + breadcrumb in Task 5).
- §4 Filter card (keyword/sort/range/packageType, apply-on-search, Làm lại/Tìm kiếm) → Task 2 (logic) + Task 3 (UI).
- §5 Table (section header + 6 columns + stacked fields + pagination + seconds date) → Task 1 (formatter) + Task 4 (table).
- §6 Mock data (MasterPolicyRow, rows, packageTypeOptions, sortOptions, formatters) → Task 1.
- §7 Component contracts → Tasks 3, 4, 5 (props match exactly).
- §8 Styling → embedded in component code (Tasks 3–5).
- §9 Assumptions (default headers, extra sort option, inert toolbar icons, inert link/action) → realized in Tasks 3, 4.

**Type consistency:** `MasterPolicyRow`, `MasterPoliciesFilters`, `MasterPoliciesSort` defined in Tasks 1–2 are used with identical names/fields in Tasks 3–5. `applyFilters`, `DEFAULT_FILTERS`, `masterPolicyRows`, `packageTypeOptions`, `sortOptions`, `formatMoney`, `formatDateTimeSeconds` all referenced exactly as exported.

**Placeholder scan:** none — every step contains complete code or exact commands.
