"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { addDocument } from "@/lib/firestore";
import PageTitle from "@/components/shared/PageTitle";
import { Mail, Send, GraduationCap, MessageCircle } from "lucide-react";

export default function IletisimPage() {
  const t = useTranslations("contact");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      await addDocument("contactMessages", {
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
        isRead: false,
      });
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("Mesaj gönderilemedi:", err);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PageTitle title={t("title")} subtitle={t("subtitle")} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* E-posta Bilgileri */}
        <div className="space-y-4">
          <a
            href="mailto:iletisim.dijitalenderun@gmail.com"
            className="block bg-white border border-border rounded-lg p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <MessageCircle size={20} className="text-primary group-hover:text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">{t("generalEmail")}</h3>
                <p className="text-sm text-primary">iletisim.dijitalenderun@gmail.com</p>
              </div>
            </div>
          </a>

          <a
            href="mailto:ozan.yetkin@dpu.edu.tr"
            className="block bg-white border border-border rounded-lg p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <GraduationCap size={20} className="text-primary group-hover:text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">{t("academicEmail")}</h3>
                <p className="text-sm text-primary">ozan.yetkin@dpu.edu.tr</p>
              </div>
            </div>
          </a>

          <div className="bg-primary-50 border border-primary/10 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Mail size={16} className="text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-gray-600 leading-relaxed">{t("emailHint")}</p>
            </div>
          </div>
        </div>

        {/* İletişim Formu */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
            {sent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={28} className="text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{t("success")}</h3>
                <p className="text-gray-500">{t("successDetail")}</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-light transition-colors"
                >
                  {t("newMessage")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">{t("name")}</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">{t("email")}</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">{t("subject")}</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">{t("message")}</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Send size={16} />
                  {sending ? t("sending") : t("send")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
