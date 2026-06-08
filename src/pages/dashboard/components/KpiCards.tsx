import { StatCard } from '../../../components/ui/StatCard'
import { kpiCards } from '../mock-data'

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpiCards.map((card) => (
        <StatCard
          key={card.label}
          label={card.label}
          value={card.value}
          sub={card.sub}
          accent={card.accent}
        />
      ))}
    </div>
  )
}
