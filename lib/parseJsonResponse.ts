export function extractJsonFromResponse(text: string): string {
  const trimmed = text.trim();

  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }

  const objectMatch = trimmed.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    return objectMatch[0];
  }

  return trimmed;
}

export function parseJsonResponse<T>(text: string): T {
  const jsonStr = extractJsonFromResponse(text);
  return JSON.parse(jsonStr) as T;
}
