"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { postSchema } from "@/lib/schemas/post-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Heading1, Heading2, List, ListOrdered } from "lucide-react"; // Icons for toolbar

const FormEditor: FC = () => {
  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "", // Default value for content
    },
  });

  // Initialize Tiptap editor with minimal tools
  const editor = useEditor({
    extensions: [StarterKit], // Add extensions (e.g., StarterKit for basic functionality)
    content: form.watch("content"), // Sync with form content
    onUpdate: ({ editor }) => {
      const html = editor.getHTML(); // Get HTML content
      form.setValue("content", html); // Update form value
    },
  });

  function onSubmit(values: z.infer<typeof postSchema>) {
    console.log(values); // Log form values (including Tiptap content)
  }

  return (
    <div className="p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title post" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content Field with Tiptap */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export { FormEditor };