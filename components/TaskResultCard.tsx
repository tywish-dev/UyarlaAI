"use client";

import { Loader2, ListChecks } from "lucide-react";
import type { DifferentiatedTask, RubricCriterion } from "@/types";
import DifficultySlider from "@/components/DifficultySlider";
import RubricPreview from "@/components/RubricPreview";
import { getDimensionMeta } from "@/lib/dimensions";

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
  const meta = getDimensionMeta(task.dimension);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-subtle bg-surface shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
      <div
        className="h-1 w-full"
        style={{ backgroundColor: meta.color }}
        aria-hidden="true"
      />
      <div className="flex flex-1 flex-col p-5">
        <span
          className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.08em]"
          style={{ color: meta.color }}
        >
          {meta.label}
        </span>

        <h3 className="mt-2 font-display text-lg font-bold leading-snug text-ink">
          {task.title}
        </h3>
        <p className="mt-2 flex-1 whitespace-pre-line text-sm leading-relaxed text-ink-secondary">
          {task.description}
        </p>

        {errorMessage && (
          <div
            role="alert"
            className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
          >
            {errorMessage}
          </div>
        )}

        <DifficultySlider
          value={task.difficultyLevel}
          onChange={onDifficultyChange}
          onReadapt={onReadapt}
          isLoading={isReadapting}
          accentColor={meta.color}
        />

        <button
          type="button"
          onClick={onGenerateRubric}
          disabled={isRubricLoading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-subtle bg-surface px-3 py-2 text-xs font-semibold text-ink transition-colors hover:bg-base focus-visible:ring-2 focus-visible:ring-action/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRubricLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              Rubrik hazırlanıyor...
            </>
          ) : (
            <>
              <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
              {rubric.length > 0 ? "Rubriği Yenile" : "Rubrik Öner"}
            </>
          )}
        </button>

        <RubricPreview criteria={rubric} />
      </div>
    </article>
  );
}
