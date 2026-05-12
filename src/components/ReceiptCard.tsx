"use client";

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

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
    <div 
      className="relative w-[210mm] h-[95mm] p-6 overflow-hidden flex flex-col font-sans mx-auto" 
      style={{ 
        backgroundColor: '#ffffff', 
        border: '2px solid #8fc0c0',
        color: '#353e4c'
      }}
    >
      {/* Side Label - Using SVG for perfect capture reliability */}
      <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center" style={{ backgroundColor: '#8fc0c0' }}>
        <svg width="40" height="350" viewBox="0 0 40 350" className="w-full h-full">
          <text 
            x="20" 
            y="175" 
            transform="rotate(-90 20 175)" 
            textAnchor="middle" 
            fill="white" 
            fontSize="24" 
            fontWeight="900" 
            letterSpacing="8"
          >
            KWITANSI
          </text>
        </svg>
      </div>

      <div className="flex-grow pl-8">
        {/* Header - Compact */}
        <div className="flex justify-between items-start pb-2 mb-4" style={{ borderBottom: '2px solid #8fc0c0' }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 relative bg-white p-1 rounded-full border flex items-center justify-center" style={{ borderColor: '#f3f4f6' }}>
               <img src="/logo-paguyuban.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-black leading-none uppercase tracking-tighter" style={{ color: '#353e4c' }}>Paguyuban Dharma Putra Mahesa</h1>
              <p className="text-[10px] font-bold mt-1" style={{ color: '#353e4c' }}>DESA KALIKEBO</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-black tracking-tighter leading-none mb-1 italic" style={{ color: '#353e4c' }}>KWITANSI</h2>
            <p className="text-[9px] font-mono font-bold" style={{ color: '#9ca3af' }}>No: {data.no_kwitansi}</p>
          </div>
        </div>

        {/* Content - Compact spacing */}
        <div className="flex-grow space-y-3">
          <div className="flex items-start">
            <span className="w-36 flex-shrink-0 font-bold text-[11px] uppercase tracking-tight" style={{ color: '#353e4c' }}>Telah diterima dari</span>
            <span className="mx-2 font-bold text-[11px]" style={{ color: '#353e4c' }}>:</span>
            <div className="flex-grow border-b border-dashed pb-0.5 italic font-bold uppercase text-[11px]" style={{ borderColor: '#d1d5db', color: '#353e4c' }}>
              {data.nama_donatur || '..................................................'}
            </div>
          </div>

          <div className="flex items-center">
            <span className="w-36 flex-shrink-0 font-bold text-[11px] uppercase tracking-tight" style={{ color: '#353e4c' }}>Uang sebesar</span>
            <span className="mx-2 font-bold text-[11px]" style={{ color: '#353e4c' }}>:</span>
            <div className="flex-grow flex items-center">
              <span className="text-2xl font-black px-3 py-0.5 rounded-lg border" style={{ backgroundColor: '#f9fafb', borderColor: '#f3f4f6', color: '#353e4c' }}>Rp {data.nominal.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="flex items-start">
            <span className="w-36 flex-shrink-0 font-bold text-[11px] uppercase tracking-tight" style={{ color: '#353e4c' }}>Terbilang</span>
            <span className="mx-2 font-bold text-[11px]" style={{ color: '#353e4c' }}>:</span>
            <div className="flex-grow p-2 rounded-xl border italic font-bold text-[11px] leading-tight" style={{ backgroundColor: '#f9fafb', borderColor: '#f3f4f6', color: '#353e4c' }}>
              {terbilang(data.nominal)} Rupiah
            </div>
          </div>

          <div className="flex items-start">
            <span className="w-36 flex-shrink-0 font-bold text-[11px] uppercase tracking-tight" style={{ color: '#353e4c' }}>Untuk Pembayaran</span>
            <span className="mx-2 font-bold text-[11px]" style={{ color: '#353e4c' }}>:</span>
            <div className="flex-grow border-b border-dashed pb-0.5 font-bold text-[11px] uppercase" style={{ borderColor: '#d1d5db', color: '#353e4c' }}>
              {data.keperluan || '..................................................'}
            </div>
          </div>
        </div>

        {/* Footer - Guaranteed Visibility */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center h-24">
          <div className="flex flex-col items-center justify-between py-1">
            <p className="text-[9px] uppercase font-black tracking-widest" style={{ color: '#9ca3af' }}>Penyerah</p>
            <div className="w-full border-b font-black uppercase truncate px-2 pb-0.5 text-[10px]" style={{ borderColor: '#353e4c', color: '#353e4c' }}>
              {data.penyerah || '....................'}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="p-1.5 bg-white border rounded-xl mb-1" style={{ borderColor: '#f3f4f6' }}>
              <QRCodeSVG 
                value={`https://kwitansi.neoma.space/verify/${data.unique_hash}`} 
                size={45}
              />
            </div>
            <p className="text-[7px] font-black uppercase tracking-widest" style={{ color: '#9ca3af' }}>Verify</p>
          </div>

          <div className="flex flex-col items-center justify-between py-1">
            <div className="text-center">
               <p className="text-[8px] uppercase font-black tracking-tight leading-none mb-1" style={{ color: '#9ca3af' }}>
                 Kalikebo, {data.tanggal}
               </p>
               <p className="text-[9px] uppercase font-black tracking-widest" style={{ color: '#9ca3af' }}>
                 Bendahara
               </p>
            </div>
            <div className="w-full border-b font-black uppercase truncate px-2 pb-0.5 text-[10px]" style={{ borderColor: '#353e4c', color: '#353e4c' }}>
              {data.bendahara}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
