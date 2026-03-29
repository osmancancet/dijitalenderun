"use client";

import { useState } from "react";
import { useAdminCollection, adminAdd, adminUpdate, adminDelete } from "@/hooks/useAdminCollection";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Plus, Pencil, Trash2, X, RefreshCw } from "lucide-react";
import type { SinavTakvimi } from "@/types";

const COLLECTION = "sinavTakvimi";

export default function AdminSinavTakvimiPage() {
  const { items, loading, refresh } = useAdminCollection<SinavTakvimi>(COLLECTION);
  const [editing, setEditing] = useState<SinavTakvimi | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "", examDate: "", applicationDeadline: "", description: "", sourceUrl: "", isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");

  async function handleSync() {
    setSyncing(true);
    setSyncMsg("");
    try {
      const res = await fetch("/api/sinav-takvimi");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const existingTitles = new Set(items.map((i) => i.title));
      let added = 0;

      for (const item of data.items) {
        if (!existingTitles.has(item.title)) {
          await adminAdd(COLLECTION, {
            title: item.title,
            examDate: item.examDate,
            applicationDeadline: item.applicationDeadline || "",
            sourceUrl: item.sourceUrl,
            isActive: true,
          });
          added++;
        }
      }
      setSyncMsg(`${added} yeni sınav eklendi (ÖSYM'den ${data.count} yaklaşan sınav bulundu).`);
      refresh();
    } catch (err) {
      console.error(err);
      const detail = err instanceof Error ? err.message : String(err);
      setSyncMsg(`Senkronizasyon başarısız oldu: ${detail}`);
    } finally {
      setSyncing(false);
    }
  }

  function openNew() {
    setEditing(null);
    setForm({ title: "", examDate: "", applicationDeadline: "", description: "", sourceUrl: "", isActive: true });
    setShowForm(true);
  }

  function openEdit(item: SinavTakvimi) {
    setEditing(item);
    setForm({
      title: item.title,
      examDate: item.examDate?.slice(0, 10) || "",
      applicationDeadline: item.applicationDeadline?.slice(0, 10) || "",
      description: item.description || "",
      sourceUrl: item.sourceUrl || "",
      isActive: item.isActive,
    });
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

  const inputCls = "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sınav Takvimi</h1>
          <p className="text-sm text-gray-500 mt-1">KPSS, ALES, YÖKDİL ve diğer sınavları yönetin</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleSync} disabled={syncing} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-50">
            <RefreshCw size={16} className={syncing ? "animate-spin" : ""} /> {syncing ? "ÖSYM'den çekiliyor..." : "ÖSYM'den Çek"}
          </button>
          <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors">
            <Plus size={16} /> Manuel Ekle
          </button>
        </div>
      </div>

      {syncMsg && (
        <div className={`mb-4 px-4 py-3 text-sm rounded-lg ${syncMsg.includes("başarısız") ? "bg-red-50 border border-red-200 text-red-800" : "bg-green-50 border border-green-200 text-green-800"}`}>
          {syncMsg}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{editing ? "Düzenle" : "Yeni Sınav"}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Sınav Adı</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="ör: KPSS Genel Yetenek" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Sınav Tarihi</label>
                  <input type="date" value={form.examDate} onChange={(e) => setForm({ ...form, examDate: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Son Başvuru</label>
                  <input type="date" value={form.applicationDeadline} onChange={(e) => setForm({ ...form, applicationDeadline: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Açıklama</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputCls} resize-none`} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kaynak URL</label>
                <input type="url" value={form.sourceUrl} onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })} className={inputCls} placeholder="https://..." />
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
              <th className="px-4 py-3 font-medium">Sınav</th>
              <th className="px-4 py-3 font-medium">Tarih</th>
              <th className="px-4 py-3 font-medium">Son Başvuru</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Henüz sınav eklenmemiş. ÖSYM&apos;den çekin veya manuel ekleyin.</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-gray-500">{item.examDate?.slice(0, 10)}</td>
                  <td className="px-4 py-3 text-gray-500">{item.applicationDeadline?.slice(0, 10) || "—"}</td>
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
