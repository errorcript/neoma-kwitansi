"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const OnboardingTour = () => {
  return (
    <Suspense fallback={null}>
      <TourContent />
    </Suspense>
  );
};

const TourContent = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Cek apakah dipaksa lewat link (?tutorial=true)
    const isForced = searchParams.get('tutorial') === 'true';

    // Cek apakah sudah pernah liat tutorial di halaman ini
    const storageKey = `neoma_tour_${pathname.replace(/\//g, 'root')}_completed`;
    const hasSeenTutorial = localStorage.getItem(storageKey);
    
    if (hasSeenTutorial && !isForced) return;

    let steps: any[] = [];

    if (pathname === '/') {
      steps = [
        { 
          element: '#tour-input-form', 
          popover: { 
            title: 'Formulir Input Donasi', 
            description: 'Silakan isi data donatur (Nama, Nominal, dan Keperluan) secara teliti pada kolom yang tersedia.', 
            side: "bottom", 
            align: 'start' 
          } 
        },
        { 
          element: '#tour-add-row', 
          popover: { 
            title: 'Input Massal', 
            description: 'Gunakan tombol <b>Tambah Baris</b> jika Anda ingin menginput banyak donatur sekaligus dalam satu transaksi untuk efisiensi waktu.', 
            side: "bottom", 
            align: 'start' 
          } 
        },
        { 
          element: '#tour-save-db', 
          popover: { 
            title: 'Simpan Database', 
            description: '<span style="color: #ef4444; font-weight: 900;">[WAJIB SIMPAN!]</span> Data Anda <b>TIDAK AKAN TERSIMPAN</b> jika tidak menekan tombol ini. Pastikan klik Simpan agar transaksi tercatat resmi di sistem.', 
            side: "top", 
            align: 'start' 
          } 
        },
        { 
          element: '.tour-share-wa', 
          popover: { 
            title: 'Distribusi WhatsApp', 
            description: 'Kirim bukti digital langsung ke donatur. Sistem akan <b>otomatis mengunduh gambar PNG</b> dan menyiapkan template pesan WhatsApp.', 
            side: "left", 
            align: 'start' 
          } 
        },
        { 
          element: '#tour-print-all', 
          popover: { 
            title: 'Cetak Fisik', 
            description: 'Gunakan fitur ini untuk cetak massal. Layout telah dioptimalkan untuk memuat 3 kwitansi dalam satu lembar kertas A4.', 
            side: "top", 
            align: 'start' 
          } 
        },
      ];
    } else if (pathname === '/rekap') {
      steps = [
        { 
          element: '#tour-rekap-stats', 
          popover: { 
            title: 'Dashboard Keuangan', 
            description: 'Monitor ringkasan Kas Masuk, Keluar, dan Sisa Saldo Kas secara real-time di panel indikator ini.', 
            side: "bottom", 
            align: 'start' 
          } 
        },
        { 
          element: '#tour-rekap-add-expense', 
          popover: { 
            title: 'Catat Pengeluaran', 
            description: '<span style="color: #3b82f6; font-weight: 900;">[INPUT UANG KELUAR]</span> Klik ikon <b>"+"</b> di kartu Pengeluaran untuk mencatat penggunaan dana (Operasional, Santunan, dll).', 
            side: "bottom", 
            align: 'start' 
          } 
        },
        { 
          element: '#tour-rekap-tabs', 
          popover: { 
            title: 'Navigasi Tab', 
            description: 'Beralih tampilan antara <b>Data Donasi</b> (Uang Masuk) dan <b>Catatan Pengeluaran</b> (Uang Keluar) dengan mudah.', 
            side: "bottom", 
            align: 'start' 
          } 
        },
        { 
          element: '#tour-rekap-search', 
          popover: { 
            title: 'Pencarian Cepat', 
            description: 'Gunakan kolom pencarian untuk menemukan data donatur atau nomor kwitansi secara instan tanpa perlu memuat ulang halaman.', 
            side: "bottom", 
            align: 'start' 
          } 
        },
        { 
          element: '#tour-rekap-filters', 
          popover: { 
            title: 'Filter Periode', 
            description: 'Gunakan filter tanggal untuk menampilkan transaksi dalam rentang periode tertentu (Misal: Laporan Bulanan).', 
            side: "bottom", 
            align: 'start' 
          } 
        },
        { 
          element: '#tour-rekap-lpj', 
          popover: { 
            title: 'LPJ Instan', 
            description: '<span style="color: #10b981; font-weight: 900;">[FITUR UNGGULAN]</span> Hasilkan laporan visual profesional (PNG) yang merangkum keuangan bulan ini untuk dibagikan ke warga.', 
            side: "bottom", 
            align: 'end' 
          } 
        },
        { 
          element: '#tour-rekap-excel', 
          popover: { 
            title: 'Ekspor Data', 
            description: 'Gunakan fitur ini untuk mengunduh seluruh database ke dalam format Excel (XLSX) guna pengolahan data lebih lanjut.', 
            side: "bottom", 
            align: 'end' 
          } 
        },
        { 
          element: '#tour-rekap-actions', 
          popover: { 
            title: 'Audit Data', 
            description: 'Gunakan ikon Pensil untuk <b>Edit</b> atau ikon Sampah untuk <b>Hapus</b>. Penghapusan memerlukan PIN Admin demi keamanan data.', 
            side: "left", 
            align: 'start' 
          } 
        },
      ];
    } else if (pathname === '/settings') {
      steps = [
        { 
          element: '#tour-settings-identity', 
          popover: { 
            title: 'Identitas & Tanda Tangan', 
            description: 'Atur nama resmi Bendahara dan unggah foto tanda tangan asli Anda agar kwitansi digital memiliki kredibilitas hukum yang sah.', 
            side: "bottom", 
            align: 'start' 
          } 
        },
        { 
          element: '#tour-logout', 
          popover: { 
            title: 'Selesai Sesi', 
            description: '<span style="color: #ef4444; font-weight: 900;">[LOGOUT]</span> Gunakan tombol ini untuk keluar dari sistem admin secara aman setelah Anda selesai bekerja.', 
            side: "top", 
            align: 'start' 
          } 
        },
      ];
    }

    if (steps.length === 0) return;

    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      doneBtnText: 'Selesai',
      nextBtnText: 'Lanjut',
      prevBtnText: 'Kembali',
      steps: steps,
      onDestroyed: () => {
        localStorage.setItem(storageKey, "true");
        // Clear tutorial param from URL without reloading
        const url = new URL(window.location.href);
        url.searchParams.delete('tutorial');
        window.history.replaceState({}, '', url.toString());
      }
    });

    const timer = setTimeout(() => {
      driverObj.drive();
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
};
