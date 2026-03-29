"use client";

import { useState } from "react";
import { useAdminCollection, adminAdd, adminUpdate, adminDelete } from "@/hooks/useAdminCollection";
import ImageUpload from "@/components/admin/ImageUpload";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import dynamic from "next/dynamic";
import { slugify } from "@/lib/utils/slug";
import type { Biyografi } from "@/types";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), { ssr: false });

const COLLECTION = "biyografiler";

export default function AdminBiyografilerPage() {
  const { items, loading, refresh } = useAdminCollection<Biyografi>(COLLECTION);
  const [editing, setEditing] = useState<Biyografi | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "", title: "", photoUrl: "", bio: "", slug: "", isActive: true,
  });
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing(null);
    setForm({ name: "", title: "", photoUrl: "", bio: "", slug: "", isActive: true });
    setShowForm(true);
  }

  function openEdit(item: Biyografi) {
    setEditing(item);
    setForm({
      name: item.name, title: item.title || "", photoUrl: item.photoUrl || "",
      bio: item.bio, slug: item.slug, isActive: item.isActive,
    });
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const data = { ...form, slug: form.slug || slugify(form.name) };
      if (editing) {
        await adminUpdate(COLLECTION, editing.id, data);
      } else {
        await adminAdd(COLLECTION, data);
      }
      setShowForm(false);
      refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu biyografiyi silmek istediğinize emin misiniz?")) return;
    await adminDelete(COLLECTION, id);
    refresh();
  }

  if (loading) return <LoadingSpinner />;

  const inputCls = "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Biyografiler</h1>
          <p className="text-sm text-gray-500 mt-1">SBKY alanındaki önemli isimlerin biyografilerini yönetin</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors">
          <Plus size={16} /> Yeni Biyografi
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{editing ? "Biyografiyi Düzenle" : "Yeni Biyografi"}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Ad Soyad</label>
                  <input type="text" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
                    className={inputCls} placeholder="ör: Max Weber" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unvan / Dönem</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className={inputCls} placeholder="ör: Alman Sosyolog (1864-1920)" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={`${inputCls} text-gray-400`} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fotoğraf</label>
                <ImageUpload folder="biyografiler" value={form.photoUrl} onChange={(url) => setForm({ ...form, photoUrl: url })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Biyografi İçeriği</label>
                <RichTextEditor content={form.bio} onChange={(html) => setForm({ ...form, bio: html })} placeholder="Biyografi metnini yazın..." />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-primary" />
                <label htmlFor="active" className="text-sm">Aktif</label>
              </div>
              <button onClick={handleSave} disabled={saving} className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors disabled:opacity-50">
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.length === 0 ? (
          <p className="col-span-full text-center text-gray-400 py-8">Henüz biyografi eklenmemiş.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-white border border-border rounded-lg overflow-hidden shadow-sm group relative">
              {item.photoUrl ? (
                <div className="aspect-square bg-gray-100">
                  <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-square bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                  <span className="text-2xl text-white font-bold">{item.name.split(" ").map(w => w[0]).join("")}</span>
                </div>
              )}
              <div className="p-2">
                <p className="text-xs font-bold text-foreground truncate">{item.name}</p>
                {item.title && <p className="text-[10px] text-gray-500 truncate">{item.title}</p>}
              </div>
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button onClick={() => openEdit(item)} className="p-1 bg-white rounded shadow text-blue-600"><Pencil size={12} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-1 bg-white rounded shadow text-red-500"><Trash2 size={12} /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
