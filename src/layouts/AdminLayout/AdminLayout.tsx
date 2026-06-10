import { Layout } from 'antd'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Topbar } from './Topbar'
import { SidebarNav } from './SidebarNav'

const { Header, Sider, Content } = Layout

const SIDER_WIDTH = 240
const SIDER_COLLAPSED_WIDTH = 80

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const siderWidth = collapsed ? SIDER_COLLAPSED_WIDTH : SIDER_WIDTH

  return (
    <Layout className="min-h-screen">
      <Sider
        width={SIDER_WIDTH}
        collapsedWidth={SIDER_COLLAPSED_WIDTH}
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        className="shadow-sm"
        style={{
          position: 'fixed',
          insetInlineStart: 0,
          top: 0,
          bottom: 0,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <SidebarNav />
      </Sider>
      <Layout
        style={{ marginInlineStart: siderWidth, transition: 'margin-inline-start 0.2s' }}
      >
        <Header className="sticky top-0 z-20 px-0 shadow-sm">
          <Topbar />
        </Header>
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
