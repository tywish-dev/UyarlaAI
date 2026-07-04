import type { DifferentiatedTask, RubricCriterion, TaskInput } from "@/types";

export function buildExportFilename(subject: string, extension: "pdf" | "docx"): string {
  const safeSubject = subject
    .replace(/[^\w\sğüşıöçĞÜŞİÖÇ-]/gi, "")
    .replace(/\s+/g, "_")
    .slice(0, 40);
  const date = new Date().toISOString().slice(0, 10);
  return `UyarlaAI_${safeSubject || "gorev"}_${date}.${extension}`;
}

export interface ExportData {
  taskInput: TaskInput;
  tasks: DifferentiatedTask[];
  rubric: RubricCriterion[] | null;
}

// Faz 6'da PDF ve Word export implementasyonu eklenecek
export async function exportToPdf(_data: ExportData): Promise<void> {
  void _data;
  throw new Error("PDF dışa aktarma henüz hazır değil");
}

export async function exportToWord(_data: ExportData): Promise<void> {
  void _data;
  throw new Error("Word dışa aktarma henüz hazır değil");
}
