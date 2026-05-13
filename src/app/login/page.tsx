"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, ArrowRight, AlertCircle, Users, Wallet, RefreshCw } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total_count: 0, total_amount: 0, total_expense: 0, balance: 0 });
  const [expenseLogs, setExpenseLogs] = useState<any[]>([]);
  const [showExpenseDetails, setShowExpenseDetails] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/public/stats?t=${Date.now()}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.stats);
          setExpenseLogs(data.expense_logs || []);
        }
      });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError(true);
        setTimeout(() => setError(false), 2000);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        
        {/* Live Transparency Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
              <Users className="w-4 h-4 text-brand-primary mb-1" />
              <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest">Donatur</p>
              <h3 className="text-xs font-black text-brand-secondary">{stats.total_count}</h3>
           </div>
           <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
              <Wallet className="w-4 h-4 text-emerald-600 mb-1" />
              <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest">Dana Masuk</p>
              <h3 className="text-[10px] font-black text-brand-secondary">{formatCurrency(stats.total_amount)}</h3>
           </div>
           <button 
             onClick={() => setShowExpenseDetails(true)}
             className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:bg-rose-50 transition-all group"
           >
              <RefreshCw className="w-4 h-4 text-rose-500 mb-1 group-hover:rotate-180 transition-transform duration-500" />
              <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest">Uang Keluar</p>
              <h3 className="text-[10px] font-black text-rose-500">{formatCurrency(stats.total_expense)}</h3>
           </button>
           <div className="bg-slate-900 p-3 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center">
              <ShieldCheck className="w-4 h-4 text-brand-primary mb-1" />
              <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest">Sisa Saldo</p>
              <h3 className="text-[10px] font-black text-white">{formatCurrency(stats.balance)}</h3>
           </div>
        </div>

        {/* 📑 PUBLIC EXPENSE MODAL */}
        {showExpenseDetails && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <div className="bg-white rounded-[40px] shadow-2xl max-w-xl w-full p-8 border border-gray-100 animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
                <div className="flex justify-between items-start mb-6">
                   <div>
                      <h2 className="text-2xl font-black text-brand-secondary uppercase tracking-tight">Rincian Pengeluaran</h2>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Transparansi Dana Paguyuban</p>
                   </div>
                   <button onClick={() => setShowExpenseDetails(false)} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-all">
                      <RefreshCw className="w-5 h-5 text-gray-500" />
                   </button>
                </div>

                <div className="flex-grow overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                   {expenseLogs.map((log, idx) => (
                     <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center group hover:border-rose-200 transition-all">
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-gray-400 uppercase">{new Date(log.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} • {log.kategori}</p>
                           <h4 className="font-black text-brand-secondary uppercase text-sm">{log.item_pengeluaran}</h4>
                        </div>
                        <p className="text-lg font-black text-rose-500">- {formatCurrency(Number(log.nominal))}</p>
                     </div>
                   ))}
                   {expenseLogs.length === 0 && (
                     <div className="py-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto opacity-20">
                           <RefreshCw className="w-8 h-8" />
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">Belum ada rincian pengeluaran.</p>
                     </div>
                   )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                   <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl">
                      <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest">Total Pengeluaran</p>
                      <p className="text-xl font-black text-brand-primary">{formatCurrency(stats.total_expense)}</p>
                   </div>
                   <button onClick={() => setShowExpenseDetails(false)} className="px-8 py-3 bg-brand-secondary text-white rounded-2xl font-black uppercase text-xs">Tutup</button>
                </div>
             </div>
          </div>
        )}

        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
          {/* Header Branding */}
          <div className="bg-brand-primary p-10 text-center relative overflow-hidden">
             {/* Pattern Decor */}
             <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12" />
             </div>
             
             <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center shadow-lg mb-6 relative z-10">
                <img src="/logo-paguyuban.png" alt="Logo" className="w-14 h-14 object-contain" />
             </div>
             <h1 className="text-2xl font-black text-brand-secondary leading-tight relative z-10 uppercase tracking-tighter">
                Dharma Putra Mahesa
             </h1>
             <p className="text-brand-secondary/60 text-[10px] font-bold uppercase tracking-widest mt-1 relative z-10">
                Sistem Kwitansi Digital
             </p>
          </div>

          {/* Login Form */}
          <div className="p-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Password Akses Admin</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                    className={cn(
                      "w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-brand-secondary font-bold outline-none focus:border-brand-primary focus:bg-white transition-all",
                      error && "border-rose-500 bg-rose-50 animate-shake"
                    )}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-rose-600 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>Password salah! Silakan coba lagi.</span>
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-brand-secondary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-secondary/90 transition-all shadow-lg shadow-brand-secondary/20 uppercase text-xs tracking-widest disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : (
                  <>Masuk Dashboard <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <div className="mt-10 pt-6 border-t border-gray-50 text-center">
              <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">
                Developed by Neoma Space &copy; 2026
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </main>
  );
}
