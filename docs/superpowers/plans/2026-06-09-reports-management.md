# Reports Management Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the "Quản lý báo cáo" (Power BI report management) page as UI + in-memory mock data, faithful to `docs/ui/reports-management.png`, with functional client-side filtering, an expandable advanced filter row, row selection, a status badge column, an enable/disable switch column, and table pagination.

**Architecture:** Mirror the existing `src/pages/policies/` pattern — a `src/pages/reports/` folder with the page component, a `mock-data.ts`, a pure `reports-filters.ts`, and focused presentational components under `components/`. The page owns applied-filter + pagination state; a pure `applyFilters` narrows + sorts mock rows; AntD `Table` paginates the result. A new route group and an expanded `Báo cáo Power BI` sidebar submenu make it reachable.

**Tech Stack:** React 19, AntD v6, Tailwind v4, react-router v7. Package manager: **yarn**.

**No tests** (per request — mock UI only). Each task verifies with `npx tsc -b` and a final Playwright visual check. **Reference spec:** `docs/superpowers/specs/2026-06-09-reports-management-design.md`. **Follow** `docs/rules/ui-ux-strict.md` — labels verbatim. **No API URLs are touched** (this feature has no endpoint).

---

## File Structure

```
src/pages/reports/
├── ReportsListPage.tsx          // breadcrumb + title; owns appliedFilters + page state; composes sections
├── mock-data.ts                 // ReportRow, ReportStatus, ReportAccess, STATUS_CONFIG, ACCESS_CONFIG, option lists, reportRows[]
├── reports-filters.ts           // ReportFilters type, DEFAULT_FILTERS, pure applyFilters()
└── components/
    ├── ReportStatusBadge.tsx    // colored Tag keyed by status
    ├── ReportFilters.tsx        // inline filter bar (Tìm kiếm / Sắp xếp theo / Tiêu đề) + Mở rộng advanced reveal
    ├── ReportToolbar.tsx        // "Quản lý báo cáo Power BI" heading + Thêm báo cáo + 3 icon buttons
    └── ReportTable.tsx          // AntD Table; rowSelection; status badge + Switch columns; action icons; "Trống" empty state
```
Modified: `src/app/router.tsx`, `src/layouts/AdminLayout/SidebarNav.tsx`.

---

### Task 1: Mock data, types, option lists

**Files:**
- Create: `src/pages/reports/mock-data.ts`

- [ ] **Step 1: Create the mock data module**

