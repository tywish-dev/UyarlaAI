import Groq from "groq-sdk";

const DEFAULT_GROQ_MODEL = "llama-3.1-8b-instant";

export function getGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GROQ_API_KEY ayarlanmamış");
  }
  return new Groq({ apiKey });
}

export function getGroqModel(): string {
  const model = process.env.GROQ_MODEL?.trim();
  return model || DEFAULT_GROQ_MODEL;
}

export async function runGroqCompletion(prompt: string): Promise<string> {
  const groq = getGroqClient();
  const model = getGroqModel();

  const completion = await groq.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  return completion.choices[0]?.message?.content ?? "";
}
