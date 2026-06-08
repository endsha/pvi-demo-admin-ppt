import { Avatar } from 'antd'

export function Topbar() {
  return (
    <div className="flex h-full items-center justify-between bg-white px-6">
      <div className="flex items-center gap-2">
        <span className="text-xl font-extrabold tracking-tight text-rose-600">
          PVI
        </span>
        <span className="text-base font-medium text-gray-700">Admin Center</span>
      </div>
      <div className="flex items-center gap-2">
        <Avatar size={28} className="bg-indigo-600 text-xs">
          AD
        </Avatar>
        <span className="text-sm text-gray-600">PVI Digital</span>
      </div>
    </div>
  )
}
