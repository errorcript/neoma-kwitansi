"use client";

import { useState, useEffect } from "react";
import { ReceiptCard } from "@/components/ReceiptCard";
import { Printer, Save, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [receipts, setReceipts] = useState([
    {
      no_kwitansi: "001/PAG-DPM/MOBSOS/05/2026",
      nama_donatur: "",
      nominal: 0,
      penyerah: "",
      keperluan: "Sumbangan Donatur Mobsos",
      tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      bendahara: "DIDIK SUBIYANTO",
      unique_hash: Math.random().toString(36).substring(7),
    },
  ]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.bendahara_name) {
          setReceipts(prev => prev.map(r => ({ ...r, bendahara: data.bendahara_name })));
        }
      } catch (err) {
        console.error("Gagal fetch settings", err);
      }
    };
    fetchSettings();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleSave = async () => {
    // Validasi dasar
    if (mode === 'single' && !receipts[0].nama_donatur) {
      showToast("Isi nama donatur dulu, bre! 🙏", "error");
      return;
    }
    
    if (mode === 'bulk' && (receipts.length === 0 || !receipts[0].nama_donatur)) {
      showToast("Data bulk kosong atau format salah! 🥺", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receipts }),
      });

      const result = await res.json();

      if (res.ok) {
        showToast(`Berhasil menyimpan ${receipts.length} kwitansi! ✅`, "success");
      } else {
        showToast(`Gagal simpan: ${result.error || 'Server error'}`, "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Terjadi kesalahan koneksi ke server.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-2 md:p-8 bg-gray-100 relative overflow-hidden">
      {/* Toast Notification */}
      {notification && (
        <div className={cn(
          "fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300",
          notification.type === 'success' ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
        )}>
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center font-bold">
            {notification.type === 'success' ? '✓' : '!'}
          </div>
          <span className="font-bold text-sm uppercase tracking-wider">{notification.message}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        
        {/* Input Form Section (No Print) */}
        <section className="no-print space-y-4">
          <div className="bg-white p-4 md:p-6 rounded-3xl shadow-lg border border-gray-200">
            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
              <button 
                onClick={() => setMode('single')}
                className={cn("flex-1 py-2 rounded-lg font-bold transition-all", mode === 'single' ? "bg-white text-brand-primary shadow-sm" : "text-gray-400")}
              >
                Single
              </button>
              <button 
                onClick={() => setMode('bulk')}
                className={cn("flex-1 py-2 rounded-lg font-bold transition-all", mode === 'bulk' ? "bg-white text-brand-primary shadow-sm" : "text-gray-400")}
              >
                Bulk (CSV)
              </button>
            </div>
            
            {mode === 'single' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nama Donatur</label>
                  <input 
                    type="text" 
                    className="block w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-brand-primary p-3 border text-brand-secondary font-bold"
                    placeholder="Contoh: Haji Lulung"
                    value={receipts[0].nama_donatur}
                    onChange={(e) => {
                      const newReceipts = [...receipts];
                      newReceipts[0].nama_donatur = e.target.value;
                      setReceipts(newReceipts);
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nominal (Rp)</label>
                    <input 
                      type="number" 
                      className="block w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-brand-primary p-3 border text-brand-secondary font-bold"
                      placeholder="100000"
                      value={receipts[0].nominal || ''}
                      onWheel={(e) => e.currentTarget.blur()}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                        const newReceipts = [...receipts];
                        newReceipts[0].nominal = val;
                        setReceipts(newReceipts);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Yang Menyerahkan</label>
                    <input 
                      type="text" 
                      className="block w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-brand-primary p-3 border text-brand-secondary font-bold"
                      placeholder="Nama Admin/Donatur"
                      value={receipts[0].penyerah}
                      onChange={(e) => {
                        const newReceipts = [...receipts];
                        newReceipts[0].penyerah = e.target.value;
                        setReceipts(newReceipts);
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-brand-secondary mb-4 flex items-center gap-2">
                  <Plus className="w-6 h-6 text-brand-primary" />
                  Bulk Input (Format: Nama, Nominal)
                </h2>
                <p className="text-xs text-gray-500 italic">Contoh:<br/>Budi, 150000<br/>Ani, 200000</p>
                <textarea 
                  rows={6}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary p-2 border text-brand-secondary font-mono text-sm"
                  placeholder="Paste list di sini..."
                  onChange={(e) => {
                    const lines = e.target.value.split('\n').filter(l => l.trim() !== '');
                    const newReceipts = lines.map((line, i) => {
                      const parts = line.split(',');
                      const nama = parts[0]?.trim() || "???";
                      const nominal = Number(parts[1]?.trim()) || 0;
                      return {
                        no_kwitansi: `00${i+1}/PAG-DPM/MOBSOS/05/2026`,
                        nama_donatur: nama,
                        nominal: nominal,
                        penyerah: "",
                        keperluan: receipts[0].keperluan,
                        tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                        bendahara: receipts[0].bendahara,
                        unique_hash: `bulk-${i}-${Date.now()}`,
                      };
                    });
                    if (newReceipts.length > 0) setReceipts(newReceipts);
                  }}
                />
              </div>
            )}

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Keperluan</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary p-2 border text-brand-secondary"
                  value={receipts[0].keperluan}
                  onChange={(e) => {
                    const newReceipts = receipts.map(r => ({ ...r, keperluan: e.target.value }));
                    setReceipts(newReceipts);
                  }}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={handlePrint}
                  className="flex-1 bg-brand-secondary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                >
                  <Printer className="w-5 h-5" />
                  Cetak {receipts.length} Kwitansi
                </button>
                <button 
                  onClick={handleSave}
                  disabled={loading || (mode === 'single' && receipts[0].nama_donatur === '')}
                  className="flex-1 bg-brand-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
                >
                  <Save className={cn("w-5 h-5", loading && "animate-spin")} />
                  {loading ? 'Menyimpan...' : 'Simpan Semua'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-brand-primary/10 p-4 rounded-xl border border-brand-primary/20">
            <p className="text-sm text-brand-secondary">
              <strong>Tip:</strong> Tekan <code>Ctrl + P</code> untuk mencetak. Pastikan setting kertas A4 dan "Background Graphics" dicentang di menu print.
            </p>
          </div>
        </section>

        {/* Preview Section */}
        <section className="print-container space-y-0">
          <h2 className="text-xl font-bold text-gray-400 mb-4 no-print">Preview (A4 Ready)</h2>
          <div className="flex flex-col gap-0 border shadow-2xl lg:shadow-none bg-white">
            {receipts.map((data, idx) => (
              <ReceiptCard key={data.unique_hash || idx} data={data} />
            ))}
            {/* Mock extra receipts to show A4 layout */}
            <div className="hidden lg:block no-print">
              <div className="h-[105mm] border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 italic">
                Slot Kwitansi Kosong (A4 Bagi 3)
              </div>
              <div className="h-[105mm] border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 italic">
                Slot Kwitansi Kosong (A4 Bagi 3)
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
