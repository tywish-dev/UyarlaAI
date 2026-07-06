import type { LessonPackage } from "@/types";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidRubric(value: unknown): boolean {
  if (!Array.isArray(value) || value.length === 0) return false;
  return value.every((item) => {
    if (typeof item !== "object" || item === null) return false;
    const criterion = item as Record<string, unknown>;
    return (
      isNonEmptyString(criterion.criterion) &&
      Array.isArray(criterion.levels) &&
      criterion.levels.length > 0
    );
  });
}

function isValidTasks(value: unknown): boolean {
  if (!Array.isArray(value) || value.length !== 3) return false;
  const dimensions = new Set<string>();
  return value.every((item) => {
    if (typeof item !== "object" || item === null) return false;
    const task = item as Record<string, unknown>;
    const valid =
      isNonEmptyString(task.dimension) &&
      isNonEmptyString(task.title) &&
      isNonEmptyString(task.description);
    if (valid) dimensions.add(String(task.dimension));
    return valid;
  });
}

export function isValidLessonPackage(value: unknown): value is LessonPackage {
  if (typeof value !== "object" || value === null) return false;
  const pkg = value as Record<string, unknown>;

  const metadata = pkg.metadata as Record<string, unknown> | undefined;
  const tymm = metadata?.tymm as Record<string, unknown> | undefined;

  return (
    typeof metadata === "object" &&
    metadata !== null &&
    isNonEmptyString(metadata.subject) &&
    isNonEmptyString(metadata.gradeLevel) &&
    typeof metadata.durationMinutes === "number" &&
    isNonEmptyString(metadata.bloomLevel) &&
    typeof tymm === "object" &&
    tymm !== null &&
    isNonEmptyString(tymm.learningOutcome) &&
    isNonEmptyString(tymm.skill) &&
    isNonEmptyString(tymm.value) &&
    isNonEmptyString(tymm.disposition) &&
    Array.isArray(pkg.lessonFlow) &&
    pkg.lessonFlow.length > 0 &&
    Array.isArray(pkg.teacherGuide) &&
    pkg.teacherGuide.length > 0 &&
    isValidTasks(pkg.tasks) &&
    Array.isArray(pkg.studentWorksheet) &&
    pkg.studentWorksheet.length > 0 &&
    Array.isArray(pkg.presentationOutline) &&
    pkg.presentationOutline.length > 0 &&
    isValidRubric(pkg.rubric) &&
    Array.isArray(pkg.assessmentQuestions) &&
    pkg.assessmentQuestions.length > 0
  );
}

export function mergeLessonPackageMetadata(
  parsed: LessonPackage,
  fallback: LessonPackage["metadata"]
): LessonPackage {
  return {
    ...parsed,
    metadata: {
      ...fallback,
      ...parsed.metadata,
      tymm: {
        ...fallback.tymm,
        ...parsed.metadata?.tymm,
      },
    },
  };
}
