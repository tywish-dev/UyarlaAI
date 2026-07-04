# UyarlaAI

Bilişim Teknolojileri (BT) öğretmenleri için yapay zeka destekli farklılaştırılmış görev üretim aracı.

Tomlinson'ın farklılaştırılmış öğretim çerçevesindeki üç boyutu (İçerik, Süreç, Ürün) temel alır.

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
| `GROQ_MODEL` | Kullanılacak model (örn. `llama-3.1-8b-instant`) |

## Deployment

Vercel ücretsiz tier üzerinde deploy edilebilir. Ortam değişkenlerini Vercel dashboard'dan ayarlayın.
