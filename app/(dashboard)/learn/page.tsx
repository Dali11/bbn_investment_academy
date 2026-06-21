import { createClient } from '@/lib/supabase/server'
import LearnPage from './LearnClient'

export default async function Page() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: courses } = await supabase
        .from('courses')
        .select('*')
        .eq('published', true)
        .order('order_index')

    const { data: progress } = await supabase
        .from('lesson_progress')
        .select('lesson_id, completed')
        .eq('user_id', user?.id ?? '')

    const { data: lessons } = await supabase
        .from('lessons')
        .select('id, course_id')

    return <LearnPage courses={courses} lessons={lessons} progress={progress} />
}