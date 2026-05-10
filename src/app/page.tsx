"use client";

import { useState, useEffect, useCallback } from "react";
import { ReceiptCard } from "@/components/ReceiptCard";
import { 
  PlusCircle, Trash2, Printer, Save, 
  CheckCircle2, AlertCircle, MessageSquare, RefreshCw 
} from "lucide-react";
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
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-6 md:py-10">
      {/* Toast Notification */}
      {notification && (
        <div className={cn(
          "fixed top-24 left-1/2 -translate-x-1/2 z-[1001] px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4",
          notification.type === 'success' ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
        )}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-black text-xs uppercase tracking-widest">{notification.message}</span>
        </div>
      )}

      <div className="w-full max-w-7xl px-4 md:px-10 grid grid-cols-1 xl:grid-cols-2 gap-10 items-start">
        
        {/* Form Entry */}
        <section className="space-y-6 no-print">
          <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100">
             <div className="flex items-center justify-between mb-8">
                <div>
                   <h2 className="text-3xl font-black text-brand-secondary uppercase tracking-tighter">Input Donasi</h2>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Data Entry Terminal</p>
                </div>
                <div className="bg-brand-primary/10 p-3 rounded-2xl">
                   <PlusCircle className="w-6 h-6 text-brand-primary" />
                </div>
             </div>
             
             <div className="space-y-6">
                {receipts.map((r, idx) => (
                  <div key={idx} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4 relative group hover:border-brand-primary/30 transition-all">
                    <button onClick={() => removeRow(idx)} className="absolute top-4 right-4 p-2 text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nama Donatur</label>
                        <input type="text" value={r.nama_donatur} onChange={(e) => updateRow(idx, 'nama_donatur', e.target.value)} className="w-full px-5 py-4 bg-white rounded-2xl border-2 border-gray-100 outline-none focus:border-brand-primary font-bold text-sm transition-all" placeholder="Contoh: Bpk. Slamet" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nominal (Rp)</label>
                        <input type="number" value={r.nominal || ""} onChange={(e) => updateRow(idx, 'nominal', Number(e.target.value))} className="w-full px-5 py-4 bg-white rounded-2xl border-2 border-gray-100 outline-none focus:border-brand-primary font-black text-sm transition-all" placeholder="0" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Untuk Pembayaran</label>
                        <input type="text" value={r.keperluan} onChange={(e) => updateRow(idx, 'keperluan', e.target.value)} className="w-full px-5 py-4 bg-white rounded-2xl border-2 border-gray-100 outline-none focus:border-brand-primary font-bold text-sm transition-all" placeholder="Sumbangan Mobsos" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Tanda Tangan Penyerah</label>
                        <input type="text" value={r.penyerah} onChange={(e) => updateRow(idx, 'penyerah', e.target.value)} className="w-full px-5 py-4 bg-white rounded-2xl border-2 border-gray-100 outline-none focus:border-brand-primary font-bold text-sm transition-all" placeholder="Nama Penyerah" />
                      </div>
                    </div>
                  </div>
                ))}
             </div>

             <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button onClick={addRow} className="flex-1 border-2 border-dashed border-gray-200 py-5 rounded-3xl text-gray-400 font-bold hover:border-brand-primary hover:text-brand-primary transition-all flex items-center justify-center gap-2">
                   <PlusCircle className="w-5 h-5" /> Tambah Baris
                </button>
                <button onClick={handleSave} disabled={loading} className="flex-[2] bg-brand-secondary text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-secondary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                   {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Simpan Database
                </button>
             </div>
          </div>

          <button 
            onClick={handlePrint}
            className="w-full bg-brand-primary text-brand-secondary p-8 rounded-[40px] flex items-center justify-center gap-6 hover:opacity-95 transition-all shadow-xl shadow-brand-primary/20 group"
          >
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Printer className="w-8 h-8" />
             </div>
             <div className="text-left">
                <p className="font-black text-2xl leading-none">CETAK SEMUA</p>
                <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-1">
                  Format A4 • Muat 3 kwitansi per lembar
                </p>
             </div>
          </button>
        </section>

        {/* Preview Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between no-print">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Preview Dokumentasi</h2>
            <div className="h-px flex-grow bg-gray-200 mx-4" />
          </div>
          
          <div className="print-container flex flex-col items-center gap-4 w-full">
            {receipts.map((data, idx) => (
              <div key={idx} className="relative w-full flex flex-col items-center group">
                {/* Visual Preview Container (Responsive Scale) */}
                <div className="w-full overflow-hidden bg-gray-100 rounded-[32px] p-6 border border-gray-200 shadow-inner no-print flex justify-center">
                   <div className="min-w-[210mm] flex justify-center">
                      <div className="transform scale-[0.4] sm:scale-[0.55] md:scale-[0.75] lg:scale-[0.65] xl:scale-[0.85] origin-top transition-transform">
                         <ReceiptCard data={data} />
                      </div>
                   </div>
                </div>

                {/* Print only view (Actual Size) */}
                <div className="hidden print:block w-[210mm]">
                   <ReceiptCard data={data} />
                </div>

                {/* WA Button Overlay */}
                <button 
                  onClick={() => handleShareWA(data)}
                  className="absolute bottom-10 right-10 no-print bg-emerald-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-2xl hover:bg-emerald-700 transition-all font-black text-xs uppercase tracking-widest"
                >
                   <MessageSquare className="w-4 h-4" /> Share WhatsApp
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
