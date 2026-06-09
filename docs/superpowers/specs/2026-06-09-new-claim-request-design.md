# New Claim Request Page — Design Spec

**Date:** 2026-06-09
**Feature:** `Thêm yêu cầu bồi thường` (New Claim Request form) for `Bảo hiểm tích luỹ tài xế`
**Scope:** UI + mock data only. **No API** (no fetch/axios; Save is client-side only).
**Source of truth:** `docs/ui/new-claim-request-ppt-01.png`, `docs/ui/new-claim-request-ppt-02.png`

Governed by `docs/rules/ui-ux-strict.md`: labels, placeholders, section order, grid, and required-marks are copied pixel-exact from the screenshots. No invented fields or conditional logic.

---

## 1. Route & entry point

- Replace the existing `PlaceholderPage` at route
  `yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe/them-moi` (in `src/app/router.tsx`)
  with `<NewClaimRequestPage />`.
- The list page's **Thêm mới** button already navigates to this route — no toolbar change needed.

## 2. File layout

Feature-folder convention, mirroring `src/pages/master-policy-detail/`. Under `src/pages/claim-requests/`:

```
new-claim-request/
├── NewClaimRequestPage.tsx        # page shell: breadcrumb + title + <Form> + sections + footer buttons
├── new-claim-request-form.ts      # non-component exports: types, option lists, initialValues, mock customers
└── components/
    ├── GeneralInfoSection.tsx      # Thông tin chung
    ├── InsuredPersonSection.tsx    # Thông tin về người được bảo hiểm (+ customer autofill)
    ├── AccidentInfoSection.tsx     # Thông tin về tai nạn và khám chữa
    ├── ClaimAmountSection.tsx      # Nội dung yêu cầu chi trả bảo hiểm
    └── BeneficiarySection.tsx      # Thông tin người thụ hưởng (+ Upload.Dragger)
```

Non-component exports (types, options, `initialValues`, mock customers) live in
`new-claim-request-form.ts` so all `.tsx` files export only components
(passes `eslint-plugin-react-refresh` / `react-refresh/only-export-components`).

## 3. Page shell

Matches the existing detail/list pages:

- `<Breadcrumb>` items: `Yêu cầu bồi thường` / `Bảo hiểm tích luỹ tài xế` / `Thêm yêu cầu bồi thường`
- `<h1 className="text-xl font-semibold text-gray-800">Thêm yêu cầu bồi thường</h1>`
- One white card: `rounded-lg border border-gray-100 bg-white p-6 shadow-sm`,
  containing a single AntD `<Form form={form} layout="vertical" requiredMark initialValues={initialValues} onFinish={handleSave}>`.
- Sections separated by bold sub-headings (`text-base font-semibold text-gray-800`).
- Grid via AntD `<Row gutter={[16, 0]}>` + `<Col>` (24-col system).

## 4. Sections & fields

Placeholders quoted verbatim. `*` = required (AntD `rules: [{ required: true }]` + required mark).

### 4.1 Thông tin chung
| Label | Control | Placeholder | Width | Req |
|---|---|---|---|---|
| Nguồn tiếp nhận | Select | Vui lòng chọn nguồn tiếp nhận | `md={8}` | ✅ |

### 4.2 Thông tin về người được bảo hiểm
| Label | Control | Placeholder | Width | Req |
|---|---|---|---|---|
| Tìm thông tin khách hàng | Select (showSearch) | Nhập số hợp đồng nguyên tắc, số điện thoại hoặc mã tài xế GSM để tìm kiếm | `md={24}` | ✅ |
| Mã Tài xế GSM | Input | Vui lòng nhập Mã Tài xế GSM | `md={8}` | ✅ |
| Họ và tên | Input | Vui lòng nhập Họ và tên | `md={8}` | ✅ |
| Giới tính | Select | Vui lòng chọn Giới tính | `md={8}` | — |
| Số CMND/ CCCD/ Hộ chiếu | **Read-only display** (`-` until filled) | — | `md={8}` | — |
| Ngày sinh | **Read-only display** (`-` until filled) | — | `md={8}` | — |
| Số điện thoại | Input | Vui lòng nhập Số điện thoại | `md={8}` | ✅ |
| Email | Input | Nhập Email | `md={12}` | — |
| Số điện thoại sử dụng Zalo | Input | Nhập Số điện thoại sử dụng Zalo | `md={12}` | — |

