// app/(public)/markets/calendar/CalendarAgenda.tsx
'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

export type CalendarEventType = 'Dividend' | 'AGM' | 'Rights Issue' | 'Stock Split' | 'Report' | 'Announcement' | 'IPO'

export type CalendarEvent = {
    id: string
    date: string // ISO
    type: CalendarEventType
    label: string
    symbol: string | null
    company_name: string | null
}

const TYPE_COLORS: Record<CalendarEventType, { bg: string; text: string }> = {
    Dividend: { bg: 'var(--color-background-success)', text: 'var(--color-text-success)' },
    AGM: { bg: 'var(--color-background-info)', text: 'var(--color-text-info)' },
    'Rights Issue': { bg: 'var(--color-background-warning)', text: 'var(--color-text-warning)' },
    'Stock Split': { bg: 'var(--color-background-warning)', text: 'var(--color-text-warning)' },
    Report: { bg: 'var(--color-background-info)', text: 'var(--color-text-info)' },
    Announcement: { bg: 'var(--color-background-secondary)', text: 'var(--color-text-secondary)' },
    IPO: { bg: 'var(--color-background-info)', text: 'var(--color-text-info)' },
}

const TYPE_FILTERS: Array<CalendarEventType | 'All'> = [
    'All', 'AGM', 'Dividend', 'Rights Issue', 'Stock Split', 'Report', 'Announcement', 'IPO',
]

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-MW', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function EventRow({ event, isLast }: { event: CalendarEvent; isLast: boolean }) {
    const { bg, text } = TYPE_COLORS[event.type]
    return (
        <div className={`flex items-start gap-3 px-4 py-3.5 ${isLast ? '' : 'border-b-[0.5px] border-(--color-border-tertiary)'}`}>
            <span
                className="mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap"
                style={{ background: bg, color: text }}
            >
                {event.type}
            </span>
            <div className="min-w-0 flex-1">
                <p className="text-[13px] text-(--color-text-primary) leading-snug">{event.label}</p>
                <p className="mt-1 text-[11px] text-(--color-text-tertiary)">
                    {event.symbol && (
                        <>
                            <Link
                                href={`/stocks/${event.symbol.toLowerCase()}`}
                                className="font-semibold text-(--color-text-primary) no-underline hover:underline"
                            >
                                {event.symbol}
                            </Link>
                            {' · '}
                        </>
                    )}
                    {formatDate(event.date)}
                </p>
            </div>
        </div>
    )
}

export function CalendarAgenda({ events }: { events: CalendarEvent[] }) {
    const [type, setType] = useState<typeof TYPE_FILTERS[number]>('All')
    const [search, setSearch] = useState('')

    const today = useMemo(() => new Date().toISOString().slice(0, 10), [])

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        return events.filter(e => {
            const matchesType = type === 'All' || e.type === type
            const matchesSearch = !q ||
                e.label.toLowerCase().includes(q) ||
                (e.symbol ?? '').toLowerCase().includes(q) ||
                (e.company_name ?? '').toLowerCase().includes(q)
            return matchesType && matchesSearch
        })
    }, [events, type, search])

    const upcoming = useMemo(
        () => filtered.filter(e => e.date >= today).sort((a, b) => a.date.localeCompare(b.date)),
        [filtered, today],
    )
    const past = useMemo(
        () => filtered.filter(e => e.date < today).sort((a, b) => b.date.localeCompare(a.date)),
        [filtered, today],
    )

    return (
        <div className="space-y-5">
            {/* Filters */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-1.5">
                    {TYPE_FILTERS.map(t => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setType(t)}
                            className="rounded-full px-3 py-1 text-[12px] font-medium transition-colors cursor-pointer border-none"
                            style={
                                type === t
                                    ? { background: 'var(--color-text-primary)', color: 'var(--color-background-primary)' }
                                    : { background: 'var(--color-background-secondary)', color: 'var(--color-text-secondary)' }
                            }
                        >
                            {t}
                        </button>
                    ))}
                </div>
                <input
                    type="search"
                    placeholder="Search by symbol, company or event…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full rounded-(--border-radius-md) border-[0.5px] border-(--color-border-secondary) bg-(--color-background-primary) px-3.5 py-2 text-[13px] text-(--color-text-primary) placeholder:text-(--color-text-tertiary) outline-none focus:border-(--color-border-primary) sm:max-w-xs"
                />
            </div>

            {/* Upcoming */}
            <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-(--color-text-tertiary)">
                    Upcoming {upcoming.length > 0 && `(${upcoming.length})`}
                </p>
                <div className="overflow-hidden rounded-(--border-radius-lg) border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-primary) shadow-(--shadow-card)">
                    {upcoming.length === 0 ? (
                        <p className="px-4 py-10 text-center text-[13px] text-(--color-text-tertiary)">
                            No upcoming dates match your filters.
                        </p>
                    ) : (
                        upcoming.map((e, i) => <EventRow key={e.id} event={e} isLast={i === upcoming.length - 1} />)
                    )}
                </div>
            </div>

            {/* Past */}
            <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-(--color-text-tertiary)">
                    Past {past.length > 0 && `(${past.length})`}
                </p>
                <div className="overflow-hidden rounded-(--border-radius-lg) border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-primary) shadow-(--shadow-card)">
                    {past.length === 0 ? (
                        <p className="px-4 py-10 text-center text-[13px] text-(--color-text-tertiary)">
                            No past dates match your filters.
                        </p>
                    ) : (
                        past.slice(0, 100).map((e, i) => (
                            <EventRow key={e.id} event={e} isLast={i === Math.min(past.length, 100) - 1} />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
