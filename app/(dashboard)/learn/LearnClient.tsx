'use client'
import { useState } from 'react'
import Link from 'next/link'

const levelColors: Record<string, string> = {
    beginner: 'bg-green-50 text-green-700',
    intermediate: 'bg-blue-50 text-blue-700',
    advanced: 'bg-amber-50 text-amber-700',
}

const tracks = [
    {
        key: 'investing',
        label: '📈 Investing',
        description: 'Learn how to invest on the Malawi Stock Exchange',
        courses: [
            'Investing basics for Malawians',
            'Reading MSE financial reports',
            'Portfolio building strategy',
            'Advanced MSE analysis'
        ]
    },
    {
        key: 'personal',
        label: '💰 Personal Finance',
        description: 'Master your money before you invest',
        courses: ['Personal Finance Fundamentals']
    },
    {
        key: 'wealth',
        label: '🏆 Wealth Creation',
        description: 'Long-term strategies to build lasting wealth',
        courses: ['Wealth Creation through MSE']
    }
]

export default function LearnPage({ courses, lessons, progress }: any) {
    const [activeTab, setActiveTab] = useState('investing')

    const activeTrack = tracks.find(t => t.key === activeTab)

    const trackCourses = courses?.filter((c: any) =>
        activeTrack?.courses.includes(c.title)
    ) ?? []

    function getCourseProgress(courseId: string) {
        const courseLessons = lessons?.filter((l: any) => l.course_id === courseId) ?? []
        if (courseLessons.length === 0) return 0
        const completed = courseLessons.filter((l: any) =>
            progress?.some((p: any) => p.lesson_id === l.id && p.completed)
        ).length
        return Math.round((completed / courseLessons.length) * 100)
    }

    return (
        <div>
            <div className="mb-4">
                <h1 className="text-xl font-medium text-gray-900">Learning Hub</h1>
                <p className="text-sm text-gray-500 mt-0.5">{activeTrack?.description}</p>
            </div>

            <div className="flex gap-0 mb-6 border-b border-gray-200">
                {tracks.map(track => (
                    <button
                        key={track.key}
                        onClick={() => setActiveTab(track.key)}
                        className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${activeTab === track.key
                                ? 'border-amber-600 text-amber-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        {track.label}
                    </button>
                ))}
            </div>

            {trackCourses.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                    <p className="text-sm text-gray-400">Courses coming soon</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {trackCourses.map((course: any) => {
                        const pct = getCourseProgress(course.id)
                        const courseLessonCount = lessons?.filter((l: any) => l.course_id === course.id).length ?? 0
                        return (
                            <Link key={course.id} href={`/learn/${course.id}`}>
                                <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-amber-300 transition-colors cursor-pointer">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <h2 className="text-sm font-medium text-gray-900">{course.title}</h2>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${levelColors[course.level] ?? 'bg-gray-50 text-gray-600'}`}>
                                                    {course.level}
                                                </span>
                                                {course.is_free && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">Free</span>
                                                )}
                                            </div>
                                            {course.description && (
                                                <p className="text-sm text-gray-500 leading-relaxed">{course.description}</p>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400 ml-4 mt-1 flex-shrink-0">{courseLessonCount} lessons</span>
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