# Claim Requests List Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the "Yêu cầu bồi thường / Bảo hiểm tích lũy tài xế" (Claim Requests) list page — UI + mock data only, no API.

**Architecture:** Mirror the existing `src/pages/driver-savings/` list pattern: a page shell (breadcrumb + title + filters + toolbar + table), an in-memory filter module, a mock-data module, and four presentational components. Filtering is a pure in-memory function over mock rows. Navigation actions point to `PlaceholderPage` routes.

**Tech Stack:** React 19, TypeScript, Ant Design 6, Tailwind 4, react-router-dom 7, Vite.

**Spec:** `docs/superpowers/specs/2026-06-09-claim-requests-list-design.md`

**Testing note:** This project has no unit-test runner (no vitest/jest in `package.json`, no test files in `src/`), consistent with how every existing page ships. Verification per task is `npm run build` (runs `tsc -b` + vite build) and `npm run lint`; the final task does a Playwright visual check against `docs/ui/claim-requests-list.png`. Do not add a test framework — that is out of scope for this UI-only task.

**Conventions (from `docs/rules/ui-ux-strict.md`):** Vietnamese labels are copied verbatim (spacing, casing, `:` separators). Component files export only components; constants/options/formatters live in `mock-data.ts` / `claim-requests-filters.ts` (to satisfy `react-refresh/only-export-components`).

---

## File Structure

Create:
- `src/pages/claim-requests/mock-data.ts` — row type, status/source/sort config, formatters, mock rows
- `src/pages/claim-requests/claim-requests-filters.ts` — filter type, `DEFAULT_FILTERS`, `applyFilters()`
- `src/pages/claim-requests/components/ClaimRequestStatusBadge.tsx` — status `Tag`
- `src/pages/claim-requests/components/ClaimRequestsFilters.tsx` — filter form bar
- `src/pages/claim-requests/components/ClaimRequestsToolbar.tsx` — list heading + action buttons
- `src/pages/claim-requests/components/ClaimRequestsTable.tsx` — AntD table
- `src/pages/claim-requests/ClaimRequestsListPage.tsx` — page shell

Modify:
- `src/app/router.tsx` — add list route + 3 placeholder routes
- `src/layouts/AdminLayout/SidebarNav.tsx` — add child under `yeu-cau-boi-thuong` + open key

---

## Task 1: Mock data module

**Files:**
- Create: `src/pages/claim-requests/mock-data.ts`

- [ ] **Step 1: Create the mock-data module**

