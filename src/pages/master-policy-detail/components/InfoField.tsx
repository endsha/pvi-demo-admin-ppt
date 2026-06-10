interface InfoFieldProps {
  label: string
  value: string | null
}

export function InfoField({ label, value }: InfoFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm text-gray-800">{value ?? '-'}</span>
    </div>
  )
}
