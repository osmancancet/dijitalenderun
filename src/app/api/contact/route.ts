import { NextResponse } from "next/server";
import { addDocument } from "@/lib/firestore-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Tüm alanlar zorunludur." }, { status: 400 });
    }

    await addDocument("contactMessages", {
      name,
      email,
      subject,
      message,
      isRead: false,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}
