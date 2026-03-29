"use client";

import {
  Images,
  Newspaper,
  Briefcase,
  BookOpen,
  Scale,
  Mail,
  Video,
  CalendarDays,
  User,
  Info,
  Phone,
  ImageIcon,
} from "lucide-react";
import Link from "next/link";

const dashboardCards = [
  { href: "/admin/slider", label: "Slider", icon: Images, color: "bg-blue-500", desc: "Ana sayfa slaytlarını yönetin" },
  { href: "/admin/resmi-gazete", label: "Resmi Gazete", icon: Newspaper, color: "bg-red-600", desc: "Resmi Gazete senkronizasyonu" },
  { href: "/admin/personel-ilanlari", label: "Personel İlanları", icon: Briefcase, color: "bg-amber-600", desc: "Personel ilanlarını yönetin" },
  { href: "/admin/sbky-ders-notlari", label: "SBKY Ders Notları", icon: BookOpen, color: "bg-green-600", desc: "SBKY ders notlarını yönetin" },
  { href: "/admin/sbky-sozluk", label: "SBKY Sözlük", icon: BookOpen, color: "bg-cyan-600", desc: "SBKY sözlük terimlerini yönetin" },
  { href: "/admin/mevzuat-ders-notlari", label: "Mevzuat Notları", icon: Scale, color: "bg-purple-600", desc: "Mevzuat notlarını yönetin" },
  { href: "/admin/sinav-takvimi", label: "Sınav Takvimi", icon: CalendarDays, color: "bg-orange-600", desc: "ÖSYM sınav takvimini yönetin" },
  { href: "/admin/videolar", label: "Videolar", icon: Video, color: "bg-rose-600", desc: "YouTube videolarını yönetin" },
  { href: "/admin/biyografiler", label: "Biyografiler", icon: User, color: "bg-indigo-600", desc: "SBKY önemli isimlerin biyografileri" },
  { href: "/admin/reklamlar", label: "Reklamlar", icon: ImageIcon, color: "bg-pink-600", desc: "Yan reklam alanlarını yönetin" },
  { href: "/admin/dr-ozan-yetkin", label: "Dr. Ozan Yetkin", icon: User, color: "bg-sky-600", desc: "Akademik profil sayfası" },
  { href: "/admin/hakkimizda", label: "Hakkımızda", icon: Info, color: "bg-gray-600", desc: "Hakkımızda sayfası içeriği" },
  { href: "/admin/iletisim", label: "İletişim", icon: Phone, color: "bg-emerald-600", desc: "İletişim bilgileri" },
  { href: "/admin/iletisim", label: "İletişim Mesajları", icon: Mail, color: "bg-teal-600", desc: "Gelen mesajları görüntüleyin" },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-gray-500 mt-1">Dijital Enderun yönetim paneline hoş geldiniz.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardCards.map((card) => (
          <Link
            key={card.href + card.label}
            href={card.href}
            className="bg-white border border-border rounded-xl p-5 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center text-white shrink-0`}>
                <card.icon size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {card.label}
                </h3>
                <p className="text-sm text-gray-400 mt-0.5">{card.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
