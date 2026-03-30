"use client";

import { useState } from "react";
import { useAdminCollection, adminUpdate, adminDelete } from "@/hooks/useAdminCollection";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Mail, MailOpen, Trash2, X, Clock } from "lucide-react";
import type { ContactMessage } from "@/types";

const COLLECTION = "contactMessages";

export default function AdminMesajlarPage() {
  const { items, loading, refresh } = useAdminCollection<ContactMessage>(COLLECTION);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  async function markAsRead(item: ContactMessage) {
    if (!item.isRead) {
      await adminUpdate(COLLECTION, item.id, { isRead: true });
      setSelected({ ...item, isRead: true });
      refresh();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    await adminDelete(COLLECTION, id);
    if (selected?.id === id) setSelected(null);
    refresh();
  }

  function openMessage(item: ContactMessage) {
    setSelected(item);
    markAsRead(item);
  }

  if (loading) return <LoadingSpinner />;

  const unreadCount = items.filter((i) => !i.isRead).length;
  const filtered = items.filter((i) => {
    if (filter === "unread") return !i.isRead;
    if (filter === "read") return i.isRead;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">İletişim Mesajları</h1>
          <p className="text-sm text-gray-500 mt-1">
            {items.length} mesaj{unreadCount > 0 && ` • ${unreadCount} okunmamış`}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {(["all", "unread", "read"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? "bg-primary text-white" : "bg-white border border-border text-gray-600 hover:border-primary/50"}`}>
            {f === "all" ? `Tümü (${items.length})` : f === "unread" ? `Okunmamış (${unreadCount})` : `Okunmuş (${items.length - unreadCount})`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Message List */}
        <div className="lg:col-span-1 bg-white border border-border rounded-lg overflow-hidden">
          <div className="divide-y divide-border max-h-[70vh] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">Mesaj yok</div>
            ) : (
              filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => openMessage(item)}
                  className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${selected?.id === item.id ? "bg-primary/5 border-l-2 border-primary" : ""} ${!item.isRead ? "bg-blue-50/50" : ""}`}
                >
                  <div className="flex items-start gap-2">
                    {!item.isRead ? (
                      <Mail size={14} className="text-primary mt-1 shrink-0" />
                    ) : (
                      <MailOpen size={14} className="text-gray-300 mt-1 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${!item.isRead ? "font-semibold text-foreground" : "text-gray-600"}`}>
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{item.subject}</p>
                      <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                        <Clock size={9} />
                        {new Date(item.createdAt).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground">{selected.subject}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-gray-600">{selected.name}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <a href={`mailto:${selected.email}`} className="text-sm text-primary hover:underline">{selected.email}</a>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(selected.createdAt).toLocaleString("tr-TR")}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleDelete(selected.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Sil">
                    <Trash2 size={16} />
                  </button>
                  <button onClick={() => setSelected(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <button
                  onClick={() => window.open(`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(selected.email)}&su=${encodeURIComponent("Re: " + selected.subject)}`, "_blank")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors"
                >
                  <Mail size={14} /> Gmail ile Yanıtla
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-border rounded-lg p-12 text-center">
              <Mail size={48} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Okumak için bir mesaj seçin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