```ts
export type ReportStatus = 'hoat-dong' | 'tam-dung'
export type ReportAccess = 'cong-khai' | 'noi-bo' | 'rieng-tu'

export interface ReportRow {
  id: string
  title: string // Tiêu đề
  reportType: string // Loại báo cáo
  partnerCode: string // Mã đối tác
  productCode: string // Mã sản phẩm
  order: number // Thứ tự
  access: ReportAccess // Quyền truy cập
  status: ReportStatus // mid-table "Trạng thái" → badge
  enabled: boolean // right-fixed "Trạng thái" → Switch
}

// mid-table "Trạng thái" badge styling
export const STATUS_CONFIG: Record<ReportStatus, { label: string; color: string }> = {
  'hoat-dong': { label: 'Hoạt động', color: 'green' },
  'tam-dung': { label: 'Tạm dừng', color: 'default' },
}

// "Quyền truy cập" display labels
export const ACCESS_CONFIG: Record<ReportAccess, { label: string }> = {
  'cong-khai': { label: 'Công khai' },
  'noi-bo': { label: 'Nội bộ' },
  'rieng-tu': { label: 'Riêng tư' },
}

export const statusOptions = (Object.keys(STATUS_CONFIG) as ReportStatus[]).map((value) => ({
  value,
  label: STATUS_CONFIG[value].label,
}))

export const accessOptions = (Object.keys(ACCESS_CONFIG) as ReportAccess[]).map((value) => ({
  value,
  label: ACCESS_CONFIG[value].label,
}))

// Mock assumption (spec §3): report categories aren't visible in the empty-table
// screenshot — these are placeholders so the advanced "Loại báo cáo" filter functions.
export const reportTypeOptions = ['Doanh thu', 'Bồi thường', 'Tổng hợp', 'Vận hành'].map((v) => ({
  value: v,
  label: v,
}))

// "Sắp xếp theo" options — verbatim from the design ("Xếp theo mới nhất" default).
export const sortOptions = [
  { value: 'moi-nhat', label: 'Xếp theo mới nhất' },
  { value: 'cu-nhat', label: 'Xếp theo cũ nhất' },
]

// Mock assumption (spec §1): the design table is empty; these rows are synthetic so the
// table, pagination, badge column, and switch column are demonstrable.
export const reportRows: ReportRow[] = [
  { id: '1', title: 'Báo cáo doanh thu theo chuyến', reportType: 'Doanh thu', partnerCode: 'GSM', productCode: 'PA-TRIP', order: 1, access: 'cong-khai', status: 'hoat-dong', enabled: true },
  { id: '2', title: 'Báo cáo bồi thường tai nạn', reportType: 'Bồi thường', partnerCode: 'PVI', productCode: 'PA-ACC', order: 2, access: 'noi-bo', status: 'hoat-dong', enabled: true },
  { id: '3', title: 'Báo cáo tổng hợp hợp đồng', reportType: 'Tổng hợp', partnerCode: 'GSM', productCode: 'HD-001', order: 3, access: 'rieng-tu', status: 'tam-dung', enabled: false },
  { id: '4', title: 'Báo cáo vận hành đội xe', reportType: 'Vận hành', partnerCode: 'GRAB', productCode: 'VH-FLEET', order: 4, access: 'noi-bo', status: 'hoat-dong', enabled: true },
  { id: '5', title: 'Báo cáo doanh thu FoodCare', reportType: 'Doanh thu', partnerCode: 'GSM', productCode: 'SP-FOOD', order: 5, access: 'cong-khai', status: 'hoat-dong', enabled: true },
  { id: '6', title: 'Báo cáo bồi thường hàng hoá', reportType: 'Bồi thường', partnerCode: 'PVI', productCode: 'SP-CARGO', order: 6, access: 'noi-bo', status: 'tam-dung', enabled: false },
  { id: '7', title: 'Báo cáo tổng hợp tài xế', reportType: 'Tổng hợp', partnerCode: 'GSM', productCode: 'SP-DRIVER', order: 7, access: 'rieng-tu', status: 'hoat-dong', enabled: true },
  { id: '8', title: 'Báo cáo vận hành theo khu vực', reportType: 'Vận hành', partnerCode: 'GRAB', productCode: 'VH-AREA', order: 8, access: 'noi-bo', status: 'hoat-dong', enabled: false },
  { id: '9', title: 'Báo cáo doanh thu theo tháng', reportType: 'Doanh thu', partnerCode: 'PVI', productCode: 'DT-MONTH', order: 9, access: 'cong-khai', status: 'hoat-dong', enabled: true },
  { id: '10', title: 'Báo cáo bồi thường theo quý', reportType: 'Bồi thường', partnerCode: 'GSM', productCode: 'BT-QUARTER', order: 10, access: 'noi-bo', status: 'tam-dung', enabled: false },
  { id: '11', title: 'Báo cáo tổng hợp đối tác', reportType: 'Tổng hợp', partnerCode: 'GRAB', productCode: 'TH-PARTNER', order: 11, access: 'rieng-tu', status: 'hoat-dong', enabled: true },
  { id: '12', title: 'Báo cáo vận hành realtime', reportType: 'Vận hành', partnerCode: 'GSM', productCode: 'VH-RT', order: 12, access: 'noi-bo', status: 'hoat-dong', enabled: true },
  { id: '13', title: 'Báo cáo doanh thu tích luỹ', reportType: 'Doanh thu', partnerCode: 'PVI', productCode: 'DT-ACC', order: 13, access: 'cong-khai', status: 'tam-dung', enabled: false },
  { id: '14', title: 'Báo cáo bồi thường tổng hợp', reportType: 'Bồi thường', partnerCode: 'GSM', productCode: 'BT-ALL', order: 14, access: 'noi-bo', status: 'hoat-dong', enabled: true },
]
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b`
Expected: PASS (no errors).

- [ ] **Step 3: Commit**

