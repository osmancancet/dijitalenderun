"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { uploadFile, generateFilePath } from "@/lib/storage";

interface ImageUploadProps {
  folder: string;
  value?: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ folder, value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const path = generateFilePath(folder, file.name);
      const url = await uploadFile(file, path);
      onChange(url);
    } catch (err) {
      console.error("Yükleme hatası:", err);
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
          onClick={() => inputRef.current?.click()}
          className="w-full h-40 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary-50/50 transition-colors"
        >
          {uploading ? (
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          ) : (
            <>
              <ImageIcon size={32} className="text-gray-300 mb-2" />
              <span className="text-sm text-gray-400">Görsel yüklemek için tıklayın</span>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
