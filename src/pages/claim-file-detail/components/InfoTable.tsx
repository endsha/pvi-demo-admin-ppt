export interface InfoItem {
  label: string
  value: string | null
}

interface InfoTableProps {
  items: InfoItem[]
}

export function InfoTable({ items }: InfoTableProps) {
  return (
    <div className="overflow-hidden rounded-md border border-gray-200">
      {items.map((item, index) => (
        <div key={item.label} className={`flex ${index > 0 ? 'border-t border-gray-200' : ''}`}>
          <div className="w-[260px] shrink-0 border-r border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-600">
            {item.label}
          </div>
          <div className="flex-1 px-4 py-2.5 text-sm text-gray-800">{item.value ?? '–'}</div>
        </div>
      ))}
    </div>
  )
}
