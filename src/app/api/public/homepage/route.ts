import { NextResponse } from "next/server";
import { getDocuments } from "@/lib/firestore-admin";

export async function GET() {
  try {
    const [slider, resmiGazete, personelIlanlari, videolar] = await Promise.all([
      getDocuments("slider", { orderBy: { field: "order", direction: "asc" }, limit: 10 }),
      getDocuments("resmiGazete", { orderBy: { field: "createdAt", direction: "desc" }, limit: 5 }),
      getDocuments("personelIlanlari", { orderBy: { field: "createdAt", direction: "desc" }, limit: 10 }),
      getDocuments("videolar", { orderBy: { field: "order", direction: "asc" }, limit: 12 }),
    ]);

    return NextResponse.json(
      { slider, resmiGazete, personelIlanlari, videolar },
      { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch (err) {
    console.error("[homepage API] Firebase error:", err);
    return NextResponse.json(
      { error: "Veri yüklenemedi", slider: [], resmiGazete: [], personelIlanlari: [], videolar: [] },
      { status: 500 }
    );
  }
}
