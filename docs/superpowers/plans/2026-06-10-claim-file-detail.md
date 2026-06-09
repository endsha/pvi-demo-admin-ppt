# Claim File Detail Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the read-only `Chỉnh sửa hồ sơ bồi thường` (Claim File Detail) page for *Bảo hiểm tích lũy tài xế*, replacing the existing `PlaceholderPage` route stub. UI + mock data only, no API.

**Architecture:** A new feature folder `src/pages/claim-file-detail/` holds the page, its mock data, and two new display components (`InfoTable`, `PaymentTable`). The `BenefitTable` and `AccumulationTable` (currently inside `master-policy-detail`) are extracted into a shared `src/components/insurance/` module and reused by both features. The page is read-only except two interactive `Select`s (HĐNT + status); no save, no API.

**Tech Stack:** React 19, TypeScript, Ant Design v6, react-router-dom v7, Tailwind utility classes, Vite. Package manager: **yarn**.

**Testing note (adaptation):** This repo has **no unit-test runner** and the spec specifies *Playwright visual verification, no unit tests* for static display. So each task's verification loop is **`yarn build` (tsc + vite) + `yarn lint`**, and the final task is a Playwright visual check. This intentionally replaces the skill's default red/green unit-test loop, per the approved spec (`docs/superpowers/specs/2026-06-10-claim-file-detail-design.md` §9) and `docs/CLAUDE.md`.

**Known low-res items (verify against screenshots during Task 8):** per spec §8 — (a) accident-info field list, (b) payment-table columns, (c) trips-table header labels / expand behavior. Best-effort values are baked in and clearly marked `// VERIFY vs design`.

---

## File Structure

**Create:**
- `src/components/insurance/types.ts` — shared `BenefitRow`, `AccumulationTrip` types
- `src/components/insurance/format.ts` — shared `formatMoney`, `formatDateTimeSeconds`
- `src/components/insurance/BenefitTable.tsx` — moved from master-policy-detail
- `src/components/insurance/AccumulationTable.tsx` — moved from master-policy-detail (+ optional `title` prop)
- `src/pages/claim-file-detail/claim-file-detail-mock.ts` — types, mock record, finder, select options
- `src/pages/claim-file-detail/components/InfoTable.tsx` — read-only label/value table
- `src/pages/claim-file-detail/components/PaymentTable.tsx` — "Bảng thanh toán bồi thường"
- `src/pages/claim-file-detail/ClaimFileDetailPage.tsx` — page shell + composition

**Modify:**
- `src/pages/master-policy-detail/mock-data.ts` — import shared types/helpers instead of defining them
- `src/pages/master-policy-detail/MasterPolicyDetailPage.tsx` — import tables from shared module
- `src/app/router.tsx` — replace the detail `PlaceholderPage` with `ClaimFileDetailPage`

**Delete:**
- `src/pages/master-policy-detail/components/BenefitTable.tsx`
- `src/pages/master-policy-detail/components/AccumulationTable.tsx`

---

## Task 1: Extract shared `insurance` module (types + format helpers)

**Files:**
- Create: `src/components/insurance/types.ts`
- Create: `src/components/insurance/format.ts`

- [ ] **Step 1: Create the shared types file**

Create `src/components/insurance/types.ts`:

```ts
export interface BenefitRow {
  key: string
  name: string
  sub?: string
  hanMuc: string | null
  daChiTra: string | null
  uocBoiThuong: string | null
  hanMucConLai: string | null
}

export interface AccumulationTrip {
  id: string
  gsmTripId: string // ID chuyến xe GSM
  transferContractNo: string // Mã hợp đồng bảo hiểm chuyến
  completedAt: string // ISO — Thời gian hoàn thành chuyến
  effectiveStart: string // ISO — Thời gian bắt đầu bảo hiểm
  effectiveEnd: string // ISO — Thời gian kết thúc bảo hiểm
  sumInsured: number // STBH/ chuyến
  benefits: BenefitRow[]
}
```

- [ ] **Step 2: Create the shared format helpers file**

