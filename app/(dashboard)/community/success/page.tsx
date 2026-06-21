import { createClient } from '@/lib/supabase/server'
import SuccessClient from './SuccessClient'

export default async function SuccessPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: stories } = await supabase
        .from('community_threads')
        .select('*, profiles(full_name)')
        .eq('category', 'success')
        .order('created_at', { ascending: false })

    return <SuccessClient stories={stories ?? []} userId={user?.id ?? ''} />
}