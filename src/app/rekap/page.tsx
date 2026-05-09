import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { Search, Download, Trash2, ExternalLink, TrendingUp, Users, Calendar } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RekapPage() {
  const logs = await db.getAllLogs();
  const stats = await db.getStats();

  return (
    <main className="min-h-screen p-4 md:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-brand-secondary tracking-tighter">REKAPITULASI</h2>
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-primary" />
              Laporan Donasi Real-time
            </p>
          </div>
          
          <div className="flex gap-3">
            <button className="btn-premium bg-white text-slate-600 px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2">
              <Download className="w-4 h-4" />
              EXPORT CSV
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-8 rounded-[2.5rem] flex items-center gap-6 group hover:bg-brand-primary/5 transition-colors">
            <div className="bg-brand-primary/20 p-4 rounded-3xl group-hover:scale-110 transition-transform">
              <TrendingUp className="w-8 h-8 text-brand-secondary" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Dana</p>
              <h3 className="text-2xl font-black text-brand-secondary">
                {formatCurrency(Number(stats.total_amount || 0))}
              </h3>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] flex items-center gap-6 group hover:bg-brand-primary/5 transition-colors">
            <div className="bg-blue-100 p-4 rounded-3xl group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Donatur</p>
              <h3 className="text-2xl font-black text-brand-secondary">
                {stats.total_count} <span className="text-sm text-slate-400">Orang</span>
              </h3>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] flex items-center gap-6 group hover:bg-brand-primary/5 transition-colors">
            <div className="bg-orange-100 p-4 rounded-3xl group-hover:scale-110 transition-transform">
              <ExternalLink className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rata-rata</p>
              <h3 className="text-2xl font-black text-brand-secondary">
                {formatCurrency(Number(stats.total_amount || 0) / (Number(stats.total_count) || 1))}
              </h3>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="glass-card rounded-[2.5rem] overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-white/50 flex items-center justify-between">
            <h3 className="font-black text-brand-secondary tracking-tight">Riwayat Transaksi</h3>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Cari donatur..."
                className="bg-slate-100/50 border-none rounded-xl py-2 pl-10 pr-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary/30 transition-all outline-none"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kwitansi / Tanggal</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Donatur</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nominal</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-20 text-center">
                      <div className="flex flex-col items-center gap-4 text-slate-400">
                        <TrendingUp className="w-12 h-12 opacity-20" />
                        <p className="font-bold">Belum ada data donasi masuk.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  logs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="p-6">
                        <p className="font-black text-brand-secondary text-sm">{log.no_kwitansi}</p>
                        <p className="text-xs text-slate-400 font-bold">{new Date(log.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </td>
                      <td className="p-6">
                        <p className="font-bold text-slate-700">{log.nama_donatur}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.penyerah || 'Anonim'}</p>
                      </td>
                      <td className="p-6">
                        <span className="bg-brand-primary/10 text-brand-secondary px-3 py-1.5 rounded-xl font-black text-sm border border-brand-primary/20">
                          {formatCurrency(log.nominal)}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link 
                            href={`/verify/${log.unique_hash}`}
                            target="_blank"
                            className="p-2 hover:bg-brand-primary/20 rounded-xl transition-colors text-brand-secondary"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </Link>
                          <button className="p-2 hover:bg-rose-100 rounded-xl transition-colors text-rose-500">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
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
