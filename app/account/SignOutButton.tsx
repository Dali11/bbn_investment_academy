'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function SignOutButton({ variant = 'icon' }: { variant?: 'icon' | 'row' }) {
    const router = useRouter()
    const supabase = createClient()

    async function handleSignOut() {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    if (variant === 'row') {
        return (
            <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 text-left"
            >
                <LogOut size={14} className="text-red-400" />
                <span className="text-[13px] text-red-500">Sign out</span>
            </button>
        )
    }

    return (
        <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 rounded-(--border-radius-md) border-[0.5px] border-(--color-border-tertiary) px-3 py-1.5 text-[12px] text-red-500 hover:bg-red-50 transition-colors"
        >
            <LogOut size={13} />
            Sign out
        </button>
    )
}