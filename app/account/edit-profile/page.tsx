'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function EditProfilePage() {
    const [fullName, setFullName] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) { router.push('/login'); return }
            setFullName(user.user_metadata?.full_name ?? '')
        })
    }, [])

    async function handleSave() {
        if (!fullName.trim()) { setError('Name cannot be empty'); return }
        setLoading(true); setError('')
        const { error } = await supabase.auth.updateUser({
            data: { full_name: fullName.trim() }
        })
        setLoading(false)
        if (error) { setError(error.message) }
        else { setSuccess(true); setTimeout(() => router.push('/account'), 1200) }
    }

    return (
        <div className="max-w-sm mx-auto py-10 px-4">
            <Link href="/account" className="mb-6 flex items-center gap-1.5 text-[12px] text-(--color-text-info) no-underline hover:underline">
                <ArrowLeft size={12} /> Back to account
            </Link>

            <h1 className="text-[18px] font-bold text-(--color-text-primary) mb-1">Edit profile</h1>
            <p className="text-[13px] text-(--color-text-tertiary) mb-6">Update your display name.</p>

            {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    Profile updated!
                </div>
            )}

            <div className="space-y-3">
                <div>
                    <label className="text-sm text-gray-600 block mb-1">Full name</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSave()}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
                        placeholder="Your full name"
                    />
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                    {loading ? 'Saving…' : 'Save changes'}
                </button>
            </div>
        </div>
    )
}