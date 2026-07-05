"use client";

import { useState } from "react";
import { PROMPT_TEMPLATES } from "@/lib/promptTemplates";

interface PromptLibraryProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function PromptLibrary({
  value,
  onChange,
  disabled,
}: PromptLibraryProps) {
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
    <div className="rounded-2xl border border-subtle bg-surface p-6 shadow-card sm:p-8">
      <span className="eyebrow">Prompt Kütüphanesi</span>
      <p className="mt-1.5 text-sm text-ink-secondary">
        Hazır bir şablon seç veya kendi talimatını yaz. Bu talimat üretim
        promptuna ek bağlam olarak eklenir. (İsteğe bağlı)
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {PROMPT_TEMPLATES.map((template) => {
          const active = selectedId === template.id;
          return (
            <button
              key={template.id}
              type="button"
              disabled={disabled}
              aria-pressed={active}
              onClick={() => handleSelect(template.id, template.content)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-action/40 disabled:cursor-not-allowed disabled:opacity-60 ${
                active
                  ? "border-action bg-action text-white"
                  : "border-subtle bg-surface text-ink-secondary hover:border-ink-secondary/40 hover:text-ink"
              }`}
            >
              {template.label}
            </button>
          );
        })}
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
        className="mt-4 w-full resize-y rounded-lg border border-subtle bg-surface px-3.5 py-2.5 text-sm text-ink transition-colors placeholder:text-ink-secondary/60 hover:border-ink-secondary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-action/40 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}
