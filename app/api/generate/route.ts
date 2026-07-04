import { NextResponse } from "next/server";

// Faz 3'te Groq entegrasyonu eklenecek
export async function POST() {
  return NextResponse.json(
    { error: "API henüz yapılandırılmadı" },
    { status: 501 }
  );
}
