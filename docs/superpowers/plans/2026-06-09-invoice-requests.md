# Invoice Requests Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the "Yêu cầu hoá đơn" (invoice request) list page as UI + in-memory mock data, faithful to `docs/ui/invoice-request.png`, with functional client-side keyword search + sort and table pagination.

**Architecture:** Mirror the existing `src/pages/policies/` and `src/pages/reports/` patterns — a `src/pages/invoice-requests/` folder with the page component, a `mock-data.ts`, a pure `invoice-filters.ts`, and focused presentational components under `components/`. The page owns applied-filter + pagination state; a pure `applyFilters` narrows + sorts mock rows; AntD `Table` paginates the result. A new leaf route + sidebar link make it reachable.

**Tech Stack:** React 19, AntD v6, Tailwind v4, react-router v7. Package manager: **yarn**.

**No tests** (per request — mock UI only). Each task verifies with `npx tsc -b` and a final headless-Chrome visual check. **Reference spec:** `docs/superpowers/specs/2026-06-09-invoice-requests-design.md`. **Follow** `docs/rules/ui-ux-strict.md` — labels verbatim. **No API URLs are touched** (this feature has no endpoint).

---

## File Structure

```
src/pages/invoice-requests/
├── InvoiceRequestsListPage.tsx   // breadcrumb + title; owns appliedFilters + page state; composes sections
├── mock-data.ts                  // InvoiceRequestRow, sortOptions, formatters, invoiceRows[]
├── invoice-filters.ts            // InvoiceFilters type, DEFAULT_FILTERS, pure applyFilters()
└── components/
    ├── InvoiceFilters.tsx        // label-above bar: Tìm kiếm + Sắp xếp theo + Làm lại/Tìm kiếm
    ├── InvoiceToolbar.tsx        // "Danh sách Yêu cầu hóa đơn" + reload/column-height/settings icons
    └── InvoiceTable.tsx          // AntD Table: 12 columns, stacked Thời hạn cell, pagination
```
Modified: `src/app/router.tsx`, `src/layouts/AdminLayout/SidebarNav.tsx`.

---

### Task 1: Mock data, type, formatters

**Files:**
- Create: `src/pages/invoice-requests/mock-data.ts`

- [ ] **Step 1: Create the mock data module**

