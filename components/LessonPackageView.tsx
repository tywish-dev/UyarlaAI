"use client";

import { useState } from "react";
import {
  BookOpen,
  ClipboardList,
  FileText,
  Layers,
  ListChecks,
  Presentation,
  Sparkles,
} from "lucide-react";
import TaskResultCard from "@/components/TaskResultCard";
import RubricPreview from "@/components/RubricPreview";
import type { DifferentiatedTask, LessonPackage, RubricCriterion } from "@/types";
import { BLOOM_LABELS } from "@/lib/constants/bloom";

interface TaskState {
  task: DifferentiatedTask;
  rubric: RubricCriterion[];
  isReadapting: boolean;
  isRubricLoading: boolean;
  error: string | null;
}

interface LessonPackageViewProps {
  lessonPackage: LessonPackage;
  taskStates: TaskState[];
  onDifficultyChange: (index: number, value: number) => void;
  onReadapt: (index: number) => void;
  onGenerateRubric: (index: number) => void;
}

const TABS = [
  { id: "flow", label: "Ders Akışı", icon: BookOpen },
  { id: "guide", label: "Öğretmen Yönergesi", icon: ClipboardList },
  { id: "tasks", label: "Görevler", icon: Sparkles },
  { id: "worksheet", label: "Çalışma Kağıdı", icon: FileText },
  { id: "slides", label: "Sunum", icon: Presentation },
  { id: "rubric", label: "Rubrik", icon: ListChecks },
  { id: "assessment", label: "Ölçme", icon: Layers },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function LessonPackageView({
  lessonPackage,
  taskStates,
  onDifficultyChange,
  onReadapt,
  onGenerateRubric,
}: LessonPackageViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>("flow");
  const { metadata } = lessonPackage;

  return (
    <div>
      <div className="mb-5 rounded-xl border border-subtle bg-surface p-4 text-sm shadow-card">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="text-xs font-medium text-ink-secondary">Ders / Konu</span>
            <p className="font-medium text-ink">{metadata.subject}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-ink-secondary">Süre · Bloom</span>
            <p className="font-medium text-ink">
              {metadata.durationMinutes} dk · {BLOOM_LABELS[metadata.bloomLevel]}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium text-ink-secondary">TYMM Beceri</span>
            <p className="font-medium text-ink">{metadata.tymm.skill}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-ink-secondary">TYMM Değer</span>
            <p className="font-medium text-ink">{metadata.tymm.value}</p>
          </div>
        </div>
        <div className="mt-3 border-t border-subtle pt-3">
          <span className="text-xs font-medium text-ink-secondary">Öğrenme Çıktısı</span>
          <p className="mt-0.5 text-ink">{metadata.tymm.learningOutcome}</p>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Ders paketi bölümleri"
        className="flex gap-1 overflow-x-auto rounded-xl border border-subtle bg-base p-1"
      >
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            onClick={() => setActiveTab(id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:text-sm ${
              activeTab === id
                ? "bg-surface text-action shadow-sm"
                : "text-ink-secondary hover:text-ink"
            }`}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-subtle bg-surface p-5 shadow-card sm:p-6">
        {activeTab === "flow" && (
          <div className="space-y-3">
            <h4 className="font-display text-lg font-bold text-ink">Ders Akışı</h4>
            <div className="space-y-3">
              {lessonPackage.lessonFlow.map((phase, index) => (
                <div
                  key={`${phase.phase}-${index}`}
                  className="rounded-xl border border-subtle bg-base p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-ink">{phase.phase}</span>
                    <span className="rounded-full bg-action/10 px-2.5 py-0.5 text-xs font-medium text-action">
                      {phase.duration}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-ink-secondary">{phase.activity}</p>
                  <p className="mt-2 text-xs text-ink-secondary">
                    <span className="font-medium text-ink">Öğretmen:</span> {phase.teacherRole}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "guide" && (
          <div className="space-y-4">
            <h4 className="font-display text-lg font-bold text-ink">Öğretmen Yönergesi</h4>
            {lessonPackage.teacherGuide.map((section, index) => (
              <div key={`${section.section}-${index}`}>
                <h5 className="font-semibold text-ink">{section.section}</h5>
                <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-ink-secondary">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "tasks" && (
          <div>
            <h4 className="mb-4 font-display text-lg font-bold text-ink">
              Farklılaştırılmış Görevler
            </h4>
            <p className="mb-4 text-sm text-ink-secondary">
              Zorluk seviyesini ayarlayıp yeniden uyarlayabilir veya görev bazlı rubrik
              alabilirsiniz. Paket rubriği Rubrik sekmesindedir.
            </p>
            <div className="grid gap-4 lg:grid-cols-3">
              {taskStates.map((state, index) => (
                <TaskResultCard
                  key={`${state.task.dimension}-${index}`}
                  task={state.task}
                  onDifficultyChange={(value) => onDifficultyChange(index, value)}
                  onReadapt={() => onReadapt(index)}
                  isReadapting={state.isReadapting}
                  rubric={state.rubric}
                  onGenerateRubric={() => onGenerateRubric(index)}
                  isRubricLoading={state.isRubricLoading}
                  errorMessage={state.error}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "worksheet" && (
          <div className="space-y-5">
            <h4 className="font-display text-lg font-bold text-ink">Öğrenci Çalışma Kağıdı</h4>
            {lessonPackage.studentWorksheet.map((section, index) => (
              <div
                key={`${section.section}-${index}`}
                className="rounded-xl border border-subtle bg-base p-4"
              >
                <h5 className="font-semibold text-ink">{section.section}</h5>
                <p className="mt-2 text-sm text-ink-secondary">{section.instructions}</p>
                {section.questions.length > 0 && (
                  <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ink">
                    {section.questions.map((question, qIndex) => (
                      <li key={qIndex}>{question}</li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "slides" && (
          <div className="space-y-4">
            <h4 className="font-display text-lg font-bold text-ink">Sunum Önerisi</h4>
            {lessonPackage.presentationOutline.map((slide) => (
              <div
                key={slide.slideNumber}
                className="rounded-xl border border-subtle bg-base p-4"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-action text-xs font-bold text-white">
                    {slide.slideNumber}
                  </span>
                  <h5 className="font-semibold text-ink">{slide.title}</h5>
                </div>
                <p className="mt-2 text-sm text-ink-secondary">{slide.content}</p>
                {slide.notes && (
                  <p className="mt-2 rounded-lg bg-surface px-3 py-2 text-xs text-ink-secondary">
                    <span className="font-medium text-ink">Sunum notu:</span> {slide.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "rubric" && (
          <div>
            <h4 className="mb-4 font-display text-lg font-bold text-ink">
              Değerlendirme Rubriği
            </h4>
            <RubricPreview criteria={lessonPackage.rubric} />
          </div>
        )}

        {activeTab === "assessment" && (
          <div className="space-y-4">
            <h4 className="font-display text-lg font-bold text-ink">Ölçme Soruları</h4>
            {lessonPackage.assessmentQuestions.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-subtle bg-base p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-action">
                    {item.type.replace(/_/g, " ")}
                  </span>
                  <span className="text-xs text-ink-secondary">Soru {index + 1}</span>
                </div>
                <p className="mt-2 text-sm font-medium text-ink">{item.question}</p>
                {item.options && item.options.length > 0 && (
                  <ul className="mt-2 space-y-1 text-sm text-ink-secondary">
                    {item.options.map((option, oIndex) => (
                      <li key={oIndex}>{option}</li>
                    ))}
                  </ul>
                )}
                {item.answer && (
                  <p className="mt-2 text-xs text-ink-secondary">
                    <span className="font-medium text-ink">Örnek yanıt:</span> {item.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
