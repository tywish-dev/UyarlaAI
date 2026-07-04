import type { TaskInput } from "@/types";

export const PROMPT_TEMPLATES = [
  {
    id: "visual-learners",
    label: "Görsel öğrenenler için uyarla",
    content:
      "Görevleri görsel öğrenen öğrenciler için uyarla: diyagramlar, infografikler, renk kodlaması ve görsel düzenlemeler kullan.",
  },
  {
    id: "simplify-language",
    label: "Ana dili farklı öğrenciler için sadeleştir",
    content:
      "Dil kullanımını sadeleştir, kısa cümleler tercih et, teknik terimleri açıkla ve adım adım yönergeler ver.",
  },
  {
    id: "enrich-advanced",
    label: "İleri düzey öğrenciler için zenginleştir",
    content:
      "İleri düzey öğrenciler için görevleri zenginleştir: ek araştırma soruları, derinlemesine analiz ve yaratıcı uzantılar ekle.",
  },
  {
    id: "collaborative",
    label: "İşbirlikçi öğrenme odaklı",
    content:
      "Görevleri işbirlikçi öğrenmeyi destekleyecek şekilde tasarla: grup rolleri, eşleştirme etkinlikleri ve akran geri bildirimi fırsatları ekle.",
  },
  {
    id: "hands-on",
    label: "Uygulamalı ve proje tabanlı",
    content:
      "Görevleri uygulamalı ve proje tabanlı hale getir: gerçek dünya senaryoları, somut çıktılar ve pratik uygulama adımları içersin.",
  },
] as const;

export function buildGeneratePrompt(
  input: TaskInput,
  extraContext?: string
): string {
  const { learningObjective, subject, gradeLevel, studentProfile } = input;

  let prompt = `Sen Türkiye'deki Bilişim Teknolojileri (BT) dersi için farklılaştırılmış öğretim görevleri üreten bir eğitim asistanısın.

Tomlinson'ın farklılaştırılmış öğretim çerçevesine göre üç ayrı görev üret:
1. İÇERİK boyutu: Konunun sunum şekli farklılaştırılır
2. SÜREÇ boyutu: Öğrenme etkinliğinin türü farklılaştırılır
3. ÜRÜN boyutu: Öğrencinin ortaya koyacağı çıktı türü farklılaştırılır

Öğretim bilgileri:
- Kazanım: ${learningObjective}
- Ders/Konu: ${subject}
- Sınıf düzeyi: ${gradeLevel}

Öğrenci profili:
- Hazırbulunuşluk düzeyi: ${studentProfile.readinessLevel}
- İlgi alanı: ${studentProfile.interestArea}
- Öğrenme hızı: ${studentProfile.learningPace}

Her görev, öğrenci profiline göre uyarlanmış olmalı. Türkçe yaz.`;

  if (extraContext?.trim()) {
    prompt += `\n\nEk talimatlar:\n${extraContext.trim()}`;
  }

  prompt += `

SADECE aşağıdaki JSON formatında yanıt ver, başka hiçbir açıklama ekleme:
{
  "tasks": [
    { "dimension": "içerik", "title": "...", "description": "..." },
    { "dimension": "süreç", "title": "...", "description": "..." },
    { "dimension": "ürün", "title": "...", "description": "..." }
  ]
}`;

  return prompt;
}

export function buildAdaptDifficultyPrompt(
  task: { dimension: string; title: string; description: string },
  difficultyLevel: number,
  input: TaskInput
): string {
  return `Sen bir BT öğretmeni asistanısın. Aşağıdaki farklılaştırılmış görevi zorluk seviyesi ${difficultyLevel}/5 olacak şekilde yeniden yaz.

Zorluk seviyesi 1 = çok fazla destek (scaffold), adım adım rehberlik
Zorluk seviyesi 5 = minimum destek, bağımsız çalışma beklenir

Mevcut görev:
- Boyut: ${task.dimension}
- Başlık: ${task.title}
- Açıklama: ${task.description}

Bağlam:
- Kazanım: ${input.learningObjective}
- Sınıf: ${input.gradeLevel}
- Hazırbulunuşluk: ${input.studentProfile.readinessLevel}
- İlgi alanı: ${input.studentProfile.interestArea}

SADECE aşağıdaki JSON formatında yanıt ver:
{
  "task": { "dimension": "${task.dimension}", "title": "...", "description": "..." }
}`;
}

export function buildRubricPrompt(
  task: { title: string; description: string; dimension: string },
  input: TaskInput
): string {
  return `Sen bir BT öğretmeni asistanısın. Aşağıdaki farklılaştırılmış görev için 3-4 kriterli bir değerlendirme rubriği oluştur.

Görev:
- Boyut: ${task.dimension}
- Başlık: ${task.title}
- Açıklama: ${task.description}

Kazanım: ${input.learningObjective}
Sınıf: ${input.gradeLevel}

Her kriter için 3 seviye tanımla (başlangıç=1, gelişmekte=2, yeterli=3). Türkçe yaz.

SADECE aşağıdaki JSON formatında yanıt ver:
{
  "criteria": [
    {
      "criterion": "...",
      "levels": [
        { "score": 1, "description": "..." },
        { "score": 2, "description": "..." },
        { "score": 3, "description": "..." }
      ]
    }
  ]
}`;
}
