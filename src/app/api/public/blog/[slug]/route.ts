import { NextResponse, type NextRequest } from "next/server";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const ref = collection(db(), "blog");
  const q = query(ref, where("slug", "==", slug));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return NextResponse.json({ post: null }, { status: 404 });
  }

  const doc = snapshot.docs[0];
  const post = JSON.parse(JSON.stringify({ id: doc.id, ...doc.data() }));

  return NextResponse.json(
    { post },
    { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
  );
}
