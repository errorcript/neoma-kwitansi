"use client";

import { useState, useEffect, useCallback } from "react";
import { formatCurrency, cn } from "@/lib/utils";
import { Search, Trash2, ExternalLink, RefreshCw, AlertCircle, CheckCircle2, Printer, MessageSquare, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function RekapPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({ total_count: 0, total_amount: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const fetchData = useCallback(async () => {
    console.log("[AUDIT] Fetching transaction logs...");
    setLoading(true);
    try {
      const res = await fetch('/api/receipts/list', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setLogs(data.logs || []);
        setStats(data.stats || { total_count: 0, total_amount: 0 });
      }
    } catch (err) {
      console.error("[AUDIT ERROR] Failed to fetch logs:", err);
      showToast("Gagal mengambil data dari server", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // FIX: Ensured this is ONLY called via explicit user click
  const performDelete = async (id: string) => {
    console.log(`[AUDIT] User initiated deletion for ID: ${id}`);
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
        fetchData(); 
      } else {
        showToast(result.error || "Gagal menghapus data", "error");
      }
    } catch (err) {
      showToast("Terjadi kesalahan koneksi", "error");
    }
  };

  const handleShareWA = (log: any) => {
    const message = `Halo *${log.nama_donatur}*, ini adalah kwitansi resmi dari *Paguyuban Dharma Putra Mahesa* Desa Kalikebo.\n\n` +
      `No: ${log.no_kwitansi}\n` +
      `Nominal: ${formatCurrency(Number(log.nominal))}\n` +
      `Keperluan: ${log.keperluan}\n` +
      `Tanggal: ${new Date(log.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}\n\n` +
      `Cek validitas di sini: https://kwitansi.neoma.space/verify/${log.unique_hash}\n\n` +
      `Terima kasih atas partisipasinya! 🙏`;
    
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
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
        
        {/* Security Header */}
        <div className="bg-brand-secondary text-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-brand-secondary/20">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-brand-primary" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Security Mode: Active</p>
              <p className="text-xs opacity-70">Sistem terlindungi dari serangan injeksi dan akses ilegal.</p>
            </div>
          </div>
          <button 
            onClick={fetchData}
            className={cn("p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all", loading && "animate-spin")}
            title="Refresh Data"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-brand-primary text-brand-secondary p-8 rounded-[32px] shadow-lg border border-brand-primary/20">
            <p className="text-xs font-bold uppercase opacity-70 mb-1">Total Donasi Masuk</p>
            <h2 className="text-5xl font-black tracking-tight">{formatCurrency(stats.total_amount)}</h2>
          </div>
          <div className="bg-white p-8 rounded-[32px] shadow-lg border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-gray-400 mb-1">Jumlah Transaksi Terverifikasi</p>
              <h2 className="text-4xl font-black text-brand-secondary">{stats.total_count} <span className="text-sm font-normal text-gray-400">Kwitansi</span></h2>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-[32px] shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8 border-b flex flex-col sm:flex-row items-center justify-between gap-6 bg-gray-50/50">
            <h3 className="font-bold text-xl text-brand-secondary">Riwayat Kwitansi Resmi</h3>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari donatur atau nomor..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-72 pl-12 pr-6 py-3 rounded-2xl border-none bg-gray-100 text-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading && logs.length === 0 ? (
              <div className="p-24 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">
                Audit Data Sedang Berlangsung...
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b">
                    <th className="px-8 py-5">No Kwitansi</th>
                    <th className="px-8 py-5">Nama Donatur</th>
                    <th className="px-8 py-5 text-right">Nominal</th>
                    <th className="px-8 py-5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {filteredLogs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-gray-50/50 transition-all group">
                      <td className="px-8 py-5 font-mono font-bold text-[10px] text-brand-primary">{log.no_kwitansi}</td>
                      <td className="px-8 py-5 font-bold text-brand-secondary uppercase">{log.nama_donatur}</td>
                      <td className="px-8 py-5 text-right font-black text-brand-secondary">{formatCurrency(Number(log.nominal))}</td>
                      <td className="px-8 py-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link 
                            href={`/verify/${log.unique_hash}`}
                            className="p-3 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-all"
                            title="Verify"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link 
                            href={`/print/${log.unique_hash}`}
                            target="_blank"
                            className="p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                            title="Print"
                          >
                            <Printer className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleShareWA(log)}
                            className="p-3 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                            title="Share WA"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              const yakin = window.confirm("SECURITY ALERT: Hapus data ini secara permanen?");
                              if (yakin) performDelete(log.id);
                            }}
                            className="p-3 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-24 text-center text-gray-400 italic">
                        Belum ada rekaman donasi yang terverifikasi.
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
