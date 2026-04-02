"use client";

import { useEffect, useState } from "react";
import {
  Images,
  Newspaper,
  Briefcase,
  BookOpen,
  Scale,
  Mail,
  Video,
  User,
  Info,
  Phone,
  ImageIcon,
  BarChart3,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase";

type Stats = Record<string, number>;

/** Maps each dashboard card to its stat key */
const STAT_KEY_MAP: Record<string, string> = {
  Slider: "slider",
  "Resmi Gazete": "resmiGazete",
  "Personel İlanları": "personelIlanlari",
  "SBKY Ders Notları": "sbkyDersNotlari",
  "SBKY Sözlük": "sbkySozluk",
  "Mevzuat Notları": "mevzuatDersNotlari",
  Videolar: "videolar",
  Biyografiler: "biyografiler",
  Reklamlar: "reklamlar",
  "İletişim Mesajları": "contactMessages",
};

const dashboardCards = [
  { href: "/admin/slider", label: "Slider", icon: Images, color: "bg-blue-500", desc: "Ana sayfa slaytlarını yönetin" },
  { href: "/admin/resmi-gazete", label: "Resmi Gazete", icon: Newspaper, color: "bg-red-600", desc: "Resmi Gazete senkronizasyonu" },
  { href: "/admin/personel-ilanlari", label: "Personel İlanları", icon: Briefcase, color: "bg-amber-600", desc: "Personel ilanlarını yönetin" },
  { href: "/admin/sbky-ders-notlari", label: "SBKY Ders Notları", icon: BookOpen, color: "bg-green-600", desc: "SBKY ders notlarını yönetin" },
  { href: "/admin/sbky-sozluk", label: "SBKY Sözlük", icon: BookOpen, color: "bg-cyan-600", desc: "SBKY sözlük terimlerini yönetin" },
  { href: "/admin/mevzuat-ders-notlari", label: "Mevzuat Notları", icon: Scale, color: "bg-purple-600", desc: "Mevzuat notlarını yönetin" },
  { href: "/admin/videolar", label: "Videolar", icon: Video, color: "bg-rose-600", desc: "YouTube videolarını yönetin" },
  { href: "/admin/biyografiler", label: "Biyografiler", icon: User, color: "bg-indigo-600", desc: "SBKY önemli isimlerin biyografileri" },
  { href: "/admin/reklamlar", label: "Reklamlar", icon: ImageIcon, color: "bg-pink-600", desc: "Yan reklam alanlarını yönetin" },
  { href: "/admin/dr-ozan-yetkin", label: "Dr. Ozan Yetkin", icon: User, color: "bg-sky-600", desc: "Akademik profil sayfası" },
  { href: "/admin/hakkimizda", label: "Hakkımızda", icon: Info, color: "bg-gray-600", desc: "Hakkımızda sayfası içeriği" },
  { href: "/admin/iletisim", label: "İletişim", icon: Phone, color: "bg-emerald-600", desc: "İletişim bilgileri" },
  { href: "/admin/mesajlar", label: "İletişim Mesajları", icon: Mail, color: "bg-teal-600", desc: "Gelen mesajları görüntüleyin" },
];

const summaryCards = [
  { key: "totalContent", label: "Toplam İçerik", color: "from-blue-500 to-blue-700", icon: BarChart3 },
  { key: "contactMessages", label: "Mesajlar", color: "from-teal-500 to-teal-700", icon: Mail },
  { key: "unreadMessages", label: "Okunmamış", color: "from-red-500 to-red-700", icon: Mail },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const supabase = getSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch("/api/admin/stats", {
          headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
        });
        const data = await res.json();
        if (!data.error) setStats(data);
      } catch {}
      finally { setLoading(false); }
    }
    fetchStats();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-gray-500 mt-1">Dijital Enderun yönetim paneline hoş geldiniz.</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {summaryCards.map((card) => (
          <div
            key={card.key}
            className={`bg-gradient-to-br ${card.color} rounded-xl p-5 text-white shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">{card.label}</p>
                <p className="text-3xl font-bold mt-1">
                  {loading ? (
                    <Loader2 size={28} className="animate-spin" />
                  ) : (
                    stats?.[card.key] ?? 0
                  )}
                </p>
              </div>
              <card.icon size={36} className="text-white/30" />
            </div>
          </div>
        ))}
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardCards.map((card) => {
          const statKey = STAT_KEY_MAP[card.label];
          const count = statKey && stats ? stats[statKey] : undefined;
          const isMessages = card.label === "İletişim Mesajları";
          const unread = isMessages && stats ? stats.unreadMessages : 0;

          return (
            <Link
              key={card.href + card.label}
              href={card.href}
              className="bg-white border border-border rounded-xl p-5 hover:shadow-lg transition-shadow group relative"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center text-white shrink-0`}>
                  <card.icon size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {card.label}
                    </h3>
                    {count !== undefined && !loading && (
                      <span className="inline-flex items-center justify-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                        {count}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5">{card.desc}</p>
                </div>
                {isMessages && unread > 0 && !loading && (
                  <span className="absolute top-3 right-3 inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white animate-pulse">
                    {unread} yeni
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
