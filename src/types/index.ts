// Lightweight type — Firebase SDK'yı client bundle'a çekmemek için
export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
  _seconds?: number;
  _nanoseconds?: number;
}

// ========== Slider ==========
export interface SliderItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

// ========== Resmi Gazete ==========
export interface ResmiGazeteItem {
  id: string;
  title: string;
  summary: string;
  date: FirestoreTimestamp;
  sourceUrl?: string;
  fileUrl?: string;
  isActive: boolean;
  createdAt: FirestoreTimestamp;
}

// ========== Personel İlanları ==========
export interface PersonelIlani {
  id: string;
  title: string;
  institution: string;
  description: string;
  gazeteTarihi?: string;
  deadline?: FirestoreTimestamp;
  sourceUrl?: string;
  isActive: boolean;
  createdAt: FirestoreTimestamp;
}

// ========== Ders Notları ==========
export interface DersNotu {
  id: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  thumbnailUrl?: string;
  downloadCount: number;
  isActive: boolean;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

// ========== Blog ==========
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImageUrl?: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: FirestoreTimestamp;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
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
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

// ========== Site Ayarları ==========
export interface HakkimizdaContent {
  title: string;
  content: string;
  imageUrl?: string;
  updatedAt: FirestoreTimestamp;
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
  updatedAt: FirestoreTimestamp;
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
  updatedAt: FirestoreTimestamp;
}

// ========== İletişim Formu ==========
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: FirestoreTimestamp;
}

// ========== Genel ==========
export type CollectionName =
  | "slider"
  | "resmiGazete"
  | "personelIlanlari"
  | "sbkyDersNotlari"
  | "mevzuatDersNotlari"
  | "blog"
  | "videolar"
  | "siteSettings"
  | "contactMessages";
