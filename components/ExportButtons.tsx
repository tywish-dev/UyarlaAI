"use client";

import { useState } from "react";
import { FileText, FileType, Loader2 } from "lucide-react";
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

  const btnClass =
    "flex items-center gap-2 rounded-lg border border-subtle bg-surface px-3.5 py-2 text-sm font-medium text-ink transition-colors hover:bg-base focus-visible:ring-2 focus-visible:ring-action/40 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleExport("pdf")}
          disabled={loading !== null}
          className={btnClass}
        >
          {loading === "pdf" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <FileText className="h-4 w-4" aria-hidden="true" />
          )}
          PDF indir
        </button>

        <button
          type="button"
          onClick={() => handleExport("word")}
          disabled={loading !== null}
          className={btnClass}
        >
          {loading === "word" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <FileType className="h-4 w-4" aria-hidden="true" />
          )}
          Word indir
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