Create `src/components/insurance/format.ts`:

```ts
export function formatMoney(n: number): string {
  return n.toLocaleString('vi-VN') // 250.000
}

export function formatDateTimeSeconds(iso: string): string {
  const d = new Date(iso)
  const pad = (x: number) => String(x).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
```

- [ ] **Step 3: Verify it compiles**

Run: `yarn build`
Expected: PASS (new files are not yet imported; build still succeeds).

- [ ] **Step 4: Commit**

```bash
git add src/components/insurance/types.ts src/components/insurance/format.ts
git commit -m "refactor(insurance): add shared types and format helpers"
```

---

## Task 2: Move `BenefitTable` and `AccumulationTable` into the shared module

**Files:**
- Create: `src/components/insurance/BenefitTable.tsx`
- Create: `src/components/insurance/AccumulationTable.tsx`
- Delete: `src/pages/master-policy-detail/components/BenefitTable.tsx`
- Delete: `src/pages/master-policy-detail/components/AccumulationTable.tsx`

- [ ] **Step 1: Create the shared `BenefitTable`**

Create `src/components/insurance/BenefitTable.tsx` (identical columns to the original; type now comes from `./types`):

```tsx
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { BenefitRow } from './types'

const renderDash = (value: string | null) => value ?? '-'

const BENEFIT_COLUMNS: ColumnsType<BenefitRow> = [
  {
    title: 'QUYỀN LỢI BẢO HIỂM',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    render: (_value, row) => (
      <div>
        <div className="font-semibold text-gray-800">{row.name}</div>
        {row.sub && <div className="mt-0.5 text-xs italic text-gray-400">{row.sub}</div>}
      </div>
    ),
  },
  { title: 'HẠN MỨC BẢO HIỂM', dataIndex: 'hanMuc', key: 'hanMuc', align: 'center', render: renderDash },
  { title: 'ĐÃ CHI TRẢ', dataIndex: 'daChiTra', key: 'daChiTra', align: 'center', render: renderDash },
  { title: 'ƯỚC BỒI THƯỜNG', dataIndex: 'uocBoiThuong', key: 'uocBoiThuong', align: 'center', render: renderDash },
  { title: 'HẠN MỨC CÒN LẠI', dataIndex: 'hanMucConLai', key: 'hanMucConLai', align: 'center', render: renderDash },
]

interface BenefitTableProps {
  rows: BenefitRow[]
}

export function BenefitTable({ rows }: BenefitTableProps) {
  return (
    <Table<BenefitRow>
      rowKey="key"
      columns={BENEFIT_COLUMNS}
      dataSource={rows}
      pagination={false}
      size="middle"
    />
  )
}
```

- [ ] **Step 2: Create the shared `AccumulationTable` (with optional `title` prop)**

Create `src/components/insurance/AccumulationTable.tsx`. Same as the original but imports from `./BenefitTable`, `./format`, `./types`, and accepts an optional `title` (default keeps the master-policy behavior):

