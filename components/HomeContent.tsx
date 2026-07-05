"use client";

import { useState } from "react";
import ProfileForm from "@/components/ProfileForm";
import PromptLibrary from "@/components/PromptLibrary";
import TaskResultCard from "@/components/TaskResultCard";
import ExportButtons from "@/components/ExportButtons";
import type {
  AdaptTaskResponse,
  DifferentiatedTask,
  GenerateTasksResponse,
  RubricCriterion,
  RubricResponse,
  TaskInput,
} from "@/types";

interface TaskState {
  task: DifferentiatedTask;
  rubric: RubricCriterion[];
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

  const updateTaskState = (index: number, patch: Partial<TaskState>) => {
    setTaskStates((prev) =>
      prev.map((state, i) => (i === index ? { ...state, ...patch } : state))
    );
  };

  const handleSubmit = async (input: TaskInput) => {
    setErrorMessage(null);
    setTaskStates([]);
    setTaskInput(input);

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
      throw new Error(message);
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
  };

  const handleDifficultyChange = (index: number, value: number) => {
    setTaskStates((prev) =>
      prev.map((state, i) =>
        i === index ? { ...state, task: { ...state.task, difficultyLevel: value } } : state
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
        const message = await readError(response, "Görev yeniden uyarlanamadı, tekrar deneyin.");
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
        const message = await readError(response, "Rubrik üretilemedi, tekrar deneyin.");
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
      <section className="mb-10 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Farklılaştırılmış Görev Üretin
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Kazanım ve öğrenci profilini girerek Tomlinson&apos;ın üç boyutuna göre
          (içerik, süreç, ürün) yapay zeka destekli görevler oluşturun.
        </p>
      </section>

      <section className="mb-12 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">
            İçerik
          </span>
          <p className="mt-1 text-sm text-blue-900">
            Konunun sunum şekli öğrenciye göre uyarlanır
          </p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Süreç
          </span>
          <p className="mt-1 text-sm text-emerald-900">
            Öğrenme etkinliğinin türü farklılaştırılır
          </p>
        </div>
        <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">
            Ürün
          </span>
          <p className="mt-1 text-sm text-teal-900">
            Öğrencinin ortaya koyacağı çıktı türü çeşitlenir
          </p>
        </div>
      </section>

      <div className="space-y-6">
        <PromptLibrary value={extraContext} onChange={setExtraContext} />
        <ProfileForm onSubmit={handleSubmit} />
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {taskStates.length > 0 && (
        <section className="mt-10">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="mb-1 text-xl font-bold text-slate-900">Üretilen Görevler</h3>
              <p className="text-sm text-slate-500">
                Zorluk seviyesini ayarlayıp yeniden uyarlayabilir veya rubrik önerisi
                alabilirsiniz.
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
              <TaskResultCard
                key={`${state.task.dimension}-${index}`}
                task={state.task}
                onDifficultyChange={(value) => handleDifficultyChange(index, value)}
                onReadapt={() => handleReadapt(index)}
                isReadapting={state.isReadapting}
                rubric={state.rubric}
                onGenerateRubric={() => handleGenerateRubric(index)}
                isRubricLoading={state.isRubricLoading}
                errorMessage={state.error}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
