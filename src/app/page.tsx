"use client";

import { useState, useEffect, useCallback } from "react";
import { ReceiptCard } from "@/components/ReceiptCard";
import { 
  PlusCircle, Trash2, Printer, Download, Save, 
  CheckCircle2, AlertCircle, LogOut, LayoutDashboard, RefreshCw 
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

  // Generate default entry
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

  const addRow = () => {
    setReceipts([...receipts, createDefaultEntry()]);
  };

  const removeRow = (index: number) => {
    if (receipts.length > 1) {
      setReceipts(receipts.filter((_, i) => i !== index));
    }
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

  const handleSave = async () => {
    const invalid = receipts.some(r => !r.nama_donatur || r.nominal <= 0);
    if (invalid) {
      showToast("Lengkapi semua nama dan nominal donatur!", "error");
      return;
    }

    const sanitize = (str: string) => str.replace(/<[^>]*>?/gm, '').trim();

    const sanitizedReceipts = receipts.map(r => ({
      ...r,
      nama_donatur: sanitize(r.nama_donatur),
      keperluan: sanitize(r.keperluan),
      nominal: Math.max(0, Number(r.nominal))
    }));

    setLoading(true);
    try {
      const res = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receipts: sanitizedReceipts }),
      });

      const result = await res.json();
      if (res.ok) {
        showToast("SEMUA DATA BERHASIL DISIMPAN! 🚀", "success");
        // Update hash from server if any
        if (result.saved_ids) {
           // We keep the current view but mark as saved
        }
      } else {
        showToast(result.error || "Gagal simpan ke database", "error");
      }
    } catch (err) {
      showToast("Gangguan koneksi ke server", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50 flex flex-col items-center relative">
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

      {/* Admin Header */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-8 no-print">
        <Link href="/rekap" className="flex items-center gap-2 bg-white px-6 py-4 rounded-3xl shadow-sm border border-gray-100 font-black text-xs uppercase tracking-widest text-brand-secondary hover:shadow-md transition-all">
           <LayoutDashboard className="w-4 h-4 text-brand-primary" /> Buka Rekapitulasi
        </Link>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-rose-50 text-rose-600 px-6 py-4 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-rose-100 transition-all"
        >
           <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form Section */}
        <section className="space-y-6 no-print">
          <div className="bg-white p-8 rounded-[48px] shadow-xl border border-gray-100">
            <h1 className="text-3xl font-black text-brand-secondary tracking-tighter mb-2 uppercase">Input Donasi</h1>
            <p className="text-gray-400 text-sm font-medium mb-8">Masukkan data donatur untuk menerbitkan kwitansi resmi.</p>
            
            <div className="space-y-4">
              {receipts.map((r, idx) => (
                <div key={idx} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4 relative group">
                  <button 
                    onClick={() => removeRow(idx)}
                    className="absolute top-4 right-4 p-2 text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Nama Donatur</label>
                      <input 
                        type="text" 
                        value={r.nama_donatur}
                        onChange={(e) => updateRow(idx, 'nama_donatur', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary font-bold text-brand-secondary"
                        placeholder="Contoh: Bpk. Slamet"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Nominal Donasi</label>
                      <input 
                        type="number" 
                        value={r.nominal || ""}
                        onChange={(e) => updateRow(idx, 'nominal', Number(e.target.value))}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary font-black text-brand-secondary"
                        placeholder="Rp 0"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Tanda Tangan Penyerah</label>
                    <input 
                      type="text" 
                      value={r.penyerah}
                      onChange={(e) => updateRow(idx, 'penyerah', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary font-bold text-brand-secondary"
                      placeholder="Nama yang menyerahkan"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={addRow}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 py-4 rounded-3xl text-gray-400 font-bold hover:bg-gray-50 hover:border-brand-primary hover:text-brand-primary transition-all"
              >
                <PlusCircle className="w-5 h-5" /> Tambah Baris
              </button>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-brand-secondary text-white py-4 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Simpan Database
              </button>
            </div>
          </div>

          <div className="bg-brand-primary/10 p-8 rounded-[48px] border border-brand-primary/20">
             <div className="flex items-center gap-4 text-brand-secondary">
                <Printer className="w-8 h-8" />
                <div>
                   <h3 className="font-black text-lg leading-none uppercase">Cetak Kwitansi</h3>
                   <p className="text-sm font-medium opacity-70">Gunakan Ctrl + P untuk mencetak preview di samping.</p>
                </div>
             </div>
          </div>
        </section>

        {/* Preview Section */}
        <section className="print-container space-y-0 overflow-x-auto pb-12">
          <h2 className="text-xl font-bold text-gray-400 mb-4 no-print uppercase tracking-[0.2em] text-xs">Preview Dokumentasi</h2>
          <div className="flex flex-col gap-0 border border-gray-200 bg-white min-w-[210mm] lg:min-w-0 shadow-2xl lg:shadow-none">
            {receipts.map((data, idx) => (
              <ReceiptCard key={data.unique_hash || idx} data={data} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
