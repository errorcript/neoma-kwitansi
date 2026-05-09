import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Settings, User, Shield, Save, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const bendaharaName = await db.getSetting("bendahara_name") || "DIDIK SUBIYANTO";

  async function updateBendahara(formData: FormData) {
    "use server";
    const name = formData.get("bendahara_name") as string;
    await db.updateSetting("bendahara_name", name);
    revalidatePath("/settings");
    revalidatePath("/");
  }

  return (
    <main className="min-h-screen p-4 md:p-10 bg-[#f8fafc]">
      <div className="max-w-2xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-brand-secondary tracking-tighter uppercase leading-none">Pengaturan</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Konfigurasi Identitas & Keamanan</p>
        </div>

        {/* Settings Card */}
        <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/50 bg-white/40 backdrop-blur-md">
          <div className="p-8 border-b border-slate-50 bg-white/60 flex items-center gap-4">
            <div className="w-2 h-8 bg-brand-primary rounded-full"></div>
            <h3 className="font-black text-brand-secondary uppercase tracking-tight text-lg">Identitas Bendahara</h3>
          </div>

          <form action={updateBendahara} className="p-10 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2 ml-1">
                <div className="w-8 h-8 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                  <User className="w-4 h-4 text-brand-primary" />
                </div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Lengkap Bendahara</label>
              </div>
              <input 
                name="bendahara_name"
                type="text" 
                defaultValue={bendaharaName}
                placeholder="Contoh: DIDIK SUBIYANTO"
                className="input-modern !rounded-2xl !py-4 !px-6 text-base font-black text-brand-secondary shadow-sm"
              />
              <p className="text-[10px] text-slate-400 font-bold italic ml-2">
                * Nama ini akan tertera di sisi kanan bawah pada setiap lembar kwitansi.
              </p>
            </div>

            <button 
              type="submit"
              className="btn-premium w-full bg-brand-secondary text-white py-5 rounded-2xl flex items-center justify-center gap-4 font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_15px_30px_-5px_rgba(15,23,42,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Save className="w-5 h-5 text-brand-primary" />
              Simpan Identitas
            </button>
          </form>
        </div>

        {/* Security Info */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full -mr-12 -mt-12"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
              <Shield className="w-5 h-5 text-slate-400" />
            </div>
            <h4 className="font-black text-brand-secondary text-xs uppercase tracking-widest">Integritas Data</h4>
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed relative z-10">
            Semua konfigurasi disimpan secara aman di Vercel Postgres. Perubahan nama bendahara akan secara otomatis memperbarui *template* kwitansi baru dan histori transparansi publik.
          </p>
          <div className="flex items-center gap-2 text-green-500 relative z-10">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[9px] font-black uppercase tracking-widest">System Synchronized</span>
          </div>
        </div>
      </div>
    </main>
  );
}