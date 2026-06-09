import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  FileProtectOutlined,
  FileTextOutlined,
  SolutionOutlined,
  FolderOpenOutlined,
  FileDoneOutlined,
  SettingOutlined,
  SearchOutlined,
  BarChartOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'

const items: MenuProps['items'] = [
  { key: '/', icon: <AppstoreOutlined />, label: 'Bảng điều khiển' },
  { key: 'muc-luc', icon: <UnorderedListOutlined />, label: 'Mục lục', children: [] },
  {
    key: 'don-bao-hiem',
    icon: <FileProtectOutlined />,
    label: 'Đơn bảo hiểm',
    children: [
      { key: '/don-bao-hiem/tat-ca', label: 'Tất cả Đơn bảo hiểm' },
      { key: '/don-bao-hiem/tai-nan-hanh-khach-theo-chuyen', label: 'Tai nạn hành khách theo chuyến' },
      { key: '/don-bao-hiem/bao-hiem-hang-hoa', label: 'Bảo hiểm hàng hoá' },
      { key: '/don-bao-hiem/bao-hiem-tich-luy-tai-xe', label: 'Bảo hiểm tích lũy tài xế' },
      { key: '/don-bao-hiem/bao-hiem-foodcare', label: 'Bảo hiểm FoodCare' },
    ],
  },
  {
    key: 'hop-dong',
    icon: <FileTextOutlined />,
    label: 'Hợp đồng nguyên tắc',
    children: [
      {
        key: '/hop-dong-nguyen-tac/bao-hiem-tich-luy-tai-xe',
        label: 'Bảo hiểm tích luỹ tài xế',
      },
    ],
  },
  {
    key: 'yeu-cau-boi-thuong',
    icon: <SolutionOutlined />,
    label: 'Yêu cầu bồi thường',
    children: [
      {
        key: '/yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe',
        label: 'Bảo hiểm tích lũy tài xế',
      },
    ],
  },
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
  { key: '/yeu-cau-hoa-don', icon: <FileDoneOutlined />, label: 'Yêu cầu hoá đơn' },
  { key: 'quan-tri', icon: <SettingOutlined />, label: 'Quản trị', children: [] },
  { key: '/tra-cuu-gsm', icon: <SearchOutlined />, label: 'Tra cứu GSM PPT' },
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
  { key: '/cai-dat-tai-khoan', icon: <UserOutlined />, label: 'Cài đặt tài khoản' },
]

export function SidebarNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key.startsWith('/')) navigate(key)
  }

  return (
    <Menu
      mode="inline"
      items={items}
      selectedKeys={[pathname]}
      defaultOpenKeys={['don-bao-hiem', 'hop-dong', 'yeu-cau-boi-thuong', 'ho-so-boi-thuong', 'bao-cao-power-bi']}
      onClick={onClick}
      className="h-full border-r-0"
    />
  )
}
