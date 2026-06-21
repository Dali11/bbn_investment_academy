import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReplyClient from './ReplyClient'


export default async function ThreadPage({
    params,
}: {
    params: Promise<{ threadId: string }>
}) {
    const { threadId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: thread } = await supabase
        .from('community_threads')
        .select('*, profiles(full_name)')
        .eq('id', threadId)
        .single()

    if (!thread) notFound()

    const { data: replies } = await supabase
        .from('community_replies')
        .select('*, profiles(full_name)')
        .eq('thread_id', threadId)
        .order('created_at')

    return (
        <div className="max-w-2xl">
            <div className="mb-4">
                <Link href="/community" className="text-sm text-amber-600 hover:underline">← Back to community</Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
                <h1 className="text-lg font-medium text-gray-900 mb-2">{thread.title}</h1>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{thread.content}</p>
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-xs font-medium text-amber-700">
                        {thread.profiles?.full_name?.[0] ?? '?'}
                    </div>
                    <span className="text-xs text-gray-400">{thread.profiles?.full_name ?? 'Member'}</span>
                    <span className="text-xs text-gray-300">·</span>
                    <span className="text-xs text-gray-400">
                        {new Date(thread.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                </div>
            </div>

            <div className="space-y-3 mb-4">
                {replies && replies.length > 0 && replies.map((reply: any) => (
                    <div key={reply.id} className="bg-white border border-gray-200 rounded-xl p-4">
                        <p className="text-sm text-gray-600 leading-relaxed">{reply.content}</p>
                        <div className="flex items-center gap-2 mt-3">
                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
                                {reply.profiles?.full_name?.[0] ?? '?'}
                            </div>
                            <span className="text-xs text-gray-400">{reply.profiles?.full_name ?? 'Member'}</span>
                            <span className="text-xs text-gray-300">·</span>
                            <span className="text-xs text-gray-400">
                                {new Date(reply.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <ReplyClient threadId={threadId} userId={user?.id ?? ''} />
        </div>
    )
}