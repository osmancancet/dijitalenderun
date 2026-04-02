"use client";

import { useState, useEffect, useCallback } from "react";
import { getSupabaseClient } from "@/lib/supabase";

async function getAuthHeaders(): Promise<HeadersInit> {
  const supabase = getSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  return {
    "Content-Type": "application/json",
    ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
  };
}

export function useAdminCollection<T>(collectionName: string) {
  const [items, setItems] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/admin/${collectionName}`, { headers });
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
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/admin/${collection}`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Kayıt eklenemedi");
  const result = await res.json();
  return result.id;
}

export async function adminUpdate(collection: string, id: string, data: Record<string, unknown>): Promise<void> {
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/admin/${collection}/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Güncelleme başarısız");
}

export async function adminDelete(collection: string, id: string): Promise<void> {
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/admin/${collection}/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error("Silme başarısız");
}

export async function adminGetSettings(docId: string): Promise<Record<string, unknown> | null> {
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/admin/settings/${docId}`, { headers });
  if (!res.ok) return null;
  const result = await res.json();
  return result.data;
}

export async function adminSaveSettings(docId: string, data: Record<string, unknown>): Promise<void> {
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/admin/settings/${docId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Kayıt başarısız");
}
