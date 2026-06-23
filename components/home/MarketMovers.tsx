import Link from 'next/link'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { getSymbol, type PriceMover } from '@/types/home'

function MoverColumn({
    title,
    Icon,
    movers,
    positive,
    emptyLabel,
}: {
    title: string
    Icon: typeof TrendingUp
    movers: PriceMover[]
    positive: boolean
    emptyLabel: string
}) {
    const textVar = positive ? 'var(--color-text-success)' : 'var(--color-text-danger)'
    const bgVar = positive ? 'var(--color-background-success)' : 'var(--color-background-danger)'

    return (
        <div>
            <div className="mb-2 flex items-center gap-2">
                <div
                    className="flex h-6 w-6 items-center justify-center rounded-(--border-radius-md)"
                    style={{ background: bgVar }}
                >
                    <Icon size={14} style={{ color: textVar }} aria-hidden="true" />
                </div>
                <p className="text-xs font-bold tracking-wider text-(--color-text-tertiary) uppercase">{title}</p>
            </div>
            <div className="overflow-hidden rounded-(--border-radius-lg) border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-primary) shadow-(--shadow-card)">
                {movers.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-(--color-text-tertiary)">{emptyLabel}</p>
                ) : (
                    movers.map((p, i) => {
                        const symbol = getSymbol(p.mse_counters)
                        return (
                            <Link
                                key={i}
                                href={`/mse/${symbol?.toLowerCase()}`}
                                className={`flex items-center justify-between px-4 py-2.5 no-underline transition-colors hover:bg-(--color-background-secondary) ${i < movers.length - 1 ? 'border-b-[0.5px] border-(--color-border-tertiary)' : ''
                                    }`}
                            >
                                <span className="text-sm font-medium text-(--color-text-primary)">{symbol}</span>
                                <span
                                    className="rounded-full px-2.5 py-0.5 text-sm font-semibold"
                                    style={{ color: textVar, background: bgVar }}
                                >
                                    {positive ? '+' : ''}
                                    {Number(p.change_pct).toFixed(2)}%
                                </span>
                            </Link>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export function MarketMovers({ gainers, losers }: { gainers: PriceMover[]; losers: PriceMover[] }) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <MoverColumn title="Top gainers" Icon={TrendingUp} movers={gainers} positive emptyLabel="No gainers today" />
            <MoverColumn title="Top losers" Icon={TrendingDown} movers={losers} positive={false} emptyLabel="No losers today" />
        </div>
    )
}