```bash
git add src/pages/reports/mock-data.ts
git commit -m "feat(reports): add mock data, types and option lists"
```

---

### Task 2: Pure filter util

**Files:**
- Create: `src/pages/reports/reports-filters.ts`

- [ ] **Step 1: Create the filter module**

```ts
import type { ReportRow, ReportStatus } from './mock-data'

export interface ReportFilters {
  keyword: string // Tìm kiếm — matches title + partnerCode + productCode
  title: string // Tiêu đề — substring match on title
  sort: 'moi-nhat' | 'cu-nhat'
  reportType: string | null // advanced — Loại báo cáo
  partnerCode: string // advanced — Mã đối tác
  status: ReportStatus | null // advanced — Trạng thái
}

export const DEFAULT_FILTERS: ReportFilters = {
  keyword: '',
  title: '',
  sort: 'moi-nhat',
  reportType: null,
  partnerCode: '',
  status: null,
}

function hasText(value: string, query: string): boolean {
  if (!query.trim()) return true
  return value.toLowerCase().includes(query.trim().toLowerCase())
}

export function applyFilters(rows: ReportRow[], f: ReportFilters): ReportRow[] {
  const filtered = rows.filter((row) => {
    const keywordOk =
      !f.keyword.trim() ||
      hasText(row.title, f.keyword) ||
      hasText(row.partnerCode, f.keyword) ||
      hasText(row.productCode, f.keyword)
    return (
      keywordOk &&
      hasText(row.title, f.title) &&
      hasText(row.partnerCode, f.partnerCode) &&
      (f.reportType === null || row.reportType === f.reportType) &&
      (f.status === null || row.status === f.status)
    )
  })
  // immutable sort: "mới nhất" = highest order first, "cũ nhất" = lowest first
  return [...filtered].sort((a, b) =>
    f.sort === 'moi-nhat' ? b.order - a.order : a.order - b.order,
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/reports/reports-filters.ts
git commit -m "feat(reports): add pure client-side filter + sort util"
```

---

### Task 3: Status badge component

**Files:**
- Create: `src/pages/reports/components/ReportStatusBadge.tsx`

- [ ] **Step 1: Create the badge**

```tsx
import { Tag } from 'antd'
import { STATUS_CONFIG, type ReportStatus } from '../mock-data'

interface ReportStatusBadgeProps {
  status: ReportStatus
}

export function ReportStatusBadge({ status }: ReportStatusBadgeProps) {
  const { label, color } = STATUS_CONFIG[status]
  return (
    <Tag color={color} className="rounded-full px-2 py-0.5">
      {label}
    </Tag>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/reports/components/ReportStatusBadge.tsx
git commit -m "feat(reports): add status badge component"
```

---

### Task 4: Filter bar component (inline + Mở rộng reveal)

**Files:**
- Create: `src/pages/reports/components/ReportFilters.tsx`

- [ ] **Step 1: Create the filter bar**

