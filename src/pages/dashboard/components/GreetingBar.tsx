import { Select } from 'antd'
import { partnerOptions } from '../mock-data'

export function GreetingBar() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-800">Xin chào PVI Digital!</h1>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Đối tác</span>
        <Select
          defaultValue="Grab"
          options={[...partnerOptions]}
          className="w-40"
        />
      </div>
    </div>
  )
}
