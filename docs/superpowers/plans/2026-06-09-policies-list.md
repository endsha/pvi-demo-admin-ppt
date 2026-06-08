# Policies List Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the "Tai nạn hành khách theo chuyến" policy-list page as UI + in-memory mock data, faithful to `docs/ui/policies-list.png`, with functional client-side filtering and table pagination.

**Architecture:** Mirror the existing dashboard pattern — a `src/pages/policies/` folder with the page component, a `mock-data.ts`, a pure `policies-filters.ts`, and focused presentational components under `components/`. The page owns applied-filter + pagination state; a pure `applyFilters` narrows mock rows; AntD `Table` paginates the result. A new route and sidebar submenu make it reachable.

**Tech Stack:** React 19, AntD v6, Tailwind v4, react-router v7, dayjs (ships with AntD). Package manager: **yarn**.

**No tests** (per request). Each task verifies with `npx tsc -b` and a final Playwright visual check. **Reference spec:** `docs/superpowers/specs/2026-06-09-policies-list-design.md`. **Follow** `docs/rules/ui-ux-strict.md` — labels verbatim.

---

## File Structure

```
src/pages/policies/
├── PoliciesListPage.tsx        // breadcrumb + title; owns appliedFilters + page state; composes sections
├── mock-data.ts                // PolicyRow, PolicyStatus, STATUS_CONFIG, statusOptions, policyRows[], headline totals, formatters
├── policies-filters.ts         // PolicyFilters type, DEFAULT_FILTERS, pure applyFilters()
└── components/
    ├── PolicyStatusBadge.tsx   // colored Tag keyed by status
    ├── PolicyFilters.tsx       // AntD Form: 6 fields; Làm lại / Tìm kiếm
    ├── PolicySummaryBar.tsx    // Tổng số đơn / Tổng phí + CSV link + 3 icon buttons
    └── PolicyTable.tsx         // AntD Table; stacked multi-line cells; status badge; action button
```
Modified: `src/app/router.tsx`, `src/layouts/AdminLayout/SidebarNav.tsx`.

---

### Task 1: Mock data, types, formatters

**Files:**
- Create: `src/pages/policies/mock-data.ts`

- [ ] **Step 1: Create the mock data module**

