"use client";

import type { DifferentiatedTask } from "@/types";

interface TaskResultCardProps {
  task: DifferentiatedTask;
}

// Faz 4'te implementasyon eklenecek
export default function TaskResultCard({ task }: TaskResultCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <span className="text-xs font-medium uppercase">{task.dimension}</span>
      <h3 className="mt-1 font-semibold">{task.title}</h3>
    </div>
  );
}
