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
    <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
      <div className="border-b border-slate-200 bg-slate-50 px-3 py-2">
        <h5 className="text-xs font-semibold uppercase tracking-wide text-slate-700">
          Değerlendirme Rubriği
        </h5>
      </div>
      <div className="divide-y divide-slate-100">
        {criteria.map((criterion, cIndex) => (
          <div key={cIndex} className="p-3">
            <p className="text-sm font-medium text-slate-800">{criterion.criterion}</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {criterion.levels
                .slice()
                .sort((a, b) => a.score - b.score)
                .map((level) => (
                  <div
                    key={level.score}
                    className="rounded-md bg-slate-50 p-2 text-xs text-slate-600"
                  >
                    <span className="block font-semibold text-slate-700">
                      {LEVEL_LABELS[level.score] ?? `Seviye ${level.score}`}
                    </span>
                    {level.description}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
