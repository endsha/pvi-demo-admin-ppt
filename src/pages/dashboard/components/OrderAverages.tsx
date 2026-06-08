import { PanelCard } from '../../../components/ui/PanelCard'
import { StatCard } from '../../../components/ui/StatCard'
import { orderAverages } from '../mock-data'

export function OrderAverages() {
  return (
    <PanelCard title="Số lượng đơn trung bình">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {orderAverages.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} />
        ))}
      </div>
    </PanelCard>
  )
}
