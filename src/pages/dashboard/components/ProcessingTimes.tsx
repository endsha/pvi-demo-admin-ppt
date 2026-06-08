import { PanelCard } from '../../../components/ui/PanelCard'
import { StatCard } from '../../../components/ui/StatCard'
import { processingTimes } from '../mock-data'

export function ProcessingTimes() {
  return (
    <PanelCard title="Thời gian xử lý trung bình">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {processingTimes.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} />
        ))}
      </div>
    </PanelCard>
  )
}
