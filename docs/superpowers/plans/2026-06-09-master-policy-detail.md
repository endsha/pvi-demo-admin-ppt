# Master Policy Detail Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the "Xem Hợp đồng nguyên tắc" master-policy detail page (UI + mock data only) matching `docs/ui/master-policy-detail-01/02/03.png`.

**Architecture:** A new feature folder `src/pages/master-policy-detail/` with a page component composing three sections (general info, master benefits table, expandable accumulation table). A reusable `BenefitTable` renders the 5-column benefits table both at master level (dashes) and inside each expanded trip row (numbers). Reached via a new `react-router-dom` route `:id`, navigated to from the existing master-policies list row.

**Tech Stack:** React 19, TypeScript, Ant Design v6, Tailwind v4, `react-router-dom` v7, Vite.

> **Testing note:** This repo has no unit-test runner (no vitest/jest, no test files). Per project convention, YAGNI, and the approved spec ("render smoke check only"), this plan does **not** add a test framework. Verification per task is `npx tsc -b` (typecheck) + `yarn lint`; final verification is `yarn build` + a Playwright visual comparison against the three design PNGs.

**Spec:** `docs/superpowers/specs/2026-06-09-master-policy-detail-design.md`

---

## File Structure

- Create: `src/pages/master-policy-detail/mock-data.ts` — types, formatters, mock detail record (Task 1)
- Create: `src/pages/master-policy-detail/components/BenefitTable.tsx` — reusable 5-col benefits table (Task 2)
- Create: `src/pages/master-policy-detail/components/GeneralInfoCard.tsx` — "Thông tin chung" grid (Task 3)
- Create: `src/pages/master-policy-detail/components/AccumulationTable.tsx` — expandable trips table (Task 4)
- Create: `src/pages/master-policy-detail/MasterPolicyDetailPage.tsx` — page composition (Task 5)
- Modify: `src/app/router.tsx` — register the detail route (Task 6)
- Modify: `src/pages/master-policies/components/MasterPoliciesTable.tsx` — wire row navigation (Task 6)
- Verify: `yarn build` + Playwright screenshots (Task 7)

---

## Task 1: Mock data, types, and formatters

**Files:**
- Create: `src/pages/master-policy-detail/mock-data.ts`

- [ ] **Step 1: Create the mock-data module**

Create `src/pages/master-policy-detail/mock-data.ts` with this exact content:

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

export interface MasterPolicyDetail {
  id: string
  driverCode: string // Mã Tài xế GSM
  fullName: string // Họ và tên
  dob: string | null // Ngày sinh
  idNumber: string | null // Số CMND/CCCD/Hộ chiếu
  gender: string // Giới tính
  contractNumber: string // Số hợp đồng nguyên tắc
  accumulationPeriod: string | null // STBH tích lũy trong thời gian
  benefits: BenefitRow[]
  trips: AccumulationTrip[]
}

export function formatMoney(n: number): string {
  return n.toLocaleString('vi-VN') // 250.000
}

