"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/");
      } else {
        setError("Password salah bre!");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#f8fafc] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-primary/5 rounded-full -ml-48 -mt-48 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-secondary/5 rounded-full -mr-48 -mb-48 blur-3xl"></div>

      <div className="w-full max-w-[400px] space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-[2rem] shadow-2xl border border-slate-100 mb-2 group transition-transform hover:scale-110">
            <img src="/logo-paguyuban.png" alt="Logo" className="w-12 h-12 object-contain" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-brand-secondary tracking-tighter uppercase leading-none">NEOMA</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">Official Kwitansi System</p>
          </div>
        </div>

        <div className="glass-card p-10 rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border border-white/50">
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1 ml-1">
                <Lock className="w-3.5 h-3.5 text-brand-primary" />
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Password</label>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className={cn(
                  "input-modern !rounded-2xl text-center font-mono tracking-widest !py-4",
                  error ? "border-rose-500 bg-rose-50/50" : ""
                )}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <p className="text-[10px] text-rose-500 font-black text-center uppercase tracking-widest mt-2 animate-bounce">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-premium w-full bg-brand-secondary text-white py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-[0.3em] shadow-xl group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Masuk Sekarang
                  <ArrowRight className="w-4 h-4 text-brand-primary transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="flex flex-col items-center gap-4 pt-4">
           <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full border border-slate-100 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Secured by Neoma Cloud</span>
           </div>
           <p className="text-[10px] font-bold text-slate-300">© 2026 Paguyuban Dharma Putra Mahesa</p>
        </div>
      </div>
    </main>
  );
}
