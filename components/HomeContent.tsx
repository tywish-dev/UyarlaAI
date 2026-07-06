"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import ProfileForm from "@/components/ProfileForm";
import PromptLibrary from "@/components/PromptLibrary";
import LessonPackageView from "@/components/LessonPackageView";
import ExportButtons from "@/components/ExportButtons";
import ForkDiagram from "@/components/ForkDiagram";
import { DIMENSION_META } from "@/lib/dimensions";
import type {
  AdaptTaskResponse,
  DifferentiatedTask,
  GenerateLessonPackageResponse,
  LessonInput,
  LessonPackage,
  RubricResponse,
} from "@/types";

interface TaskState {
  task: DifferentiatedTask;
  rubric: RubricResponse["criteria"];
  isReadapting: boolean;
  isRubricLoading: boolean;
  error: string | null;
}

async function readError(response: Response, fallback: string): Promise<string> {
  const data = (await response.json().catch(() => null)) as { error?: string } | null;
  return data?.error ?? fallback;
}

function buildTaskStatesFromPackage(pkg: LessonPackage): TaskState[] {
  return pkg.tasks.map((task) => ({
    task: { ...task, difficultyLevel: 3 },
    rubric: [],
    isReadapting: false,
    isRubricLoading: false,
    error: null,
  }));
}

