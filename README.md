# 💎 NEOMA SYSTEM - Official Kwitansi Paguyuban

Sistem manajemen kwitansi donasi profesional berbasis cloud untuk **Paguyuban Dharma Putra Mahesa**. Didesain dengan estetika *Glassmorphism* modern dan presisi tinggi untuk kebutuhan cetak bukti donasi.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vercel Postgres](https://img.shields.io/badge/Vercel-Postgres-000000?style=for-the-badge&logo=vercel)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)

## ✨ Fitur Unggulan

- 🎨 **Premium Glassmorphism UI**: Antarmuka modern yang bersih, responsif, dan elegan.
- 🖨️ **Precision Printing (210mm x 105mm)**: Layout kwitansi yang dioptimalkan untuk ukuran A4 (sepertiga lembar) dengan presisi pixel-perfect.
- 🚀 **Bulk Entry System**: Input banyak data sekaligus menggunakan format CSV-like untuk efisiensi tinggi.
- 📊 **Real-time Rekapitulasi**: Dashboard monitoring total dana dan log transaksi secara transparan.
- 🛡️ **Secure API Architecture**: Pemrosesan data sisi server menggunakan Vercel Postgres untuk keamanan integritas data.
- 📲 **WhatsApp Integration**: Berbagi kwitansi PDF langsung ke WhatsApp donatur dengan satu klik.
- 🔑 **Master Admin Access**: Sistem login terpusat untuk menjaga keamanan konfigurasi.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (Turbopack)
- **Styling**: Tailwind CSS v4 (Custom Modern System)
- **Database**: Vercel Postgres (Serverless SQL)
- **PDF Generation**: jsPDF & html2canvas
- **Icons**: Lucide React
- **QR Engine**: qrcode.react (Verification System)

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

Eksklusif dikembangkan untuk **Paguyuban Dharma Putra Mahesa**.

---
*Built with ❤️ by Antigravity for Neoma.*
