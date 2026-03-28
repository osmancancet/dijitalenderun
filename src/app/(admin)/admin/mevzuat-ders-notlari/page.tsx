"use client";

import { useState } from "react";
import { useAdminCollection, adminAdd, adminUpdate, adminDelete } from "@/hooks/useAdminCollection";
import FileUpload from "@/components/admin/FileUpload";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Plus, Pencil, Trash2, X, FileText, BookOpen } from "lucide-react";
import type { DersNotu, NoteType } from "@/types";

const COLLECTION = "mevzuatDersNotlari";

export default function AdminMevzuatDersNotlariPage() {
  const { items, loading, refresh } = useAdminCollection<DersNotu>(COLLECTION);
  const [editing, setEditing] = useState<DersNotu | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", category: "", content: "",
    noteType: "file" as NoteType,
    fileUrl: "", fileName: "", fileSize: 0, isActive: true,
  });
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing(null);
    setForm({ title: "", description: "", category: "", content: "", noteType: "file", fileUrl: "", fileName: "", fileSize: 0, isActive: true });
    setShowForm(true);
  }

  function openEdit(item: DersNotu) {
    setEditing(item);
    setForm({
      title: item.title, description: item.description, category: item.category,
      content: item.content || "", noteType: item.noteType || "file",
      fileUrl: item.fileUrl || "", fileName: item.fileName || "", fileSize: item.fileSize || 0,
      isActive: item.isActive,
    });
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const data = { ...form, downloadCount: editing?.downloadCount || 0 };
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
    if (!confirm("Bu notu silmek istediğinize emin misiniz?")) return;
    await adminDelete(COLLECTION, id);
    refresh();
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mevzuat Ders Notları</h1>
          <p className="text-sm text-gray-500 mt-1">Mevzuat ders notlarını yönetin</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors">
          <Plus size={16} /> Yeni Not
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{editing ? "Notu Düzenle" : "Yeni Not"}</h2>
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
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Örn: Personel Hukuku" />
              </div>

              {/* Not Türü Seçimi */}
              <div>
                <label className="block text-sm font-medium mb-2">Not Türü</label>
                <div className="flex gap-2">
                  {([
                    { value: "file" as NoteType, label: "Dosya Yükle", icon: FileText },
                    { value: "text" as NoteType, label: "Metin Yaz", icon: BookOpen },
                    { value: "both" as NoteType, label: "Her İkisi", icon: FileText },
                  ]).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm({ ...form, noteType: opt.value })}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        form.noteType === opt.value
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-600 border-border hover:border-primary/50"
                      }`}
                    >
                      <opt.icon size={14} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metin İçerik */}
              {(form.noteType === "text" || form.noteType === "both") && (
                <div>
                  <label className="block text-sm font-medium mb-1">İçerik</label>
                  <textarea
                    rows={12}
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                    placeholder="Ders notu metnini buraya yazın..."
                  />
                </div>
              )}

              {/* Dosya Yükleme */}
              {(form.noteType === "file" || form.noteType === "both") && (
                <div>
                  <label className="block text-sm font-medium mb-1">Dosya</label>
                  <FileUpload
                    folder="mevzuat-ders-notlari"
                    value={form.fileUrl}
                    fileName={form.fileName}
                    onChange={(url, name, size) => setForm({ ...form, fileUrl: url, fileName: name, fileSize: size })}
                  />
                </div>
              )}

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
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 font-medium">Tür</th>
              <th className="px-4 py-3 font-medium">İndirme</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Henüz not eklenmemiş.</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-gray-500">{item.category}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      (item.noteType || "file") === "text" ? "bg-blue-100 text-blue-700"
                      : (item.noteType || "file") === "both" ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-600"
                    }`}>
                      {(item.noteType || "file") === "text" ? "Metin" : (item.noteType || "file") === "both" ? "Dosya + Metin" : "Dosya"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{item.downloadCount}</td>
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
