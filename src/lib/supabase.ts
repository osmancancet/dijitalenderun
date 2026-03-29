import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

// Client-side (browser) - anon key, RLS enforced
export function getSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Server-side (API routes) - service key, bypasses RLS
export function getSupabaseAdmin() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Collection name mapping: camelCase (app) → snake_case (Supabase table)
const TABLE_MAP: Record<string, string> = {
  slider: "slider",
  resmiGazete: "resmi_gazete",
  personelIlanlari: "personel_ilanlari",
  sbkyDersNotlari: "sbky_ders_notlari",
  mevzuatDersNotlari: "mevzuat_ders_notlari",
  sbkySozluk: "sbky_sozluk",
  videolar: "videolar",
  siteSettings: "site_settings",
  contactMessages: "contact_messages",
  sinavTakvimi: "sinav_takvimi",
};

export function toTableName(collection: string): string {
  return TABLE_MAP[collection] || collection;
}

// Field name mapping: camelCase (app) → snake_case (DB)
export function toSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
  const map: Record<string, string> = {
    imageUrl: "image_url",
    linkUrl: "link_url",
    isActive: "is_active",
    createdAt: "created_at",
    updatedAt: "updated_at",
    sourceUrl: "source_url",
    fileUrl: "file_url",
    gazeteTarihi: "gazete_tarihi",
    noteType: "note_type",
    fileName: "file_name",
    fileSize: "file_size",
    thumbnailUrl: "thumbnail_url",
    downloadCount: "download_count",
    youtubeUrl: "youtube_url",
    videoType: "video_type",
    isRead: "is_read",
    mapEmbedUrl: "map_embed_url",
    socialLinks: "social_links",
    isPublished: "is_published",
    publishedAt: "published_at",
    coverImageUrl: "cover_image_url",
    examDate: "exam_date",
    applicationDeadline: "application_deadline",
  };
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[map[key] || key] = value;
  }
  return result;
}

// Field name mapping: snake_case (DB) → camelCase (app)
export function toCamelCase(obj: Record<string, unknown>): Record<string, unknown> {
  const map: Record<string, string> = {
    image_url: "imageUrl",
    link_url: "linkUrl",
    is_active: "isActive",
    created_at: "createdAt",
    updated_at: "updatedAt",
    source_url: "sourceUrl",
    file_url: "fileUrl",
    gazete_tarihi: "gazeteTarihi",
    note_type: "noteType",
    file_name: "fileName",
    file_size: "fileSize",
    thumbnail_url: "thumbnailUrl",
    download_count: "downloadCount",
    youtube_url: "youtubeUrl",
    video_type: "videoType",
    is_read: "isRead",
    map_embed_url: "mapEmbedUrl",
    social_links: "socialLinks",
    is_published: "isPublished",
    published_at: "publishedAt",
    cover_image_url: "coverImageUrl",
    exam_date: "examDate",
    application_deadline: "applicationDeadline",
  };
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[map[key] || key] = value;
  }
  return result;
}
