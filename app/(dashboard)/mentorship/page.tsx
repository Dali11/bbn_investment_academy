import { createClient } from '@/lib/supabase/server'
import MentorshipClient from './MentorshipClient'


export default async function MentorshipPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: slots } = await supabase
        .from('mentorship_slots')
        .select('*')
        .gte('slot_datetime', new Date().toISOString())
        .order('slot_datetime')

    const { data: bookings } = await supabase
        .from('mentorship_bookings')
        .select('*, mentorship_slots(slot_datetime)')
        .eq('user_id', user?.id ?? '')
        .order('created_at', { ascending: false })

    return (
        <MentorshipClient
            slots={slots ?? []}
            bookings={bookings ?? []}
            userId={user?.id ?? ''}
        />
    )
}