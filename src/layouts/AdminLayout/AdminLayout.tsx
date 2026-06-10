import { Layout } from 'antd'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Topbar } from './Topbar'
import { SidebarNav } from './SidebarNav'
import { HEADER_HEIGHT } from '../../app/theme'

const { Header, Sider, Content } = Layout

const SIDER_WIDTH = 240
const SIDER_COLLAPSED_WIDTH = 80

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const siderWidth = collapsed ? SIDER_COLLAPSED_WIDTH : SIDER_WIDTH

  return (
    <Layout className="min-h-screen">
      {/* Full-width header layered above the sidebar */}
      <Header className="fixed inset-x-0 top-0 z-30 w-full px-0 shadow-sm">
        <Topbar />
      </Header>
      <Sider
        width={SIDER_WIDTH}
        collapsedWidth={SIDER_COLLAPSED_WIDTH}
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        className="z-20 shadow-sm"
        style={{
          position: 'fixed',
          insetInlineStart: 0,
          top: 0,
          bottom: 0,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        {/* Spacer so the menu starts below the overlaid header */}
        <div style={{ height: HEADER_HEIGHT }} />
        <SidebarNav />
      </Sider>
      <Layout
        style={{
          marginInlineStart: siderWidth,
          marginTop: HEADER_HEIGHT,
          transition: 'margin-inline-start 0.2s',
        }}
      >
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
