"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Updated password to match user request
    if (password === "alfana123") {
      // Set a simple cookie (not secure but works for this level of req)
      document.cookie = "admin_auth=true; path=/; max-age=86400"; // 24 hours
      router.push("/");
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-brand-secondary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-primary rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-[48px] p-10 shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-brand-primary rounded-3xl flex items-center justify-center shadow-lg shadow-brand-primary/20 mb-6">
            <ShieldCheck className="w-10 h-10 text-brand-secondary" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter text-center">ADMIN PORTAL</h1>
          <p className="text-white/50 text-xs font-bold uppercase tracking-[0.2em] mt-2">Paguyuban Dharma Putra Mahesa</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input 
              type="password" 
              placeholder="Password Akses" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "w-full bg-white/10 border border-white/20 rounded-3xl py-5 pl-14 pr-6 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-brand-primary transition-all font-bold",
                error && "border-rose-500 ring-2 ring-rose-500 animate-shake"
              )}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-brand-primary text-brand-secondary font-black py-5 rounded-3xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-brand-primary/20"
          >
            MASUK SISTEM <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="text-center text-white/30 text-[10px] font-bold uppercase tracking-widest mt-10">
          Sistem Keamanan Neoma v2.0
        </p>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </main>
  );
}