```tsx
import { Table } from 'antd'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { BenefitTable } from './BenefitTable'
import { formatDateTimeSeconds, formatMoney } from './format'
import type { AccumulationTrip } from './types'

function SortCaret() {
  return (
    <span className="ml-1 inline-flex flex-col text-[9px] leading-[7px] text-gray-300">
      <CaretUpOutlined />
      <CaretDownOutlined />
    </span>
  )
}

function HeaderWithSort({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center">
      {label}
      <SortCaret />
    </span>
  )
}

interface AccumulationTableProps {
  trips: AccumulationTrip[]
  title?: string
}

export function AccumulationTable({ trips, title = 'Bảng Danh sách đơn tích luỹ' }: AccumulationTableProps) {
  const columns: ColumnsType<AccumulationTrip> = [
    { title: 'STT', key: 'stt', width: 60, render: (_v, _row, index) => index + 1 },
    { title: <HeaderWithSort label="ID chuyến xe GSM" />, dataIndex: 'gsmTripId', key: 'gsmTripId' },
    {
      title: <HeaderWithSort label="Mã hợp đồng bảo hiểm chuyến" />,
      dataIndex: 'transferContractNo',
      key: 'transferContractNo',
    },
    {
      title: <HeaderWithSort label="Thời gian hoàn thành chuyến" />,
      dataIndex: 'completedAt',
      key: 'completedAt',
      render: formatDateTimeSeconds,
    },
    {
      title: <HeaderWithSort label="Thời gian bắt đầu bảo hiểm" />,
      dataIndex: 'effectiveStart',
      key: 'effectiveStart',
      render: formatDateTimeSeconds,
    },
    {
      title: <HeaderWithSort label="Thời gian kết thúc bảo hiểm" />,
      dataIndex: 'effectiveEnd',
      key: 'effectiveEnd',
      render: formatDateTimeSeconds,
    },
    {
      title: 'STBH/ chuyến',
      dataIndex: 'sumInsured',
      key: 'sumInsured',
      align: 'right',
      render: (value: number) => `${formatMoney(value)} đ`,
    },
  ]

  return (
    <section>
      <h2 className="mb-4 text-base font-semibold text-gray-800">{title}</h2>
      <Table<AccumulationTrip>
        rowKey="id"
        columns={columns}
        dataSource={trips}
        expandable={{
          expandedRowRender: (trip) => <BenefitTable rows={trip.benefits} />,
        }}
        pagination={{
          pageSize: 10,
          total: trips.length,
          showSizeChanger: false,
          showTotal: (total, range) => `${range[0]}-${range[1]} trên ${total} mặt hàng`,
        }}
        scroll={{ x: 'max-content' }}
      />
    </section>
  )
}
```

- [ ] **Step 3: Delete the old component files**

```bash
git rm src/pages/master-policy-detail/components/BenefitTable.tsx
git rm src/pages/master-policy-detail/components/AccumulationTable.tsx
```

- [ ] **Step 4: Verify the build fails (master-policy-detail still imports the old paths)**

Run: `yarn build`
Expected: FAIL — `MasterPolicyDetailPage.tsx` and `mock-data.ts` still reference the now-deleted/changed modules. This confirms the next task is needed. (If it unexpectedly passes, continue anyway.)

- [ ] **Step 5: Commit**

```bash
git add src/components/insurance/BenefitTable.tsx src/components/insurance/AccumulationTable.tsx
git commit -m "refactor(insurance): move BenefitTable and AccumulationTable to shared module"
```

---

## Task 3: Update `master-policy-detail` to consume the shared module

**Files:**
- Modify: `src/pages/master-policy-detail/mock-data.ts`
- Modify: `src/pages/master-policy-detail/MasterPolicyDetailPage.tsx`

- [ ] **Step 1: Update `mock-data.ts` to import shared types + helpers**

In `src/pages/master-policy-detail/mock-data.ts`:

**Delete** these four blocks:
- the `export interface BenefitRow { ... }` block
- the `export interface AccumulationTrip { ... }` block
- the `export function formatMoney(...) { ... }` block
- the `export function formatDateTimeSeconds(...) { ... }` block

Then **add** these imports at the very top of the file:

```ts
import type { BenefitRow, AccumulationTrip } from '../../components/insurance/types'
import { formatMoney } from '../../components/insurance/format'
```

Keep everything else (the `MasterPolicyDetail` interface, the private `money()` function, `BENEFIT_META`, `MASTER_HAN_MUC`, `masterBenefits`, `buildTripBenefits`, `TRIP_LIMITS`, `masterPolicyDetail`, `getMasterPolicyDetail`) unchanged. The `MasterPolicyDetail` interface continues to reference `BenefitRow[]` and `AccumulationTrip[]` — now from the import.

> Note: `formatDateTimeSeconds` is no longer used inside `mock-data.ts` (only `AccumulationTable` used it, and it now imports from `./format`). Do not re-add it here.

- [ ] **Step 2: Update `MasterPolicyDetailPage.tsx` imports**

In `src/pages/master-policy-detail/MasterPolicyDetailPage.tsx`, change these two lines:

