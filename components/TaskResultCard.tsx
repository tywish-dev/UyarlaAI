"use client";

import type { DifferentiatedTask, RubricCriterion } from "@/types";
import DifficultySlider from "@/components/DifficultySlider";
import RubricPreview from "@/components/RubricPreview";

interface TaskResultCardProps {
  task: DifferentiatedTask;
  onDifficultyChange: (value: number) => void;
  onReadapt: () => void;
  isReadapting: boolean;
  rubric: RubricCriterion[];
  onGenerateRubric: () => void;
  isRubricLoading: boolean;
  errorMessage?: string | null;
}

const DIMENSION_STYLES: Record<
  DifferentiatedTask["dimension"],
  { badge: string; border: string; accent: string; label: string; icon: string }
> = {
  içerik: {
    badge: "bg-blue-100 text-blue-800",
    border: "border-blue-200",
    accent: "bg-blue-500",
    label: "İçerik",
    icon: "📘",
  },
  süreç: {
    badge: "bg-emerald-100 text-emerald-800",
    border: "border-emerald-200",
    accent: "bg-emerald-500",
    label: "Süreç",
    icon: "⚙️",
  },
  ürün: {
    badge: "bg-teal-100 text-teal-800",
    border: "border-teal-200",
    accent: "bg-teal-500",
    label: "Ürün",
    icon: "🎯",
  },
};

export default function TaskResultCard({
  task,
  onDifficultyChange,
  onReadapt,
  isReadapting,
  rubric,
  onGenerateRubric,
  isRubricLoading,
  errorMessage,
}: TaskResultCardProps) {
  const style = DIMENSION_STYLES[task.dimension] ?? DIMENSION_STYLES.içerik;

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-xl border ${style.border} bg-white shadow-sm transition-shadow hover:shadow-md`}
    >
      <div className={`h-1.5 w-full ${style.accent}`} aria-hidden="true" />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${style.badge}`}
          >
            <span aria-hidden="true">{style.icon}</span>
            {style.label}
          </span>
        </div>

        <h4 className="text-base font-semibold text-slate-900">{task.title}</h4>
        <p className="mt-2 flex-1 whitespace-pre-line text-sm leading-relaxed text-slate-600">
          {task.description}
        </p>

        {errorMessage && (
          <div
            role="alert"
            className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
          >
            {errorMessage}
          </div>
        )}

        <DifficultySlider
          value={task.difficultyLevel}
          onChange={onDifficultyChange}
          onReadapt={onReadapt}
          isLoading={isReadapting}
        />

        <button
          type="button"
          onClick={onGenerateRubric}
          disabled={isRubricLoading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRubricLoading ? (
            <>
              <span
                className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-500 border-t-transparent"
                aria-hidden="true"
              />
              Rubrik hazırlanıyor...
            </>
          ) : rubric.length > 0 ? (
            "Rubriği Yenile"
          ) : (
            "Rubrik Öner"
          )}
        </button>

        <RubricPreview criteria={rubric} />
      </div>
    </article>
  );
}
