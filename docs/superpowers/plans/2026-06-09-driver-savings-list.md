# Driver Savings Policies List Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the "Bảo hiểm tích lũy tài xế" policy-list page as UI + in-memory mock data, faithful to `docs/ui/ppt-policies-list.png`, with functional client-side filtering and table pagination.

**Architecture:** New self-contained `src/pages/driver-savings/` folder mirroring the sibling `src/pages/policies/` pattern — page component, `mock-data.ts`, pure `driver-savings-filters.ts`, focused presentational components under `components/`. The page owns applied-filter + pagination state; a pure `applyFilters` narrows mock rows; AntD `Table` paginates the result. The route already exists (currently a `PlaceholderPage`); only its element is swapped. No sidebar change.

**Tech Stack:** React 19, AntD v6, Tailwind v4, react-router v7, dayjs (ships with AntD). Package manager: **yarn**.

**No tests** (per request). Each task verifies with `npx tsc -b` and a final Playwright visual check. **Reference spec:** `docs/superpowers/specs/2026-06-09-driver-savings-list-design.md`. **Follow** `docs/rules/ui-ux-strict.md` — labels verbatim.

---

## File Structure

```
src/pages/driver-savings/
├── DriverSavingsListPage.tsx        // breadcrumb + title; owns appliedFilters + page state; composes sections
├── mock-data.ts                     // DriverSavingsRow, DriverSavingsStatus, STATUS_CONFIG, statusOptions, driverSavingsRows[], headline totals, formatters
├── driver-savings-filters.ts        // DriverSavingsFilters type, DEFAULT_FILTERS, pure applyFilters()
└── components/
    ├── DriverSavingsStatusBadge.tsx // colored Tag keyed by status
    ├── DriverSavingsFilters.tsx     // AntD Form: 7 controls; Làm lại / Tìm kiếm
    ├── DriverSavingsSummaryBar.tsx  // Tổng số đơn / Tổng phí + CSV link + 3 icon buttons
    └── DriverSavingsTable.tsx       // AntD Table; stacked multi-line cells; status badge; NO action column
```
Modified: `src/app/router.tsx` (one-line element swap).

---

### Task 1: Mock data, types, formatters

**Files:**
- Create: `src/pages/driver-savings/mock-data.ts`

- [ ] **Step 1: Create the mock data module**

