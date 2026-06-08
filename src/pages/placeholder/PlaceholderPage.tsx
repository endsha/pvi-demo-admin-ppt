interface PlaceholderPageProps {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="flex h-64 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-400 shadow-sm">
      {title}
    </div>
  )
}
