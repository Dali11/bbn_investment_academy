import { createClient } from '@/lib/supabase/server'

export default async function AnalysisPage() {
    const supabase = await createClient()

    const { data: analyses } = await supabase
        .from('analyses')
        .select('*, mse_counters(symbol, company_name)')
        .eq('published', true)
        .order('created_at', { ascending: false })

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-xl font-medium text-gray-900">Daily Analysis</h1>
                <p className="text-sm text-gray-500 mt-0.5">Bena's latest MSE stock breakdowns</p>
            </div>

            {!analyses || analyses.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                    <p className="text-gray-400 text-sm">No analysis posts yet.</p>
                    <p className="text-gray-400 text-sm mt-1">Check back soon.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {analyses.map((post: any) => (
                        <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h2 className="text-base font-medium text-gray-900">{post.title}</h2>
                                    {post.mse_counters && (
                                        <p className="text-xs text-amber-600 mt-0.5">{post.mse_counters.symbol} · {post.mse_counters.company_name}</p>
                                    )}
                                </div>
                                <span className="text-xs text-gray-400">
                                    {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                            </div>

                            {(post.price_at_post || post.pe_at_post || post.market_cap_at_post) && (
                                <div className="grid grid-cols-3 gap-3 mb-3">
                                    {post.price_at_post && (
                                        <div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
                                            <p className="text-sm font-medium text-gray-900">MK {Number(post.price_at_post).toLocaleString()}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">Price</p>
                                        </div>
                                    )}
                                    {post.pe_at_post && (
                                        <div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
                                            <p className="text-sm font-medium text-gray-900">{post.pe_at_post}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">PE ratio</p>
                                        </div>
                                    )}
                                    {post.market_cap_at_post && (
                                        <div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
                                            <p className="text-sm font-medium text-gray-900">MK {(Number(post.market_cap_at_post) / 1e9).toFixed(1)}B</p>
                                            <p className="text-xs text-gray-400 mt-0.5">Market cap</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <p className="text-sm text-gray-600 leading-relaxed">{post.content}</p>

                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs font-medium text-amber-700">B</div>
                                <span className="text-xs text-gray-400">Benedicto Bena Nkhoma</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}