```ts
export interface InvoiceRequestRow {
  id: string
  contractNo: string // Số hợp đồng bảo hiểm (may be "-")
  holderName: string // Tên chủ hợp đồng
  phone: string // Số điện thoại (may be "-")
  receiverName: string // Tên người nhận
  partner: string // Đối tác
  product: string // Sản phẩm
  createdAt: string // Ngày tạo yêu cầu (ISO; rendered dd/mm/yyyy)
  coverageFrom: string // Thời hạn bảo hiểm — Từ (ISO; rendered dd/mm/yyyy HH:mm)
  coverageTo: string // Thời hạn bảo hiểm — Đến (ISO; rendered dd/mm/yyyy HH:mm)
  email: string // Email người nhận
  taxCode: string // Mã số thuế
  address: string // Địa chỉ người nhận
}

// "Sắp xếp theo" options — verbatim from the design ("Xếp theo mới nhất" default).
export const sortOptions = [
  { value: 'moi-nhat', label: 'Xếp theo mới nhất' },
  { value: 'cu-nhat', label: 'Xếp theo cũ nhất' },
]

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// Mock assumption (spec §3): rows are synthetic, mirroring the design's shape — some
// rows use "-" for contractNo/phone/receiver/email/address as the screenshot shows.
export const invoiceRows: InvoiceRequestRow[] = [
  { id: '1', contractNo: '260247641', holderName: 'Trần Minh Huy', phone: '0905071648', receiverName: 'CHI NHÁNH ĐÀ NẴNG - CÔNG TY CỔ PHẦN VINPEARL', partner: 'PVI Plus', product: 'Bảo hiểm Du lịch quốc tế', createdAt: '2026-06-08T09:12:00', coverageFrom: '2026-06-11T00:00:00', coverageTo: '2026-06-15T23:59:00', email: 'huy.m.tran@marriott.com', taxCode: '4200456848-008', address: 'SỐ 07 TRƯỜNG SA, PHƯỜNG NGŨ HÀNH SƠN, THÀNH PHỐ ĐÀ NẴNG, VIỆT NAM' },
  { id: '2', contractNo: '-', holderName: 'Hộ Kinh Doanh Lại Thị Huệ', phone: '0983756196', receiverName: '-', partner: 'VNPOS T', product: 'Bảo hiểm Cháy và các loại rủi ro đặc biệt cho hộ kinh doanh', createdAt: '2026-06-06T15:39:00', coverageFrom: '2026-06-06T15:39:00', coverageTo: '2026-06-07T23:59:00', email: '-', taxCode: '0331820076-96', address: '-' },
  { id: '3', contractNo: '-', holderName: 'Lê Thị Hằng', phone: '0978008269', receiverName: '-', partner: 'VNPOS T', product: 'Bảo hiểm Cháy và các loại rủi ro đặc biệt cho hộ kinh doanh', createdAt: '2026-06-06T18:21:00', coverageFrom: '2026-06-06T18:21:00', coverageTo: '2026-06-07T23:59:00', email: '-', taxCode: '0011870269-81', address: '-' },
  { id: '4', contractNo: '-', holderName: 'Nguyễn Mạnh Hùng', phone: '0915604088', receiverName: '-', partner: 'VNPOS T', product: 'Bảo hiểm Cháy và các loại rủi ro đặc biệt cho hộ kinh doanh', createdAt: '2026-06-06T17:06:00', coverageFrom: '2026-06-06T17:06:00', coverageTo: '2026-06-07T23:59:00', email: '-', taxCode: '0110840077-34', address: '-' },
  { id: '5', contractNo: '260241595', holderName: 'Phạm Phương Chi', phone: '0982906817', receiverName: 'CONNECT-GIFT DEVELOPMENT INVESTMENT AND TRADING JOINT STOCK COMPANY', partner: 'RABBIT CARE', product: 'Bảo hiểm Du lịch quốc tế', createdAt: '2026-06-04T10:05:00', coverageFrom: '2026-06-19T08:00:00', coverageTo: '2026-06-23T23:59:00', email: 'pchiphm@gmail.com', taxCode: '0107062746', address: '5/12/1 Nguyen Van Troi, Phuong Liet ward, Hanoi' },
  { id: '6', contractNo: '260241128', holderName: 'Lương Nguyễn Vĩnh Hưng', phone: '0934985566', receiverName: 'Công ty TNHH Một Thành viên SAP Việt Nam', partner: 'RABBIT CARE', product: 'Bảo hiểm Du lịch quốc tế', createdAt: '2026-06-03T08:47:00', coverageFrom: '2026-06-18T07:00:00', coverageTo: '2026-06-22T23:59:00', email: 'hung.luong@sap.com', taxCode: '0311183701', address: 'Phòng 1 và Phòng 2 của Tầng 27, Tầng 28, 29, 31, 32, Toà Nhà The Nexus, Số 3A-3B, Đường Tôn Đức Thắng, Phường Sài Gòn, Thành phố Hồ Chí Minh, Việt Nam' },
  { id: '7', contractNo: '260239900', holderName: 'Đặng Quốc Toản', phone: '0907123456', receiverName: 'Công ty Cổ phần Du lịch Việt', partner: 'PVI Plus', product: 'Bảo hiểm Du lịch quốc tế', createdAt: '2026-06-02T13:30:00', coverageFrom: '2026-06-10T00:00:00', coverageTo: '2026-06-14T23:59:00', email: 'toan.dq@dulichviet.com', taxCode: '0101245678', address: '12 Hàng Bài, Hoàn Kiếm, Hà Nội, Việt Nam' },
  { id: '8', contractNo: '-', holderName: 'Hộ Kinh Doanh Trần Văn Bình', phone: '0961122334', receiverName: '-', partner: 'VNPOS T', product: 'Bảo hiểm Cháy và các loại rủi ro đặc biệt cho hộ kinh doanh', createdAt: '2026-06-02T09:15:00', coverageFrom: '2026-06-02T09:15:00', coverageTo: '2026-06-03T23:59:00', email: '-', taxCode: '0312456789-01', address: '-' },
  { id: '9', contractNo: '260238771', holderName: 'Vũ Thị Mai', phone: '0922334455', receiverName: 'Công ty TNHH Thương mại Mai Vũ', partner: 'RABBIT CARE', product: 'Bảo hiểm Du lịch quốc tế', createdAt: '2026-06-01T11:20:00', coverageFrom: '2026-06-12T06:00:00', coverageTo: '2026-06-16T23:59:00', email: 'mai.vu@maivu.vn', taxCode: '0309876543', address: '88 Lê Lợi, Quận 1, TP. Hồ Chí Minh, Việt Nam' },
  { id: '10', contractNo: '-', holderName: 'Lê Hoàng Nam', phone: '0938877665', receiverName: '-', partner: 'VNPOS T', product: 'Bảo hiểm Cháy và các loại rủi ro đặc biệt cho hộ kinh doanh', createdAt: '2026-05-31T14:00:00', coverageFrom: '2026-05-31T14:00:00', coverageTo: '2026-06-01T23:59:00', email: '-', taxCode: '0345678912-22', address: '-' },
  { id: '11', contractNo: '260236540', holderName: 'Phan Thị Thu', phone: '0911223344', receiverName: 'Công ty Cổ phần Đầu tư Thu Phan', partner: 'PVI Plus', product: 'Bảo hiểm Du lịch quốc tế', createdAt: '2026-05-30T16:40:00', coverageFrom: '2026-06-08T00:00:00', coverageTo: '2026-06-12T23:59:00', email: 'thu.phan@thuphan.com', taxCode: '0102345671', address: '45 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội, Việt Nam' },
  { id: '12', contractNo: '260235012', holderName: 'Trịnh Văn Long', phone: '0945566778', receiverName: 'Công ty TNHH Long Trịnh', partner: 'RABBIT CARE', product: 'Bảo hiểm Du lịch quốc tế', createdAt: '2026-05-29T09:05:00', coverageFrom: '2026-06-09T07:30:00', coverageTo: '2026-06-13T23:59:00', email: 'long.trinh@longtrinh.vn', taxCode: '0307654321', address: '23 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh, Việt Nam' },
  { id: '13', contractNo: '-', holderName: 'Hộ Kinh Doanh Đỗ Thị Lan', phone: '0956677889', receiverName: '-', partner: 'VNPOS T', product: 'Bảo hiểm Cháy và các loại rủi ro đặc biệt cho hộ kinh doanh', createdAt: '2026-05-28T10:45:00', coverageFrom: '2026-05-28T10:45:00', coverageTo: '2026-05-29T23:59:00', email: '-', taxCode: '0356789123-33', address: '-' },
]
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b`
Expected: PASS (no errors).