```ts
export type PolicyStatus = 'hoan-thanh' | 'hieu-luc' | 'het-hieu-luc' | 'da-huy'

export interface PolicyRow {
  id: string
  tripId: string // ID chuyến đi
  premium: number // Phí bảo hiểm (đ)
  plate: string // Biển số xe
  bookerName: string // Tên người đặt
  bookerPhone: string // SĐT người đặt
  riderName: string // Tên người đi
  riderPhone: string // SĐT người đi
  startAt: string // Thời gian bắt đầu (ISO)
  endAt: string // Thời gian kết thúc (ISO)
  fromAddress: string // Địa chỉ đi
  toAddress: string // Địa chỉ đến
  createdAt: string // Thời gian tạo đơn (ISO)
  status: PolicyStatus
}

// Mock assumption (spec §9.1): only "Hoàn thành" is confirmed from the design.
// The other three are placeholders so the filter dropdown functions.
export const STATUS_CONFIG: Record<
  PolicyStatus,
  { selectLabel: string; tagLabel: string; color: string }
> = {
  'hoan-thanh': { selectLabel: 'Đã hoàn thành', tagLabel: 'Hoàn thành', color: 'green' },
  'hieu-luc': { selectLabel: 'Hiệu lực', tagLabel: 'Hiệu lực', color: 'blue' },
  'het-hieu-luc': { selectLabel: 'Hết hiệu lực', tagLabel: 'Hết hiệu lực', color: 'default' },
  'da-huy': { selectLabel: 'Đã hủy', tagLabel: 'Đã hủy', color: 'red' },
}

export const statusOptions = (Object.keys(STATUS_CONFIG) as PolicyStatus[]).map((value) => ({
  value,
  label: STATUS_CONFIG[value].selectLabel,
}))

// Static headline totals — verbatim from the design (server-side totals, spec §9.2).
export const headlineTotalOrders = 721084
export const headlineTotalPremium = 1442168000

export function formatInt(n: number): string {
  return n.toLocaleString('en-US') // 721,084
}

export function formatPremium(n: number): string {
  return n.toLocaleString('vi-VN') // 1.442.168.000
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  const pad = (x: number) => String(x).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export const policyRows: PolicyRow[] = [
  {
    id: '1', tripId: '01K5ZFKYE36CXTC6TCVN18R6AZ', premium: 2000, plate: '68H-077.46',
    bookerName: 'lê xuyên', bookerPhone: '0869056332', riderName: 'lê xuyên', riderPhone: '0869056332',
    startAt: '2026-06-01T00:00:00', endAt: '2026-06-01T00:03:00',
    fromAddress: 'Dương Đông, Phú Quốc, Kiên Giang', toAddress: 'Đặc khu Phú Quốc, Tỉnh An Giang, Việt Nam',
    createdAt: '2026-06-01T00:00:00', status: 'hoan-thanh',
  },
  {
    id: '2', tripId: '01K5ZFKMNMJGH4E3JXVG6TFN7X', premium: 2000, plate: '22H-030.63',
    bookerName: 'Kiến', bookerPhone: '0975789021', riderName: 'Kiến', riderPhone: '0975789021',
    startAt: '2026-06-01T00:02:00', endAt: '2026-06-01T00:05:00',
    fromAddress: 'Phường Hà Giang 1, Tỉnh Tuyên Quang, Việt Nam', toAddress: 'Tổ 10, Phường Hà Giang 2, Tỉnh Tuyên Quang, Việt Nam',
    createdAt: '2026-06-01T00:02:00', status: 'hoan-thanh',
  },
  {
    id: '3', tripId: '01K5ZFEWDO1V9NF9E6WGZS1K9Z', premium: 2000, plate: '36H-157.02',
    bookerName: 'mai văn mạnh', bookerPhone: '0968966332', riderName: 'mai văn mạnh', riderPhone: '0968966332',
    startAt: '2026-06-01T00:00:00', endAt: '2026-06-01T00:04:00',
    fromAddress: 'P.Điện Biên, Tp.Thanh Hóa, Thanh Hóa, 40000, Vietnam', toAddress: 'Phường Hàm Rồng, Tp.Thanh Hóa, Thanh Hóa, Việt Nam',
    createdAt: '2026-06-01T00:00:00', status: 'hoan-thanh',
  },
  {
    id: '4', tripId: '01K5ZF8QK2M4P7RTYHN3DLWA2C', premium: 2000, plate: '29H-512.88',
    bookerName: 'Trần Hùng', bookerPhone: '0901234567', riderName: 'Trần Hùng', riderPhone: '0901234567',
    startAt: '2026-06-02T08:15:00', endAt: '2026-06-02T08:40:00',
    fromAddress: 'Quận Cầu Giấy, Hà Nội, Việt Nam', toAddress: 'Quận Đống Đa, Hà Nội, Việt Nam',
    createdAt: '2026-06-02T08:15:00', status: 'hoan-thanh',
  },
  {
    id: '5', tripId: '01K5ZF6BNV8XQ2WCEDR4TMK1HF', premium: 2000, plate: '51H-883.21',
    bookerName: 'Nguyễn Lan', bookerPhone: '0912345678', riderName: 'Nguyễn Lan', riderPhone: '0912345678',
    startAt: '2026-06-02T12:30:00', endAt: '2026-06-02T12:55:00',
    fromAddress: 'Quận 1, TP. Hồ Chí Minh, Việt Nam', toAddress: 'Quận 3, TP. Hồ Chí Minh, Việt Nam',
    createdAt: '2026-06-02T12:30:00', status: 'hieu-luc',
  },
  {
    id: '6', tripId: '01K5ZF4RPC7YHM9XGAT2VBLE5N', premium: 2000, plate: '43H-201.55',
    bookerName: 'Phạm Đức', bookerPhone: '0923456789', riderName: 'Phạm Đức', riderPhone: '0923456789',
    startAt: '2026-06-03T06:45:00', endAt: '2026-06-03T07:10:00',
    fromAddress: 'Quận Hải Châu, Đà Nẵng, Việt Nam', toAddress: 'Quận Sơn Trà, Đà Nẵng, Việt Nam',
    createdAt: '2026-06-03T06:45:00', status: 'hoan-thanh',
  },
  {
    id: '7', tripId: '01K5ZF2WTE5JKD8FNQR7YHSC3M', premium: 2000, plate: '92H-446.10',
    bookerName: 'Võ Minh', bookerPhone: '0934567890', riderName: 'Võ Minh', riderPhone: '0934567890',
    startAt: '2026-06-03T18:20:00', endAt: '2026-06-03T18:50:00',
    fromAddress: 'TP. Tam Kỳ, Quảng Nam, Việt Nam', toAddress: 'TP. Hội An, Quảng Nam, Việt Nam',
    createdAt: '2026-06-03T18:20:00', status: 'hoan-thanh',
  },
  {
    id: '8', tripId: '01K5ZF1HXA3QWE6RGZP9TMUD4B', premium: 2000, plate: '30H-778.93',
    bookerName: 'Đỗ Thu', bookerPhone: '0945678901', riderName: 'Đỗ Thu', riderPhone: '0945678901',
    startAt: '2026-06-04T09:05:00', endAt: '2026-06-04T09:35:00',
    fromAddress: 'Quận Hoàn Kiếm, Hà Nội, Việt Nam', toAddress: 'Quận Tây Hồ, Hà Nội, Việt Nam',
    createdAt: '2026-06-04T09:05:00', status: 'het-hieu-luc',
  },
  {
    id: '9', tripId: '01K5ZF0DMB9YUT2KFHWA5NRQ6P', premium: 2000, plate: '47H-330.62',
    bookerName: 'Bùi Sơn', bookerPhone: '0956789012', riderName: 'Bùi Sơn', riderPhone: '0956789012',
    startAt: '2026-06-04T15:40:00', endAt: '2026-06-04T16:05:00',
    fromAddress: 'TP. Buôn Ma Thuột, Đắk Lắk, Việt Nam', toAddress: 'Huyện Cư Mgar, Đắk Lắk, Việt Nam',
    createdAt: '2026-06-04T15:40:00', status: 'hoan-thanh',
  },
  {
    id: '10', tripId: '01K5ZEYZQF6WRC4XHNTD8LMK2J', premium: 2000, plate: '60H-915.47',
    bookerName: 'Hồ Yến', bookerPhone: '0967890123', riderName: 'Hồ Yến', riderPhone: '0967890123',
    startAt: '2026-06-05T07:25:00', endAt: '2026-06-05T07:55:00',
    fromAddress: 'TP. Biên Hòa, Đồng Nai, Việt Nam', toAddress: 'Huyện Long Thành, Đồng Nai, Việt Nam',
    createdAt: '2026-06-05T07:25:00', status: 'hoan-thanh',
  },
  {
    id: '11', tripId: '01K5ZEX4WG2TMD7YKHRA9NPC5V', premium: 2000, plate: '72H-188.34',
    bookerName: 'Dương Khoa', bookerPhone: '0978901234', riderName: 'Dương Khoa', riderPhone: '0978901234',
    startAt: '2026-06-05T20:10:00', endAt: '2026-06-05T20:38:00',
    fromAddress: 'TP. Vũng Tàu, Bà Rịa - Vũng Tàu, Việt Nam', toAddress: 'TP. Bà Rịa, Bà Rịa - Vũng Tàu, Việt Nam',
    createdAt: '2026-06-05T20:10:00', status: 'da-huy',
  },
  {
    id: '12', tripId: '01K5ZEW8YH5KNF3RDTQA7MLB6X', premium: 2000, plate: '88H-177.08',
    bookerName: 'Lý Hà', bookerPhone: '0989012345', riderName: 'Lý Hà', riderPhone: '0989012345',
    startAt: '2026-06-06T11:50:00', endAt: '2026-06-06T12:20:00',
    fromAddress: 'TP. Cần Thơ, Việt Nam', toAddress: 'Huyện Phong Điền, Cần Thơ, Việt Nam',
    createdAt: '2026-06-06T11:50:00', status: 'hoan-thanh',
  },
]
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b`
Expected: PASS (no errors).