```ts
export type DriverSavingsStatus = 'hoan-thanh' | 'hieu-luc' | 'het-hieu-luc' | 'da-huy'

export interface DriverSavingsRow {
  id: string
  phone: string // SĐT
  tripId: string // ID chuyến đi
  plate: string // Biển số xe (filter only; not shown in cells)
  driverCode: string // Mã tài xế
  customerName: string // Tên
  premium: number // Phí bảo hiểm (đ)
  policyNumber: string // Số đơn
  insuranceType: string // Loại bảo hiểm
  effectiveStart: string // Thời gian bắt đầu (ISO)
  effectiveEnd: string // Thời gian kết thúc (ISO)
  createdAt: string // Thời gian tạo / mua (ISO) — for create-date filter
  status: DriverSavingsStatus
}

// Mock assumption (spec §9.1): only "Hoàn thành" is confirmed from the design.
// The other three are placeholders so the filter dropdown functions.
export const STATUS_CONFIG: Record<
  DriverSavingsStatus,
  { selectLabel: string; tagLabel: string; color: string }
> = {
  'hoan-thanh': { selectLabel: 'Đã hoàn thành', tagLabel: 'Hoàn thành', color: 'green' },
  'hieu-luc': { selectLabel: 'Hiệu lực', tagLabel: 'Hiệu lực', color: 'blue' },
  'het-hieu-luc': { selectLabel: 'Hết hiệu lực', tagLabel: 'Hết hiệu lực', color: 'default' },
  'da-huy': { selectLabel: 'Đã hủy', tagLabel: 'Đã hủy', color: 'red' },
}

export const statusOptions = (Object.keys(STATUS_CONFIG) as DriverSavingsStatus[]).map((value) => ({
  value,
  label: STATUS_CONFIG[value].selectLabel,
}))

// Static headline totals — verbatim from the design (server-side totals, spec §9.2).
export const headlineTotalOrders = 7479138
export const headlineTotalPremium = 1238722150

export function formatInt(n: number): string {
  return n.toLocaleString('en-US') // 7,479,138
}

export function formatPremium(n: number): string {
  return n.toLocaleString('vi-VN') // 1.238.722.150
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  const pad = (x: number) => String(x).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// All policies are 6-month accumulation cover starting 01/06/2026 00:00,
// ending 27/11/2026 23:59 — matching the design. createdAt varies for the date filter.
export const driverSavingsRows: DriverSavingsRow[] = [
  {
    id: '1', phone: '+84375689232', tripId: '01KSZFCYNB2QZD8P6D4MSWPJM0', plate: '68H-077.46',
    driverCode: '6006389', customerName: 'Bùi Đức Tầm', premium: 200,
    policyNumber: '25/PC-GSM/6950974/012426', insuranceType: 'Gói Taxi PPT',
    effectiveStart: '2026-06-01T00:00:00', effectiveEnd: '2026-11-27T23:59:00',
    createdAt: '2026-06-01T00:00:00', status: 'hoan-thanh',
  },
  {
    id: '2', phone: '+84387764274', tripId: '01KSZFMSQEKGN3GSBQ0M5WKZV6', plate: '22H-030.63',
    driverCode: '6009542', customerName: 'Nguyễn Duy Tích', premium: 200,
    policyNumber: '25/PC-GSM/7392019/013969', insuranceType: 'Gói Taxi PPT',
    effectiveStart: '2026-06-01T00:00:00', effectiveEnd: '2026-11-27T23:59:00',
    createdAt: '2026-06-01T00:02:00', status: 'hoan-thanh',
  },
  {
    id: '3', phone: '+84936806555', tripId: '01KSZFLNJF367460ND4NDCO3KVP', plate: '36H-157.02',
    driverCode: '6022429', customerName: 'Vũ Gấp Dẫn', premium: 200,
    policyNumber: '25/PC-GSM/7291660/012646', insuranceType: 'Gói Taxi PPT',
    effectiveStart: '2026-06-01T00:00:00', effectiveEnd: '2026-11-27T23:59:00',
    createdAt: '2026-06-02T08:15:00', status: 'hoan-thanh',
  },
  {
    id: '4', phone: '+84901234567', tripId: '01KSZF8QK2M4P7RTYHN3DLWA2C', plate: '29H-512.88',
    driverCode: '6031007', customerName: 'Trần Hùng', premium: 200,
    policyNumber: '25/PC-GSM/7410882/014203', insuranceType: 'Gói Taxi PPT',
    effectiveStart: '2026-06-01T00:00:00', effectiveEnd: '2026-11-27T23:59:00',
    createdAt: '2026-06-02T12:30:00', status: 'hoan-thanh',
  },
  {
    id: '5', phone: '+84912345678', tripId: '01KSZF6BNV8XQ2WCEDR4TMK1HF', plate: '51H-883.21',
    driverCode: '6044318', customerName: 'Nguyễn Lan', premium: 200,
    policyNumber: '25/PC-GSM/7522930/014977', insuranceType: 'Gói Taxi PPT',
    effectiveStart: '2026-06-01T00:00:00', effectiveEnd: '2026-11-27T23:59:00',
    createdAt: '2026-06-03T06:45:00', status: 'hieu-luc',
  },
  {
    id: '6', phone: '+84923456789', tripId: '01KSZF4RPC7YHM9XGAT2VBLE5N', plate: '43H-201.55',
    driverCode: '6058640', customerName: 'Phạm Đức', premium: 200,
    policyNumber: '25/PC-GSM/7639114/015628', insuranceType: 'Gói Taxi PPT',
    effectiveStart: '2026-06-01T00:00:00', effectiveEnd: '2026-11-27T23:59:00',
    createdAt: '2026-06-03T18:20:00', status: 'hoan-thanh',
  },
  {
    id: '7', phone: '+84934567890', tripId: '01KSZF2WTE5JKD8FNQR7YHSC3M', plate: '92H-446.10',
    driverCode: '6061285', customerName: 'Võ Minh', premium: 200,
    policyNumber: '25/PC-GSM/7741250/016304', insuranceType: 'Gói Taxi PPT',
    effectiveStart: '2026-06-01T00:00:00', effectiveEnd: '2026-11-27T23:59:00',
    createdAt: '2026-06-04T09:05:00', status: 'hoan-thanh',
  },
  {
    id: '8', phone: '+84945678901', tripId: '01KSZF1HXA3QWE6RGZP9TMUD4B', plate: '30H-778.93',
    driverCode: '6075992', customerName: 'Đỗ Thu', premium: 200,
    policyNumber: '25/PC-GSM/7858663/017011', insuranceType: 'Gói Taxi PPT',
    effectiveStart: '2026-06-01T00:00:00', effectiveEnd: '2026-11-27T23:59:00',
    createdAt: '2026-06-04T15:40:00', status: 'het-hieu-luc',
  },
  {
    id: '9', phone: '+84956789012', tripId: '01KSZF0DMB9YUT2KFHWA5NRQ6P', plate: '47H-330.62',
    driverCode: '6082137', customerName: 'Bùi Sơn', premium: 200,
    policyNumber: '25/PC-GSM/7960441/017788', insuranceType: 'Gói Taxi PPT',
    effectiveStart: '2026-06-01T00:00:00', effectiveEnd: '2026-11-27T23:59:00',
    createdAt: '2026-06-05T07:25:00', status: 'hoan-thanh',
  },
  {
    id: '10', phone: '+84967890123', tripId: '01KSZEYZQF6WRC4XHNTD8LMK2J', plate: '60H-915.47',
    driverCode: '6098450', customerName: 'Hồ Yến', premium: 200,
    policyNumber: '25/PC-GSM/8072119/018465', insuranceType: 'Gói Taxi PPT',
    effectiveStart: '2026-06-01T00:00:00', effectiveEnd: '2026-11-27T23:59:00',
    createdAt: '2026-06-05T20:10:00', status: 'hoan-thanh',
  },
  {
    id: '11', phone: '+84978901234', tripId: '01KSZEX4WG2TMD7YKHRA9NPC5V', plate: '72H-188.34',
    driverCode: '6103776', customerName: 'Dương Khoa', premium: 200,
    policyNumber: '25/PC-GSM/8183507/019142', insuranceType: 'Gói Taxi PPT',
    effectiveStart: '2026-06-01T00:00:00', effectiveEnd: '2026-11-27T23:59:00',
    createdAt: '2026-06-06T11:50:00', status: 'da-huy',
  },
  {
    id: '12', phone: '+84989012345', tripId: '01KSZEW8YH5KNF3RDTQA7MLB6X', plate: '88H-177.08',
    driverCode: '6117039', customerName: 'Lý Hà', premium: 200,
    policyNumber: '25/PC-GSM/8294885/019819', insuranceType: 'Gói Taxi PPT',
    effectiveStart: '2026-06-01T00:00:00', effectiveEnd: '2026-11-27T23:59:00',
    createdAt: '2026-06-08T07:30:00', status: 'hoan-thanh',
  },
]
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b`
Expected: PASS (no errors).

