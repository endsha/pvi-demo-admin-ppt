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
    ],
  },
])
