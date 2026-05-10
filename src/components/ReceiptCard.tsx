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
    <div className="relative w-[210mm] h-[95mm] border-2 border-brand-primary p-8 bg-white overflow-hidden flex flex-col font-sans shadow-sm mx-auto">
      {/* Side Label */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-brand-primary flex items-center justify-center">
        <span className="transform -rotate-90 whitespace-nowrap text-white font-bold text-2xl tracking-widest uppercase">
          KWITANSI
        </span>
      </div>

      <div className="flex-grow pl-10 md:pl-12">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-brand-primary pb-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 relative bg-white p-1 rounded-full border border-gray-100 shadow-sm flex items-center justify-center overflow-hidden">
               <img src="/logo-paguyuban.png" alt="Logo Paguyuban" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-black text-brand-secondary leading-none uppercase tracking-tighter">Paguyuban Dharma Putra Mahesa</h1>
              <p className="text-sm font-bold text-brand-secondary mt-1">DESA KALIKEBO</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <h2 className="text-3xl font-black text-brand-secondary tracking-tighter leading-none mb-1 italic">KWITANSI</h2>
            <div className="bg-gray-100 px-3 py-1 rounded-lg border border-gray-200">
              <p className="text-[10px] font-mono font-bold text-brand-secondary leading-none">No: {data.no_kwitansi}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow space-y-5">
          <div className="flex items-start">
            <span className="w-44 flex-shrink-0 font-bold text-brand-secondary text-sm uppercase tracking-tight">Telah diterima dari</span>
            <span className="mx-2 font-bold text-brand-secondary">:</span>
            <div className="flex-grow border-b border-dashed border-gray-300 pb-1 italic font-bold uppercase text-sm text-brand-secondary">
              {data.nama_donatur || '..................................................'}
            </div>
          </div>

          <div className="flex items-center">
            <span className="w-44 flex-shrink-0 font-bold text-brand-secondary text-sm uppercase tracking-tight">Uang sebesar</span>
            <span className="mx-2 font-bold text-brand-secondary">:</span>
            <div className="flex-grow flex items-center">
              <span className="text-3xl font-black text-brand-secondary bg-gray-50 px-4 py-1 rounded-xl border border-gray-100">Rp {data.nominal.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="flex items-start">
            <span className="w-44 flex-shrink-0 font-bold text-brand-secondary text-sm uppercase tracking-tight">Terbilang</span>
            <span className="mx-2 font-bold text-brand-secondary">:</span>
            <div className="flex-grow bg-gray-50/50 p-3 rounded-2xl border border-gray-100 italic text-brand-secondary font-bold text-sm leading-tight">
              {terbilang(data.nominal)} Rupiah
            </div>
          </div>

          <div className="flex items-start">
            <span className="w-44 flex-shrink-0 font-bold text-brand-secondary text-sm uppercase tracking-tight">Untuk Pembayaran</span>
            <span className="mx-2 font-bold text-brand-secondary">:</span>
            <div className="flex-grow border-b border-dashed border-gray-300 pb-1 text-brand-secondary font-bold text-sm uppercase">
              {data.keperluan || '..................................................'}
            </div>
          </div>
        </div>

        {/* Footer: Signatures & QR (Fixed Spacing) */}
        <div className="mt-8 grid grid-cols-3 items-end gap-6 text-center pb-4">
          <div className="flex flex-col items-center">
            <p className="text-[10px] uppercase font-black text-gray-400 mb-10 tracking-widest">Yang Menyerahkan</p>
            <div className="w-full border-b-2 border-brand-secondary font-black text-brand-secondary uppercase truncate px-2 pb-1 text-xs">
              {data.penyerah || '....................'}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center pb-2">
            <div className="p-2 bg-white border-2 border-gray-100 rounded-2xl shadow-sm mb-2">
              <QRCodeSVG 
                value={`https://kwitansi.neoma.space/verify/${data.unique_hash}`} 
                size={55}
              />
            </div>
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Scan to Verify</p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-[10px] uppercase font-black text-gray-400 mb-2 tracking-widest text-right leading-relaxed">
              Kalikebo, {data.tanggal}<br/>Bendahara
            </p>
            <div className="w-full border-b-2 border-brand-secondary font-black text-brand-secondary uppercase truncate px-2 pb-1 text-xs">
              {data.bendahara}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
