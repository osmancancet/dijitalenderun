"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  type QueryConstraint,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useCollection<T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = [orderBy("createdAt", "desc")]
) {
  const [items, setItems] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = collection(db(), collectionName);
    const q = query(ref, ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(
          (d) => ({ id: d.id, ...d.data() } as T & { id: string })
        );
        setItems(data);
        setLoading(false);
      },
      (error) => {
        console.error(`Firestore dinleme hatası (${collectionName}):`, error);
        setLoading(false);
      }
    );

    return unsubscribe;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, JSON.stringify(constraints.map((c) => c.type))]);

  return { items, loading };
}
