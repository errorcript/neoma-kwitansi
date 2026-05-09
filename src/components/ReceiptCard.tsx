"use client";

import React, { useRef, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { terbilangIndonesia } from "@/lib/terbilang";
import { formatCurrency } from "@/lib/utils";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
  const receiptRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const targetWidth = 840; // Approx 210mm in pixels
        if (containerWidth < targetWidth) {
          setScale(containerWidth / targetWidth);
        } else {
          setScale(1);
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    const canvas = await html2canvas(receiptRef.current, {
      scale: 3,
      useCORS: true,
      logging: false,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [210, 105],
    });
    pdf.addImage(imgData, "PNG", 0, 0, 210, 105);
    pdf.save(`Kwitansi-${data.nama_donatur}-${data.no_kwitansi.replace(/\//g, "-")}.pdf`);
  };

  return (
    <div ref={containerRef} className="w-full flex justify-center py-6 no-print overflow-hidden">
      <div 
        className="relative shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-sm bg-white"
        style={{
          width: '210mm',
          height: `${105 * scale}mm`,
          minWidth: '210mm',
          transform: `scale(${scale})`,
          transformOrigin: 'top center'
        }}
      >
        <div 
          ref={receiptRef}
          className="relative w-[210mm] h-[105mm] border-[4px] border-brand-secondary p-10 bg-white flex flex-col font-sans"
        >
          {/* Side Banner */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-brand-secondary flex items-center justify-center overflow-hidden">
            <span className="transform -rotate-90 whitespace-nowrap text-white font-black text-4xl tracking-[0.4em] opacity-30 select-none">
              KWITANSI
            </span>
          </div>

          <div className="ml-16 flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between border-b-[3px] border-brand-secondary pb-4 mb-6">
              <div className="flex items-center gap-6">
                <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                  <img 
                    src="/logo-paguyuban.png" 
                    alt="Logo" 
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="space-y-0.5">
                  <h1 className="text-xl font-black text-brand-secondary leading-tight uppercase tracking-tight">
                    Paguyuban Dharma Putra Mahesa
                  </h1>
                  <p className="text-sm font-bold text-brand-primary tracking-widest uppercase">Desa Kalikebo - Trucuk - Klaten</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-4xl font-black italic text-brand-secondary tracking-tighter leading-none mb-2">BUKTI</h2>
                <div className="bg-brand-secondary text-white px-3 py-1 rounded-md font-mono font-bold text-sm">
                  No: {data.no_kwitansi}
                </div>
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-6 flex-1">
              <div className="flex items-center gap-4">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] min-w-[140px]">Telah diterima :</span>
                <div className="flex-1 border-b-2 border-dashed border-slate-300 pb-1 font-bold text-lg italic text-brand-secondary">
                  {data.nama_donatur || '....................................................................'}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] min-w-[140px]">Uang sebesar :</span>
                <div className="flex-1 bg-slate-50 px-4 py-2 rounded-xl font-black text-2xl text-brand-secondary flex items-center border border-slate-100 shadow-inner">
                  <span className="text-brand-primary mr-3 opacity-50">Rp</span>
                  {Number(data.nominal).toLocaleString('id-ID')}
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] min-w-[140px] mt-2">Terbilang :</span>
                <div className="flex-1 bg-brand-primary/10 p-3 rounded-2xl italic font-bold text-brand-secondary leading-relaxed border border-brand-primary/20">
                  {terbilangIndonesia(data.nominal)} Rupiah
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] min-w-[140px]">Untuk Pembayaran :</span>
                <div className="flex-1 border-b-2 border-dashed border-slate-300 pb-1 font-bold text-slate-600">
                  {data.keperluan || '....................................................................'}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 flex justify-between items-end">
              <div className="flex flex-col items-center min-w-[160px]">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-12">Penyetor</p>
                <p className="text-sm font-black text-brand-secondary uppercase border-b-2 border-brand-secondary px-6">
                  {data.penyerah || '....................'}
                </p>
              </div>

              <div className="flex flex-col items-center bg-slate-50 p-2 rounded-2xl border border-slate-100 shadow-sm">
                <QRCodeSVG value={`https://kwitansi.neoma.space/verify/${data.unique_hash}`} size={60} />
                <p className="text-[8px] font-black mt-2 text-slate-400 tracking-widest uppercase opacity-50" data-html2canvas-ignore="true">Official</p>
              </div>

              <div className="flex flex-col items-center min-w-[180px]">
                <p className="text-[11px] font-bold text-brand-secondary mb-1">Klaten, {data.tanggal}</p>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-12">Bendahara</p>
                <p className="text-sm font-black text-brand-secondary uppercase border-b-2 border-brand-secondary px-6">
                  {data.bendahara}
                </p>
                
                <button 
                  data-html2canvas-ignore="true"
                  onClick={async () => {
                    await handleDownloadPDF();
                    const text = encodeURIComponent(`Halo, ini adalah kwitansi resmi dari Paguyuban Dharma Putra Mahesa.\n\nAtas Nama: ${data.nama_donatur}\nNominal: ${formatCurrency(data.nominal)}\n\nCek keaslian kwitansi di sini:\nhttps://kwitansi.neoma.space/verify/${data.unique_hash}`);
                    window.open(`https://wa.me/?text=${text}`, '_blank');
                  }}
                  className="mt-4 no-print bg-green-500 text-white text-[10px] px-5 py-2.5 rounded-full font-black flex items-center gap-2 hover:bg-green-600 transition-all shadow-lg active:scale-95"
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  SHARE WA & PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hidden Print Content */}
      <div className="hidden print:block">
        <div ref={receiptRef} className="w-[210mm] h-[105mm] border-[4px] border-brand-secondary p-10 bg-white flex flex-col font-sans">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-brand-secondary flex items-center justify-center">
            <span className="transform -rotate-90 whitespace-nowrap text-white font-black text-4xl tracking-[0.4em] opacity-30">KWITANSI</span>
          </div>
          <div className="ml-16 flex-1 flex flex-col">
            <div className="flex items-start justify-between border-b-[3px] border-brand-secondary pb-4 mb-6">
              <div className="flex items-center gap-6">
                <img src="/logo-paguyuban.png" alt="Logo" className="w-16 h-16 object-contain" />
                <div>
                  <h1 className="text-xl font-black text-brand-secondary uppercase leading-none">Paguyuban Dharma Putra Mahesa</h1>
                  <p className="text-sm font-bold text-brand-primary">Desa Kalikebo - Trucuk - Klaten</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-4xl font-black italic text-brand-secondary leading-none mb-2">BUKTI</h2>
                <div className="bg-brand-secondary text-white px-3 py-1 rounded font-mono font-bold text-sm inline-block">No: {data.no_kwitansi}</div>
              </div>
            </div>
            <div className="space-y-6 flex-1">
              <div className="flex items-center gap-4"><span className="text-[11px] font-black text-slate-400 min-w-[140px]">Telah diterima :</span><div className="flex-1 border-b-2 border-dashed border-slate-300 font-bold italic text-brand-secondary leading-none">{data.nama_donatur}</div></div>
              <div className="flex items-center gap-4"><span className="text-[11px] font-black text-slate-400 min-w-[140px]">Uang sebesar :</span><div className="flex-1 bg-slate-50 px-4 py-2 rounded-lg font-black text-2xl text-brand-secondary">Rp {Number(data.nominal).toLocaleString('id-ID')}</div></div>
              <div className="flex items-start gap-4"><span className="text-[11px] font-black text-slate-400 min-w-[140px] mt-2">Terbilang :</span><div className="flex-1 bg-brand-primary/10 p-3 rounded-xl italic font-bold border border-brand-primary/20">{terbilangIndonesia(data.nominal)} Rupiah</div></div>
              <div className="flex items-center gap-4"><span className="text-[11px] font-black text-slate-400 min-w-[140px]">Untuk Pembayaran :</span><div className="flex-1 border-b-2 border-dashed border-slate-300 font-bold text-slate-600">{data.keperluan}</div></div>
            </div>
            <div className="mt-8 flex justify-between items-end">
              <div className="flex flex-col items-center min-w-[160px]"><p className="text-[10px] font-black text-slate-300 mb-12 uppercase">Penyetor</p><p className="text-sm font-black text-brand-secondary uppercase border-b-2 border-brand-secondary px-6">{data.penyerah}</p></div>
              <div className="flex flex-col items-center bg-slate-50 p-2 rounded-2xl border border-slate-100 shadow-sm"><QRCodeSVG value={`https://kwitansi.neoma.space/verify/${data.unique_hash}`} size={60} /></div>
              <div className="flex flex-col items-center min-w-[180px]"><p className="text-[11px] font-bold text-brand-secondary mb-1">Klaten, {data.tanggal}</p><p className="text-[10px] font-black text-slate-300 mb-12 uppercase">Bendahara</p><p className="text-sm font-black text-brand-secondary uppercase border-b-2 border-brand-secondary px-6">{data.bendahara}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
