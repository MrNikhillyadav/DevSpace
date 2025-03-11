import {Heading1,Heading2,
Heading3,Bold,Italic,AlighCenter,Strikethrough,
AlighLeft,Highlighter,ListOrdered,List
} from 'lucide-react';

export default function MenuBar({editor}){
    if (!editor) {
        return null
    }

    const options = [
        {
            icon :<Heading1 className="size-4"/>,
            onClick : () => editor.chain().focus().toggleHeading({ level : 1}).run(),
            pressed : editor.isActive("heading", {level : 1}),
        },
        {
            icon :<Heading2 className="size-4"/>,
            onClick : () => editor.chain().focus().toggleHeading({ level : 2}).run(),
            pressed : editor.isActive("heading", {level : 2}),
        },
        {
            icon :<Heading3 className="size-4"/>,
            onClick : () => editor.chain().focus().toggleHeading({ level : 3}).run(),
            pressed : editor.isActive("heading", {level : 3}),
        },
        {
            icon :<Bold  className="size-4"/>,
            onClick : () => editor.chain().focus().toggleBold().run(),
            pressed : editor.isActive("bold"),
        },
        {
            icon :<Italic  className="size-4"/>,
            onClick : () => editor.chain().focus().toggleItalic().run(),
            pressed : editor.isActive("italic"),
        },
        {
            icon :<Strikethrough  className="size-4"/>,
            onClick : () => editor.chain().focus().toggleStrike().run(),
            pressed : editor.isActive("strike"),
        },
        {
            icon :<AlighLeft  className="size-4"/>,
            onClick : () => editor.chain().focus().toggleAlign("left").run(),
            pressed : editor.isActive({textAlign : "left"}),
        },
        {
            icon :<AlighCenter  className="size-4"/>,
            onClick : () => editor.chain().focus().toggleAlign("center").run(),
            pressed : editor.isActive({textAlign : "center"}),
        },
        {
            icon :<AlighRight  className="size-4"/>,
            onClick : () => editor.chain().focus().toggleAlign("right").run(),
            pressed : editor.isActive({textAlign : "right"}),
        },
        {
            icon :<List  className="size-4"/>,
            onClick : () => editor.chain().focus().toggleBulletList().run(),
            pressed : editor.isActive("bulletList"),
        },
        {
            icon :<ListOrdered  className="size-4"/>,
            onClick : () => editor.chain().focus().toggleOrderedList().run(),
            pressed : editor.isActive("orderedList"),
        },
        {
            icon :<Highlighter  className="size-4"/>,
            onClick : () => editor.chain().focus().toggleHighlight().run(),
            pressed : editor.isActive("highlighter"),
        },
    ]
return (
        <div className="control-group">
          <div className="button-group">
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}>
              H1
            </button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>
              H2
            </button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}>
              H3
            </button>
            <button onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive('paragraph') ? 'is-active' : ''}>
              Paragraph
            </button>
            <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>
              Bold
            </button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>
              Italic
            </button>
            <button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}>
              Strike
            </button>
            <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'is-active' : ''}>
              Highlight
            </button>
            <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}>
              Left
            </button>
            <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}>
              Center
            </button>
            <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}>
              Right
            </button>
            <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}>
              Justify
            </button>
          </div>
        </div>
)}