```ts
export type ClaimRequestStatus =
  | 'ho-so-chua-tao'
  | 'da-tao-ho-so'
  | 'dang-xu-ly'
  | 'hoan-thanh'
  | 'tu-choi'

export interface ClaimRequestRow {
  id: string
  source: string | null // Nguồn tiếp nhận — null renders as "-"
  requestedAt: string // Ngày yêu cầu bồi thường (ISO)
  lossNoticeNumber: string // Số thông báo tổn thất
  // Thông tin khách hàng
  driverCode: string // Mã tài xế
  masterPolicyNumber: string // Số HĐNT
  customerName: string // Tên
  phone: string // Số điện thoại
  // Thông tin về tai nạn
  accidentDate: string // Ngày xảy ra tai nạn (ISO date)
  accidentPlace: string // Nơi xảy ra tai nạn
  accidentConsequence: string // Hậu quả tai nạn
  claimAmount: number // Số tiền yêu cầu chi trả (đ)
  status: ClaimRequestStatus
}

// Only "Hồ sơ chưa tạo" is confirmed from the design. The rest are placeholders
// so the status filter is demonstrable; replace when BE/business confirms.
export const STATUS_CONFIG: Record<
  ClaimRequestStatus,
  { selectLabel: string; tagLabel: string; color: string }
> = {
  'ho-so-chua-tao': { selectLabel: 'Hồ sơ chưa tạo', tagLabel: 'Hồ sơ chưa tạo', color: 'orange' },
  'da-tao-ho-so': { selectLabel: 'Đã tạo hồ sơ', tagLabel: 'Đã tạo hồ sơ', color: 'blue' },
  'dang-xu-ly': { selectLabel: 'Đang xử lý', tagLabel: 'Đang xử lý', color: 'gold' },
  'hoan-thanh': { selectLabel: 'Hoàn thành', tagLabel: 'Hoàn thành', color: 'green' },
  'tu-choi': { selectLabel: 'Từ chối', tagLabel: 'Từ chối', color: 'red' },
}

export const statusOptions = (Object.keys(STATUS_CONFIG) as ClaimRequestStatus[]).map((value) => ({
  value,
  label: STATUS_CONFIG[value].selectLabel,
}))

// Placeholder receiving channels (not confirmed from design).
export const sourceOptions = [
  { value: 'app-tai-xe', label: 'App tài xế' },
  { value: 'tong-dai', label: 'Tổng đài' },
  { value: 'email', label: 'Email' },
]

export type SortOrder = 'newest' | 'oldest'

export const sortOptions: { value: SortOrder; label: string }[] = [
  { value: 'newest', label: 'Xếp theo mới nhất' },
  { value: 'oldest', label: 'Xếp theo cũ nhất' },
]

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  const pad = (x: number) => String(x).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  const pad = (x: number) => String(x).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}

export function formatAmount(n: number): string {
  return `${n.toLocaleString('vi-VN')} đ`
}

// Rows 1-4 use values read from docs/ui/claim-requests-list.png; rows 5-12 are
// synthetic but plausible. Source is null on every row to match the design ("-").
export const claimRequestRows: ClaimRequestRow[] = [
  {
    id: '1', source: null, requestedAt: '2026-06-03T14:12:00', lossNoticeNumber: '26TT000819',
    driverCode: '6123723', masterPolicyNumber: '25/PC-GSM/10819478', customerName: 'Phạm Xuân Đông Hải',
    phone: '+84968532564', accidentDate: '2026-05-31', accidentPlace: 'Phường thới an',
    accidentConsequence: 'Tiêm vắc xin', claimAmount: 1725000, status: 'ho-so-chua-tao',
  },
  {
    id: '2', source: null, requestedAt: '2026-06-01T14:11:00', lossNoticeNumber: '26TT000800',
    driverCode: '6014097', masterPolicyNumber: '25/PC-GSM/10782791', customerName: 'Nguyễn Văn Dương',
    phone: '+84368258977', accidentDate: '2026-05-05', accidentPlace: 'Nhật Nhất Quảng Ninh',
    accidentConsequence: 'Khâu vết thương, kháng sinh, giảm đau, theo dõi tri giác',
    claimAmount: 3000000, status: 'ho-so-chua-tao',
  },
  {
    id: '3', source: null, requestedAt: '2026-05-26T06:21:00', lossNoticeNumber: '26TT000793',
    driverCode: '6098214', masterPolicyNumber: '25/PC-GSM/6591302', customerName: 'Phạm Việt Hoàng',
    phone: '+84971853978', accidentDate: '2026-05-25', accidentPlace: 'Trường Bình Phú, Quận 6',
    accidentConsequence: 'Dập cơ, dập gân', claimAmount: 2425000, status: 'ho-so-chua-tao',
  },
  {
    id: '4', source: null, requestedAt: '2026-05-25T16:00:00', lossNoticeNumber: '26TT000784',
    driverCode: '6142637', masterPolicyNumber: '26/PC-GSM/026202', customerName: 'Tăng Cóng Vửng',
    phone: '+84357283152', accidentDate: '2026-05-01', accidentPlace: 'Trường trinh , chế Lan viên',
    accidentConsequence: 'Ngoài da', claimAmount: 1800000, status: 'ho-so-chua-tao',
  },
  {
    id: '5', source: null, requestedAt: '2026-05-24T09:30:00', lossNoticeNumber: '26TT000771',
    driverCode: '6033188', masterPolicyNumber: '25/PC-GSM/7392019', customerName: 'Nguyễn Duy Tích',
    phone: '+84387764274', accidentDate: '2026-05-20', accidentPlace: 'Quận Long Biên, Hà Nội',
    accidentConsequence: 'Gãy tay phải', claimAmount: 4200000, status: 'da-tao-ho-so',
  },
  {
    id: '6', source: null, requestedAt: '2026-05-22T11:05:00', lossNoticeNumber: '26TT000760',
    driverCode: '6022429', masterPolicyNumber: '25/PC-GSM/7291660', customerName: 'Vũ Gấp Dẫn',
    phone: '+84936806555', accidentDate: '2026-05-18', accidentPlace: 'TP Biên Hoà, Đồng Nai',
    accidentConsequence: 'Chấn thương đầu gối', claimAmount: 2750000, status: 'dang-xu-ly',
  },
  {
    id: '7', source: null, requestedAt: '2026-05-20T08:45:00', lossNoticeNumber: '26TT000742',
    driverCode: '6031007', masterPolicyNumber: '25/PC-GSM/7410882', customerName: 'Trần Hùng',
    phone: '+84901234567', accidentDate: '2026-05-15', accidentPlace: 'Quận 7, TP HCM',
    accidentConsequence: 'Trầy xước phần mềm', claimAmount: 1500000, status: 'hoan-thanh',
  },
  {
    id: '8', source: null, requestedAt: '2026-05-18T17:20:00', lossNoticeNumber: '26TT000730',
    driverCode: '6044318', masterPolicyNumber: '25/PC-GSM/7522930', customerName: 'Nguyễn Lan',
    phone: '+84912345678', accidentDate: '2026-05-12', accidentPlace: 'Quận Hải Châu, Đà Nẵng',
    accidentConsequence: 'Bong gân cổ chân', claimAmount: 1950000, status: 'tu-choi',
  },
  {
    id: '9', source: null, requestedAt: '2026-05-16T13:10:00', lossNoticeNumber: '26TT000718',
    driverCode: '6058640', masterPolicyNumber: '25/PC-GSM/7639114', customerName: 'Phạm Đức',
    phone: '+84923456789', accidentDate: '2026-05-10', accidentPlace: 'TP Vũng Tàu',
    accidentConsequence: 'Khâu 5 mũi vùng cẳng tay', claimAmount: 2100000, status: 'ho-so-chua-tao',
  },
  {
    id: '10', source: null, requestedAt: '2026-05-14T07:55:00', lossNoticeNumber: '26TT000705',
    driverCode: '6061285', masterPolicyNumber: '25/PC-GSM/7741250', customerName: 'Võ Minh',
    phone: '+84934567890', accidentDate: '2026-05-08', accidentPlace: 'TP Cần Thơ',
    accidentConsequence: 'Theo dõi chấn động não', claimAmount: 3600000, status: 'da-tao-ho-so',
  },
  {
    id: '11', source: null, requestedAt: '2026-05-12T15:40:00', lossNoticeNumber: '26TT000691',
    driverCode: '6075992', masterPolicyNumber: '25/PC-GSM/7858663', customerName: 'Đỗ Thu',
    phone: '+84945678901', accidentDate: '2026-05-06', accidentPlace: 'Quận Ninh Kiều, Cần Thơ',
    accidentConsequence: 'Gãy xương đòn', claimAmount: 5000000, status: 'dang-xu-ly',
  },
  {
    id: '12', source: null, requestedAt: '2026-05-10T10:25:00', lossNoticeNumber: '26TT000680',
    driverCode: '6082137', masterPolicyNumber: '25/PC-GSM/7960441', customerName: 'Bùi Sơn',
    phone: '+84956789012', accidentDate: '2026-05-03', accidentPlace: 'TP Nha Trang',
    accidentConsequence: 'Trật khớp vai', claimAmount: 2300000, status: 'hoan-thanh',
  },
]
```

