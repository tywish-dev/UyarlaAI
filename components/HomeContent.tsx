"use client";

import { useState } from "react";
import ProfileForm from "@/components/ProfileForm";
import type { DifferentiatedTask, GenerateTasksResponse, TaskInput } from "@/types";

export default function HomeContent() {
  const [tasks, setTasks] = useState<DifferentiatedTask[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (input: TaskInput) => {
    setErrorMessage(null);
    setTasks([]);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      const message =
        data?.error ?? "Görevler üretilirken bir hata oluştu. Lütfen tekrar deneyin.";
      setErrorMessage(message);
      throw new Error(message);
    }

    const data = (await response.json()) as GenerateTasksResponse;
    const withDifficulty: DifferentiatedTask[] = data.tasks.map((task) => ({
      ...task,
      difficultyLevel: 3,
    }));
    setTasks(withDifficulty);
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

      <ProfileForm onSubmit={handleSubmit} />

      {errorMessage && (
        <div
          role="alert"
          className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {tasks.length > 0 && (
        <section className="mt-10">
          <h3 className="mb-4 text-xl font-bold text-slate-900">Üretilen Görevler</h3>
          <div className="grid gap-4 lg:grid-cols-3">
            {tasks.map((task, index) => (
              <div
                key={`${task.dimension}-${index}`}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-primary-700">
                  {task.dimension}
                </span>
                <h4 className="mt-1 font-semibold text-slate-900">{task.title}</h4>
                <p className="mt-2 whitespace-pre-line text-sm text-slate-600">
                  {task.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
