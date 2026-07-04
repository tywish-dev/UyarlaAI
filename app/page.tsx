import ProfileForm from "@/components/ProfileForm";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="mb-10 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Farklılaştırılmış Görev Üretin
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Kazanım ve öğrenci profilini girerek Tomlinson&apos;ın üç boyutuna göre
          (içerik, süreç, ürün) yapay zeka destekli görevler oluşturun.
        </p>
      </section>

      <section className="mb-12 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">
            İçerik
          </span>
          <p className="mt-1 text-sm text-blue-900">
            Konunun sunum şekli öğrenciye göre uyarlanır
          </p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Süreç
          </span>
          <p className="mt-1 text-sm text-emerald-900">
            Öğrenme etkinliğinin türü farklılaştırılır
          </p>
        </div>
        <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">
            Ürün
          </span>
          <p className="mt-1 text-sm text-teal-900">
            Öğrencinin ortaya koyacağı çıktı türü çeşitlenir
          </p>
        </div>
      </section>

      <ProfileForm />
    </div>
  );
}
