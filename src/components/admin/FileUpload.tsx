"use client";

import { useState, useRef } from "react";
import { Upload, FileText, X } from "lucide-react";
import { uploadFile, generateFilePath } from "@/lib/storage";

interface FileUploadProps {
  folder: string;
  value?: string;
  fileName?: string;
  onChange: (url: string, name: string, size: number) => void;
}

export default function FileUpload({ folder, value, fileName, onChange }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const path = generateFilePath(folder, file.name);
      const url = await uploadFile(file, path);
      onChange(url, file.name, file.size);
    } catch (err) {
      console.error("Dosya yükleme hatası:", err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {value ? (
        <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg">
          <FileText size={20} className="text-primary" />
          <span className="text-sm font-medium text-foreground flex-1 truncate">
            {fileName || "Dosya yüklendi"}
          </span>
          <button
            type="button"
            onClick={() => onChange("", "", 0)}
            className="text-red-500 hover:text-red-700"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="w-full p-4 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary-50/50 transition-colors"
        >
          {uploading ? (
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          ) : (
            <>
              <Upload size={24} className="text-gray-300 mb-2" />
              <span className="text-sm text-gray-400">Dosya yüklemek için tıklayın</span>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