```tsx
import { useState } from 'react'
import { Button, Col, Form, Input, Row, Select } from 'antd'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { reportTypeOptions, sortOptions, statusOptions } from '../mock-data'
import { DEFAULT_FILTERS, type ReportFilters } from '../reports-filters'

interface ReportFiltersProps {
  onSearch: (filters: ReportFilters) => void
  onReset: () => void
}

interface FormShape {
  keyword?: string
  sort?: ReportFilters['sort']
  title?: string
  reportType?: string | null
  partnerCode?: string
  status?: ReportFilters['status']
}

const initialValues: FormShape = {
  keyword: '',
  sort: DEFAULT_FILTERS.sort,
  title: '',
  reportType: null,
  partnerCode: '',
  status: null,
}

export function ReportFilters({ onSearch, onReset }: ReportFiltersProps) {
  const [form] = Form.useForm<FormShape>()
  const [expanded, setExpanded] = useState(false)

  const handleSearch = () => {
    const v = form.getFieldsValue()
    onSearch({
      keyword: v.keyword ?? '',
      title: v.title ?? '',
      sort: v.sort ?? 'moi-nhat',
      reportType: v.reportType ?? null,
      partnerCode: v.partnerCode ?? '',
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
      layout="horizontal"
      initialValues={initialValues}
      className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm"
    >
      <Row gutter={16} align="middle">
        <Col xs={24} md={6}>
          <Form.Item label="Tìm kiếm" name="keyword" className="mb-0">
            <Input placeholder="Nhập từ khoá tìm kiếm" allowClear />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="Sắp xếp theo" name="sort" className="mb-0">
            <Select options={sortOptions} />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="Tiêu đề" name="title" className="mb-0">
            <Input placeholder="nhập dữ liệu" allowClear />
          </Form.Item>
        </Col>
        <Col xs={24} md={6} className="flex items-center justify-end gap-2 pt-3 md:pt-0">
          <Button onClick={handleReset}>Làm lại</Button>
          <Button type="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
          <Button
            type="link"
            className="px-1"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? 'Thu gọn' : 'Mở rộng'} {expanded ? <UpOutlined /> : <DownOutlined />}
          </Button>
        </Col>
      </Row>
      {expanded && (
        <Row gutter={16} align="middle" className="mt-4">
          <Col xs={24} md={6}>
            <Form.Item label="Loại báo cáo" name="reportType" className="mb-0">
              <Select options={reportTypeOptions} allowClear placeholder="Chọn loại báo cáo" />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item label="Mã đối tác" name="partnerCode" className="mb-0">
              <Input placeholder="Nhập mã đối tác" allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item label="Trạng thái" name="status" className="mb-0">
              <Select options={statusOptions} allowClear placeholder="Chọn trạng thái" />
            </Form.Item>
          </Col>
        </Row>
      )}
    </Form>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/reports/components/ReportFilters.tsx
git commit -m "feat(reports): add inline filter bar with Mở rộng advanced reveal"
```

---

### Task 5: Toolbar component

**Files:**
- Create: `src/pages/reports/components/ReportToolbar.tsx`

- [ ] **Step 1: Create the toolbar**

```tsx
import { Button, Tooltip } from 'antd'
import {
  ColumnHeightOutlined,
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@ant-design/icons'

export function ReportToolbar() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-white px-5 py-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <h2 className="text-base font-semibold text-gray-800">Quản lý báo cáo Power BI</h2>
      <div className="flex items-center gap-2">
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm báo cáo
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
git add src/pages/reports/components/ReportToolbar.tsx
git commit -m "feat(reports): add panel toolbar with Thêm báo cáo + icon buttons"
```

---

### Task 6: Report table component

**Files:**
- Create: `src/pages/reports/components/ReportTable.tsx`

- [ ] **Step 1: Create the table**

```tsx
import { useState } from 'react'
import type { Key } from 'react'
import { Button, Empty, Switch, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { ACCESS_CONFIG, type ReportRow } from '../mock-data'
import { ReportStatusBadge } from './ReportStatusBadge'

const PAGE_SIZE = 10

interface ReportTableProps {
  rows: ReportRow[]
  page: number
  onPageChange: (page: number) => void
}

export function ReportTable({ rows, page, onPageChange }: ReportTableProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
  // local-only enable/disable state (visual; no API). Falls back to the row's seed value.
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>({})

  const isEnabled = (row: ReportRow) => enabledMap[row.id] ?? row.enabled
  const toggleEnabled = (row: ReportRow, value: boolean) =>
    setEnabledMap((prev) => ({ ...prev, [row.id]: value }))

  const columns: ColumnsType<ReportRow> = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      render: (_v, _row, index) => (page - 1) * PAGE_SIZE + index + 1,
    },
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Loại báo cáo', dataIndex: 'reportType', key: 'reportType' },
    { title: 'Mã đối tác', dataIndex: 'partnerCode', key: 'partnerCode' },
    { title: 'Mã sản phẩm', dataIndex: 'productCode', key: 'productCode' },
    { title: 'Thứ tự', dataIndex: 'order', key: 'order', width: 80 },
    {
      title: 'Quyền truy cập',
      key: 'access',
      render: (_v, row) => ACCESS_CONFIG[row.access].label,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_v, row) => <ReportStatusBadge status={row.status} />,
    },
    {
      title: 'Trạng thái',
      key: 'enabled',
      width: 110,
      fixed: 'right',
      render: (_v, row) => (
        <Switch checked={isEnabled(row)} onChange={(value) => toggleEnabled(row, value)} />
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 140,
      fixed: 'right',
      render: () => (
        <div className="flex items-center gap-1">
          <Button type="text" icon={<EyeOutlined />} />
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" danger icon={<DeleteOutlined />} />
        </div>
      ),
    },
  ]

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-2 shadow-sm">
      <Table<ReportRow>
        rowKey="id"
        columns={columns}
        dataSource={rows}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Trống" /> }}
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
git add src/pages/reports/components/ReportTable.tsx
git commit -m "feat(reports): add table with row selection, switch + badge columns, empty state"
```

