# UyarlaAI

Bilişim Teknolojileri (BT) öğretmenleri için yapay zeka destekli **ders hazırlama** aracı.

Tomlinson'ın farklılaştırılmış öğretim çerçevesindeki dört boyutu (İçerik, Süreç, Ürün, Ortam) temel alır; TYMM uyumu, Bloom düzeyi ve öğrenci profiline göre tek pakette ders materyali üretir.

## Özellikler

- **Ders süresi** seçimi (20–90 dk)
- **Bloom taksonomisi** düzeyi (Hatırlama → Oluşturma)
- **TYMM uyumu**: öğrenme çıktısı, beceri, değer, eğilim
- **Tomlinson profili**: hazırbulunuşluk, ilgi alanı, öğrenme profili (modalite, ortam, ifade)
- **Tek paket çıktı**:
  - Ders akışı
  - Öğretmen yönergesi
  - Farklılaştırılmış görevler (içerik / süreç / ürün)
  - Öğrenci çalışma kağıdı
  - Sunum önerisi
  - Değerlendirme rubriği
  - Ölçme soruları
- PDF ve Word dışa aktarma

## Teknoloji Yığını

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS**
- **Groq API** (ücretsiz Llama modelleri)

## Kurulum

```bash
npm install
cp .env.local.example .env.local
# .env.local dosyasına Groq API anahtarınızı ekleyin
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## Ortam Değişkenleri

| Değişken | Açıklama |
|----------|----------|
| `GROQ_API_KEY` | Groq API anahtarınız |
| `GROQ_MODEL` | Kullanılacak model (önerilen: `llama-3.3-70b-versatile`; varsayılan: `llama-3.1-8b-instant`) |

Ders paketi üretimi daha büyük JSON çıktısı gerektirdiğinden `llama-3.3-70b-versatile` modeli önerilir.

## API

| Endpoint | Açıklama |
|----------|----------|
| `POST /api/generate-lesson-package` | Tam ders paketi üretir |
| `POST /api/generate` | Yalnızca 3 farklılaştırılmış görev (geriye uyumluluk) |
| `POST /api/adapt` | Görev zorluk uyarlaması |
| `POST /api/rubric` | Görev bazlı rubrik |

## Deployment

Vercel ücretsiz tier üzerinde deploy edilebilir. Ortam değişkenlerini Vercel dashboard'dan ayarlayın.
