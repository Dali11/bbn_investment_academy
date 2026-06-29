// components/markets/BondsTable.tsx
'use client'

import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import type { Bond } from '@/app/(public)/markets/bonds/page'

type SortKey = 'tenor_days' | 'yield_pct' | 'coupon_pct' | 'maturity_date' | 'type'
type SortDir = 'asc' | 'desc'

const TYPE_COLORS: Record<Bond['type'], { bg: string; text: string }> = {
    'T-Bill': { bg: 'var(--color-background-info)', text: 'var(--color-text-info)' },
    'T-Bond': { bg: 'var(--color-background-warning)', text: 'var(--color-text-warning)' },
    'T-Note': { bg: 'var(--color-background-success)', text: 'var(--color-text-success)' },
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-MW', { day: 'numeric', month: 'short', year: 'numeric' })
}

function daysToMaturity(iso: string) {
    const diff = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000)
    if (diff < 0) return 'Matured'
    if (diff === 0) return 'Today'
    if (diff < 30) return `${diff}d`
    if (diff < 365) return `${Math.round(diff / 30)}mo`
    return `${(diff / 365).toFixed(1)}yr`
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
    if (col !== sortKey) return <ChevronsUpDown size={11} className="opacity-30" />
    return sortDir === 'asc'
        ? <ChevronUp size={11} style={{ color: 'var(--color-text-warning)' }} />
        : <ChevronDown size={11} style={{ color: 'var(--color-text-warning)' }} />
}

const FILTERS: Array<{ label: string; value: Bond['type'] | 'All' }> = [
    { label: 'All', value: 'All' },
    { label: 'T-Bills', value: 'T-Bill' },
    { label: 'T-Bonds', value: 'T-Bond' },
    { label: 'T-Notes', value: 'T-Note' },
]

