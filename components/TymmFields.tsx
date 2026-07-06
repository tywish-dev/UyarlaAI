"use client";

import type { TymmAlignment } from "@/types";

interface TymmFieldsProps {
  values: TymmAlignment;
  onChange: (values: TymmAlignment) => void;
  errors?: Partial<Record<keyof TymmAlignment, string>>;
  disabled?: boolean;
  inputClass: (hasError: boolean) => string;
}

const TYMM_FIELDS: {
  key: keyof TymmAlignment;
  label: string;
  placeholder: string;
}[] = [
  {
    key: "learningOutcome",
    label: "Öğrenme Çıktısı",
    placeholder:
      "Örn: Algoritmik düşünme becerisiyle problem çözme sürecini açıklar.",
  },
  {
    key: "skill",
    label: "Beceri",
    placeholder: "Örn: Dijital okuryazarlık, analitik düşünme, problem çözme",
  },
  {
    key: "value",
    label: "Değer",
    placeholder: "Örn: Sorumluluk, adalet, saygı, bilimsel düşünme",
  },
  {
    key: "disposition",
    label: "Eğilim",
    placeholder: "Örn: Merak, iş birliği, yaratıcılık, dayanıklılık",
  },
];

export default function TymmFields({
  values,
  onChange,
  errors = {},
  disabled,
  inputClass,
}: TymmFieldsProps) {
  const updateField = (key: keyof TymmAlignment, value: string) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <fieldset disabled={disabled}>
      <legend className="eyebrow">Türkiye Yüzyılı Maarif Modeli (TYMM)</legend>
      <p className="mt-1.5 max-w-xl text-sm text-ink-secondary">
        Ders materyallerinin hangi öğrenme çıktısı, beceri, değer ve eğilimle
        uyumlu olacağını belirtin.
      </p>

      <div className="mt-4 space-y-4">
        {TYMM_FIELDS.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label htmlFor={`tymm-${key}`} className="block text-sm font-medium text-ink">
              {label} <span className="text-red-500">*</span>
            </label>
            <textarea
              id={`tymm-${key}`}
              rows={2}
              value={values[key]}
              onChange={(e) => updateField(key, e.target.value)}
              placeholder={placeholder}
              className={`${inputClass(!!errors[key])} resize-y`}
            />
            {errors[key] && (
              <p className="mt-1 text-xs text-red-600">{errors[key]}</p>
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
}
