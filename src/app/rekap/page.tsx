import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { Header } from "@/components/Header";
import { BarChart3, Users, Calendar, Download } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RekapPage() {
  const logs = await db.getAllLogs();
  const stats = await db.getStats();

  return (
    <main className="min-h-screen p-4 md:p-10 bg-[#f8fafc]">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-brand-secondary tracking-tighter uppercase leading-none">Rekap Donasi</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Dashboard Monitoring Transparansi</p>
          </div>
          <div className="flex bg-white shadow-xl border border-slate-100 p-1 rounded-2xl">
             <div className="px-6 py-2 text-center border-r border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Periode</p>
                <p className="text-xs font-black text-brand-secondary uppercase">Mei 2026</p>
             </div>
             <div className="px-6 py-2 text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <p className="text-[10px] font-black text-green-500 uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Live
                </p>
             </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-10 rounded-[2.5rem] flex items-center gap-8 border-l-4 border-l-brand-primary shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16"></div>
            <div className="w-20 h-20 bg-brand-primary/10 rounded-3xl flex items-center justify-center shrink-0">
              <BarChart3 className="w-10 h-10 text-brand-primary" />
            </div>
            <div className="relative z-10">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Dana Terkumpul</p>
              <h2 className="text-4xl font-black text-brand-secondary tracking-tighter">
                {formatCurrency(Number(stats.total_amount || 0))}
              </h2>
            </div>
          </div>

          <div className="glass-card p-10 rounded-[2.5rem] flex items-center gap-8 border-l-4 border-l-slate-200 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100/5 rounded-full -mr-16 -mt-16"></div>
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center shrink-0">
              <Users className="w-10 h-10 text-slate-400" />
            </div>
            <div className="relative z-10">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Donatur</p>
              <h2 className="text-4xl font-black text-brand-secondary tracking-tighter">
                {stats.total_count} <span className="text-sm text-slate-400 uppercase ml-1">Orang</span>
              </h2>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white/40">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white/60 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="w-2 h-8 bg-brand-primary rounded-full"></div>
              <h3 className="font-black text-brand-secondary uppercase tracking-tight text-lg">Log Transaksi Terkini</h3>
            </div>
            <button className="text-[10px] font-black text-brand-primary uppercase tracking-widest flex items-center gap-2 hover:bg-brand-primary/5 px-5 py-2.5 rounded-2xl transition-all border border-brand-primary/20 shadow-sm">
              <Download className="w-4 h-4" />
              Download CSV
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <th className="px-10 py-6">Kwitansi ID</th>
                  <th className="px-10 py-6">Pihak Donatur</th>
                  <th className="px-10 py-6">Nominal</th>
                  <th className="px-10 py-6 text-right">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 bg-white/30">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-10 py-24 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-20">
                        <Calendar className="w-12 h-12" />
                        <p className="font-black uppercase tracking-widest text-xs italic">Data Belum Tersedia</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-all group">
                      <td className="px-10 py-6">
                        <span className="font-mono text-[11px] font-black text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">
                          {log.no_kwitansi}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <p className="font-black text-brand-secondary uppercase text-sm group-hover:text-brand-primary transition-colors">
                          {log.nama_donatur}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 italic">Diterima oleh Admin</p>
                      </td>
                      <td className="px-10 py-6">
                        <span className="font-black text-brand-primary text-lg">
                          {formatCurrency(Number(log.nominal))}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-100/50 px-4 py-1.5 rounded-full border border-slate-100">
                          {new Date(log.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
