"use client";

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';

interface ReceiptProps {
  data: {
    no_kwitansi: string;
    nama_donatur: string;
    nominal: number;
    keperluan: string;
    penyerah?: string;
    tanggal: string;
    bendahara: string;
    unique_hash: string;
  };
}

export const ReceiptCard: React.FC<ReceiptProps> = ({ data }) => {
  // Fungsi terbilang sederhana
  const terbilang = (n: number): string => {
    const angka = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
    if (n < 12) return angka[n];
    if (n < 20) return terbilang(n - 10) + " Belas";
    if (n < 100) return terbilang(Math.floor(n / 10)) + " Puluh " + terbilang(n % 10);
    if (n < 200) return "Seratus " + terbilang(n - 100);
    if (n < 1000) return terbilang(Math.floor(n / 100)) + " Ratus " + terbilang(n % 100);
    if (n < 2000) return "Seribu " + terbilang(n - 1000);
    if (n < 1000000) return terbilang(Math.floor(n / 1000)) + " Ribu " + terbilang(n % 1000);
    if (n < 1000000000) return terbilang(Math.floor(n / 1000000)) + " Juta " + terbilang(n % 1000000);
    return "Terlalu Besar";
  };

  return (
    <div className="relative w-full print:w-[210mm] h-[99mm] border-2 border-brand-primary p-6 bg-white overflow-hidden flex flex-col font-sans">
      {/* Side Label */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-brand-primary flex items-center justify-center no-print">
        <span className="transform -rotate-90 whitespace-nowrap text-white font-bold text-2xl tracking-widest uppercase">
          KWITANSI
        </span>
      </div>

      <div className="flex-grow pl-10 md:pl-12">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-brand-primary pb-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 relative bg-white p-1 rounded-full border border-gray-100 shadow-sm flex items-center justify-center">
               <img src="/logo.png" alt="Logo" className="w-14 h-14 object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-black text-brand-secondary leading-none uppercase">Paguyuban Dharma Putra Mahesa</h1>
              <p className="text-sm font-semibold text-brand-secondary">DESA KALIKEBO</p>
            </div>
          </div>
          {/* Right Section: Title & Number */}
          <div className="text-right flex flex-col items-end">
            <h2 className="text-2xl font-black text-brand-secondary tracking-tighter leading-none mb-1">KWITANSI</h2>
            <div className="bg-gray-100 px-2 py-1 rounded border border-gray-200">
              <p className="text-[9px] font-mono font-bold text-brand-secondary leading-none">No: {data.no_kwitansi}</p>
            </div>
          </div>
        </div>

        {/* Main Content: Standardized Label Alignment */}
        <div className="flex-grow space-y-4 py-2">
          <div className="flex items-start">
            <span className="w-40 flex-shrink-0 font-bold text-brand-secondary text-sm">Telah diterima dari</span>
            <span className="mx-2 font-bold text-brand-secondary">:</span>
            <div className="flex-grow border-b border-dashed border-gray-300 pb-1 italic font-medium uppercase text-sm">
              {data.nama_donatur}
            </div>
          </div>

          <div className="flex items-center">
            <span className="w-40 flex-shrink-0 font-bold text-brand-secondary text-sm">Uang sebesar</span>
            <span className="mx-2 font-bold text-brand-secondary">:</span>
            <div className="flex-grow flex items-center gap-2">
              <span className="text-2xl font-black text-brand-secondary">Rp {data.nominal.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="flex items-start">
            <span className="w-40 flex-shrink-0 font-bold text-brand-secondary text-sm">Terbilang</span>
            <span className="mx-2 font-bold text-brand-secondary">:</span>
            <div className="flex-grow bg-gray-50/50 p-2 rounded-xl border border-gray-100 italic text-brand-secondary font-medium text-sm">
              {terbilang(data.nominal)} Rupiah
            </div>
          </div>

          <div className="flex items-start">
            <span className="w-40 flex-shrink-0 font-bold text-brand-secondary text-sm">Untuk Pembayaran</span>
            <span className="mx-2 font-bold text-brand-secondary">:</span>
            <div className="flex-grow border-b border-dashed border-gray-300 pb-1 text-brand-secondary font-medium text-sm">
              {data.keperluan}
            </div>
          </div>
        </div>

        {/* Footer: Signatures & QR */}
        <div className="mt-auto grid grid-cols-3 items-end gap-4 text-center pb-2">
          <div className="flex flex-col items-center">
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-8 tracking-tighter">Yang Menyerahkan</p>
            <div className="w-full border-b border-brand-secondary font-bold text-brand-secondary uppercase truncate px-2 pb-1 text-sm">
              {data.penyerah || '....................'}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="p-1 bg-white border border-gray-100 rounded-lg shadow-sm mb-1">
              <QRCodeSVG 
                value={`https://kwitansi.neoma.space/verify/${data.unique_hash}`} 
                size={55}
              />
            </div>
            <p className="text-[8px] font-bold text-gray-400">Scan to Verify</p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-tighter text-right">Kalikebo, {data.tanggal}<br/>Bendahara</p>
            <div className="w-full border-b border-brand-secondary font-bold text-brand-secondary uppercase truncate px-2 pb-1 text-sm">
              {data.bendahara}
            </div>
            
            {/* WhatsApp Share Button (No Print) */}
            <button 
              onClick={() => {
                const message = `Halo *${data.nama_donatur}*, ini adalah kwitansi resmi dari *Paguyuban Dharma Putra Mahesa* Desa Kalikebo.\n\n` +
                  `No: ${data.no_kwitansi}\n` +
                  `Nominal: Rp ${data.nominal.toLocaleString('id-ID')}\n` +
                  `Keperluan: ${data.keperluan}\n` +
                  `Tanggal: ${data.tanggal}\n\n` +
                  `Cek validitas di sini: https://kwitansi.neoma.space/verify/${data.unique_hash}\n\n` +
                  `Terima kasih atas partisipasinya! 🙏`;
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
              }}
              className="mt-2 no-print flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-all"
            >
              <MessageCircle className="w-3 h-3" /> Kirim WA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
