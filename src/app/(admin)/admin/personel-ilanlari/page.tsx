"use client";

import { useState } from "react";
import { useCollection } from "@/hooks/useCollection";
import { addDocument, updateDocument, deleteDocument, Timestamp } from "@/lib/firestore";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import type { PersonelIlani } from "@/types";

const COLLECTION = "personelIlanlari";

export default function AdminPersonelIlanlariPage() {
  const { items, loading } = useCollection<PersonelIlani>(COLLECTION);
  const [editing, setEditing] = useState<PersonelIlani | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", institution: "", description: "", gazeteTarihi: "", sourceUrl: "", deadline: "", isActive: true });
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing(null);
    setForm({ title: "", institution: "", description: "", gazeteTarihi: "", sourceUrl: "", deadline: "", isActive: true });
    setShowForm(true);
  }

  function openEdit(item: PersonelIlani) {
    setEditing(item);
    const deadlineStr = item.deadline ? new Date(item.deadline.seconds * 1000).toISOString().split("T")[0] : "";
    setForm({ title: item.title, institution: item.institution, description: item.description, gazeteTarihi: item.gazeteTarihi || "", sourceUrl: item.sourceUrl || "", deadline: deadlineStr, isActive: item.isActive });
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const { deadline, ...rest } = form;
      const saveData: Record<string, unknown> = { ...rest };
      if (deadline) {
        saveData.deadline = Timestamp.fromDate(new Date(deadline));
      }
      if (editing) {
        await updateDocument(COLLECTION, editing.id, saveData);
      } else {
        await addDocument(COLLECTION, saveData);
      }
      setShowForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu ilanı silmek istediğinize emin misiniz?")) return;
    await deleteDocument(COLLECTION, id);
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Personel İlanları</h1>
          <p className="text-sm text-gray-500 mt-1">Personel ilanlarını yönetin</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors">
          <Plus size={16} /> Yeni İlan
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{editing ? "İlanı Düzenle" : "Yeni İlan"}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Başlık</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kurum</label>
                <input type="text" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Resmî Gazete Tarihi</label>
                <input type="text" placeholder="ör: 15.01.2026" value={form.gazeteTarihi} onChange={(e) => setForm({ ...form, gazeteTarihi: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Açıklama</label>
                <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Kaynak URL</label>
                  <input type="url" value={form.sourceUrl} onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Son Başvuru Tarihi</label>
                  <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
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
              <th className="px-4 py-3 font-medium">Başlık</th>
              <th className="px-4 py-3 font-medium">Kurum</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Henüz ilan eklenmemiş.</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-gray-500">{item.institution}</td>
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
