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