- [ ] **Step 3: Commit**

```bash
git add src/pages/invoice-requests/mock-data.ts
git commit -m "feat(invoice): add mock data, type and formatters"
```

---

### Task 2: Pure filter util

**Files:**
- Create: `src/pages/invoice-requests/invoice-filters.ts`

- [ ] **Step 1: Create the filter module**

```ts
import type { InvoiceRequestRow } from './mock-data'

export interface InvoiceFilters {
  keyword: string // Tìm kiếm — contractNo + holderName + receiverName + phone + taxCode
  sort: 'moi-nhat' | 'cu-nhat'
}

export const DEFAULT_FILTERS: InvoiceFilters = {
  keyword: '',
  sort: 'moi-nhat',
}

function hasText(value: string, query: string): boolean {
  const q = query.trim()
  if (!q) return true
  return value.toLowerCase().includes(q.toLowerCase())
}

export function applyFilters(rows: InvoiceRequestRow[], f: InvoiceFilters): InvoiceRequestRow[] {
  const filtered = rows.filter(
    (row) =>
      !f.keyword.trim() ||
      hasText(row.contractNo, f.keyword) ||
      hasText(row.holderName, f.keyword) ||
      hasText(row.receiverName, f.keyword) ||
      hasText(row.phone, f.keyword) ||
      hasText(row.taxCode, f.keyword),
  )
  // immutable sort by createdAt (ISO strings sort lexically): "mới nhất" = newest first.
  return [...filtered].sort((a, b) =>
    f.sort === 'moi-nhat'
      ? b.createdAt.localeCompare(a.createdAt)
      : a.createdAt.localeCompare(b.createdAt),
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/invoice-requests/invoice-filters.ts
git commit -m "feat(invoice): add pure client-side keyword filter + sort util"
```

