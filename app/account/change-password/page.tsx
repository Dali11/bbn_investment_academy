'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ChangePasswordPage() {
    const [current, setCurrent] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    async function handleChange() {
        if (!password || !confirm) { setError('Fill in all fields'); return }
        if (password !== confirm) { setError('Passwords do not match'); return }
        if (password.length < 8) { setError('At least 8 characters required'); return }
        setLoading(true); setError('')
        const { error } = await supabase.auth.updateUser({ password })
        setLoading(false)
        if (error) { setError(error.message) }
        else { setSuccess(true); setTimeout(() => router.push('/account'), 1500) }
    }

    return (
        <div className="max-w-sm mx-auto py-10 px-4">
            <Link href="/account" className="mb-6 flex items-center gap-1.5 text-[12px] text-(--color-text-info) no-underline hover:underline">
                <ArrowLeft size={12} /> Back to account
            </Link>

            <h1 className="text-[18px] font-bold text-(--color-text-primary) mb-1">Change password</h1>
            <p className="text-[13px] text-(--color-text-tertiary) mb-6">Choose a strong password for your account.</p>

            {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    Password updated. Redirecting…
                </div>
            )}

            <div className="space-y-3">
                <div>
                    <label className="text-sm text-gray-600 block mb-1">New password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
                        placeholder="At least 8 characters"
                    />
                </div>

                {/* Strength indicator */}
                {password.length > 0 && (() => {
                    const strength =
                        password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 3
                            : password.length >= 8 ? 2 : 1
                    const labels = ['', 'Weak', 'Good', 'Strong']
                    const colors = ['', 'bg-red-400', 'bg-amber-400', 'bg-green-500']
                    return (
                        <div>
                            <div className="flex gap-1 mb-1">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? colors[strength] : 'bg-gray-200'}`} />
                                ))}
                            </div>
                            <p className="text-xs text-gray-400">{labels[strength]} password</p>
                        </div>
                    )
                })()}

                <div>
                    <label className="text-sm text-gray-600 block mb-1">Confirm new password</label>
                    <input
                        type="password"
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleChange()}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
                        placeholder="Repeat new password"
                    />
                </div>

                <button
                    onClick={handleChange}
                    disabled={loading}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                    {loading ? 'Saving…' : 'Update password'}
                </button>
            </div>
        </div>
    )
}