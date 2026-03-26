"use client";

import { useState, useEffect } from "react";
import { adminGetSettings, adminSaveSettings } from "@/hooks/useAdminCollection";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Save } from "lucide-react";
import type { IletisimContent } from "@/types";

export default function AdminIletisimPage() {
  const [form, setForm] = useState({
    address: "", phone: "", email: "", mapEmbedUrl: "",
    twitter: "", linkedin: "", instagram: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminGetSettings("iletisim").then((raw) => {
      if (raw) {
        const doc = raw as unknown as IletisimContent;
        setForm({
          address: doc.address || "", phone: doc.phone || "", email: doc.email || "",
          mapEmbedUrl: doc.mapEmbedUrl || "",
          twitter: doc.socialLinks?.twitter || "", linkedin: doc.socialLinks?.linkedin || "",
          instagram: doc.socialLinks?.instagram || "",
        });
      }
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    await adminSaveSettings("iletisim", {
      address: form.address, phone: form.phone, email: form.email,
      mapEmbedUrl: form.mapEmbedUrl,
      socialLinks: { twitter: form.twitter, linkedin: form.linkedin, instagram: form.instagram },
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">İletişim Bilgileri</h1>
          <p className="text-sm text-gray-500 mt-1">İletişim sayfası bilgilerini düzenleyin</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-50">
          <Save size={16} />
          {saving ? "Kaydediliyor..." : saved ? "Kaydedildi!" : "Kaydet"}
        </button>
      </div>

      <div className="bg-white border border-border rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">E-posta</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Telefon</label>
            <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Adres</label>
          <textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Google Maps Embed URL (opsiyonel)</label>
          <input type="url" value={form.mapEmbedUrl} onChange={(e) => setForm({ ...form, mapEmbedUrl: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <hr className="border-border" />
        <h3 className="font-medium">Sosyal Medya</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Twitter</label>
            <input type="url" value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn</label>
            <input type="url" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Instagram</label>
            <input type="url" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
