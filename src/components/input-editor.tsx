"use client";

import { FC } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Heading1, Heading2, List, ListOrdered } from "lucide-react";
import { Button } from "./ui/button";

interface InputEditorProps {
  content: string;
  onChange: (value: string) => void;
}

const InputEditor: FC<InputEditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    //when use useEditor i have error Tiptap Error: SSR has been detected, please set `immediatelyRender` explicitly to `false` to avoid hydration mismatches
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    immediatelyRender: false,
  });

  return (
    <div className="border rounded-md">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-50 rounded-t-md">
        <Button
          type="button"
          variant={editor?.isActive("bold") ? "default" : "outline"}
          size="sm"
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor?.isActive("italic") ? "default" : "outline"}
          size="sm"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor?.isActive("heading", { level: 1 }) ? "default" : "outline"}
          size="sm"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor?.isActive("heading", { level: 2 }) ? "default" : "outline"}
          size="sm"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor?.isActive("bulletList") ? "default" : "outline"}
          size="sm"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor?.isActive("orderedList") ? "default" : "outline"}
          size="sm"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="p-4 min-h-[200px]" />
    </div>
  );
};

export { InputEditor };