"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { terbilangIndonesia } from "@/lib/terbilang";
import { formatCurrency } from "@/lib/utils";

interface ReceiptProps {
  data: {
    no_kwitansi: string;
    nama_donatur: string;
    nominal: number;
    keperluan: string;
    tanggal: string;
    bendahara: string;
    unique_hash: string;
  };
}

export const ReceiptCard: React.FC<ReceiptProps> = ({ data }) => {
  return (
    <div className="relative w-full h-[105mm] border-2 border-brand-primary p-6 bg-white overflow-hidden flex flex-col font-sans">
      {/* Side Label */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-brand-primary flex items-center justify-center">
        <span className="transform -rotate-90 whitespace-nowrap text-white font-bold text-2xl tracking-widest">
          KWITANSI
        </span>
      </div>

      <div className="ml-12 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-brand-primary pb-2">
          <div className="flex items-center gap-4">
            <img 
              src="/logo-paguyuban.png" 
              alt="Logo Paguyuban" 
              className="w-16 h-16 object-contain"
            />
            <div>
              <h1 className="text-lg font-extrabold text-brand-secondary leading-tight uppercase">
                Paguyuban Dharma Putra Mahesa
              </h1>
              <p className="text-sm font-semibold text-brand-secondary">DESA KALIKEBO</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-black italic text-brand-secondary">KWITANSI</h2>
            <p className="text-sm font-mono font-bold">No: {data.no_kwitansi}</p>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-3 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold min-w-[120px]">Telah diterima :</span>
            <span className="flex-1 border-b border-dotted border-gray-400 font-medium italic">
              {data.nama_donatur}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold min-w-[120px]">Uang sebesar :</span>
            <span className="flex-1 border-b border-dotted border-gray-400 font-bold text-lg">
              {formatCurrency(data.nominal)}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-sm font-bold min-w-[120px]">Terbilang :</span>
            <div className="flex-1 bg-brand-primary/10 p-2 rounded italic font-medium">
              {terbilangIndonesia(data.nominal)}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold min-w-[120px]">Untuk pembay :</span>
            <span className="flex-1 border-b border-dotted border-gray-400">
              {data.keperluan}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-between items-end">
          <div className="flex flex-col items-center">
            <p className="text-xs font-bold mb-8">Yang menyerahkan</p>
            <div className="w-32 border-b border-black"></div>
            <p className="text-[10px] mt-1">(....................................)</p>
          </div>

          <div className="flex flex-col items-center">
            <QRCodeSVG value={`https://neoma.space/verify/${data.unique_hash}`} size={64} />
            <p className="text-[8px] mt-1 text-gray-400">Scan to Verify</p>
          </div>

          <div className="flex flex-col items-center text-right">
            <p className="text-xs font-bold mb-1">
              Kalikebo, {data.tanggal}
            </p>
            <p className="text-xs font-bold mb-8">Bendahara</p>
            <p className="text-sm font-bold uppercase underline">{data.bendahara}</p>
            
            {/* WhatsApp Share Button (No Print) */}
            <button 
              onClick={() => {
                const text = encodeURIComponent(`Halo, ini adalah kwitansi resmi dari Paguyuban Dharma Putra Mahesa.\n\nAtas Nama: ${data.nama_donatur}\nNominal: ${formatCurrency(data.nominal)}\n\nCek keaslian kwitansi di sini:\nhttps://neoma-kwitansi.vercel.app/verify/${data.unique_hash}`);
                window.open(`https://wa.me/?text=${text}`, '_blank');
              }}
              className="mt-4 no-print bg-green-500 text-white text-[10px] px-3 py-1 rounded-full font-bold flex items-center gap-1 hover:bg-green-600 transition-all"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Share WA
            </button>
          </div>
        </div>
      </div>
      
      {/* Cut Mark */}
      <div className="absolute bottom-0 left-0 right-0 border-b-2 border-dashed border-gray-300 no-print"></div>
    </div>
  );
};
