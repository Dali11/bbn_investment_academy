'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ReplyClient({ threadId, userId }: { threadId: string; userId: string }) {
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    async function postReply() {
        if (!content) return
        setLoading(true)
        await supabase.from('community_replies').insert({
            thread_id: threadId,
            user_id: userId,
            content
        })
        setContent('')
        setLoading(false)
        router.refresh()
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-medium text-gray-900 mb-3">Leave a reply</h2>
            <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400 resize-none mb-3"
                placeholder="Share your thoughts..."
            />
            <button
                onClick={postReply}
                disabled={loading || !content}
                className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
                {loading ? 'Posting...' : 'Post reply'}
            </button>
        </div>
    )
}