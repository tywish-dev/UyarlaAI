import { NextResponse } from "next/server";

export interface ApiErrorBody {
  error: string;
}

export function mapGroqError(error: unknown): NextResponse<ApiErrorBody> {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("GROQ_API_KEY") || message.includes("GROQ_MODEL")) {
    return NextResponse.json(
      {
        error:
          "API anahtarı ayarlanmamış, lütfen .env.local dosyasını kontrol edin.",
      },
      { status: 500 }
    );
  }

  const status =
    typeof error === "object" && error !== null && "status" in error
      ? (error as { status?: number }).status
      : undefined;

  if (status === 401 || message.includes("401") || message.includes("Invalid API Key")) {
    return NextResponse.json(
      {
        error:
          "API anahtarı geçersiz. Lütfen .env.local dosyasındaki GROQ_API_KEY değerini kontrol edin.",
      },
      { status: 401 }
    );
  }

  if (status === 429 || message.includes("429") || message.toLowerCase().includes("rate limit")) {
    return NextResponse.json(
      {
        error: "Çok fazla istek gönderildi, birkaç saniye sonra tekrar deneyin.",
      },
      { status: 429 }
    );
  }

  return NextResponse.json(
    { error: "Üretim başarısız oldu, tekrar deneyin." },
    { status: 500 }
  );
}
