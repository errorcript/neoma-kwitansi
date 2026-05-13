import React from 'react';
import { formatCurrency } from '@/lib/utils';

interface SummaryProps {
  data: {
    month: string;
    income: number;
    expense: number;
    balance: number;
    logs: any[];
    bendahara: string;
    signature?: string;
  };
}

export const MonthlySummary: React.FC<SummaryProps> = ({ data }) => {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-white p-12 flex flex-col font-sans text-slate-800 shadow-2xl mx-auto border" id="monthly-summary-report">
      {/* Header */}
      <div className="flex items-center gap-6 border-b-4 border-brand-primary pb-8 mb-10">
        <img src="/logo-paguyuban.png" alt="Logo" className="w-24 h-24 object-contain" />
        <div className="flex-grow">
          <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900 leading-none mb-2">LAPORAN PERTANGGUNGJAWABAN DONASI</h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.3em]">Paguyuban Dharma Putra Mahesa • Desa Kalikebo</p>
          <div className="mt-4 inline-block bg-brand-primary/10 px-4 py-2 rounded-xl border border-brand-primary/20">
            <p className="text-xs font-black text-brand-primary uppercase">Periode: {data.month}</p>
          </div>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest text-center">Total Pemasukan</p>
          <p className="text-2xl font-black text-emerald-600 text-center">{formatCurrency(data.income)}</p>
        </div>
        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest text-center">Total Pengeluaran</p>
          <p className="text-2xl font-black text-rose-600 text-center">{formatCurrency(data.expense)}</p>
        </div>
        <div className="p-6 bg-brand-primary rounded-3xl border border-brand-primary/20 shadow-lg shadow-brand-primary/10">
          <p className="text-[10px] font-black uppercase text-slate-700 mb-2 tracking-widest text-center">Saldo Akhir</p>
          <p className="text-2xl font-black text-slate-900 text-center">{formatCurrency(data.balance)}</p>
        </div>
      </div>

      {/* Transaction List */}
      <div className="flex-grow">
        <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-l-4 border-brand-primary pl-4">Rincian Transaksi Terbaru</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
              <th className="p-4 rounded-tl-xl">No</th>
              <th className="p-4">Tanggal</th>
              <th className="p-4">Nama Donatur / Keterangan</th>
              <th className="p-4 text-right rounded-tr-xl">Nominal</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y">
            {data.logs.slice(0, 15).map((log, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                <td className="p-4 font-bold text-slate-400">{i + 1}</td>
                <td className="p-4">{new Date(log.created_at || log.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</td>
                <td className="p-4 font-bold uppercase">{log.nama_donatur || log.item_pengeluaran}</td>
                <td className={cn("p-4 text-right font-black", log.nama_donatur ? "text-emerald-600" : "text-rose-600")}>
                  {log.nama_donatur ? "+" : "-"} {formatCurrency(Number(log.nominal))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.logs.length > 15 && (
           <p className="mt-4 text-[10px] text-slate-400 italic text-center">*Menampilkan 15 transaksi terbaru. Rincian lengkap tersedia di sistem pusat.</p>
        )}
      </div>

      {/* Footer / Signature */}
      <div className="mt-12 flex justify-between items-end border-t border-slate-100 pt-10">
        <div className="text-[10px] text-slate-400 font-bold max-w-xs uppercase leading-relaxed">
          <p>Laporan ini dihasilkan secara otomatis oleh Sistem Administrasi Neoma Kwitansi.</p>
          <p className="mt-1">Diverifikasi & disetujui untuk dipublikasikan sebagai bentuk transparansi publik.</p>
        </div>
        <div className="text-center w-64 space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mengetahui, Bendahara</p>
          <div className="h-24 flex items-center justify-center relative border-b border-slate-900 mx-8">
            {data.signature && (
               <img src={data.signature} alt="Signature" className="h-20 object-contain mix-blend-multiply" />
            )}
          </div>
          <p className="font-black uppercase text-sm tracking-tight">{data.bendahara}</p>
        </div>
      </div>
    </div>
  );
};

// CSS Utility for cn
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
