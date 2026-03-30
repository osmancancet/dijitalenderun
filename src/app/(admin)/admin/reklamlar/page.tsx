"use client";

import { useState } from "react";
import { useAdminCollection, adminAdd, adminUpdate, adminDelete } from "@/hooks/useAdminCollection";
import ImageUpload from "@/components/admin/ImageUpload";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import type { Reklam } from "@/types";

const COLLECTION = "reklamlar";

export default function AdminReklamlarPage() {
  const { items, loading, refresh } = useAdminCollection<Reklam>(COLLECTION);
  const [editing, setEditing] = useState<Reklam | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "", imageUrl: "", linkUrl: "", position: "both" as Reklam["position"], isActive: true,
  });
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing(null);
    setForm({ title: "", imageUrl: "", linkUrl: "", position: "both", isActive: true });
    setShowForm(true);
  }

  function openEdit(item: Reklam) {
    setEditing(item);
    setForm({
      title: item.title, imageUrl: item.imageUrl || "", linkUrl: item.linkUrl,
      position: item.position || "both", isActive: item.isActive,
    });
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editing) await adminUpdate(COLLECTION, editing.id, form);
      else await adminAdd(COLLECTION, form);
      setShowForm(false);
      refresh();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu reklamı silmek istediğinize emin misiniz?")) return;
    await adminDelete(COLLECTION, id);
    refresh();
  }

  if (loading) return <LoadingSpinner />;

  const inputCls = "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";
  const posLabels: Record<string, string> = { left: "Sol", right: "Sağ", both: "Her İkisi (Dikey)", horizontal: "Yatay (Ana Sayfa)" };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reklamlar</h1>
          <p className="text-sm text-gray-500 mt-1">Reklam alanlarını yönetin. Dikey bannerlar (160x600px) alt sayfalarda sol/sağ kenarda, yatay banner (1200x120px) ana sayfada slider altında görünür.</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors">
          <Plus size={16} /> Yeni Reklam
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{editing ? "Reklamı Düzenle" : "Yeni Reklam"}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Reklam Başlığı</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="ör: Kitap Tanıtımı" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Reklam Görseli ({form.position === "horizontal" ? "yatay, 1200x120px önerilir" : "dikey, 160x600px önerilir"})
                </label>
                <ImageUpload folder="reklamlar" value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tıklama Linki</label>
                <input type="url" value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} className={inputCls} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Konum</label>
                <div className="flex gap-2">
                  {(["left", "right", "both", "horizontal"] as const).map((pos) => (
                    <button key={pos} type="button" onClick={() => setForm({ ...form, position: pos })}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${form.position === pos ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-border hover:border-primary/50"}`}>
                      {posLabels[pos]}
                    </button>
                  ))}
                </div>
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

      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Görsel</th>
              <th className="px-4 py-3 font-medium">Başlık</th>
              <th className="px-4 py-3 font-medium">Konum</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Henüz reklam eklenmemiş.</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-12 h-16 object-cover rounded" /> : <div className="w-12 h-16 bg-gray-100 rounded" />}
                  </td>
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-gray-500">{posLabels[item.position] || "Her İkisi"}</td>
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
    </div>
  );
}
