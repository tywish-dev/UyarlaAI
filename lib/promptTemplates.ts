import type { LessonInput, TaskInput } from "@/types";
import { BLOOM_LABELS } from "@/lib/constants/bloom";
import {
  formatStudentProfileForPrompt,
  formatTymmForPrompt,
} from "@/lib/validation/lessonInput";

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
  const { learningObjective, subject, gradeLevel } = input;

  let prompt = `Sen Türkiye'deki ${subject} dersi için farklılaştırılmış öğretim görevleri üreten bir eğitim asistanısın.

Tomlinson'ın farklılaştırılmış öğretim çerçevesine göre üç ayrı görev üret:
1. İÇERİK boyutu: Konunun sunum şekli farklılaştırılır
2. SÜREÇ boyutu: Öğrenme etkinliğinin türü farklılaştırılır
3. ÜRÜN boyutu: Öğrencinin ortaya koyacağı çıktı türü farklılaştırılır

Öğretim bilgileri:
- Kazanım: ${learningObjective}
- Ders/Konu: ${subject}
- Sınıf düzeyi: ${gradeLevel}

Öğrenci profili:
${formatStudentProfileForPrompt(input)}

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

export function buildLessonPackagePrompt(
  input: LessonInput,
  extraContext?: string
): string {
  const {
    learningObjective,
    subject,
    gradeLevel,
    durationMinutes,
    bloomLevel,
    tymm,
  } = input;

  const bloomLabel = BLOOM_LABELS[bloomLevel];

  let prompt = `Sen Türkiye'deki ${subject} dersi için kapsamlı ders paketi hazırlayan bir eğitim asistanısın.

Tomlinson'ın farklılaştırılmış öğretim modeline göre hazırbulunuşluk, ilgi alanı ve öğrenme profiline dayalı olarak İÇERİK, SÜREÇ, ÜRÜN ve ÖĞRENME ORTAMI boyutlarında farklılaştırma yap.

Öğretim bilgileri:
- Kazanım: ${learningObjective}
- Ders/Konu: ${subject}
- Sınıf düzeyi: ${gradeLevel}
- Ders süresi: ${durationMinutes} dakika
- Bloom düzeyi: ${bloomLabel} (${bloomLevel})

TYMM uyumu:
${formatTymmForPrompt(tymm)}

Öğrenci profili:
${formatStudentProfileForPrompt(input)}

Ders akışını ${durationMinutes} dakikaya göre dağıt (giriş ~%10, gelişme ~%60, uygulama ~%20, kapanış ~%10).
Bloom düzeyi (${bloomLabel}) etkinlikleri, soruları ve görevleri yönlendirsin.
TYMM öğrenme çıktısı, beceri, değer ve eğilim tüm bileşenlerde tutarlı şekilde yansıtılsın.

Aşağıdaki 7 bileşeni tek tutarlı ders paketi olarak üret:
1. DERS AKIŞI: Aşamalar, süreler, etkinlikler ve öğretmen rolü
2. ÖĞRETMEN YÖNERGESİ: Bölüm bölüm sınıf içi uygulama talimatları
3. FARKLILAŞTIRILMIŞ GÖREVLER: Tomlinson içerik/süreç/ürün boyutlarında 3 görev
4. ÖĞRENCİ ÇALIŞMA KAĞIDI: Bölümler, yönergeler ve sorular
5. SUNUM ÖNERİSİ: Slayt numarası, başlık, içerik ve sunum notları
6. RUBRİK: 3-4 kriter, her kriterde 3 seviye (başlangıç=1, gelişmekte=2, yeterli=3)
7. ÖLÇME SORULARI: 4-6 soru (çoktan_seçmeli, açık_uçlu, doğru_yanlış veya kısa_cevap)

Türkçe yaz.`;

  if (extraContext?.trim()) {
    prompt += `\n\nEk talimatlar:\n${extraContext.trim()}`;
  }

  prompt += `

SADECE aşağıdaki JSON formatında yanıt ver, başka hiçbir açıklama ekleme:
{
  "metadata": {
    "subject": "${subject}",
    "gradeLevel": "${gradeLevel}",
    "durationMinutes": ${durationMinutes},
    "bloomLevel": "${bloomLevel}",
    "tymm": {
      "learningOutcome": "...",
      "skill": "...",
      "value": "...",
      "disposition": "..."
    }
  },
  "lessonFlow": [
    { "phase": "Giriş", "duration": "5 dk", "activity": "...", "teacherRole": "..." }
  ],
  "teacherGuide": [
    { "section": "...", "content": "..." }
  ],
  "tasks": [
    { "dimension": "içerik", "title": "...", "description": "..." },
    { "dimension": "süreç", "title": "...", "description": "..." },
    { "dimension": "ürün", "title": "...", "description": "..." }
  ],
  "studentWorksheet": [
    { "section": "...", "instructions": "...", "questions": ["...", "..."] }
  ],
  "presentationOutline": [
    { "slideNumber": 1, "title": "...", "content": "...", "notes": "..." }
  ],
  "rubric": [
    {
      "criterion": "...",
      "levels": [
        { "score": 1, "description": "..." },
        { "score": 2, "description": "..." },
        { "score": 3, "description": "..." }
      ]
    }
  ],
  "assessmentQuestions": [
    { "type": "çoktan_seçmeli", "question": "...", "options": ["A", "B", "C", "D"], "answer": "A" },
    { "type": "açık_uçlu", "question": "...", "answer": "..." }
  ]
}`;

  return prompt;
}

export function buildAdaptDifficultyPrompt(
  task: { dimension: string; title: string; description: string },
  difficultyLevel: number,
  input: TaskInput
): string {
  return `Sen bir ${input.subject} öğretmeni asistanısın. Aşağıdaki farklılaştırılmış görevi zorluk seviyesi ${difficultyLevel}/5 olacak şekilde yeniden yaz.

Zorluk seviyesi 1 = çok fazla destek (scaffold), adım adım rehberlik
Zorluk seviyesi 5 = minimum destek, bağımsız çalışma beklenir

Mevcut görev:
- Boyut: ${task.dimension}
- Başlık: ${task.title}
- Açıklama: ${task.description}

Bağlam:
- Kazanım: ${input.learningObjective}
- Sınıf: ${input.gradeLevel}
${formatStudentProfileForPrompt(input)}

SADECE aşağıdaki JSON formatında yanıt ver:
{
  "task": { "dimension": "${task.dimension}", "title": "...", "description": "..." }
}`;
}

export function buildRubricPrompt(
  task: { title: string; description: string; dimension: string },
  input: TaskInput
): string {
  return `Sen bir ${input.subject} öğretmeni asistanısın. Aşağıdaki farklılaştırılmış görev için 3-4 kriterli bir değerlendirme rubriği oluştur.

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
