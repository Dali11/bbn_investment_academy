'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SuccessClient({ stories, userId }: any) {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    async function postStory() {
        if (!title || !content) return
        setLoading(true)
        await supabase.from('community_threads').insert({
            user_id: userId,
            title,
            content,
            category: 'success'
        })
        setTitle('')
        setContent('')
        setShowForm(false)
        setLoading(false)
        router.refresh()
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-medium text-gray-900">Success Stories</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Real Malawians building wealth through MSE investing</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                    {showForm ? 'Cancel' : '+ Share your story'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-gray-600 block mb-1">Story title</label>
                            <input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
                                placeholder="e.g. How I turned MK 50,000 into MK 120,000 in 2 years"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 block mb-1">Your story</label>
                            <textarea
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                rows={5}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400 resize-none"
                                placeholder="Share your investing journey to inspire others..."
                            />
                        </div>
                        <button
                            onClick={postStory}
                            disabled={loading || !title || !content}
                            className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Sharing...' : 'Share story'}
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {stories.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                        <p className="text-gray-400 text-sm">No stories yet. Share yours and inspire others.</p>
                    </div>
                ) : stories.map((story: any) => (
                    <Link key={story.id} href={`/community/${story.id}`}>
                        <div className="bg-white border border-amber-100 rounded-xl p-5 hover:border-amber-300 transition-colors cursor-pointer">
                            <div className="flex items-start gap-3">
                                <span className="text-lg mt-0.5">🌟</span>
                                <div className="flex-1">
                                    <h2 className="text-sm font-medium text-gray-900 mb-1">{story.title}</h2>
                                    <p className="text-sm text-gray-500 line-clamp-3">{story.content}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-xs font-medium text-amber-700">
                                            {story.profiles?.full_name?.[0] ?? '?'}
                                        </div>
                                        <span className="text-xs text-gray-400">{story.profiles?.full_name ?? 'Member'}</span>
                                        <span className="text-xs text-gray-300">·</span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(story.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}