export function formatDateTimeSeconds(iso: string): string {
  const d = new Date(iso)
  const pad = (x: number) => String(x).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function money(n: number): string {
  return `${formatMoney(n)} đ`
}

// Shared benefit name/sub metadata, in display order.
const BENEFIT_META: Array<{ key: string; name: string; sub?: string }> = [
  { key: 'death', name: 'Tử vong do tai nạn' },
  { key: 'disability', name: 'Thương tật toàn bộ vĩnh viễn do tai nạn' },
  {
    key: 'hospital',
    name: 'Trợ cấp nằm viện do tai nạn',
    sub: 'Chi trả trợ cấp nằm viện do Tai nạn từ trọn 2 ngày trở lên',
  },
  {
    key: 'medical',
    name: 'Chi phí y tế do tai nạn',
    sub: 'Chỉ chi trả các CPYT phát sinh trong thời hạn BH',
  },
]

// Master-level table: all dashes except the hospital row's HẠN MỨC BẢO HIỂM text.
const MASTER_HAN_MUC: Record<string, string | null> = {
  death: null,
  disability: null,
  hospital:
    'Tối đa mỗi đợt nằm viện VND 1.500.000 đối với tài xế xe máy & VND 3.000.000 đối với tài xế ô tô',
  medical: null,
}

const masterBenefits: BenefitRow[] = BENEFIT_META.map((m) => ({
  ...m,
  hanMuc: MASTER_HAN_MUC[m.key],
  daChiTra: null,
  uocBoiThuong: null,
  hanMucConLai: null,
}))

// Per-trip table: HẠN MỨC = HẠN MỨC CÒN LẠI = limit; ĐÃ CHI TRẢ = ƯỚC BỒI THƯỜNG = 0 đ.
function buildTripBenefits(limits: [number, number, number, number]): BenefitRow[] {
  return BENEFIT_META.map((m, i) => ({
    ...m,
    hanMuc: money(limits[i]),
    daChiTra: money(0),
    uocBoiThuong: money(0),
    hanMucConLai: money(limits[i]),
  }))
}

const TRIP_LIMITS: [number, number, number, number] = [250000, 250000, 15000, 15000]

export const masterPolicyDetail: MasterPolicyDetail = {
  id: '1',
  driverCode: '8000075529',
  fullName: 'Chu Xuân Hưởng',
  dob: null,
  idNumber: null,
  gender: 'Male',
  contractNumber: '26/PC-GSM/067426',
  accumulationPeriod: null,
  benefits: masterBenefits,
  trips: [
    {
      id: 't1',
      gsmTripId: '01KTM096HKQ98CG7ZTZWC8NJM0',
      transferContractNo: '26/PC-GSM/067426/000012',
      completedAt: '2026-06-08T23:48:14',
      effectiveStart: '2026-06-08T23:48:14',
      effectiveEnd: '2026-12-05T23:48:13',
      sumInsured: 250000,
      benefits: buildTripBenefits(TRIP_LIMITS),
    },
    {
      id: 't2',
      gsmTripId: '01KTM23ECWFBJT4P34KBTNJN4P',
      transferContractNo: '26/PC-GSM/067426/000024',
      completedAt: '2026-06-08T23:58:54',
      effectiveStart: '2026-06-08T23:58:54',
      effectiveEnd: '2026-12-05T23:58:53',
      sumInsured: 250000,
      benefits: buildTripBenefits(TRIP_LIMITS),
    },
  ],
}

// Mock lookup: any id returns the single mock record (UI-only, no API).
export function getMasterPolicyDetail(_id: string): MasterPolicyDetail {
  return masterPolicyDetail
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc -b`
Expected: completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/master-policy-detail/mock-data.ts
git commit -m "feat(master-policy-detail): add mock data, types, and formatters"
```

---

## Task 2: BenefitTable component

**Files:**
- Create: `src/pages/master-policy-detail/components/BenefitTable.tsx`

- [ ] **Step 1: Create the component**

Create `src/pages/master-policy-detail/components/BenefitTable.tsx`:

```tsx
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { BenefitRow } from '../mock-data'

const renderDash = (value: string | null) => value ?? '-'

interface BenefitTableProps {
  rows: BenefitRow[]
}

export function BenefitTable({ rows }: BenefitTableProps) {
  const columns: ColumnsType<BenefitRow> = [
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

  return (
    <Table<BenefitRow>
      rowKey="key"
      columns={columns}
      dataSource={rows}
      pagination={false}
      size="middle"
    />
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc -b`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/master-policy-detail/components/BenefitTable.tsx
git commit -m "feat(master-policy-detail): add reusable BenefitTable"
```

---

## Task 3: GeneralInfoCard component

**Files:**
- Create: `src/pages/master-policy-detail/components/GeneralInfoCard.tsx`

- [ ] **Step 1: Create the component**

Create `src/pages/master-policy-detail/components/GeneralInfoCard.tsx`:

```tsx
import type { MasterPolicyDetail } from '../mock-data'

function InfoField({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm text-gray-800">{value ?? '-'}</span>
    </div>
  )
}

interface GeneralInfoCardProps {
  detail: MasterPolicyDetail
}

export function GeneralInfoCard({ detail }: GeneralInfoCardProps) {
  return (
    <section>
      <h2 className="mb-4 text-base font-semibold text-gray-800">Thông tin chung</h2>
      <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
        <InfoField label="Mã Tài xế GSM" value={detail.driverCode} />
        <InfoField label="Họ và tên" value={detail.fullName} />
        <InfoField label="Ngày sinh" value={detail.dob} />
        <InfoField label="Số CMND/CCCD/Hộ chiếu" value={detail.idNumber} />
        <InfoField label="Giới tính" value={detail.gender} />
        <InfoField label="Số hợp đồng nguyên tắc" value={detail.contractNumber} />
        <InfoField label="STBH tích lũy trong thời gian" value={detail.accumulationPeriod} />
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc -b`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/master-policy-detail/components/GeneralInfoCard.tsx
git commit -m "feat(master-policy-detail): add GeneralInfoCard"
```

---

## Task 4: AccumulationTable component (expandable)

**Files:**
- Create: `src/pages/master-policy-detail/components/AccumulationTable.tsx`

- [ ] **Step 1: Create the component**

Create `src/pages/master-policy-detail/components/AccumulationTable.tsx`. The `SortCaret`
renders the design's non-interactive sort arrows (cosmetic only — no `sorter` is set, so
clicking does nothing):

```tsx
import { Table } from 'antd'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { BenefitTable } from './BenefitTable'
import { formatDateTimeSeconds, formatMoney, type AccumulationTrip } from '../mock-data'

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
}

export function AccumulationTable({ trips }: AccumulationTableProps) {
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
      <h2 className="mb-4 text-base font-semibold text-gray-800">Bảng Danh sách đơn tích luỹ</h2>
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

- [ ] **Step 2: Typecheck**

Run: `npx tsc -b`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/master-policy-detail/components/AccumulationTable.tsx
git commit -m "feat(master-policy-detail): add expandable AccumulationTable"
```

---

## Task 5: MasterPolicyDetailPage composition

**Files:**
- Create: `src/pages/master-policy-detail/MasterPolicyDetailPage.tsx`

- [ ] **Step 1: Create the page**

Create `src/pages/master-policy-detail/MasterPolicyDetailPage.tsx`:

```tsx
import { Breadcrumb } from 'antd'
import { useParams } from 'react-router-dom'
import { getMasterPolicyDetail } from './mock-data'
import { GeneralInfoCard } from './components/GeneralInfoCard'
import { BenefitTable } from './components/BenefitTable'
import { AccumulationTable } from './components/AccumulationTable'

export function MasterPolicyDetailPage() {
  const { id = '' } = useParams()
  const detail = getMasterPolicyDetail(id)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Breadcrumb
          items={[
            { title: 'Hợp đồng nguyên tắc' },
            { title: 'Bảo hiểm tích luỹ tài xế' },
            { title: 'Xem Hợp đồng nguyên tắc' },
          ]}
        />
        <h1 className="text-xl font-semibold text-gray-800">Xem Hợp đồng nguyên tắc</h1>
      </div>

      <div className="flex flex-col gap-8 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <GeneralInfoCard detail={detail} />
        <section>
          <h2 className="mb-4 text-base font-semibold text-gray-800">Bảng Quyền lợi bảo hiểm</h2>
          <BenefitTable rows={detail.benefits} />
        </section>
        <AccumulationTable trips={detail.trips} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc -b`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/master-policy-detail/MasterPolicyDetailPage.tsx
git commit -m "feat(master-policy-detail): compose detail page"
```

---

## Task 6: Register route + wire list navigation

**Files:**
- Modify: `src/app/router.tsx`
- Modify: `src/pages/master-policies/components/MasterPoliciesTable.tsx`

- [ ] **Step 1: Add the import in `src/app/router.tsx`**

After the existing `MasterPoliciesListPage` import (line 11), add:

```tsx
import { MasterPolicyDetailPage } from '../pages/master-policy-detail/MasterPolicyDetailPage'
```

- [ ] **Step 2: Register the detail route**

In `src/app/router.tsx`, immediately after the existing master-policies list route object
(the one with path `'hop-dong-nguyen-tac/bao-hiem-tich-luy-tai-xe'`), add a sibling entry:

```tsx
      {
        path: 'hop-dong-nguyen-tac/bao-hiem-tich-luy-tai-xe/:id',
        element: <MasterPolicyDetailPage />,
      },
```

- [ ] **Step 3: Add navigation to the list table**

In `src/pages/master-policies/components/MasterPoliciesTable.tsx`:

(a) Add this import near the top with the other imports:

```tsx
import { useNavigate } from 'react-router-dom'
```

(b) Inside the `MasterPoliciesTable` component body, before `const columns`, add:

```tsx
  const navigate = useNavigate()
  const goToDetail = (id: string) =>
    navigate(`/hop-dong-nguyen-tac/bao-hiem-tich-luy-tai-xe/${id}`)
```

(c) Replace the `'link'` column `render` so the link navigates:

```tsx
    {
      title: 'Liên kết',
      key: 'link',
      render: (_v, row) => (
        <Button type="link" className="px-0" onClick={() => goToDetail(row.id)}>
          Xem hợp đồng nguyên tắc
        </Button>
      ),
    },
```

(d) Replace the `'action'` column `render` so the zoom button navigates:

```tsx
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      render: (_v, row) => (
        <Button type="primary" icon={<ZoomInOutlined />} onClick={() => goToDetail(row.id)} />
      ),
    },
```

- [ ] **Step 4: Typecheck and lint**

Run: `npx tsc -b && yarn lint`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/router.tsx src/pages/master-policies/components/MasterPoliciesTable.tsx
git commit -m "feat(master-policy-detail): register route and wire list navigation"
```

---

## Task 7: Build + visual verification

**Files:** none (verification only)

- [ ] **Step 1: Production build**

Run: `yarn build`
Expected: `tsc -b` and `vite build` both succeed with no errors.

- [ ] **Step 2: Start the dev server**

Run: `yarn dev` (note the local URL, typically `http://localhost:5173`).

- [ ] **Step 3: Visual check with Playwright**

Navigate to the master-policies list (`/hop-dong-nguyen-tac/bao-hiem-tich-luy-tai-xe`),
click a row's "Xem hợp đồng nguyên tắc" link, and confirm it lands on the detail page.
Resize to 1440px width and screenshot. Then expand a trip row and screenshot again.
Compare both against:
- `docs/ui/master-policy-detail-01.png` (general info + benefits)
- `docs/ui/master-policy-detail-02.png` (benefits + accumulation table)
- `docs/ui/master-policy-detail-03.png` (expanded trip row)

Check exactly: section headings and order, the 7 general-info labels/values, the 5 benefit
column headers, the hospital-row HẠN MỨC text + italic sub-lines, the 7 accumulation
columns, cosmetic sort carets on the 5 middle columns, expanded nested benefit numbers
(250.000 đ / 0 đ / 0 đ / 250.000 đ etc.), and the `1-2 trên 2 mặt hàng` footer.

- [ ] **Step 4: Fix any visual deltas**

Adjust spacing/alignment/card boundaries only as needed to match the PNGs, re-running
`npx tsc -b` after edits. Commit any fixes:

```bash
git add -A
git commit -m "fix(master-policy-detail): align UI with design screenshots"
```

---

## Self-Review (completed during planning)

- **Spec coverage:** page title/breadcrumb (Task 5) ✓; Thông tin chung 7 fields (Tasks 1,3) ✓; Bảng Quyền lợi bảo hiểm 5 cols + 4 rows + hospital text + sub-lines (Tasks 1,2,5) ✓; Bảng Danh sách đơn tích luỹ 7 cols + 2 rows + footer (Tasks 1,4) ✓; cosmetic sort arrows (Task 4) ✓; expandable nested benefit table with numbers (Tasks 1,2,4) ✓; routing + list navigation (Task 6) ✓; mock-only, no API ✓.
- **Placeholders:** none — every code step contains complete content.
- **Type consistency:** `BenefitRow`, `AccumulationTrip`, `MasterPolicyDetail`, `getMasterPolicyDetail`, `formatMoney`, `formatDateTimeSeconds` defined in Task 1 and used consistently in Tasks 2/4/5; `goToDetail` route string matches the Task 6 route path.
