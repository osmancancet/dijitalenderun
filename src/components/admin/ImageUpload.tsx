"use client";

import { useState, useRef } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import { compressImage } from "@/lib/utils/compressImage";

interface ImageUploadProps {
  folder: string;
  value?: string;
  onChange: (url: string) => void;
  maxWidth?: number;
  maxHeight?: number;
  recommendedText?: string;
}

async function uploadViaApi(file: File, folder: string): Promise<string> {
  const { getSupabaseClient } = await import("@/lib/supabase");
  const supabase = getSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
    headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
  });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.url;
}

export default function ImageUpload({ folder, value, onChange, maxWidth, maxHeight, recommendedText }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    setError("");
    try {
      let processedFile = file;
      const originalSize = (file.size / 1024).toFixed(0);

      if (maxWidth && maxHeight) {
        setStatus(`Sıkıştırılıyor... (${originalSize} KB)`);
        processedFile = await compressImage(file, maxWidth, maxHeight);
        const newSize = (processedFile.size / 1024).toFixed(0);
        setStatus(`Yükleniyor... (${newSize} KB)`);
      } else {
        setStatus(`Yükleniyor... (${originalSize} KB)`);
      }

      const url = await uploadViaApi(processedFile, folder);
      onChange(url);
      setStatus("");
    } catch (err) {
      console.error("Yükleme hatası:", err);
      setError("Yükleme başarısız oldu. Tekrar deneyin.");
      setStatus("");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {value ? (
        <div className="relative inline-block">
          <img src={value} alt="Yüklenen" className="w-full max-w-xs h-40 object-cover rounded-lg border" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          className={`w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${
            uploading ? "border-primary/50 bg-primary-50/30" : "border-border cursor-pointer hover:border-primary hover:bg-primary-50/50"
          }`}
        >
          {uploading ? (
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
              {status && <span className="text-xs text-gray-500">{status}</span>}
            </div>
          ) : (
            <>
              <ImageIcon size={32} className="text-gray-300 mb-2" />
              <span className="text-sm text-gray-400">Görsel yüklemek için tıklayın</span>
            </>
          )}
        </div>
      )}
      {error && (
        <p className="text-xs text-red-500 mt-1.5">{error}</p>
      )}
      {recommendedText && !error && (
        <p className="text-xs text-gray-400 mt-1.5">{recommendedText}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
