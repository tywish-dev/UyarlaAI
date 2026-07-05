"use client";

interface DifficultySliderProps {
  value: number;
  onChange: (value: number) => void;
  onReadapt: () => void;
  isLoading: boolean;
  disabled?: boolean;
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
}: DifficultySliderProps) {
  return (
    <div className="mt-4 border-t border-slate-100 pt-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-slate-700">
          Zorluk Seviyesi
        </label>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
          {value} · {LEVEL_LABELS[value]}
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
        className="mt-2 w-full cursor-pointer accent-primary-600 disabled:cursor-not-allowed"
      />

      <button
        type="button"
        onClick={onReadapt}
        disabled={disabled || isLoading}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <span
              className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-primary-600 border-t-transparent"
              aria-hidden="true"
            />
            Uyarlanıyor...
          </>
        ) : (
          "Yeniden Uyarla"
        )}
      </button>
    </div>
  );
}