---

### Task 7: Page composition

**Files:**
- Create: `src/pages/reports/ReportsListPage.tsx`

- [ ] **Step 1: Create the page**

```tsx
import { useMemo, useState } from 'react'
import { Breadcrumb } from 'antd'
import { reportRows } from './mock-data'
import { applyFilters, DEFAULT_FILTERS, type ReportFilters } from './reports-filters'
import { ReportFilters as ReportFiltersBar } from './components/ReportFilters'
import { ReportToolbar } from './components/ReportToolbar'
import { ReportTable } from './components/ReportTable'

export function ReportsListPage() {
  const [appliedFilters, setAppliedFilters] = useState<ReportFilters>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)

  const filteredRows = useMemo(
    () => applyFilters(reportRows, appliedFilters),
    [appliedFilters],
  )

  const handleSearch = (filters: ReportFilters) => {
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
        <Breadcrumb items={[{ title: 'Báo cáo Power BI' }, { title: 'Quản lý báo cáo' }]} />
        <h1 className="text-xl font-semibold text-gray-800">Quản lý báo cáo</h1>
      </div>
      <ReportFiltersBar onSearch={handleSearch} onReset={handleReset} />
      <ReportToolbar />
      <ReportTable rows={filteredRows} page={page} onPageChange={setPage} />
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/reports/ReportsListPage.tsx
git commit -m "feat(reports): compose reports management page with filter + table state"
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
import { ReportsListPage } from '../pages/reports/ReportsListPage'

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
      { path: 'bao-cao-power-bi/quan-ly-bao-cao', element: <ReportsListPage /> },
      { path: 'bao-cao-power-bi/bao-cao-cong-khai', element: <PlaceholderPage title="Báo cáo công khai" /> },
      { path: 'bao-cao-power-bi/bao-cao-doanh-thu', element: <PlaceholderPage title="Báo cáo doanh thu" /> },
      { path: 'cai-dat-tai-khoan', element: <PlaceholderPage title="Cài đặt tài khoản" /> },
    ],
  },
])
```

- [ ] **Step 2: Expand the `Báo cáo Power BI` nav item into a submenu**

In `src/layouts/AdminLayout/SidebarNav.tsx`, replace the existing leaf item
`{ key: '/bao-cao-power-bi', icon: <BarChartOutlined />, label: 'Báo cáo Power BI' }` with a parent that has three children:

```tsx
  {
    key: 'bao-cao-power-bi',
    icon: <BarChartOutlined />,
    label: 'Báo cáo Power BI',
    children: [
      { key: '/bao-cao-power-bi/quan-ly-bao-cao', label: 'Quản lý báo cáo' },
      { key: '/bao-cao-power-bi/bao-cao-cong-khai', label: 'Báo cáo công khai' },
      { key: '/bao-cao-power-bi/bao-cao-doanh-thu', label: 'Báo cáo doanh thu' },
    ],
  },
```

Then, so the submenu starts expanded like the screenshot, update the `Menu`'s
`defaultOpenKeys` from `defaultOpenKeys={['don-bao-hiem']}` to:

```tsx
      defaultOpenKeys={['don-bao-hiem', 'bao-cao-power-bi']}
```

The existing `onClick` handler already calls `navigate(key)` for keys starting with `/`, and `selectedKeys={[pathname]}` already highlights the active child — no further change needed. Leave the other menu items untouched.

- [ ] **Step 3: Type-check**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/app/router.tsx src/layouts/AdminLayout/SidebarNav.tsx
git commit -m "feat(reports): wire routes and Báo cáo Power BI submenu"
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