- [ ] **Step 2: Type-check**

Run: `npm run build`
Expected: PASS (no type errors). If the build is slow, `npx tsc -b --noEmit` is an acceptable faster check.

- [ ] **Step 3: Commit**

```bash
git add src/pages/claim-requests/mock-data.ts
git commit -m "feat(claim-requests): add mock data, status/source config and formatters"
```

---

## Task 2: Filter module

**Files:**
- Create: `src/pages/claim-requests/claim-requests-filters.ts`

- [ ] **Step 1: Create the filter module**

```ts
import type { ClaimRequestRow, ClaimRequestStatus, SortOrder } from './mock-data'

export interface ClaimRequestFilters {
  keyword: string // matches driverCode | customerName | phone | lossNoticeNumber
  sort: SortOrder // by requestedAt
  requestedRange: [string, string] | null // [YYYY-MM-DD, YYYY-MM-DD]
  source: string | null
  status: ClaimRequestStatus | null
}

export const DEFAULT_FILTERS: ClaimRequestFilters = {
  keyword: '',
  sort: 'newest',
  requestedRange: null,
  source: null,
  status: null,
}

export function applyFilters(
  rows: ClaimRequestRow[],
  filters: ClaimRequestFilters,
): ClaimRequestRow[] {
  const matched = rows.filter((row) => {
    if (filters.keyword.trim()) {
      const kw = filters.keyword.trim().toLowerCase()
      const haystack = [row.driverCode, row.customerName, row.phone, row.lossNoticeNumber]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(kw)) return false
    }
    if (filters.requestedRange) {
      const [from, to] = filters.requestedRange
      const day = row.requestedAt.slice(0, 10)
      if (day < from || day > to) return false
    }
    if (filters.source && row.source !== filters.source) return false
    if (filters.status && row.status !== filters.status) return false
    return true
  })

  return [...matched].sort((a, b) => {
    const cmp = a.requestedAt.localeCompare(b.requestedAt)
    return filters.sort === 'newest' ? -cmp : cmp
  })
}
```

