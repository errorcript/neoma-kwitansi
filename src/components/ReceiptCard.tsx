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
    <div className="relative w-[210mm] h-[95mm] border-2 border-brand-primary p-6 bg-white overflow-hidden flex flex-col font-sans shadow-sm mx-auto">
      {/* Side Label */}
      <div className="absolute left-0 top-0 bottom-0 w-10 bg-brand-primary flex items-center justify-center">
        <span className="transform -rotate-90 whitespace-nowrap text-white font-bold text-xl tracking-widest uppercase">
          KWITANSI
        </span>
      </div>

      <div className="flex-grow pl-8">
        {/* Header - Compact */}
        <div className="flex justify-between items-start border-b-2 border-brand-primary pb-2 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 relative bg-white p-1 rounded-full border border-gray-100 shadow-sm flex items-center justify-center">
               <img src="/logo-paguyuban.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-black text-brand-secondary leading-none uppercase tracking-tighter">Paguyuban Dharma Putra Mahesa</h1>
              <p className="text-[10px] font-bold text-brand-secondary mt-1">DESA KALIKEBO</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-black text-brand-secondary tracking-tighter leading-none mb-1 italic">KWITANSI</h2>
            <p className="text-[9px] font-mono font-bold text-brand-secondary/60">No: {data.no_kwitansi}</p>
          </div>
        </div>

        {/* Content - Compact spacing */}
        <div className="flex-grow space-y-3">
          <div className="flex items-start">
            <span className="w-36 flex-shrink-0 font-bold text-brand-secondary text-[11px] uppercase tracking-tight">Telah diterima dari</span>
            <span className="mx-2 font-bold text-brand-secondary text-[11px]">:</span>
            <div className="flex-grow border-b border-dashed border-gray-300 pb-0.5 italic font-bold uppercase text-[11px] text-brand-secondary">
              {data.nama_donatur || '..................................................'}
            </div>
          </div>

          <div className="flex items-center">
            <span className="w-36 flex-shrink-0 font-bold text-brand-secondary text-[11px] uppercase tracking-tight">Uang sebesar</span>
            <span className="mx-2 font-bold text-brand-secondary text-[11px]">:</span>
            <div className="flex-grow flex items-center">
              <span className="text-2xl font-black text-brand-secondary bg-gray-50 px-3 py-0.5 rounded-lg border border-gray-100">Rp {data.nominal.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="flex items-start">
            <span className="w-36 flex-shrink-0 font-bold text-brand-secondary text-[11px] uppercase tracking-tight">Terbilang</span>
            <span className="mx-2 font-bold text-brand-secondary text-[11px]">:</span>
            <div className="flex-grow bg-gray-50/50 p-2 rounded-xl border border-gray-100 italic text-brand-secondary font-bold text-[11px] leading-tight">
              {terbilang(data.nominal)} Rupiah
            </div>
          </div>

          <div className="flex items-start">
            <span className="w-36 flex-shrink-0 font-bold text-brand-secondary text-[11px] uppercase tracking-tight">Untuk Pembayaran</span>
            <span className="mx-2 font-bold text-brand-secondary text-[11px]">:</span>
            <div className="flex-grow border-b border-dashed border-gray-300 pb-0.5 text-brand-secondary font-bold text-[11px] uppercase">
              {data.keperluan || '..................................................'}
            </div>
          </div>
        </div>

        {/* Footer - Guaranteed Visibility */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center h-24">
          <div className="flex flex-col items-center justify-between py-1">
            <p className="text-[9px] uppercase font-black text-gray-400 tracking-widest">Penyerah</p>
            <div className="w-full border-b border-brand-secondary font-black text-brand-secondary uppercase truncate px-2 pb-0.5 text-[10px]">
              {data.penyerah || '....................'}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="p-1.5 bg-white border border-gray-100 rounded-xl shadow-sm mb-1">
              <QRCodeSVG 
                value={`https://kwitansi.neoma.space/verify/${data.unique_hash}`} 
                size={45}
              />
            </div>
            <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Verify</p>
          </div>

          <div className="flex flex-col items-center justify-between py-1">
            <div className="text-center">
               <p className="text-[8px] uppercase font-black text-gray-400 tracking-tight leading-none mb-1">
                 Kalikebo, {data.tanggal}
               </p>
               <p className="text-[9px] uppercase font-black text-gray-400 tracking-widest">
                 Bendahara
               </p>
            </div>
            <div className="w-full border-b border-brand-secondary font-black text-brand-secondary uppercase truncate px-2 pb-0.5 text-[10px]">
              {data.bendahara}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
