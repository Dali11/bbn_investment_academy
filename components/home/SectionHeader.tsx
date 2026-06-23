// components/home/SectionHeader.tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function SectionHeader({
    title,
    href,
    linkLabel,
    size = 16,
}: {
    title: string
    href: string
    linkLabel: string
    size?: number
}) {
    return (
        <div className="mb-3 flex items-center justify-between">
            <h3 className={`font-semibold text-(--color-text-primary) ${size >= 18 ? 'text-[17px]' : 'text-[15px]'}`}>
                {title}
            </h3>
            <Link
                href={href}
                className="flex items-center gap-1 text-[13px] font-medium text-(--color-text-tertiary) no-underline transition-colors hover:text-(--color-text-primary)"
            >
                {linkLabel}
                <ArrowRight size={12} aria-hidden="true" />
            </Link>
        </div>
    )
}