- [ ] **Step 3: Commit**

```bash
git add src/pages/policies/mock-data.ts
git commit -m "feat(policies): add mock data, types and formatters"
```

---

### Task 2: Pure filter util

**Files:**
- Create: `src/pages/policies/policies-filters.ts`

- [ ] **Step 1: Create the filter module**

```ts
import type { PolicyRow, PolicyStatus } from './mock-data'

export interface PolicyFilters {
  phone: string
  tripId: string
  plate: string
  effectiveRange: [string, string] | null // Thời gian bắt đầu hiệu lực (YYYY-MM-DD)
  createdRange: [string, string] | null // Thời gian tạo đơn bảo hiểm (YYYY-MM-DD)
  status: PolicyStatus | null
}

export const DEFAULT_FILTERS: PolicyFilters = {
  phone: '',
  tripId: '',
  plate: '',
  effectiveRange: null,
  createdRange: ['2026-06-01', '2026-06-08'],
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

export function applyFilters(rows: PolicyRow[], f: PolicyFilters): PolicyRow[] {
  return rows.filter((row) => {
    const phoneOk =
      !f.phone.trim() || hasText(row.bookerPhone, f.phone) || hasText(row.riderPhone, f.phone)
    return (
      phoneOk &&
      hasText(row.tripId, f.tripId) &&
      hasText(row.plate, f.plate) &&
      (f.status === null || row.status === f.status) &&
      inRange(row.startAt, f.effectiveRange) &&
      inRange(row.createdAt, f.createdRange)
    )
  })
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/policies/policies-filters.ts
git commit -m "feat(policies): add pure client-side filter util"
```

