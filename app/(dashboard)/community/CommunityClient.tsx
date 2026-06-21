'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CommunityClient({ threads, userId }: any) {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    async function postThread() {
        if (!title || !content) return
        setLoading(true)
        const { error } = await supabase.from('community_threads').insert({
            user_id: userId,
            title,
            content
        })
        if (!error) {
            setTitle('')
            setContent('')
            setShowForm(false)
            router.refresh()
        }
        setLoading(false)
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-medium text-gray-900">Community</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Discuss, ask questions, share ideas</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                    {showForm ? 'Cancel' : '+ New post'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-gray-600 block mb-1">Title</label>
                            <input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
                                placeholder="What's your question or topic?"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 block mb-1">Content</label>
                            <textarea
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                rows={4}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400 resize-none"
                                placeholder="Share your thoughts, question, or analysis..."
                            />
                        </div>
                        <button
                            onClick={postThread}
                            disabled={loading || !title || !content}
                            className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {threads.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                        <p className="text-gray-400 text-sm">No posts yet. Be the first to start a discussion.</p>
                    </div>
                ) : (
                    threads.map((thread: any) => (
                        <Link key={thread.id} href={`/community/${thread.id}`}>
                            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-amber-300 transition-colors cursor-pointer">
                                <h2 className="text-sm font-medium text-gray-900 mb-1">{thread.title}</h2>
                                <p className="text-sm text-gray-500 line-clamp-2">{thread.content}</p>
                                <div className="flex items-center gap-2 mt-3">
                                    <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-xs font-medium text-amber-700">
                                        {thread.profiles?.full_name?.[0] ?? '?'}
                                    </div>
                                    <span className="text-xs text-gray-400">{thread.profiles?.full_name ?? 'Member'}</span>
                                    <span className="text-xs text-gray-300">·</span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(thread.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}