'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminPage() {
    const [counters, setCounters] = useState<any[]>([])
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [counterId, setCounterId] = useState('')
    const [price, setPrice] = useState('')
    const [pe, setPe] = useState('')
    const [marketCap, setMarketCap] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()

    useEffect(() => {
        supabase.from('mse_counters').select('*').order('symbol').then(({ data }) => {
            if (data) setCounters(data)
        })
    }, [])

    function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            setError('Please select an image file')
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be under 5MB')
            return
        }

        setError(null)
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    function clearImage() {
        setImageFile(null)
        setImagePreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    async function uploadImage(): Promise<string | null> {
        if (!imageFile) return null

        const ext = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const { error: uploadError } = await supabase.storage
            .from('analysis-images')
            .upload(fileName, imageFile)

        if (uploadError) {
            throw new Error(`Image upload failed: ${uploadError.message}`)
        }

        const { data } = supabase.storage.from('analysis-images').getPublicUrl(fileName)
        return data.publicUrl
    }

    async function handlePost() {
        if (!title || !content) return
        setLoading(true)
        setError(null)

        try {
            const imageUrl = await uploadImage()

            const { error: insertError } = await supabase.from('analyses').insert({
                title,
                content,
                counter_id: counterId ? parseInt(counterId) : null,
                price_at_post: price ? parseFloat(price) : null,
                pe_at_post: pe ? parseFloat(pe) : null,
                market_cap_at_post: marketCap ? parseFloat(marketCap) : null,
                image_url: imageUrl,
                published: true,
            })

            if (insertError) throw new Error(insertError.message)

            setSuccess(true)
            setTitle('')
            setContent('')
            setCounterId('')
            setPrice('')
            setPe('')
            setMarketCap('')
            clearImage()
            setTimeout(() => setSuccess(false), 3000)
        } catch (err: any) {
            setError(err.message ?? 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-xl font-medium text-gray-900">
                        <span className="text-amber-600">BBN</span> Admin
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">Post daily analysis</p>
                </div>

                {success && (
                    <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                        Analysis posted successfully
                    </div>
                )}

                {error && (
                    <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {error}
                    </div>
                )}

                <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                    <div>
                        <label className="text-sm text-gray-600 block mb-1">Title</label>
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
                            placeholder="e.g. NBM looking strong this week"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600 block mb-1">Image (optional)</label>
                        {imagePreview ? (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-40 object-cover rounded-lg border border-gray-200"
                                />
                                <button
                                    onClick={clearImage}
                                    type="button"
                                    className="absolute top-2 right-2 bg-white border border-gray-200 rounded-full w-7 h-7 text-sm text-gray-600 hover:bg-gray-50"
                                    aria-label="Remove image"
                                >
                                    ×
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full border border-dashed border-gray-300 rounded-lg px-3 py-6 text-sm text-gray-500 hover:border-amber-400 hover:text-amber-600 transition-colors"
                            >
                                Click to upload an image
                            </button>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                        <p className="text-xs text-gray-400 mt-1">JPG or PNG, up to 5MB</p>
                    </div>

                    <div>
                        <label className="text-sm text-gray-600 block mb-1">Stock counter</label>
                        <select
                            value={counterId}
                            onChange={e => setCounterId(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
                        >
                            <option value="">General commentary (no specific stock)</option>
                            {counters.map(c => (
                                <option key={c.id} value={c.id}>{c.symbol} — {c.company_name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="text-sm text-gray-600 block mb-1">Price (MK)</label>
                            <input
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                type="number"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
                                placeholder="4584"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 block mb-1">PE ratio</label>
                            <input
                                value={pe}
                                onChange={e => setPe(e.target.value)}
                                type="number"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
                                placeholder="7.85"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 block mb-1">Market cap (MK)</label>
                            <input
                                value={marketCap}
                                onChange={e => setMarketCap(e.target.value)}
                                type="number"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
                                placeholder="2100000000000"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-gray-600 block mb-1">Analysis</label>
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            rows={6}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400 resize-none"
                            placeholder="Write your stock analysis here..."
                        />
                    </div>

                    <button
                        onClick={handlePost}
                        disabled={loading || !title || !content}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {loading ? (imageFile ? 'Uploading image…' : 'Posting...') : 'Publish analysis'}
                    </button>
                </div>
            </div>
        </div>
    )
}