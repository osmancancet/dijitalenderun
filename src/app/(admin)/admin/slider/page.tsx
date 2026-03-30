"use client";

import { useState } from "react";
import { useAdminCollection, adminAdd, adminUpdate, adminDelete } from "@/hooks/useAdminCollection";
import ImageUpload from "@/components/admin/ImageUpload";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import SortableList from "@/components/admin/SortableList";
import { Plus, Pencil, Trash2, X, ArrowUpDown } from "lucide-react";
import type { SliderItem } from "@/types";

const COLLECTION = "slider";

export default function AdminSliderPage() {
  const { items, loading, refresh } = useAdminCollection<SliderItem>(COLLECTION);
  const [editing, setEditing] = useState<SliderItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", imageUrl: "", linkUrl: "", order: 0, isActive: true });
  const [saving, setSaving] = useState(false);
  const [sortMode, setSortMode] = useState(false);
  const [reordering, setReordering] = useState(false);

  async function handleReorder(orderedIds: string[]) {
    setReordering(true);
    try {
      const res = await fetch("/api/admin/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection: COLLECTION, orderedIds }),
      });
      if (!res.ok) throw new Error("Sıralama güncellenemedi");
      await refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setReordering(false);
    }
  }

  function openNew() {
    setEditing(null);
    setForm({ title: "", description: "", imageUrl: "", linkUrl: "", order: items.length + 1, isActive: true });
    setShowForm(true);
  }

  function openEdit(item: SliderItem) {
    setEditing(item);
    setForm({ title: item.title, description: item.description, imageUrl: item.imageUrl, linkUrl: item.linkUrl || "", order: item.order, isActive: item.isActive });
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editing) {
        await adminUpdate(COLLECTION, editing.id, form);
      } else {
        await adminAdd(COLLECTION, form);
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
    if (!confirm("Bu slaytı silmek istediğinize emin misiniz?")) return;
    await adminDelete(COLLECTION, id);
    refresh();
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Slider Yönetimi</h1>
          <p className="text-sm text-gray-500 mt-1">Ana sayfa slaytlarını yönetin</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortMode(!sortMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sortMode
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <ArrowUpDown size={16} /> {sortMode ? "Sıralama Modu" : "Sıralama Modu"}
          </button>
          <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors">
            <Plus size={16} /> Yeni Slayt
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{editing ? "Slaytı Düzenle" : "Yeni Slayt"}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Başlık</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Açıklama</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Görsel</label>
                <ImageUpload folder="slider" value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} maxWidth={1920} maxHeight={560} recommendedText="Önerilen boyut: 1920 x 560 piksel" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bağlantı URL (opsiyonel)</label>
                <input type="url" value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Sıra</label>
                  <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" id="active" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-primary" />
                  <label htmlFor="active" className="text-sm">Aktif</label>
                </div>
              </div>
              <button onClick={handleSave} disabled={saving} className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors disabled:opacity-50">
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sorting Mode */}
      {sortMode ? (
        <div>
          {reordering && (
            <div className="mb-3 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-lg">
              Sıralama kaydediliyor...
            </div>
          )}
          {items.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-400 bg-white border border-border rounded-lg">Henüz slayt eklenmemiş.</div>
          ) : (
            <SortableList
              items={items}
              onReorder={handleReorder}
              renderItem={(item) => (
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-sm">{item.title}</span>
                    <span className="ml-2 text-xs text-gray-400">#{item.order}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {item.isActive ? "Aktif" : "Pasif"}
                  </span>
                </div>
              )}
            />
          )}
        </div>
      ) : (
        /* Table */
        <div className="bg-white border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Sıra</th>
                <th className="px-4 py-3 font-medium">Başlık</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Henüz slayt eklenmemiş.</td></tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">{item.order}</td>
                    <td className="px-4 py-3 font-medium">{item.title}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {item.isActive ? "Aktif" : "Pasif"}
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
      )}
    </div>
  );
}
