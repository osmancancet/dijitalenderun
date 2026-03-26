"use client";

import { useState, useEffect } from "react";
import { getDocument, setDocument } from "@/lib/firestore";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ImageUpload from "@/components/admin/ImageUpload";
import { Save } from "lucide-react";
import type { HakkimizdaContent } from "@/types";

export default function AdminHakkimizdaPage() {
  const [form, setForm] = useState({ title: "Hakkımızda", content: "", imageUrl: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getDocument<HakkimizdaContent>("siteSettings", "hakkimizda").then((doc) => {
      if (doc) {
        setForm({ title: doc.title || "Hakkımızda", content: doc.content || "", imageUrl: doc.imageUrl || "" });
      }
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    await setDocument("siteSettings", "hakkimizda", form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hakkımızda Sayfası</h1>
          <p className="text-sm text-gray-500 mt-1">Hakkımızda sayfası içeriğini düzenleyin</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-50">
          <Save size={16} />
          {saving ? "Kaydediliyor..." : saved ? "Kaydedildi!" : "Kaydet"}
        </button>
      </div>

      <div className="bg-white border border-border rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Sayfa Başlığı</label>
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">İçerik (HTML)</label>
          <textarea rows={15} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Görsel (opsiyonel)</label>
          <ImageUpload folder="general" value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} />
        </div>
      </div>
    </div>
  );
}
