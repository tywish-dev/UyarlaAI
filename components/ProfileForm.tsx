"use client";

import { useState, type FormEvent } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import TymmFields from "@/components/TymmFields";
import LearningProfileFields from "@/components/LearningProfileFields";
import { BLOOM_OPTIONS, DURATION_OPTIONS } from "@/lib/constants/bloom";
import type { BloomLevel, LessonInput, TymmAlignment } from "@/types";
import { DEFAULT_LEARNING_PROFILE, DEFAULT_TYMM } from "@/types";

const GRADE_LEVELS = ["9. sınıf", "10. sınıf", "11. sınıf", "12. sınıf"] as const;

const READINESS_OPTIONS = [
  { value: "düşük" as const, label: "Düşük" },
  { value: "orta" as const, label: "Orta" },
  { value: "yüksek" as const, label: "Yüksek" },
];

interface FormErrors {
  learningObjective?: string;
  subject?: string;
  gradeLevel?: string;
  interestArea?: string;
  modalities?: string;
  learningOutcome?: string;
  skill?: string;
  value?: string;
  disposition?: string;
}

interface ProfileFormProps {
  onSubmit: (input: LessonInput) => Promise<void>;
  isGenerating?: boolean;
}

const initialFormState = {
  learningObjective: "",
  subject: "",
  gradeLevel: "",
  durationMinutes: 40,
  bloomLevel: "uygulama" as BloomLevel,
  readinessLevel: "orta" as const,
  interestArea: "",
  learningProfile: DEFAULT_LEARNING_PROFILE,
  tymm: DEFAULT_TYMM,
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
  if (values.learningProfile.modalities.length === 0) {
    errors.modalities = "En az bir öğrenme modalitesi seçilmelidir.";
  }
  if (!values.tymm.learningOutcome.trim()) {
    errors.learningOutcome = "Öğrenme çıktısı zorunludur.";
  }
  if (!values.tymm.skill.trim()) {
    errors.skill = "Beceri alanı zorunludur.";
  }
  if (!values.tymm.value.trim()) {
    errors.value = "Değer alanı zorunludur.";
  }
  if (!values.tymm.disposition.trim()) {
    errors.disposition = "Eğilim alanı zorunludur.";
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
      if (key === "tymm") {
        delete next.learningOutcome;
        delete next.skill;
        delete next.value;
        delete next.disposition;
      }
      if (key === "learningProfile") {
        delete next.modalities;
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

    const lessonInput: LessonInput = {
      learningObjective: form.learningObjective.trim(),
      subject: form.subject.trim(),
      gradeLevel: form.gradeLevel,
      durationMinutes: form.durationMinutes,
      bloomLevel: form.bloomLevel,
      tymm: {
        learningOutcome: form.tymm.learningOutcome.trim(),
        skill: form.tymm.skill.trim(),
        value: form.tymm.value.trim(),
        disposition: form.tymm.disposition.trim(),
      },
      studentProfile: {
        readinessLevel: form.readinessLevel,
        interestArea: form.interestArea.trim(),
        learningProfile: form.learningProfile,
      },
    };

    try {
      await onSubmit(lessonInput);
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

  const pillClass = (selected: boolean) =>
    `flex cursor-pointer items-center rounded-lg border px-4 py-2 text-sm transition-colors ${
      selected
        ? "border-action bg-action text-white"
        : "border-subtle bg-surface text-ink-secondary hover:border-ink-secondary/40"
    }`;

  const tymmErrors: Partial<Record<keyof TymmAlignment, string>> = {
    learningOutcome: errors.learningOutcome,
    skill: errors.skill,
    value: errors.value,
    disposition: errors.disposition,
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-subtle bg-surface p-6 shadow-card sm:p-8"
      noValidate
    >
      <span className="eyebrow">Ders Bilgileri</span>
      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
        Ders Paketi Hazırla
      </h2>
      <p className="mt-1.5 max-w-xl text-sm text-ink-secondary">
        Kazanım, TYMM uyumu ve öğrenci profilini girin; tek pakette ders akışı,
        yönerge, görevler, çalışma kağıdı, sunum, rubrik ve ölçme soruları
        oluşturulsun.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="learningObjective" className="block text-sm font-medium text-ink">
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
            <label htmlFor="gradeLevel" className="block text-sm font-medium text-ink">
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

        <div>
          <span className="block text-sm font-medium text-ink">Ders Süresi</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {DURATION_OPTIONS.map((minutes) => (
              <label key={minutes} className={pillClass(form.durationMinutes === minutes)}>
                <input
                  type="radio"
                  name="durationMinutes"
                  value={minutes}
                  checked={form.durationMinutes === minutes}
                  onChange={() => updateField("durationMinutes", minutes)}
                  className="sr-only"
                  disabled={busy}
                />
                {minutes} dk
              </label>
            ))}
          </div>
        </div>

        <div>
          <span className="block text-sm font-medium text-ink">Bloom Düzeyi</span>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {BLOOM_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                  form.bloomLevel === option.value
                    ? "border-action bg-action/5 ring-1 ring-action"
                    : "border-subtle bg-surface hover:border-ink-secondary/40"
                }`}
              >
                <input
                  type="radio"
                  name="bloomLevel"
                  value={option.value}
                  checked={form.bloomLevel === option.value}
                  onChange={() => updateField("bloomLevel", option.value)}
                  className="sr-only"
                  disabled={busy}
                />
                <span className="block text-sm font-semibold text-ink">{option.label}</span>
                <span className="mt-0.5 block text-xs text-ink-secondary">
                  {option.description}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <TymmFields
          values={form.tymm}
          onChange={(tymm) => updateField("tymm", tymm)}
          errors={tymmErrors}
          disabled={busy}
          inputClass={inputClass}
        />
      </div>

      <fieldset className="mt-8" disabled={busy}>
        <legend className="eyebrow">Tomlinson Öğrenci Profili</legend>
        <p className="mt-1.5 max-w-xl text-sm text-ink-secondary">
          Hazırbulunuşluk, ilgi alanı ve öğrenme profiline göre içerik, süreç ve
          ürün farklılaştırılır.
        </p>

        <div className="mt-4 space-y-5">
          <div>
            <span className="block text-sm font-medium text-ink">Hazırbulunuşluk Düzeyi</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {READINESS_OPTIONS.map((option) => (
                <label key={option.value} className={pillClass(form.readinessLevel === option.value)}>
                  <input
                    type="radio"
                    name="readinessLevel"
                    value={option.value}
                    checked={form.readinessLevel === option.value}
                    onChange={(e) =>
                      updateField(
                        "readinessLevel",
                        e.target.value as typeof form.readinessLevel
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
            <label htmlFor="interestArea" className="block text-sm font-medium text-ink">
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

          <LearningProfileFields
            values={form.learningProfile}
            onChange={(learningProfile) => updateField("learningProfile", learningProfile)}
            errors={{ modalities: errors.modalities }}
            disabled={busy}
          />
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
              Ders paketi hazırlanıyor...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Ders Paketini Üret
            </>
          )}
        </button>
      </div>
    </form>
  );
}
