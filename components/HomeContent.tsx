"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import ProfileForm from "@/components/ProfileForm";
import PromptLibrary from "@/components/PromptLibrary";
import TaskResultCard from "@/components/TaskResultCard";
import ExportButtons from "@/components/ExportButtons";
import TaskSkeleton from "@/components/TaskSkeleton";
import ForkDiagram from "@/components/ForkDiagram";
import { DIMENSION_META } from "@/lib/dimensions";
import type {
  AdaptTaskResponse,
  DifferentiatedTask,
  GenerateTasksResponse,
  RubricResponse,
  TaskInput,
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

export default function HomeContent() {
  const [taskInput, setTaskInput] = useState<TaskInput | null>(null);
  const [extraContext, setExtraContext] = useState("");
  const [taskStates, setTaskStates] = useState<TaskState[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if ((isGenerating || taskStates.length > 0) && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isGenerating, taskStates.length]);

  const updateTaskState = (index: number, patch: Partial<TaskState>) => {
    setTaskStates((prev) =>
      prev.map((state, i) => (i === index ? { ...state, ...patch } : state))
    );
  };

  const handleSubmit = async (input: TaskInput) => {
    setErrorMessage(null);
    setTaskStates([]);
    setTaskInput(input);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, extraContext }),
      });

      if (!response.ok) {
        const message = await readError(
          response,
          "Görevler üretilirken bir hata oluştu. Lütfen tekrar deneyin."
        );
        setErrorMessage(message);
        return;
      }

      const data = (await response.json()) as GenerateTasksResponse;
      setTaskStates(
        data.tasks.map((task) => ({
          task: { ...task, difficultyLevel: 3 },
          rubric: [],
          isReadapting: false,
          isRubricLoading: false,
          error: null,
        }))
      );
    } catch {
      setErrorMessage(
        "Görevler üretilirken bir hata oluştu. Lütfen tekrar deneyin."
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
    if (!taskInput) return;
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
          taskInput,
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
    if (!taskInput) return;
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
          taskInput,
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
      <section className="mb-10 grid gap-3 sm:grid-cols-3">
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
          ]
        ).map(({ key, desc }) => {
          const meta = DIMENSION_META[key];
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
          <div className="grid gap-4 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <TaskSkeleton key={i} index={i} />
            ))}
          </div>
        </section>
      )}

      {!isGenerating && taskStates.length > 0 && (
        <section className="mt-10">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="eyebrow">Sonuç</span>
              <h3 className="mt-1 font-display text-xl font-bold text-ink">
                Üretilen Görevler
              </h3>
              <p className="mt-1 text-sm text-ink-secondary">
                Zorluk seviyesini ayarlayıp yeniden uyarlayabilir veya rubrik
                önerisi alabilirsiniz.
              </p>
            </div>
            {taskInput && (
              <ExportButtons
                data={{
                  taskInput,
                  tasks: taskStates.map((s) => s.task),
                  rubrics: taskStates.map((s) => s.rubric),
                }}
              />
            )}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {taskStates.map((state, index) => (
              <div
                key={`${state.task.dimension}-${index}`}
                className="animate-card-enter"
                style={{ animationDelay: `${index * 90}ms` } as CSSProperties}
              >
                <TaskResultCard
                  task={state.task}
                  onDifficultyChange={(value) =>
                    handleDifficultyChange(index, value)
                  }
                  onReadapt={() => handleReadapt(index)}
                  isReadapting={state.isReadapting}
                  rubric={state.rubric}
                  onGenerateRubric={() => handleGenerateRubric(index)}
                  isRubricLoading={state.isRubricLoading}
                  errorMessage={state.error}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
