import { NextResponse } from "next/server";
import { runGroqCompletion } from "@/lib/groqClient";
import { buildLessonPackagePrompt } from "@/lib/promptTemplates";
import { parseJsonResponse } from "@/lib/parseJsonResponse";
import { mapGroqError } from "@/lib/apiErrors";
import { isValidLessonInput } from "@/lib/validation/lessonInput";
import {
  isValidLessonPackage,
  mergeLessonPackageMetadata,
} from "@/lib/validation/lessonPackage";
import type { GenerateLessonPackageResponse, LessonInput, LessonPackage } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 120;

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

  if (!isValidLessonInput(body)) {
    return NextResponse.json(
      { error: "Eksik veya geçersiz form bilgileri." },
      { status: 400 }
    );
  }

  const input = body as LessonInput;
  const fallbackMetadata: LessonPackage["metadata"] = {
    subject: input.subject,
    gradeLevel: input.gradeLevel,
    durationMinutes: input.durationMinutes,
    bloomLevel: input.bloomLevel,
    tymm: input.tymm,
  };

  try {
    const prompt = buildLessonPackagePrompt(input, extraContext);
    const raw = await runGroqCompletion(prompt);

    let parsed: LessonPackage;
    try {
      parsed = parseJsonResponse<LessonPackage>(raw);
    } catch {
      return NextResponse.json(
        { error: "Ders paketi üretilemedi, tekrar deneyin." },
        { status: 502 }
      );
    }

    parsed = mergeLessonPackageMetadata(parsed, fallbackMetadata);

    if (!isValidLessonPackage(parsed)) {
      return NextResponse.json(
        { error: "Ders paketi üretilemedi, tekrar deneyin." },
        { status: 502 }
      );
    }

    const response: GenerateLessonPackageResponse = { package: parsed };
    return NextResponse.json(response);
  } catch (error) {
    return mapGroqError(error);
  }
}
