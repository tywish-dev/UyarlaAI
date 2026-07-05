import { NextResponse } from "next/server";
import { runGroqCompletion } from "@/lib/groqClient";
import { buildRubricPrompt } from "@/lib/promptTemplates";
import { parseJsonResponse } from "@/lib/parseJsonResponse";
import { mapGroqError } from "@/lib/apiErrors";
import type { RubricResponse, TaskInput } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

interface RubricRequestBody {
  task: { dimension: string; title: string; description: string };
  taskInput: TaskInput;
}

function isValidBody(body: unknown): body is RubricRequestBody {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  const task = b.task as Record<string, unknown> | undefined;
  const input = b.taskInput as Record<string, unknown> | undefined;
  return (
    typeof task === "object" &&
    task !== null &&
    typeof task.title === "string" &&
    typeof task.description === "string" &&
    typeof task.dimension === "string" &&
    typeof input === "object" &&
    input !== null &&
    typeof input.learningObjective === "string"
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  if (!isValidBody(body)) {
    return NextResponse.json(
      { error: "Eksik veya geçersiz görev bilgileri." },
      { status: 400 }
    );
  }

  try {
    const prompt = buildRubricPrompt(body.task, body.taskInput);
    const raw = await runGroqCompletion(prompt);

    let parsed: RubricResponse;
    try {
      parsed = parseJsonResponse<RubricResponse>(raw);
    } catch {
      return NextResponse.json(
        { error: "Rubrik üretilemedi, tekrar deneyin." },
        { status: 502 }
      );
    }

    if (!parsed?.criteria || !Array.isArray(parsed.criteria) || parsed.criteria.length === 0) {
      return NextResponse.json(
        { error: "Rubrik üretilemedi, tekrar deneyin." },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    return mapGroqError(error);
  }
}
