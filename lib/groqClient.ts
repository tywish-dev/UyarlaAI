// Faz 3'te groq-sdk entegrasyonu eklenecek
export function getGroqClient(): never {
  throw new Error("Groq istemcisi henüz yapılandırılmadı");
}

export function getGroqModel(): string {
  const model = process.env.GROQ_MODEL;
  if (!model) {
    throw new Error("GROQ_MODEL ayarlanmamış");
  }
  return model;
}
