"use client";

import PageTitle from "@/components/shared/PageTitle";
import { useTranslations } from "next-intl";
import { Shield, Cookie, UserCheck, Lock, AlertTriangle, Mail } from "lucide-react";

export default function GizlilikPolitikasiPage() {
  const t = useTranslations("privacy");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageTitle title={t("title")} subtitle={t("subtitle")} hideAd />

      <div className="space-y-6">
        {/* General */}
        <section className="bg-white border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
              <Shield size={20} className="text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground">{t("generalTitle")}</h2>
          </div>
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>{t("generalText1")}</p>
            <p>{t("generalText2")}</p>
          </div>
        </section>

        {/* Data Collection */}
        <section className="bg-white border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
              <UserCheck size={20} className="text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground">{t("dataTitle")}</h2>
          </div>
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>{t("dataIntro")}</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong className="text-foreground">{t("dataContactLabel")}</strong> {t("dataContactText")}</li>
              <li><strong className="text-foreground">{t("dataGaLabel")}</strong> {t("dataGaText")}</li>
              <li><strong className="text-foreground">{t("dataVercelLabel")}</strong> {t("dataVercelText")}</li>
            </ul>
            <p>{t("dataNote")}</p>
          </div>
        </section>

        {/* Cookies */}
        <section className="bg-white border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
              <Cookie size={20} className="text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground">{t("cookieTitle")}</h2>
          </div>
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>{t("cookieIntro")}</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong className="text-foreground">{t("cookieEssentialLabel")}</strong> {t("cookieEssentialText")}</li>
              <li><strong className="text-foreground">{t("cookieAnalyticsLabel")}</strong> {t("cookieAnalyticsText")}</li>
              <li><strong className="text-foreground">{t("cookieAdsLabel")}</strong> {t("cookieAdsText")}</li>
            </ul>
            <p>{t("cookieNote")}</p>
          </div>
        </section>

        {/* Data Security */}
        <section className="bg-white border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
              <Lock size={20} className="text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground">{t("securityTitle")}</h2>
          </div>
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>{t("securityIntro")}</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>{t("securityItem1")}</li>
              <li><strong className="text-foreground">{t("securityItem2")}</strong></li>
              <li>{t("securityItem3")}</li>
              <li>{t("securityItem4")}</li>
            </ul>
          </div>
        </section>

        {/* IP Rights */}
        <section className="bg-white border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
              <AlertTriangle size={20} className="text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground">{t("ipTitle")}</h2>
          </div>
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>{t("ipText")}</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong className="text-foreground">{t("ipItem1")}</strong></li>
              <li><strong className="text-foreground">{t("ipItem2")}</strong></li>
              <li>{t("ipItem3")}</li>
              <li>{t("ipItem4")}</li>
              <li>{t("ipItem5")}</li>
            </ul>
          </div>
        </section>

        {/* User Rights */}
        <section className="bg-white border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
              <UserCheck size={20} className="text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground">{t("rightsTitle")}</h2>
          </div>
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>{t("rightsIntro")}</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>{t("rightsItem1")}</li>
              <li>{t("rightsItem2")}</li>
              <li>{t("rightsItem3")}</li>
              <li>{t("rightsItem4")}</li>
              <li>{t("rightsItem5")}</li>
              <li>{t("rightsItem6")}</li>
              <li>{t("rightsItem7")}</li>
            </ul>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Mail size={24} />
            <h2 className="text-lg font-bold">{t("contactTitle")}</h2>
          </div>
          <div className="text-sm text-white/90 leading-relaxed space-y-2">
            <p>{t("contactText")}</p>
            <a
              href="https://mail.google.com/mail/?view=cm&to=iletisim.dijitalenderun@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors mt-2"
            >
              <Mail size={16} />
              iletisim.dijitalenderun@gmail.com
            </a>
          </div>
        </section>

        <p className="text-xs text-gray-400 text-center">
          {t("lastUpdate")}
        </p>
      </div>
    </div>
  );
}
