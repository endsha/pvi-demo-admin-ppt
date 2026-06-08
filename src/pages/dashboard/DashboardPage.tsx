import { GreetingBar } from './components/GreetingBar'
import { InfoBanner } from './components/InfoBanner'
import { KpiCards } from './components/KpiCards'
import { RevenueDailyChart } from './components/RevenueDailyChart'
import { RevenueMonthlyChart } from './components/RevenueMonthlyChart'
import { OrderAverages } from './components/OrderAverages'
import { ProcessingTimes } from './components/ProcessingTimes'

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-5">
      <GreetingBar />
      <InfoBanner />
      <KpiCards />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <RevenueDailyChart />
        <RevenueMonthlyChart />
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <OrderAverages />
        <ProcessingTimes />
      </div>
    </div>
  )
}
