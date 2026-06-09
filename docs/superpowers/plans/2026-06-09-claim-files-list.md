# Claim Files List Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a read-only "Claim Files List" page (Hồ sơ bồi thường — Bảo hiểm tích lũy tài xế) driven by a static mock array, mirroring the existing `claim-requests` list-page pattern.

**Architecture:** A new `src/pages/claim-files/` feature folder: page shell (breadcrumb + filters + toolbar + table) over colocated `mock-data.ts`, `claim-files-filters.ts`, and `components/`. All filter/sort/search runs client-side on the mock array. Routes and the sidebar `Hồ sơ bồi thường` group are wired in last.

**Tech Stack:** React 19, TypeScript, Ant Design v6, `dayjs`, `react-router-dom` v7, Tailwind v4. Package manager: `yarn`.

> **Testing note:** This repo has no unit-test framework and the spec is UI-only. Each task verifies with `yarn build` (tsc + vite) and `yarn lint`, plus a final visual check against `docs/ui/claim-files-list.png`. No `.test.ts` files are created.

> **Reference spec:** `docs/superpowers/specs/2026-06-09-claim-files-list-design.md`
> **Pattern reference (read before starting):** `src/pages/claim-requests/` (ClaimRequestsListPage, components/, mock-data.ts, claim-requests-filters.ts) and `src/pages/driver-savings/mock-data.ts`.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/pages/claim-files/mock-data.ts` | `ClaimFileRow` type, `ClaimFileStatus`, `STATUS_CONFIG`, `statusOptions`, `sortOptions`, formatters, `claimFileRows` |
| `src/pages/claim-files/claim-files-filters.ts` | `ClaimFileFilters` type, `DEFAULT_FILTERS`, `applyFilters` |
| `src/pages/claim-files/components/ClaimFileStatusBadge.tsx` | AntD `Tag` from `STATUS_CONFIG` |
| `src/pages/claim-files/components/ClaimFilesFilters.tsx` | Filter form card (4 fields + Làm lại / Tìm kiếm) |
| `src/pages/claim-files/components/ClaimFilesToolbar.tsx` | Title + 3 decorative icon buttons |
| `src/pages/claim-files/components/ClaimFilesTable.tsx` | AntD `Table` with stacked-field columns |
| `src/pages/claim-files/ClaimFilesListPage.tsx` | Page shell wiring state + handlers |
| `src/app/router.tsx` (modify) | Register new + placeholder routes |
| `src/layouts/AdminLayout/SidebarNav.tsx` (modify) | Fill `ho-so-boi-thuong` group children |

---

### Task 1: Mock data

**Files:**
- Create: `src/pages/claim-files/mock-data.ts`

- [ ] **Step 1: Create the mock-data file**

```ts
export type ClaimFileStatus = 'da-thanh-toan' | 'cho-thanh-toan' | 'tu-choi' | 'da-huy'

export interface ClaimFileRow {
  id: string
  claimRequestNumber: string // Số yêu cầu bồi thường — 26TT000444
  claimFileCode: string // Mã Hồ sơ bồi thường — JOB2600000134
  accidentDate: string // Ngày xảy ra tai nạn (ISO date)
  driverCode: string // Mã tài xế
  customerName: string // Họ và tên
  masterPolicyNumber: string // Số HĐNT — 24/PM-GSM/013203
  customerRequested: number // Khách hàng yêu cầu (đ)
  estimatedClaim: number // Ước bồi thường (đ)
  paidAmount: number // Đã chi trả (đ)
  paidAt: string // Ngày thực hiện chi trả (ISO datetime)
  status: ClaimFileStatus
}

export type SortOrder = 'newest' | 'oldest'

// Mock assumption (spec §9.1): only "Đã thanh toán" is confirmed from the design.
// The other three are placeholders so the status filter dropdown functions.
export const STATUS_CONFIG: Record<
  ClaimFileStatus,
  { selectLabel: string; tagLabel: string; color: string }
