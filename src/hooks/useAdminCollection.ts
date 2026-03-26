"use client";

import { useState, useEffect, useCallback } from "react";

export function useAdminCollection<T>(collectionName: string) {
  const [items, setItems] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/${collectionName}`);
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      setItems(data.items ?? []);
    } catch (err) {
      console.error(`[useAdminCollection] ${collectionName} fetch error:`, err);
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, loading, refresh };
}

export async function adminAdd(collection: string, data: Record<string, unknown>): Promise<string> {
  const res = await fetch(`/api/admin/${collection}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Kayıt eklenemedi");
  const result = await res.json();
  return result.id;
}

export async function adminUpdate(collection: string, id: string, data: Record<string, unknown>): Promise<void> {
  const res = await fetch(`/api/admin/${collection}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Güncelleme başarısız");
}

export async function adminDelete(collection: string, id: string): Promise<void> {
  const res = await fetch(`/api/admin/${collection}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Silme başarısız");
}

export async function adminGetSettings(docId: string): Promise<Record<string, unknown> | null> {
  const res = await fetch(`/api/admin/settings/${docId}`);
  if (!res.ok) return null;
  const result = await res.json();
  return result.data;
}

export async function adminSaveSettings(docId: string, data: Record<string, unknown>): Promise<void> {
  const res = await fetch(`/api/admin/settings/${docId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Kayıt başarısız");
}
