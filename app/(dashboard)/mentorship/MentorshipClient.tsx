'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function MentorshipClient({ slots, bookings, userId }: any) {
    const [selectedSlot, setSelectedSlot] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const router = useRouter()
    const supabase = createClient()

    const availableSlots = slots.filter((s: any) => !s.is_booked)

    async function bookSlot() {
        if (!selectedSlot) return
        setLoading(true)
        setMessage('')

        const { error } = await supabase.from('mentorship_bookings').insert({
            user_id: userId,
            slot_id: selectedSlot,
            amount_paid: 15000,
            payment_status: 'pending'
        })

        if (!error) {
            await supabase.from('mentorship_slots')
                .update({ is_booked: true })
                .eq('id', selectedSlot)
            setMessage('Session booked successfully. Payment instructions will be sent to your email.')
            setSelectedSlot('')
            router.refresh()
        } else {
            setMessage('Booking failed. Please try again.')
        }
        setLoading(false)
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-xl font-medium text-gray-900">Mentorship</h1>
                <p className="text-sm text-gray-500 mt-0.5">Book a 1-on-1 session with Benedicto Bena Nkhoma</p>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-6 lg:grid-cols-3">
                <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-lg font-medium text-amber-700">B</div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Benedicto Bena Nkhoma</p>
                                <p className="text-xs text-gray-400">25+ years banking · MSE investor</p>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-500">
                            {['Portfolio review', 'Stock selection guidance', 'Financial planning', 'Investment strategy', 'MSE market analysis'].map(item => (
                                <div key={item} className="flex items-center gap-2">
                                    <span className="text-green-500 text-xs">✓</span>
                                    {item}
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-400">Session duration</p>
                            <p className="text-sm font-medium text-gray-900">45 minutes</p>
                            <p className="text-xs text-gray-400 mt-2">Session fee</p>
                            <p className="text-sm font-medium text-amber-600">MK 15,000</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <h2 className="text-sm font-medium text-gray-900 mb-4">Available slots</h2>

                        {message && (
                            <div className={`mb-4 text-sm px-3 py-2 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                                {message}
                            </div>
                        )}

                        {availableSlots.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-8">No available slots right now. Check back soon.</p>
                        ) : (
                            <div className="grid grid-cols-2 gap-2 mb-4 sm:grid-cols-3">
                                {availableSlots.map((slot: any) => {
                                    const dt = new Date(slot.slot_datetime)
                                    const isSelected = selectedSlot === slot.id
                                    return (
                                        <button
                                            key={slot.id}
                                            onClick={() => setSelectedSlot(isSelected ? '' : slot.id)}
                                            className={`p-3 rounded-lg border text-left transition-colors ${isSelected ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50'}`}
                                        >
                                            <p className="text-xs font-medium text-gray-900">
                                                {dt.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </button>
                                    )
                                })}
                            </div>
                        )}

                        <button
                            onClick={bookSlot}
                            disabled={loading || !selectedSlot}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Booking...' : `Confirm booking — MK 15,000`}
                        </button>
                    </div>
                </div>
            </div>

            {bookings.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h2 className="text-sm font-medium text-gray-900 mb-4">Your bookings</h2>
                    <div className="space-y-2">
                        {bookings.map((b: any) => {
                            const dt = new Date(b.mentorship_slots?.slot_datetime)
                            return (
                                <div key={b.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                    <div>
                                        <p className="text-sm text-gray-900">
                                            {dt.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${b.payment_status === 'paid' ? 'bg-green-50 text-green-700' : b.payment_status === 'cancelled' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-700'}`}>
                                        {b.payment_status}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}