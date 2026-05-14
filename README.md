# 💎 NEOMA SYSTEM - Official Kwitansi Paguyuban

Sistem manajemen kwitansi donasi profesional berbasis cloud untuk **Paguyuban Dharma Putra Mahesa**. Didesain dengan identitas visual resmi organisasi (Forest Green & White) dan presisi tinggi untuk kebutuhan cetak bukti donasi fisik maupun digital.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vercel Postgres](https://img.shields.io/badge/Vercel-Postgres-000000?style=for-the-badge&logo=vercel)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)

## ✨ Fitur Unggulan

- 🎨 **Official Organization Branding**: Antarmuka bersih dengan skema warna Hijau & Putih yang formal.
- 🖨️ **Precision A4 Printing**: Layout kwitansi presisi (1/3 A4 split), dioptimalkan untuk cetak fisik masal.
- 🖼️ **Auto-Capture Receipt Image**: Fitur "Share WhatsApp" otomatis meng-capture kartu kwitansi menjadi gambar PNG (Blob) yang siap kirim tanpa pecah.
- 🔢 **Professional Sequential Numbering**: Penomoran kwitansi otomatis (`001/PAG-DPM/MOBSOS/...`) yang reset tiap bulan.
- 🔍 **QR Verification System**: Scan QR Code unik untuk verifikasi keaslian donasi secara real-time.
- 📊 **Dashboard Rekap & LPJ Instan**: Monitoring statistik, export Excel, dan generate laporan visual (PNG) dalam satu klik.
- 🛡️ **Double Security Hub**: Akses admin terproteksi dan fitur Logout resmi terpusat di halaman Settings.
- 📱 **Hybrid Navigation**: Sidebar elegan di PC dan **Solid Bottom Bar** di HP untuk pengalaman app native.
- 📱 **PWA Support**: Bisa diinstal di Android/iOS layaknya aplikasi native langsung dari browser.
- 🎓 **Guided Onboarding**: Tutorial interaktif (Spotlight) untuk membantu admin mengoperasikan sistem secara mandiri.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Database**: Vercel Postgres (Serverless SQL)
- **PDF/Image Engine**: html2canvas (Blob Format) & jsPDF
- **Icons**: Lucide React
- **PWA**: Web Manifest & Service Worker

## 🚀 Cara Instalasi

1. Clone repositori:
   ```bash
   git clone https://github.com/errorcript/neoma-kwitansi.git
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Set variabel lingkungan (.env):
   ```env
   POSTGRES_URL="your-vercel-postgres-url"
   ADMIN_PASSWORD="your-secure-password"
   DELETE_PIN="your-delete-pin"
   ```
4. Jalankan aplikasi:
   ```bash
   npm run dev
   ```

## 📜 Lisensi

Eksklusif dikembangkan oleh **Neoma Creative Hub** (Henri S, S.Kom) untuk **Paguyuban Dharma Putra Mahesa**.

---
*Built with ❤️ by Antigravity for Neoma Creative Hub.*
