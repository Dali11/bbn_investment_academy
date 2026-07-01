// lib/analysisCategories.ts
// Single source of truth for the six Analysis Hub buckets — used by both
// app/admin/page.tsx (the analysis editor) and app/(public)/research/page.tsx
// (the public hub tabs), so the two never drift out of sync.
//
// 'latest' isn't "everything, most recent first" — that's what the "All"
// tab on /research already shows by default. 'latest' is its own bucket
// for general market commentary that doesn't fit any of the other five
// (undervalued/dividend/recap/outlook/sector) — e.g. a one-off take on a
// single counter's results that isn't a themed recap or sector piece.
//
// Keep this in sync with the `category` check constraint added by
// scripts/analyses_add_category_migration.sql.

export type AnalysisCategory =
    | 'latest'
    | 'undervalued'
    | 'dividend'
    | 'weekly_recap'
    | 'economic_outlook'
    | 'sector'

export type AnalysisCategoryOption = {
    value: AnalysisCategory
    label: string
    description: string
}

export const ANALYSIS_CATEGORIES: AnalysisCategoryOption[] = [
    {
        value: 'latest',
        label: 'Latest Analysis',
        description: 'General commentary that doesn\u2019t fit a themed bucket below',
    },
    {
        value: 'undervalued',
        label: 'Undervalued Stocks',
        description: 'Counters that look cheap relative to fundamentals or peers',
    },
    {
        value: 'dividend',
        label: 'Dividend Stocks',
        description: 'Yield-focused picks and dividend-history writeups',
    },
    {
        value: 'weekly_recap',
        label: 'Weekly Recap',
        description: 'What moved on the MSE this week',
    },
    {
        value: 'economic_outlook',
        label: 'Economic Outlook',
        description: 'Macro context \u2014 inflation, forex, monetary policy, etc.',
    },
    {
        value: 'sector',
        label: 'Sector Analysis',
        description: 'A deep dive on one sector across its listed counters',
    },
]

export function getCategoryLabel(value: string | null | undefined): string {
    return ANALYSIS_CATEGORIES.find((c) => c.value === value)?.label ?? 'Latest Analysis'
}
