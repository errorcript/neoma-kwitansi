"use client";

import { useState, useEffect, useCallback } from "react";
import { formatCurrency, cn } from "@/lib/utils";
import { Search, Trash2, ExternalLink, RefreshCw, AlertCircle, CheckCircle2, Printer, MessageSquare, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function RekapPage() {
  const [mounted, setMounted] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({ total_count: 0, total_amount: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const fetchData = useCallback(async () => {
    console.log("[DEBUG] Fetching logs...");
    setLoading(true);
    try {
      const res = await fetch('/api/receipts/list', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setLogs(data.logs || []);
        setStats(data.stats || { total_count: 0, total_amount: 0 });
      }
    } catch (err) {
      console.error("[DEBUG] Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mounted) fetchData();
  }, [mounted, fetchData]);

  const handleDelete = async (id: string, nama: string) => {
    console.log("[DEBUG] Clicked delete for:", id);
    
    // Gunakan alert dulu buat ngetes apakah JS-nya nyampe sini
    const yakin = window.confirm(`Hapus permanen kwitansi atas nama: ${nama}?`);
    if (!yakin) return;

    try {
      const res = await fetch('/api/receipts/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      const result = await res.json();
      if (res.ok) {
        showToast("Data Berhasil Dihapus! ✅", "success");
        setLogs(prev => prev.filter(log => log.id !== id));
        fetchData();
      } else {
        showToast(result.error || "Gagal Hapus", "error");
      }
    } catch (err) {
      showToast("Kesalahan Koneksi", "error");
    }
  };

  const handleShareWA = (log: any) => {
    const message = `Halo *${log.nama_donatur}*, ini adalah kwitansi resmi dari *Paguyuban Dharma Putra Mahesa* Desa Kalikebo.\n\n` +
      `No: ${log.no_kwitansi}\n` +
      `Nominal: ${formatCurrency(Number(log.nominal))}\n\n` +
      `Cek di sini: https://kwitansi.neoma.space/verify/${log.unique_hash}\n\n` +
      `Terima kasih! 🙏`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  const filteredLogs = logs.filter(log => 
    (log.nama_donatur?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (log.no_kwitansi?.toLowerCase() || "").includes(search.toLowerCase())
  );

  if (!mounted) return null;

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50 relative overflow-hidden">
      {/* Toast */}
      {notification && (
        <div className={cn(
          "fixed top-10 left-1/2 -translate-x-1/2 z-[999] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300",
          notification.type === 'success' ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
        )}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-bold text-sm uppercase">{notification.message}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-brand-secondary">Rekapitulasi Donasi</h1>
          <button onClick={fetchData} className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-50 border border-gray-100">
             <RefreshCw className={cn("w-5 h-5 text-brand-primary", loading && "animate-spin")} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-brand-primary text-brand-secondary p-8 rounded-3xl shadow-lg">
             <p className="text-[10px] font-black uppercase opacity-60">Total Dana Masuk</p>
             <h2 className="text-4xl font-black">{formatCurrency(stats.total_amount)}</h2>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex items-center justify-between">
             <div>
               <p className="text-[10px] font-black uppercase text-gray-400">Total Kwitansi</p>
               <h2 className="text-3xl font-black text-brand-secondary">{stats.total_count}</h2>
             </div>
             <ShieldAlert className="w-10 h-10 text-brand-primary/20" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-6 border-b bg-gray-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
             <div className="relative w-full sm:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input 
                 type="text" 
                 placeholder="Cari nama/nomor..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-primary text-sm"
               />
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 border-b">
                  <th className="px-6 py-4">Nomor</th>
                  <th className="px-6 py-4">Nama Donatur</th>
                  <th className="px-6 py-4 text-right">Nominal</th>
                  <th className="px-6 py-4 text-center">Opsi</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-all">
                    <td className="px-6 py-4 font-mono text-[10px] text-brand-primary font-bold">{log.no_kwitansi}</td>
                    <td className="px-6 py-4 font-bold text-brand-secondary uppercase">{log.nama_donatur}</td>
                    <td className="px-6 py-4 text-right font-black">{formatCurrency(Number(log.nominal))}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/verify/${log.unique_hash}`} className="p-2 text-gray-400 hover:text-brand-primary">
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link href={`/print/${log.unique_hash}`} target="_blank" className="p-2 text-gray-400 hover:text-blue-500">
                          <Printer className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleShareWA(log)} className="p-2 text-gray-400 hover:text-emerald-500">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        {/* THE TROUBLEMAKER BUTTON */}
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(log.id, log.nama_donatur);
                          }}
                          className="p-2 text-rose-300 hover:text-rose-600 transition-all cursor-pointer bg-white rounded-lg hover:bg-rose-50"
                          style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr><td colSpan={4} className="p-20 text-center text-gray-400 italic">Data tidak ditemukan.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