- [ ] **Step 2: Type-check**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/claim-requests/claim-requests-filters.ts
git commit -m "feat(claim-requests): add in-memory filter logic"
```

---

## Task 3: Status badge component

**Files:**
- Create: `src/pages/claim-requests/components/ClaimRequestStatusBadge.tsx`

- [ ] **Step 1: Create the badge**

```tsx
import { Tag } from 'antd'
import { STATUS_CONFIG, type ClaimRequestStatus } from '../mock-data'

interface ClaimRequestStatusBadgeProps {
  status: ClaimRequestStatus
}

export function ClaimRequestStatusBadge({ status }: ClaimRequestStatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return <Tag color={config.color}>{config.tagLabel}</Tag>
}
```

- [ ] **Step 2: Type-check**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/claim-requests/components/ClaimRequestStatusBadge.tsx
git commit -m "feat(claim-requests): add status badge"
```

---

## Task 4: Filters bar component

**Files:**
- Create: `src/pages/claim-requests/components/ClaimRequestsFilters.tsx`

- [ ] **Step 1: Create the filters bar**

```tsx
import { Button, Col, DatePicker, Form, Input, Row, Select, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { type Dayjs } from 'dayjs'
import { sortOptions, sourceOptions, statusOptions } from '../mock-data'
import { DEFAULT_FILTERS, type ClaimRequestFilters } from '../claim-requests-filters'

const { RangePicker } = DatePicker

interface ClaimRequestsFiltersProps {
  onSearch: (filters: ClaimRequestFilters) => void
  onReset: () => void
}

interface FormShape {
  keyword?: string
  sort?: ClaimRequestFilters['sort']
  requestedRange?: [Dayjs, Dayjs] | null
  source?: string | null
  status?: ClaimRequestFilters['status']
}

const initialValues: FormShape = {
  keyword: '',
  sort: DEFAULT_FILTERS.sort,
  requestedRange: null,
  source: null,
  status: null,
}

function toIsoRange(range?: [Dayjs, Dayjs] | null): [string, string] | null {
  if (!range || !range[0] || !range[1]) return null
  return [range[0].format('YYYY-MM-DD'), range[1].format('YYYY-MM-DD')]
}

export function ClaimRequestsFilters({ onSearch, onReset }: ClaimRequestsFiltersProps) {
  const [form] = Form.useForm<FormShape>()

  const handleSearch = () => {
    const v = form.getFieldsValue()
    onSearch({
      keyword: v.keyword ?? '',
      sort: v.sort ?? 'newest',
      requestedRange: toIsoRange(v.requestedRange),
      source: v.source ?? null,
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
          <Form.Item
            label={
              <span className="inline-flex items-center gap-1">
                Tìm kiếm
                <Tooltip title="Tìm theo mã tài xế, tên, số điện thoại, số thông báo tổn thất">
                  <InfoCircleOutlined className="text-gray-400" />
                </Tooltip>
              </span>
            }
            name="keyword"
            className="mb-3"
          >
            <Input placeholder="Nhập từ khoá tìm kiếm" allowClear />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="Sắp xếp theo" name="sort" className="mb-3">
            <Select options={sortOptions} />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="Ngày yêu cầu bồi thường" name="requestedRange" className="mb-3">
            <RangePicker
              className="w-full"
              format="YYYY-MM-DD"
              placeholder={['Từ ngày', 'Đến ngày']}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="Nguồn tiếp nhận" name="source" className="mb-3">
            <Select options={sourceOptions} allowClear placeholder="Vui lòng chọn" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16} align="bottom">
        <Col xs={24} md={6}>
          <Form.Item label="Tình trạng yêu cầu bồi thường" name="status" className="mb-0">
            <Select options={statusOptions} allowClear placeholder="Vui lòng chọn" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} />
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

- [ ] **Step 2: Type-check and lint**

Run: `npm run build && npm run lint`
Expected: PASS (no `react-refresh/only-export-components` warning — this file exports only the component).

- [ ] **Step 3: Commit**

```bash
git add src/pages/claim-requests/components/ClaimRequestsFilters.tsx
git commit -m "feat(claim-requests): add filters bar"
```

---

## Task 5: Toolbar component

**Files:**
- Create: `src/pages/claim-requests/components/ClaimRequestsToolbar.tsx`

- [ ] **Step 1: Create the toolbar**

```tsx
import { Button, Tooltip } from 'antd'
import {
  PlusOutlined,
  ExportOutlined,
  ReloadOutlined,
  InsertRowAboveOutlined,
  SettingOutlined,
} from '@ant-design/icons'