```tsx
import { BenefitTable } from './components/BenefitTable'
import { AccumulationTable } from './components/AccumulationTable'
```

to:

```tsx
import { BenefitTable } from '../../components/insurance/BenefitTable'
import { AccumulationTable } from '../../components/insurance/AccumulationTable'
```

Leave the rest of the file unchanged (it still imports `getMasterPolicyDetail` and `GeneralInfoCard` from local paths, and renders `<AccumulationTable trips={detail.trips} />` — the new optional `title` prop defaults to the original value, so behavior is identical).

- [ ] **Step 3: Verify the build passes**

Run: `yarn build`
Expected: PASS — master-policy-detail now resolves the shared module, no behavior change.

- [ ] **Step 4: Lint**

Run: `yarn lint`
Expected: PASS (no unused imports/exports).

- [ ] **Step 5: Commit**

```bash
git add src/pages/master-policy-detail/mock-data.ts src/pages/master-policy-detail/MasterPolicyDetailPage.tsx
git commit -m "refactor(master-policy-detail): consume shared insurance module"
```

---

## Task 4: Create the Claim File Detail mock data

**Files:**
- Create: `src/pages/claim-file-detail/claim-file-detail-mock.ts`

- [ ] **Step 1: Create the mock data file**

Create `src/pages/claim-file-detail/claim-file-detail-mock.ts`. Values for `id '1'` mirror the claim-files list row `id '1'` and design image 01. Items marked `// VERIFY vs design` are best-effort for low-res areas (spec §8) and confirmed in Task 8.

