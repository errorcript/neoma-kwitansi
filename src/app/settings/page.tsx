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
          <h1 className="text-3xl font-black text-brand-secondary tracking-tighter uppercase">Pengaturan</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Konfigurasi Identitas & Keamanan</p>
        </div>

        {/* Settings Card */}
        <div className="glass-card rounded-[2rem] overflow-hidden shadow-2xl border border-white/40">
          <div className="p-8 border-b border-slate-50 bg-white/50 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-brand-primary rounded-full"></div>
            <h3 className="font-black text-brand-secondary uppercase tracking-tight">Identitas Bendahara</h3>
          </div>

          <form action={updateBendahara} className="p-8 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-brand-primary" />
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Lengkap Bendahara</label>
              </div>
              <input 
                name="bendahara_name"
                type="text" 
                defaultValue={bendaharaName}
                placeholder="Masukkan nama lengkap..."
                className="input-modern !rounded-2xl"
              />
              <p className="text-[9px] text-slate-400 font-bold italic">
                * Nama ini akan muncul secara otomatis pada setiap kwitansi yang diterbitkan.
              </p>
            </div>

            <button 
              type="submit"
              className="btn-premium w-full bg-brand-secondary text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.2em]"
            >
              <Save className="w-4 h-4 text-brand-primary" />
              Simpan Perubahan
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div className="bg-brand-primary/5 border border-brand-primary/10 p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-brand-primary" />
            <h4 className="font-black text-brand-secondary text-xs uppercase tracking-widest">Keamanan Sistem</h4>
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Sistem ini menggunakan enkripsi database Vercel. Setiap perubahan pada identitas bendahara akan langsung diterapkan pada kwitansi baru dan halaman transparansi publik.
          </p>
          <div className="flex items-center gap-2 text-green-500">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Database Connected</span>
          </div>
        </div>
      </div>
    </main>
  );
}
