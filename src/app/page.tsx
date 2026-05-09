"use client";

import { useState, useEffect } from "react";
import { ReceiptCard } from "@/components/ReceiptCard";
import { Printer, Save, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [loading, setLoading] = useState(false);
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

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.bendahara_name) {
        setReceipts(prev => prev.map(r => ({ ...r, bendahara: data.bendahara_name })));
      }
    };
    fetchSettings();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleSave = async () => {
    if (receipts[0].nama_donatur === '') {
      alert("Isi nama donatur dulu bre!");
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
        alert(`Berhasil menyimpan ${receipts.length} data ke database Vercel!`);
      } else {
        throw new Error(result.error || "Gagal simpan data");
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-10 bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 items-start">
        
        {/* Input Form Section (No Print) */}
        <aside className="no-print w-full lg:w-[380px] shrink-0 space-y-6">
          <div className="glass-card p-8 rounded-[2rem] shadow-2xl">
            <div className="flex bg-slate-100/50 p-1 rounded-xl mb-8">
              <button 
                onClick={() => setMode('single')}
                className={cn(
                  "flex-1 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all duration-300", 
                  mode === 'single' ? "bg-white text-brand-secondary shadow-lg scale-[1.02]" : "text-slate-400 hover:text-slate-600"
                )}
              >
                SINGLE
              </button>
              <button 
                onClick={() => setMode('bulk')}
                className={cn(
                  "flex-1 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all duration-300", 
                  mode === 'bulk' ? "bg-white text-brand-secondary shadow-lg scale-[1.02]" : "text-slate-400 hover:text-slate-600"
                )}
              >
                BULK
              </button>
            </div>
            
            {mode === 'single' ? (
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Nama Donatur</label>
                  <input 
                    type="text" 
                    className="input-modern"
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
                  <div className="group">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Nominal</label>
                    <input 
                      type="number" 
                      className="input-modern"
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
                  <div className="group">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Penyetor</label>
                    <input 
                      type="text" 
                      className="input-modern"
                      placeholder="Admin"
                      value={receipts[0].penyerah}
                      onChange={(e) => {
                        const newReceipts = [...receipts];
                        newReceipts[0].penyerah = e.target.value;
                        setReceipts(newReceipts);
                      }}
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Keperluan</label>
                  <input 
                    type="text" 
                    className="input-modern"
                    value={receipts[0].keperluan}
                    onChange={(e) => {
                      const newReceipts = [...receipts];
                      newReceipts[0].keperluan = e.target.value;
                      setReceipts(newReceipts);
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Bulk Data (Nama, Nominal)</label>
                <textarea 
                  className="input-modern min-h-[180px] font-mono text-[11px] leading-relaxed"
                  placeholder="Haji Lulung, 100000&#10;Bang Jago, 50000"
                  onChange={(e) => {
                    const lines = e.target.value.split('\n').filter(l => l.trim() !== '');
                    const newReceipts = lines.map((line, i) => {
                      const [nama, nominal] = line.split(',');
                      return {
                        no_kwitansi: `00${i+1}/PAG-DPM/MOBSOS/05/2026`,
                        nama_donatur: nama?.trim() || "???",
                        nominal: Number(nominal?.trim()) || 0,
                        penyerah: "",
                        keperluan: "Sumbangan Donatur Mobsos",
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

            <div className="grid grid-cols-2 gap-4 mt-8">
              <button 
                onClick={handlePrint}
                className="btn-premium flex items-center justify-center gap-2 bg-brand-secondary text-white py-4 rounded-2xl"
              >
                <Printer className="w-4 h-4 text-brand-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">Cetak</span>
              </button>
              <button 
                onClick={handleSave}
                disabled={loading}
                className={cn(
                  "btn-premium flex items-center justify-center gap-2 py-4 rounded-2xl",
                  loading ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-brand-primary text-brand-secondary"
                )}
              >
                <Save className={cn("w-4 h-4", loading ? "animate-pulse" : "")} />
                <span className="text-[10px] font-black uppercase tracking-widest">{loading ? '...' : 'Simpan'}</span>
              </button>
            </div>
          </div>

          <div className="p-6 bg-white/50 rounded-3xl border border-slate-100 no-print">
            <p className="text-[9px] text-slate-400 font-bold leading-relaxed uppercase tracking-wider">
              <strong className="text-brand-secondary">Tip:</strong> Gunakan Chrome untuk hasil cetak terbaik. Pastikan ukuran kertas A4.
            </p>
          </div>
        </aside>

        {/* Preview Section */}
        <div className="flex-1 w-full space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-brand-secondary tracking-tight uppercase">Live Preview</h2>
            <div className="bg-white/50 px-4 py-1 rounded-full border border-slate-100">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">A4 Scale: {(scale * 100).toFixed(0)}%</span>
            </div>
          </div>
          
          <div className="space-y-6">
            {receipts.map((receipt, idx) => (
              <ReceiptCard key={receipt.unique_hash || idx} data={receipt} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
