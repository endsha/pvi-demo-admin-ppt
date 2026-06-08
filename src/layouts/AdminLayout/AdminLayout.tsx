import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import { Topbar } from './Topbar'
import { SidebarNav } from './SidebarNav'

const { Header, Sider, Content } = Layout

export function AdminLayout() {
  return (
    <Layout className="min-h-screen">
      <Header className="px-0 shadow-sm">
        <Topbar />
      </Header>
      <Layout>
        <Sider width={240} theme="light">
          <SidebarNav />
        </Sider>
        <Content className="p-6">
          <Outlet />
          <footer className="mt-8 text-center text-xs text-gray-400">
            Powered by PVI Digital
          </footer>
        </Content>
      </Layout>
    </Layout>
  )
}
