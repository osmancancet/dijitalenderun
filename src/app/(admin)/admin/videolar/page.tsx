"use client";

import { useState } from "react";
import { useAdminCollection, adminAdd, adminUpdate, adminDelete } from "@/hooks/useAdminCollection";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import SortableList from "@/components/admin/SortableList";
import { Plus, Pencil, Trash2, X, Play, RefreshCw, Tv, Zap, ArrowUpDown } from "lucide-react";
import type { VideoItem } from "@/types";

const COLLECTION = "videolar";

function getYoutubeId(url: string): string | null {
  const shortsMatch = url.match(/youtube\.com\/shorts\/([^?&#]+)/);
  if (shortsMatch) return shortsMatch[1];
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?#]+)/
  );
  return match ? match[1] : null;
}

export default function AdminVideolarPage() {
  const { items, loading, refresh } = useAdminCollection<VideoItem>(COLLECTION);
  const [editing, setEditing] = useState<VideoItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", youtubeUrl: "", description: "", videoType: "video" as "video" | "short", order: 0, isActive: true });
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
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

  // Belirli türdeki videoları sil ve YouTube'dan yeniden çek
  async function handleSync(type: "video" | "short") {
    setSyncing(true);
    const label = type === "short" ? "Shorts" : "Videolar";
    setSyncMsg(`${label} siliniyor...`);
    try {
      // 1. Bu türdeki mevcut videoları sil
      const toDelete = items.filter((v) => (v.videoType || "video") === type);
      for (const v of toDelete) {
        await adminDelete(COLLECTION, v.id);
      }

      // 2. YouTube'dan sadece bu türü çek
      setSyncMsg(`${toDelete.length} ${label.toLowerCase()} silindi. YouTube'dan çekiliyor...`);
      const res = await fetch(`/api/youtube-sync?type=${type}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // 3. Yenilerini ekle
      const remaining = items.filter((v) => (v.videoType || "video") !== type);
      let order = remaining.length + 1;
      for (const video of data.videos) {
        await adminAdd(COLLECTION, {
          title: video.title,
          youtubeUrl: video.youtubeUrl,
          description: video.description,
          videoType: video.videoType,
          order: order++,
          isActive: true,
        });
      }
      setSyncMsg(`${data.count} ${label.toLowerCase()} eklendi!`);
      refresh();
    } catch (err) {
      console.error(err);
      setSyncMsg(`${label} çekilirken hata oluştu.`);
    } finally {
      setSyncing(false);
    }
  }

  // Tümünü sil
  async function handleDeleteAll() {
    if (!confirm("Tüm videolar silinecek. Emin misiniz?")) return;
    setSyncing(true);
    setSyncMsg("Tüm videolar siliniyor...");
    try {
      for (const v of items) {
        await adminDelete(COLLECTION, v.id);
      }
      setSyncMsg(`${items.length} video silindi.`);
      refresh();
    } catch (err) {
      console.error(err);
      setSyncMsg("Silme işlemi başarısız.");
    } finally {
      setSyncing(false);
    }
  }

  function openNew() {
    setEditing(null);
    setForm({ title: "", youtubeUrl: "", description: "", videoType: "video", order: items.length + 1, isActive: true });
    setShowForm(true);
  }

  function openEdit(item: VideoItem) {
    setEditing(item);
    setForm({ title: item.title, youtubeUrl: item.youtubeUrl, description: item.description || "", videoType: item.videoType || "video", order: item.order, isActive: item.isActive });
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
    if (!confirm("Bu videoyu silmek istediğinize emin misiniz?")) return;
    await adminDelete(COLLECTION, id);
    refresh();
  }

  if (loading) return <LoadingSpinner />;

  const videoCount = items.filter((i) => (i.videoType || "video") === "video").length;
  const shortCount = items.filter((i) => i.videoType === "short").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Video Yönetimi</h1>
          <p className="text-sm text-gray-500 mt-1">
            {videoCount} video, {shortCount} short — Toplam {items.length}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => handleSync("video")} disabled={syncing} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
            <Tv size={16} /> {syncing ? "Çekiliyor..." : "Videoları Çek"}
          </button>
          <button onClick={() => handleSync("short")} disabled={syncing} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50">
            <Zap size={16} /> {syncing ? "Çekiliyor..." : "Shorts Çek"}
          </button>
          <button onClick={handleDeleteAll} disabled={syncing} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50">
            <Trash2 size={16} /> Tümünü Sil
          </button>
          <button
            onClick={() => setSortMode(!sortMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sortMode
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <ArrowUpDown size={16} /> Sıralama Modu
          </button>
          <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors">
            <Plus size={16} /> Manuel Ekle
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
              <h2 className="text-lg font-bold">{editing ? "Videoyu Düzenle" : "Yeni Video"}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Başlık</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">YouTube URL</label>
                <input type="url" value={form.youtubeUrl} onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="https://www.youtube.com/watch?v=..." />
                {form.youtubeUrl && getYoutubeId(form.youtubeUrl) && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-border">
                    <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${getYoutubeId(form.youtubeUrl)}`}
                        title="Önizleme"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Açıklama (opsiyonel)</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tür</label>
                  <select value={form.videoType} onChange={(e) => setForm({ ...form, videoType: e.target.value as "video" | "short" })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="video">Video</option>
                    <option value="short">Short</option>
                  </select>
                </div>
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
            <div className="px-4 py-8 text-center text-gray-400 bg-white border border-border rounded-lg">Henüz video eklenmemiş.</div>
          ) : (
            <SortableList
              items={items}
              onReorder={handleReorder}
              renderItem={(item) => {
                const vid = getYoutubeId(item.youtubeUrl);
                return (
                  <div className="flex items-center gap-3">
                    {vid ? (
                      <img src={`https://img.youtube.com/vi/${vid}/mqdefault.jpg`} alt="" className="w-16 h-10 object-cover rounded flex-shrink-0" />
                    ) : (
                      <Play size={16} className="text-gray-400 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-sm truncate block">{item.title}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${item.videoType === "short" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                      {item.videoType === "short" ? "Short" : "Video"}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${item.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {item.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </div>
                );
              }}
            />
          )}
        </div>
      ) : (
        <div className="bg-white border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Sıra</th>
                <th className="px-4 py-3 font-medium">Başlık</th>
                <th className="px-4 py-3 font-medium">Tür</th>
                <th className="px-4 py-3 font-medium">Önizleme</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Henüz video eklenmemiş.</td></tr>
              ) : (
                items.map((item) => {
                  const vid = getYoutubeId(item.youtubeUrl);
                  return (
                    <tr key={item.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3">{item.order}</td>
                      <td className="px-4 py-3 font-medium max-w-[300px] truncate">{item.title}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.videoType === "short" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                          {item.videoType === "short" ? "Short" : "Video"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {vid ? (
                          <img src={`https://img.youtube.com/vi/${vid}/mqdefault.jpg`} alt="" className="w-24 h-14 object-cover rounded" />
                        ) : (
                          <Play size={16} className="text-gray-400" />
                        )}
                      </td>
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
