import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function LearnPage() {
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

    function getCourseProgress(courseId: string) {
        const courseLessons = lessons?.filter(l => l.course_id === courseId) ?? []
        if (courseLessons.length === 0) return 0
        const completed = courseLessons.filter(l =>
            progress?.some(p => p.lesson_id === l.id && p.completed)
        ).length
        return Math.round((completed / courseLessons.length) * 100)
    }

    const levelColors: Record<string, string> = {
        beginner: 'bg-green-50 text-green-700',
        intermediate: 'bg-blue-50 text-blue-700',
        advanced: 'bg-amber-50 text-amber-700',
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-xl font-medium text-gray-900">Learning Hub</h1>
                <p className="text-sm text-gray-500 mt-0.5">Structured courses from beginner to advanced</p>
            </div>

            {!courses || courses.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                    <p className="text-gray-400 text-sm">No courses yet. Check back soon.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {courses.map((course: any) => {
                        const pct = getCourseProgress(course.id)
                        const courseLessonCount = lessons?.filter(l => l.course_id === course.id).length ?? 0
                        return (
                            <Link key={course.id} href={`/learn/${course.id}`}>
                                <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-amber-300 transition-colors cursor-pointer">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h2 className="text-base font-medium text-gray-900">{course.title}</h2>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${levelColors[course.level] ?? 'bg-gray-50 text-gray-600'}`}>
                                                    {course.level}
                                                </span>
                                                {course.is_free && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">Free</span>
                                                )}
                                            </div>
                                            {course.description && (
                                                <p className="text-sm text-gray-500">{course.description}</p>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400 ml-4 mt-1">{courseLessonCount} lessons</span>
                                    </div>
                                    <div className="mt-3">
                                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                                            <span>Progress</span>
                                            <span>{pct}%</span>
                                        </div>
                                        <div className="h-1 bg-gray-100 rounded-full">
                                            <div className="h-1 bg-amber-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}