"use client";

import { useState, useEffect } from "react";
import { ReceiptCard } from "@/components/ReceiptCard";
import { Printer, Save, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { db } from "@/lib/db";

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
      await db.saveReceipts(receipts);
      alert(`Berhasil menyimpan ${receipts.length} data ke database Vercel!`);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-2 md:p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Input Form Section (No Print) */}
        <section className="no-print lg:col-span-4 space-y-4">
          <div className="glass-card p-6 md:p-8 rounded-[2.5rem] sticky top-24">
            <div className="flex bg-slate-100/50 p-1.5 rounded-2xl mb-8">
              <button 
                onClick={() => setMode('single')}
                className={cn(
                  "flex-1 py-3 rounded-xl font-black text-sm transition-all duration-500", 
                  mode === 'single' ? "bg-white text-brand-secondary shadow-xl scale-[1.02]" : "text-slate-400 hover:text-slate-600"
                )}
              >
                SINGLE
              </button>
              <button 
                onClick={() => setMode('bulk')}
                className={cn(
                  "flex-1 py-3 rounded-xl font-black text-sm transition-all duration-500", 
                  mode === 'bulk' ? "bg-white text-brand-secondary shadow-xl scale-[1.02]" : "text-slate-400 hover:text-slate-600"
                )}
              >
                BULK (CSV)
              </button>
            </div>
            
            {mode === 'single' ? (
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-brand-primary transition-colors">Nama Donatur</label>
                  <input 
                    type="text" 
                    className="input-modern"
                    placeholder="Contoh: Haji Lulung"
                    onChange={(e) => {
                      const newReceipts = [...receipts];
                      newReceipts[0].nama_donatur = e.target.value;
                      setReceipts(newReceipts);
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-brand-primary transition-colors">Nominal (Rp)</label>
                    <input 
                      type="number" 
                      className="input-modern"
                      placeholder="100000"
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
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-brand-primary transition-colors">Penyerah</label>
                    <input 
                      type="text" 
                      className="input-modern"
                      placeholder="Admin"
                      onChange={(e) => {
                        const newReceipts = [...receipts];
                        newReceipts[0].penyerah = e.target.value;
                        setReceipts(newReceipts);
                      }}
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-brand-primary transition-colors">Keperluan</label>
                  <input 
                    type="text" 
                    className="input-modern"
                    defaultValue={receipts[0].keperluan}
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
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Data Donatur (Nama, Nominal)</label>
                <textarea 
                  className="input-modern min-h-[200px] font-mono text-xs"
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

            <div className="grid grid-cols-2 gap-4 mt-10">
              <button 
                onClick={handlePrint}
                className="btn-premium flex flex-col items-center justify-center gap-2 bg-brand-secondary text-white p-4 rounded-3xl"
              >
                <Printer className="w-6 h-6 text-brand-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">Cetak</span>
              </button>
              <button 
                onClick={handleSave}
                disabled={loading}
                className={cn(
                  "btn-premium flex flex-col items-center justify-center gap-2 p-4 rounded-3xl",
                  loading ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-brand-primary text-brand-secondary"
                )}
              >
                <Save className={cn("w-6 h-6", loading ? "animate-pulse" : "")} />
                <span className="text-[10px] font-black uppercase tracking-widest">Simpan</span>
              </button>
            </div>
          </div>
        </section>

        {/* Preview Section */}
        <section className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-xl font-black text-brand-secondary flex items-center gap-3">
              <div className="w-2 h-8 bg-brand-primary rounded-full"></div>
              PREVIEW KWITANSI
            </h2>
            <div className="px-4 py-1.5 bg-brand-primary/10 rounded-full border border-brand-primary/20">
              <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">A4 Paper Ready</span>
            </div>
          </div>
          
          <div className="space-y-8 pb-20">
            {receipts.map((receipt, idx) => (
              <div key={idx} className="flex justify-center hover:scale-[1.01] transition-transform duration-500">
                <div className="shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-sm overflow-hidden">
                  <ReceiptCard data={receipt} />
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
