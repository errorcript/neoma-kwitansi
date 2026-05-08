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
          </div>
        </div>
      </div>
      
      {/* Cut Mark */}
      <div className="absolute bottom-0 left-0 right-0 border-b-2 border-dashed border-gray-300 no-print"></div>
    </div>
  );
};