---

### Task 3: Status badge component

**Files:**
- Create: `src/pages/policies/components/PolicyStatusBadge.tsx`

- [ ] **Step 1: Create the badge**

```tsx
import { Tag } from 'antd'
import { STATUS_CONFIG, type PolicyStatus } from '../mock-data'

interface PolicyStatusBadgeProps {
  status: PolicyStatus
}

export function PolicyStatusBadge({ status }: PolicyStatusBadgeProps) {
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
git add src/pages/policies/components/PolicyStatusBadge.tsx
git commit -m "feat(policies): add status badge component"
```

---

### Task 4: Filter bar component

**Files:**
- Create: `src/pages/policies/components/PolicyFilters.tsx`

Note: `dayjs` ships with AntD v6. If `import dayjs` fails to resolve, run `yarn add dayjs`.

- [ ] **Step 1: Create the filter bar**

```tsx
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { statusOptions } from '../mock-data'
import { DEFAULT_FILTERS, type PolicyFilters } from '../policies-filters'

const { RangePicker } = DatePicker

interface PolicyFiltersProps {
  onSearch: (filters: PolicyFilters) => void
  onReset: () => void
}

interface FormShape {
  phone?: string
  tripId?: string
  plate?: string
  effectiveRange?: [Dayjs, Dayjs] | null
  createdRange?: [Dayjs, Dayjs] | null
  status?: PolicyFilters['status']
}

const initialValues: FormShape = {
  phone: '',
  tripId: '',
  plate: '',
  effectiveRange: null,
  createdRange: [dayjs(DEFAULT_FILTERS.createdRange![0]), dayjs(DEFAULT_FILTERS.createdRange![1])],
  status: DEFAULT_FILTERS.status,
}

function toIsoRange(range?: [Dayjs, Dayjs] | null): [string, string] | null {
  if (!range || !range[0] || !range[1]) return null
  return [range[0].format('YYYY-MM-DD'), range[1].format('YYYY-MM-DD')]
}

export function PolicyFilters({ onSearch, onReset }: PolicyFiltersProps) {
  const [form] = Form.useForm<FormShape>()

  const handleSearch = () => {
    const v = form.getFieldsValue()
    onSearch({
      phone: v.phone ?? '',
      tripId: v.tripId ?? '',
      plate: v.plate ?? '',
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
          <Form.Item label="Thời gian bắt đầu hiệu lực" name="effectiveRange" className="mb-3">
            <RangePicker
              className="w-full"
              format="YYYY-MM-DD"
              placeholder={['Từ ngày', 'Đến ngày']}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16} align="bottom">
        <Col xs={24} md={6}>
          <Form.Item label="Thời gian tạo đơn bảo hiểm" name="createdRange" className="mb-0">
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
        <Col xs={24} md={12} className="flex items-end justify-end gap-2 pt-3 md:pt-0">
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
git add src/pages/policies/components/PolicyFilters.tsx
git commit -m "feat(policies): add filter bar with reset/search"
```

