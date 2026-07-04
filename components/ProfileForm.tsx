"use client";

import { useState, type FormEvent } from "react";
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
  general?: string;
}

interface ProfileFormProps {
  onSubmit: (input: TaskInput) => Promise<void>;
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

export default function ProfileForm({ onSubmit }: ProfileFormProps) {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      delete next.general;
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
    } catch {
      setErrors({
        general: "Görevler üretilirken bir hata oluştu. Lütfen tekrar deneyin.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `mt-1 w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
      hasError
        ? "border-red-300 bg-red-50"
        : "border-slate-300 bg-white hover:border-slate-400"
    }`;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      noValidate
    >
      <h3 className="text-lg font-semibold text-slate-900">Öğretim Bilgileri</h3>
      <p className="mt-1 text-sm text-slate-500">
        Kazanım ve öğrenci profilini girerek farklılaştırılmış görevler üretin.
      </p>

      {errors.general && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errors.general}
        </div>
      )}

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="learningObjective" className="block text-sm font-medium text-slate-700">
            Kazanım <span className="text-red-500">*</span>
          </label>
          <textarea
            id="learningObjective"
            rows={3}
            value={form.learningObjective}
            onChange={(e) => updateField("learningObjective", e.target.value)}
            placeholder="Örn: Algoritma ve akış diyagramları ile problem çözme becerisi kazanır."
            className={inputClass(!!errors.learningObjective)}
            disabled={isSubmitting}
          />
          {errors.learningObjective && (
            <p className="mt-1 text-xs text-red-600">{errors.learningObjective}</p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700">
              Ders / Konu Adı <span className="text-red-500">*</span>
            </label>
            <input
              id="subject"
              type="text"
              value={form.subject}
              onChange={(e) => updateField("subject", e.target.value)}
              placeholder="Örn: Algoritma ve Programlama"
              className={inputClass(!!errors.subject)}
              disabled={isSubmitting}
            />
            {errors.subject && (
              <p className="mt-1 text-xs text-red-600">{errors.subject}</p>
            )}
          </div>

          <div>
            <label htmlFor="gradeLevel" className="block text-sm font-medium text-slate-700">
              Sınıf Düzeyi <span className="text-red-500">*</span>
            </label>
            <select
              id="gradeLevel"
              value={form.gradeLevel}
              onChange={(e) => updateField("gradeLevel", e.target.value)}
              className={inputClass(!!errors.gradeLevel)}
              disabled={isSubmitting}
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

      <fieldset className="mt-8" disabled={isSubmitting}>
        <legend className="text-lg font-semibold text-slate-900">Öğrenci Profili</legend>
        <p className="mt-1 text-sm text-slate-500">
          Görevlerin uyarlanacağı öğrenci özelliklerini belirtin.
        </p>

        <div className="mt-5 space-y-5">
          <div>
            <span className="block text-sm font-medium text-slate-700">
              Hazırbulunuşluk Düzeyi
            </span>
            <div className="mt-2 flex flex-wrap gap-3">
              {READINESS_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors ${
                    form.readinessLevel === option.value
                      ? "border-primary-500 bg-primary-50 text-primary-800"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
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
            <label htmlFor="interestArea" className="block text-sm font-medium text-slate-700">
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
            <span className="block text-sm font-medium text-slate-700">Öğrenme Hızı</span>
            <div className="mt-2 flex flex-wrap gap-3">
              {PACE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors ${
                    form.learningPace === option.value
                      ? "border-accent-600 bg-accent-50 text-accent-700"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
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
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <span
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden="true"
              />
              Görevler hazırlanıyor...
            </>
          ) : (
            "Görevleri Üret"
          )}
        </button>
      </div>
    </form>
  );
}
