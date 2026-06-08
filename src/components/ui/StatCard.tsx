import { cn } from '../../utils/cn'

interface StatCardProps {
  label: string
  value: string
  sub?: string
  accent?: boolean
  className?: string
}

export function StatCard({ label, value, sub, accent, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-lg border p-5',
        accent
          ? 'border-indigo-200 bg-indigo-50'
          : 'border-gray-100 bg-white shadow-sm',
        className,
      )}
    >
      <span className="text-sm text-gray-500">{label}</span>
      <span
        className={cn(
          'text-2xl font-semibold',
          accent ? 'text-indigo-700' : 'text-gray-800',
        )}
      >
        {value}
      </span>
      {sub ? <span className="text-xs text-rose-500">{sub}</span> : null}
    </div>
  )
}
