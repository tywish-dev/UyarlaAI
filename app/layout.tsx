import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "UyarlaAI — Farklılaştırılmış BT Görevleri",
  description:
    "Bilişim Teknolojileri öğretmenleri için yapay zeka destekli farklılaştırılmış görev üretim aracı",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 antialiased`}>
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-slate-200 bg-white shadow-sm">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-lg font-bold text-white">
                  U
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">UyarlaAI</h1>
                  <p className="text-xs text-slate-500">
                    Farklılaştırılmış BT Görev Üretici
                  </p>
                </div>
              </div>
              <span className="hidden rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 sm:inline-block">
                Tomlinson Çerçevesi
              </span>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-slate-200 bg-white py-4">
            <div className="mx-auto max-w-6xl px-4 text-center text-xs text-slate-500 sm:px-6">
              BÖTE — Bilgisayar Eğitiminde Öğretim Yöntemleri 1 · Groq AI ile güçlendirilmiştir
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
