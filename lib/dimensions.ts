import type { DifferentiatedTask } from "@/types";

export interface DimensionMeta {
  label: string;
  color: string;
  colorClass: string;
  bgTintClass: string;
  textClass: string;
}

export const DIMENSION_META: Record<
  DifferentiatedTask["dimension"],
  DimensionMeta
> = {
  içerik: {
    label: "İçerik",
    color: "var(--accent-content)",
    colorClass: "bg-content",
    bgTintClass: "bg-content/10",
    textClass: "text-content",
  },
  süreç: {
    label: "Süreç",
    color: "var(--accent-process)",
    colorClass: "bg-process",
    bgTintClass: "bg-process/10",
    textClass: "text-process",
  },
  ürün: {
    label: "Ürün",
    color: "var(--accent-product)",
    colorClass: "bg-product",
    bgTintClass: "bg-product/10",
    textClass: "text-product",
  },
};

export const DIMENSION_ORDER: DifferentiatedTask["dimension"][] = [
  "içerik",
  "süreç",
  "ürün",
];

export function getDimensionMeta(
  dimension: DifferentiatedTask["dimension"]
): DimensionMeta {
  return DIMENSION_META[dimension] ?? DIMENSION_META.içerik;
}