---

### Task 3: Filter bar component

**Files:**
- Create: `src/pages/invoice-requests/components/InvoiceFilters.tsx`

- [ ] **Step 1: Create the filter bar**

```tsx
import { Button, Col, Form, Input, Row, Select } from 'antd'
import { sortOptions } from '../mock-data'
import { DEFAULT_FILTERS, type InvoiceFilters } from '../invoice-filters'

interface InvoiceFiltersProps {
  onSearch: (filters: InvoiceFilters) => void
  onReset: () => void
}

interface FormShape {
  keyword?: string
  sort?: InvoiceFilters['sort']
}

const initialValues: FormShape = {
  keyword: '',
  sort: DEFAULT_FILTERS.sort,
}

export function InvoiceFilters({ onSearch, onReset }: InvoiceFiltersProps) {
  const [form] = Form.useForm<FormShape>()

  const handleSearch = () => {
    const v = form.getFieldsValue()
    onSearch({
      keyword: v.keyword ?? '',
      sort: v.sort ?? 'moi-nhat',
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
        <Col xs={24} md={8}>
          <Form.Item label="Tìm kiếm" name="keyword" className="mb-0">
            <Input placeholder="Nhập từ khoá tìm kiếm" allowClear />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item label="Sắp xếp theo" name="sort" className="mb-0">
            <Select options={sortOptions} />
          </Form.Item>
        </Col>
        <Col xs={24} md={8} className="flex items-end justify-end gap-2 pt-3 md:pt-0">
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
git add src/pages/invoice-requests/components/InvoiceFilters.tsx
git commit -m "feat(invoice): add label-above filter bar with reset/search"
```

---

### Task 4: Toolbar component

**Files:**
- Create: `src/pages/invoice-requests/components/InvoiceToolbar.tsx`

- [ ] **Step 1: Create the toolbar**

```tsx
import { Button, Tooltip } from 'antd'
import { ColumnHeightOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons'

export function InvoiceToolbar() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-white px-5 py-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <h2 className="text-base font-semibold text-gray-800">Danh sách Yêu cầu hóa đơn</h2>
      <div className="flex items-center gap-2">
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
git add src/pages/invoice-requests/components/InvoiceToolbar.tsx
git commit -m "feat(invoice): add panel toolbar with icon buttons"
```

---

### Task 5: Invoice table component

**Files:**
- Create: `src/pages/invoice-requests/components/InvoiceTable.tsx`

- [ ] **Step 1: Create the table**

```tsx
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { formatDate, formatDateTime, type InvoiceRequestRow } from '../mock-data'

const PAGE_SIZE = 10

interface InvoiceTableProps {
  rows: InvoiceRequestRow[]
  page: number
  onPageChange: (page: number) => void
}

export function InvoiceTable({ rows, page, onPageChange }: InvoiceTableProps) {
  const columns: ColumnsType<InvoiceRequestRow> = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      render: (_v, _row, index) => (page - 1) * PAGE_SIZE + index + 1,
    },
    { title: 'Số hợp đồng bảo hiểm', dataIndex: 'contractNo', key: 'contractNo' },
    { title: 'Tên chủ hợp đồng', dataIndex: 'holderName', key: 'holderName' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'Tên người nhận', dataIndex: 'receiverName', key: 'receiverName' },
    { title: 'Đối tác', dataIndex: 'partner', key: 'partner' },
    { title: 'Sản phẩm', dataIndex: 'product', key: 'product' },
    {
      title: 'Ngày tạo yêu cầu',
      key: 'createdAt',
      render: (_v, row) => formatDate(row.createdAt),
    },
    {
      title: 'Thời hạn bảo hiểm',
      key: 'coverage',
      render: (_v, row) => (
        <div className="leading-5">
          <div>
            <span className="text-gray-500">Từ: </span>
            <span className="text-gray-800">{formatDateTime(row.coverageFrom)}</span>
          </div>
          <div>
            <span className="text-gray-500">Đến: </span>
            <span className="text-gray-800">{formatDateTime(row.coverageTo)}</span>
          </div>
        </div>
      ),
    },
    { title: 'Email người nhận', dataIndex: 'email', key: 'email' },
    { title: 'Mã số thuế', dataIndex: 'taxCode', key: 'taxCode' },
    { title: 'Địa chỉ người nhận', dataIndex: 'address', key: 'address' },
  ]

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-2 shadow-sm">
      <Table<InvoiceRequestRow>
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
git add src/pages/invoice-requests/components/InvoiceTable.tsx
git commit -m "feat(invoice): add table with 12 columns and stacked Thời hạn cell"
```

