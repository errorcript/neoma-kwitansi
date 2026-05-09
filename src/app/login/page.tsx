"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kirim password ke API login
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      window.location.href = "/";
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-brand-secondary flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img src="/logo-paguyuban.png" alt="Logo" className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-white tracking-tighter">ADMIN LOGIN</h1>
          <p className="text-gray-400 mt-2">Sistem Kwitansi Neoma Creative Hub</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "w-full bg-white/10 border-2 border-white/10 rounded-2xl p-4 pl-12 text-white font-bold focus:border-brand-primary transition-all outline-none",
                error && "border-red-500 animate-shake"
              )}
              placeholder="Masukkan Password Admin..."
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-brand-primary text-brand-secondary py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-primary/20"
          >
            MASUK SISTEM
            <ArrowRight className="w-6 h-6" />
          </button>
        </form>

        <div className="flex flex-col gap-4 text-center">
          <Link 
            href="/transparansi" 
            className="text-white/50 hover:text-brand-primary transition-all font-bold text-sm underline decoration-brand-primary/30"
          >
            Lihat Laporan Transparansi Publik
          </Link>
          <p className="text-xs text-gray-500">
            Lupa password? Hubungi tim IT Neoma Creative Hub.
          </p>
        </div>
      </div>
    </div>
  );
}
