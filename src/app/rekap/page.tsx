"use client";

import { useState, useEffect, useCallback } from "react";
import html2canvas from "html2canvas";
import { ReceiptCard } from "@/components/ReceiptCard";
import { formatCurrency, cn } from "@/lib/utils";
import { 
  Search, Trash2, ExternalLink, RefreshCw, AlertCircle, 
  CheckCircle2, Printer, MessageSquare, ShieldAlert, X, Download,
  LayoutDashboard, LogOut, Edit3, Calendar, Filter
} from "lucide-react";
import Link from "next/link";
import * as XLSX from "xlsx";

export default function RekapPage() {
  const [mounted, setMounted] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({ total_count: 0, total_amount: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editingLog, setEditingLog] = useState<any | null>(null);
  const [pinInput, setPinInput] = useState("");
  
  // Date Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [sharingLog, setSharingLog] = useState<any | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL('/api/receipts/list', window.location.origin);
      if (startDate) url.searchParams.set('start', startDate);
      if (endDate) url.searchParams.set('end', endDate);
      
      const res = await fetch(url.toString(), { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setLogs(data.logs || []);
        setStats(data.stats || { total_count: 0, total_amount: 0 });
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (mounted) fetchData();
  }, [mounted, fetchData]);

  const handleExportExcel = () => {
    if (logs.length === 0) {
      showToast("TIDAK ADA DATA UNTUK DIEKSPOR", "error");
      return;
    }

    try {
      // Menyiapkan data untuk Excel dengan format profesional
      const excelData = logs.map((log, index) => ({
        "NO": index + 1,
        "TANGGAL": new Date(log.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        "NO KWITANSI": log.no_kwitansi,
        "NAMA DONATUR": log.nama_donatur.toUpperCase(),
        "NOMINAL (Rp)": Number(log.nominal), // Pastikan format angka agar bisa di-SUM di Excel
        "KEPERLUAN": log.keperluan,
        "STATUS": "VERIFIED"
      }));

      // Membuat workbook dan worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Donasi");

      // Mengatur lebar kolom agar rapi (Ready to Use!)
      const wscols = [
        { wch: 5 },  // NO
        { wch: 20 }, // TANGGAL
        { wch: 25 }, // NO KWITANSI
        { wch: 35 }, // NAMA DONATUR
        { wch: 15 }, // NOMINAL
        { wch: 40 }, // KEPERLUAN
        { wch: 10 }  // STATUS
      ];
      worksheet["!cols"] = wscols;

      // Download file
      const fileName = `Laporan_Donasi_Paguyuban_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      showToast("LAPORAN EXCEL SIAP! 📊", "success");
    } catch (err) {
      console.error("Excel Export Error:", err);
      showToast("GAGAL EKSPOR EXCEL", "error");
    }
  };

  const executeDelete = async () => {
    try {
      const verifyRes = await fetch('/api/auth/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput }),
      });

      if (!verifyRes.ok) {
        showToast("PIN SALAH! ❌", "error");
        setPinInput("");
        return;
      }
    } catch (e) {
      showToast("GANGGUAN KEAMANAN", "error");
      return;
    }

    const id = confirmDeleteId;
    if (!id) return;

    setLoading(true);
    try {
      const res = await fetch('/api/receipts/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      if (res.ok) {
        showToast("DATA DIHAPUS! 🗑️", "success");
        setConfirmDeleteId(null);
        setPinInput("");
        fetchData();
      } else {
        showToast("GAGAL HAPUS", "error");
      }
    } catch (err) {
      showToast("GANGGUAN KONEKSI", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingLog) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/receipts/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: editingLog.id, 
          data: {
            nama_donatur: editingLog.nama_donatur,
            nominal: editingLog.nominal,
            keperluan: editingLog.keperluan,
            penyerah: editingLog.penyerah
          }
        }),
      });
      
      if (res.ok) {
        showToast("DATA DIUPDATE! ✨", "success");
        setEditingLog(null);
        fetchData();
      } else {
        showToast("GAGAL UPDATE", "error");
      }
    } catch (err) {
      showToast("GANGGUAN KONEKSI", "error");
    } finally {
      setLoading(false);
    }
  };

  const downloadReceiptImage = async (id: string, fileName: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      });
      
      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Error capturing receipt:", err);
    }
  };

  const handleShareWA = async (log: any) => {
    // 1. Siapkan data untuk capture
    setSharingLog(log);
    
    // 2. Tunggu sebentar biar render selesai
    setTimeout(async () => {
      const safeName = (log.nama_donatur || "DONATUR").replace(/[^a-z0-9]/gi, '_').toUpperCase();
      const fileName = `Kwitansi_${log.no_kwitansi.split('/')[0]}_${safeName}`;
      await downloadReceiptImage('rekap-share-capture', fileName);
      
      // 3. Buka WhatsApp
      const message = `Halo *${log.nama_donatur}*, ini adalah kwitansi resmi dari *Paguyuban Dharma Putra Mahesa* Desa Kalikebo.\n\n` +
        `No: ${log.no_kwitansi}\n` +
        `Nominal: ${formatCurrency(Number(log.nominal))}\n\n` +
        `Cek: https://kwitansi.neoma.space/verify/${log.unique_hash}\n\n` +
        `Terima kasih! 🙏`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
      
      // 4. Bersihkan
      setSharingLog(null);
    }, 600);
  };

  const filteredLogs = logs.filter(log => 
    (log.nama_donatur?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (log.no_kwitansi?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const handleLogout = () => {
    document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/login";
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50 relative">
      
      {/* 📸 HIDDEN CAPTURE CONTAINER */}
      {sharingLog && (
        <div className="fixed -left-[2000px] top-0">
          <div id="rekap-share-capture" className="bg-white">
            <ReceiptCard data={{
              ...sharingLog,
              tanggal: new Date(sharingLog.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
              bendahara: "DIDIK SUBIYANTO"
            }} />
          </div>
        </div>
      )}
      
      {/* ✏️ EDIT MODAL */}
      {editingLog && (
        // ... (existing edit modal code)
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white rounded-[32px] shadow-2xl max-w-md w-full p-8 border border-gray-100 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-start mb-6">
                 <div className="bg-brand-primary/10 p-3 rounded-2xl">
                    <Edit3 className="w-6 h-6 text-brand-primary" />
                 </div>
                 <button onClick={() => setEditingLog(null)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-5 h-5 text-gray-400" />
                 </button>
              </div>
              <h2 className="text-xl font-black text-brand-secondary mb-6 uppercase tracking-tight">Edit Data Donasi</h2>
              
              <div className="space-y-4 mb-8">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nama Donatur</label>
                    <input 
                      type="text" 
                      value={editingLog.nama_donatur}
                      onChange={(e) => setEditingLog({...editingLog, nama_donatur: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-primary font-bold"
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nominal</label>
                    <input 
                      type="number" 
                      value={editingLog.nominal}
                      onChange={(e) => setEditingLog({...editingLog, nominal: Number(e.target.value)})}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-primary font-black"
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Keperluan</label>
                    <input 
                      type="text" 
                      value={editingLog.keperluan}
                      onChange={(e) => setEditingLog({...editingLog, keperluan: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-primary font-bold"
                    />
                 </div>
              </div>

              <div className="flex gap-3">
                 <button onClick={() => setEditingLog(null)} className="flex-1 py-4 font-bold text-gray-400 uppercase text-xs">Batal</button>
                 <button onClick={handleUpdate} className="flex-2 bg-brand-secondary text-white py-4 px-6 rounded-2xl font-black uppercase text-xs shadow-lg">Simpan Perubahan</button>
              </div>
           </div>
        </div>
      )}

      {/* 🛡️ SECURITY MODAL (DELETE) */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white rounded-[32px] shadow-2xl max-w-sm w-full p-8 border-4 border-rose-500 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-start mb-6">
                 <div className="bg-rose-100 p-3 rounded-2xl">
                    <Trash2 className="w-6 h-6 text-rose-600" />
                 </div>
                 <button onClick={() => setConfirmDeleteId(null)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-5 h-5 text-gray-400" />
                 </button>
              </div>
              <h2 className="text-xl font-black text-brand-secondary mb-2 uppercase tracking-tight">Hapus Data?</h2>
              <p className="text-gray-500 text-sm mb-6">Masukkan PIN Admin untuk konfirmasi penghapusan permanen.</p>
              
              <input 
                type="password" 
                placeholder="PIN" 
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                className="w-full text-center text-3xl tracking-[1em] font-black py-4 bg-gray-100 rounded-2xl border-none focus:ring-2 focus:ring-rose-500 mb-6"
              />

              <div className="flex gap-3">
                 <button onClick={() => setConfirmDeleteId(null)} className="flex-1 py-4 font-bold text-gray-400 uppercase text-xs">Batal</button>
                 <button onClick={executeDelete} className="flex-2 bg-rose-600 text-white py-4 px-6 rounded-2xl font-black uppercase text-xs shadow-lg">Hapus</button>
              </div>
           </div>
        </div>
      )}

      {/* Toast */}
      {notification && (
        <div className={cn(
          "fixed top-6 left-1/2 -translate-x-1/2 z-[1001] px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4",
          notification.type === 'success' ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
        )}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-black text-xs uppercase tracking-widest">{notification.message}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-brand-secondary tracking-tighter">DATABASE REKAP</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mt-1">
               <ShieldAlert className="w-3 h-3 text-brand-primary" /> Admin Terminal
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
            >
              <Download className="w-4 h-4" /> Export Excel
            </button>
            <button onClick={fetchData} className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
               <RefreshCw className={cn("w-6 h-6 text-brand-primary", loading && "animate-spin")} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="bg-brand-primary p-8 rounded-[40px] shadow-lg border border-brand-primary/20">
              <p className="text-[10px] font-black uppercase text-brand-secondary/60 mb-1">Kas Masuk Terkumpul</p>
              <h2 className="text-5xl font-black text-brand-secondary">{formatCurrency(stats.total_amount)}</h2>
           </div>
           <div className="bg-white p-8 rounded-[40px] shadow-lg border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Total Data Entri</p>
                <h2 className="text-4xl font-black text-brand-secondary">{stats.total_count}</h2>
              </div>
              <div className="bg-brand-primary/10 p-4 rounded-full">
                 <ShieldAlert className="w-8 h-8 text-brand-primary" />
              </div>
           </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
            <div className="p-8 border-b bg-gray-50/50 flex flex-col lg:flex-row gap-6 justify-between items-center">
               <div className="relative w-full lg:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Cari donatur/nomor..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl border-none shadow-sm outline-none focus:ring-2 focus:ring-brand-primary text-sm font-medium"
                  />
               </div>

               <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100">
                     <Calendar className="w-4 h-4 text-gray-400" />
                     <input 
                       type="date" 
                       value={startDate}
                       onChange={(e) => setStartDate(e.target.value)}
                       className="border-none p-0 text-xs font-bold outline-none"
                     />
                     <span className="text-gray-300">-</span>
                     <input 
                       type="date" 
                       value={endDate}
                       onChange={(e) => setEndDate(e.target.value)}
                       className="border-none p-0 text-xs font-bold outline-none"
                     />
                  </div>
                  {(startDate || endDate) && (
                    <button 
                      onClick={() => { setStartDate(""); setEndDate(""); }}
                      className="p-3 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
               </div>
            </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 border-b tracking-widest">
                       <th className="px-8 py-6">Kwitansi</th>
                       <th className="px-8 py-6">Nama Donatur</th>
                       <th className="px-8 py-6 text-right">Nominal</th>
                       <th className="px-8 py-6 text-center">Aksi</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y text-sm">
                    {filteredLogs.map((log) => (
                       <tr key={log.id} className="hover:bg-gray-50/80 transition-all">
                          <td className="px-8 py-6 font-mono text-[10px] text-brand-primary font-bold">{log.no_kwitansi}</td>
                          <td className="px-8 py-6 font-black text-brand-secondary uppercase">{log.nama_donatur}</td>
                          <td className="px-8 py-6 text-right font-black text-brand-secondary text-lg">{formatCurrency(Number(log.nominal))}</td>
                          <td className="px-8 py-6">
                             <div className="flex items-center justify-center gap-1">
                                <button onClick={() => setEditingLog(log)} className="p-3 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-2xl transition-all">
                                   <Edit3 className="w-5 h-5" />
                                </button>
                                <Link href={`/verify/${log.unique_hash}`} className="p-3 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-2xl transition-all">
                                   <ExternalLink className="w-5 h-5" />
                                </Link>
                                <Link href={`/print/${log.unique_hash}`} target="_blank" className="p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-2xl transition-all">
                                   <Printer className="w-5 h-5" />
                                </Link>
                                <button onClick={() => handleShareWA(log)} className="p-3 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-2xl transition-all">
                                   <MessageSquare className="w-5 h-5" />
                                </button>
                                <button 
                                   onClick={() => setConfirmDeleteId(log.id)}
                                   className="p-3 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all cursor-pointer"
                                >
                                   <Trash2 className="w-5 h-5" />
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
              {filteredLogs.length === 0 && (
                 <div className="p-32 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse italic">Data Kosong.</div>
              )}
           </div>
        </div>
      </div>
    </main>
  );
}
