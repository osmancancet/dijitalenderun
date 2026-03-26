import { NextResponse } from "next/server";
import { getDocument } from "@/lib/firestore-admin";

export async function GET() {
  const profile = await getDocument("siteSettings", "drOzanYetkin");
  return NextResponse.json(
    { profile },
    { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
  );
}
