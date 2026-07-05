"use client";

import type { RubricCriterion } from "@/types";

interface RubricPreviewProps {
  criteria: RubricCriterion[];
}

const LEVEL_LABELS: Record<number, string> = {
  1: "Başlangıç",
  2: "Gelişmekte",
  3: "Yeterli",
};

export default function RubricPreview({ criteria }: RubricPreviewProps) {
  if (criteria.length === 0) return null;

  return (
    <div className="animate-soft-fade-in mt-4 overflow-hidden rounded-xl border border-subtle">
      <div className="border-b border-subtle bg-base px-3.5 py-2">
        <span className="eyebrow">Değerlendirme Rubriği</span>
      </div>
      <div className="divide-y divide-subtle">
        {criteria.map((criterion, cIndex) => (
          <div key={cIndex} className="p-3.5">
            <p className="text-sm font-medium text-ink">{criterion.criterion}</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {criterion.levels
                .slice()
                .sort((a, b) => a.score - b.score)
                .map((level) => (
                  <div
                    key={level.score}
                    className="rounded-lg bg-base p-2.5 text-xs text-ink-secondary"
                  >
                    <span className="mb-1 block font-mono text-[0.65rem] font-medium uppercase tracking-wide text-ink-secondary">
                      {LEVEL_LABELS[level.score] ?? `Seviye ${level.score}`}
                    </span>
                    <span className="text-ink">{level.description}</span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
