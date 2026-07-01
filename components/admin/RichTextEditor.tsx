// components/admin/RichTextEditor.tsx
// Minimal rich-text editor for writing analysis content — bold, italic,
// headings, lists, blockquote, links. Deliberately kept to exactly the
// tags .bbn-article-body in globals.css knows how to style (see that
// file) — no table/image/color extensions, since the published article
// view wouldn't render them any differently than plain text anyway.
//
// Outputs HTML via onChange (editor.getHTML()), matching what
// article.content already expects (rendered via dangerouslySetInnerHTML
// in /research/[id]/page.tsx).

'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, Link as LinkIcon, Undo, Redo } from 'lucide-react'

export function RichTextEditor({
    content,
    onChange,
}: {
    content: string
    onChange: (html: string) => void
}) {
    const editor = useEditor({
        // Avoids a Next.js SSR hydration mismatch warning — Tiptap renders
        // client-only anyway since this whole component is 'use client'.
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                link: {
                    openOnClick: false,
                    HTMLAttributes: { rel: 'noopener noreferrer' },
                },
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: 'bbn-article-body min-h-[240px] outline-none px-3 py-2.5',
            },
        },
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
    })

    // Re-syncs the editor when a different analysis is loaded into the
    // same mounted instance (switching into/out of edit mode) — without
    // this, the editor keeps showing whatever was typed into it first.
    useEffect(() => {
        if (!editor) return
        if (content !== editor.getHTML()) {
            editor.commands.setContent(content, { emitUpdate: false })
        }
    }, [content, editor])

    if (!editor) {
        return (
            <div className="flex min-h-[280px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-[12px] text-gray-400">
                Loading editor…
            </div>
        )
    }

    function setLink() {
        const previousUrl = editor!.getAttributes('link').href as string | undefined
        const url = window.prompt('URL', previousUrl ?? 'https://')
        if (url === null) return
        if (url.trim() === '') {
            editor!.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }
        editor!.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
    }

    const buttons: Array<{ icon: typeof Bold; action: () => void; active: boolean; label: string }> = [
        { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), label: 'Bold' },
        { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), label: 'Italic' },
        { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }), label: 'Heading' },
        { icon: Heading3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }), label: 'Subheading' },
        { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList'), label: 'Bullet list' },
        { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList'), label: 'Numbered list' },
        { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote'), label: 'Quote' },
        { icon: LinkIcon, action: setLink, active: editor.isActive('link'), label: 'Link' },
    ]

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200">
            <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
                {buttons.map(({ icon: Icon, action, active, label }) => (
                    <button
                        key={label}
                        type="button"
                        onClick={action}
                        title={label}
                        aria-label={label}
                        className={`cursor-pointer rounded-md border-none p-1.5 transition-colors ${active ? 'bg-gray-900 text-white' : 'bg-transparent text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <Icon size={14} />
                    </button>
                ))}
                <div className="mx-1 h-4 w-px bg-gray-200" />
                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    title="Undo"
                    aria-label="Undo"
                    className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-gray-600 hover:bg-gray-200"
                >
                    <Undo size={14} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    title="Redo"
                    aria-label="Redo"
                    className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-gray-600 hover:bg-gray-200"
                >
                    <Redo size={14} />
                </button>
            </div>
            <EditorContent editor={editor} className="bg-white text-[13px]" />
        </div>
    )
}
