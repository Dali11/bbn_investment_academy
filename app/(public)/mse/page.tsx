import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function MSEPage() {
    const supabase = await createClient()

    const { data: prices } = await supabase
        .from('mse_prices')
        .select('price, change_pct, price_date, mse_counters(id, symbol, company_name, sector)')
        .order('price_date', { ascending: false })
        .limit(64)

    // Deduplicate — latest price per symbol
    const seen = new Set<string>()
    const latest = (prices ?? []).filter((p: any) => {
        const sym = p.mse_counters?.symbol
        if (!sym || seen.has(sym)) return false
        seen.add(sym)
        return true
    }).sort((a: any, b: any) =>
        a.mse_counters.symbol.localeCompare(b.mse_counters.symbol)
    )

    const gainers = latest.filter((p: any) => Number(p.change_pct) > 0).length
    const losers = latest.filter((p: any) => Number(p.change_pct) < 0).length
    const unchanged = latest.filter((p: any) => Number(p.change_pct) === 0).length

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 4, color: 'var(--color-text-primary)' }}>
                    Malawi Stock Exchange
                </h1>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                    Live prices for all MSE-listed counters
                </p>
            </div>

            {/* Market summary pills */}
            <div style={{ display: 'flex', gap: 10, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{
                    background: 'var(--color-background-success)', borderRadius: 'var(--border-radius-md)',
                    padding: '6px 14px', fontSize: 13
                }}>
                    <span style={{ color: 'var(--color-text-success)', fontWeight: 500 }}>{gainers}</span>
                    <span style={{ color: 'var(--color-text-success)', marginLeft: 6 }}>gaining</span>
                </div>
                <div style={{
                    background: 'var(--color-background-danger)', borderRadius: 'var(--border-radius-md)',
                    padding: '6px 14px', fontSize: 13
                }}>
                    <span style={{ color: 'var(--color-text-danger)', fontWeight: 500 }}>{losers}</span>
                    <span style={{ color: 'var(--color-text-danger)', marginLeft: 6 }}>falling</span>
                </div>
                <div style={{
                    background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-md)',
                    padding: '6px 14px', fontSize: 13
                }}>
                    <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>{unchanged}</span>
                    <span style={{ color: 'var(--color-text-secondary)', marginLeft: 6 }}>unchanged</span>
                </div>
            </div>

            {/* Table */}
            <div style={{
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: 'var(--border-radius-lg)', overflow: 'hidden'
            }}>
                {/* Table header */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr 120px 100px 100px',
                    padding: '10px 16px',
                    background: 'var(--color-background-secondary)',
                    fontSize: 12, color: 'var(--color-text-tertiary)',
                    borderBottom: '0.5px solid var(--color-border-tertiary)',
                    fontWeight: 500
                }}>
                    <span>Symbol</span>
                    <span>Company</span>
                    <span style={{ textAlign: 'right' }}>Price (MK)</span>
                    <span style={{ textAlign: 'right' }}>Change</span>
                    <span style={{ textAlign: 'right' }}>Sector</span>
                </div>

                {/* Rows */}
                {latest.map((p: any, i: number) => {
                    const sym = p.mse_counters?.symbol
                    const pct = Number(p.change_pct)
                    const isUp = pct > 0
                    const isDown = pct < 0
                    return (
                        <Link key={sym} href={`/mse/${sym.toLowerCase()}`} style={{ textDecoration: 'none' }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '80px 1fr 120px 100px 100px',
                                padding: '12px 16px',
                                borderBottom: i < latest.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none',
                                alignItems: 'center',
                            }}>
                                <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text-primary)' }}>{sym}</span>
                                <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                                    {p.mse_counters?.company_name}
                                </span>
                                <span style={{ fontSize: 13, fontWeight: 500, textAlign: 'right', color: 'var(--color-text-primary)' }}>
                                    {Number(p.price).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                                <span style={{
                                    fontSize: 13, textAlign: 'right', fontWeight: 500,
                                    color: isUp ? 'var(--color-text-success)' : isDown ? 'var(--color-text-danger)' : 'var(--color-text-tertiary)'
                                }}>
                                    {p.change_pct != null ? `${isUp ? '+' : ''}${pct.toFixed(2)}%` : '—'}
                                </span>
                                <span style={{ fontSize: 12, textAlign: 'right', color: 'var(--color-text-tertiary)' }}>
                                    {p.mse_counters?.sector ?? '—'}
                                </span>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}