interface ClaimRequestsToolbarProps {
  onAdd: () => void
}

export function ClaimRequestsToolbar({ onAdd }: ClaimRequestsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-800">Danh sách Yêu cầu bồi thường</h2>
      <div className="flex items-center gap-2">
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          Thêm mới
        </Button>
        {/* UI only: no real export */}
        <Button icon={<ExportOutlined />}>Xuất danh sách yêu cầu bồi thường CSV</Button>
        {/* Decorative no-op icon buttons matching the design */}
        <Tooltip title="Tải lại">
          <Button icon={<ReloadOutlined />} />
        </Tooltip>
        <Tooltip title="Tuỳ chỉnh cột">
          <Button icon={<InsertRowAboveOutlined />} />
        </Tooltip>
        <Tooltip title="Cài đặt">
          <Button icon={<SettingOutlined />} />
        </Tooltip>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npm run build`
Expected: PASS. (If any icon name is not exported by `@ant-design/icons`, substitute the closest available icon — e.g. `AppstoreOutlined` for the columns icon — and note it.)

- [ ] **Step 3: Commit**

```bash
git add src/pages/claim-requests/components/ClaimRequestsToolbar.tsx
git commit -m "feat(claim-requests): add list toolbar"
```

---

## Task 6: Table component

**Files:**
- Create: `src/pages/claim-requests/components/ClaimRequestsTable.tsx`

- [ ] **Step 1: Create the table**

```tsx
import type { ReactNode } from 'react'
import { Button, Table, Typography } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import {
  formatAmount,
  formatDate,
  formatDateTime,
  type ClaimRequestRow,
} from '../mock-data'
import { ClaimRequestStatusBadge } from './ClaimRequestStatusBadge'

const PAGE_SIZE = 10

interface ClaimRequestsTableProps {
  rows: ClaimRequestRow[]
  page: number
  onPageChange: (page: number) => void
  onView: (id: string) => void
  onEdit: (id: string) => void
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="leading-5">
      <span className="font-medium text-gray-500">{label}: </span>
      <span className="text-gray-800">{value}</span>
    </div>
  )
}

