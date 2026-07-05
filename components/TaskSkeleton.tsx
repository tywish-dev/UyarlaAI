import { DIMENSION_ORDER, getDimensionMeta } from "@/lib/dimensions";

export default function TaskSkeleton({ index = 0 }: { index?: number }) {
  const dimension = DIMENSION_ORDER[index] ?? DIMENSION_ORDER[0];
  const meta = getDimensionMeta(dimension);

  return (
    <div className="overflow-hidden rounded-2xl border border-subtle bg-surface shadow-card">
      <div
        className="h-1 w-full opacity-40"
        style={{ backgroundColor: meta.color }}
        aria-hidden="true"
      />
      <div className="animate-pulse p-5">
        <div className="h-3 w-16 rounded bg-subtle" />
        <div className="mt-3 h-5 w-3/4 rounded bg-subtle" />
        <div className="mt-4 space-y-2">
          <div className="h-3 w-full rounded bg-base" />
          <div className="h-3 w-full rounded bg-base" />
          <div className="h-3 w-5/6 rounded bg-base" />
          <div className="h-3 w-2/3 rounded bg-base" />
        </div>
        <div className="mt-6 border-t border-subtle pt-4">
          <div className="h-2 w-full rounded-full bg-base" />
          <div className="mt-3 h-8 w-full rounded-lg bg-base" />
        </div>
      </div>
    </div>
  );
}
