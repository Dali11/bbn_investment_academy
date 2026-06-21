import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import StockChart from './StockChart'


export default async function StockPage({
    params,
}: {
    params: Promise<{ symbol: string }>
}) {
    const { symbol } = await params
    const supabase = await createClient()

    const { data: counter } = await supabase
        .from('mse_counters')
        .select('*')
        .eq('symbol', symbol.toUpperCase())
        .single()

    if (!counter) notFound()

    const { data: prices } = await supabase
        .from('mse_prices')
        .select('*')
        .eq('counter_id', counter.id)
        .order('price_date', { ascending: true })

    const latest = prices?.[prices.length - 1]
    const previous = prices?.[prices.length - 2]
    const priceChange = latest && previous
        ? Number(latest.price) - Number(previous.price)
        : 0
    const priceChangePct = latest?.change_pct ?? 0

    const chartData = prices?.map(p => ({
        date: new Date(p.price_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        price: Number(p.price)
    })) ?? []

    return (
        <div className="max-w-3xl">
            <div className="mb-4">
                <Link href="/mse" className="text-sm text-amber-600 hover:underline">← Back to MSE tracker</Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-medium text-gray-900">{counter.symbol}</h1>
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{counter.sector}</span>
                        </div>
                        <p className="text-sm text-gray-500">{counter.company_name}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-medium text-gray-900">
                            MK {Number(latest?.price ?? 0).toLocaleString()}
                        </p>
                        <p className={`text-sm font-medium ${priceChange >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {priceChange >= 0 ? '+' : ''}MK {priceChange.toFixed(2)} ({priceChangePct >= 0 ? '+' : ''}{Number(priceChangePct).toFixed(2)}%)
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'PE ratio', value: latest?.pe_ratio ?? '—' },
                        { label: 'Market cap', value: latest?.market_cap ? `MK ${(Number(latest.market_cap) / 1e9).toFixed(1)}B` : '—' },
                        { label: 'Data points', value: prices?.length ?? 0 },
                    ].map(m => (
                        <div key={m.label} className="bg-gray-50 rounded-lg px-3 py-2 text-center">
                            <p className="text-sm font-medium text-gray-900">{m.value}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{m.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
                <h2 className="text-sm font-medium text-gray-900 mb-4">Price history</h2>
                {chartData.length > 1 ? (
                    <StockChart data={chartData} />
                ) : (
                    <div className="h-40 flex items-center justify-center text-sm text-gray-400">
                        Not enough data for chart yet
                    </div>
                )}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100">
                    <h2 className="text-sm font-medium text-gray-900">Price history table</h2>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="text-left px-4 py-2 text-xs text-gray-400 font-medium">Date</th>
                            <th className="text-right px-4 py-2 text-xs text-gray-400 font-medium">Price (MK)</th>
                            <th className="text-right px-4 py-2 text-xs text-gray-400 font-medium">Change</th>
                            <th className="text-right px-4 py-2 text-xs text-gray-400 font-medium">PE Ratio</th>
                            <th className="text-right px-4 py-2 text-xs text-gray-400 font-medium">Market Cap</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...(prices ?? [])].reverse().map((p: any) => (
                            <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="px-4 py-2 text-gray-500 text-xs">
                                    {new Date(p.price_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="px-4 py-2 text-right text-gray-900">{Number(p.price).toLocaleString()}</td>
                                <td className={`px-4 py-2 text-right text-xs ${Number(p.change_pct) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {Number(p.change_pct) >= 0 ? '+' : ''}{Number(p.change_pct).toFixed(2)}%
                                </td>
                                <td className="px-4 py-2 text-right text-gray-500">{p.pe_ratio ?? '—'}</td>
                                <td className="px-4 py-2 text-right text-gray-500">
                                    {p.market_cap ? `MK ${(Number(p.market_cap) / 1e9).toFixed(1)}B` : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}