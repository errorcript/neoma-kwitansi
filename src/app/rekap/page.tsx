import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { Search, Download, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RekapPage() {
  const logs = await db.getAllLogs();
  const stats = await db.getStats();

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Stats Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-brand-primary text-brand-secondary p-6 rounded-3xl shadow-lg border border-brand-primary/20">
            <p className="text-xs font-bold uppercase opacity-70">Total Donasi Masuk</p>
            <h2 className="text-4xl font-black">{formatCurrency(Number(stats.total_amount || 0))}</h2>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-gray-400">Jumlah Transaksi</p>
              <h2 className="text-3xl font-black text-brand-secondary">{stats.total_count} <span className="text-sm font-normal">Kwitansi</span></h2>
            </div>
            <button className="bg-gray-100 p-4 rounded-2xl text-brand-secondary hover:bg-gray-200 transition-all">
              <Download className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-6 border-b flex items-center justify-between bg-gray-50/50">
            <h3 className="font-bold text-lg text-brand-secondary">Riwayat Kwitansi</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari donatur..." 
                className="pl-10 pr-4 py-2 rounded-xl border-none bg-gray-100 text-sm focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b">
                  <th className="px-6 py-4">No Kwitansi</th>
                  <th className="px-6 py-4">Donatur</th>
                  <th className="px-6 py-4 text-right">Nominal</th>
                  <th className="px-6 py-4">Penyerah</th>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-all group">
                    <td className="px-6 py-4 font-mono font-bold text-xs text-brand-primary">{log.no_kwitansi}</td>
                    <td className="px-6 py-4 font-bold text-brand-secondary uppercase">{log.nama_donatur}</td>
                    <td className="px-6 py-4 text-right font-black text-brand-secondary">{formatCurrency(Number(log.nominal))}</td>
                    <td className="px-6 py-4 text-gray-500 italic">{log.penyerah || '-'}</td>
                    <td className="px-6 py-4 text-gray-400">{new Date(log.created_at).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                      <Link 
                        href={`/verify/${log.unique_hash}`}
                        className="p-2 text-gray-400 hover:text-brand-primary transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button className="p-2 text-gray-400 hover:text-red-500 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
