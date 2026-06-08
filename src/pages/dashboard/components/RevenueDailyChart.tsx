import { PanelCard } from '../../../components/ui/PanelCard'
import { RevenueChart } from './RevenueChart'
import { dailyRevenue } from '../mock-data'

export function RevenueDailyChart() {
  return (
    <PanelCard title="Doanh thu thực tế (14 ngày gần nhất)">
      <RevenueChart data={dailyRevenue} />
    </PanelCard>
  )
}
