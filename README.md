# SUARA TK --- Suara Teknik Komputer
> *Dengar, Catat, Tindaklanjuti.*  
> Program kerja berkelanjutan Divisi Humas Himpunan Mahasiswa Teknik Komputer (HIMTEK).

SUARA TK adalah web application yang menjadi kanal komunikasi aspirasi, kritik, saran, ide kegiatan, serta laporan kendala mahasiswa Teknik Komputer kepada HIMTEK dan pihak terkait kampus secara transparan dan bertanggung jawab.

---

## 🚀 Fitur Utama MVP

1. **Beranda & Profil Program (`/`)**
   - Penjelasan alur aspirasi, kategori, FAQ interaktif, dan pencarian cepat kode tiket.
2. **Form Pengiriman Aspirasi (`/submit`)**
   - Mode pengiriman fleksibel: **Anonim** (data pengenal diri tidak disimpan) atau **Dengan Identitas**.
   - Validasi input, pilihan kategori terstandarisasi, dan persetujuan etika.
   - Penerbitan otomatis **Kode Tiket Acak Unik** publik (contoh: `STK-7K4P-9M2Q`).
3. **Pelacakan Status & Timeline (`/track`)**
   - Pelacakan menggunakan nomor tiket tanpa perlu login.
   - Visualisasi timeline kronologis tahapan verifikasi hingga penyelesaian.
   - Kotak tanggapan resmi dari Humas HIMTEK.
   - Sanitasi data pribadi dan proteksi catatan internal.
4. **Panduan & Kebijakan Privasi (`/tentang`)**
   - Standar etika pengiriman masukan.
   - Kebijakan privasi dan transparansi data.
   - Target waktu respons (SLA 3-5 hari kerja).
   - Prosedur rujukan cepat untuk isu darurat/sensitif.
5. **Dashboard Pengelola Admin (`/admin/dashboard`)**
   - Antrean aspirasi masuk dengan pencarian dan filter status/kategori.
   - Pengubahan status, tingkat prioritas, respons publik, dan catatan internal.
   - Statistik agregat tindak lanjut.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + Lucide React Icons
- **Database / Backend:** Supabase (PostgreSQL, Row Level Security, Migration SQL disertakan di `supabase/migrations/`)
- **Hosting:** Vercel

---

## 💻 Cara Menjalankan Secara Lokal

### 1. Masuk ke direktori proyek
```bash
cd suara-tk
```

### 2. Jalankan development server
```bash
npm run dev
```

Buka peramban Anda di: [http://localhost:3000](http://localhost:3000)

### 3. Halaman yang dapat langsung dicoba
- **Beranda:** [http://localhost:3000/](http://localhost:3000/)
- **Kirim Aspirasi:** [http://localhost:3000/submit](http://localhost:3000/submit)
- **Pelacakan Tiket:** [http://localhost:3000/track](http://localhost:3000/track)  
  *Gunakan contoh tiket demo:*
  - `STK-7K4P-9M2Q` *(Fasilitas Lab - Status: Dalam Proses)*
  - `STK-8B2X-4L9V` *(Workshop Docker - Status: Selesai)*
  - `STK-3V9T-1W8F` *(Jadwal Pengganti - Status: Ditinjau)*
- **Dashboard Admin:** [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)
- **Panduan & Privasi:** [http://localhost:3000/tentang](http://localhost:3000/tentang)

---

## 📂 Struktur Direktori Proyek

```text
suara-tk/
├── app/
│   ├── (public)/
│   │   ├── page.tsx               # Landing Page & FAQ
│   │   ├── submit/page.tsx        # Form Aspirasi & Generator Tiket
│   │   ├── track/page.tsx         # Pelacakan Status & Timeline
│   │   └── tentang/page.tsx       # Panduan Etika, SLA & Privasi
│   ├── admin/
│   │   └── dashboard/page.tsx     # Dashboard Pengelola Humas
│   └── api/
│       ├── aspirations/           # Endpoint submit & verifikasi
│       └── admin/aspirations/     # Endpoint kelola status & respons
├── components/
│   ├── Navbar.tsx                 # Header navigasi responsif
│   ├── Footer.tsx                 # Footer & disclaimer darurat
│   ├── StatusBadge.tsx            # Badge visual status
│   └── Timeline.tsx               # Timeline kronologis status
├── lib/
│   ├── types.ts                   # Type definitions TypeScript
│   ├── constants.ts               # Kategori & konfigurasi status
│   └── store.ts                   # In-memory store & ticket generator
├── supabase/
│   └── migrations/                # Skema SQL, RLS, triggers & functions
├── .env.example                   # Template variabel lingkungan
└── README.md
```

---

## 🔒 Privasi dan Keamanan

- **Data Minimization:** Tidak meminta data sensitif seperti password, nomor induk mahasiswa (NIM), atau rekening.
- **Random Ticket Entropy:** Kode tiket dibuat secara acak non-sekuensial (`STK-XXXX-XXXX`) untuk mencegah enumerasi.
- **Sanitasi Publik:** Respons internal, identitas admin, dan data pribadi pengirim tidak pernah diekspos ke publik.
