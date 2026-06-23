export type Counter = {
    symbol: string
}

export type Analysis = {
    id: string
    title: string
    content: string
    created_at: string
    image_url?: string | null
    mse_counters?: Counter[] | Counter | null
}

export type PriceMover = {
    price: number
    change_pct: number
    mse_counters?: Counter[] | Counter | null
}

/**
 * Supabase's generated types return joined relations as an array
 * (`Counter[]`) unless the foreign key is explicitly marked one-to-one,
 * even when the actual data is a single row. This normalizes either
 * shape to a plain symbol string.
 */
export function getSymbol(counters?: Counter[] | Counter | null): string | undefined {
    if (!counters) return undefined
    return Array.isArray(counters) ? counters[0]?.symbol : counters.symbol
}

export type GlossaryTerm = {
    id: string
    term: string
    slug: string
    category: string
}

export type CommunityThread = {
    id: string
    title: string
    reply_count: number | null
    mse_counters?: Counter[] | Counter | null
}

export type Course = {
    id: string
    title: string
    level: string
    order_index: number
}