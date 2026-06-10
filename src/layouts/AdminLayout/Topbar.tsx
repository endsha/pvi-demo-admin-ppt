import { Avatar } from 'antd'
import logoPvi from '../../assets/big-logo-pvi.png'

export function Topbar() {
  return (
    <div className="flex h-full items-center justify-between bg-white px-6">
      <div className="flex items-center gap-3">
        <img
          src={logoPvi}
          alt="PVI Insurance"
          width={108}
          height={36}
          className="h-9 w-auto"
        />
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