export default function HomeContent() {
  const [lessonInput, setLessonInput] = useState<LessonInput | null>(null);
  const [lessonPackage, setLessonPackage] = useState<LessonPackage | null>(null);
  const [extraContext, setExtraContext] = useState("");
  const [taskStates, setTaskStates] = useState<TaskState[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if ((isGenerating || lessonPackage) && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isGenerating, lessonPackage]);

  const updateTaskState = (index: number, patch: Partial<TaskState>) => {
    setTaskStates((prev) =>
      prev.map((state, i) => (i === index ? { ...state, ...patch } : state))
    );
  };

  const handleSubmit = async (input: LessonInput) => {
    setErrorMessage(null);
    setLessonPackage(null);
    setTaskStates([]);
    setLessonInput(input);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-lesson-package", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, extraContext }),
      });

      if (!response.ok) {
        const message = await readError(
          response,
          "Ders paketi üretilirken bir hata oluştu. Lütfen tekrar deneyin."
        );
        setErrorMessage(message);
        return;
      }

      const data = (await response.json()) as GenerateLessonPackageResponse;
      setLessonPackage(data.package);
      setTaskStates(buildTaskStatesFromPackage(data.package));
    } catch {
      setErrorMessage(
        "Ders paketi üretilirken bir hata oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDifficultyChange = (index: number, value: number) => {
    setTaskStates((prev) =>
      prev.map((state, i) =>
        i === index
          ? { ...state, task: { ...state.task, difficultyLevel: value } }
          : state
      )
    );
  };

  const handleReadapt = async (index: number) => {
    if (!lessonInput) return;
    const current = taskStates[index];
    updateTaskState(index, { isReadapting: true, error: null });

    try {
      const response = await fetch("/api/adapt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: {
            dimension: current.task.dimension,
            title: current.task.title,
            description: current.task.description,
          },
          difficultyLevel: current.task.difficultyLevel,
          taskInput: lessonInput,
        }),
      });

      if (!response.ok) {
        const message = await readError(
          response,
          "Görev yeniden uyarlanamadı, tekrar deneyin."
        );
        updateTaskState(index, { isReadapting: false, error: message });
        return;
      }

      const data = (await response.json()) as AdaptTaskResponse;
      setTaskStates((prev) =>
        prev.map((state, i) =>
          i === index
            ? {
                ...state,
                task: {
                  ...state.task,
                  title: data.task.title,
                  description: data.task.description,
                },
                isReadapting: false,
                error: null,
              }
            : state
        )
      );
    } catch {
      updateTaskState(index, {
        isReadapting: false,
        error: "Görev yeniden uyarlanamadı, tekrar deneyin.",
      });
    }
  };

  const handleGenerateRubric = async (index: number) => {
    if (!lessonInput) return;
    const current = taskStates[index];
    updateTaskState(index, { isRubricLoading: true, error: null });

    try {
      const response = await fetch("/api/rubric", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: {
            dimension: current.task.dimension,
            title: current.task.title,
            description: current.task.description,
          },
          taskInput: lessonInput,
        }),
      });

      if (!response.ok) {
        const message = await readError(
          response,
          "Rubrik üretilemedi, tekrar deneyin."
        );
        updateTaskState(index, { isRubricLoading: false, error: message });
        return;
      }

      const data = (await response.json()) as RubricResponse;
      updateTaskState(index, {
        rubric: data.criteria,
        isRubricLoading: false,
        error: null,
      });
    } catch {
      updateTaskState(index, {
        isRubricLoading: false,
        error: "Rubrik üretilemedi, tekrar deneyin.",
      });
    }
  };

  return (
    <>
      <section className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(
          [
            {
              key: "içerik" as const,
              desc: "Konunun sunum şekli öğrenciye göre uyarlanır",
            },
            {
              key: "süreç" as const,
              desc: "Öğrenme etkinliğinin türü farklılaştırılır",
            },
            {
              key: "ürün" as const,
              desc: "Öğrencinin ortaya koyacağı çıktı türü çeşitlenir",
            },
            {
              key: "ortam" as const,
              desc: "Öğrenme ortamı ve grup düzeni profille uyumlu tasarlanır",
            },
          ]
        ).map(({ key, desc }) => {
          const meta =
            key === "ortam"
              ? {
                  label: "Ortam",
                  color: "#64748b",
                }
              : DIMENSION_META[key];
          return (
            <div
              key={key}
              className="rounded-xl border border-subtle bg-surface p-4 shadow-card"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: meta.color }}
                  aria-hidden="true"
                />
                <span
                  className="font-mono text-xs font-semibold uppercase tracking-[0.08em]"
                  style={{ color: meta.color }}
                >
                  {meta.label}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-ink-secondary">{desc}</p>
            </div>
          );
        })}
      </section>

      <div className="space-y-6">
        <PromptLibrary
          value={extraContext}
          onChange={setExtraContext}
          disabled={isGenerating}
        />
        <ProfileForm onSubmit={handleSubmit} isGenerating={isGenerating} />
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      <div ref={resultsRef} className="scroll-mt-6" />

      {isGenerating && (
        <section className="mt-10" aria-live="polite">
          <div className="mb-6">
            <ForkDiagram />
          </div>
          <div className="rounded-2xl border border-subtle bg-surface p-8 text-center shadow-card">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-action border-t-transparent" />
            <p className="font-display text-lg font-bold text-ink">
              Ders paketi hazırlanıyor...
            </p>
            <p className="mt-2 text-sm text-ink-secondary">
              Ders akışı, yönerge, görevler, çalışma kağıdı, sunum, rubrik ve
              ölçme soruları oluşturuluyor.
            </p>
          </div>
        </section>
      )}

      {!isGenerating && lessonPackage && lessonInput && (
        <section className="mt-10">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="eyebrow">Sonuç</span>
              <h3 className="mt-1 font-display text-xl font-bold text-ink">
                Ders Paketi
              </h3>
              <p className="mt-1 text-sm text-ink-secondary">
                Tüm materyaller tek pakette. Sekmeler arasında gezinin veya
                dışa aktarın.
              </p>
            </div>
            <ExportButtons
              data={{
                lessonInput,
                lessonPackage,
                tasks: taskStates.map((s) => s.task),
                taskRubrics: taskStates.map((s) => s.rubric),
              }}
            />
          </div>
          <div
            className="animate-card-enter"
            style={{ animationDelay: "90ms" } as CSSProperties}
          >
            <LessonPackageView
              lessonPackage={lessonPackage}
              taskStates={taskStates}
              onDifficultyChange={handleDifficultyChange}
              onReadapt={handleReadapt}
              onGenerateRubric={handleGenerateRubric}
            />
          </div>
        </section>
      )}
    </>
  );
}
