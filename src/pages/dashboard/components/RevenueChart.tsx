import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { ChartPoint } from '../mock-data'
import { chartColors } from '../../../app/theme'

interface RevenueChartProps {
  data: ChartPoint[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} />
        <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#9ca3af' }} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#9ca3af' }} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar yAxisId="left" dataKey="doanhThuKyTruoc" name="Doanh thu kỳ trước" fill={chartColors.doanhThuKyTruoc} barSize={10} radius={[2, 2, 0, 0]} />
        <Bar yAxisId="left" dataKey="doanhThu" name="Doanh thu" fill={chartColors.doanhThu} barSize={10} radius={[2, 2, 0, 0]} />
        <Line yAxisId="right" type="monotone" dataKey="soDonKyTruoc" name="Số đơn kỳ trước" stroke={chartColors.soDonKyTruoc} strokeDasharray="5 5" dot={false} />
        <Line yAxisId="right" type="monotone" dataKey="soDon" name="Số đơn" stroke={chartColors.soDon} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