- [ ] **Step 3: Commit**

```bash
git add src/pages/driver-savings/mock-data.ts
git commit -m "feat(driver-savings): add mock data, types and formatters"
```

---

### Task 2: Pure filter util

**Files:**
- Create: `src/pages/driver-savings/driver-savings-filters.ts`

- [ ] **Step 1: Create the filter module**

```ts
import type { DriverSavingsRow, DriverSavingsStatus } from './mock-data'

export interface DriverSavingsFilters {
  phone: string
  tripId: string
  plate: string
  driverCode: string
  effectiveRange: [string, string] | null // Thời gian bắt đầu hiệu lực (YYYY-MM-DD)
  createdRange: [string, string] | null // Thời gian tạo (Thời gian mua) (YYYY-MM-DD)
  status: DriverSavingsStatus | null
}

export const DEFAULT_FILTERS: DriverSavingsFilters = {
  phone: '',
  tripId: '',
  plate: '',
  driverCode: '',
  effectiveRange: null,
  createdRange: ['2026-06-01', '2026-06-09'],
  status: 'hoan-thanh',
}

function inRange(iso: string, range: [string, string] | null): boolean {
  if (!range) return true
  const day = iso.slice(0, 10) // YYYY-MM-DD; lexical compare is valid for ISO dates
  return day >= range[0] && day <= range[1]
}

function hasText(value: string, query: string): boolean {
  if (!query.trim()) return true
  return value.toLowerCase().includes(query.trim().toLowerCase())
}

export function applyFilters(rows: DriverSavingsRow[], f: DriverSavingsFilters): DriverSavingsRow[] {
  return rows.filter(
    (row) =>
      hasText(row.phone, f.phone) &&
      hasText(row.tripId, f.tripId) &&
      hasText(row.plate, f.plate) &&
      hasText(row.driverCode, f.driverCode) &&
      (f.status === null || row.status === f.status) &&
      inRange(row.effectiveStart, f.effectiveRange) &&
      inRange(row.createdAt, f.createdRange),
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/driver-savings/driver-savings-filters.ts
git commit -m "feat(driver-savings): add pure client-side filter util"
```

