import { createClient } from '@/lib/supabase/server'
import QAClient from './QAClient'

export default async function QAPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: threads } = await supabase
        .from('community_threads')
        .select('*, profiles(full_name)')
        .eq('category', 'qa')
        .order('created_at', { ascending: false })

    return <QAClient threads={threads ?? []} userId={user?.id ?? ''} />
}