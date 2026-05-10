# 💎 NEOMA SYSTEM - Official Kwitansi Paguyuban

Sistem manajemen kwitansi donasi profesional berbasis cloud untuk **Paguyuban Dharma Putra Mahesa**. Didesain dengan identitas visual resmi organisasi (Forest Green & White) dan presisi tinggi untuk kebutuhan cetak bukti donasi fisik.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vercel Postgres](https://img.shields.io/badge/Vercel-Postgres-000000?style=for-the-badge&logo=vercel)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)

## ✨ Fitur Unggulan

- 🎨 **Official Organization Branding**: Antarmuka bersih dengan skema warna Hijau & Putih yang formal dan terpercaya.
- 🖨️ **Precision A4 Printing (1/3 Split)**: Layout kwitansi yang presisi meniru dokumen fisik, dioptimalkan untuk dibagi menjadi 3 bagian dalam satu lembar A4.
- 🔍 **QR Verification System**: Setiap kwitansi memiliki kode QR unik yang dapat di-scan publik untuk memverifikasi keaslian donasi secara real-time.
- 🚀 **Bulk Entry System**: Input data donatur massal (Nama, Nominal) untuk efisiensi admin (Anti-Mager workflow).
- 📊 **Dashboard Rekapitulasi**: Monitoring total dana terkumpul dan log transaksi harian secara transparan.
- 🛡️ **Secure API Architecture**: Keamanan data menggunakan Vercel Postgres dengan sistem otentikasi Master Admin.
- 📲 **WhatsApp Sharing**: Bagikan bukti kwitansi digital langsung ke WhatsApp donatur dengan format yang rapi.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 (Organization Color Palette)
- **Database**: Vercel Postgres (Serverless SQL)
- **PDF Engine**: jsPDF & html2canvas
- **Icons**: Lucide React
- **Validation**: QR Code Verification Engine

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
   ```
4. Jalankan aplikasi:
   ```bash
   npm run dev
   ```

## 📜 Lisensi

Eksklusif dikembangkan oleh **Neoma Creative Hub** untuk **Paguyuban Dharma Putra Mahesa**.

---
*Built with ❤️ by Antigravity for Neoma.*
