import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDistanceToNow } from 'date-fns'

export default async function AnalysisPage() {
    const supabase = await createClient()

    const { data: analyses } = await supabase
        .from('analyses')
        .select('id, title, content, created_at, mse_counters(symbol)')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(20)

    const featured = analyses?.[0]
    const rest = analyses?.slice(1) ?? []

    return (
        <div>
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 4, color: 'var(--color-text-primary)' }}>
                    Analysis
                </h1>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                    Bena Nkhoma's takes on Malawi Stock Exchange counters
                </p>
            </div>

            {/* Featured */}
            {featured && (
                <Link href={`/analysis/${featured.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                        border: '0.5px solid var(--color-border-tertiary)',
                        borderRadius: 'var(--border-radius-lg)',
                        padding: '1.25rem',
                        marginBottom: '1.5rem',
                        background: 'var(--color-background-primary)',
                        cursor: 'pointer'
                    }}>
                        <span style={{
                            background: 'var(--color-background-warning)',
                            color: 'var(--color-text-warning)',
                            fontSize: 11, padding: '3px 9px',
                            borderRadius: 'var(--border-radius-md)',
                            display: 'inline-block',
                            marginBottom: 10
                        }}>
                            Latest
                        </span>
                        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 8, color: 'var(--color-text-primary)', lineHeight: 1.4 }}>
                            {featured.title}
                        </h2>
                        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 12, lineHeight: 1.6 }}>
                            {featured.content.slice(0, 200)}…
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                            <span>Bena Nkhoma</span>
                            <span>·</span>
                            <span>{formatDistanceToNow(new Date(featured.created_at), { addSuffix: true })}</span>
                            {(featured as any).mse_counters?.symbol && (
                                <>
                                    <span>·</span>
                                    <span style={{ color: 'var(--color-text-info)' }}>
                                        {(featured as any).mse_counters.symbol}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </Link>
            )}

            {/* Rest of articles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {rest.map((a: any, i: number) => (
                    <Link key={a.id} href={`/analysis/${a.id}`} style={{ textDecoration: 'none' }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(0,1fr) auto',
                            gap: 16,
                            alignItems: 'center',
                            padding: '14px 0',
                            borderBottom: i < rest.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none',
                            cursor: 'pointer'
                        }}>
                            <div>
                                {a.mse_counters?.symbol && (
                                    <span style={{ fontSize: 11, color: 'var(--color-text-info)', display: 'block', marginBottom: 4 }}>
                                        {a.mse_counters.symbol}
                                    </span>
                                )}
                                <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)', lineHeight: 1.4, marginBottom: 4 }}>
                                    {a.title}
                                </p>
                                <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                                    {a.content.slice(0, 100)}…
                                </p>
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', whiteSpace: 'nowrap' }}>
                                    {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}