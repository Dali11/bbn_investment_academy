import { createClient } from '@/lib/supabase/server'
import CommunityClient from './CommunityClient'


export default async function CommunityPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: threads } = await supabase
        .from('community_threads')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false })

    return (
        <CommunityClient
            threads={threads ?? []}
            userId={user?.id ?? ''}
        />
    )
}