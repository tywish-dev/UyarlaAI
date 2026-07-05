"use client";

import { useState } from "react";
import { exportToPdf, exportToWord, type ExportData } from "@/lib/exportUtils";

interface ExportButtonsProps {
  data: ExportData;
}

export default function ExportButtons({ data }: ExportButtonsProps) {
  const [loading, setLoading] = useState<"pdf" | "word" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async (type: "pdf" | "word") => {
    setError(null);
    setLoading(type);
    try {
      if (type === "pdf") {
        await exportToPdf(data);
      } else {
        await exportToWord(data);
      }
    } catch {
      setError("Dışa aktarma başarısız oldu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => handleExport("pdf")}
          disabled={loading !== null}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading === "pdf" ? (
            <>
              <span
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden="true"
              />
              PDF hazırlanıyor...
            </>
          ) : (
            "PDF olarak indir"
          )}
        </button>

        <button
          type="button"
          onClick={() => handleExport("word")}
          disabled={loading !== null}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading === "word" ? (
            <>
              <span
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden="true"
              />
              Word hazırlanıyor...
            </>
          ) : (
            "Word olarak indir"
          )}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
