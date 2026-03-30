// ========== Slider ==========
export interface SliderItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ========== Resmi Gazete ==========
export interface ResmiGazeteItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  sourceUrl?: string;
  fileUrl?: string;
  isActive: boolean;
  createdAt: string;
}

// ========== Personel İlanları ==========
export interface PersonelIlani {
  id: string;
  title: string;
  institution: string;
  description: string;
  gazeteTarihi?: string;
  deadline?: string;
  sourceUrl?: string;
  isActive: boolean;
  createdAt: string;
}

// ========== Ders Notları ==========
export type NoteType = "file" | "text" | "both";

export interface DersNotu {
  id: string;
  title: string;
  description: string;
  category: string;
  noteType?: NoteType;
  content?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  thumbnailUrl?: string;
  downloadCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ========== SBKY Sözlük ==========
export interface SozlukItem {
  id: string;
  term: string;
  definition: string;
  category?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ========== YouTube Videolar ==========
export type VideoType = "video" | "short";

export interface VideoItem {
  id: string;
  title: string;
  youtubeUrl: string;
  description?: string;
  videoType: VideoType;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ========== Site Ayarları ==========
export interface HakkimizdaContent {
  title: string;
  content: string;
  imageUrl?: string;
  updatedAt: string;
}

export interface IletisimContent {
  address: string;
  phone: string;
  email: string;
  mapEmbedUrl?: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  updatedAt: string;
}

export interface ProfileEducation {
  years: string;
  department: string;
  university: string;
  degree: string;
}

export interface ProfilePosition {
  years: string;
  title: string;
  institution: string;
  detail?: string;
}

export interface ProfilePublication {
  type: "kitap" | "makale" | "bildiri" | "editorluk";
  text: string;
  year?: number;
}

export interface ProfileCourse {
  level: string;
  semester: string;
  name: string;
}

export interface ProfileContent {
  title: string;
  subtitle?: string;
  department?: string;
  faculty?: string;
  program?: string;
  bio: string;
  photoUrl?: string;
  corporateEmail?: string;
  personalEmail?: string;
  phone?: string;
  education: ProfileEducation[];
  academicPositions: ProfilePosition[];
  workExperience: ProfilePosition[];
  languages: string[];
  memberships: string[];
  awards: string[];
  researchAreas: string[];
  courses: ProfileCourse[];
  publications: ProfilePublication[];
  updatedAt: string;
}

// ========== İletişim Formu ==========
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ========== Reklamlar ==========
export interface Reklam {
  id: string;
  title: string;
  imageUrl?: string;
  linkUrl: string;
  position: "left" | "right" | "both" | "horizontal";
  isActive: boolean;
  createdAt: string;
}

// ========== Biyografi ==========
export interface Biyografi {
  id: string;
  name: string;
  title?: string;
  photoUrl?: string;
  bio: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ========== Genel ==========
export type CollectionName =
  | "slider"
  | "resmiGazete"
  | "personelIlanlari"
  | "sbkyDersNotlari"
  | "mevzuatDersNotlari"
  | "sbkySozluk"
  | "videolar"
  | "siteSettings"
  | "contactMessages"
  | "biyografiler"
  | "reklamlar";