export function ClaimRequestsTable({
  rows,
  page,
  onPageChange,
  onView,
  onEdit,
}: ClaimRequestsTableProps) {
  const columns: ColumnsType<ClaimRequestRow> = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      render: (_v, _r, index) => (page - 1) * PAGE_SIZE + index + 1,
    },
    {
      title: 'Nguồn tiếp nhận',
      key: 'source',
      render: (_v, row) => row.source ?? '-',
    },
    {
      title: 'Ngày yêu cầu bồi thường',
      key: 'requestedAt',
      render: (_v, row) => formatDateTime(row.requestedAt),
    },
    {
      title: 'Số thông báo tổn thất',
      dataIndex: 'lossNoticeNumber',
      key: 'lossNoticeNumber',
    },
    {
      title: 'Thông tin khách hàng',
      key: 'customer',
      render: (_v, row) => (
        <div className="space-y-1">
          <Field label="Mã tài xế" value={row.driverCode} />
          <Field label="Số HĐNT" value={row.masterPolicyNumber} />
          <Field label="Tên" value={row.customerName} />
          <Field label="Số điện thoại" value={row.phone} />
        </div>
      ),
    },
    {
      title: 'Thông tin về tai nạn',
      key: 'accident',
      render: (_v, row) => (
        <div className="space-y-1">
          <Field label="Ngày xảy ra tai nạn" value={formatDate(row.accidentDate)} />
          <Field label="Nơi xảy ra tai nạn" value={row.accidentPlace} />
          <Field label="Hậu quả tai nạn" value={row.accidentConsequence} />
        </div>
      ),
    },
    {
      title: 'Số tiền yêu cầu chi trả',
      key: 'claimAmount',
      render: (_v, row) => formatAmount(row.claimAmount),
    },
    {
      title: 'Tình trạng yêu cầu bồi thường',
      key: 'status',
      width: 180,
      render: (_v, row) => <ClaimRequestStatusBadge status={row.status} />,
    },
    {
      title: 'Liên kết',
      key: 'link',
      render: (_v, row) => (
        <Typography.Link onClick={() => onView(row.id)}>Xem giấy YCBT</Typography.Link>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 90,
      render: (_v, row) => (
        <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(row.id)} />
      ),
    },
  ]

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-2 shadow-sm">
      <Table<ClaimRequestRow>
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

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/claim-requests/components/ClaimRequestsTable.tsx
git commit -m "feat(claim-requests): add list table"
```

---

## Task 7: Page shell

**Files:**
- Create: `src/pages/claim-requests/ClaimRequestsListPage.tsx`

- [ ] **Step 1: Create the page**

```tsx
import { useMemo, useState } from 'react'
import { Breadcrumb } from 'antd'
import { useNavigate } from 'react-router-dom'
import { claimRequestRows } from './mock-data'
import {
  applyFilters,
  DEFAULT_FILTERS,
  type ClaimRequestFilters,
} from './claim-requests-filters'
import { ClaimRequestsFilters } from './components/ClaimRequestsFilters'
import { ClaimRequestsToolbar } from './components/ClaimRequestsToolbar'
import { ClaimRequestsTable } from './components/ClaimRequestsTable'

const BASE_PATH = '/yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe'

export function ClaimRequestsListPage() {
  const navigate = useNavigate()
  const [appliedFilters, setAppliedFilters] = useState<ClaimRequestFilters>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)

  const filteredRows = useMemo(
    () => applyFilters(claimRequestRows, appliedFilters),
    [appliedFilters],
  )

  const handleSearch = (filters: ClaimRequestFilters) => {
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
          items={[{ title: 'Yêu cầu bồi thường' }, { title: 'Bảo hiểm tích lũy tài xế' }]}
        />
        <h1 className="text-xl font-semibold text-gray-800">Bảo hiểm tích lũy tài xế</h1>
      </div>
      <ClaimRequestsFilters onSearch={handleSearch} onReset={handleReset} />
      <ClaimRequestsToolbar onAdd={() => navigate(`${BASE_PATH}/them-moi`)} />
      <ClaimRequestsTable
        rows={filteredRows}
        page={page}
        onPageChange={setPage}
        onView={(id) => navigate(`${BASE_PATH}/${id}/giay-ycbt`)}
        onEdit={(id) => navigate(`${BASE_PATH}/${id}/cap-nhat`)}
      />
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/claim-requests/ClaimRequestsListPage.tsx
git commit -m "feat(claim-requests): compose list page"
```

---

## Task 8: Wire routing and sidebar

**Files:**
- Modify: `src/app/router.tsx`
- Modify: `src/layouts/AdminLayout/SidebarNav.tsx`

- [ ] **Step 1: Add the import to `router.tsx`**

Add this import alongside the other page imports near the top of `src/app/router.tsx`:

```tsx
import { ClaimRequestsListPage } from '../pages/claim-requests/ClaimRequestsListPage'
```

- [ ] **Step 2: Add the routes to `router.tsx`**

Inside the `children` array of the `'/'` route (after the existing `hop-dong-nguyen-tac/...:id` route, before the closing `]`), add:

```tsx
      {
        path: 'yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe',
        element: <ClaimRequestsListPage />,
      },
      {
        path: 'yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe/them-moi',
        element: <PlaceholderPage title="Thêm mới Yêu cầu bồi thường" />,
      },
      {
        path: 'yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe/:id/cap-nhat',
        element: <PlaceholderPage title="Cập nhật Yêu cầu bồi thường" />,
      },
      {
        path: 'yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe/:id/giay-ycbt',
        element: <PlaceholderPage title="Giấy yêu cầu bồi thường" />,
      },
