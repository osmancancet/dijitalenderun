"use client";

import { useState } from "react";
import { useCollection } from "@/hooks/useCollection";
import { addDocument, updateDocument, deleteDocument } from "@/lib/firestore";
import ImageUpload from "@/components/admin/ImageUpload";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { slugify } from "@/lib/utils/slug";
import type { BlogPost } from "@/types";

const COLLECTION = "blog";

export default function AdminBlogPage() {
  const { items, loading } = useCollection<BlogPost>(COLLECTION);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "", slug: "", content: "", excerpt: "", coverImageUrl: "", tags: "", isPublished: true,
  });
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing(null);
    setForm({ title: "", slug: "", content: "", excerpt: "", coverImageUrl: "", tags: "", isPublished: true });
    setShowForm(true);
  }

  function openEdit(item: BlogPost) {
    setEditing(item);
    setForm({
      title: item.title, slug: item.slug, content: item.content, excerpt: item.excerpt,
      coverImageUrl: item.coverImageUrl || "", tags: item.tags.join(", "), isPublished: item.isPublished,
    });
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const data = {
        title: form.title,
        slug: form.slug || slugify(form.title),
        content: form.content,
        excerpt: form.excerpt,
        coverImageUrl: form.coverImageUrl,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        isPublished: form.isPublished,
      };
      if (editing) {
        await updateDocument(COLLECTION, editing.id, data);
      } else {
        await addDocument(COLLECTION, data);
      }
      setShowForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;
    await deleteDocument(COLLECTION, id);
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog & Duyurular</h1>
          <p className="text-sm text-gray-500 mt-1">Blog yazılarını ve duyuruları yönetin</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors">
          <Plus size={16} /> Yeni Yazı
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{editing ? "Yazıyı Düzenle" : "Yeni Yazı"}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Başlık</label>
                <input type="text" value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Özet</label>
                <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">İçerik (HTML)</label>
                <textarea rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kapak Görseli</label>
                <ImageUpload folder="blog" value={form.coverImageUrl} onChange={(url) => setForm({ ...form, coverImageUrl: url })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Etiketler (virgülle ayırın)</label>
                <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Sağlık, Mevzuat, Eğitim" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="published" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="accent-primary" />
                <label htmlFor="published" className="text-sm">Yayınla</label>
              </div>
              <button onClick={handleSave} disabled={saving} className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors disabled:opacity-50">
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Başlık</th>
              <th className="px-4 py-3 font-medium">Etiketler</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Henüz yazı eklenmemiş.</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-gray-500">{item.tags?.join(", ")}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {item.isPublished ? "Yayında" : "Taslak"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(item)} className="text-blue-600 hover:text-blue-800"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
