"use client";

import { useState } from "react";
import { PROMPT_TEMPLATES } from "@/lib/promptTemplates";

interface PromptLibraryProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function PromptLibrary({ value, onChange, disabled }: PromptLibraryProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string, content: string) => {
    if (selectedId === id) {
      setSelectedId(null);
      onChange("");
    } else {
      setSelectedId(id);
      onChange(content);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h3 className="text-lg font-semibold text-slate-900">Prompt Kütüphanesi</h3>
      <p className="mt-1 text-sm text-slate-500">
        Hazır bir şablon seçip düzenleyebilir veya kendi talimatınızı yazabilirsiniz.
        Bu talimat üretim promptuna ek bağlam olarak eklenir. (İsteğe bağlı)
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {PROMPT_TEMPLATES.map((template) => (
          <button
            key={template.id}
            type="button"
            disabled={disabled}
            onClick={() => handleSelect(template.id, template.content)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              selectedId === template.id
                ? "border-primary-500 bg-primary-50 text-primary-800"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
            }`}
          >
            {template.label}
          </button>
        ))}
      </div>

      <textarea
        rows={3}
        value={value}
        disabled={disabled}
        onChange={(e) => {
          onChange(e.target.value);
          setSelectedId(null);
        }}
        placeholder="Örn: Görevleri görsel öğrenenler için uyarla, adım adım yönergeler ekle..."
        className="mt-4 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm transition-colors hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}
