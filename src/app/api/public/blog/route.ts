import { NextResponse } from "next/server";
import { getDocuments, orderBy } from "@/lib/firestore";
import type { DocumentData } from "firebase/firestore";

function serialize(docs: DocumentData[]) {
  return JSON.parse(JSON.stringify(docs));
}

export async function GET() {
  const posts = await getDocuments("blog", [orderBy("createdAt", "desc")]);
  return NextResponse.json(
    { posts: serialize(posts) },
    { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
  );
}
