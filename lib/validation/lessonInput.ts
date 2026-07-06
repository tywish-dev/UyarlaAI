import type { LessonInput, TaskInput } from "@/types";

const READINESS_LEVELS = ["düşük", "orta", "yüksek"] as const;
const MODALITIES = ["görsel", "işitsel", "kinestetik", "sözel"] as const;
const ENVIRONMENTS = ["bireysel", "küçük_grup", "tüm_sınıf"] as const;
const EXPRESSIONS = ["sözlü", "yazılı", "görsel", "dijital"] as const;
const BLOOM_LEVELS = [
  "hatırlama",
  "anlama",
  "uygulama",
  "analiz",
  "değerlendirme",
  "oluşturma",
] as const;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidLearningProfile(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;
  const profile = value as Record<string, unknown>;
  return (
    Array.isArray(profile.modalities) &&
    profile.modalities.length > 0 &&
    profile.modalities.every((m) =>
      MODALITIES.includes(m as (typeof MODALITIES)[number])
    ) &&
    typeof profile.environment === "string" &&
    ENVIRONMENTS.includes(profile.environment as (typeof ENVIRONMENTS)[number]) &&
    typeof profile.expression === "string" &&
    EXPRESSIONS.includes(profile.expression as (typeof EXPRESSIONS)[number])
  );
}

function isValidStudentProfile(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;
  const profile = value as Record<string, unknown>;
  const hasLearningProfile = isValidLearningProfile(profile.learningProfile);
  const hasLegacyPace =
    profile.learningPace === undefined ||
    profile.learningPace === "yavaş" ||
    profile.learningPace === "normal" ||
    profile.learningPace === "hızlı";

  return (
    typeof profile.readinessLevel === "string" &&
    READINESS_LEVELS.includes(
      profile.readinessLevel as (typeof READINESS_LEVELS)[number]
    ) &&
    isNonEmptyString(profile.interestArea) &&
    hasLearningProfile &&
    hasLegacyPace
  );
}

export function isValidTaskInput(body: unknown): body is TaskInput {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    isNonEmptyString(b.learningObjective) &&
    isNonEmptyString(b.subject) &&
    isNonEmptyString(b.gradeLevel) &&
    isValidStudentProfile(b.studentProfile)
  );
}

export function isValidLessonInput(body: unknown): body is LessonInput {
  if (!isValidTaskInput(body)) return false;
  const b = body as unknown as Record<string, unknown>;
  const tymm = b.tymm as Record<string, unknown> | undefined;

  return (
    typeof b.durationMinutes === "number" &&
    b.durationMinutes >= 10 &&
    b.durationMinutes <= 180 &&
    typeof b.bloomLevel === "string" &&
    BLOOM_LEVELS.includes(b.bloomLevel as (typeof BLOOM_LEVELS)[number]) &&
    typeof tymm === "object" &&
    tymm !== null &&
    isNonEmptyString(tymm.learningOutcome) &&
    isNonEmptyString(tymm.skill) &&
    isNonEmptyString(tymm.value) &&
    isNonEmptyString(tymm.disposition)
  );
}

export function formatStudentProfileForPrompt(input: TaskInput): string {
  const { studentProfile } = input;
  const { learningProfile } = studentProfile;
  const modalities = learningProfile.modalities.join(", ");

  let text = `- Hazırbulunuşluk düzeyi: ${studentProfile.readinessLevel}
- İlgi alanı: ${studentProfile.interestArea}
- Öğrenme profili — modaliteler: ${modalities}
- Öğrenme profili — ortam: ${learningProfile.environment}
- Öğrenme profili — ifade tercihi: ${learningProfile.expression}`;

  if (studentProfile.learningPace) {
    text += `\n- Öğrenme hızı: ${studentProfile.learningPace}`;
  }

  return text;
}

export function formatTymmForPrompt(tymm: LessonInput["tymm"]): string {
  return `- Öğrenme çıktısı: ${tymm.learningOutcome}
- Beceri: ${tymm.skill}
- Değer: ${tymm.value}
- Eğilim: ${tymm.disposition}`;
}
