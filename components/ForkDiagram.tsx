import { DIMENSION_META } from "@/lib/dimensions";

export default function ForkDiagram() {
  return (
    <div
      className="flex flex-col items-center"
      role="img"
      aria-label="Tek girdi üç farklılaştırılmış göreve ayrışıyor"
    >
      <svg
        width="100%"
        height="72"
        viewBox="0 0 300 72"
        preserveAspectRatio="none"
        className="max-w-md"
        aria-hidden="true"
      >
        {/* Gövde (trunk) */}
        <line
          x1="150"
          y1="0"
          x2="150"
          y2="30"
          stroke="var(--text-secondary)"
          strokeWidth="2"
          strokeLinecap="round"
          className="fork-trunk"
        />
        {/* İçerik dalı (sol) */}
        <path
          d="M150 30 C150 45, 40 45, 40 68"
          fill="none"
          stroke={DIMENSION_META.içerik.color}
          strokeWidth="2.5"
          strokeLinecap="round"
          className="fork-branch"
        />
        {/* Süreç dalı (orta) */}
        <line
          x1="150"
          y1="30"
          x2="150"
          y2="68"
          stroke={DIMENSION_META.süreç.color}
          strokeWidth="2.5"
          strokeLinecap="round"
          className="fork-branch"
        />
        {/* Ürün dalı (sağ) */}
        <path
          d="M150 30 C150 45, 260 45, 260 68"
          fill="none"
          stroke={DIMENSION_META.ürün.color}
          strokeWidth="2.5"
          strokeLinecap="round"
          className="fork-branch"
        />
      </svg>
      <p className="animate-soft-fade-in mt-1 font-mono text-xs text-ink-secondary">
        Görevler ayrıştırılıyor...
      </p>
    </div>
  );
}
