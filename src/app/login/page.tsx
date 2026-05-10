"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, ArrowRight, AlertCircle, Users, Wallet } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [stats, setStats] = useState({ total_count: 0, total_amount: 0 });
  const router = useRouter();

  useEffect(() => {
    fetch('/api/public/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) setStats(data.stats);
      });
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "alfana123") {
      document.cookie = "admin_auth=true; path=/; max-age=86400"; // 24 hours
      router.push("/");
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        
        {/* Live Transparency Stats */}
        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center mb-2">
                 <Users className="w-5 h-5 text-brand-primary" />
              </div>
              <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Donatur</p>
              <h3 className="text-xl font-black text-brand-secondary">{stats.total_count} Orang</h3>
           </div>
           <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mb-2">
                 <Wallet className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Total Dana</p>
              <h3 className="text-xl font-black text-brand-secondary">{formatCurrency(stats.total_amount)}</h3>
           </div>
        </div>

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
                className="w-full bg-brand-secondary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-secondary/90 transition-all shadow-lg shadow-brand-secondary/20 uppercase text-xs tracking-widest"
              >
                Masuk Dashboard <ArrowRight className="w-4 h-4" />
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
