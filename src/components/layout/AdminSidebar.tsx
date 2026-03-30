"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Images,
  Newspaper,
  Briefcase,
  BookOpen,
  Scale,
  User,
  Info,
  Phone,
  Video,
  Mail,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { signOut } from "@/lib/auth";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/slider", label: "Slider", icon: Images },
  { href: "/admin/resmi-gazete", label: "Resmi Gazete", icon: Newspaper },
  { href: "/admin/personel-ilanlari", label: "Personel İlanları", icon: Briefcase },
  { href: "/admin/sbky-ders-notlari", label: "SBKY Ders Notları", icon: BookOpen },
  { href: "/admin/sbky-sozluk", label: "SBKY Sözlük", icon: BookOpen },
  { href: "/admin/mevzuat-ders-notlari", label: "Mevzuat Notları", icon: Scale },

  { href: "/admin/videolar", label: "Videolar", icon: Video },
  { href: "/admin/biyografiler", label: "Biyografiler", icon: User },
  { href: "/admin/dr-ozan-yetkin", label: "Dr. Ozan Yetkin", icon: User },
  { href: "/admin/reklamlar", label: "Reklamlar", icon: Images },
  { href: "/admin/hakkimizda", label: "Hakkımızda", icon: Info },
  { href: "/admin/iletisim", label: "İletişim", icon: Phone },
  { href: "/admin/mesajlar", label: "Mesajlar", icon: Mail },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg shadow-lg"
      >
        <Menu size={20} />
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-primary-dark text-white flex flex-col transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
          <Link href="/admin" className="flex items-center">
            <Image
              src="/images/logo-beyaz.png"
              alt="Dijital Enderun"
              width={150}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 hover:bg-white/10 rounded"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            Siteyi Görüntüle →
          </Link>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-3 py-2 text-sm text-white/50 hover:text-red-300 transition-colors w-full"
          >
            <LogOut size={18} />
            Çıkış Yap
          </button>
        </div>
      </aside>
    </>
  );
}
