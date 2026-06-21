import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: course } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single()

    if (!course) notFound()

    const { data: lessons } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index')

    const { data: progress } = await supabase
        .from('lesson_progress')
        .select('lesson_id, completed')
        .eq('user_id', user?.id ?? '')

    const completedIds = new Set(
        progress?.filter(p => p.completed).map(p => p.lesson_id) ?? []
    )

    const completedCount = lessons?.filter(l => completedIds.has(l.id)).length ?? 0
    const totalCount = lessons?.length ?? 0
    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    return (
        <div>
            <div className="mb-2">
                <Link href="/learn" className="text-sm text-amber-600 hover:underline">← Back to courses</Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <h1 className="text-xl font-medium text-gray-900">{course.title}</h1>
                        {course.description && (
                            <p className="text-sm text-gray-500 mt-1">{course.description}</p>
                        )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ml-4 ${course.level === 'beginner' ? 'bg-green-50 text-green-700' :
                            course.level === 'intermediate' ? 'bg-blue-50 text-blue-700' :
                                'bg-amber-50 text-amber-700'
                        }`}>{course.level}</span>
                </div>
                <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>{completedCount} of {totalCount} lessons completed</span>
                        <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full">
                        <div className="h-1.5 bg-amber-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {!lessons || lessons.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-400">No lessons yet.</div>
                ) : (
                    lessons.map((lesson: any, index: number) => {
                        const done = completedIds.has(lesson.id)
                        return (
                            <Link key={lesson.id} href={`/learn/${courseId}/${lesson.id}`}>
                                <div className={`flex items-center gap-4 px-5 py-4 border-b border-gray-50 hover:bg-amber-50 transition-colors ${index === lessons.length - 1 ? 'border-b-0' : ''}`}>
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${done ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {done ? '✓' : index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-medium ${done ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                            {lesson.title}
                                        </p>
                                        <div className="flex gap-2 mt-0.5">
                                            {lesson.has_demo && (
                                                <span className="text-xs text-amber-600">● Demo</span>
                                            )}
                                            {lesson.has_quiz && (
                                                <span className="text-xs text-blue-500">● Quiz</span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-gray-300 text-sm">→</span>
                                </div>
                            </Link>
                        )
                    })
                )}
            </div>
        </div>
    )
}