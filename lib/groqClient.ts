import Groq from "groq-sdk";

export function getGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY ayarlanmamış");
  }
  return new Groq({ apiKey });
}

export function getGroqModel(): string {
  const model = process.env.GROQ_MODEL;
  if (!model) {
    throw new Error("GROQ_MODEL ayarlanmamış");
  }
  return model;
}

export async function runGroqCompletion(prompt: string): Promise<string> {
  const groq = getGroqClient();
  const model = getGroqModel();

  const completion = await groq.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  return completion.choices[0]?.message?.content ?? "";
}
