import { createBrowserRouter } from 'react-router-dom'
import { AdminLayout } from '../layouts/AdminLayout/AdminLayout'
import { DashboardPage } from '../pages/dashboard/DashboardPage'
import { PlaceholderPage } from '../pages/placeholder/PlaceholderPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'tra-cuu-gsm', element: <PlaceholderPage title="Tra cứu GSM PPT" /> },
      { path: 'bao-cao-power-bi', element: <PlaceholderPage title="Báo cáo Power BI" /> },
      { path: 'cai-dat-tai-khoan', element: <PlaceholderPage title="Cài đặt tài khoản" /> },
    ],
  },
])
