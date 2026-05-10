"use client";

import { useState, useEffect, useCallback } from "react";
import { ReceiptCard } from "@/components/ReceiptCard";
import { 
  PlusCircle, Trash2, Printer, LayoutDashboard, Save, 
  CheckCircle2, AlertCircle, LogOut, MessageSquare 
} from "lucide-react";
import Link from "next/link";
import { formatCurrency, cn } from "@/lib/utils";

interface ReceiptEntry {
  no_kwitansi: string;
  nama_donatur: string;
  nominal: number;
  keperluan: string;
  penyerah: string;
  tanggal: string;
  bendahara: string;
  unique_hash: string;
}

export default function Home() {
  const [receipts, setReceipts] = useState<ReceiptEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const createDefaultEntry = useCallback(() => ({
    no_kwitansi: `${Date.now()}/PAG-DPM/MOBSOS/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
    nama_donatur: "",
    nominal: 0,
    keperluan: "Sumbangan Donatur Mobsos",
    penyerah: "",
    tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    bendahara: "DIDIK SUBIYANTO",
    unique_hash: Math.random().toString(36).substring(2, 11)
  }), []);

  useEffect(() => {
    setReceipts([createDefaultEntry()]);
  }, [createDefaultEntry]);

  const addRow = () => setReceipts([...receipts, createDefaultEntry()]);
  const removeRow = (index: number) => {
    if (receipts.length > 1) setReceipts(receipts.filter((_, i) => i !== index));
  };
  const updateRow = (index: number, field: keyof ReceiptEntry, value: any) => {
    const updated = [...receipts];
    updated[index] = { ...updated[index], [field]: value };
    setReceipts(updated);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = () => {
    document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/login";
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWA = (data: ReceiptEntry) => {
    const message = `Halo *${data.nama_donatur}*, ini adalah kwitansi resmi dari *Paguyuban Dharma Putra Mahesa* Desa Kalikebo.\n\n` +
      `No: ${data.no_kwitansi}\n` +
      `Nominal: Rp ${data.nominal.toLocaleString('id-ID')}\n` +
      `Keperluan: ${data.keperluan}\n` +
      `Tanggal: ${data.tanggal}\n\n` +
      `Cek validitas di sini: https://kwitansi.neoma.space/verify/${data.unique_hash}\n\n` +
      `Terima kasih atas partisipasinya! 🙏`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSave = async () => {
    const invalid = receipts.some(r => !r.nama_donatur || r.nominal <= 0);
    if (invalid) {
      showToast("Lengkapi nama dan nominal donatur!", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receipts }),
      });
      if (res.ok) {
        showToast("DATA BERHASIL DISIMPAN KE DATABASE! ✅", "success");
      } else {
        showToast("Gagal simpan data", "error");
      }
    } catch (err) {
      showToast("Kesalahan koneksi", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Toast Notification */}
      {notification && (
        <div className={cn(
          "fixed top-6 left-1/2 -translate-x-1/2 z-[1001] px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4",
          notification.type === 'success' ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
        )}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-black text-xs uppercase tracking-widest">{notification.message}</span>
        </div>
      )}

      {/* 🚀 SINGLE CLEAN HEADER */}
      <header className="w-full bg-brand-secondary text-white p-6 no-print">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center">
                <img src="/logo-paguyuban.png" alt="Logo" className="w-7 h-7 object-contain" />
             </div>
             <h1 className="font-black text-xl tracking-tighter">NEOMA KWITANSI</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/rekap" className="flex items-center gap-2 hover:text-brand-primary transition-all font-bold text-sm">
               <LayoutDashboard className="w-4 h-4" /> Rekapitulasi
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all font-bold text-sm text-rose-300">
               <LogOut className="w-4 h-4" /> Keluar
            </button>
          </div>
        </div>
      </header>

      <div className="w-full max-w-7xl p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        {/* Form Entry */}
        <section className="space-y-6 no-print">
          <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100">
             <h2 className="text-2xl font-black text-brand-secondary mb-6 uppercase tracking-tighter">Input Donasi</h2>
             
             <div className="space-y-6">
                {receipts.map((r, idx) => (
                  <div key={idx} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4 relative group">
                    <button onClick={() => removeRow(idx)} className="absolute top-4 right-4 p-2 text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Nama Donatur</label>
                        <input type="text" value={r.nama_donatur} onChange={(e) => updateRow(idx, 'nama_donatur', e.target.value)} className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-brand-primary font-bold text-sm" placeholder="Contoh: Bpk. Slamet" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Nominal (Rp)</label>
                        <input type="number" value={r.nominal || ""} onChange={(e) => updateRow(idx, 'nominal', Number(e.target.value))} className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-brand-primary font-black text-sm" placeholder="0" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Untuk Pembayaran</label>
                        <input type="text" value={r.keperluan} onChange={(e) => updateRow(idx, 'keperluan', e.target.value)} className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-brand-primary font-bold text-sm" placeholder="Sumbangan Mobsos" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Penyerah</label>
                        <input type="text" value={r.penyerah} onChange={(e) => updateRow(idx, 'penyerah', e.target.value)} className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-brand-primary font-bold text-sm" placeholder="Nama Penyerah" />
                      </div>
                    </div>
                  </div>
                ))}
             </div>

             <div className="mt-8 flex gap-4">
                <button onClick={addRow} className="flex-1 border-2 border-dashed border-gray-200 py-4 rounded-3xl text-gray-400 font-bold hover:border-brand-primary hover:text-brand-primary transition-all">
                   <PlusCircle className="w-5 h-5 mx-auto" />
                </button>
                <button onClick={handleSave} disabled={loading} className="flex-[2] bg-brand-secondary text-white py-4 rounded-3xl font-black uppercase tracking-widest text-xs shadow-lg hover:opacity-90 disabled:opacity-50 transition-all">
                   {loading ? "Menyimpan..." : "Simpan Ke Database"}
                </button>
             </div>
          </div>

          <button 
            onClick={handlePrint}
            className="w-full bg-brand-primary text-brand-secondary p-8 rounded-[40px] flex items-center justify-center gap-4 hover:opacity-90 transition-all shadow-xl shadow-brand-primary/20"
          >
             <Printer className="w-8 h-8" />
             <div className="text-left">
                <p className="font-black text-xl leading-none">CETAK SEMUA</p>
                <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mt-1">Klik untuk memunculkan dialog print</p>
             </div>
          </button>
        </section>

        {/* Preview Section */}
        <section className="space-y-4">
          <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] no-print">Preview Dokumentasi</h2>
          <div className="print-container flex flex-col gap-2 overflow-hidden lg:overflow-visible">
            {receipts.map((data, idx) => (
              <div key={idx} className="relative group">
                <div className="transform scale-[0.6] sm:scale-[0.8] lg:scale-100 origin-top-left transition-transform duration-300">
                  <ReceiptCard data={data} />
                </div>
                {/* WA Button Overlay for each receipt */}
                <button 
                  onClick={() => handleShareWA(data)}
                  className="absolute bottom-4 right-4 no-print bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg hover:bg-emerald-700 transition-all font-bold text-xs"
                >
                   <MessageSquare className="w-4 h-4" /> Share WA
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
