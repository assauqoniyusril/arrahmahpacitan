# Laporan Validasi Portal Reportase Foto

Tanggal: 26 September 2026

## Pembaruan visual

Halaman publik telah didesain ulang dengan bahasa visual yang terinspirasi dari komposisi `sditarrahmah.sch.id`: navbar putih, hero terpusat, aksen ungu, latar lavender, ribbon foto, statistik overlay, kartu lembut, dan CTA pastel. Implementasi tetap menggunakan identitas, konten, serta aset Portal Reportase Foto sendiri.

## Status implementasi

- Backend Gin + GORM + PostgreSQL: lengkap secara implementasi.
- JWT admin, bootstrap user admin, dan validasi secret production: lengkap.
- Endpoint publik, CRUD admin, pagination, search, related news: lengkap.
- Upload JPG/PNG/WebP ke bind mount lokal: lengkap.
- Frontend React/Vite/Tailwind: beranda, detail reportase, login, dashboard, daftar dan editor berita tersedia.
- Docker Compose development dan production: tersedia.
- Nginx development dan Nginx Host OS production dengan wildcard SSL template: tersedia.

## Pemeriksaan yang berhasil

- Seluruh 4 file JSON yang diperiksa memiliki sintaks valid.
- Kedua file Docker Compose lolos parsing YAML.
- Tiga konfigurasi Nginx lolos pemeriksaan struktur kurung dan header proxy wajib.
- Kontrak route frontend dan endpoint backend telah diperiksa secara statis.
- `go.sum` tersedia dan Dockerfile backend menyalin `go.mod` serta `go.sum` sebelum download dependency.

## Hasil build frontend

- Pemeriksaan TypeScript dengan `tsc -b` berhasil.
- Build production Vite berhasil: 56 modul ditransformasi.
- Artefak yang dihasilkan: HTML 0,54 kB, CSS 45,64 kB (gzip 7,89 kB), dan JavaScript 808,81 kB (gzip 225,34 kB).
- Preview production berhasil dijalankan dan dirender pada viewport 1440 × 5000. Screenshot tersedia di `outputs/reportase-redesign.png`.
- Bundle JavaScript lokal memunculkan peringatan ukuran di atas 500 kB karena paket ikon lokal yang dipulihkan memakai entry CJS. Instalasi bersih dari `package.json` di Docker memakai entry ESM sehingga tree-shaking dapat bekerja; code-splitting tetap direkomendasikan jika bundle produksi final masih besar.

## Batasan validasi lingkungan

1. Docker CLI tidak terpasang, sehingga `docker compose config/build/up` dan `nginx -t` di dalam image belum dapat dijalankan.
2. Go executable lokal tidak tersedia, sehingga `go test ./...` dan `go build ./cmd/api` belum dapat dijalankan langsung.

Keterbatasan tersebut hanya berlaku pada validasi Docker/backend di mesin sesi ini. Frontend sudah berhasil dikompilasi dan dirender.

## Validasi lanjutan yang disarankan

Jalankan pada host dengan Docker:

```bash
cp .env.example .env
# Ganti seluruh secret terlebih dahulu.
docker compose config
docker compose up --build
```

Kemudian verifikasi:

```bash
curl http://localhost:8005/health
curl http://localhost:8080/api/news
```

Untuk production:

```bash
docker compose -f docker-compose.prod.yml config
docker compose -f docker-compose.prod.yml build
sudo nginx -t
```
