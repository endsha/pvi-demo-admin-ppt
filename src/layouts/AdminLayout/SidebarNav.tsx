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
  { key: 'don-bao-hiem', icon: <FileProtectOutlined />, label: 'Đơn bảo hiểm', children: [] },
  { key: 'hop-dong', icon: <FileTextOutlined />, label: 'Hợp đồng nguyên tắc', children: [] },
  { key: 'yeu-cau-boi-thuong', icon: <SolutionOutlined />, label: 'Yêu cầu bồi thường', children: [] },
  { key: 'ho-so-boi-thuong', icon: <FolderOpenOutlined />, label: 'Hồ sơ bồi thường', children: [] },
  { key: 'yeu-cau-hoa-don', icon: <FileDoneOutlined />, label: 'Yêu cầu hoá đơn', children: [] },
  { key: 'quan-tri', icon: <SettingOutlined />, label: 'Quản trị', children: [] },
  { key: '/tra-cuu-gsm', icon: <SearchOutlined />, label: 'Tra cứu GSM PPT' },
  { key: '/bao-cao-power-bi', icon: <BarChartOutlined />, label: 'Báo cáo Power BI' },
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
      onClick={onClick}
      className="h-full border-r-0"
    />
  )
}
