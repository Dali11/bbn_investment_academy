'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LessonComplete({
    lessonId,
    userId,
    isCompleted,
    courseId,
    nextLessonId,
}: {
    lessonId: string
    userId: string
    isCompleted: boolean
    courseId: string
    nextLessonId?: string
}) {
    const [done, setDone] = useState(isCompleted)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    async function markComplete() {
        setLoading(true)
        await supabase.from('lesson_progress').upsert({
            user_id: userId,
            lesson_id: lessonId,
            completed: true,
            completed_at: new Date().toISOString()
        })
        setDone(true)
        setLoading(false)
        router.refresh()
        if (nextLessonId) {
            router.push(`/learn/${courseId}/${nextLessonId}`)
        }
    }

    if (done) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 flex items-center gap-2">
                <span className="text-green-600 text-sm">✓</span>
                <span className="text-sm text-green-700 font-medium">Lesson completed</span>
            </div>
        )
    }

    return (
        <button
            onClick={markComplete}
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50"
        >
            {loading ? 'Saving...' : 'Mark as complete →'}
        </button>
    )
}