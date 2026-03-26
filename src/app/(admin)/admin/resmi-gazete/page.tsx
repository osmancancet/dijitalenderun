"use client";

import { useState } from "react";
import { useAdminCollection, adminAdd, adminUpdate, adminDelete } from "@/hooks/useAdminCollection";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Plus, Pencil, Trash2, X, RefreshCw } from "lucide-react";
import type { ResmiGazeteItem } from "@/types";

const COLLECTION = "resmiGazete";

export default function AdminResmiGazetePage() {
  const { items, loading, refresh } = useAdminCollection<ResmiGazeteItem>(COLLECTION);
  const [editing, setEditing] = useState<ResmiGazeteItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", summary: "", sourceUrl: "", isActive: true });
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");

  async function handleSync() {
    setSyncing(true);
    setSyncMsg("");
    try {
      const res = await fetch("/api/resmi-gazete");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const existingTitles = new Set(items.map((g) => g.title));
      let added = 0;

      for (const item of data.items) {
        if (!existingTitles.has(item.title)) {
          await adminAdd(COLLECTION, {
            title: item.title,
            summary: item.summary,
            sourceUrl: item.sourceUrl,
            isActive: true,
          });
          added++;
        }
      }
      setSyncMsg(`${added} yeni kayıt eklendi (${data.count} kayıt bulundu${data.date ? `, ${data.date} tarihli gazete` : ""}).`);
      refresh();
    } catch (err) {
      console.error(err);
      setSyncMsg("Senkronizasyon başarısız oldu.");
    } finally {
      setSyncing(false);
    }
  }

  async function handleDeleteAndResync() {
    if (!confirm("Tüm Resmi Gazete kayıtları silinip yeniden çekilecek. Emin misiniz?")) return;
    setSyncing(true);
    setSyncMsg("Mevcut kayıtlar siliniyor...");
    try {
      for (const item of items) {
        await adminDelete(COLLECTION, item.id);
      }

      const res = await fetch("/api/resmi-gazete");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      for (const item of data.items) {
        await adminAdd(COLLECTION, {
          title: item.title,
          summary: item.summary,
          sourceUrl: item.sourceUrl,
          isActive: true,
        });
      }
      setSyncMsg(`Tamamlandı! ${data.count} kayıt eklendi (${data.date} tarihli gazete).`);
      refresh();
    } catch (err) {
      console.error(err);
      setSyncMsg("İşlem başarısız oldu.");
    } finally {
      setSyncing(false);
    }
  }

  function openNew() {
    setEditing(null);
    setForm({ title: "", summary: "", sourceUrl: "", isActive: true });
    setShowForm(true);
  }

  function openEdit(item: ResmiGazeteItem) {
    setEditing(item);
    setForm({ title: item.title, summary: item.summary, sourceUrl: item.sourceUrl || "", isActive: item.isActive });
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
    if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
    await adminDelete(COLLECTION, id);
    refresh();
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Resmi Gazete</h1>
          <p className="text-sm text-gray-500 mt-1">Resmi Gazete haberlerini yönetin</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleDeleteAndResync} disabled={syncing} className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg text-sm font-medium hover:bg-red-800 transition-colors disabled:opacity-50">
            <Trash2 size={16} /> Sil & Yeniden Çek
          </button>
          <button onClick={handleSync} disabled={syncing} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50">
            <RefreshCw size={16} className={syncing ? "animate-spin" : ""} /> {syncing ? "Senkronize ediliyor..." : "Senkronize Et"}
          </button>
          <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors">
            <Plus size={16} /> Yeni Kayıt
          </button>
        </div>
      </div>

      {syncMsg && (
        <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-lg">
          {syncMsg}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{editing ? "Düzenle" : "Yeni Kayıt"}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Başlık</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Özet</label>
                <textarea rows={3} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kaynak URL</label>
                <input type="url" value={form.sourceUrl} onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
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
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">Henüz kayıt eklenmemiş.</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-muted/50">
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
    </div>
  );
}
