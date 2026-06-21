'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function StockChart({ data }: { data: { date: string; price: number }[] }) {
  const min = Math.min(...data.map(d => d.price))
  const max = Math.max(...data.map(d => d.price))
  const padding = (max - min) * 0.1

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[min - padding, max + padding]}
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={v => `${(v / 1000).toFixed(1)}K`}
        />
        <Tooltip
          contentStyle={{ fontSize: 12, border: '0.5px solid #e5e7eb', borderRadius: 8 }}
          formatter={(value: number) => [`MK ${value.toLocaleString()}`, 'Price']}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#d97706"
          strokeWidth={2}
          dot={{ fill: '#d97706', r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}