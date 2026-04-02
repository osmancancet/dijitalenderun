import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin, toTableName } from "@/lib/supabase";
import { verifyAdmin } from "@/lib/adminAuth";

const ALLOWED_COLLECTIONS = [
  "slider",
  "videolar",
  "resmiGazete",
  "personelIlanlari",
  "sbkyDersNotlari",
  "mevzuatDersNotlari",
  "sbkySozluk",
  "biyografiler",
  "reklamlar",
];

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { collection, orderedIds } = await request.json();

    if (!collection || !Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json(
        { error: "collection ve orderedIds gerekli" },
        { status: 400 }
      );
    }

    if (!ALLOWED_COLLECTIONS.includes(collection)) {
      return NextResponse.json(
        { error: "Geçersiz koleksiyon" },
        { status: 400 }
      );
    }

    const table = toTableName(collection);
    const supabase = getSupabaseAdmin();

    for (let index = 0; index < orderedIds.length; index++) {
      const id = orderedIds[index];
      const { error } = await supabase
        .from(table)
        .update({ order: index })
        .eq("id", id);

      if (error) {
        console.error(`[reorder] Error updating id=${id}:`, error);
        throw error;
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[reorder] Error:", err);
    return NextResponse.json(
      { error: "Sıralama güncellenemedi" },
      { status: 500 }
    );
  }
}