```ts
import type { InfoItem } from './components/InfoTable'
import type { PaymentRow } from './components/PaymentTable'
import type { BenefitRow, AccumulationTrip } from '../../components/insurance/types'
import { formatMoney } from '../../components/insurance/format'

export interface ClaimFileDetail {
  id: string
  masterPolicyNumber: string // Chọn Hợp đồng nguyên tắc (select value)
  status: string // Trạng thái Hồ sơ bồi thường (select value)
  insured: InfoItem[]
  beneficiary: InfoItem[]
  accident: InfoItem[]
  attachments: string[] // Tải ảnh kèm — display-only thumbnails
  benefits: BenefitRow[]
  payments: PaymentRow[]
  trips: AccumulationTrip[]
}

// HĐNT select options — '24/PM-GSM/013203' is from the design; others are
// plausible fillers so the select is functional (UI-only, no API).
export const masterPolicyOptions = [
  { value: '24/PM-GSM/013203', label: '24/PM-GSM/013203' },
  { value: '25/PM-GSM/3854282', label: '25/PM-GSM/3854282' },
  { value: '24/PC-GSM/028080', label: '24/PC-GSM/028080' },
]

// Status options — 'Thanh toán bồi thường' is from the design; others are
// plausible fillers. // VERIFY vs design (exact option set unknown).
export const claimFileStatusOptions = [
  { value: 'tiep-nhan', label: 'Tiếp nhận hồ sơ' },
  { value: 'tham-dinh', label: 'Thẩm định bồi thường' },
  { value: 'thanh-toan', label: 'Thanh toán bồi thường' },
  { value: 'hoan-thanh', label: 'Hoàn thành' },
]

function money(n: number): string {
  return `${formatMoney(n)} đ`
}

// 4 standard benefit lines (same metadata as master-policy-detail).
// VERIFY vs design (images 02/03) for exact amounts on this claim.
const benefits: BenefitRow[] = [
  { key: 'death', name: 'Tử vong do tai nạn', hanMuc: money(20000000), daChiTra: money(0), uocBoiThuong: money(0), hanMucConLai: money(20000000) },
  { key: 'disability', name: 'Thương tật toàn bộ vĩnh viễn do tai nạn', hanMuc: money(20000000), daChiTra: money(0), uocBoiThuong: money(0), hanMucConLai: money(20000000) },
  {
    key: 'hospital',
    name: 'Trợ cấp nằm viện do tai nạn',
    sub: 'Chi trả trợ cấp nằm viện do Tai nạn từ trọn 2 ngày trở lên',
    hanMuc: money(1500000), daChiTra: money(1500000), uocBoiThuong: money(0), hanMucConLai: money(0),
  },
  {
    key: 'medical',
    name: 'Chi phí y tế do tai nạn',
    sub: 'Chỉ chi trả các CPYT phát sinh trong thời hạn BH',
    hanMuc: money(15000000), daChiTra: money(16232506), uocBoiThuong: money(0), hanMucConLai: money(0),
  },
]

// "Bảng thanh toán bồi thường". // VERIFY vs design (image 02) — exact columns
// unreadable in screenshot; see PaymentTable for the column set.
const payments: PaymentRow[] = [
  { key: 'p1', benefit: 'Trợ cấp nằm viện do tai nạn', requested: money(1500000), approved: money(1500000), note: null },
  { key: 'p2', benefit: 'Chi phí y tế do tai nạn', requested: money(16232506), approved: money(16232506), note: null },
]

const trips: AccumulationTrip[] = [
  {
    id: 't1',
    gsmTripId: '01KTM096HKQ98CG7ZTZWC8NJM0',
    transferContractNo: '24/PM-GSM/013203/000012',
    completedAt: '2025-11-14T08:12:03',
    effectiveStart: '2025-11-14T08:12:03',
    effectiveEnd: '2026-05-13T08:12:02',
    sumInsured: 250000,
    benefits,
  },
  {
    id: 't2',
    gsmTripId: '01KTM23ECWFBJT4P34KBTNJN4P',
    transferContractNo: '24/PM-GSM/013203/000024',
    completedAt: '2025-11-14T09:30:41',
    effectiveStart: '2025-11-14T09:30:41',
    effectiveEnd: '2026-05-13T09:30:40',
    sumInsured: 250000,
    benefits,
  },
]

// Mirrors claim-files list row id '1' (src/pages/claim-files/mock-data.ts) + image 01.
const defaultDetail: ClaimFileDetail = {
  id: '1',
  masterPolicyNumber: '24/PM-GSM/013203',
  status: 'thanh-toan',
  insured: [
    { label: 'Mã Tài xế GSM', value: '3000000761' },
    { label: 'Họ và tên', value: 'Phạm Minh Hòa' },
    { label: 'Giới tính', value: 'Nam' },
    { label: 'Số CMND/CCCD/ Hộ chiếu', value: null },
    { label: 'Ngày sinh', value: null },
    { label: 'Số điện thoại', value: '+84343868396' },
    { label: 'Email', value: null },
    { label: 'Số điện thoại sử dụng Zalo', value: null },
  ],
  beneficiary: [
    { label: 'Người thụ hưởng', value: 'PHẠM MINH HOÀ' },
    { label: 'Số tài khoản', value: '925951661995' },
    { label: 'Ngân hàng', value: 'TECHCOMBANK' },
    { label: 'Địa chỉ ngân hàng', value: null },
  ],
  // VERIFY vs design (image 02): field list/labels are low-res. Best-effort below.
  accident: [
    { label: 'Ngày tai nạn', value: '14/11/2025' },
    { label: 'Nơi xảy ra tai nạn', value: null },
    { label: 'Ngày khám bệnh', value: null },
    { label: 'Ngày nhập viện', value: null },
    { label: 'Nơi điều trị', value: null },
    { label: 'Nguyên nhân / Chẩn đoán về tai nạn', value: null },
    { label: 'Hậu quả', value: null },
    { label: 'Hình thức điều trị', value: null },
  ],
  attachments: [],
  benefits,
  payments,
  trips,
}

// Mock lookup: any id returns the single mock record (UI-only, no API).
export function findClaimFileDetail(_id?: string): ClaimFileDetail {
  return defaultDetail
}
```

- [ ] **Step 2: Verify it compiles**

Run: `yarn build`
Expected: FAIL — `./components/InfoTable` and `./components/PaymentTable` don't exist yet (created in Tasks 5 & 6). This is expected; the type imports resolve after those tasks. Proceed.