> = {
  'da-thanh-toan': { selectLabel: 'Đã thanh toán', tagLabel: 'Đã thanh toán', color: 'green' },
  'cho-thanh-toan': { selectLabel: 'Chờ thanh toán', tagLabel: 'Chờ thanh toán', color: 'gold' },
  'tu-choi': { selectLabel: 'Từ chối', tagLabel: 'Từ chối', color: 'red' },
  'da-huy': { selectLabel: 'Đã hủy', tagLabel: 'Đã hủy', color: 'default' },
}

export const statusOptions = (Object.keys(STATUS_CONFIG) as ClaimFileStatus[]).map((value) => ({
  value,
  label: STATUS_CONFIG[value].selectLabel,
}))

export const sortOptions: { value: SortOrder; label: string }[] = [
  { value: 'newest', label: 'Xếp theo mới nhất' },
  { value: 'oldest', label: 'Xếp theo cũ nhất' },
]

export function formatAmount(n: number): string {
  return `${n.toLocaleString('vi-VN')} đ` // 16.232.506 đ
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  const pad = (x: number) => String(x).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  const pad = (x: number) => String(x).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// Rows 1-5 are seeded verbatim from the design screenshot; the rest are plausible
// fillers. A few use placeholder statuses so the filter is demonstrable.
export const claimFileRows: ClaimFileRow[] = [
  {
    id: '1', claimRequestNumber: '26TT000444', claimFileCode: 'JOB2600000134',
    accidentDate: '2025-11-14', driverCode: '3000000761', customerName: 'Phạm Minh Hoà',
    masterPolicyNumber: '24/PM-GSM/013203', customerRequested: 16232506, estimatedClaim: 0,
    paidAmount: 17732506, paidAt: '2026-02-13T14:40:00', status: 'da-thanh-toan',
  },
  {
    id: '2', claimRequestNumber: '26TT000435', claimFileCode: 'JOB2600000133',
    accidentDate: '2025-11-10', driverCode: '5000001322', customerName: 'Nguyễn Văn Huân',
    masterPolicyNumber: '25/PM-GSM/3854282', customerRequested: 950000, estimatedClaim: 0,
    paidAmount: 950000, paidAt: '2026-02-13T14:29:00', status: 'da-thanh-toan',
  },
  {
    id: '3', claimRequestNumber: '26TT000428', claimFileCode: 'JOB2600000128',
    accidentDate: '2025-10-28', driverCode: '6073429', customerName: 'Trịnh Văn Long',
    masterPolicyNumber: '24/PC-GSM/028080', customerRequested: 4546721, estimatedClaim: 0,
    paidAmount: 7546721, paidAt: '2026-02-13T14:23:00', status: 'da-thanh-toan',
  },
  {
    id: '4', claimRequestNumber: '26TT000401', claimFileCode: 'JOB2600000101',
    accidentDate: '2025-12-02', driverCode: '5000047147', customerName: 'Võ Văn Vĩnh',
    masterPolicyNumber: '24/PM-GSM/011170', customerRequested: 7715127, estimatedClaim: 0,
    paidAmount: 9215127, paidAt: '2026-01-03T17:00:00', status: 'da-thanh-toan',
  },
  {
    id: '5', claimRequestNumber: '26TT000399', claimFileCode: 'JOB2600000099',
    accidentDate: '2025-12-01', driverCode: '6020823', customerName: 'Vũ Trọng Nghĩa',
    masterPolicyNumber: '24/PC-GSM/006536', customerRequested: 20020603, estimatedClaim: 0,
    paidAmount: 20020603, paidAt: '2026-01-03T16:57:00', status: 'da-thanh-toan',
  },
  {
    id: '6', claimRequestNumber: '26TT000388', claimFileCode: 'JOB2600000088',
    accidentDate: '2025-11-22', driverCode: '5000049129', customerName: 'Đặng Thị Hồng',
    masterPolicyNumber: '24/PM-GSM/009921', customerRequested: 10757500, estimatedClaim: 0,
    paidAmount: 10757500, paidAt: '2026-01-02T11:12:00', status: 'da-thanh-toan',
  },
  {
    id: '7', claimRequestNumber: '26TT000372', claimFileCode: 'JOB2600000072',
    accidentDate: '2025-11-05', driverCode: '6041288', customerName: 'Lê Quang Huy',
    masterPolicyNumber: '24/PC-GSM/004417', customerRequested: 3120000, estimatedClaim: 0,
    paidAmount: 3120000, paidAt: '2025-12-28T09:40:00', status: 'da-thanh-toan',
  },
  {
    id: '8', claimRequestNumber: '26TT000361', claimFileCode: 'JOB2600000061',
    accidentDate: '2025-10-19', driverCode: '5000052310', customerName: 'Hoàng Văn Nam',
    masterPolicyNumber: '25/PM-GSM/2210984', customerRequested: 6480000, estimatedClaim: 6480000,
    paidAmount: 0, paidAt: '2025-12-20T15:05:00', status: 'cho-thanh-toan',
  },
  {
    id: '9', claimRequestNumber: '26TT000350', claimFileCode: 'JOB2600000050',
    accidentDate: '2025-10-11', driverCode: '6058120', customerName: 'Bùi Thị Lan',
    masterPolicyNumber: '24/PC-GSM/002288', customerRequested: 12500000, estimatedClaim: 0,
    paidAmount: 0, paidAt: '2025-12-15T10:30:00', status: 'tu-choi',
  },
  {
    id: '10', claimRequestNumber: '26TT000344', claimFileCode: 'JOB2600000044',
    accidentDate: '2025-09-30', driverCode: '5000061472', customerName: 'Ngô Đức Thắng',
    masterPolicyNumber: '25/PM-GSM/1905533', customerRequested: 8900000, estimatedClaim: 0,
    paidAmount: 8900000, paidAt: '2025-12-10T13:18:00', status: 'da-thanh-toan',
  },
  {
    id: '11', claimRequestNumber: '26TT000330', claimFileCode: 'JOB2600000030',
    accidentDate: '2025-09-18', driverCode: '6066903', customerName: 'Phan Thị Mai',
    masterPolicyNumber: '24/PC-GSM/001150', customerRequested: 2150000, estimatedClaim: 0,
    paidAmount: 2150000, paidAt: '2025-12-05T08:02:00', status: 'da-huy',
  },
  {
    id: '12', claimRequestNumber: '26TT000318', claimFileCode: 'JOB2600000018',
    accidentDate: '2025-09-09', driverCode: '5000070019', customerName: 'Đỗ Văn Sơn',
    masterPolicyNumber: '25/PM-GSM/1620447', customerRequested: 5400000, estimatedClaim: 0,
    paidAmount: 5400000, paidAt: '2025-11-30T16:45:00', status: 'da-thanh-toan',
  },
]
```

- [ ] **Step 2: Type-check the file compiles**

Run: `yarn build`
Expected: PASS (no TS errors referencing `mock-data.ts`). Unused-export warnings are acceptable until later tasks consume them.

- [ ] **Step 3: Commit**

```bash
git add src/pages/claim-files/mock-data.ts
git commit -m "feat(claim-files): add claim files mock data"
```

---

### Task 2: Filters logic

**Files:**
- Create: `src/pages/claim-files/claim-files-filters.ts`

- [ ] **Step 1: Create the filters module**

```ts
import type { ClaimFileRow, ClaimFileStatus, SortOrder } from './mock-data'

export interface ClaimFileFilters {
  keyword: string // claimRequestNumber | claimFileCode | driverCode | customerName | masterPolicyNumber
  sort: SortOrder // by paidAt
  paidRange: [string, string] | null // [YYYY-MM-DD, YYYY-MM-DD] over paidAt
  status: ClaimFileStatus | null
}

export const DEFAULT_FILTERS: ClaimFileFilters = {
  keyword: '',
  sort: 'newest',
  paidRange: null,
  status: null,
}

export function applyFilters(
  rows: ClaimFileRow[],
  filters: ClaimFileFilters,
): ClaimFileRow[] {
  const matched = rows.filter((row) => {
    if (filters.keyword.trim()) {
      const kw = filters.keyword.trim().toLowerCase()
      const haystack = [
        row.claimRequestNumber,
        row.claimFileCode,
        row.driverCode,
        row.customerName,
        row.masterPolicyNumber,
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(kw)) return false
    }
    if (filters.paidRange) {
      const [from, to] = filters.paidRange
      const day = row.paidAt.slice(0, 10)
      if (day < from || day > to) return false
    }
    if (filters.status && row.status !== filters.status) return false
    return true
  })

  return [...matched].sort((a, b) => {
    const cmp = a.paidAt < b.paidAt ? -1 : a.paidAt > b.paidAt ? 1 : 0
    return filters.sort === 'newest' ? -cmp : cmp
  })
}
```

- [ ] **Step 2: Type-check**

Run: `yarn build`
Expected: PASS (no TS errors referencing `claim-files-filters.ts`).

- [ ] **Step 3: Commit**

```bash
git add src/pages/claim-files/claim-files-filters.ts
git commit -m "feat(claim-files): add claim files filter logic"
```

---

### Task 3: Status badge

**Files:**
- Create: `src/pages/claim-files/components/ClaimFileStatusBadge.tsx`

- [ ] **Step 1: Create the badge component**

```tsx
import { Tag } from 'antd'
import { STATUS_CONFIG, type ClaimFileStatus } from '../mock-data'

interface ClaimFileStatusBadgeProps {
  status: ClaimFileStatus
}

export function ClaimFileStatusBadge({ status }: ClaimFileStatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return <Tag color={config.color}>{config.tagLabel}</Tag>
}
```

- [ ] **Step 2: Type-check**

Run: `yarn build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/claim-files/components/ClaimFileStatusBadge.tsx
git commit -m "feat(claim-files): add claim file status badge"
```

---

### Task 4: Filters bar

**Files:**
- Create: `src/pages/claim-files/components/ClaimFilesFilters.tsx`

- [ ] **Step 1: Create the filters bar component**

```tsx
import { Button, Col, DatePicker, Form, Input, Row, Select, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { type Dayjs } from 'dayjs'
import { sortOptions, statusOptions } from '../mock-data'
import { DEFAULT_FILTERS, type ClaimFileFilters } from '../claim-files-filters'

const { RangePicker } = DatePicker

interface ClaimFilesFiltersProps {
  onSearch: (filters: ClaimFileFilters) => void
  onReset: () => void
}

interface FormShape {
  keyword?: string
  sort?: ClaimFileFilters['sort']
  status?: ClaimFileFilters['status']
  paidRange?: [Dayjs, Dayjs] | null
}

const initialValues: FormShape = {
  keyword: '',
  sort: DEFAULT_FILTERS.sort,
  status: null,
  paidRange: null,
}

function toIsoRange(range?: [Dayjs, Dayjs] | null): [string, string] | null {
  if (!range || !range[0] || !range[1]) return null
  return [range[0].format('YYYY-MM-DD'), range[1].format('YYYY-MM-DD')]
}

export function ClaimFilesFilters({ onSearch, onReset }: ClaimFilesFiltersProps) {
  const [form] = Form.useForm<FormShape>()

  const handleSearch = () => {
    const v = form.getFieldsValue()
    onSearch({
      keyword: v.keyword ?? '',
      sort: v.sort ?? 'newest',
      status: v.status ?? null,
      paidRange: toIsoRange(v.paidRange),
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
                <Tooltip title="Tìm theo số yêu cầu, mã hồ sơ, mã tài xế, tên, số HĐNT">
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
          <Form.Item label="Tình trạng Hồ sơ bồi thường" name="status" className="mb-3">
            <Select options={statusOptions} allowClear placeholder="Lọc theo trạng thái" />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="Ngày thực hiện chi trả bồi thường" name="paidRange" className="mb-3">
            <RangePicker
              className="w-full"
              format="YYYY-MM-DD"
              placeholder={['Từ ngày', 'Đến ngày']}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={24} className="flex items-center justify-end gap-2">
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

Run: `yarn build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/claim-files/components/ClaimFilesFilters.tsx
git commit -m "feat(claim-files): add claim files filters bar"
```

---

### Task 5: Toolbar

**Files:**
- Create: `src/pages/claim-files/components/ClaimFilesToolbar.tsx`

- [ ] **Step 1: Create the toolbar component**

```tsx
import { Button, Tooltip } from 'antd'
import { ReloadOutlined, InsertRowAboveOutlined, SettingOutlined } from '@ant-design/icons'

export function ClaimFilesToolbar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-800">Danh sách Hồ sơ bồi thường</h2>
      <div className="flex items-center gap-2">
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

Run: `yarn build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/claim-files/components/ClaimFilesToolbar.tsx
git commit -m "feat(claim-files): add claim files toolbar"
```

---

### Task 6: Table

**Files:**
- Create: `src/pages/claim-files/components/ClaimFilesTable.tsx`

- [ ] **Step 1: Create the table component**

```tsx
import type { ReactNode } from 'react'
import { Button, Table } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import {
  formatAmount,
  formatDate,
  formatDateTime,
  type ClaimFileRow,
} from '../mock-data'
import { ClaimFileStatusBadge } from './ClaimFileStatusBadge'

const PAGE_SIZE = 10

interface ClaimFilesTableProps {
  rows: ClaimFileRow[]
  page: number
  onPageChange: (page: number) => void
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

export function ClaimFilesTable({ rows, page, onPageChange, onEdit }: ClaimFilesTableProps) {
  const columns: ColumnsType<ClaimFileRow> = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      render: (_v, _r, index) => (page - 1) * PAGE_SIZE + index + 1,
    },
    {
      title: 'Số yêu cầu bồi thường',
      key: 'request',
      render: (_v, row) => (
        <div className="space-y-1">
          <Field label="Số yêu cầu bồi thường" value={row.claimRequestNumber} />
          <Field label="Mã Hồ sơ bồi thường" value={row.claimFileCode} />
          <Field label="Ngày xảy ra tai nạn" value={formatDate(row.accidentDate)} />
        </div>
      ),
    },
    {
      title: 'Thông tin khách hàng',
      key: 'customer',
      render: (_v, row) => (
        <div className="space-y-1">
          <Field label="Mã tài xế" value={row.driverCode} />
          <Field label="Họ và tên" value={row.customerName} />
          <Field label="Số HĐNT" value={row.masterPolicyNumber} />
        </div>
      ),
    },
    {
      title: 'Số tiền chi trả',
      key: 'amount',
      render: (_v, row) => (
        <div className="space-y-1">
          <Field label="Khách hàng yêu cầu" value={formatAmount(row.customerRequested)} />
          <Field label="Ước bồi thường" value={formatAmount(row.estimatedClaim)} />
          <Field label="Đã chi trả" value={formatAmount(row.paidAmount)} />
        </div>
      ),
    },
    {
      title: 'Ngày thực hiện chi trả',
      key: 'paidAt',
      render: (_v, row) => formatDateTime(row.paidAt),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 160,
      render: (_v, row) => <ClaimFileStatusBadge status={row.status} />,
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
      <Table<ClaimFileRow>
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

Run: `yarn build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/claim-files/components/ClaimFilesTable.tsx
git commit -m "feat(claim-files): add claim files table"
```

---

### Task 7: Page shell

**Files:**
- Create: `src/pages/claim-files/ClaimFilesListPage.tsx`

- [ ] **Step 1: Create the page component**

```tsx
import { useMemo, useState } from 'react'
import { Breadcrumb } from 'antd'
import { useNavigate } from 'react-router-dom'
import { claimFileRows } from './mock-data'
import { applyFilters, DEFAULT_FILTERS, type ClaimFileFilters } from './claim-files-filters'
import { ClaimFilesFilters } from './components/ClaimFilesFilters'
import { ClaimFilesToolbar } from './components/ClaimFilesToolbar'
import { ClaimFilesTable } from './components/ClaimFilesTable'

const BASE_PATH = '/ho-so-boi-thuong/bao-hiem-tich-luy-tai-xe'

export function ClaimFilesListPage() {
  const navigate = useNavigate()
  const [appliedFilters, setAppliedFilters] = useState<ClaimFileFilters>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)

  const filteredRows = useMemo(
    () => applyFilters(claimFileRows, appliedFilters),
    [appliedFilters],
  )

  const handleSearch = (filters: ClaimFileFilters) => {
    setAppliedFilters(filters)
    setPage(1)
  }

  const handleReset = () => {
    setAppliedFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  const handleEdit = (id: string) => navigate(`${BASE_PATH}/${id}`)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Breadcrumb
          items={[{ title: 'Hồ sơ bồi thường' }, { title: 'Bảo hiểm tích lũy tài xế' }]}
        />
        <h1 className="text-xl font-semibold text-gray-800">Bảo hiểm tích lũy tài xế</h1>
      </div>
      <ClaimFilesFilters onSearch={handleSearch} onReset={handleReset} />
      <ClaimFilesToolbar />
      <ClaimFilesTable
        rows={filteredRows}
        page={page}
        onPageChange={setPage}
        onEdit={handleEdit}
      />
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `yarn build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/claim-files/ClaimFilesListPage.tsx
git commit -m "feat(claim-files): add claim files list page"
```

---

### Task 8: Wire routes and sidebar

**Files:**
- Modify: `src/app/router.tsx`
- Modify: `src/layouts/AdminLayout/SidebarNav.tsx`

- [ ] **Step 1: Add the import in `src/app/router.tsx`**

Add this import alongside the other page imports (after the `UpdateClaimRequestPage` import on line 15):

```tsx
import { ClaimFilesListPage } from '../pages/claim-files/ClaimFilesListPage'
```

- [ ] **Step 2: Add the routes in `src/app/router.tsx`**

Insert these route objects inside the `children` array, immediately after the existing `yeu-cau-boi-thuong/.../giay-ycbt` placeholder route (still inside `children`):

```tsx
      { path: 'ho-so-boi-thuong/tat-ca', element: <PlaceholderPage title="Tất cả hồ sơ bồi thường" /> },
      {
        path: 'ho-so-boi-thuong/tai-nan-hanh-khach-theo-chuyen',
        element: <PlaceholderPage title="Tai nạn hành khách theo chuyến" />,
      },
      {
        path: 'ho-so-boi-thuong/bao-hiem-hang-hoa',
        element: <PlaceholderPage title="Bảo hiểm hàng hoá" />,
      },
      {
        path: 'ho-so-boi-thuong/bao-hiem-tich-luy-tai-xe',
        element: <ClaimFilesListPage />,
      },
      {
        path: 'ho-so-boi-thuong/bao-hiem-tich-luy-tai-xe/:id',
        element: <PlaceholderPage title="Chi tiết hồ sơ bồi thường" />,
      },
```

- [ ] **Step 3: Fill the sidebar group in `src/layouts/AdminLayout/SidebarNav.tsx`**

Replace the empty `ho-so-boi-thuong` menu entry (currently `{ key: 'ho-so-boi-thuong', icon: <FolderOpenOutlined />, label: 'Hồ sơ bồi thường', children: [] },`) with:

```tsx
  {
    key: 'ho-so-boi-thuong',
    icon: <FolderOpenOutlined />,
    label: 'Hồ sơ bồi thường',
    children: [
      { key: '/ho-so-boi-thuong/tat-ca', label: 'Tất cả hồ sơ bồi thường' },
      { key: '/ho-so-boi-thuong/tai-nan-hanh-khach-theo-chuyen', label: 'Tai nạn hành khách theo chuyến' },
      { key: '/ho-so-boi-thuong/bao-hiem-hang-hoa', label: 'Bảo hiểm hàng hoá' },
      { key: '/ho-so-boi-thuong/bao-hiem-tich-luy-tai-xe', label: 'Bảo hiểm tích lũy tài xế' },
    ],
  },
```

- [ ] **Step 4: Add `ho-so-boi-thuong` to the default-open keys**

In `SidebarNav.tsx`, update the `defaultOpenKeys` prop on the `<Menu>` so the group is expanded like its siblings:

```tsx
      defaultOpenKeys={['don-bao-hiem', 'hop-dong', 'yeu-cau-boi-thuong', 'ho-so-boi-thuong', 'bao-cao-power-bi']}
```

- [ ] **Step 5: Type-check and lint**

Run: `yarn build && yarn lint`
Expected: PASS, no errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/router.tsx src/layouts/AdminLayout/SidebarNav.tsx
git commit -m "feat(claim-files): register routes and sidebar entry"
```

---

### Task 9: Visual verification

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `yarn dev`
Expected: Vite serves on a local URL (e.g. `http://localhost:5173`).

- [ ] **Step 2: Navigate and compare against the design**

Open `http://localhost:5173/ho-so-boi-thuong/bao-hiem-tich-luy-tai-xe` (or click sidebar → Hồ sơ bồi thường → Bảo hiểm tích lũy tài xế). Compare against `docs/ui/claim-files-list.png`. Confirm:
  - Breadcrumb `Hồ sơ bồi thường / Bảo hiểm tích lũy tài xế` + heading.
  - 4 filter fields in order: Tìm kiếm (info icon), Sắp xếp theo (default "Xếp theo mới nhất"), Tình trạng Hồ sơ bồi thường ("Lọc theo trạng thái"), Ngày thực hiện chi trả bồi thường (Từ ngày / Đến ngày) + Làm lại / Tìm kiếm.
  - Toolbar title "Danh sách Hồ sơ bồi thường" + 3 icon buttons, no Add/CSV button.
  - Table columns 1–7 with the stacked fields exactly as in §5, green "Đã thanh toán" tags, blue pencil action.
  - Sidebar `Hồ sơ bồi thường` group expanded with 4 items, active item highlighted.

- [ ] **Step 3: Exercise interactions**

  - Type a driver code / name in Tìm kiếm → Tìm kiếm filters the rows.
  - Switch Sắp xếp theo to "Xếp theo cũ nhất" → order flips by payment date.
  - Pick a status → list narrows; pick a paid-date range → list narrows.
  - Làm lại → filters reset, full list returns.
  - Click a pencil → routes to the placeholder "Chi tiết hồ sơ bồi thường" page.

- [ ] **Step 4: Final confirmation**

No console errors; layout matches the screenshot at desktop width. Done — no commit (verification only).

---

## Self-Review

**Spec coverage:**
- §3 routing & sidebar → Task 8 ✓
- §4 layout (breadcrumb/filters/toolbar/table) → Tasks 4, 5, 6, 7 ✓
- §5 table columns → Task 6 ✓
- §6 data model + STATUS_CONFIG + formatters + rows → Task 1 ✓
- §7 filters type + applyFilters → Task 2 ✓
- §8 scope guardrails (no API, client-side) → honored throughout (static `claimFileRows`, no axios) ✓
- §9 assumptions (placeholder statuses, keyword fields, paidAt sort/range, breadcrumb root) → Tasks 1, 2, 7 ✓

**Placeholder scan:** No "TBD"/"TODO"/"handle edge cases" — every code step is complete and copy-pasteable.

**Type consistency:** `ClaimFileRow`, `ClaimFileStatus`, `SortOrder` defined in Task 1 and imported consistently in Tasks 2/3/6. `ClaimFileFilters` defined in Task 2, used in Tasks 4/7. `applyFilters(rows, filters)` signature matches its call in Task 7. `ClaimFilesTable` props (`rows/page/onPageChange/onEdit`) match the Task 7 call site. Toolbar takes no props in Task 5 and is rendered propless in Task 7. `BASE_PATH` + `:id` route (Task 7 pencil → Task 8 route) align.
