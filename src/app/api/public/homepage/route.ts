import { NextResponse } from "next/server";
import { getDocuments, orderBy, limit } from "@/lib/firestore";
import type { DocumentData } from "firebase/firestore";

function serialize(docs: DocumentData[]) {
  return JSON.parse(JSON.stringify(docs));
}

export async function GET() {
  try {
    const [slider, resmiGazete, personelIlanlari, videolar] = await Promise.all([
      getDocuments("slider", [orderBy("order", "asc"), limit(10)]),
      getDocuments("resmiGazete", [orderBy("createdAt", "desc"), limit(5)]),
      getDocuments("personelIlanlari", [orderBy("createdAt", "desc"), limit(10)]),
      getDocuments("videolar", [orderBy("order", "asc"), limit(12)]),
    ]);

    return NextResponse.json(
      {
        slider: serialize(slider),
        resmiGazete: serialize(resmiGazete),
        personelIlanlari: serialize(personelIlanlari),
        videolar: serialize(videolar),
      },
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
