"use client";

import { useState } from "react";
import { useAdminCollection, adminAdd, adminUpdate, adminDelete } from "@/hooks/useAdminCollection";
import ImageUpload from "@/components/admin/ImageUpload";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Plus, Pencil, Trash2, X, Monitor, Smartphone, Calendar, Globe, Eye, EyeOff } from "lucide-react";
import type { Reklam } from "@/types";

const COLLECTION = "reklamlar";

const PAGE_OPTIONS = [
  { value: "all", label: "Tüm Sayfalar" },
  { value: "home", label: "Ana Sayfa" },
  { value: "sbky-ders-notlari", label: "SBKY Ders Notları" },
  { value: "sbky-sozluk", label: "SBKY Sözlük" },
  { value: "mevzuat-ders-notlari", label: "Mevzuat Ders Notları" },
  { value: "biyografiler", label: "Biyografiler" },
  { value: "dr-ozan-yetkin", label: "Dr. Ozan Yetkin" },
  { value: "hakkimizda", label: "Hakkımızda" },
  { value: "iletisim", label: "İletişim" },
  { value: "resmi-gazete", label: "Resmi Gazete" },
  { value: "personel-ilanlari", label: "Personel İlanları" },
];

const POS_OPTIONS = [
  { value: "both", label: "Sayfa İçi Banner", desc: "Header altında sayfa içi yatay reklam (tüm alt sayfalar)", icon: "▬", size: "1200×100px" },
  { value: "horizontal", label: "Ana Sayfa Banner", desc: "Ana sayfada slider altında tam genişlik", icon: "▬", size: "1200×160px" },
] as const;

type FormData = {
  title: string;
  advertiser: string;
  imageUrl: string;
  linkUrl: string;
  position: Reklam["position"];
  pages: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
};

const emptyForm: FormData = {
  title: "", advertiser: "", imageUrl: "", linkUrl: "",
  position: "both", pages: ["all"], startDate: "", endDate: "", isActive: true,
};

function isAdExpired(ad: Reklam) {
  if (!ad.endDate) return false;
  return new Date(ad.endDate) < new Date();
}

function isAdScheduled(ad: Reklam) {
  if (!ad.startDate) return false;
  return new Date(ad.startDate) > new Date();
}

function getStatusInfo(ad: Reklam) {
  if (!ad.isActive) return { label: "Pasif", cls: "bg-gray-100 text-gray-500" };
  if (isAdExpired(ad)) return { label: "Süresi Dolmuş", cls: "bg-red-100 text-red-600" };
  if (isAdScheduled(ad)) return { label: "Planlanmış", cls: "bg-blue-100 text-blue-600" };
  return { label: "Yayında", cls: "bg-green-100 text-green-700" };
}

