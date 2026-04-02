"use client";

import { useState, useRef } from "react";
import { Upload, X, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";

interface CsvField {
  key: string;
  label: string;
  required?: boolean;
}

interface CsvImportProps {
  collection: string;
  fields: CsvField[];
  onComplete: () => void;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === "," || char === ";") {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
  }
  result.push(current.trim());
  return result;
}

function parseCsv(text: string): { headers: string[]; rows: string[][] } {
  // Remove UTF-8 BOM if present
  const cleaned = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const lines = cleaned.split(/\r?\n/).filter((line) => line.trim() !== "");
  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map((line) => parseCsvLine(line));
  return { headers, rows };
}

function matchColumns(
  csvHeaders: string[],
  fields: CsvField[]
): Record<number, string> {
  const mapping: Record<number, string> = {};

  csvHeaders.forEach((header, idx) => {
    const normalized = header.toLowerCase().trim();
    for (const field of fields) {
      if (
        normalized === field.key.toLowerCase() ||
        normalized === field.label.toLowerCase()
      ) {
        mapping[idx] = field.key;
        break;
      }
    }
  });

  return mapping;
}

export default function CsvImport({ collection, fields, onComplete }: CsvImportProps) {
  const [showModal, setShowModal] = useState(false);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<number, string>>({});
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function reset() {
    setCsvHeaders([]);
    setCsvRows([]);
    setColumnMapping({});
    setError(null);
    setSuccessCount(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleClose() {
    reset();
    setShowModal(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setSuccessCount(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const { headers, rows } = parseCsv(text);

      if (headers.length === 0) {
        setError("CSV dosyasi bos veya okunamiyor.");
        return;
      }

      setCsvHeaders(headers);
      setCsvRows(rows);
      setColumnMapping(matchColumns(headers, fields));
    };
    reader.readAsText(file, "UTF-8");
  }

  function handleMappingChange(csvIndex: number, fieldKey: string) {
    setColumnMapping((prev) => {
      const next = { ...prev };
      if (fieldKey === "") {
        delete next[csvIndex];
      } else {
        next[csvIndex] = fieldKey;
      }
      return next;
    });
  }

  function buildItems(): Record<string, unknown>[] {
    return csvRows.map((row) => {
      const item: Record<string, unknown> = {};
      for (const [csvIdx, fieldKey] of Object.entries(columnMapping)) {
        const value = row[Number(csvIdx)];
        if (value !== undefined && value !== "") {
          item[fieldKey] = value;
        }
      }
      return item;
    });
  }

  function validate(): string | null {
    const requiredFields = fields.filter((f) => f.required);
    const mappedKeys = new Set(Object.values(columnMapping));

    for (const rf of requiredFields) {
      if (!mappedKeys.has(rf.key)) {
        return `Zorunlu alan eslestirilmedi: ${rf.label}`;
      }
    }

    if (csvRows.length === 0) {
      return "CSV dosyasinda veri satiri bulunamadi.";
    }

    return null;
  }

  async function handleImport() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setImporting(true);
    setError(null);

    try {
      const items = buildItems();
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/admin/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) },
        body: JSON.stringify({ collection, items }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Hata: ${res.status}`);
      }

      const result = await res.json();
      setSuccessCount(result.count);

      setTimeout(() => {
        handleClose();
        onComplete();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ice aktarma basarisiz");
    } finally {
      setImporting(false);
    }
  }

  const previewRows = csvRows.slice(0, 5);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
      >
        <Upload size={16} /> CSV Ice Aktar
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={20} className="text-emerald-600" />
                <h2 className="text-lg font-bold">CSV Ice Aktar</h2>
              </div>
              <button onClick={handleClose}>
                <X size={20} />
              </button>
            </div>

            {/* File input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                CSV Dosyasi Secin
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm file:mr-3 file:px-3 file:py-1 file:border-0 file:bg-emerald-50 file:text-emerald-700 file:rounded file:text-sm file:font-medium file:cursor-pointer"
              />
            </div>

            {/* Column mapping */}
            {csvHeaders.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Sutun Eslestirme</h3>
                <div className="space-y-2">
                  {csvHeaders.map((header, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-sm"
                    >
                      <span className="w-40 truncate font-mono bg-gray-50 px-2 py-1 rounded text-gray-700">
                        {header}
                      </span>
                      <span className="text-gray-400">&rarr;</span>
                      <select
                        value={columnMapping[idx] || ""}
                        onChange={(e) =>
                          handleMappingChange(idx, e.target.value)
                        }
                        className="flex-1 px-2 py-1 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="">-- Atla --</option>
                        {fields.map((f) => (
                          <option key={f.key} value={f.key}>
                            {f.label}
                            {f.required ? " *" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preview table */}
            {previewRows.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">
                  Onizleme (ilk {previewRows.length} satir / toplam{" "}
                  {csvRows.length})
                </h3>
                <div className="overflow-x-auto border border-border rounded-lg">
                  <table className="w-full text-xs">
                    <thead className="bg-muted text-left">
                      <tr>
                        {csvHeaders.map((h, i) => (
                          <th key={i} className="px-3 py-2 font-medium whitespace-nowrap">
                            {columnMapping[i] ? (
                              <span className="text-emerald-700">
                                {fields.find((f) => f.key === columnMapping[i])?.label || columnMapping[i]}
                              </span>
                            ) : (
                              <span className="text-gray-400 line-through">
                                {h}
                              </span>
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {previewRows.map((row, ri) => (
                        <tr key={ri} className="hover:bg-muted/50">
                          {csvHeaders.map((_, ci) => (
                            <td
                              key={ci}
                              className={`px-3 py-1.5 whitespace-nowrap ${
                                !columnMapping[ci] ? "text-gray-300" : ""
                              }`}
                            >
                              {row[ci] || ""}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg text-sm mb-4">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Success */}
            {successCount !== null && (
              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg text-sm mb-4">
                <CheckCircle2 size={16} />
                {successCount} kayit basariyla ice aktarildi!
              </div>
            )}

            {/* Import button */}
            {csvRows.length > 0 && successCount === null && (
              <button
                onClick={handleImport}
                disabled={importing}
                className="w-full py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {importing
                  ? "Ice aktariliyor..."
                  : `${csvRows.length} Kaydi Ice Aktar`}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