---

### Task 3: Status badge component

**Files:**
- Create: `src/pages/driver-savings/components/DriverSavingsStatusBadge.tsx`

- [ ] **Step 1: Create the badge**

```tsx
import { Tag } from 'antd'
import { STATUS_CONFIG, type DriverSavingsStatus } from '../mock-data'

interface DriverSavingsStatusBadgeProps {
  status: DriverSavingsStatus
}

export function DriverSavingsStatusBadge({ status }: DriverSavingsStatusBadgeProps) {
  const { tagLabel, color } = STATUS_CONFIG[status]
  return (
    <Tag color={color} className="rounded-full px-2 py-0.5">
      {tagLabel}
    </Tag>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/driver-savings/components/DriverSavingsStatusBadge.tsx
git commit -m "feat(driver-savings): add status badge component"
```

---

### Task 4: Filter bar component

**Files:**
- Create: `src/pages/driver-savings/components/DriverSavingsFilters.tsx`

Note: `dayjs` ships with AntD v6 (already used by `src/pages/policies/components/PolicyFilters.tsx`).

- [ ] **Step 1: Create the filter bar**

```tsx
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { statusOptions } from '../mock-data'
import { DEFAULT_FILTERS, type DriverSavingsFilters } from '../driver-savings-filters'

const { RangePicker } = DatePicker

interface DriverSavingsFiltersProps {
  onSearch: (filters: DriverSavingsFilters) => void
  onReset: () => void
}

interface FormShape {
  phone?: string
  tripId?: string
  plate?: string
  driverCode?: string
  effectiveRange?: [Dayjs, Dayjs] | null
  createdRange?: [Dayjs, Dayjs] | null
  status?: DriverSavingsFilters['status']
}

const initialValues: FormShape = {
  phone: '',
  tripId: '',
  plate: '',
  driverCode: '',
  effectiveRange: null,
  createdRange: [dayjs(DEFAULT_FILTERS.createdRange![0]), dayjs(DEFAULT_FILTERS.createdRange![1])],
  status: DEFAULT_FILTERS.status,
}

function toIsoRange(range?: [Dayjs, Dayjs] | null): [string, string] | null {
  if (!range || !range[0] || !range[1]) return null
  return [range[0].format('YYYY-MM-DD'), range[1].format('YYYY-MM-DD')]
}

export function DriverSavingsFilters({ onSearch, onReset }: DriverSavingsFiltersProps) {
  const [form] = Form.useForm<FormShape>()

  const handleSearch = () => {
    const v = form.getFieldsValue()
    onSearch({
      phone: v.phone ?? '',
      tripId: v.tripId ?? '',
      plate: v.plate ?? '',
      driverCode: v.driverCode ?? '',
      effectiveRange: toIsoRange(v.effectiveRange),
      createdRange: toIsoRange(v.createdRange),
      status: v.status ?? null,
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
      <Row gutter={16}>
        <Col xs={24} md={6}>
          <Form.Item label="Số điện thoại" name="phone" className="mb-3">
            <Input placeholder="Nhập số điện thoại" allowClear />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="ID chuyến đi" name="tripId" className="mb-3">
            <Input placeholder="Nhập ID chuyến đi" allowClear />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="Biển số xe" name="plate" className="mb-3">
            <Input placeholder="Nhập biển số xe" allowClear />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="Mã tài xế" name="driverCode" className="mb-3">
            <Input placeholder="Nhập mã tài xế" allowClear />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16} align="bottom">
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
          <Form.Item label="Thời gian tạo (Thời gian mua)" name="createdRange" className="mb-0">
            <RangePicker
              className="w-full"
              format="YYYY-MM-DD"
              placeholder={['Từ ngày', 'Đến ngày']}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="Trạng thái đơn bảo hiểm" name="status" className="mb-0">
            <Select options={statusOptions} allowClear placeholder="Chọn trạng thái" />
          </Form.Item>
        </Col>
        <Col xs={24} md={6} className="flex items-end justify-end gap-2 pt-3 md:pt-0">
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

- [ ] **Step 2: Type-check**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/driver-savings/components/DriverSavingsFilters.tsx
git commit -m "feat(driver-savings): add filter bar with reset/search"
```

