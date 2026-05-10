import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Settings, User, Shield, Save, CheckCircle2, Sparkles, Database } from "lucide-react";

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
    <main className="min-h-screen p-6 md:p-12 lg:p-16">
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Pengaturan</h1>
          <div className="flex items-center gap-3">
             <span className="h-1 w-12 bg-brand-primary rounded-full"></span>
             <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.4em]">Konfigurasi Identitas & Keamanan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10">
          {/* Settings Card */}
          <div className="glass-card rounded-[3rem] overflow-hidden shadow-2xl border-white/60 animate-in fade-in zoom-in duration-700 delay-100">
            <div className="p-10 border-b border-slate-100/50 bg-white/40 backdrop-blur-sm flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-3 h-10 bg-brand-primary rounded-full shadow-lg shadow-brand-primary/20"></div>
                <h3 className="font-black text-slate-900 uppercase tracking-tight text-xl leading-none">Identitas Bendahara</h3>
              </div>
              <Settings className="w-6 h-6 text-slate-300 animate-spin-slow" />
            </div>

            <form action={updateBendahara} className="p-12 space-y-10 bg-white/20">
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-2 ml-1">
                  <div className="w-10 h-10 bg-brand-primary/10 rounded-2xl flex items-center justify-center border border-brand-primary/20 shadow-inner">
                    <User className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Nama Lengkap Bendahara</label>
                    <p className="text-[10px] text-slate-400 font-bold">Identitas Resmi Penanggung Jawab</p>
                  </div>
                </div>
                <div className="relative group">
                  <input 
                    name="bendahara_name"
                    type="text" 
                    defaultValue={bendaharaName}
                    placeholder="Contoh: DIDIK SUBIYANTO"
                    className="input-modern !rounded-2xl !py-5 !px-8 text-xl font-black text-slate-900 shadow-xl border-white/80 focus:border-brand-primary"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <span className="text-lg">💡</span>
                  <p className="text-[11px] text-blue-600 font-bold leading-relaxed">
                    Nama ini akan muncul secara otomatis di sisi kanan bawah pada setiap lembar kwitansi dan laporan transparansi. Pastikan penulisan sesuai dengan gelar resmi.
                  </p>
                </div>
              </div>

              <button 
                type="submit"
                className="btn-premium w-full bg-slate-900 text-white py-6 rounded-[1.5rem] flex items-center justify-center gap-4 font-black text-xs uppercase tracking-[0.4em] shadow-2xl group hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Save className="w-5 h-5 text-brand-primary transition-transform group-hover:scale-125" />
                Simpan Konfigurasi
              </button>
            </form>
          </div>

          {/* Additional Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className="glass-card p-8 rounded-[2.5rem] border-white/60 space-y-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                  <Shield className="w-6 h-6 text-brand-primary" />
                </div>
                <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest">Integritas Data</h4>
              </div>
              <p className="text-xs text-slate-500 font-bold leading-relaxed relative z-10">
                Perubahan nama bendahara akan secara otomatis memperbarui template kwitansi baru dan histori transparansi publik secara real-time.
              </p>
            </div>

            <div className="glass-card p-8 rounded-[2.5rem] border-white/60 space-y-5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700 opacity-30"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                  <Database className="w-6 h-6 text-slate-400" />
                </div>
                <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest">Cloud Sync</h4>
              </div>
              <p className="text-xs text-slate-500 font-bold leading-relaxed relative z-10">
                Semua data tersinkronisasi dengan Vercel Postgres Serverless. Backup dilakukan secara harian untuk menjamin keamanan aset data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}