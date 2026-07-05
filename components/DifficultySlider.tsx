"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Loader2, RefreshCw } from "lucide-react";

interface DifficultySliderProps {
  value: number;
  onChange: (value: number) => void;
  onReadapt: () => void;
  isLoading: boolean;
  disabled?: boolean;
  accentColor?: string;
}

const LEVEL_LABELS: Record<number, string> = {
  1: "Çok destekli",
  2: "Destekli",
  3: "Dengeli",
  4: "Bağımsız",
  5: "İleri düzey",
};

export default function DifficultySlider({
  value,
  onChange,
  onReadapt,
  isLoading,
  disabled,
  accentColor = "var(--accent-action)",
}: DifficultySliderProps) {
  const [popKey, setPopKey] = useState(0);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setPopKey((k) => k + 1);
  }, [value]);

  return (
    <div className="mt-4 border-t border-subtle pt-4">
      <div className="flex items-center justify-between">
        <span className="eyebrow">Zorluk Seviyesi</span>
        <span
          key={popKey}
          className="animate-value-pop inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-ink"
        >
          <span
            className="text-sm font-bold"
            style={{ color: accentColor }}
          >
            {value}
          </span>
          <span className="text-ink-secondary">· {LEVEL_LABELS[value]}</span>
        </span>
      </div>

      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        disabled={disabled || isLoading}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Zorluk seviyesi"
        className="difficulty-range mt-3 w-full"
        style={{ "--thumb-color": accentColor } as CSSProperties}
      />

      <button
        type="button"
        onClick={onReadapt}
        disabled={disabled || isLoading}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-subtle bg-surface px-3 py-2 text-xs font-semibold text-ink transition-colors hover:bg-base focus-visible:ring-2 focus-visible:ring-action/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            Uyarlanıyor...
          </>
        ) : (
          <>
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            Yeniden Uyarla
          </>
        )}
      </button>
    </div>
  );
}
