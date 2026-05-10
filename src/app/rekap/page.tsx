"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import { Search, Download, Trash2, ExternalLink, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function RekapPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({ total_count: 0, total_amount: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      // Panggil API rekap (kita buat API baru biar client-side bisa fetch)
      const res = await fetch('/api/receipts/list');
      const data = await res.json();
      setLogs(data.logs || []);
      setStats(data.stats || { total_count: 0, total_amount: 0 });
    } catch (err) {
      console.error("Gagal ambil data rekap", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin mau hapus data ini, bre? Data bakal ilang permanen loh!")) return;
    
    try {
      const res = await fetch('/api/receipts/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      if (res.ok) {
        // Update state lokal biar gak usah refresh
        setLogs(logs.filter(log => log.id !== id));
        fetchData(); // Refresh stats juga
      } else {
        alert("Gagal hapus data!");
      }
    } catch (err) {
      alert("Error pas hapus data!");
    }
  };

  const filteredLogs = logs.filter(log => 
    log.nama_donatur.toLowerCase().includes(search.toLowerCase()) ||
    log.no_kwitansi.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Stats Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-brand-primary text-brand-secondary p-6 rounded-3xl shadow-lg border border-brand-primary/20">
            <p className="text-xs font-bold uppercase opacity-70">Total Donasi Masuk</p>
            <h2 className="text-4xl font-black">{formatCurrency(stats.total_amount)}</h2>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-gray-400">Jumlah Transaksi</p>
              <h2 className="text-3xl font-black text-brand-secondary">{stats.total_count} <span className="text-sm font-normal">Kwitansi</span></h2>
            </div>
            <button 
              onClick={fetchData}
              className={cn("bg-gray-100 p-4 rounded-2xl text-brand-secondary hover:bg-gray-200 transition-all", loading && "animate-spin")}
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
                      <td className="px-6 py-4 font-mono font-bold text-xs text-brand-primary">{log.no_kwitansi}</td>
                      <td className="px-6 py-4 font-bold text-brand-secondary uppercase">{log.nama_donatur}</td>
                      <td className="px-6 py-4 text-right font-black text-brand-secondary">{formatCurrency(Number(log.nominal))}</td>
                      <td className="px-6 py-4 text-gray-400">{new Date(log.created_at).toLocaleDateString('id-ID')}</td>
                      <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                        <Link 
                          href={`/verify/${log.unique_hash}`}
                          className="p-2 text-gray-400 hover:text-brand-primary transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(log.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-all"
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

// Utility for cn if not imported properly
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
