// app/(public)/markets/bonds/page.tsx
// Malawi fixed income — Government T-bills, Treasury Bonds, Treasury Notes.
// No public RBM API exists; data is seeded from official RBM publications
// and updated manually. Structure mirrors what a Supabase `bonds` table
// would look like so migration to live data is a straight swap.

import { Landmark, Info, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { BondsTable } from '@/components/markets/BondsTable'
import { YieldCurveChart } from '@/components/markets/YieldCurveChart'

// ─── Seed data from RBM publications ────────────────────────────────────────
// Sources:
//   • RBM Weekly Financial Market Developments (rbm.mw)
//   • RBM Yield Curve page (rbm.mw/FinancialMarkets/YieldCurve)
//   • Cbonds Malawi sovereign bond listings
//   • CEIC Data: 91-day T-bill yield = 16.00% (Nov 2025)
//   • RBM Policy Rate = 26.00% (Dec 2025)

export type Bond = {
    id: string
    type: 'T-Bill' | 'T-Bond' | 'T-Note'
    name: string
    tenor: string          // human-readable: "91 Days", "2 Years" etc.
    tenor_days: number     // for sorting
    yield_pct: number      // weighted average yield %
    coupon_pct: number | null  // null for zero-coupon T-bills
    issue_date: string     // ISO
    maturity_date: string  // ISO
    face_value: number     // MK face value per unit
    frequency: string      // "Weekly auction" / "Semi-annual" etc.
    status: 'Active' | 'Matured' | 'Upcoming'
    source: string
}

const BONDS: Bond[] = [
    // ── Treasury Bills (zero-coupon, auctioned weekly) ──────────────────
    {
        id: 'tbill-91',
        type: 'T-Bill',
        name: 'Government of Malawi 91-Day T-Bill',
        tenor: '91 Days',
        tenor_days: 91,
        yield_pct: 16.00,
        coupon_pct: null,
        issue_date: '2025-01-06',
        maturity_date: '2025-04-07',
        face_value: 1000,
        frequency: 'Weekly auction',
        status: 'Active',
        source: 'RBM Weekly FMD — Nov 2025',
    },
    {
        id: 'tbill-182',
        type: 'T-Bill',
        name: 'Government of Malawi 182-Day T-Bill',
        tenor: '182 Days',
        tenor_days: 182,
        yield_pct: 20.50,
        coupon_pct: null,
        issue_date: '2025-01-06',
        maturity_date: '2025-07-07',
        face_value: 1000,
        frequency: 'Weekly auction',
        status: 'Active',
        source: 'RBM Weekly FMD — Nov 2025',
    },
    {
        id: 'tbill-364',
        type: 'T-Bill',
        name: 'Government of Malawi 364-Day T-Bill',
        tenor: '364 Days',
        tenor_days: 364,
        yield_pct: 23.80,
        coupon_pct: null,
        issue_date: '2025-01-06',
        maturity_date: '2026-01-05',
        face_value: 1000,
        frequency: 'Weekly auction',
        status: 'Active',
        source: 'RBM Weekly FMD — Nov 2025',
    },

    // ── Treasury Bonds (fixed coupon, semi-annual) ───────────────────────
    {
        id: 'tbond-2y-2024',
        type: 'T-Bond',
        name: 'GoM 2-Year Treasury Bond 2024',
        tenor: '2 Years',
        tenor_days: 730,
        yield_pct: 24.50,
        coupon_pct: 24.50,
        issue_date: '2024-03-15',
        maturity_date: '2026-03-15',
        face_value: 1000,
        frequency: 'Semi-annual coupon',
        status: 'Active',
        source: 'RBM Yield Curve',
    },
    {
        id: 'tbond-3y-2024',
        type: 'T-Bond',
        name: 'GoM 3-Year Treasury Bond 2024',
        tenor: '3 Years',
        tenor_days: 1095,
        yield_pct: 25.00,
        coupon_pct: 25.00,
        issue_date: '2024-06-01',
        maturity_date: '2027-06-01',
        face_value: 1000,
        frequency: 'Semi-annual coupon',
        status: 'Active',
        source: 'RBM Yield Curve',
    },
    {
        id: 'tbond-5y-2024',
        type: 'T-Bond',
        name: 'GoM 5-Year Treasury Bond 2024',
        tenor: '5 Years',
        tenor_days: 1825,
        yield_pct: 25.50,
        coupon_pct: 25.50,
        issue_date: '2024-02-20',
        maturity_date: '2029-02-20',
        face_value: 1000,
        frequency: 'Semi-annual coupon',
        status: 'Active',
        source: 'RBM Yield Curve',
    },
    {
        id: 'tbond-5y-2024-nov',
        type: 'T-Bond',
        name: 'GoM 5-Year Treasury Bond Nov 2029',
        tenor: '5 Years',
        tenor_days: 1825,
        yield_pct: 14.50,
        coupon_pct: 14.50,
        issue_date: '2024-11-24',
        maturity_date: '2029-11-24',
        face_value: 1000,
        frequency: 'Semi-annual coupon',
        status: 'Active',
        source: 'Cbonds — DB07YR241129',
    },
    {
        id: 'tbond-7y-2023',
        type: 'T-Bond',
        name: 'GoM 7-Year Treasury Bond 2023',
        tenor: '7 Years',
        tenor_days: 2555,
        yield_pct: 26.00,
        coupon_pct: 26.00,
        issue_date: '2023-09-10',
        maturity_date: '2030-09-10',
        face_value: 1000,
        frequency: 'Semi-annual coupon',
        status: 'Active',
        source: 'RBM Yield Curve',
    },
    {
        id: 'tbond-10y-2022',
        type: 'T-Bond',
        name: 'GoM 10-Year Treasury Bond 2022',
        tenor: '10 Years',
        tenor_days: 3650,
        yield_pct: 22.00,
        coupon_pct: 22.00,
        issue_date: '2022-05-18',
        maturity_date: '2032-05-18',
        face_value: 1000,
        frequency: 'Semi-annual coupon',
        status: 'Active',
        source: 'RBM Yield Curve',
    },

    // ── Treasury Notes (2-year, quarterly coupon) ────────────────────────
    {
        id: 'tnote-2y-2025',
        type: 'T-Note',
        name: 'GoM 2-Year Treasury Note 2025',
        tenor: '2 Years',
        tenor_days: 730,
        yield_pct: 23.75,
        coupon_pct: 23.75,
        issue_date: '2025-03-01',
        maturity_date: '2027-03-01',
        face_value: 1000,
        frequency: 'Quarterly coupon',
        status: 'Active',
        source: 'RBM Financial Markets',
    },
]

// ── Yield curve points for the chart ──────────────────────────────────────
export const YIELD_CURVE = [
    { label: '91D', tenor_days: 91, yield: 16.00 },
    { label: '182D', tenor_days: 182, yield: 20.50 },
    { label: '364D', tenor_days: 364, yield: 23.80 },
    { label: '2Y', tenor_days: 730, yield: 24.50 },
    { label: '3Y', tenor_days: 1095, yield: 25.00 },
    { label: '5Y', tenor_days: 1825, yield: 25.50 },
    { label: '7Y', tenor_days: 2555, yield: 26.00 },
    { label: '10Y', tenor_days: 3650, yield: 22.00 },
]

// ── Key rates ──────────────────────────────────────────────────────────────
const KEY_RATES = [
    { label: 'RBM Policy Rate', value: '26.00%', note: 'Dec 2025' },
    { label: 'Inflation Rate', value: '24.90%', note: 'Headline, 2025' },
    { label: '91-Day T-Bill', value: '16.00%', note: 'Weighted avg' },
    { label: '364-Day T-Bill', value: '23.80%', note: 'Weighted avg' },
]

export default function BondsPage() {
    const active = BONDS.filter(b => b.status === 'Active')

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-(--color-text-primary)">Bonds</h1>
                    <p className="mt-0.5 text-[13px] text-(--color-text-tertiary)">
                        Government of Malawi fixed income instruments — T-Bills, Treasury Bonds & Notes
                    </p>
                </div>
                <a
                    href="https://www.rbm.mw/FinancialMarkets/TreasuryBonds"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-(--border-radius-md) border-[0.5px] border-(--color-border-secondary) px-3 py-1.5 text-[12px] font-medium text-(--color-text-secondary) no-underline transition-colors hover:bg-(--color-background-secondary)"
                >
                    <ExternalLink size={12} aria-hidden="true" />
                    RBM source data
                </a>
            </div>

            {/* Key rate pills */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {KEY_RATES.map(r => (
                    <div
                        key={r.label}
                        className="rounded-(--border-radius-lg) border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-primary) p-3.5 shadow-(--shadow-card)"
                    >
                        <p className="text-[11px] font-medium tracking-wide text-(--color-text-tertiary) uppercase">{r.label}</p>
                        <p className="mt-1 text-[20px] font-bold text-(--color-text-primary) leading-none">{r.value}</p>
                        <p className="mt-1 text-[11px] text-(--color-text-tertiary)">{r.note}</p>
                    </div>
                ))}
            </div>

            {/* Yield curve */}
            <div className="rounded-(--border-radius-lg) border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-primary) shadow-(--shadow-card)">
                <div className="flex items-center justify-between border-b-[0.5px] border-(--color-border-tertiary) px-4 py-2.5">
                    <p className="text-[11px] font-bold tracking-wider text-(--color-text-tertiary) uppercase">
                        RBM Yield Curve
                    </p>
                    <span className="text-[11px] text-(--color-text-tertiary)">Weighted avg rates by maturity</span>
                </div>
                <div className="p-4">
                    <YieldCurveChart data={YIELD_CURVE} />
                </div>
            </div>

            {/* Bonds table */}
            <BondsTable bonds={active} />

            {/* Data notice */}
            <div className="flex items-start gap-2.5 rounded-(--border-radius-lg) border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-info) p-3.5">
                <Info size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--color-text-info)' }} aria-hidden="true" />
                <p className="text-[12px] leading-relaxed" style={{ color: 'var(--color-text-info)' }}>
                    Yields are weighted average rates from the Reserve Bank of Malawi weekly auction publications.
                    T-Bill rates are re-set at each weekly auction — figures shown reflect the most recently published auction.
                    For real-time data, visit the{' '}
                    <a
                        href="https://www.rbm.mw/FinancialMarkets/TreasuryBills"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline"
                        style={{ color: 'var(--color-text-info)' }}
                    >
                        RBM Financial Markets page
                    </a>.
                </p>
            </div>
        </div>
    )
}