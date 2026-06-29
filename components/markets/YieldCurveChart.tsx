// components/markets/YieldCurveChart.tsx
// Client-side yield curve chart using Recharts.
'use client'

import {
    LineChart, Line, XAxis, YAxis, Tooltip,
    CartesianGrid, ResponsiveContainer, ReferenceLine
} from 'recharts'

type YieldPoint = { label: string; tenor_days: number; yield: number }

export function YieldCurveChart({ data }: { data: YieldPoint[] }) {
    const sorted = [...data].sort((a, b) => a.tenor_days - b.tenor_days)
    const policyRate = 26.00

    return (
        <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sorted} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                    <CartesianGrid
                        vertical={false}
                        stroke="var(--color-border-tertiary)"
                        strokeDasharray="0"
                    />
                    <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        domain={[10, 30]}
                        tickFormatter={v => `${v}%`}
                        tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }}
                        axisLine={false}
                        tickLine={false}
                        width={38}
                        tickCount={5}
                        orientation="right"
                    />
                    <Tooltip
                        formatter={(value) => [typeof value === 'number' ? `${value.toFixed(2)}%` : '—', 'Yield']}
                        labelFormatter={(label) => `Maturity: ${label}`}
                        contentStyle={{
                            background: 'var(--color-background-primary)',
                            border: '0.5px solid var(--color-border-tertiary)',
                            borderRadius: 'var(--border-radius-md)',
                            fontSize: 12,
                        }}
                    />
                    <ReferenceLine
                        y={policyRate}
                        stroke="var(--color-text-danger)"
                        strokeDasharray="4 3"
                        strokeOpacity={0.6}
                        label={{
                            value: `Policy rate ${policyRate}%`,
                            position: 'insideTopLeft',
                            fontSize: 10,
                            fill: 'var(--color-text-danger)',
                            opacity: 0.8,
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="yield"
                        stroke="var(--color-text-warning)"
                        strokeWidth={2}
                        dot={{ r: 4, fill: 'var(--color-text-warning)', strokeWidth: 0 }}
                        activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}