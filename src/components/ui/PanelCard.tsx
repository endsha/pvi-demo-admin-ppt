import type { ReactNode } from 'react'
import { FullscreenOutlined } from '@ant-design/icons'
import { cn } from '../../utils/cn'

interface PanelCardProps {
  title: string
  children: ReactNode
  className?: string
}

export function PanelCard({ title, children, className }: PanelCardProps) {
  return (
    <section
      className={cn(
        'flex flex-col rounded-lg border border-gray-100 bg-white p-5 shadow-sm',
        className,
      )}
    >
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
        <FullscreenOutlined className="cursor-pointer text-gray-400 hover:text-gray-600" />
      </header>
      {children}
    </section>
  )
}