---

### Task 5: Summary bar component

**Files:**
- Create: `src/pages/driver-savings/components/DriverSavingsSummaryBar.tsx`

- [ ] **Step 1: Create the summary bar**

```tsx
import { Button, Tooltip } from 'antd'
import {
  ColumnHeightOutlined,
  ExportOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import {
  formatInt,
  formatPremium,
  headlineTotalOrders,
  headlineTotalPremium,
} from '../mock-data'

export function DriverSavingsSummaryBar() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-white px-5 py-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="space-y-1 text-sm">
        <div>
          <span className="font-semibold text-gray-700">Tổng số đơn</span>
          <span className="text-gray-500"> : </span>
          <span className="text-gray-800">{formatInt(headlineTotalOrders)}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Tổng phí bảo hiểm</span>
          <span className="text-gray-500"> : </span>
          <span className="text-gray-800">{formatPremium(headlineTotalPremium)} đ</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button type="text" icon={<ExportOutlined />} className="text-gray-600">
          Xuất danh sách đơn bảo hiểm CSV
        </Button>
        <Tooltip title="Tải lại">
          <Button icon={<ReloadOutlined />} />
        </Tooltip>
        <Tooltip title="Độ cao hàng">
          <Button icon={<ColumnHeightOutlined />} />
        </Tooltip>
        <Tooltip title="Cài đặt cột">
          <Button icon={<SettingOutlined />} />
        </Tooltip>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/driver-savings/components/DriverSavingsSummaryBar.tsx
git commit -m "feat(driver-savings): add summary bar with totals and toolbar"
```

---

### Task 6: Driver savings table component

**Files:**
- Create: `src/pages/driver-savings/components/DriverSavingsTable.tsx`

Note: this table has **no** action column (per design) — so no `Button`/`EyeOutlined` import.

- [ ] **Step 1: Create the table**

