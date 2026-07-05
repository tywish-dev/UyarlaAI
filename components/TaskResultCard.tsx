"use client";

import type { DifferentiatedTask } from "@/types";

interface TaskResultCardProps {
  task: DifferentiatedTask;
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

export default function TaskResultCard({ task }: TaskResultCardProps) {
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
      </div>
    </article>
  );
}
