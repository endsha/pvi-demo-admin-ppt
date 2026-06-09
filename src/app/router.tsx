import { createBrowserRouter } from 'react-router-dom'
import { AdminLayout } from '../layouts/AdminLayout/AdminLayout'
import { DashboardPage } from '../pages/dashboard/DashboardPage'
import { PlaceholderPage } from '../pages/placeholder/PlaceholderPage'
import { PoliciesListPage } from '../pages/policies/PoliciesListPage'
import { ReportsListPage } from '../pages/reports/ReportsListPage'
import { InvoiceRequestsListPage } from '../pages/invoice-requests/InvoiceRequestsListPage'
import { GsmSearchPage } from '../pages/gsm-search/GsmSearchPage'
import { AccountSettingsPage } from '../pages/account-settings/AccountSettingsPage'
import { DriverSavingsListPage } from '../pages/driver-savings/DriverSavingsListPage'
import { MasterPoliciesListPage } from '../pages/master-policies/MasterPoliciesListPage'
import { MasterPolicyDetailPage } from '../pages/master-policy-detail/MasterPolicyDetailPage'
import { ClaimRequestsListPage } from '../pages/claim-requests/ClaimRequestsListPage'
import { NewClaimRequestPage } from '../pages/claim-requests/new-claim-request/NewClaimRequestPage'
import { UpdateClaimRequestPage } from '../pages/claim-requests/update-claim-request/UpdateClaimRequestPage'
import { ClaimFilesListPage } from '../pages/claim-files/ClaimFilesListPage'
import { ClaimFileDetailPage } from '../pages/claim-file-detail/ClaimFileDetailPage'

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
      { path: 'don-bao-hiem/bao-hiem-tich-luy-tai-xe', element: <DriverSavingsListPage /> },
      { path: 'don-bao-hiem/bao-hiem-foodcare', element: <PlaceholderPage title="Bảo hiểm FoodCare" /> },
      { path: 'tra-cuu-gsm', element: <GsmSearchPage /> },
      { path: 'yeu-cau-hoa-don', element: <InvoiceRequestsListPage /> },
      { path: 'bao-cao-power-bi/quan-ly-bao-cao', element: <ReportsListPage /> },
      { path: 'bao-cao-power-bi/bao-cao-cong-khai', element: <PlaceholderPage title="Báo cáo công khai" /> },
      { path: 'bao-cao-power-bi/bao-cao-doanh-thu', element: <PlaceholderPage title="Báo cáo doanh thu" /> },
      { path: 'cai-dat-tai-khoan', element: <AccountSettingsPage /> },
      {
        path: 'hop-dong-nguyen-tac/bao-hiem-tich-luy-tai-xe',
        element: <MasterPoliciesListPage />,
      },
      {
        path: 'hop-dong-nguyen-tac/bao-hiem-tich-luy-tai-xe/:id',
        element: <MasterPolicyDetailPage />,
      },
      {
        path: 'yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe',
        element: <ClaimRequestsListPage />,
      },
      {
        path: 'yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe/them-moi',
        element: <NewClaimRequestPage />,
      },
      {
        path: 'yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe/:id/cap-nhat',
        element: <UpdateClaimRequestPage />,
      },
      {
        path: 'yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe/:id/giay-ycbt',
        element: <PlaceholderPage title="Giấy yêu cầu bồi thường" />,
      },
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
        element: <ClaimFileDetailPage />,
      },
    ],
  },
])
