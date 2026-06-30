// components/markets/IndexCard.tsx
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

function ChangePill({ pct }: { pct: number | null }) {
    if (pct === null) {
        return <span className="text-[12px] text-(--color-text-tertiary)">—</span>
    }
    const isUp = pct > 0
    const isFlat = pct === 0
    const Icon = isFlat ? Minus : isUp ? TrendingUp : TrendingDown
    const color = isFlat
        ? 'var(--color-text-tertiary)'
        : isUp
            ? 'var(--color-text-success)'
            : 'var(--color-text-danger)'

    return (
        <span className="flex items-center gap-1 text-[12px] font-medium" style={{ color }}>
            <Icon size={11} aria-hidden="true" />
            {isUp ? '+' : ''}{pct.toFixed(2)}%
        </span>
    )
}

export function IndexCard({
    code,
    name,
    value,
    dayChange,
    weekChange,
    ytdChange,
    asOf,
}: {
    code: string
    name: string
    value: number | null
    dayChange: number | null
    weekChange: number | null
    ytdChange: number | null
    asOf: string | null
}) {
    return (
        <div className="rounded-(--border-radius-lg) border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-primary) p-4 shadow-(--shadow-card)">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[13px] font-semibold text-(--color-text-primary)">{code}</p>
                    <p className="text-[11px] text-(--color-text-tertiary)">{name}</p>
                </div>
                {dayChange !== null && (
                    <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{
                            background: dayChange >= 0 ? 'var(--color-background-success)' : 'var(--color-background-danger)',
                            color: dayChange >= 0 ? 'var(--color-text-success)' : 'var(--color-text-danger)',
                        }}
                    >
                        Today
                    </span>
                )}
            </div>

            <p className="mt-2 text-[22px] font-bold leading-none text-(--color-text-primary)">
                {value !== null ? value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
            </p>
            {value === null && (
                <p className="mt-0.5 text-[10px] text-(--color-text-tertiary)">No absolute level published — % change only</p>
            )}

            <div className="mt-3 grid grid-cols-3 gap-2 border-t-[0.5px] border-(--color-border-tertiary) pt-2.5">
                <div>
                    <p className="text-[10px] tracking-wide text-(--color-text-tertiary) uppercase">1 Day</p>
                    <ChangePill pct={dayChange} />
                </div>
                <div>
                    <p className="text-[10px] tracking-wide text-(--color-text-tertiary) uppercase">1 Week</p>
                    <ChangePill pct={weekChange} />
                </div>
                <div>
                    <p className="text-[10px] tracking-wide text-(--color-text-tertiary) uppercase">YTD</p>
                    <ChangePill pct={ytdChange} />
                </div>
            </div>

            {asOf && (
                <p className="mt-2.5 text-[10px] text-(--color-text-tertiary)">As of {asOf}</p>
            )}
        </div>
    )
}
