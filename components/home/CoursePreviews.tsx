import Link from 'next/link'
import { BookOpen, BarChart2, Briefcase, ArrowRight } from 'lucide-react'
import type { Course } from '@/types/home'

const LEVEL_STYLE: Record<string, { bg: string; text: string }> = {
    beginner: { bg: 'var(--color-background-success)', text: 'var(--color-text-success)' },
    intermediate: { bg: 'var(--color-background-warning)', text: 'var(--color-text-warning)' },
    advanced: { bg: 'var(--color-background-danger)', text: 'var(--color-text-danger)' },
}

const DEFAULT_LEVEL_STYLE = { bg: 'var(--color-background-secondary)', text: 'var(--color-text-tertiary)' }
const ICONS = [BookOpen, BarChart2, Briefcase]

export function CoursePreviews({ courses }: { courses: Course[] }) {
    if (courses.length === 0) return null

    return (
        <section>
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-bold text-(--color-text-primary)">Start learning, free preview</h3>
                <Link
                    href="/learn"
                    className="flex items-center gap-1 text-sm font-medium text-(--color-text-tertiary) no-underline transition-colors hover:text-(--color-text-primary)"
                >
                    All courses <ArrowRight size={16} aria-hidden="true" />
                </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {courses.map((c, idx) => {
                    const { bg, text } = LEVEL_STYLE[c.level.toLowerCase()] ?? DEFAULT_LEVEL_STYLE
                    const Icon = ICONS[idx % ICONS.length]
                    return (
                        <Link key={c.id} href={`/learn/${c.id}`} className="group no-underline">
                            <div className="h-full rounded-(--border-radius-lg) border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-primary) p-4 shadow-(--shadow-card) transition-all hover:-translate-y-0.5 hover:shadow-(--shadow-card-hover)">
                                <div
                                    className="mb-2 flex h-9 w-9 items-center justify-center rounded-(--border-radius-md)"
                                    style={{ background: bg }}
                                >
                                    <Icon size={18} style={{ color: text }} aria-hidden="true" />
                                </div>
                                <p className="text-sm font-bold text-(--color-text-primary) transition-colors group-hover:text-(--color-text-info)">
                                    {c.title}
                                </p>
                                <span
                                    className="mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide capitalize"
                                    style={{ background: bg, color: text }}
                                >
                                    {c.level}
                                </span>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}