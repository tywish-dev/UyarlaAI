import type {
  LearningEnvironment,
  LearningExpression,
  LearningModality,
} from "@/types";

export const MODALITY_OPTIONS: { value: LearningModality; label: string }[] = [
  { value: "görsel", label: "Görsel" },
  { value: "işitsel", label: "İşitsel" },
  { value: "kinestetik", label: "Kinestetik" },
  { value: "sözel", label: "Sözel" },
];

export const ENVIRONMENT_OPTIONS: {
  value: LearningEnvironment;
  label: string;
}[] = [
  { value: "bireysel", label: "Bireysel" },
  { value: "küçük_grup", label: "Küçük Grup" },
  { value: "tüm_sınıf", label: "Tüm Sınıf" },
];

export const EXPRESSION_OPTIONS: {
  value: LearningExpression;
  label: string;
}[] = [
  { value: "sözlü", label: "Sözlü" },
  { value: "yazılı", label: "Yazılı" },
  { value: "görsel", label: "Görsel" },
  { value: "dijital", label: "Dijital" },
];

export const MODALITY_LABELS: Record<LearningModality, string> = Object.fromEntries(
  MODALITY_OPTIONS.map((o) => [o.value, o.label])
) as Record<LearningModality, string>;

export const ENVIRONMENT_LABELS: Record<LearningEnvironment, string> =
  Object.fromEntries(
    ENVIRONMENT_OPTIONS.map((o) => [o.value, o.label])
  ) as Record<LearningEnvironment, string>;

export const EXPRESSION_LABELS: Record<LearningExpression, string> =
  Object.fromEntries(
    EXPRESSION_OPTIONS.map((o) => [o.value, o.label])
  ) as Record<LearningExpression, string>;