export function BondsTable({ bonds }: { bonds: Bond[] }) {
    const [filter, setFilter] = useState<Bond['type'] | 'All'>('All')
    const [sortKey, setSortKey] = useState<SortKey>('tenor_days')
    const [sortDir, setSortDir] = useState<SortDir>('asc')

    function handleSort(key: SortKey) {
        if (key === sortKey) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        } else {
            setSortKey(key)
            setSortDir('asc')
        }
    }

    const rows = useMemo(() => {
        const filtered = filter === 'All' ? bonds : bonds.filter(b => b.type === filter)
        return [...filtered].sort((a, b) => {
            let av: any = a[sortKey]
            let bv: any = b[sortKey]
            if (av === null) av = -Infinity
            if (bv === null) bv = -Infinity
            const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv
            return sortDir === 'asc' ? cmp : -cmp
        })
    }, [bonds, filter, sortKey, sortDir])

    return (
        <div className="space-y-3">
            {/* Filter tabs */}
            <div className="flex gap-1.5 flex-wrap">
                {FILTERS.map(f => (
                    <button
                        key={f.value}
                        onClick={() => setFilter(f.value)}
                        className="rounded-(--border-radius-md) px-3 py-1 text-[12px] font-medium transition-colors"
                        style={{
                            background: filter === f.value
                                ? 'var(--color-text-primary)'
                                : 'var(--color-background-secondary)',
                            color: filter === f.value
                                ? 'var(--color-background-primary)'
                                : 'var(--color-text-secondary)',
                        }}
                    >
                        {f.label}
                        <span className="ml-1.5 opacity-60 text-[11px]">
                            {f.value === 'All'
                                ? bonds.length
                                : bonds.filter(b => b.type === f.value).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-(--border-radius-lg) border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-primary) shadow-(--shadow-card)">
                <table className="w-full min-w-[560px] border-collapse text-left">
                    <thead>
                        <tr className="border-b-[0.5px] border-(--color-border-tertiary) bg-(--color-background-secondary)">
                            {/* Type */}
                            <th
                                className="cursor-pointer select-none px-3 py-2.5 text-[11px] font-semibold tracking-wide text-(--color-text-tertiary) uppercase"
                                onClick={() => handleSort('type')}
                            >
                                <span className="inline-flex items-center gap-1">
                                    Type <SortIcon col="type" sortKey={sortKey} sortDir={sortDir} />
                                </span>
                            </th>
                            {/* Name */}
                            <th className="px-3 py-2.5 text-[11px] font-semibold tracking-wide text-(--color-text-tertiary) uppercase hidden sm:table-cell">
                                Instrument
                            </th>
                            {/* Tenor */}
                            <th
                                className="cursor-pointer select-none px-3 py-2.5 text-[11px] font-semibold tracking-wide text-(--color-text-tertiary) uppercase text-right"
                                onClick={() => handleSort('tenor_days')}
                            >
                                <span className="inline-flex items-center justify-end gap-1">
                                    <SortIcon col="tenor_days" sortKey={sortKey} sortDir={sortDir} /> Tenor
                                </span>
                            </th>
                            {/* Yield */}
                            <th
                                className="cursor-pointer select-none px-3 py-2.5 text-[11px] font-semibold tracking-wide text-(--color-text-tertiary) uppercase text-right"
                                onClick={() => handleSort('yield_pct')}
                            >
                                <span className="inline-flex items-center justify-end gap-1">
                                    <SortIcon col="yield_pct" sortKey={sortKey} sortDir={sortDir} /> Yield %
                                </span>
                            </th>
                            {/* Coupon */}
                            <th
                                className="cursor-pointer select-none px-3 py-2.5 text-[11px] font-semibold tracking-wide text-(--color-text-tertiary) uppercase text-right hidden md:table-cell"
                                onClick={() => handleSort('coupon_pct')}
                            >
                                <span className="inline-flex items-center justify-end gap-1">
                                    <SortIcon col="coupon_pct" sortKey={sortKey} sortDir={sortDir} /> Coupon
                                </span>
                            </th>
                            {/* Maturity */}
                            <th
                                className="cursor-pointer select-none px-3 py-2.5 text-[11px] font-semibold tracking-wide text-(--color-text-tertiary) uppercase text-right hidden md:table-cell"
                                onClick={() => handleSort('maturity_date')}
                            >
                                <span className="inline-flex items-center justify-end gap-1">
                                    <SortIcon col="maturity_date" sortKey={sortKey} sortDir={sortDir} /> Matures
                                </span>
                            </th>
                            {/* Time to maturity */}
                            <th className="px-3 py-2.5 text-[11px] font-semibold tracking-wide text-(--color-text-tertiary) uppercase text-right hidden lg:table-cell">
                                Time Left
                            </th>
                            {/* Frequency */}
                            <th className="px-3 py-2.5 text-[11px] font-semibold tracking-wide text-(--color-text-tertiary) uppercase hidden lg:table-cell">
                                Frequency
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((b, i) => {
                            const { bg, text } = TYPE_COLORS[b.type]
                            const ttm = daysToMaturity(b.maturity_date)
                            return (
                                <tr
                                    key={b.id}
                                    className={`transition-colors hover:bg-(--color-background-secondary) ${i < rows.length - 1 ? 'border-b-[0.5px] border-(--color-border-tertiary)' : ''}`}
                                >
                                    {/* Type badge */}
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        <span
                                            className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                                            style={{ background: bg, color: text }}
                                        >
                                            {b.type}
                                        </span>
                                    </td>
                                    {/* Name */}
                                    <td className="hidden sm:table-cell px-3 py-3 text-[13px] text-(--color-text-primary) max-w-[200px]">
                                        <p className="font-medium truncate">{b.name}</p>
                                        <p className="text-[11px] text-(--color-text-tertiary) mt-0.5">MK {b.face_value.toLocaleString()} face value</p>
                                    </td>
                                    {/* Tenor */}
                                    <td className="px-3 py-3 text-right text-[13px] font-medium text-(--color-text-primary) font-(family-name:--font-mono) whitespace-nowrap">
                                        {b.tenor}
                                    </td>
                                    {/* Yield */}
                                    <td className="px-3 py-3 text-right whitespace-nowrap">
                                        <span
                                            className="text-[14px] font-bold font-(family-name:--font-mono)"
                                            style={{ color: 'var(--color-text-success)' }}
                                        >
                                            {b.yield_pct.toFixed(2)}%
                                        </span>
                                    </td>
                                    {/* Coupon */}
                                    <td className="hidden md:table-cell px-3 py-3 text-right text-[13px] text-(--color-text-secondary) font-(family-name:--font-mono)">
                                        {b.coupon_pct != null ? `${b.coupon_pct.toFixed(2)}%` : (
                                            <span className="text-[11px] text-(--color-text-tertiary) italic">Zero-coupon</span>
                                        )}
                                    </td>
                                    {/* Maturity date */}
                                    <td className="hidden md:table-cell px-3 py-3 text-right text-[12px] text-(--color-text-secondary) whitespace-nowrap">
                                        {formatDate(b.maturity_date)}
                                    </td>
                                    {/* Time to maturity */}
                                    <td className="hidden lg:table-cell px-3 py-3 text-right">
                                        <span
                                            className="text-[12px] font-medium rounded-full px-2 py-0.5"
                                            style={{
                                                background: ttm === 'Matured'
                                                    ? 'var(--color-background-secondary)'
                                                    : 'var(--color-background-warning)',
                                                color: ttm === 'Matured'
                                                    ? 'var(--color-text-tertiary)'
                                                    : 'var(--color-text-warning)',
                                            }}
                                        >
                                            {ttm}
                                        </span>
                                    </td>
                                    {/* Frequency */}
                                    <td className="hidden lg:table-cell px-3 py-3 text-[12px] text-(--color-text-tertiary)">
                                        {b.frequency}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}