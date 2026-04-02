"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Link2, Unlink, Image as ImageIcon, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, Table as TableIcon,
  Heading1, Heading2, Heading3, Undo, Redo, Quote, Minus,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function ToolbarButton({
  onClick, active, children, title,
}: {
  onClick: () => void; active?: boolean; children: React.ReactNode; title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-colors ${active ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"}`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      LinkExtension.configure({ openOnClick: false, HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" } }),
      ImageExtension.configure({ inline: false, allowBase64: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: placeholder || "İçerik yazın..." }),
    ],
    content,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    editorProps: {
      attributes: { class: "prose max-w-none min-h-[200px] px-4 py-3 focus:outline-none text-sm leading-relaxed" },
    },
  });

  if (!editor) return null;

  function addLink() {
    const url = prompt("URL girin:");
    if (!url) return;
    editor!.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
  }

  function addImage() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const { getSupabaseClient } = await import("@/lib/supabase");
        const supabase = getSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "editor-images");
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
          headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
        });
        if (!res.ok) throw new Error("Yükleme başarısız");
        const data = await res.json();
        editor!.chain().focus().setImage({ src: data.url }).run();
      } catch {
        const url = prompt("Yükleme başarısız. Görsel URL'si girin:");
        if (url) editor!.chain().focus().setImage({ src: url }).run();
      }
    };
    input.click();
  }

  function addTable() {
    editor!.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }

  const s = 15;

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 px-2 py-1.5 bg-muted border-b border-border">
        {/* Undo/Redo */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Geri al"><Undo size={s} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Yinele"><Redo size={s} /></ToolbarButton>
        <div className="w-px bg-border mx-1" />

        {/* Headings */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Başlık 1"><Heading1 size={s} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Başlık 2"><Heading2 size={s} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Başlık 3"><Heading3 size={s} /></ToolbarButton>
        <div className="w-px bg-border mx-1" />

        {/* Text formatting */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Kalın"><Bold size={s} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="İtalik"><Italic size={s} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Altı çizili"><UnderlineIcon size={s} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Üstü çizili"><Strikethrough size={s} /></ToolbarButton>
        <div className="w-px bg-border mx-1" />

        {/* Alignment */}
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Sola hizala"><AlignLeft size={s} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Ortala"><AlignCenter size={s} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Sağa hizala"><AlignRight size={s} /></ToolbarButton>
        <div className="w-px bg-border mx-1" />

        {/* Lists */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Madde listesi"><List size={s} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numaralı liste"><ListOrdered size={s} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Alıntı"><Quote size={s} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Yatay çizgi"><Minus size={s} /></ToolbarButton>
        <div className="w-px bg-border mx-1" />

        {/* Link */}
        <ToolbarButton onClick={addLink} active={editor.isActive("link")} title="Link ekle"><Link2 size={s} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()} title="Linki kaldır"><Unlink size={s} /></ToolbarButton>
        <div className="w-px bg-border mx-1" />

        {/* Image & Table */}
        <ToolbarButton onClick={addImage} title="Görsel ekle"><ImageIcon size={s} /></ToolbarButton>
        <ToolbarButton onClick={addTable} title="Tablo ekle"><TableIcon size={s} /></ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Table-specific styles */}
      <style jsx global>{`
        .ProseMirror table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
        .ProseMirror th, .ProseMirror td { border: 1px solid #ddd; padding: 0.5rem; text-align: left; font-size: 0.875rem; }
        .ProseMirror th { background: #f5f5f5; font-weight: 600; }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder); color: #aaa; pointer-events: none; float: left; height: 0;
        }
        .ProseMirror img { max-width: 100%; border-radius: 0.5rem; margin: 1rem 0; }
        .ProseMirror:focus { outline: none; }
      `}</style>
    </div>
  );
}
