"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const OnboardingTour = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Hanya jalankan di homepage agar element-nya lengkap
    if (pathname !== '/') return;

    // Cek apakah sudah pernah liat tutorial
    const hasSeenTutorial = localStorage.getItem("neoma_tour_completed");
    
    if (hasSeenTutorial) return;

    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      doneBtnText: 'Selesai',
      nextBtnText: 'Lanjut',
      prevBtnText: 'Kembali',
      steps: [
        { 
          element: '#tour-add-row', 
          popover: { 
            title: 'Tambah Baris', 
            description: 'Klik ini buat nambah baris donatur baru. Bisa input banyak sekaligus biar gak capek!', 
            side: "bottom", 
            align: 'start' 
          } 
        },
        { 
          element: '#tour-input-form', 
          popover: { 
            title: 'Input Data', 
            description: 'Isi nama, nominal, dan keperluan donasi di sini. Format nominal otomatis rapi kok.', 
            side: "bottom", 
            align: 'start' 
          } 
        },
        { 
          element: '#tour-save-db', 
          popover: { 
            title: 'Simpan Database', 
            description: '<span style="color: #ef4444; font-weight: 900;">PENTING!</span> Selalu klik Simpan Database dulu biar datanya masuk ke laporan. Kalo cuma di-share tanpa simpan, datanya gak bakal tercatat!', 
            side: "top", 
            align: 'start' 
          } 
        },
        { 
          element: '.tour-share-wa', 
          popover: { 
            title: 'Share WhatsApp', 
            description: 'Klik ini buat otomatis kirim gambar kwitansi ke nomor donatur. Gak perlu screenshot manual lagi!', 
            side: "left", 
            align: 'start' 
          } 
        },
        { 
          element: '#tour-print-all', 
          popover: { 
            title: 'Cetak Masal', 
            description: 'Mau cetak ke printer? Klik ini buat layout 3 kwitansi per lembar A4.', 
            side: "top", 
            align: 'start' 
          } 
        },
        { 
          element: '#tour-nav-rekap', 
          popover: { 
            title: 'Menu Rekapitulasi', 
            description: 'Semua data yang udah disimpan bisa dicek di sini. Ada statistik dan fitur export Excel juga.', 
            side: "bottom", 
            align: 'end' 
          } 
        },
      ],
      onDestroyed: () => {
        localStorage.setItem("neoma_tour_completed", "true");
      }
    });

    // Jalankan tour setelah delay dikit biar element render sempurna
    const timer = setTimeout(() => {
      driverObj.drive();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return null;
};
