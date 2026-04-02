import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin, toTableName, toSnakeCase, toCamelCase } from "@/lib/supabase";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  const auth = await verifyAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { collection } = await params;
    const table = toTableName(collection);
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const items = (data || []).map((row) => toCamelCase(row));
    return NextResponse.json({ items });
  } catch (err) {
    console.error("[admin API] GET error:", err);
    return NextResponse.json({ error: "Veri yüklenemedi", items: [] }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  const auth = await verifyAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { collection } = await params;
    const table = toTableName(collection);
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    const snakeData = toSnakeCase(body);
    delete snakeData.id;

    const { data, error } = await supabase
      .from(table)
      .insert(snakeData)
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error("[admin API] POST error:", err);
    return NextResponse.json({ error: "Kayıt eklenemedi" }, { status: 500 });
  }
}
