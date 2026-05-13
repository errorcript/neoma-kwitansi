import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Settings, Shield, Database } from "lucide-react";
import SettingsForm from "@/components/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const bendaharaName = await db.getSetting("bendahara_name") || "DIDIK SUBIYANTO";
  const bendaharaSignature = await db.getSetting("bendahara_signature") || "";

  async function updateSettings(formData: FormData) {
    "use server";
    const name = formData.get("bendahara_name") as string;
    const signature = formData.get("bendahara_signature") as string;
    
    await db.updateSetting("bendahara_name", name);
    if (signature && signature.startsWith('data:image')) {
      await db.updateSetting("bendahara_signature", signature);
    }
    
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
          <div className="glass-card rounded-[3rem] overflow-hidden shadow-2xl border-white/60 animate-in fade-in zoom-in duration-700 delay-100 bg-white">
            <div className="p-10 border-b border-slate-100/50 bg-white/40 backdrop-blur-sm flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-3 h-10 bg-brand-primary rounded-full shadow-lg shadow-brand-primary/20"></div>
                <h3 className="font-black text-slate-900 uppercase tracking-tight text-xl leading-none">Identitas & Tanda Tangan</h3>
              </div>
              <Settings className="w-6 h-6 text-slate-300" />
            </div>

            <SettingsForm 
              initialName={bendaharaName} 
              initialSignature={bendaharaSignature} 
              updateAction={updateSettings} 
            />
          </div>

          {/* Additional Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className="glass-card p-8 rounded-[2.5rem] border-white/60 space-y-5 relative overflow-hidden group bg-white shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                  <Shield className="w-6 h-6 text-brand-primary" />
                </div>
                <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest">Integritas Data</h4>
              </div>
              <p className="text-xs text-slate-500 font-bold leading-relaxed relative z-10">
                Perubahan nama dan tanda tangan bendahara akan secara otomatis memperbarui template kwitansi baru secara real-time.
              </p>
            </div>

            <div className="glass-card p-8 rounded-[2.5rem] border-white/60 space-y-5 relative overflow-hidden group bg-white shadow-xl">
               <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700 opacity-30"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                  <Database className="w-6 h-6 text-slate-400" />
                </div>
                <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest">Cloud Sync</h4>
              </div>
              <p className="text-xs text-slate-500 font-bold leading-relaxed relative z-10">
                Semua data tersinkronisasi dengan Vercel Postgres Serverless. Tanda tangan disimpan dalam format terenkripsi base64.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}