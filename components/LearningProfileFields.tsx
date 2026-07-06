"use client";

import type { LearningProfile } from "@/types";
import {
  ENVIRONMENT_OPTIONS,
  EXPRESSION_OPTIONS,
  MODALITY_OPTIONS,
} from "@/lib/constants/learningProfile";

interface LearningProfileFieldsProps {
  values: LearningProfile;
  onChange: (values: LearningProfile) => void;
  errors?: { modalities?: string };
  disabled?: boolean;
}

export default function LearningProfileFields({
  values,
  onChange,
  errors = {},
  disabled,
}: LearningProfileFieldsProps) {
  const toggleModality = (modality: LearningProfile["modalities"][number]) => {
    const next = values.modalities.includes(modality)
      ? values.modalities.filter((m) => m !== modality)
      : [...values.modalities, modality];
    onChange({ ...values, modalities: next });
  };

  const pillClass = (selected: boolean) =>
    `flex cursor-pointer items-center rounded-lg border px-4 py-2 text-sm transition-colors ${
      selected
        ? "border-action bg-action text-white"
        : "border-subtle bg-surface text-ink-secondary hover:border-ink-secondary/40"
    }`;

  return (
    <div>
      <span className="block text-sm font-medium text-ink">Öğrenme Profili</span>
      <p className="mt-1 text-xs text-ink-secondary">
        Tomlinson&apos;ın öğrenme profili boyutu: modalite, ortam ve ifade
        tercihleri.
      </p>

      <div className="mt-3 space-y-4">
        <div>
          <span className="block text-xs font-medium text-ink-secondary">
            Öğrenme Modaliteleri <span className="text-red-500">*</span>
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {MODALITY_OPTIONS.map((option) => (
              <label key={option.value} className={pillClass(values.modalities.includes(option.value))}>
                <input
                  type="checkbox"
                  checked={values.modalities.includes(option.value)}
                  onChange={() => toggleModality(option.value)}
                  className="sr-only"
                  disabled={disabled}
                />
                {option.label}
              </label>
            ))}
          </div>
          {errors.modalities && (
            <p className="mt-1 text-xs text-red-600">{errors.modalities}</p>
          )}
        </div>

        <div>
          <span className="block text-xs font-medium text-ink-secondary">
            Öğrenme Ortamı
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {ENVIRONMENT_OPTIONS.map((option) => (
              <label key={option.value} className={pillClass(values.environment === option.value)}>
                <input
                  type="radio"
                  name="learningEnvironment"
                  value={option.value}
                  checked={values.environment === option.value}
                  onChange={() => onChange({ ...values, environment: option.value })}
                  className="sr-only"
                  disabled={disabled}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <span className="block text-xs font-medium text-ink-secondary">
            İfade / Ürün Tercihi
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {EXPRESSION_OPTIONS.map((option) => (
              <label key={option.value} className={pillClass(values.expression === option.value)}>
                <input
                  type="radio"
                  name="learningExpression"
                  value={option.value}
                  checked={values.expression === option.value}
                  onChange={() => onChange({ ...values, expression: option.value })}
                  className="sr-only"
                  disabled={disabled}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
