import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
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
    <html
      lang="tr"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-base font-sans text-ink antialiased">
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-20 border-b border-subtle bg-surface/80 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="flex h-8 items-center gap-[3px] rounded-md bg-action px-2"
                >
                  <span className="h-3 w-1 rounded-full bg-content" />
                  <span className="h-4 w-1 rounded-full bg-process" />
                  <span className="h-2.5 w-1 rounded-full bg-product" />
                </span>
                <span className="font-display text-lg font-bold tracking-tight text-ink">
                  UyarlaAI
                </span>
              </div>
              <span className="eyebrow hidden sm:inline">Tomlinson Çerçevesi</span>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-subtle bg-surface py-4">
            <div className="mx-auto max-w-5xl px-4 text-center text-xs text-ink-secondary sm:px-6">
              BÖTE — Bilgisayar Eğitiminde Öğretim Yöntemleri 1 · Groq AI ile
              güçlendirilmiştir
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
