"use client";

import { useState } from "react";
import { useAdminCollection, adminAdd, adminDelete } from "@/hooks/useAdminCollection";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { RefreshCw, Trash2 } from "lucide-react";
import type { ResmiGazeteItem } from "@/types";

const COLLECTION = "resmiGazete";

export default function AdminResmiGazetePage() {
  const { items, loading, refresh } = useAdminCollection<ResmiGazeteItem>(COLLECTION);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");

  async function handleSync() {
    setSyncing(true);
    setSyncMsg("");
    try {
      const res = await fetch("/api/public/resmi-gazete");
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
      const detail = err instanceof Error ? err.message : String(err);
      setSyncMsg(`Senkronizasyon başarısız oldu: ${detail}`);
    } finally {
      setSyncing(false);
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
          <p className="text-sm text-gray-500 mt-1">Son Resmi Gazete içeriklerini senkronize edin</p>
        </div>
        <button onClick={handleSync} disabled={syncing} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-50">
          <RefreshCw size={16} className={syncing ? "animate-spin" : ""} /> {syncing ? "Senkronize ediliyor..." : "Senkronize Et"}
        </button>
      </div>

      {syncMsg && (
        <div className={`mb-4 px-4 py-3 text-sm rounded-lg ${syncMsg.includes("başarısız") ? "bg-red-50 border border-red-200 text-red-800" : "bg-green-50 border border-green-200 text-green-800"}`}>
          {syncMsg}
        </div>
      )}

      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Başlık</th>
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 font-medium text-right">Sil</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">Henüz kayıt eklenmemiş. Senkronize Et butonuna tıklayın.</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-gray-500">{item.summary}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
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