- [ ] **Step 3: Commit**

```bash
git add src/pages/claim-file-detail/claim-file-detail-mock.ts
git commit -m "feat(claim-file-detail): add mock data"
```

---

## Task 5: Create the `InfoTable` component

**Files:**
- Create: `src/pages/claim-file-detail/components/InfoTable.tsx`

- [ ] **Step 1: Create the component**

Create `src/pages/claim-file-detail/components/InfoTable.tsx`. Bordered rows, gray label column (260px) + value cell, `–` for blanks (matches the design's read-only "Descriptions" look):

```tsx
export interface InfoItem {
  label: string
  value: string | null
}

interface InfoTableProps {
  items: InfoItem[]
}

export function InfoTable({ items }: InfoTableProps) {
  return (
    <div className="overflow-hidden rounded-md border border-gray-200">
      {items.map((item, index) => (
        <div key={item.label} className={`flex ${index > 0 ? 'border-t border-gray-200' : ''}`}>
          <div className="w-[260px] shrink-0 border-r border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-600">
            {item.label}
          </div>
          <div className="flex-1 px-4 py-2.5 text-sm text-gray-800">{item.value ?? '–'}</div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Verify type-only usage resolves**

Run: `yarn build`
Expected: still FAIL only on the missing `./components/PaymentTable` import in the mock file (InfoTable now resolves). Proceed.

- [ ] **Step 3: Commit**

```bash
git add src/pages/claim-file-detail/components/InfoTable.tsx
git commit -m "feat(claim-file-detail): add read-only InfoTable"
```

---

## Task 6: Create the `PaymentTable` component

**Files:**
- Create: `src/pages/claim-file-detail/components/PaymentTable.tsx`

- [ ] **Step 1: Create the component**

Create `src/pages/claim-file-detail/components/PaymentTable.tsx`. Columns are best-effort (spec §8b — unreadable in screenshot) and flagged for verification:

```tsx
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'

export interface PaymentRow {
  key: string
  benefit: string // Quyền lợi bảo hiểm
  requested: string | null // Số tiền yêu cầu
  approved: string | null // Số tiền bồi thường
  note?: string | null // Ghi chú
}

const renderDash = (value: string | null | undefined) => value ?? '-'

// VERIFY vs design (image 02): exact column headers are low-res. Best-effort set.
const PAYMENT_COLUMNS: ColumnsType<PaymentRow> = [
  { title: 'STT', key: 'stt', width: 60, align: 'center', render: (_v, _row, index) => index + 1 },
  { title: 'QUYỀN LỢI BẢO HIỂM', dataIndex: 'benefit', key: 'benefit' },
  { title: 'SỐ TIỀN YÊU CẦU', dataIndex: 'requested', key: 'requested', align: 'right', render: renderDash },
  { title: 'SỐ TIỀN BỒI THƯỜNG', dataIndex: 'approved', key: 'approved', align: 'right', render: renderDash },
  { title: 'GHI CHÚ', dataIndex: 'note', key: 'note', render: renderDash },
]

interface PaymentTableProps {
  rows: PaymentRow[]
}

export function PaymentTable({ rows }: PaymentTableProps) {
  return (
    <Table<PaymentRow>
      rowKey="key"
      columns={PAYMENT_COLUMNS}
      dataSource={rows}
      pagination={false}
      size="middle"
    />
  )
}
```

- [ ] **Step 2: Verify the mock file now compiles**

Run: `yarn build`
Expected: PASS for the mock + components (the page itself is created next; nothing imports the page yet, so build succeeds).

- [ ] **Step 3: Lint**

Run: `yarn lint`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/pages/claim-file-detail/components/PaymentTable.tsx
git commit -m "feat(claim-file-detail): add PaymentTable"
```

---

## Task 7: Create the page and wire the route

**Files:**
- Create: `src/pages/claim-file-detail/ClaimFileDetailPage.tsx`
- Modify: `src/app/router.tsx`

- [ ] **Step 1: Create the page component**

Create `src/pages/claim-file-detail/ClaimFileDetailPage.tsx`:

```tsx
import { useState } from 'react'
import { Breadcrumb, Col, Collapse, Form, Row, Select } from 'antd'
import { useParams } from 'react-router-dom'
import { InfoTable } from './components/InfoTable'
import { PaymentTable } from './components/PaymentTable'
import { BenefitTable } from '../../components/insurance/BenefitTable'
import { AccumulationTable } from '../../components/insurance/AccumulationTable'
import {
  claimFileStatusOptions,
  findClaimFileDetail,
  masterPolicyOptions,
} from './claim-file-detail-mock'

export function ClaimFileDetailPage() {
  const { id } = useParams<{ id: string }>()
  const detail = findClaimFileDetail(id)
  const [masterPolicy, setMasterPolicy] = useState(detail.masterPolicyNumber)
  const [status, setStatus] = useState(detail.status)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Breadcrumb
          items={[
            { title: 'Hồ sơ bồi thường' },
            { title: 'Bảo hiểm tích lũy tài xế' },
            { title: 'Chỉnh sửa hồ sơ bồi thường' },
          ]}
        />
        <h1 className="text-xl font-semibold text-gray-800">Chỉnh sửa hồ sơ bồi thường</h1>
      </div>

      <div className="flex flex-col gap-8 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <Form layout="vertical" requiredMark>
          <Row gutter={[16, 0]}>
            <Col xs={24}>
              <Form.Item label="Chọn Hợp đồng nguyên tắc" required>
                <Select
                  value={masterPolicy}
                  onChange={setMasterPolicy}
                  options={masterPolicyOptions}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item label="Trạng thái Hồ sơ bồi thường" required className="mb-0">
                <Select value={status} onChange={setStatus} options={claimFileStatusOptions} />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Collapse
          defaultActiveKey={['ycbt']}
          items={[
            {
              key: 'ycbt',
              label: <span className="font-semibold text-gray-800">Thông tin yêu cầu bồi thường</span>,
              children: (
                <div className="flex flex-col gap-8">
                  <section>
                    <h2 className="mb-4 text-base font-semibold text-gray-800">
                      Thông tin người được bảo hiểm
                    </h2>
                    <InfoTable items={detail.insured} />
                  </section>
                  <section>
                    <h2 className="mb-4 text-base font-semibold text-gray-800">
                      Thông tin người thụ hưởng
                    </h2>
                    <InfoTable items={detail.beneficiary} />
                  </section>
                  <section>
                    <h2 className="mb-4 text-base font-semibold text-gray-800">
                      Thông tin về tai nạn và khám chữa
                    </h2>
                    <InfoTable items={detail.accident} />
                  </section>
                </div>
              ),
            },
          ]}
        />

        <section>
          <h2 className="mb-4 text-base font-semibold text-gray-800">Bảng Quyền lợi bảo hiểm</h2>
          <BenefitTable rows={detail.benefits} />
        </section>

        <section>
          <h2 className="mb-4 text-base font-semibold text-gray-800">Bảng thanh toán bồi thường</h2>
          <PaymentTable rows={detail.payments} />
        </section>

        <AccumulationTable trips={detail.trips} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Wire the route**

In `src/app/router.tsx`:

Add the import after the existing `ClaimFilesListPage` import (currently line 16):

```tsx
import { ClaimFileDetailPage } from '../pages/claim-file-detail/ClaimFileDetailPage'
```

Replace this route element:

```tsx
      {
        path: 'ho-so-boi-thuong/bao-hiem-tich-luy-tai-xe/:id',
        element: <PlaceholderPage title="Chi tiết hồ sơ bồi thường" />,
      },
```

with:

```tsx
      {
        path: 'ho-so-boi-thuong/bao-hiem-tich-luy-tai-xe/:id',
        element: <ClaimFileDetailPage />,
      },
```

(Leave the `PlaceholderPage` import — it is still used by other routes.)

- [ ] **Step 3: Verify the build passes**

Run: `yarn build`
Expected: PASS.

- [ ] **Step 4: Lint**

Run: `yarn lint`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/claim-file-detail/ClaimFileDetailPage.tsx src/app/router.tsx
git commit -m "feat(claim-file-detail): add detail page and wire route"
```

---

## Task 8: Visual verification + label confirmation

**Files:** none (verification only; corrective edits committed if needed).

- [ ] **Step 1: Start the dev server**

Run: `yarn dev`
Expected: Vite serves on a local URL (e.g. `http://localhost:5173`).

- [ ] **Step 2: Open the detail page in the browser at 1440px**

Navigate (Playwright MCP, or manually) to:
`http://localhost:5173/ho-so-boi-thuong/bao-hiem-tich-luy-tai-xe/1`
Resize the viewport to **1440 × 900**.

- [ ] **Step 3: Confirm structure renders**

Verify against `docs/ui/claim-file-detail-01.png`, `-02.png`, `-03.png`:
- Breadcrumb + title `Chỉnh sửa hồ sơ bồi thường`
- Two selects show `24/PM-GSM/013203` and `Thanh toán bồi thường`, and are clickable/changeable
- Collapsible `Thông tin yêu cầu bồi thường` (expanded) with three read-only `InfoTable`s
- Insured/beneficiary values match image 01 (e.g. `3000000761`, `Phạm Minh Hòa`, `925951661995`, `TECHCOMBANK`)
- Three tables render: `Bảng Quyền lợi bảo hiểm`, `Bảng thanh toán bồi thường`, and the GSM trips table

- [ ] **Step 4: Reconcile the low-res items (spec §8) against the screenshots**

Open `docs/ui/claim-file-detail-02.png` and `-03.png` and compare to the rendered page:
- **(a)** Accident-info field labels — fix the `accident` array in `claim-file-detail-mock.ts` if they differ.
- **(b)** Payment-table column headers — fix `PAYMENT_COLUMNS` in `PaymentTable.tsx` if they differ.
- **(c)** Trips-table header labels (`ID chuyến đi GSM` vs `ID chuyến xe GSM`; `STMĐ chuyến` vs `STBH/ chuyến`) and whether rows expand. If the design differs from the shared `AccumulationTable` defaults, prefer passing a `title` prop and/or note the divergence for a follow-up (do not change master-policy-detail's behavior). If still ambiguous, ask the user.

If any corrections were made, re-run `yarn build` + `yarn lint`, then:

```bash
git add -A
git commit -m "fix(claim-file-detail): match labels to design screenshots"
```

- [ ] **Step 5: Take a verification screenshot**

Capture a full-page screenshot of the rendered detail page for the record. Stop the dev server when done.

---

## Self-Review (completed by plan author)

**Spec coverage:**
- §2 interaction model (2 selects, read-only, no buttons) → Task 7 page.
- §3 mock continuity (id '1' mirrors list row) → Task 4 mock.
- §4 reuse strategy (extract shared tables) → Tasks 1–3.
- §5 file structure → Tasks 1–7 create exactly those files.
- §6 composition (header, selects, collapse, 3 info tables, 3 tables) → Task 7.
- §7 routing (replace PlaceholderPage) → Task 7 Step 2.
- §8 open items → Task 8 Step 4 reconciles each.
- §9 testing (Playwright visual, no unit tests) → Task 8.

**Placeholder scan:** No "TBD/TODO" left as work-deferral; `// VERIFY vs design` markers are deliberate, each resolved in Task 8 Step 4 with the exact source image named.

**Type consistency:** `InfoItem` defined in `InfoTable.tsx`, imported by mock. `PaymentRow` defined in `PaymentTable.tsx`, imported by mock. `BenefitRow`/`AccumulationTrip` defined once in `components/insurance/types.ts`, imported by shared tables, master-policy mock, and claim-file mock. `findClaimFileDetail`, `masterPolicyOptions`, `claimFileStatusOptions` names match between Task 4 (definition) and Task 7 (usage). `AccumulationTable` `title?` prop added in Task 2, defaulted so Task 3 (master-policy) needs no change.
