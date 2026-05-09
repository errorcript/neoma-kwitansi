import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { Header } from "@/components/Header";
import { BarChart3, Users, Calendar, Download, Search } from "lucide-react";

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
            <h1 className="text-3xl font-black text-brand-secondary tracking-tighter uppercase">Rekap Donasi</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Dashboard Monitoring Transparansi</p>
          </div>
          <div className="flex bg-white shadow-sm border border-slate-100 p-1 rounded-xl">
             <div className="px-6 py-2 text-center border-r border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Periode</p>
                <p className="text-xs font-black text-brand-secondary uppercase">Mei 2026</p>
             </div>
             <div className="px-6 py-2 text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <p className="text-[10px] font-black text-green-500 uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Active
                </p>
             </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-8 rounded-[2rem] flex items-center gap-6 border-l-4 border-l-brand-primary">
            <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-brand-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Dana Terkumpul</p>
              <h2 className="text-3xl font-black text-brand-secondary tracking-tight">
                {formatCurrency(Number(stats.total_amount || 0))}
              </h2>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2rem] flex items-center gap-6 border-l-4 border-l-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Donatur</p>
              <h2 className="text-3xl font-black text-brand-secondary tracking-tight">
                {stats.total_count} <span className="text-sm text-slate-400 uppercase ml-1">Orang</span>
              </h2>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="glass-card rounded-[2rem] overflow-hidden shadow-2xl border border-white/40">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white/50">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-brand-primary rounded-full"></div>
              <h3 className="font-black text-brand-secondary uppercase tracking-tight">Log Transaksi Terkini</h3>
            </div>
            <button className="text-[10px] font-black text-brand-primary uppercase tracking-widest flex items-center gap-2 hover:bg-brand-primary/5 px-4 py-2 rounded-xl transition-all">
              <Download className="w-3.5 h-3.5" />
              Export Data
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <th className="px-8 py-5">No. Kwitansi</th>
                  <th className="px-8 py-5">Nama Donatur</th>
                  <th className="px-8 py-5">Nominal</th>
                  <th className="px-8 py-5 text-right">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-30">
                        <Calendar className="w-10 h-10" />
                        <p className="font-bold italic">Belum ada transaksi bulan ini...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-8 py-5">
                        <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                          {log.no_kwitansi}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <p className="font-black text-brand-secondary uppercase text-sm group-hover:text-brand-primary transition-colors">
                          {log.nama_donatur}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 italic">Via {log.penyerah || 'Direct'}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-black text-brand-primary text-base">
                          {formatCurrency(Number(log.nominal))}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-3 py-1 rounded-full">
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