export default function AdminReklamlarPage() {
  const { items, loading, refresh } = useAdminCollection<Reklam>(COLLECTION);
  const [editing, setEditing] = useState<Reklam | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  function openNew() {
    setEditing(null);
    setForm({ ...emptyForm });
    setShowForm(true);
  }

  function openEdit(item: Reklam) {
    setEditing(item);
    setForm({
      title: item.title,
      advertiser: item.advertiser || "",
      imageUrl: item.imageUrl || "",
      linkUrl: item.linkUrl,
      position: item.position || "both",
      pages: item.pages?.length ? item.pages : ["all"],
      startDate: item.startDate?.slice(0, 10) || "",
      endDate: item.endDate?.slice(0, 10) || "",
      isActive: item.isActive,
    });
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.title || !form.linkUrl) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      };
      if (editing) await adminUpdate(COLLECTION, editing.id, payload);
      else await adminAdd(COLLECTION, payload);
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

  async function toggleActive(item: Reklam) {
    await adminUpdate(COLLECTION, item.id, { isActive: !item.isActive });
    refresh();
  }

  function togglePage(page: string) {
    if (page === "all") {
      setForm({ ...form, pages: ["all"] });
      return;
    }
    let newPages = form.pages.filter((p) => p !== "all");
    if (newPages.includes(page)) {
      newPages = newPages.filter((p) => p !== page);
    } else {
      newPages.push(page);
    }
    if (newPages.length === 0) newPages = ["all"];
    setForm({ ...form, pages: newPages });
  }

  if (loading) return <LoadingSpinner />;

  const posLabels: Record<string, string> = { left: "Sol", right: "Sağ", both: "Sol + Sağ", horizontal: "Yatay" };

  const filteredItems = items.filter((item) => {
    if (filter === "active") return item.isActive;
    if (filter === "inactive") return !item.isActive;
    return true;
  });

  const activeCount = items.filter((i) => i.isActive).length;
  const expiredCount = items.filter((i) => isAdExpired(i)).length;

  const inputCls = "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  const selectedPos = POS_OPTIONS.find((p) => p.value === form.position);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reklam Yönetimi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Reklam alanlarını yönetin. Sayfa içi banner (1200×100px) alt sayfalarda başlığın altında, ana sayfa banner (1200×160px) slider altında görünür. Dr. Ozan Yetkin sayfasında reklam gösterilmez.
          </p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors shadow-sm">
          <Plus size={16} /> Yeni Reklam Ekle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-border rounded-lg p-4">
          <p className="text-2xl font-bold text-foreground">{items.length}</p>
          <p className="text-xs text-gray-500">Toplam Reklam</p>
        </div>
        <div className="bg-white border border-border rounded-lg p-4">
          <p className="text-2xl font-bold text-green-600">{activeCount}</p>
          <p className="text-xs text-gray-500">Aktif Yayında</p>
        </div>
        <div className="bg-white border border-border rounded-lg p-4">
          <p className="text-2xl font-bold text-red-500">{expiredCount}</p>
          <p className="text-xs text-gray-500">Süresi Dolmuş</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {(["all", "active", "inactive"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? "bg-primary text-white" : "bg-white border border-border text-gray-600 hover:border-primary/50"}`}>
            {f === "all" ? "Tümü" : f === "active" ? "Aktif" : "Pasif"}
          </button>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">{editing ? "Reklamı Düzenle" : "Yeni Reklam Oluştur"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
            </div>

            <div className="space-y-5">
              {/* Temel Bilgiler */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Monitor size={14} /> Temel Bilgiler</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Reklam Başlığı *</label>
                    <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="ör: Kitap Tanıtımı" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Reklam Veren</label>
                    <input type="text" value={form.advertiser} onChange={(e) => setForm({ ...form, advertiser: e.target.value })} className={inputCls} placeholder="ör: XYZ Yayınevi" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">Tıklama Linki *</label>
                  <input type="url" value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} className={inputCls} placeholder="https://..." />
                </div>
              </div>

              {/* Konum */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Smartphone size={14} /> Konum ve Boyut</h3>
                <div className="grid grid-cols-2 gap-2">
                  {POS_OPTIONS.map((pos) => (
                    <button key={pos.value} type="button" onClick={() => setForm({ ...form, position: pos.value })}
                      className={`p-3 rounded-lg text-left border transition-all ${form.position === pos.value ? "bg-primary/5 border-primary ring-1 ring-primary" : "bg-white border-border hover:border-primary/50"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">{pos.icon}</span>
                        <span className="text-sm font-medium">{pos.label}</span>
                      </div>
                      <p className="text-[10px] text-gray-400">{pos.desc}</p>
                      <p className="text-[10px] text-primary font-medium mt-1">{pos.size}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Görsel */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  Reklam Görseli
                  <span className="text-xs font-normal text-gray-400 ml-2">Önerilen: {selectedPos?.size}</span>
                </h3>
                <ImageUpload folder="reklamlar" value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} />
              </div>

              {/* Sayfa Hedefleme */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Globe size={14} /> Sayfa Hedefleme</h3>
                <p className="text-[11px] text-gray-400">Reklamın hangi sayfalarda gösterileceğini seçin. Farklı sayfalar için farklı fiyatlandırma uygulayabilirsiniz.</p>
                <div className="grid grid-cols-2 gap-2">
                  {PAGE_OPTIONS.map((page) => {
                    const isAll = page.value === "all";
                    const checked = isAll ? form.pages.includes("all") : form.pages.includes(page.value);
                    return (
                      <label key={page.value}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${isAll ? "col-span-2 bg-primary/5 border border-primary/20" : "bg-white border border-border hover:border-primary/30"} ${checked ? "ring-1 ring-primary/50" : ""}`}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePage(page.value)}
                          className="accent-primary"
                        />
                        <span className={`text-xs ${isAll ? "font-semibold" : ""}`}>{page.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Zamanlama */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Calendar size={14} /> Yayın Tarihleri <span className="text-xs font-normal text-gray-400">(Opsiyonel)</span></h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Başlangıç Tarihi</label>
                    <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">Bitiş Tarihi</label>
                    <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Durum + Kaydet */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-primary w-4 h-4" />
                  <span className="text-sm font-medium">Aktif</span>
                </label>
                <div className="flex gap-2">
                  <button onClick={() => setShowForm(false)} className="px-4 py-2.5 border border-border text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    İptal
                  </button>
                  <button onClick={handleSave} disabled={saving || !form.title || !form.linkUrl}
                    className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-50 shadow-sm">
                    {saving ? "Kaydediliyor..." : editing ? "Güncelle" : "Oluştur"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Reklam</th>
              <th className="px-4 py-3 font-medium">Konum</th>
              <th className="px-4 py-3 font-medium">Sayfalar</th>
              <th className="px-4 py-3 font-medium">Tarih Aralığı</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredItems.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                {filter !== "all" ? "Bu filtreyle eşleşen reklam yok." : "Henüz reklam eklenmemiş."}
              </td></tr>
            ) : (
              filteredItems.map((item) => {
                const status = getStatusInfo(item);
                const pages = item.pages?.length ? item.pages : ["all"];
                return (
                  <tr key={item.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt="" className={`${item.position === "horizontal" ? "w-20 h-10" : "w-10 h-16"} object-cover rounded border border-border`} />
                        ) : (
                          <div className={`${item.position === "horizontal" ? "w-20 h-10" : "w-10 h-16"} bg-gray-100 rounded border border-border`} />
                        )}
                        <div>
                          <p className="font-medium text-foreground">{item.title}</p>
                          {item.advertiser && <p className="text-[11px] text-gray-400">{item.advertiser}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">
                        {posLabels[item.position] || "Her İkisi"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {pages.includes("all") ? (
                          <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-medium">Tüm Sayfalar</span>
                        ) : pages.slice(0, 3).map((p) => (
                          <span key={p} className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600">
                            {PAGE_OPTIONS.find((o) => o.value === p)?.label || p}
                          </span>
                        ))}
                        {!pages.includes("all") && pages.length > 3 && (
                          <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] text-gray-500">+{pages.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {item.startDate || item.endDate ? (
                        <div>
                          {item.startDate && <span>{item.startDate.slice(0, 10)}</span>}
                          {item.startDate && item.endDate && <span> → </span>}
                          {item.endDate && <span>{item.endDate.slice(0, 10)}</span>}
                        </div>
                      ) : (
                        <span className="text-gray-300">Süresiz</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${status.cls}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => toggleActive(item)} title={item.isActive ? "Pasife Al" : "Aktife Al"}
                          className="p-1.5 rounded hover:bg-gray-100 transition-colors">
                          {item.isActive ? <EyeOff size={14} className="text-gray-400" /> : <Eye size={14} className="text-green-600" />}
                        </button>
                        <button onClick={() => openEdit(item)} className="p-1.5 rounded hover:bg-gray-100 transition-colors">
                          <Pencil size={14} className="text-blue-600" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded hover:bg-gray-100 transition-colors">
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
