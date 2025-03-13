'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import MenuBar from './menuBar'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import { useEffect, useState } from 'react'

interface RichTextEditorInterface {
  content: string,
  onChange: (content: string) => void;
  setContent?: (content: string) => void;
}

export default function RichTextEditor({content, onChange, setContent}: RichTextEditorInterface) {
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    HTMLAttributes: {
                        class: 'list-disc ml-4',
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: 'list-decimal ml-4',
                    },
                }
            }),
            TextAlign.configure({
              types: ['heading', 'paragraph'],
            }),
            Highlight.configure({
                HTMLAttributes: {
                  class: 'bg-white p-1',
                },
            })
        ],
        onUpdate: ({ editor }) => {
            const html = editor?.getHTML();
            onChange(html);
            if (setContent) {
                setContent(html);
            }
        },
        content: content,
        editorProps: {
            attributes: {
                class:
                "w-full bg-zinc-800 font-normal border-zinc-700 p-4 border rounded-md text-white min-h-[200px]",
            },
        },
        immediatelyRender: false,
    });

    // Update editor content when content prop changes
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!isMounted) {
        return (
            <div className="w-full bg-zinc-800 font-normal border-zinc-700 p-4 border rounded-md text-white min-h-[200px]">
                Loading editor...
            </div>
        );
    }

    return (
        <>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </>
    );
}