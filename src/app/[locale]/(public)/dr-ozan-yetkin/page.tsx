"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import PageTitle from "@/components/shared/PageTitle";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Image from "next/image";
import {
  GraduationCap, Briefcase, BookOpen, Award, Globe, Mail, Phone,
  Building, BookMarked, FileText, PenTool, Users, Trophy, ChevronDown, ChevronUp, ExternalLink
} from "lucide-react";
import type { ProfileContent } from "@/types";

type SectionKey = "education" | "academic" | "work" | "languages" | "memberships" | "awards" | "research" | "courses" | "publications";

export default function DrOzanYetkinPage() {
  const t = useTranslations("profile");
  const [profile, setProfile] = useState<ProfileContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState<Set<SectionKey>>(
    new Set(["education", "academic", "research", "publications"])
  );

  function toggleSection(key: SectionKey) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  useEffect(() => {
    fetch("/api/public/profile")
      .then((res) => res.json())
      .then((d) => setProfile(d.profile ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8"><LoadingSpinner /></div>;

  // Fallback defaults
  const title = profile?.title || "Dr. Öğr. Üyesi Ozan Yetkin";
  const faculty = profile?.faculty || "Simav Meslek Yüksekokulu";
  const program = profile?.program || "Yerel Yönetimler";
  const corporateEmail = profile?.corporateEmail || "ozan.yetkin@dpu.edu.tr";
  const personalEmail = profile?.personalEmail || "drozanyetkin@gmail.com";
  const phoneNum = profile?.phone || "0 (274) 443 6552";

  const education = profile?.education?.length ? profile.education : [
    { years: "2010 - 2015", department: "Kamu Yönetimi Bölümü", university: "Dumlupınar Üniversitesi", degree: "Lisans-Anadal" },
    { years: "2015 - 2017", department: "Kamu Yönetimi (YL) (Tezli)", university: "Dumlupınar Üniversitesi", degree: "Yüksek Lisans-Tezli" },
    { years: "2017 - 2024", department: "Kamu Yönetimi (DR)", university: "Kütahya Dumlupınar Üniversitesi", degree: "Doktora" },
  ];

  const academicPositions = profile?.academicPositions?.length ? profile.academicPositions : [
    { years: "2020 - 2021", title: "Sayı Editörü", institution: "Akademik Düşünce Dergisi", detail: "Hakemli Sosyal Bilimler Dergisi 3. Sayı Bahar" },
    { years: "2018 - (devam ediyor)", title: "Öğretim Görevlisi", institution: "Kütahya Dumlupınar Üniversitesi", detail: "" },
  ];

  const workExperience = profile?.workExperience?.length ? profile.workExperience : [
    { years: "2018 - (devam ediyor)", title: "Öğretim Görevlisi", institution: "Kütahya Dumlupınar Üniversitesi", detail: "Simav Meslek Yüksekokulu - Yerel Yönetimler Programı" },
  ];

  const languages = profile?.languages?.length ? profile.languages : ["İngilizce - YÖKDİL 58.75 (2018)"];
  const memberships = profile?.memberships?.length ? profile.memberships : ["2019 - (devam ediyor) | Akademik Düşünce Enstitüsü"];
  const awards = profile?.awards?.length ? profile.awards : ["2017 - Süleyman Demirel Üniversitesi | En İyi Bildiri Ödülü"];
  const researchAreas = profile?.researchAreas?.length ? profile.researchAreas : [
    "Yönetim Bilimi", "Yerel Yönetimler", "Büyükşehir Belediyeleri", "Afet Yönetimi ve Politikaları",
  ];

  const courses = profile?.courses?.length ? profile.courses : [
    { level: "Ön Lisans", semester: "Bahar Dönemi", name: "Anayasa Hukuku" },
    { level: "Ön Lisans", semester: "Güz Dönemi", name: "İdare Hukuku" },
    { level: "Ön Lisans", semester: "Güz Dönemi", name: "İmar Mevzuatı ve Uygulamaları" },
    { level: "Ön Lisans", semester: "Bahar Dönemi", name: "Kamu Personel Rejimi" },
    { level: "Ön Lisans", semester: "Güz Dönemi", name: "Kamu Yönetimi" },
    { level: "Ön Lisans", semester: "Bahar Dönemi", name: "Siyaset Bilimine Giriş" },
    { level: "Ön Lisans", semester: "Güz Dönemi", name: "Toplam Kalite Yönetimi" },
    { level: "Ön Lisans", semester: "Güz Dönemi", name: "Türkiye'nin Toplumsal Yapısı" },
    { level: "Ön Lisans", semester: "Bahar Dönemi", name: "Yerel Kamu Hizmetleri" },
    { level: "Ön Lisans", semester: "Bahar Dönemi", name: "Yerel Yönetimler" },
    { level: "Ön Lisans", semester: "Güz Dönemi", name: "Yerel Yönetimler ve Sivil Toplum Örgütleri" },
  ];

  const publications = profile?.publications?.length ? profile.publications : [
    { type: "kitap" as const, text: "Yetkin, O. (2025). Türkiye'de Belediye Personel Sistemi: Sorunlar ve Çözüm Önerileri, Özgür Yayınları" },
    { type: "kitap" as const, text: "Sezgin, S. & Yetkin, O. (2024). Cumhuriyet'in 100. Yılında Sosyal Bilimler, Ankara: İmge Kitabevi" },
    { type: "kitap" as const, text: "Küçükşen, M. & Yetkin, O. (2020). Farklı Boyutlarıyla Afet Yönetimi, Ankara: Nobel Yayınevi" },
    { type: "makale" as const, text: "Yetkin, O. (2020). Türkiye'de Büyükşehir Belediyelerinin Yapısı ve Geleceği. Akademik Düşünce Dergisi, 1(1), 4-16." },
    { type: "makale" as const, text: "Yetkin, O. (2019). Yerel Kamu Hizmetleri Bağlamında 6360 Sayılı Yasanın Değerlendirilmesi: Marmaris Belediyesi Örneği. Uluslararası Yönetim Akademisi Dergisi, 2(1), 158-191." },
    { type: "makale" as const, text: "Yetkin, O. (2019). Küreselleşme ve Yerelleşme Kıskacında Türkiye'de Devlet ve Yerel Yönetimler. Türk Düşüncesi Dergisi, (3), 51-56." },
    { type: "makale" as const, text: "Yetkin, O. (2018). İsmail Bey Gaspıralı ve Türk Birliği Düşüncesi. Uluslararası Medeniyet Çalışmaları Dergisi, 3(1), 9-19." },
    { type: "bildiri" as const, text: "Yetkin, O. (2018). Kentsel Siyasetin Bir Aktörü Olarak Kamu Kurumu Niteliğindeki Meslek Kuruluşları, 7. Türkiye Lisansüstü Çalışmaları Kongresi" },
    { type: "bildiri" as const, text: "Yetkin, O. (2017). Metropoliten Kent Kavramı ve Türkiye'de Büyükşehir Belediyelerinin Geleceği, VI. Ulusal Yerel Yönetimler Öğrenci Kongresi" },
    { type: "bildiri" as const, text: "Yaman, M., Çakır, E. & Yetkin, O. (2019). Afet Yönetimi Açısından Yerel Yönetimlerin Önemi ve Kurumsal Kapasitesi: Kütahya Belediyesi Mevcut Durum Analizi, 17. Uluslararası Kamu Yönetimi Forumu" },
    { type: "bildiri" as const, text: "Önder, Ö. & Yetkin, O. (2019). Türkiye'de Kamu Yönetimi Doktora Tezleri (2003-2018): Kamu Yönetimi Reformları Üzerinden Bir İnceleme, 16. Uluslararası Kamu Yönetimi Forumu" },
    { type: "editorluk" as const, text: "Yetkin, O. (2021). Akademik Düşünce Dergisi. Akademik Düşünce Yayınları." },
    { type: "editorluk" as const, text: "Yetkin, O. (2025). II. Göbeklitepe'den Bugüne Türkiye'nin Tarihi ve Kültürel Mirası Sempozyumu Bildiri Özetleri Kitabı. Akademik Düşünce Yayınları." },
  ];

  const pubTypes = [
    { key: "kitap", label: t("books"), icon: BookMarked },
    { key: "makale", label: t("articles"), icon: FileText },
    { key: "bildiri", label: t("proceedings"), icon: PenTool },
    { key: "editorluk", label: t("editorships"), icon: BookOpen },
  ] as const;

  function SectionToggle({ sectionKey, title, icon: Icon }: { sectionKey: SectionKey; title: string; icon: React.ComponentType<{ size?: number; className?: string }> }) {
    const isOpen = openSections.has(sectionKey);
    return (
      <button type="button" onClick={() => toggleSection(sectionKey)} className="w-full flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Icon size={20} className="text-primary" />
          {title}
        </h3>
        {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
    );
  }

  const guzDersleri = courses.filter((c) => c.semester === "Güz Dönemi");
  const baharDersleri = courses.filter((c) => c.semester === "Bahar Dönemi");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PageTitle title={title} subtitle={t("subtitle")} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ===== SOL: Profil Kartı ===== */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm sticky top-24">
            {/* Fotoğraf */}
            {profile?.photoUrl ? (
              <div className="relative w-full h-64">
                <Image src={profile.photoUrl} alt={title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
              </div>
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <span className="text-6xl text-white font-bold">OY</span>
              </div>
            )}

            <div className="p-5">
              <h2 className="text-xl font-bold text-foreground">{title}</h2>
              <p className="text-sm text-gray-500 mt-1">{faculty}</p>
              <p className="text-sm text-primary font-medium">{program}</p>

              {/* İletişim */}
              <div className="mt-4 space-y-2.5 border-t border-border pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={15} className="text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase">Kurumsal</p>
                    <a href={`https://mail.google.com/mail/?view=cm&to=${corporateEmail}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{corporateEmail}</a>
                  </div>
                </div>
                {personalEmail && personalEmail !== corporateEmail && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={15} className="text-primary shrink-0" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase">Kişisel</p>
                      <a href={`https://mail.google.com/mail/?view=cm&to=${personalEmail}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{personalEmail}</a>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={15} className="text-primary shrink-0" />
                  <span>{phoneNum}</span>
                </div>
              </div>

              {/* Araştırma Alanları */}
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">{t("researchAreas")}</p>
                <div className="flex flex-wrap gap-1.5">
                  {researchAreas.map((area) => (
                    <span key={area} className="px-2 py-1 bg-primary-50 text-primary text-xs font-medium rounded-md">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== SAĞ: Detaylar ===== */}
        <div className="lg:col-span-2 space-y-4">
          {/* Biyografi */}
          {profile?.bio && (
            <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <BookOpen size={20} className="text-primary" />
                {t("bio")}
              </h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{profile.bio}</p>
            </div>
          )}

          {/* Eğitim */}
          <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
            <SectionToggle sectionKey="education" title={t("education")} icon={GraduationCap} />
            {openSections.has("education") && (
              <div className="space-y-3">
                {education.map((edu, i) => (
                  <div key={i} className="flex gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="text-xs text-primary font-bold whitespace-nowrap min-w-[90px]">{edu.years}</div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{edu.department}</p>
                      <p className="text-xs text-gray-500">{edu.university} — {edu.degree}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Akademik Görevler */}
          <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
            <SectionToggle sectionKey="academic" title={t("academicPositions")} icon={Building} />
            {openSections.has("academic") && (
              <div className="space-y-3">
                {academicPositions.map((pos, i) => (
                  <div key={i} className="flex gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="text-xs text-primary font-bold whitespace-nowrap min-w-[90px]">{pos.years}</div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{pos.title}</p>
                      <p className="text-xs text-gray-500">{pos.institution}</p>
                      {pos.detail && <p className="text-xs text-gray-400 mt-0.5">{pos.detail}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* İş Deneyimi */}
          <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
            <SectionToggle sectionKey="work" title={t("workExperience")} icon={Briefcase} />
            {openSections.has("work") && (
              <div className="space-y-3">
                {workExperience.map((pos, i) => (
                  <div key={i} className="flex gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="text-xs text-primary font-bold whitespace-nowrap min-w-[90px]">{pos.years}</div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{pos.title}</p>
                      <p className="text-xs text-gray-500">{pos.institution}</p>
                      {pos.detail && <p className="text-xs text-gray-400 mt-0.5">{pos.detail}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Diller */}
          <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
            <SectionToggle sectionKey="languages" title={t("languages")} icon={Globe} />
            {openSections.has("languages") && (
              <div className="space-y-2">
                {languages.map((lang, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-muted/50 rounded-lg">
                    <Globe size={14} className="text-primary shrink-0" />
                    {lang}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Üyelikler */}
          {memberships.length > 0 && (
            <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
              <SectionToggle sectionKey="memberships" title={t("memberships")} icon={Users} />
              {openSections.has("memberships") && (
                <div className="space-y-2">
                  {memberships.map((m, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-muted/50 rounded-lg">
                      <Users size={14} className="text-primary shrink-0" />
                      {m}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Ödüller */}
          {awards.length > 0 && (
            <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
              <SectionToggle sectionKey="awards" title={t("awards")} icon={Trophy} />
              {openSections.has("awards") && (
                <div className="space-y-2">
                  {awards.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-muted/50 rounded-lg">
                      <Award size={14} className="text-primary shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Dersler */}
          <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
            <SectionToggle sectionKey="courses" title={t("courses")} icon={BookMarked} />
            {openSections.has("courses") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Güz */}
                <div>
                  <h4 className="text-sm font-bold text-gray-500 mb-2 uppercase">{t("fallSemester")}</h4>
                  <div className="space-y-1.5">
                    {guzDersleri.map((c, i) => (
                      <div key={i} className="text-sm text-gray-600 p-2 bg-blue-50/50 rounded-md flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full shrink-0" />
                        {c.name}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Bahar */}
                <div>
                  <h4 className="text-sm font-bold text-gray-500 mb-2 uppercase">{t("springSemester")}</h4>
                  <div className="space-y-1.5">
                    {baharDersleri.map((c, i) => (
                      <div key={i} className="text-sm text-gray-600 p-2 bg-green-50/50 rounded-md flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full shrink-0" />
                        {c.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Yayınlar */}
          <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
            <SectionToggle sectionKey="publications" title={`${t("publications")} (${publications.length})`} icon={FileText} />
            {openSections.has("publications") && (
              <div className="space-y-5">
                {/* Özet */}
                <div className="flex flex-wrap gap-3 pb-3 border-b border-border">
                  {pubTypes.map(({ key, label }) => {
                    const count = publications.filter((p) => p.type === key).length;
                    if (count === 0) return null;
                    return (
                      <span key={key} className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        {label}: {count}
                      </span>
                    );
                  })}
                </div>

                {pubTypes.map(({ key, label, icon: PubIcon }) => {
                  const items = publications
                    .filter((p) => p.type === key)
                    .sort((a, b) => (b.year || 0) - (a.year || 0));
                  if (items.length === 0) return null;
                  return (
                    <div key={key}>
                      <h4 className="text-sm font-bold text-gray-500 mb-2 flex items-center gap-1.5 uppercase">
                        <PubIcon size={14} />
                        {label} ({items.length})
                      </h4>
                      <ul className="space-y-2">
                        {items.map((pub, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600 p-2.5 bg-muted/50 rounded-lg">
                            <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">
                              {i + 1}
                            </span>
                            <span className="leading-relaxed flex-1">{pub.text}</span>
                            {pub.url && (
                              <a href={pub.url} target="_blank" rel="noopener noreferrer" className="shrink-0 mt-0.5 w-7 h-7 bg-primary/10 hover:bg-primary hover:text-white text-primary rounded-full flex items-center justify-center transition-colors" title="Makaleyi Görüntüle">
                                <ExternalLink size={14} />
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
