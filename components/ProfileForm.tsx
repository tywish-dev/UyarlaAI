"use client";

import { useState, type FormEvent } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import type { StudentProfile, TaskInput } from "@/types";

const GRADE_LEVELS = ["9. sınıf", "10. sınıf", "11. sınıf", "12. sınıf"] as const;

const READINESS_OPTIONS: { value: StudentProfile["readinessLevel"]; label: string }[] = [
  { value: "düşük", label: "Düşük" },
  { value: "orta", label: "Orta" },
  { value: "yüksek", label: "Yüksek" },
];

const PACE_OPTIONS: { value: StudentProfile["learningPace"]; label: string }[] = [
  { value: "yavaş", label: "Yavaş" },
  { value: "normal", label: "Normal" },
  { value: "hızlı", label: "Hızlı" },
];

interface FormErrors {
  learningObjective?: string;
  subject?: string;
  gradeLevel?: string;
  interestArea?: string;
}

interface ProfileFormProps {
  onSubmit: (input: TaskInput) => Promise<void>;
  isGenerating?: boolean;
}

const initialFormState = {
  learningObjective: "",
  subject: "",
  gradeLevel: "",
  readinessLevel: "orta" as StudentProfile["readinessLevel"],
  interestArea: "",
  learningPace: "normal" as StudentProfile["learningPace"],
};

function validateForm(values: typeof initialFormState): FormErrors {
  const errors: FormErrors = {};

  if (!values.learningObjective.trim()) {
    errors.learningObjective = "Kazanım alanı zorunludur.";
  }
  if (!values.subject.trim()) {
    errors.subject = "Ders/konu adı zorunludur.";
  }
  if (!values.gradeLevel) {
    errors.gradeLevel = "Sınıf düzeyi seçilmelidir.";
  }
  if (!values.interestArea.trim()) {
    errors.interestArea = "İlgi alanı zorunludur.";
  }

  return errors;
}

export default function ProfileForm({ onSubmit, isGenerating }: ProfileFormProps) {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const busy = isSubmitting || !!isGenerating;

  const updateField = <K extends keyof typeof initialFormState>(
    key: K,
    value: (typeof initialFormState)[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      if (key in next) {
        delete next[key as keyof FormErrors];
      }
      return next;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const taskInput: TaskInput = {
      learningObjective: form.learningObjective.trim(),
      subject: form.subject.trim(),
      gradeLevel: form.gradeLevel,
      studentProfile: {
        readinessLevel: form.readinessLevel,
        interestArea: form.interestArea.trim(),
        learningPace: form.learningPace,
      },
    };

    try {
      await onSubmit(taskInput);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `mt-1.5 w-full rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-ink transition-colors placeholder:text-ink-secondary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-action/40 ${
      hasError
        ? "border-red-300 bg-red-50/50"
        : "border-subtle hover:border-ink-secondary/40"
    }`;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-subtle bg-surface p-6 shadow-card sm:p-8"
      noValidate
    >
      <span className="eyebrow">Kazanım ve Profil</span>
      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
        Farklılaştırılmış Görev Üret
      </h2>
      <p className="mt-1.5 max-w-xl text-sm text-ink-secondary">
        Kazanım ve öğrenci profilini gir; Tomlinson&apos;ın üç boyutuna göre
        (içerik, süreç, ürün) yapay zeka destekli görevler oluşturulsun.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <label
            htmlFor="learningObjective"
            className="block text-sm font-medium text-ink"
          >
            Kazanım <span className="text-red-500">*</span>
          </label>
          <textarea
            id="learningObjective"
            rows={3}
            value={form.learningObjective}
            onChange={(e) => updateField("learningObjective", e.target.value)}
            placeholder="Örn: Algoritma ve akış diyagramları ile problem çözme becerisi kazanır."
            className={`${inputClass(!!errors.learningObjective)} resize-y`}
            disabled={busy}
          />
          {errors.learningObjective && (
            <p className="mt-1 text-xs text-red-600">{errors.learningObjective}</p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-ink">
              Ders / Konu Adı <span className="text-red-500">*</span>
            </label>
            <input
              id="subject"
              type="text"
              value={form.subject}
              onChange={(e) => updateField("subject", e.target.value)}
              placeholder="Örn: Algoritma ve Programlama"
              className={inputClass(!!errors.subject)}
              disabled={busy}
            />
            {errors.subject && (
              <p className="mt-1 text-xs text-red-600">{errors.subject}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="gradeLevel"
              className="block text-sm font-medium text-ink"
            >
              Sınıf Düzeyi <span className="text-red-500">*</span>
            </label>
            <select
              id="gradeLevel"
              value={form.gradeLevel}
              onChange={(e) => updateField("gradeLevel", e.target.value)}
              className={inputClass(!!errors.gradeLevel)}
              disabled={busy}
            >
              <option value="">Seçiniz...</option>
              {GRADE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            {errors.gradeLevel && (
              <p className="mt-1 text-xs text-red-600">{errors.gradeLevel}</p>
            )}
          </div>
        </div>
      </div>

      <fieldset className="mt-8" disabled={busy}>
        <legend className="eyebrow">Öğrenci Profili</legend>

        <div className="mt-4 space-y-5">
          <div>
            <span className="block text-sm font-medium text-ink">
              Hazırbulunuşluk Düzeyi
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {READINESS_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center rounded-lg border px-4 py-2 text-sm transition-colors ${
                    form.readinessLevel === option.value
                      ? "border-action bg-action text-white"
                      : "border-subtle bg-surface text-ink-secondary hover:border-ink-secondary/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="readinessLevel"
                    value={option.value}
                    checked={form.readinessLevel === option.value}
                    onChange={(e) =>
                      updateField(
                        "readinessLevel",
                        e.target.value as StudentProfile["readinessLevel"]
                      )
                    }
                    className="sr-only"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="interestArea"
              className="block text-sm font-medium text-ink"
            >
              İlgi Alanı <span className="text-red-500">*</span>
            </label>
            <input
              id="interestArea"
              type="text"
              value={form.interestArea}
              onChange={(e) => updateField("interestArea", e.target.value)}
              placeholder="Örn: oyun geliştirme, robotik, grafik tasarım"
              className={inputClass(!!errors.interestArea)}
            />
            {errors.interestArea && (
              <p className="mt-1 text-xs text-red-600">{errors.interestArea}</p>
            )}
          </div>

          <div>
            <span className="block text-sm font-medium text-ink">Öğrenme Hızı</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {PACE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center rounded-lg border px-4 py-2 text-sm transition-colors ${
                    form.learningPace === option.value
                      ? "border-action bg-action text-white"
                      : "border-subtle bg-surface text-ink-secondary hover:border-ink-secondary/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="learningPace"
                    value={option.value}
                    checked={form.learningPace === option.value}
                    onChange={(e) =>
                      updateField(
                        "learningPace",
                        e.target.value as StudentProfile["learningPace"]
                      )
                    }
                    className="sr-only"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </fieldset>

      <div className="mt-8">
        <button
          type="submit"
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-action px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 focus-visible:ring-2 focus-visible:ring-action/40 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Görevler hazırlanıyor...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Görevleri Üret
            </>
          )}
        </button>
      </div>
    </form>
  );
}
