-- ============================================
-- Dijital Enderun - Supabase Migration SQL
-- Bu SQL'i Supabase Dashboard > SQL Editor'da çalıştırın
-- ============================================

-- 1. Slider
CREATE TABLE slider (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  link_url TEXT,
  "order" INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Resmi Gazete
CREATE TABLE resmi_gazete (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  date TIMESTAMPTZ,
  source_url TEXT,
  file_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Personel İlanları
CREATE TABLE personel_ilanlari (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  institution TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  gazete_tarihi TEXT,
  deadline TIMESTAMPTZ,
  source_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. SBKY Ders Notları
CREATE TABLE sbky_ders_notlari (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  note_type TEXT DEFAULT 'file',
  content TEXT,
  file_url TEXT,
  file_name TEXT,
  file_size INT,
  thumbnail_url TEXT,
  download_count INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Mevzuat Ders Notları (aynı yapı)
CREATE TABLE mevzuat_ders_notlari (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  note_type TEXT DEFAULT 'file',
  content TEXT,
  file_url TEXT,
  file_name TEXT,
  file_size INT,
  thumbnail_url TEXT,
  download_count INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. SBKY Sözlük
CREATE TABLE sbky_sozluk (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  term TEXT NOT NULL DEFAULT '',
  definition TEXT NOT NULL DEFAULT '',
  category TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Videolar
CREATE TABLE videolar (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  youtube_url TEXT NOT NULL DEFAULT '',
  description TEXT,
  video_type TEXT NOT NULL DEFAULT 'video',
  "order" INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Site Settings (key-value JSONB)
CREATE TABLE site_settings (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Varsayılan site settings kayıtları
INSERT INTO site_settings (id, data) VALUES
  ('hakkimizda', '{"title": "", "content": "", "imageUrl": ""}'),
  ('iletisim', '{"address": "", "phone": "", "email": "", "mapEmbedUrl": "", "socialLinks": {}}'),
  ('drOzanYetkin', '{"title": "", "bio": "", "education": [], "academicPositions": [], "workExperience": [], "languages": [], "memberships": [], "awards": [], "researchAreas": [], "courses": [], "publications": []}');

-- 9. Contact Messages
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  subject TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- RLS Politikaları (Row Level Security)
-- ============================================

-- Tüm tablolarda RLS aktif et
ALTER TABLE slider ENABLE ROW LEVEL SECURITY;
ALTER TABLE resmi_gazete ENABLE ROW LEVEL SECURITY;
ALTER TABLE personel_ilanlari ENABLE ROW LEVEL SECURITY;
ALTER TABLE sbky_ders_notlari ENABLE ROW LEVEL SECURITY;
ALTER TABLE mevzuat_ders_notlari ENABLE ROW LEVEL SECURITY;
ALTER TABLE sbky_sozluk ENABLE ROW LEVEL SECURITY;
ALTER TABLE videolar ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public okuma politikaları (herkes okuyabilir)
CREATE POLICY "Public read" ON slider FOR SELECT USING (true);
CREATE POLICY "Public read" ON resmi_gazete FOR SELECT USING (true);
CREATE POLICY "Public read" ON personel_ilanlari FOR SELECT USING (true);
CREATE POLICY "Public read" ON sbky_ders_notlari FOR SELECT USING (true);
CREATE POLICY "Public read" ON mevzuat_ders_notlari FOR SELECT USING (true);
CREATE POLICY "Public read" ON sbky_sozluk FOR SELECT USING (true);
CREATE POLICY "Public read" ON videolar FOR SELECT USING (true);
CREATE POLICY "Public read" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read" ON contact_messages FOR SELECT USING (true);

-- Service role tam erişim (API route'lar service key kullanıyor)
-- Service role RLS'i bypass eder, ek policy gerekmez

-- Contact messages: herkes ekleyebilir (form gönderimi)
CREATE POLICY "Public insert" ON contact_messages FOR INSERT WITH CHECK (true);