```tsx
import type { ReactNode } from 'react'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { formatDateTime, formatPremium, type DriverSavingsRow } from '../mock-data'
import { DriverSavingsStatusBadge } from './DriverSavingsStatusBadge'

const PAGE_SIZE = 10

interface DriverSavingsTableProps {
  rows: DriverSavingsRow[]
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

export function DriverSavingsTable({ rows, page, onPageChange }: DriverSavingsTableProps) {
  const columns: ColumnsType<DriverSavingsRow> = [
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
          <Field label="Mã tài xế" value={row.driverCode} />
          <Field label="Tên" value={row.customerName} />
          <Field label="SĐT" value={row.phone} />
        </div>
      ),
    },
    {
      title: 'Thông tin đơn bảo hiểm',
      key: 'policy',
      render: (_v, row) => (
        <div className="space-y-1">
          <Field label="ID chuyến đi" value={row.tripId} />
          <Field label="Phí bảo hiểm" value={`${formatPremium(row.premium)} đ`} />
          <Field label="Số đơn" value={row.policyNumber} />
          <Field label="Loại bảo hiểm" value={row.insuranceType} />
        </div>
      ),
    },
    {
      title: 'Thời gian hiệu lực',
      key: 'effective',
      render: (_v, row) => (
        <div className="space-y-1">
          <Field label="Thời gian bắt đầu" value={formatDateTime(row.effectiveStart)} />
          <Field label="Thời gian kết thúc" value={formatDateTime(row.effectiveEnd)} />
        </div>
      ),
    },
    {
      title: 'Trạng thái đơn bảo hiểm',
      key: 'status',
      width: 200,
      render: (_v, row) => <DriverSavingsStatusBadge status={row.status} />,
    },
  ]

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-2 shadow-sm">
      <Table<DriverSavingsRow>
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

- [ ] **Step 2: Type-check**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/driver-savings/components/DriverSavingsTable.tsx
git commit -m "feat(driver-savings): add table with stacked cells and pagination"
```

---

### Task 7: Page composition

**Files:**
- Create: `src/pages/driver-savings/DriverSavingsListPage.tsx`

- [ ] **Step 1: Create the page**

```tsx
import { useMemo, useState } from 'react'
import { Breadcrumb } from 'antd'
import { driverSavingsRows } from './mock-data'
import { applyFilters, DEFAULT_FILTERS, type DriverSavingsFilters } from './driver-savings-filters'
import { DriverSavingsFilters as DriverSavingsFiltersBar } from './components/DriverSavingsFilters'
import { DriverSavingsSummaryBar } from './components/DriverSavingsSummaryBar'
import { DriverSavingsTable } from './components/DriverSavingsTable'

export function DriverSavingsListPage() {
  const [appliedFilters, setAppliedFilters] = useState<DriverSavingsFilters>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)

  const filteredRows = useMemo(
    () => applyFilters(driverSavingsRows, appliedFilters),
    [appliedFilters],
  )

  const handleSearch = (filters: DriverSavingsFilters) => {
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
          items={[{ title: 'Đơn bảo hiểm' }, { title: 'Bảo hiểm tích lũy tài xế' }]}
        />
        <h1 className="text-xl font-semibold text-gray-800">Bảo hiểm tích lũy tài xế</h1>
      </div>
      <DriverSavingsFiltersBar onSearch={handleSearch} onReset={handleReset} />
      <DriverSavingsSummaryBar />
      <DriverSavingsTable rows={filteredRows} page={page} onPageChange={setPage} />
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/driver-savings/DriverSavingsListPage.tsx
git commit -m "feat(driver-savings): compose list page with filter + table state"
```

---

### Task 8: Routing wiring

**Files:**
- Modify: `src/app/router.tsx`

- [ ] **Step 1: Add the import**

In `src/app/router.tsx`, add after the existing page imports (the line `import { AccountSettingsPage } from '../pages/account-settings/AccountSettingsPage'`):

```tsx
import { DriverSavingsListPage } from '../pages/driver-savings/DriverSavingsListPage'
```

- [ ] **Step 2: Swap the route element**

Replace this existing line:

```tsx
      { path: 'don-bao-hiem/bao-hiem-tich-luy-tai-xe', element: <PlaceholderPage title="Bảo hiểm tích lũy tài xế" /> },
```

with:

```tsx
      { path: 'don-bao-hiem/bao-hiem-tich-luy-tai-xe', element: <DriverSavingsListPage /> },
```

Leave every other route untouched. The sidebar entry for this route already exists in `src/layouts/AdminLayout/SidebarNav.tsx` — no sidebar change.

- [ ] **Step 3: Type-check**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/app/router.tsx
git commit -m "feat(driver-savings): wire page to /don-bao-hiem/bao-hiem-tich-luy-tai-xe route"
```

---

### Task 9: Build + visual verification

**Files:** none (verification only)

- [ ] **Step 1: Full production build**

Run: `yarn build`
Expected: PASS (`tsc -b` clean, `vite build` succeeds).

- [ ] **Step 2: Start the dev server**

Run: `yarn dev` (background). Note the local URL (default `http://localhost:5173`).

