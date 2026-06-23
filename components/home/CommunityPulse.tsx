import Link from 'next/link'
import { MessageCircle, ArrowRight } from 'lucide-react'
import { getSymbol, type CommunityThread } from '@/types/home'

export function CommunityPulse({ threads }: { threads: CommunityThread[] }) {
    if (threads.length === 0) return null

    return (
        <section>
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-bold text-(--color-text-primary)">Community pulse</h3>
                <Link
                    href="/community"
                    className="flex items-center gap-1 text-sm font-medium text-(--color-text-tertiary) no-underline transition-colors hover:text-(--color-text-primary)"
                >
                    See all <ArrowRight size={16} aria-hidden="true" />
                </Link>
            </div>
            <div className="divide-y-[0.5px] divide-(--color-border-tertiary)">
                {threads.map((t) => {
                    const symbol = getSymbol(t.mse_counters)
                    return (
                        <Link key={t.id} href={`/community/${t.id}`} className="block no-underline">
                            <div className="flex items-center gap-4 rounded-(--border-radius-md) py-3 transition-colors hover:bg-(--color-background-secondary)">
                                <MessageCircle size={18} className="shrink-0 text-(--color-text-tertiary)" aria-hidden="true" />
                                <span className="flex-1 text-sm font-medium leading-snug text-(--color-text-primary)">{t.title}</span>
                                <div className="flex shrink-0 items-center gap-2">
                                    {symbol && (
                                        <span className="rounded-full bg-(--color-background-info) px-2.5 py-0.5 text-[10px] font-semibold text-(--color-text-info)">
                                            {symbol}
                                        </span>
                                    )}
                                    <span className="font-(family-name:--font-mono) text-xs text-(--color-text-tertiary)">
                                        {t.reply_count ?? 0} {t.reply_count === 1 ? 'reply' : 'replies'}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}