**Customer autofill:** `Tìm thông tin khách hàng` options come from local mock customers
in `new-claim-request-form.ts`. On select, populate Mã Tài xế GSM, Họ và tên, Giới tính,
Số CMND/ CCCD/ Hộ chiếu, Ngày sinh, Số điện thoại, Email, Số điện thoại sử dụng Zalo via
`form.setFieldsValue(...)`. The two read-only fields (Số CMND, Ngày sinh) render the
selected customer's value, or `-` when no customer is selected.

### 4.3 Thông tin về tai nạn và khám chữa (all rows 2-col, `md={12}`)
| Label | Control | Placeholder | Req |
|---|---|---|---|
| Ngày tai nạn | DatePicker | Vui lòng chọn ngày tai nạn | ✅ |
| Nơi xảy ra tai nạn | Input | Vui lòng nhập nơi xảy ra tai nạn | ✅ |
| Ngày khám bệnh | DatePicker | Vui lòng chọn ngày khám bệnh | ✅ |
| Ngày nhập viện | DatePicker | Vui lòng chọn ngày nhập viện | — |
| Nơi điều trị | Input | Vui lòng nhập nơi điều trị | — |
| Nguyên nhân / Chẩn đoán về tai nạn | Input | Vui lòng nhập nguyên nhân / chẩn đoán về tai nạn | ✅ |
| Hậu quả | Input | Vui lòng nhập hậu quả | ✅ |
| Hình thức điều trị | Radio.Group | Ngoại trú / Nội trú | ✅ |
| Từ ngày | DatePicker | Vui lòng chọn ngày bắt đầu | — |
| Đến ngày | DatePicker | Vui lòng chọn ngày kết thúc | — |

**Từ ngày / Đến ngày are ALWAYS visible — no conditional reveal.** Both screenshots
show them rendered unconditionally; per ui-ux-strict we do not invent toggle logic.

### 4.4 Nội dung yêu cầu chi trả bảo hiểm (2-col)
| Label | Control | Placeholder | Req |
|---|---|---|---|
| Tổng số tiền yêu cầu chi trả | InputNumber (`đ` suffix, thousand separators) | Vui lòng nhập tổng số tiền yêu cầu chi trả | ✅ |
| Chi trả bảo hiểm cho trường hợp | Checkbox.Group | Tử vong · Thương tật vĩnh viễn · Chi phí y tế · Trợ cấp nằm viện | — |

### 4.5 Thông tin người thụ hưởng
| Label | Control | Placeholder | Width | Req |
|---|---|---|---|---|
| Người thụ hưởng | Input | Vui lòng nhập tên người thụ hưởng | `md={12}` | ✅ |
| Số tài khoản | Input | Vui lòng nhập số tài khoản | `md={12}` | ✅ |
| Ngân hàng | Input | Vui lòng nhập tên ngân hàng | `md={12}` | ✅ |
| Địa chỉ ngân hàng | Input | Vui lòng nhập địa chỉ ngân hàng | `md={12}` | — |
| Tài liệu đính kèm | `Upload.Dragger` | "Nhấn để tải lên hoặc kéo thả vào đây" + hint "Định dạng: PNG, JPG, JPEG, PDF, DOCX, XLSX, MP4" | `md={24}` | — |

`Upload.Dragger` uses `beforeUpload={() => false}` (no real upload); icon = inbox icon
matching the design.

## 5. Footer buttons
- `Làm lại` — default button → `form.resetFields()`.
- `Lưu` — primary button (`htmlType="submit"`) → AntD validation → `message.success('...')`
  → `navigate('/yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe')`.

## 6. Mock data (`new-claim-request-form.ts`)
- `receivingSourceOptions` — Select options for Nguồn tiếp nhận (a few plausible Vietnamese values).
- `genderOptions` — `Nam` / `Nữ` / `Khác`.
- `claimCaseOptions` — checkbox options: Tử vong, Thương tật vĩnh viễn, Chi phí y tế, Trợ cấp nằm viện.
- `mockCustomers` — 3–4 records, each with: search label, driverCode, fullName, gender,
  idNumber, dob, phone, email, zalo. Drives the `Tìm thông tin khách hàng` options + autofill.
- `NewClaimRequestForm` type + `initialValues`.

## 7. Out of scope
- No API / network calls.
- No real file persistence.
- No backend validation; client-side AntD validation only.
- Update / detail / Giấy YCBT pages (separate routes) are NOT part of this work.

## 8. Verification
- App builds / lint clean (react-refresh rule passes).
- Navigate from claim-requests list **Thêm mới** → form renders all sections matching the screenshots.
- Selecting a mock customer autofills insured-person fields incl. read-only Số CMND / Ngày sinh.
- Submitting empty form shows required-field errors on the starred fields only.
- Filling required fields + Lưu → success toast + back to list. Làm lại resets.
