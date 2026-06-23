import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDistanceToNow } from 'date-fns'
import { notFound } from 'next/navigation'

export default async function AnalysisArticlePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    const { data: article } = await supabase
        .from('analyses')
        .select('id, title, content, created_at, price_at_post, pe_at_post, market_cap_at_post, mse_counters(symbol, company_name)')
        .eq('id', id)
        .eq('published', true)
        .single()

    if (!article) notFound()

    const symbol = (article as any).mse_counters?.symbol
    const company = (article as any).mse_counters?.company_name

    // // Fetch latest price for this counter
    // const { data: latestPrice } = symbol ? await supabase
    //     .from('mse_prices')
    //     .select('price, change_pct')
    //     .eq('counter_id', supabase.from('mse_counters').select('id').eq('symbol', symbol).limit(1))
    //     .order('price_date', { ascending: false })
    //     .limit(1)
    //     .then(r => r) : { data: null }

    return (
        <div style={{ maxWidth: 720, margin: '0 auto' }}>

            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: '1.25rem' }}>
                <Link href="/analysis" style={{ color: 'var(--color-text-info)', textDecoration: 'none' }}>Analysis</Link>
                <span>›</span>
                {symbol && <span style={{ color: 'var(--color-text-info)' }}>{symbol}</span>}
                {symbol && <span>›</span>}
                <span>Article</span>
            </div>

            {/* Stock badge */}
            {symbol && (
                <Link href={`/mse/${symbol.toLowerCase()}`} style={{ textDecoration: 'none' }}>
                    <span style={{
                        display: 'inline-block', marginBottom: 12,
                        background: 'var(--color-background-info)',
                        color: 'var(--color-text-info)',
                        fontSize: 12, padding: '4px 10px',
                        borderRadius: 'var(--border-radius-md)',
                        fontWeight: 500
                    }}>
                        {symbol} — {company}
                    </span>
                </Link>
            )}

            {/* Title */}
            <h1 style={{ fontSize: 26, fontWeight: 500, lineHeight: 1.35, marginBottom: 12, color: 'var(--color-text-primary)' }}>
                {article.title}
            </h1>

            {/* Meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-tertiary)', marginBottom: '1.5rem' }}>
                <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'var(--color-background-warning)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 500, color: 'var(--color-text-warning)'
                }}>BN</div>
                <span style={{ color: 'var(--color-text-secondary)' }}>Bena Nkhoma</span>
                <span>·</span>
                <span>{formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}</span>
            </div>

            {/* Price snapshot at time of post */}
            {(article.price_at_post || article.pe_at_post || article.market_cap_at_post) && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: 10, marginBottom: '1.5rem'
                }}>
                    {article.price_at_post && (
                        <div style={{ background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-md)', padding: '10px 12px' }}>
                            <p style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>Price at post</p>
                            <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-text-primary)' }}>
                                MK {Number(article.price_at_post).toLocaleString()}
                            </p>
                        </div>
                    )}
                    {article.pe_at_post && (
                        <div style={{ background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-md)', padding: '10px 12px' }}>
                            <p style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>P/E ratio</p>
                            <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-text-primary)' }}>
                                {Number(article.pe_at_post).toFixed(2)}x
                            </p>
                        </div>
                    )}
                    {article.market_cap_at_post && (
                        <div style={{ background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-md)', padding: '10px 12px' }}>
                            <p style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>Market cap</p>
                            <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-text-primary)' }}>
                                MK {(Number(article.market_cap_at_post) / 1_000_000_000).toFixed(1)}B
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Article body */}
            <div style={{
                fontSize: 15,
                lineHeight: 1.8,
                color: 'var(--color-text-primary)',
                borderTop: '0.5px solid var(--color-border-tertiary)',
                paddingTop: '1.5rem',
                marginBottom: '2rem'
            }}>
                {article.content.split('\n').map((para: string, i: number) =>
                    para.trim() ? (
                        <p key={i} style={{ marginBottom: '1rem' }}>{para}</p>
                    ) : null
                )}
            </div>

            {/* Footer CTA */}
            <div style={{
                background: 'var(--color-background-secondary)',
                borderRadius: 'var(--border-radius-lg)',
                padding: '1rem 1.25rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap'
            }}>
                <div>
                    <p style={{ fontWeight: 500, fontSize: 14, marginBottom: 4, color: 'var(--color-text-primary)' }}>
                        Want to discuss this analysis?
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                        Join the community to share your take on {symbol ?? 'this stock'}.
                    </p>
                </div>
                <Link href="/signup" style={{
                    background: 'var(--color-background-warning)',
                    color: 'var(--color-text-warning)',
                    borderRadius: 'var(--border-radius-md)',
                    fontSize: 13, padding: '7px 16px',
                    textDecoration: 'none', fontWeight: 500
                }}>
                    Join free
                </Link>
            </div>
        </div>
    )
}