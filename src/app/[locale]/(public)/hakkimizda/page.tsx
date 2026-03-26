"use client";

import { useTranslations } from "next-intl";
import PageTitle from "@/components/shared/PageTitle";
import { Target, Users, BookOpen, Globe, GraduationCap, Lightbulb, MessageSquare } from "lucide-react";

export default function HakkimizdaPage() {
  const t = useTranslations("about");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PageTitle title={t("title")} subtitle={t("subtitle")} />

      {/* Ana Açıklama */}
      <div className="bg-white border border-border rounded-lg p-8 shadow-sm mb-8">
        <p className="text-gray-600 leading-relaxed text-lg mb-4">
          <strong className="text-primary">Dijital Enderun</strong>, {t("description1").replace("Dijital Enderun, ", "")}
        </p>
        <p className="text-gray-600 leading-relaxed text-lg">
          {t("description2")}
        </p>
      </div>

      {/* Misyon & Vizyon */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Target size={28} />
            <h3 className="text-xl font-bold">{t("mission")}</h3>
          </div>
          <p className="text-white/90 leading-relaxed">{t("missionText")}</p>
        </div>

        <div className="bg-gradient-to-br from-primary-dark to-secondary text-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Globe size={28} />
            <h3 className="text-xl font-bold">{t("vision")}</h3>
          </div>
          <p className="text-white/90 leading-relaxed">{t("visionText")}</p>
        </div>
      </div>

      {/* Hedef Kitle */}
      <h2 className="text-xl font-bold text-foreground mb-4">{t("whoWeServe")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { icon: GraduationCap, title: t("students"), desc: t("studentsDesc") },
          { icon: Users, title: t("academics"), desc: t("academicsDesc") },
          { icon: Lightbulb, title: t("publicServants"), desc: t("publicServantsDesc") },
        ].map((item) => (
          <div key={item.title} className="bg-white border border-border rounded-lg p-6 shadow-sm text-center">
            <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <item.icon size={28} className="text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Neler Sunuyoruz */}
      <h2 className="text-xl font-bold text-foreground mb-4">{t("whatWeOffer")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: BookOpen, title: t("content"), desc: t("contentDesc") },
          { icon: Globe, title: t("currentInfo"), desc: t("currentInfoDesc") },
          { icon: MessageSquare, title: t("exchange"), desc: t("exchangeDesc") },
        ].map((item) => (
          <div key={item.title} className="bg-white border border-border rounded-lg p-6 shadow-sm text-center">
            <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <item.icon size={28} className="text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