---

### Task 5: Summary bar component

**Files:**
- Create: `src/pages/policies/components/PolicySummaryBar.tsx`

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

export function PolicySummaryBar() {
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
git add src/pages/policies/components/PolicySummaryBar.tsx
git commit -m "feat(policies): add summary bar with totals and toolbar"
```

---

### Task 6: Policy table component

**Files:**
- Create: `src/pages/policies/components/PolicyTable.tsx`

- [ ] **Step 1: Create the table**

```tsx
import type { ReactNode } from 'react'
import { Button, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EyeOutlined } from '@ant-design/icons'
import { formatDateTime, formatPremium, type PolicyRow } from '../mock-data'
import { PolicyStatusBadge } from './PolicyStatusBadge'

const PAGE_SIZE = 10

interface PolicyTableProps {
  rows: PolicyRow[]
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

export function PolicyTable({ rows, page, onPageChange }: PolicyTableProps) {
  const columns: ColumnsType<PolicyRow> = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      render: (_value, _row, index) => (page - 1) * PAGE_SIZE + index + 1,
    },
    {
      title: 'Thông tin chuyến đi',
      key: 'trip',
      render: (_v, row) => (
        <div className="space-y-1">
          <Field label="ID chuyến đi" value={row.tripId} />
          <Field label="Phí bảo hiểm" value={`${formatPremium(row.premium)} đ`} />
          <Field label="Biển số xe" value={row.plate} />
        </div>
      ),
    },
    {
      title: 'Thông tin khách hàng',
      key: 'customer',
      render: (_v, row) => (
        <div className="space-y-1">
          <Field label="Tên người đặt" value={row.bookerName} />
          <Field label="SĐT người đặt" value={row.bookerPhone} />
          <Field label="Tên người đi" value={row.riderName} />
          <Field label="SĐT người đi" value={row.riderPhone} />
        </div>
      ),
    },
    {
      title: 'Thời gian và địa điểm',
      key: 'timeplace',
      render: (_v, row) => (
        <div className="space-y-1">
          <Field label="Thời gian bắt đầu" value={formatDateTime(row.startAt)} />
          <Field label="Thời gian kết thúc" value={formatDateTime(row.endAt)} />
          <Field label="Địa chỉ đi" value={row.fromAddress} />
          <Field label="Địa chỉ đến" value={row.toAddress} />
        </div>
      ),
    },
    {
      title: 'Trạng thái đơn bảo hiểm',
      key: 'status',
      width: 180,
      render: (_v, row) => <PolicyStatusBadge status={row.status} />,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      render: () => <Button type="primary" icon={<EyeOutlined />} />,
    },
  ]

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-2 shadow-sm">
      <Table<PolicyRow>
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
git add src/pages/policies/components/PolicyTable.tsx
git commit -m "feat(policies): add policy table with stacked cells and pagination"
```

---

### Task 7: Page composition

**Files:**
- Create: `src/pages/policies/PoliciesListPage.tsx`

- [ ] **Step 1: Create the page**

```tsx
import { useMemo, useState } from 'react'
import { Breadcrumb } from 'antd'
import { policyRows } from './mock-data'
import { applyFilters, DEFAULT_FILTERS, type PolicyFilters } from './policies-filters'
import { PolicyFilters as PolicyFiltersBar } from './components/PolicyFilters'
import { PolicySummaryBar } from './components/PolicySummaryBar'
import { PolicyTable } from './components/PolicyTable'

export function PoliciesListPage() {
  const [appliedFilters, setAppliedFilters] = useState<PolicyFilters>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)

  const filteredRows = useMemo(
    () => applyFilters(policyRows, appliedFilters),
    [appliedFilters],
  )

  const handleSearch = (filters: PolicyFilters) => {
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
          items={[{ title: 'Đơn bảo hiểm' }, { title: 'Tai nạn hành khách theo chuyến' }]}
        />
        <h1 className="text-xl font-semibold text-gray-800">
          Tai nạn hành khách theo chuyến
        </h1>
      </div>
      <PolicyFiltersBar onSearch={handleSearch} onReset={handleReset} />
      <PolicySummaryBar />
      <PolicyTable rows={filteredRows} page={page} onPageChange={setPage} />
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/policies/PoliciesListPage.tsx
git commit -m "feat(policies): compose policies list page with filter + table state"
```

---

### Task 8: Routing & sidebar wiring

**Files:**
- Modify: `src/app/router.tsx`
- Modify: `src/layouts/AdminLayout/SidebarNav.tsx`

- [ ] **Step 1: Add routes**

Replace the full contents of `src/app/router.tsx` with:

```tsx
import { createBrowserRouter } from 'react-router-dom'
import { AdminLayout } from '../layouts/AdminLayout/AdminLayout'
import { DashboardPage } from '../pages/dashboard/DashboardPage'
import { PlaceholderPage } from '../pages/placeholder/PlaceholderPage'
import { PoliciesListPage } from '../pages/policies/PoliciesListPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'don-bao-hiem/tat-ca', element: <PlaceholderPage title="Tất cả Đơn bảo hiểm" /> },
      {
        path: 'don-bao-hiem/tai-nan-hanh-khach-theo-chuyen',
        element: <PoliciesListPage />,
      },
      { path: 'don-bao-hiem/bao-hiem-hang-hoa', element: <PlaceholderPage title="Bảo hiểm hàng hoá" /> },
      { path: 'don-bao-hiem/bao-hiem-tich-luy-tai-xe', element: <PlaceholderPage title="Bảo hiểm tích lũy tài xế" /> },
      { path: 'don-bao-hiem/bao-hiem-foodcare', element: <PlaceholderPage title="Bảo hiểm FoodCare" /> },
      { path: 'tra-cuu-gsm', element: <PlaceholderPage title="Tra cứu GSM PPT" /> },
      { path: 'bao-cao-power-bi', element: <PlaceholderPage title="Báo cáo Power BI" /> },
      { path: 'cai-dat-tai-khoan', element: <PlaceholderPage title="Cài đặt tài khoản" /> },
    ],
  },
])
```

- [ ] **Step 2: Populate the `Đơn bảo hiểm` submenu**

In `src/layouts/AdminLayout/SidebarNav.tsx`, replace the `don-bao-hiem` item (currently `{ key: 'don-bao-hiem', icon: <FileProtectOutlined />, label: 'Đơn bảo hiểm', children: [] }`) with:

```tsx
  {
    key: 'don-bao-hiem',
    icon: <FileProtectOutlined />,
    label: 'Đơn bảo hiểm',
    children: [
      { key: '/don-bao-hiem/tat-ca', label: 'Tất cả Đơn bảo hiểm' },
      { key: '/don-bao-hiem/tai-nan-hanh-khach-theo-chuyen', label: 'Tai nạn hành khách theo chuyến' },
      { key: '/don-bao-hiem/bao-hiem-hang-hoa', label: 'Bảo hiểm hàng hoá' },
      { key: '/don-bao-hiem/bao-hiem-tich-luy-tai-xe', label: 'Bảo hiểm tích lũy tài xế' },
      { key: '/don-bao-hiem/bao-hiem-foodcare', label: 'Bảo hiểm FoodCare' },
    ],
  },
