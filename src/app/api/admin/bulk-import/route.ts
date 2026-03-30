import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin, toTableName, toSnakeCase } from "@/lib/supabase";

const ALLOWED_COLLECTIONS = [
  "sbkySozluk",
  "sbkyDersNotlari",
  "mevzuatDersNotlari",
  "resmiGazete",
  "personelIlanlari",
  "videolar",
  "biyografiler",
];

export async function POST(request: NextRequest) {
  try {
    const { collection, items } = await request.json();

    if (!collection || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Geçersiz istek: collection ve items gerekli" },
        { status: 400 }
      );
    }

    if (!ALLOWED_COLLECTIONS.includes(collection)) {
      return NextResponse.json(
        { error: `Koleksiyon izin verilmiyor: ${collection}` },
        { status: 403 }
      );
    }

    const table = toTableName(collection);
    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    const mappedItems = items.map((item: Record<string, unknown>) => {
      const snakeItem = toSnakeCase(item);
      // Remove id if present (let DB generate it)
      delete snakeItem.id;
      return {
        ...snakeItem,
        is_active: snakeItem.is_active ?? true,
        status: snakeItem.status ?? "draft",
        created_at: snakeItem.created_at ?? now,
      };
    });

    const { data, error } = await supabase
      .from(table)
      .insert(mappedItems)
      .select("id");

    if (error) throw error;

    return NextResponse.json({ count: data?.length ?? 0 });
  } catch (err) {
    console.error("[bulk-import] error:", err);
    return NextResponse.json(
      { error: "Toplu içe aktarma başarısız" },
      { status: 500 }
    );
  }
}
