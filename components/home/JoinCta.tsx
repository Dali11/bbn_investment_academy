import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export function JoinCta() {
  return (
    <div
      className="overflow-hidden rounded-(--border-radius-lg) border-[0.5px] shadow-(--shadow-card)"
      style={{
        borderColor: 'var(--color-text-warning)',
        background: 'linear-gradient(to right, var(--color-background-warning), var(--color-background-primary))',
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-(--border-radius-md)"
            style={{ background: 'var(--color-background-warning)' }}
          >
            <Sparkles size={18} className="text-(--color-text-warning)" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold text-(--color-text-warning)">
              Unlock the simulator, mentorship &amp; certificates
            </p>
            <p className="text-xs text-(--color-text-secondary)">Free account, no card required.</p>
          </div>
        </div>
        <Link
          href="/signup"
          className="shrink-0 rounded-(--border-radius-md) bg-[#ef9f27] px-5 py-2 text-sm font-bold text-[#412402] no-underline transition-all hover:scale-105 hover:shadow-(--shadow-card-hover)"
        >
          Join free →
        </Link>
      </div>
    </div>
  )
}