```

(`PlaceholderPage` is already imported in `router.tsx`.)

- [ ] **Step 3: Add the sidebar child in `SidebarNav.tsx`**

Replace the existing line:

```tsx
  { key: 'yeu-cau-boi-thuong', icon: <SolutionOutlined />, label: 'Yêu cầu bồi thường', children: [] },
```

with:

```tsx
  {
    key: 'yeu-cau-boi-thuong',
    icon: <SolutionOutlined />,
    label: 'Yêu cầu bồi thường',
    children: [
      {
        key: '/yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe',
        label: 'Bảo hiểm tích lũy tài xế',
      },
    ],
  },
```

- [ ] **Step 4: Add the open key in `SidebarNav.tsx`**

Replace:

```tsx
      defaultOpenKeys={['don-bao-hiem', 'hop-dong', 'bao-cao-power-bi']}
```

with:

```tsx
      defaultOpenKeys={['don-bao-hiem', 'hop-dong', 'yeu-cau-boi-thuong', 'bao-cao-power-bi']}
```

- [ ] **Step 5: Type-check and lint**

Run: `npm run build && npm run lint`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app/router.tsx src/layouts/AdminLayout/SidebarNav.tsx
git commit -m "feat(claim-requests): register routes and sidebar entry"
```

---

## Task 9: Visual verification against the design

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev` (leave running; note the URL, typically `http://localhost:5173`).

- [ ] **Step 2: Capture a screenshot with Playwright**

Navigate to `http://localhost:5173/yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe`, set viewport width ~1920, and take a full-page screenshot (use the existing `/tmp/pw/shot.mjs` helper or the Playwright MCP browser tools).

- [ ] **Step 3: Compare to the design**

Open `docs/ui/claim-requests-list.png` next to the screenshot and verify:
- Breadcrumb "Yêu cầu bồi thường / Bảo hiểm tích lũy tài xế" and title.
- Filter labels/placeholders match verbatim; "Sắp xếp theo" defaults to "Xếp theo mới nhất"; "Tìm kiếm" has the ⓘ icon.
- Toolbar: "Danh sách Yêu cầu bồi thường", + Thêm mới, Xuất ... CSV, three icon buttons.
- Table headers and the multi-field cells (customer block, accident block) match; amount shows `… đ`; status shows orange "Hồ sơ chưa tạo"; "Xem giấy YCBT" link; blue edit icon.
- Sidebar "Yêu cầu bồi thường" group expanded with the "Bảo hiểm tích lũy tài xế" child highlighted.

- [ ] **Step 4: Verify navigation actions**

Click + Thêm mới → lands on the "Thêm mới Yêu cầu bồi thường" placeholder. Back, click a row edit icon → "Cập nhật Yêu cầu bồi thường" placeholder. Back, click "Xem giấy YCBT" → "Giấy yêu cầu bồi thường" placeholder.

- [ ] **Step 5: Fix any discrepancies**

If anything diverges from the design, adjust the relevant component, re-run `npm run build && npm run lint`, re-screenshot, and commit the fix:

```bash
git add -A
git commit -m "fix(claim-requests): align UI with design"
```

---

## Done

The Claim Requests list page renders from mock data with working in-memory filtering, sorting, and pagination; matches the design; and navigation actions reach placeholder pages. No API code was added.
