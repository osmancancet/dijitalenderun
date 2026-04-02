"use client";

import { useState, useRef } from "react";
import { Upload, FileText, X } from "lucide-react";

interface FileUploadProps {
  folder: string;
  value?: string;
  fileName?: string;
  onChange: (url: string, name: string, size: number) => void;
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

export default function FileUpload({ folder, value, fileName, onChange }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const url = await uploadViaApi(file, folder);
      onChange(url, file.name, file.size);
    } catch (err) {
      console.error("Dosya yükleme hatası:", err);
      setError("Yükleme başarısız oldu. Tekrar deneyin.");
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
          onClick={() => !uploading && inputRef.current?.click()}
          className={`w-full p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${
            uploading ? "border-primary/50 bg-primary-50/30" : "border-border cursor-pointer hover:border-primary hover:bg-primary-50/50"
          }`}
        >
          {uploading ? (
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
              <span className="text-xs text-gray-500">Yükleniyor...</span>
            </div>
          ) : (
            <>
              <Upload size={24} className="text-gray-300 mb-2" />
              <span className="text-sm text-gray-400">Dosya yüklemek için tıklayın</span>
            </>
          )}
        </div>
      )}
      {error && (
        <p className="text-xs text-red-500 mt-1.5">{error}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
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