---

### Task 6: Page composition

**Files:**
- Create: `src/pages/invoice-requests/InvoiceRequestsListPage.tsx`

- [ ] **Step 1: Create the page**

```tsx
import { useMemo, useState } from 'react'
import { Breadcrumb } from 'antd'
import { invoiceRows } from './mock-data'
import { applyFilters, DEFAULT_FILTERS, type InvoiceFilters } from './invoice-filters'
import { InvoiceFilters as InvoiceFiltersBar } from './components/InvoiceFilters'
import { InvoiceToolbar } from './components/InvoiceToolbar'
import { InvoiceTable } from './components/InvoiceTable'

export function InvoiceRequestsListPage() {
  const [appliedFilters, setAppliedFilters] = useState<InvoiceFilters>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)

  const filteredRows = useMemo(
    () => applyFilters(invoiceRows, appliedFilters),
    [appliedFilters],
  )

  const handleSearch = (filters: InvoiceFilters) => {
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
        <Breadcrumb items={[{ title: 'Yêu cầu hoá đơn' }]} />
        <h1 className="text-xl font-semibold text-gray-800">Yêu cầu hoá đơn</h1>
      </div>
      <InvoiceFiltersBar onSearch={handleSearch} onReset={handleReset} />
      <InvoiceToolbar />
      <InvoiceTable rows={filteredRows} page={page} onPageChange={setPage} />
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/invoice-requests/InvoiceRequestsListPage.tsx
git commit -m "feat(invoice): compose invoice requests page with filter + table state"
```

---

### Task 7: Routing & sidebar wiring

**Files:**
- Modify: `src/app/router.tsx`
- Modify: `src/layouts/AdminLayout/SidebarNav.tsx`

- [ ] **Step 1: Add the route**

In `src/app/router.tsx`, add the import after the `ReportsListPage` import (line 6):

```tsx
import { InvoiceRequestsListPage } from '../pages/invoice-requests/InvoiceRequestsListPage'
```

Then add this route immediately after the `tra-cuu-gsm` route (currently line 22):

```tsx
      { path: 'yeu-cau-hoa-don', element: <InvoiceRequestsListPage /> },
```

- [ ] **Step 2: Convert the sidebar item to a leaf link**

In `src/layouts/AdminLayout/SidebarNav.tsx`, replace the existing empty-parent item
`{ key: 'yeu-cau-hoa-don', icon: <FileDoneOutlined />, label: 'Yêu cầu hoá đơn', children: [] },` with a leaf:

```tsx
  { key: '/yeu-cau-hoa-don', icon: <FileDoneOutlined />, label: 'Yêu cầu hoá đơn' },
```

The existing `onClick` already calls `navigate(key)` for keys starting with `/`, and `selectedKeys={[pathname]}` highlights the active item — no further change needed. Leave all other menu items untouched.

- [ ] **Step 3: Type-check**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/app/router.tsx src/layouts/AdminLayout/SidebarNav.tsx
git commit -m "feat(invoice): wire route and Yêu cầu hoá đơn sidebar link"
```

---

### Task 8: Build + visual verification

**Files:** none (verification only)

- [ ] **Step 1: Full production build**

Run: `yarn build`
Expected: PASS (`tsc -b` clean, `vite build` succeeds).

- [ ] **Step 2: Start the dev server**

Run: `yarn dev` (background). Note the local URL (default `http://localhost:5173`).

