"use client";

import { useState, useEffect, useCallback } from "react";
import html2canvas from "html2canvas";
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
  const [bendaharaName, setBendaharaName] = useState("DIDIK SUBIYANTO");
  const [bendaharaSignature, setBendaharaSignature] = useState("");
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [donatorSuggestions, setDonatorSuggestions] = useState<string[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [pendingSync, setPendingSync] = useState<number>(0);

  const fetchNextNumber = useCallback(async () => {
    try {
      const res = await fetch('/api/receipts/next-number');
      const data = await res.json();
      if (data.success) return { number: data.next_number, bendahara: data.bendahara, signature: data.signature };
    } catch (e) {
      return { 
        number: `${Date.now()}/PAG-DPM/MOBSOS/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
        bendahara: "DIDIK SUBIYANTO",
        signature: ""
      };
    }
  }, []);

  const createDefaultEntry = useCallback((nextNo?: string, bendahara?: string, signature?: string) => ({
    no_kwitansi: nextNo || "LOADING...",
    nama_donatur: "",
    nominal: 0,
    keperluan: "Sumbangan Donatur Mobsos",
    penyerah: "",
    tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    bendahara: bendahara || "DIDIK SUBIYANTO",
    unique_hash: Math.random().toString(36).substring(2, 11),
    signature: signature || ""
  }), []);

  useEffect(() => {
    const init = async () => {
      // Check offline status
      setIsOffline(!navigator.onLine);
      window.addEventListener('online', () => setIsOffline(false));
      window.addEventListener('offline', () => setIsOffline(true));

      const data = await fetchNextNumber();
      if (data) {
        setBendaharaName(data.bendahara);
        setBendaharaSignature(data.signature || "");
        setReceipts([createDefaultEntry(data.number, data.bendahara, data.signature)]);
      }

      // Fetch donator suggestions
      try {
        const res = await fetch('/api/receipts/donators');
        const dData = await res.json();
        if (dData.success) setDonatorSuggestions(dData.donators);
      } catch (e) {}

      // Check local storage for pending sync
      const saved = localStorage.getItem('pending_receipts');
      if (saved) {
        const parsed = JSON.parse(saved);
        setPendingSync(parsed.length);
      }
    };
    init();
  }, [createDefaultEntry, fetchNextNumber]);

  const addRow = async () => {
    const data = await fetchNextNumber();
    if (data) {
      setReceipts([...receipts, createDefaultEntry(data.number, data.bendahara, data.signature)]);
    }
  };
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
    const originalTitle = document.title;
    document.title = `Laporan_Kwitansi_Massal_${new Date().toISOString().split('T')[0]}`;
    window.print();
    setTimeout(() => { document.title = originalTitle; }, 1000);
  };

  const downloadReceiptImage = async (id: string, fileName: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    
    // Simpan posisi scroll
    const scrollY = window.scrollY;
    window.scrollTo(0, 0);

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        allowTaint: true,
        onclone: (clonedDoc) => {
          const styles = clonedDoc.getElementsByTagName('style');
          for (let i = 0; i < styles.length; i++) {
            if (styles[i].innerHTML.includes('oklch(') || styles[i].innerHTML.includes('lab(')) {
              styles[i].remove();
            }
          }
        }
      });
      
      await new Promise<void>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `${fileName}.png`;
            link.href = url;
            link.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
          }
          resolve();
        }, 'image/png');
      });
    } catch (err) {
      console.error("Error capturing receipt:", err);
    } finally {
      // Kembalikan posisi scroll
      window.scrollTo(0, scrollY);
    }
  };

  const handleShareWA = async (data: ReceiptEntry, index: number) => {
    // 1. Download image otomatis
    const safeName = data.nama_donatur.replace(/[^a-z0-9]/gi, '_').toUpperCase();
    const fileName = `Kwitansi_${data.no_kwitansi.split('/')[0]}_${safeName}`;
    await downloadReceiptImage(`receipt-preview-${index}`, fileName);

    // 2. Buka WhatsApp
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

    if (isOffline) {
      // Save to local storage if offline
      const existing = JSON.parse(localStorage.getItem('pending_receipts') || '[]');
      const updated = [...existing, ...receipts];
      localStorage.setItem('pending_receipts', JSON.stringify(updated));
      setPendingSync(updated.length);
      showToast("OFFLINE: DATA DISIMPAN LOKAL 💾", "success");
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
        showToast("DATA BERHASIL DISIMPAN! ✅", "success");
        // Update suggestions locally
        const newNames = receipts.map(r => r.nama_donatur);
        setDonatorSuggestions(prev => Array.from(new Set([...prev, ...newNames])));
      } else {
        showToast("Gagal simpan data", "error");
      }
    } catch (err) {
      showToast("Kesalahan koneksi", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (isOffline) {
      showToast("MASIH OFFLINE, GAK BISA SYNC", "error");
      return;
    }

    const saved = localStorage.getItem('pending_receipts');
    if (!saved) return;

    setLoading(true);
    try {
      const pendingData = JSON.parse(saved);
      const res = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receipts: pendingData }),
      });
      
      if (res.ok) {
        showToast(`${pendingData.length} DATA BERHASIL DISINKRON! 🔄`, "success");
        localStorage.removeItem('pending_receipts');
        setPendingSync(0);
      } else {
        showToast("Gagal sinkronisasi data", "error");
      }
    } catch (e) {
      showToast("Gangguan koneksi saat sync", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center" style={{ backgroundColor: '#f9fafb' }}>
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

      {/* 🟢 REVISED GRID LAYOUT */}
      <div className="w-full max-w-[1600px] px-4 md:px-10 py-10 grid grid-cols-1 xl:grid-cols-[450px_1fr] gap-10 items-start">
        
        {/* LEFT: Form Entry (Fixed Width on Desktop) */}
        <section className="space-y-6 no-print">
          <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-brand-secondary uppercase tracking-tighter">Input Donasi</h2>
                <div className="bg-brand-primary/10 p-3 rounded-2xl">
                   <PlusCircle className="w-6 h-6 text-brand-primary" />
                </div>
             </div>
             
             <div className="space-y-6">
                {receipts.map((r, idx) => (
                  <div key={idx} className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 space-y-4 relative group hover:border-brand-primary/30 transition-all">
                    {receipts.length > 1 && (
                      <button onClick={() => removeRow(idx)} className="absolute top-4 right-4 p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Nama Donatur</label>
                        <input 
                          id="tour-input-form" 
                          type="text" 
                          list="donator-list"
                          value={r.nama_donatur} 
                          onChange={(e) => updateRow(idx, 'nama_donatur', e.target.value)} 
                          className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-brand-primary font-bold text-sm" 
                          placeholder="Contoh: Bpk. Slamet" 
                        />
                        <datalist id="donator-list">
                          {donatorSuggestions.map((name, i) => (
                            <option key={i} value={name} />
                          ))}
                        </datalist>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Nominal Donasi</label>
                        <input 
                          type="text" 
                          value={r.nominal ? Number(r.nominal).toLocaleString('id-ID') : ""} 
                          onChange={(e) => {
                            const val = e.target.value.replace(/\./g, "");
                            if (!isNaN(Number(val))) {
                              updateRow(idx, 'nominal', Number(val));
                            }
                          }} 
                          className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-brand-primary font-black text-sm" 
                          placeholder="Rp 0" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Untuk Pembayaran</label>
                        <input type="text" value={r.keperluan} onChange={(e) => updateRow(idx, 'keperluan', e.target.value)} className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-brand-primary font-bold text-sm" placeholder="Sumbangan Mobsos" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Penyerah</label>
                        <input type="text" value={r.penyerah} onChange={(e) => updateRow(idx, 'penyerah', e.target.value)} className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-brand-primary font-bold text-sm" placeholder="Nama yang menyerahkan" />
                      </div>
                    </div>
                  </div>
                ))}
             </div>

             <div className="mt-8 flex flex-col gap-3">
                <button id="tour-add-row" onClick={addRow} className="w-full border-2 border-dashed border-gray-200 py-4 rounded-3xl text-gray-400 font-bold hover:border-brand-primary hover:text-brand-primary transition-all">
                   <PlusCircle className="w-5 h-5 mx-auto" />
                </button>
                <button id="tour-save-db" onClick={handleSave} disabled={loading} className={cn(
                  "w-full py-4 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl transition-all flex items-center justify-center gap-2",
                  isOffline ? "bg-amber-500 text-white" : "bg-brand-secondary text-white",
                  loading && "opacity-50 cursor-not-allowed"
                )}>
                   {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} 
                   {isOffline ? "Simpan Lokal (Offline)" : "Simpan Database"}
                </button>

                {pendingSync > 0 && !isOffline && (
                  <button onClick={handleSync} className="w-full bg-emerald-600 text-white py-4 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl animate-pulse flex items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5" /> Sinkron {pendingSync} Data Tertunda
                  </button>
                )}
             </div>
          </div>

          <button 
            onClick={handlePrint} id="tour-print-all"
            className="w-full bg-brand-primary text-brand-secondary p-8 rounded-[40px] flex items-center justify-center gap-4 hover:opacity-95 transition-all shadow-xl shadow-brand-primary/20"
          >
             <Printer className="w-8 h-8" />
             <div className="text-left">
                <p className="font-black text-xl leading-none uppercase">Cetak Semua</p>
                <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-1">A4 • Muat 3 Kwitansi / Lembar</p>
             </div>
          </button>
        </section>

        {/* RIGHT: Preview Documentation (Responsive Container) */}
        <section className="space-y-6 overflow-hidden">
          <div className="flex items-center justify-between no-print">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Live Documentation Preview</h2>
            <div className="h-px flex-grow bg-gray-200 mx-4" />
          </div>
          
          <div className="print-container flex flex-col items-center gap-6 w-full">
            {receipts.map((data, idx) => (
              <div key={idx} className="relative w-full flex flex-col items-center group">
                
                {/* 📸 HIDDEN CAPTURE CONTAINER (For Share WA) */}
                <div className="fixed -left-[2000px] top-0 no-print">
                   <div id={`receipt-capture-${idx}`} className="bg-white">
                      <ReceiptCard data={data} />
                   </div>
                </div>

                {/* 🛡️ STABLE PREVIEW BOX */}
                <div className="w-full bg-white rounded-[40px] border border-gray-100 shadow-2xl p-4 sm:p-6 no-print overflow-hidden">
                   <div className="w-full flex justify-center py-4">
                      <div className="shadow-2xl hover:scale-[1.02] transition-transform duration-500 scale-[0.35] sm:scale-[0.5] md:scale-[0.7] lg:scale-[0.6] xl:scale-[0.8] 2xl:scale-90 origin-top">
                         <ReceiptCard data={data} />
                      </div>
                   </div>
                </div>

                {/* Print View (Absolute Size) */}
                <div className="hidden print:block w-[210mm]">
                   <ReceiptCard data={data} />
                </div>

                {/* WA Button Overlay */}
                <button 
                  onClick={async () => {
                    const safeName = data.nama_donatur.replace(/[^a-z0-9]/gi, '_').toUpperCase();
                    const fileName = `Kwitansi_${data.no_kwitansi.split('/')[0]}_${safeName}`;
                    await downloadReceiptImage(`receipt-capture-${idx}`, fileName);
                    
                    const message = `Halo *${data.nama_donatur}*, ini adalah kwitansi resmi dari *Paguyuban Dharma Putra Mahesa* Desa Kalikebo.\n\n` +
                      `No: ${data.no_kwitansi}\n` +
                      `Nominal: Rp ${data.nominal.toLocaleString('id-ID')}\n` +
                      `Keperluan: ${data.keperluan}\n` +
                      `Tanggal: ${data.tanggal}\n\n` +
                      `Cek validitas di sini: https://kwitansi.neoma.space/verify/${data.unique_hash}\n\n` +
                      `Terima kasih atas partisipasinya! 🙏`;
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                  className="absolute bottom-10 right-10 no-print bg-emerald-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-2xl hover:bg-emerald-700 transition-all font-black text-xs uppercase tracking-widest tour-share-wa"
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
