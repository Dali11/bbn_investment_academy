import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import LessonComplete from './LessonComplete';


export default async function LessonPage({
    params,
}: {
    params: Promise<{ courseId: string; lessonId: string }>
}) {
    const { courseId, lessonId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: lesson } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single()

    if (!lesson) notFound()

    const { data: course } = await supabase
        .from('courses')
        .select('id, title')
        .eq('id', courseId)
        .single()

    const { data: progress } = await supabase
        .from('lesson_progress')
        .select('completed')
        .eq('user_id', user?.id ?? '')
        .eq('lesson_id', lessonId)
        .single()

    const { data: allLessons } = await supabase
        .from('lessons')
        .select('id, order_index')
        .eq('course_id', courseId)
        .order('order_index')

    const currentIndex = allLessons?.findIndex(l => l.id === lessonId) ?? 0
    const nextLesson = allLessons?.[currentIndex + 1]
    const prevLesson = allLessons?.[currentIndex - 1]

    return (
        <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4 text-sm">
                <Link href="/learn" className="text-amber-600 hover:underline">Courses</Link>
                <span className="text-gray-300">→</span>
                <Link href={`/learn/${courseId}`} className="text-amber-600 hover:underline">{course?.title}</Link>
                <span className="text-gray-300">→</span>
                <span className="text-gray-500">{lesson.title}</span>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
                <div className="flex items-start justify-between mb-4">
                    <h1 className="text-xl font-medium text-gray-900">{lesson.title}</h1>
                    <div className="flex gap-2 ml-4 flex-shrink-0">
                        {lesson.has_demo && (
                            <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700">Demo</span>
                        )}
                        {lesson.has_quiz && (
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">Quiz</span>
                        )}
                    </div>
                </div>

                {lesson.video_url ? (
                    <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                        <video controls className="w-full h-full rounded-lg" src={lesson.video_url} />
                    </div>
                ) : (
                    <div className="aspect-video bg-gray-50 rounded-lg mb-4 flex items-center justify-center border border-dashed border-gray-200">
                        <p className="text-sm text-gray-400">Video coming soon</p>
                    </div>
                )}

                {lesson.notes && (
                    <div className="prose prose-sm text-gray-600 leading-relaxed">
                        <p>{lesson.notes}</p>
                    </div>
                )}

                {!lesson.notes && (
                    <p className="text-sm text-gray-400 italic">Lesson notes coming soon.</p>
                )}
            </div>

            <LessonComplete
                lessonId={lessonId}
                userId={user?.id ?? ''}
                isCompleted={progress?.completed ?? false}
                courseId={courseId}
                nextLessonId={nextLesson?.id}
            />

            <div className="flex justify-between mt-4">
                {prevLesson ? (
                    <Link href={`/learn/${courseId}/${prevLesson.id}`} className="text-sm text-amber-600 hover:underline">← Previous</Link>
                ) : <span />}
                {nextLesson ? (
                    <Link href={`/learn/${courseId}/${nextLesson.id}`} className="text-sm text-amber-600 hover:underline">Next →</Link>
                ) : (
                    <Link href={`/learn/${courseId}`} className="text-sm text-amber-600 hover:underline">Finish course →</Link>
                )}
            </div>
        </div>
    )
}