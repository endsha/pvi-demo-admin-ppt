import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs'
import { RouterProvider } from 'react-router-dom'
import { antdTheme } from './app/theme'
import { router } from './app/router'
import './app/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyleProvider layer>
      <ConfigProvider theme={antdTheme}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </StyleProvider>
  </StrictMode>,
)