- [ ] **Step 3: Visual check against the design**

Capture a screenshot at 1440 wide and compare to `docs/ui/invoice-request.png`. If the Playwright MCP bridge is unavailable, use headless Chrome:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --window-size=1440,1150 --virtual-time-budget=9000 --screenshot=/tmp/invoice.png "http://localhost:5173/yeu-cau-hoa-don"
```

Verify:
  - Breadcrumb `Yêu cầu hoá đơn` and the h1 title `Yêu cầu hoá đơn`.
  - Sidebar `Yêu cầu hoá đơn` highlighted as the active leaf item (no submenu).
  - Filter bar: `Tìm kiếm` (placeholder `Nhập từ khoá tìm kiếm`) + `Sắp xếp theo` (`Xếp theo mới nhất`) + `Làm lại` / `Tìm kiếm`, labels above the fields.
  - Toolbar row: heading `Danh sách Yêu cầu hóa đơn` + reload / column-height / settings icon buttons (no add button, no totals).
  - Table headers in order: `STT`, `Số hợp đồng bảo hiểm`, `Tên chủ hợp đồng`, `Số điện thoại`, `Tên người nhận`, `Đối tác`, `Sản phẩm`, `Ngày tạo yêu cầu`, `Thời hạn bảo hiểm`, `Email người nhận`, `Mã số thuế`, `Địa chỉ người nhận`.
  - `Thời hạn bảo hiểm` cell shows stacked `Từ: …` / `Đến: …`; rows with `-` render `-`; page 1 shows 10 of 13 rows, pager shows 2 pages.

Optionally confirm column headers via the live DOM:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --virtual-time-budget=8000 --dump-dom "http://localhost:5173/yeu-cau-hoa-don" 2>/dev/null | grep -oE '<th[^>]*>[^<]*</th>'
```

- [ ] **Step 4: Behaviour spot-check**

  - Type `Mai` into `Tìm kiếm`, click `Tìm kiếm` → only Vũ Thị Mai's row remains. Type a contract-number fragment like `2602476` → only row 1 remains. (Keyword searches contractNo / holder / receiver / phone / taxCode — not partner/product.)
  - Change `Sắp xếp theo` to `Xếp theo cũ nhất`, click `Tìm kiếm` → oldest `createdAt` (row id 13, 28/05/2026) appears first.
  - Set `Tìm kiếm` to a non-matching string (e.g. `zzz`), click `Tìm kiếm` → table shows the default empty state.
  - Click `Làm lại` → filter resets, page back to 1, all 13 rows return (10 shown, newest first).

- [ ] **Step 5: Final commit (if any tweaks were needed)**

```bash
git add -A
git commit -m "chore(invoice): verify invoice requests page renders per design"
```

---

## Self-Review

- **Spec coverage:** §2 file layout → Tasks 1–7. §3 data model + formatters + mock rows → Task 1. §4 filter bar (label-above, exact strings) → Task 3. §5 toolbar (no add/totals) → Task 4. §6 table (12 columns, stacked Thời hạn cell, page size 10, no rowSelection/actions) → Task 5. §7 filtering + sort → Tasks 2,6. §8 page shell (single-crumb breadcrumb) → Task 6. §9 sidebar leaf + route → Task 7. §10 guardrails (verbatim labels, no API, non-component exports isolated in mock-data/filters) respected across Tasks 1,3,7. §11 out-of-scope respected (no actions/status/selection/add; no tests). ✓
- **Placeholder scan:** No TBD/TODO; every code step shows full code; all 13 mock rows spelled out. ✓
- **Type consistency:** `InvoiceRequestRow`, `InvoiceFilters`, `DEFAULT_FILTERS`, `applyFilters`, `sortOptions`, `formatDate`, `formatDateTime`, `invoiceRows` names are identical across Tasks 1–6. `PAGE_SIZE = 10` matches the spec pager. The page imports the `InvoiceFilters` component aliased as `InvoiceFiltersBar` to avoid colliding with the `InvoiceFilters` type (same convention as policies/reports). `sort` literal union `'moi-nhat' | 'cu-nhat'` matches `sortOptions` values and `applyFilters`. ✓
