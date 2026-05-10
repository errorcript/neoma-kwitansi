"use client";

import { useState, useEffect } from "react";
import { formatCurrency, cn } from "@/lib/utils";
import { Search, Trash2, ExternalLink, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function RekapPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({ total_count: 0, total_amount: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/receipts/list', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setLogs(data.logs || []);
        setStats(data.stats || { total_count: 0, total_amount: 0 });
      }
    } catch (err) {
      console.error("Gagal ambil data rekap", err);
      showToast("Gagal mengambil data dari server", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin mau hapus data ini? Data bakal hilang permanen!")) return;
    
    try {
      const res = await fetch('/api/receipts/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      const result = await res.json();
      
      if (res.ok) {
        showToast("Data berhasil dihapus! 🗑️", "success");
        setLogs(prev => prev.filter(log => log.id !== id));
        // Update stats lokal sederhana
        setStats(prev => ({
          total_count: prev.total_count - 1,
          total_amount: prev.total_amount // Nominalnya susah dikurangin manual tanpa re-fetch
        }));
        fetchData(); // Tetap re-fetch buat akurasi nominal
      } else {
        showToast(result.error || "Gagal menghapus data", "error");
      }
    } catch (err) {
      showToast("Terjadi kesalahan koneksi", "error");
    }
  };

  const filteredLogs = logs.filter(log => 
    (log.nama_donatur?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (log.no_kwitansi?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50 relative overflow-hidden">
      {/* Toast Notification */}
      {notification && (
        <div className={cn(
          "fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300",
          notification.type === 'success' ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
        )}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-bold text-sm uppercase tracking-wider">{notification.message}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Stats Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-brand-primary text-brand-secondary p-6 rounded-3xl shadow-lg border border-brand-primary/20">
            <p className="text-xs font-bold uppercase opacity-70">Total Donasi Masuk</p>
            <h2 className="text-4xl font-black tracking-tight">{formatCurrency(stats.total_amount)}</h2>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-gray-400">Jumlah Transaksi</p>
              <h2 className="text-3xl font-black text-brand-secondary">{stats.total_count} <span className="text-sm font-normal">Kwitansi</span></h2>
            </div>
            <button 
              onClick={fetchData}
              className={cn("bg-gray-100 p-4 rounded-2xl text-brand-secondary hover:bg-gray-200 transition-all", loading && "animate-spin")}
              title="Refresh Data"
            >
              <RefreshCw className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-6 border-b flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
            <h3 className="font-bold text-lg text-brand-secondary">Riwayat Kwitansi</h3>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari donatur atau nomor..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-xl border-none bg-gray-100 text-sm focus:ring-2 focus:ring-brand-primary outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading && logs.length === 0 ? (
              <div className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">
                Memuat Data...
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b">
                    <th className="px-6 py-4">No Kwitansi</th>
                    <th className="px-6 py-4">Donatur</th>
                    <th className="px-6 py-4 text-right">Nominal</th>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {filteredLogs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-all group">
                      <td className="px-6 py-4 font-mono font-bold text-[10px] text-brand-primary">{log.no_kwitansi}</td>
                      <td className="px-6 py-4 font-bold text-brand-secondary uppercase">{log.nama_donatur}</td>
                      <td className="px-6 py-4 text-right font-black text-brand-secondary">{formatCurrency(Number(log.nominal))}</td>
                      <td className="px-6 py-4 text-gray-400">{new Date(log.created_at).toLocaleDateString('id-ID')}</td>
                      <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                        <Link 
                          href={`/verify/${log.unique_hash}`}
                          className="p-2 text-gray-400 hover:text-brand-primary transition-all"
                          title="Lihat Verifikasi"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(log.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-all"
                          title="Hapus Data"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-gray-400 italic">
                        Belum ada data kwitansi atau pencarian tidak ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
