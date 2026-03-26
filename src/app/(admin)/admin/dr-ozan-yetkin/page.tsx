"use client";

import { useState, useEffect } from "react";
import { getDocument, setDocument } from "@/lib/firestore";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ImageUpload from "@/components/admin/ImageUpload";
import { Save, Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import type { ProfileContent, ProfileEducation, ProfilePosition, ProfilePublication, ProfileCourse } from "@/types";

type SectionKey = "personal" | "education" | "academic" | "work" | "languages" | "memberships" | "awards" | "research" | "courses" | "publications";

const emptyEducation: ProfileEducation = { years: "", department: "", university: "", degree: "" };
const emptyPosition: ProfilePosition = { years: "", title: "", institution: "", detail: "" };
const emptyPublication: ProfilePublication = { type: "makale", text: "" };
const emptyCourse: ProfileCourse = { level: "Ön Lisans", semester: "Güz Dönemi", name: "" };

export default function AdminDrOzanYetkinPage() {
  const [form, setForm] = useState({
    title: "Dr. Öğr. Üyesi Ozan Yetkin",
    subtitle: "",
    department: "",
    faculty: "",
    program: "",
    bio: "",
    photoUrl: "",
    corporateEmail: "",
    personalEmail: "",
    phone: "",
    education: [emptyEducation] as ProfileEducation[],
    academicPositions: [emptyPosition] as ProfilePosition[],
    workExperience: [emptyPosition] as ProfilePosition[],
    languages: [""] as string[],
    memberships: [""] as string[],
    awards: [""] as string[],
    researchAreas: [""] as string[],
    courses: [emptyCourse] as ProfileCourse[],
    publications: [emptyPublication] as ProfilePublication[],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [openSections, setOpenSections] = useState<Set<SectionKey>>(new Set(["personal"]));

  function toggleSection(key: SectionKey) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  useEffect(() => {
    getDocument<ProfileContent>("siteSettings", "drOzanYetkin").then((doc) => {
      if (doc) {
        setForm({
          title: doc.title || "Dr. Öğr. Üyesi Ozan Yetkin",
          subtitle: doc.subtitle || "",
          department: doc.department || "",
          faculty: doc.faculty || "",
          program: doc.program || "",
          bio: doc.bio || "",
          photoUrl: doc.photoUrl || "",
          corporateEmail: doc.corporateEmail || "",
          personalEmail: doc.personalEmail || "",
          phone: doc.phone || "",
          education: doc.education?.length ? doc.education : [emptyEducation],
          academicPositions: doc.academicPositions?.length ? doc.academicPositions : [emptyPosition],
          workExperience: doc.workExperience?.length ? doc.workExperience : [emptyPosition],
          languages: doc.languages?.length ? doc.languages : [""],
          memberships: doc.memberships?.length ? doc.memberships : [""],
          awards: doc.awards?.length ? doc.awards : [""],
          researchAreas: doc.researchAreas?.length ? doc.researchAreas : [""],
          courses: doc.courses?.length ? doc.courses : [emptyCourse],
          publications: doc.publications?.length ? doc.publications : [emptyPublication],
        });
      }
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    await setDocument("siteSettings", "drOzanYetkin", {
      ...form,
      languages: form.languages.filter(Boolean),
      memberships: form.memberships.filter(Boolean),
      awards: form.awards.filter(Boolean),
      researchAreas: form.researchAreas.filter(Boolean),
      education: form.education.filter((e) => e.university),
      academicPositions: form.academicPositions.filter((p) => p.institution),
      workExperience: form.workExperience.filter((p) => p.institution),
      courses: form.courses.filter((c) => c.name),
      publications: form.publications.filter((p) => p.text),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  // Generic list helpers
  function updateStringList(key: "languages" | "memberships" | "awards" | "researchAreas", index: number, value: string) {
    const updated = [...form[key]];
    updated[index] = value;
    setForm({ ...form, [key]: updated });
  }
  function addStringItem(key: "languages" | "memberships" | "awards" | "researchAreas") {
    setForm({ ...form, [key]: [...form[key], ""] });
  }
  function removeStringItem(key: "languages" | "memberships" | "awards" | "researchAreas", index: number) {
    const updated = form[key].filter((_, i) => i !== index);
    setForm({ ...form, [key]: updated.length ? updated : [""] });
  }

  if (loading) return <LoadingSpinner />;

  const inputCls = "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  function SectionHeader({ sectionKey, title }: { sectionKey: SectionKey; title: string }) {
    const isOpen = openSections.has(sectionKey);
    return (
      <button type="button" onClick={() => toggleSection(sectionKey)} className="w-full flex items-center justify-between py-3 text-left">
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dr. Ozan Yetkin Profili</h1>
          <p className="text-sm text-gray-500 mt-1">Profil sayfası içeriğini düzenleyin</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-50">
          <Save size={16} />
          {saving ? "Kaydediliyor..." : saved ? "Kaydedildi!" : "Kaydet"}
        </button>
      </div>

      <div className="space-y-4">
        {/* ===== KİŞİSEL BİLGİLER ===== */}
        <div className="bg-white border border-border rounded-lg px-6">
          <SectionHeader sectionKey="personal" title="Kişisel Bilgiler" />
          {openSections.has("personal") && (
            <div className="pb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Unvan & İsim</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Alt Başlık</label>
                  <input type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className={inputCls} placeholder="ör: Kişisel" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Fakülte / MYO</label>
                  <input type="text" value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bölüm</label>
                  <input type="text" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Program</label>
                  <input type="text" value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Kurumsal E-posta</label>
                  <input type="email" value={form.corporateEmail} onChange={(e) => setForm({ ...form, corporateEmail: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Kişisel E-posta</label>
                  <input type="email" value={form.personalEmail} onChange={(e) => setForm({ ...form, personalEmail: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">İş Telefonu</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Profil Fotoğrafı</label>
                <ImageUpload folder="profile" value={form.photoUrl} onChange={(url) => setForm({ ...form, photoUrl: url })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Biyografi</label>
                <textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className={`${inputCls} resize-none`} />
              </div>
            </div>
          )}
        </div>

        {/* ===== EĞİTİM ===== */}
        <div className="bg-white border border-border rounded-lg px-6">
          <SectionHeader sectionKey="education" title="Eğitim Durumu" />
          {openSections.has("education") && (
            <div className="pb-6 space-y-3">
              {form.education.map((edu, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                    <input type="text" value={edu.years} onChange={(e) => { const u = [...form.education]; u[i] = { ...edu, years: e.target.value }; setForm({ ...form, education: u }); }} className={inputCls} placeholder="2010 - 2015" />
                    <input type="text" value={edu.degree} onChange={(e) => { const u = [...form.education]; u[i] = { ...edu, degree: e.target.value }; setForm({ ...form, education: u }); }} className={inputCls} placeholder="Lisans / YL / Doktora" />
                    <input type="text" value={edu.department} onChange={(e) => { const u = [...form.education]; u[i] = { ...edu, department: e.target.value }; setForm({ ...form, education: u }); }} className={inputCls} placeholder="Bölüm" />
                    <input type="text" value={edu.university} onChange={(e) => { const u = [...form.education]; u[i] = { ...edu, university: e.target.value }; setForm({ ...form, education: u }); }} className={inputCls} placeholder="Üniversite" />
                  </div>
                  <button type="button" onClick={() => { const u = form.education.filter((_, j) => j !== i); setForm({ ...form, education: u.length ? u : [emptyEducation] }); }} className="text-red-500 hover:text-red-700 mt-2"><X size={16} /></button>
                </div>
              ))}
              <button type="button" onClick={() => setForm({ ...form, education: [...form.education, emptyEducation] })} className="text-primary text-sm flex items-center gap-1 hover:underline"><Plus size={14} /> Eğitim Ekle</button>
            </div>
          )}
        </div>

        {/* ===== AKADEMİK GÖREVLER ===== */}
        <div className="bg-white border border-border rounded-lg px-6">
          <SectionHeader sectionKey="academic" title="Akademik Görevler" />
          {openSections.has("academic") && (
            <div className="pb-6 space-y-3">
              {form.academicPositions.map((pos, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                    <input type="text" value={pos.years} onChange={(e) => { const u = [...form.academicPositions]; u[i] = { ...pos, years: e.target.value }; setForm({ ...form, academicPositions: u }); }} className={inputCls} placeholder="2018 - devam" />
                    <input type="text" value={pos.title} onChange={(e) => { const u = [...form.academicPositions]; u[i] = { ...pos, title: e.target.value }; setForm({ ...form, academicPositions: u }); }} className={inputCls} placeholder="Görev Unvanı" />
                    <input type="text" value={pos.institution} onChange={(e) => { const u = [...form.academicPositions]; u[i] = { ...pos, institution: e.target.value }; setForm({ ...form, academicPositions: u }); }} className={inputCls} placeholder="Kurum" />
                    <input type="text" value={pos.detail || ""} onChange={(e) => { const u = [...form.academicPositions]; u[i] = { ...pos, detail: e.target.value }; setForm({ ...form, academicPositions: u }); }} className={inputCls} placeholder="Detay (opsiyonel)" />
                  </div>
                  <button type="button" onClick={() => { const u = form.academicPositions.filter((_, j) => j !== i); setForm({ ...form, academicPositions: u.length ? u : [emptyPosition] }); }} className="text-red-500 hover:text-red-700 mt-2"><X size={16} /></button>
                </div>
              ))}
              <button type="button" onClick={() => setForm({ ...form, academicPositions: [...form.academicPositions, emptyPosition] })} className="text-primary text-sm flex items-center gap-1 hover:underline"><Plus size={14} /> Görev Ekle</button>
            </div>
          )}
        </div>

        {/* ===== İŞ DENEYİMİ ===== */}
        <div className="bg-white border border-border rounded-lg px-6">
          <SectionHeader sectionKey="work" title="İş Deneyimi" />
          {openSections.has("work") && (
            <div className="pb-6 space-y-3">
              {form.workExperience.map((pos, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                    <input type="text" value={pos.years} onChange={(e) => { const u = [...form.workExperience]; u[i] = { ...pos, years: e.target.value }; setForm({ ...form, workExperience: u }); }} className={inputCls} placeholder="2018 - devam" />
                    <input type="text" value={pos.title} onChange={(e) => { const u = [...form.workExperience]; u[i] = { ...pos, title: e.target.value }; setForm({ ...form, workExperience: u }); }} className={inputCls} placeholder="Unvan" />
                    <input type="text" value={pos.institution} onChange={(e) => { const u = [...form.workExperience]; u[i] = { ...pos, institution: e.target.value }; setForm({ ...form, workExperience: u }); }} className={inputCls} placeholder="Kurum" />
                    <input type="text" value={pos.detail || ""} onChange={(e) => { const u = [...form.workExperience]; u[i] = { ...pos, detail: e.target.value }; setForm({ ...form, workExperience: u }); }} className={inputCls} placeholder="Detay (opsiyonel)" />
                  </div>
                  <button type="button" onClick={() => { const u = form.workExperience.filter((_, j) => j !== i); setForm({ ...form, workExperience: u.length ? u : [emptyPosition] }); }} className="text-red-500 hover:text-red-700 mt-2"><X size={16} /></button>
                </div>
              ))}
              <button type="button" onClick={() => setForm({ ...form, workExperience: [...form.workExperience, emptyPosition] })} className="text-primary text-sm flex items-center gap-1 hover:underline"><Plus size={14} /> Deneyim Ekle</button>
            </div>
          )}
        </div>

        {/* ===== DİLLER ===== */}
        <div className="bg-white border border-border rounded-lg px-6">
          <SectionHeader sectionKey="languages" title="Yabancı Diller" />
          {openSections.has("languages") && (
            <div className="pb-6 space-y-2">
              {form.languages.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="text" value={item} onChange={(e) => updateStringList("languages", i, e.target.value)} className={`flex-1 ${inputCls}`} placeholder="ör: İngilizce - YÖKDİL 58.75" />
                  <button type="button" onClick={() => removeStringItem("languages", i)} className="text-red-500 hover:text-red-700"><X size={16} /></button>
                </div>
              ))}
              <button type="button" onClick={() => addStringItem("languages")} className="text-primary text-sm flex items-center gap-1 hover:underline"><Plus size={14} /> Dil Ekle</button>
            </div>
          )}
        </div>

        {/* ===== ÜYELİKLER ===== */}
        <div className="bg-white border border-border rounded-lg px-6">
          <SectionHeader sectionKey="memberships" title="Üye Olunan Dernek & Meslek Odaları" />
          {openSections.has("memberships") && (
            <div className="pb-6 space-y-2">
              {form.memberships.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="text" value={item} onChange={(e) => updateStringList("memberships", i, e.target.value)} className={`flex-1 ${inputCls}`} placeholder="ör: 2019 - devam | Akademik Düşünce Enstitüsü" />
                  <button type="button" onClick={() => removeStringItem("memberships", i)} className="text-red-500 hover:text-red-700"><X size={16} /></button>
                </div>
              ))}
              <button type="button" onClick={() => addStringItem("memberships")} className="text-primary text-sm flex items-center gap-1 hover:underline"><Plus size={14} /> Üyelik Ekle</button>
            </div>
          )}
        </div>

        {/* ===== ÖDÜLLER ===== */}
        <div className="bg-white border border-border rounded-lg px-6">
          <SectionHeader sectionKey="awards" title="Ödüller & Burslar" />
          {openSections.has("awards") && (
            <div className="pb-6 space-y-2">
              {form.awards.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="text" value={item} onChange={(e) => updateStringList("awards", i, e.target.value)} className={`flex-1 ${inputCls}`} placeholder="ör: 2017 - SDÜ En İyi Bildiri Ödülü" />
                  <button type="button" onClick={() => removeStringItem("awards", i)} className="text-red-500 hover:text-red-700"><X size={16} /></button>
                </div>
              ))}
              <button type="button" onClick={() => addStringItem("awards")} className="text-primary text-sm flex items-center gap-1 hover:underline"><Plus size={14} /> Ödül Ekle</button>
            </div>
          )}
        </div>

        {/* ===== ARAŞTIRMA ALANLARI ===== */}
        <div className="bg-white border border-border rounded-lg px-6">
          <SectionHeader sectionKey="research" title="Çalışma ve Sorumluluk Alanları" />
          {openSections.has("research") && (
            <div className="pb-6 space-y-2">
              {form.researchAreas.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="text" value={item} onChange={(e) => updateStringList("researchAreas", i, e.target.value)} className={`flex-1 ${inputCls}`} placeholder="ör: Yerel Yönetimler" />
                  <button type="button" onClick={() => removeStringItem("researchAreas", i)} className="text-red-500 hover:text-red-700"><X size={16} /></button>
                </div>
              ))}
              <button type="button" onClick={() => addStringItem("researchAreas")} className="text-primary text-sm flex items-center gap-1 hover:underline"><Plus size={14} /> Alan Ekle</button>
            </div>
          )}
        </div>

        {/* ===== DERSLER ===== */}
        <div className="bg-white border border-border rounded-lg px-6">
          <SectionHeader sectionKey="courses" title="Dersler" />
          {openSections.has("courses") && (
            <div className="pb-6 space-y-3">
              {form.courses.map((course, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                    <select value={course.level} onChange={(e) => { const u = [...form.courses]; u[i] = { ...course, level: e.target.value }; setForm({ ...form, courses: u }); }} className={inputCls}>
                      <option value="Ön Lisans">Ön Lisans</option>
                      <option value="Lisans">Lisans</option>
                      <option value="Yüksek Lisans">Yüksek Lisans</option>
                      <option value="Doktora">Doktora</option>
                    </select>
                    <select value={course.semester} onChange={(e) => { const u = [...form.courses]; u[i] = { ...course, semester: e.target.value }; setForm({ ...form, courses: u }); }} className={inputCls}>
                      <option value="Güz Dönemi">Güz Dönemi</option>
                      <option value="Bahar Dönemi">Bahar Dönemi</option>
                    </select>
                    <input type="text" value={course.name} onChange={(e) => { const u = [...form.courses]; u[i] = { ...course, name: e.target.value }; setForm({ ...form, courses: u }); }} className={inputCls} placeholder="Ders Adı" />
                  </div>
                  <button type="button" onClick={() => { const u = form.courses.filter((_, j) => j !== i); setForm({ ...form, courses: u.length ? u : [emptyCourse] }); }} className="text-red-500 hover:text-red-700 mt-2"><X size={16} /></button>
                </div>
              ))}
              <button type="button" onClick={() => setForm({ ...form, courses: [...form.courses, emptyCourse] })} className="text-primary text-sm flex items-center gap-1 hover:underline"><Plus size={14} /> Ders Ekle</button>
            </div>
          )}
        </div>

        {/* ===== YAYINLAR ===== */}
        <div className="bg-white border border-border rounded-lg px-6">
          <SectionHeader sectionKey="publications" title="Yayınlar" />
          {openSections.has("publications") && (
            <div className="pb-6 space-y-3">
              {form.publications.map((pub, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-[150px_1fr] gap-2">
                    <select value={pub.type} onChange={(e) => { const u = [...form.publications]; u[i] = { ...pub, type: e.target.value as ProfilePublication["type"] }; setForm({ ...form, publications: u }); }} className={inputCls}>
                      <option value="kitap">Kitap</option>
                      <option value="makale">Makale</option>
                      <option value="bildiri">Bildiri</option>
                      <option value="editorluk">Editörlük</option>
                    </select>
                    <input type="text" value={pub.text} onChange={(e) => { const u = [...form.publications]; u[i] = { ...pub, text: e.target.value }; setForm({ ...form, publications: u }); }} className={inputCls} placeholder="Yayın künyesi" />
                  </div>
                  <button type="button" onClick={() => { const u = form.publications.filter((_, j) => j !== i); setForm({ ...form, publications: u.length ? u : [emptyPublication] }); }} className="text-red-500 hover:text-red-700 mt-2"><X size={16} /></button>
                </div>
              ))}
              <button type="button" onClick={() => setForm({ ...form, publications: [...form.publications, emptyPublication] })} className="text-primary text-sm flex items-center gap-1 hover:underline"><Plus size={14} /> Yayın Ekle</button>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Save */}
      <div className="sticky bottom-4 flex justify-end mt-6">
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-50 shadow-lg">
          <Save size={16} />
          {saving ? "Kaydediliyor..." : saved ? "Kaydedildi!" : "Tümünü Kaydet"}
        </button>
      </div>
    </div>
  );
}
