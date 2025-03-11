'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import MenuBar from './menuBar'


export default function RichTextEditor(){
    const editor = useEditor({
        extensions: [StarterKit],
        onUpdate: ({ editor }) => {
            const json = editor.getJSON()
            console.log('json: ', json);
            // send the content to an API here
        },
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class:
                " bg-yellow-500 flex flex-col justify-stretch min-h-[200px] border rounded border-b-0",
            },
        },
        content: '<p>Hello World!</p>',
    })
      return (
        <>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
      </>
)}