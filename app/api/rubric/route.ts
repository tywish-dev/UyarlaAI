import { NextResponse } from "next/server";

// Faz 5'te rubrik üretimi eklenecek
export async function POST() {
  return NextResponse.json(
    { error: "API henüz yapılandırılmadı" },
    { status: 501 }
  );
}
