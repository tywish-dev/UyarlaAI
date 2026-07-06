import type { BloomLevel } from "@/types";

export interface BloomOption {
  value: BloomLevel;
  label: string;
  description: string;
}

export const BLOOM_OPTIONS: BloomOption[] = [
  {
    value: "hatırlama",
    label: "Hatırlama",
    description: "Bilgiyi tanıma, listeleme, tanımlama",
  },
  {
    value: "anlama",
    label: "Anlama",
    description: "Açıklama, özetleme, yorumlama",
  },
  {
    value: "uygulama",
    label: "Uygulama",
    description: "Bilgiyi yeni durumlarda kullanma",
  },
  {
    value: "analiz",
    label: "Analiz",
    description: "Parçalara ayırma, ilişki kurma, karşılaştırma",
  },
  {
    value: "değerlendirme",
    label: "Değerlendirme",
    description: "Yargılama, eleştirme, gerekçelendirme",
  },
  {
    value: "oluşturma",
    label: "Oluşturma",
    description: "Yeni ürün, fikir veya süreç tasarlama",
  },
];

export const BLOOM_LABELS: Record<BloomLevel, string> = Object.fromEntries(
  BLOOM_OPTIONS.map((o) => [o.value, o.label])
) as Record<BloomLevel, string>;

export const DURATION_OPTIONS = [20, 30, 40, 45, 90] as const;
