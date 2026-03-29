"use client";

import PageTitle from "@/components/shared/PageTitle";
import { Shield, Cookie, UserCheck, Lock, AlertTriangle, Mail } from "lucide-react";

export default function GizlilikPolitikasiPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageTitle title="Gizlilik Politikası & KVKK" subtitle="Kişisel verilerin korunması ve kullanım koşulları" />

      <div className="space-y-6">
        {/* Genel */}
        <section className="bg-white border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
              <Shield size={20} className="text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Genel Bilgilendirme</h2>
          </div>
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>
              <strong className="text-foreground">Dijital Enderun</strong> (dijitalenderun.org), siyaset bilimi ve kamu yönetimi alanında eğitim içerikleri sunan bir dijital platformdur. Bu gizlilik politikası, sitemizi ziyaret eden kullanıcıların kişisel verilerinin nasıl toplandığını, işlendiğini ve korunduğunu açıklamaktadır.
            </p>
            <p>
              Bu politika, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve ilgili mevzuat çerçevesinde hazırlanmıştır.
            </p>
          </div>
        </section>

        {/* Toplanan Veriler */}
        <section className="bg-white border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
              <UserCheck size={20} className="text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Toplanan Kişisel Veriler</h2>
          </div>
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>Sitemiz aşağıdaki durumlarda kişisel veri toplamaktadır:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong className="text-foreground">İletişim Formu:</strong> Ad-soyad, e-posta adresi, konu ve mesaj içeriği — yalnızca sizinle iletişim kurmak amacıyla toplanmaktadır.</li>
              <li><strong className="text-foreground">Google Analytics:</strong> Anonim ziyaretçi istatistikleri (sayfa görüntüleme, cihaz türü, tarayıcı bilgisi, coğrafi konum gibi) — siteyi geliştirmek amacıyla toplanmaktadır. Bu veriler kişisel kimlik bilgisi içermez.</li>
              <li><strong className="text-foreground">Vercel Analytics:</strong> Anonim performans ve kullanım verileri — sitenin hızını ve kullanılabilirliğini iyileştirmek amacıyla toplanmaktadır.</li>
            </ul>
            <p>Sitemiz, üyelik sistemi veya ödeme altyapısı kullanmamaktadır. Kredi kartı, TC kimlik numarası gibi hassas kişisel veriler <strong className="text-foreground">hiçbir şekilde toplanmamaktadır.</strong></p>
          </div>
        </section>

        {/* Çerezler */}
        <section className="bg-white border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
              <Cookie size={20} className="text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Çerez (Cookie) Kullanımı</h2>
          </div>
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>Sitemiz, kullanıcı deneyimini iyileştirmek ve ziyaretçi istatistiklerini analiz etmek amacıyla çerez kullanmaktadır:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong className="text-foreground">Zorunlu Çerezler:</strong> Sitenin düzgün çalışması için gerekli teknik çerezler.</li>
              <li><strong className="text-foreground">Analitik Çerezler:</strong> Google Analytics ve Vercel Analytics tarafından anonim istatistik toplama amacıyla kullanılır.</li>
              <li><strong className="text-foreground">Reklam Çerezleri:</strong> Google AdSense tarafından ilgi alanına yönelik reklam gösterimi amacıyla kullanılabilir.</li>
            </ul>
            <p>Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz. Ancak bu durumda bazı site işlevleri kısıtlanabilir.</p>
          </div>
        </section>

        {/* Veri Güvenliği */}
        <section className="bg-white border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
              <Lock size={20} className="text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Verilerin Korunması ve Paylaşılması</h2>
          </div>
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>Toplanan kişisel veriler:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Güvenli sunucularda (SSL/TLS şifreleme ile) saklanmaktadır.</li>
              <li>Üçüncü taraflarla <strong className="text-foreground">ticari amaçla paylaşılmamakta</strong> ve satılmamaktadır.</li>
              <li>Yalnızca yasal zorunluluk durumlarında yetkili kamu kurum ve kuruluşlarıyla paylaşılabilir.</li>
              <li>Hizmet sağlayıcılar (Vercel, Supabase, Google) tarafından yalnızca teknik altyapı kapsamında işlenebilir.</li>
            </ul>
          </div>
        </section>

        {/* İçerik Hakları */}
        <section className="bg-white border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
              <AlertTriangle size={20} className="text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Fikri Mülkiyet ve İçerik Hakları</h2>
          </div>
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>
              Dijital Enderun platformunda yer alan tüm içerikler (ders notları, makaleler, görseller, videolar, tasarım ve yazılım) 5846 sayılı Fikir ve Sanat Eserleri Kanunu kapsamında korunmaktadır.
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>İçerikler yalnızca <strong className="text-foreground">kişisel ve eğitim amaçlı</strong> kullanılabilir.</li>
              <li>İçeriklerin izinsiz kopyalanması, çoğaltılması, dağıtılması veya ticari amaçla kullanılması <strong className="text-foreground">yasaktır.</strong></li>
              <li>Kaynak gösterilmeden yapılan alıntılar telif hakkı ihlali oluşturur.</li>
              <li>İçeriklerin başka platformlarda paylaşılması durumunda <strong className="text-foreground">&quot;dijitalenderun.org&quot;</strong> kaynak olarak belirtilmelidir.</li>
              <li>İhlal durumunda yasal işlem başlatma hakkı saklıdır.</li>
            </ul>
          </div>
        </section>

        {/* KVKK Hakları */}
        <section className="bg-white border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
              <UserCheck size={20} className="text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground">KVKK Kapsamındaki Haklarınız</h2>
          </div>
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>6698 sayılı KVKK&apos;nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme</li>
              <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
              <li>Eksik veya yanlış işlenmiş olması halinde düzeltilmesini isteme</li>
              <li>KVKK&apos;nın 7. maddesinde öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme</li>
              <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
            </ul>
          </div>
        </section>

        {/* İletişim */}
        <section className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Mail size={24} />
            <h2 className="text-lg font-bold">İletişim</h2>
          </div>
          <div className="text-sm text-white/90 leading-relaxed space-y-2">
            <p>Kişisel verilerinizle ilgili talepleriniz veya içerik hakları konusundaki başvurularınız için aşağıdaki e-posta adresinden bize ulaşabilirsiniz:</p>
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
          Son güncelleme: Mart 2026
        </p>
      </div>
    </div>
  );
}
