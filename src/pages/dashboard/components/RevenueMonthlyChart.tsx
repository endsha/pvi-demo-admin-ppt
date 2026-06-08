import { PanelCard } from '../../../components/ui/PanelCard'
import { RevenueChart } from './RevenueChart'
import { monthlyRevenue } from '../mock-data'

export function RevenueMonthlyChart() {
  return (
    <PanelCard title="Doanh thu theo tháng">
      <RevenueChart data={monthlyRevenue} />
    </PanelCard>
  )
}