```

The existing `onClick` handler already calls `navigate(key)` for keys starting with `/`, and `selectedKeys={[pathname]}` already highlights the active child — no further change needed. Leave the other menu items (`muc-luc`, `hop-dong`, etc.) untouched. Optionally add `defaultOpenKeys={['don-bao-hiem']}` to the `Menu` so the submenu starts expanded like the screenshot.

- [ ] **Step 3: Type-check**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/app/router.tsx src/layouts/AdminLayout/SidebarNav.tsx
git commit -m "feat(policies): wire route and Đơn bảo hiểm submenu"
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

Navigate to `http://localhost:5173/don-bao-hiem/tai-nan-hanh-khach-theo-chuyen` (Playwright MCP `browser_navigate` + `browser_take_screenshot`, viewport 1440 wide). Compare to `docs/ui/policies-list.png`. Verify:
  - Breadcrumb `Đơn bảo hiểm / Tai nạn hành khách theo chuyến` and the h1 title.
  - Sidebar `Đơn bảo hiểm` expanded with the 5 children; the trip item highlighted.
  - Filter bar: 4 fields row 1, created-range + status + `Làm lại`/`Tìm kiếm` row 2; status defaults to `Đã hoàn thành`.
  - Summary line: `Tổng số đơn : 721,084`, `Tổng phí bảo hiểm : 1.442.168.000 đ`, CSV button + 3 icon buttons.
  - Table: 6 columns, stacked multi-line cells, green `Hoàn thành` tags, blue action button, pager showing 10 rows on page 1.