Navigate to `http://localhost:5173/bao-cao-power-bi/quan-ly-bao-cao` (Playwright MCP `browser_navigate` + `browser_take_screenshot`, viewport 1440 wide). Compare to `docs/ui/reports-management.png`. Verify:
  - Breadcrumb `Báo cáo Power BI / Quản lý báo cáo` and the h1 title `Quản lý báo cáo`.
  - Sidebar `Báo cáo Power BI` expanded with the 3 children; `Quản lý báo cáo` highlighted.
  - Filter bar single row: `Tìm kiếm` (placeholder `Nhập từ khoá tìm kiếm`), `Sắp xếp theo` (`Xếp theo mới nhất`), `Tiêu đề` (placeholder `nhập dữ liệu`), then `Làm lại` / `Tìm kiếm` / `Mở rộng ⌄`.
  - Toolbar row: heading `Quản lý báo cáo Power BI`, `+ Thêm báo cáo` primary button, reload / column-height / settings icon buttons.
  - Table headers in order: checkbox, `STT`, `Tiêu đề`, `Loại báo cáo`, `Mã đối tác`, `Mã sản phẩm`, `Thứ tự`, `Quyền truy cập`, `Trạng thái` (badge), `Trạng thái` (switch, right-fixed), `Hành động` (right-fixed).
  - Page 1 shows 10 of 14 rows; green `Hoạt động` / grey `Tạm dừng` tags; switches reflect each row's `enabled`; pager present.

- [ ] **Step 4: Behaviour spot-check**

  - Click `Mở rộng` → advanced row appears with `Loại báo cáo`, `Mã đối tác`, `Trạng thái`; label flips to `Thu gọn`, chevron flips up. Click again → row collapses.
  - Type `FoodCare` into `Tìm kiếm`, click `Tìm kiếm` → only the matching row (id 5) remains.
  - Expand, pick `Trạng thái` = `Tạm dừng`, click `Tìm kiếm` → only `Tạm dừng` rows remain.
  - Change `Sắp xếp theo` to `Xếp theo cũ nhất`, click `Tìm kiếm` → row order reverses (Thứ tự ascending).
  - Toggle a row's right-fixed switch → it flips and stays (local state).
  - Set `Tìm kiếm` to a non-matching string (e.g. `zzz`), click `Tìm kiếm` → table shows the `Trống` empty state.
  - Click `Làm lại` → filters reset to defaults, page back to 1, all 14 rows return (10 shown).

- [ ] **Step 5: Final commit (if any tweaks were needed)**

```bash
git add -A
git commit -m "chore(reports): verify reports management page renders per design"
```

---

## Self-Review

- **Spec coverage:** §2 file layout → Tasks 1–8. §3 data model + option lists → Task 1. §4 filter bar (inline labels, exact placeholders, `Mở rộng` reveal) → Task 4. §5 toolbar → Task 5. §6 table (rowSelection, badge + Switch columns, action icons, `Trống` empty state, page size 10) → Tasks 3,6. §7 filtering + sort → Tasks 2,7. §8 page shell → Task 7. §9 sidebar + routing → Task 8. §10 guardrails (verbatim labels, no API, non-component exports isolated in mock-data/filters) respected across Tasks 1,4,8. §11 out-of-scope respected (actions/switch/add are no-op or local-state; sub-pages are placeholders; no tests). ✓
- **Placeholder scan:** No TBD/TODO; every code step shows full code; all 14 mock rows are spelled out. ✓
- **Type consistency:** `ReportRow`, `ReportStatus`, `ReportAccess`, `ReportFilters`, `DEFAULT_FILTERS`, `applyFilters`, `STATUS_CONFIG`, `ACCESS_CONFIG`, `statusOptions`, `accessOptions`, `reportTypeOptions`, `sortOptions`, `reportRows` names are identical across Tasks 1–8. `PAGE_SIZE = 10` matches the spec pager. The page imports the `ReportFilters` component aliased as `ReportFiltersBar` to avoid colliding with the `ReportFilters` type (same convention the policies page uses). `sort` literal union `'moi-nhat' | 'cu-nhat'` matches `sortOptions` values. ✓