- [ ] **Step 3: Visual check against the design**

Navigate to `http://localhost:5173/don-bao-hiem/bao-hiem-tich-luy-tai-xe` (Playwright MCP `browser_navigate` + `browser_take_screenshot`, viewport 1440 wide). Compare to `docs/ui/ppt-policies-list.png`. Verify:
  - Breadcrumb `Đơn bảo hiểm / Bảo hiểm tích lũy tài xế` and the h1 title.
  - Sidebar `Bảo hiểm tích lũy tài xế` item highlighted under `Đơn bảo hiểm`.
  - Filter bar row 1: `Số điện thoại`, `ID chuyến đi`, `Biển số xe`, `Mã tài xế`. Row 2: `Thời gian bắt đầu hiệu lực`, `Thời gian tạo (Thời gian mua)` (defaults `2026-06-01`/`2026-06-09`), `Trạng thái đơn bảo hiểm` (`Đã hoàn thành`), `Làm lại`/`Tìm kiếm`.
  - Summary line: `Tổng số đơn : 7,479,138`, `Tổng phí bảo hiểm : 1.238.722.150 đ`, CSV button + 3 icon buttons.
  - Table: 5 columns (`STT`, `Thông tin khách hàng`, `Thông tin đơn bảo hiểm`, `Thời gian hiệu lực`, `Trạng thái đơn bảo hiểm`) — no action column; stacked multi-line cells; green `Hoàn thành` tags; pager shows the `hoan-thanh` rows (9 of 12) on page 1.

- [ ] **Step 4: Behaviour spot-check**

  - Type `6022429` into `Mã tài xế`, click `Tìm kiếm` → only the matching row remains.
  - Clear the status select → click `Tìm kiếm` → `hieu-luc`/`het-hieu-luc`/`da-huy` rows also appear (all 12 createdAt fall in 2026-06-01..09, so all 12 show).
  - Click `Làm lại` → filters reset to defaults (status `Đã hoàn thành`, created range 2026-06-01..09), page back to 1.

- [ ] **Step 5: Final commit (if any tweaks were needed)**

```bash
git add -A
git commit -m "chore(driver-savings): verify list page renders per design"
```

---

## Self-Review

- **Spec coverage:** §3 file layout → Tasks 1–8. §4 labels (breadcrumb/title, 4 filter inputs + 2 ranges + status, summary, 5 table columns, no action column) → Tasks 1,4,5,6,7,8 verbatim. §5 data model → Task 1 (`DriverSavingsRow` fields exact). §6 filter behavior (phone/tripId/plate/driverCode substring, status exact, effectiveRange→effectiveStart, createdRange→createdAt) → Tasks 2,7. §7 styling → Tasks 4,5,6. §8 routing (one-line element swap, no sidebar change) → Task 8. §9 mock assumptions → Task 1 `STATUS_CONFIG` placeholders + static headline consts. §10 out-of-scope respected (icons no-op, no API, no tests, policies/ untouched). ✓
- **Placeholder scan:** No TBD/TODO; every code step shows full code. ✓
- **Type consistency:** `DriverSavingsRow`, `DriverSavingsStatus`, `DriverSavingsFilters`, `DEFAULT_FILTERS`, `applyFilters`, `STATUS_CONFIG`, `statusOptions`, `driverSavingsRows`, `formatDateTime`/`formatInt`/`formatPremium` identical across Tasks 1–7. Field names (`phone`, `driverCode`, `customerName`, `policyNumber`, `insuranceType`, `effectiveStart`, `effectiveEnd`, `createdAt`) match between mock-data (Task 1), filter util (Task 2), and table (Task 6). `PAGE_SIZE = 10` matches the pager. The page imports the `DriverSavingsFilters` component aliased as `DriverSavingsFiltersBar` to avoid colliding with the `DriverSavingsFilters` type. ✓