- [ ] **Step 4: Behaviour spot-check**

  - Type `88H` into `Biển số xe`, click `Tìm kiếm` → only the matching row(s) remain.
  - Clear the status select → click `Tìm kiếm` → cancelled/other-status rows appear.
  - Click `Làm lại` → filters reset to defaults (status `Đã hoàn thành`, created range 2026-06-01..08), page back to 1.

- [ ] **Step 5: Final commit (if any tweaks were needed)**

```bash
git add -A
git commit -m "chore(policies): verify policies list page renders per design"
```

---

## Self-Review

- **Spec coverage:** §3 file layout → Tasks 1–8. §4 labels → Tasks 1,4,5,6,7,8 (verbatim). §5 data model → Task 1. §6 filter behavior → Tasks 2,7. §7 styling → Tasks 4,5,6. §8 routing → Task 8. §9 mock assumptions → encoded in Task 1 `STATUS_CONFIG` + static headline consts. §10 out-of-scope respected (icons are no-op, no API, no tests). ✓
- **Placeholder scan:** No TBD/TODO; every code step shows full code. ✓
- **Type consistency:** `PolicyRow`, `PolicyStatus`, `PolicyFilters`, `DEFAULT_FILTERS`, `applyFilters`, `STATUS_CONFIG`, `statusOptions`, `formatDateTime`/`formatInt`/`formatPremium` names are identical across Tasks 1–7. `PAGE_SIZE = 10` matches the spec pager. The page imports the `PolicyFilters` component aliased as `PolicyFiltersBar` to avoid colliding with the `PolicyFilters` type. ✓
