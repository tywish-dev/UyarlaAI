import { NextResponse } from "next/server";
import { runGroqCompletion } from "@/lib/groqClient";
import { buildGeneratePrompt } from "@/lib/promptTemplates";
import { parseJsonResponse } from "@/lib/parseJsonResponse";
import { mapGroqError } from "@/lib/apiErrors";
import { isValidTaskInput } from "@/lib/validation/lessonInput";
import type { GenerateTasksResponse } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Geçersiz istek gövdesi." },
      { status: 400 }
    );
  }

  const extraContext =
    typeof body === "object" && body !== null && "extraContext" in body
      ? String((body as Record<string, unknown>).extraContext ?? "")
      : undefined;

  if (!isValidTaskInput(body)) {
    return NextResponse.json(
      { error: "Eksik veya geçersiz form bilgileri." },
      { status: 400 }
    );
  }

  try {
    const prompt = buildGeneratePrompt(body, extraContext);
    const raw = await runGroqCompletion(prompt);

    let parsed: GenerateTasksResponse;
    try {
      parsed = parseJsonResponse<GenerateTasksResponse>(raw);
    } catch {
      return NextResponse.json(
        { error: "Üretim başarısız oldu, tekrar deneyin." },
        { status: 502 }
      );
    }

    if (!parsed?.tasks || !Array.isArray(parsed.tasks) || parsed.tasks.length === 0) {
      return NextResponse.json(
        { error: "Üretim başarısız oldu, tekrar deneyin." },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    return mapGroqError(error);
  }
}
