import { db } from "@/lib/db";
import { Save, User, ShieldCheck, Key, LogOut } from "lucide-react";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const bendaharaName = await db.getSetting('bendahara_name') || 'DIDIK SUBIYANTO';

  async function updateBendahara(formData: FormData) {
    "use server";
    const name = formData.get("bendahara_name") as string;
    await db.updateSetting('bendahara_name', name);
    revalidatePath('/');
    revalidatePath('/settings');
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-brand-secondary tracking-tighter uppercase">PENGATURAN</h2>
          <p className="text-slate-500 font-bold text-xs tracking-widest uppercase">Konfigurasi Sistem & Keamanan</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          
          {/* Identitas Card */}
          <section className="glass-card p-8 rounded-[2.5rem] space-y-8">
            <div className="flex items-center gap-4">
              <div className="bg-brand-primary p-3 rounded-2xl">
                <User className="w-6 h-6 text-brand-secondary" />
              </div>
              <div>
                <h3 className="font-black text-brand-secondary text-lg">Identitas Bendahara</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Nama yang muncul di tanda tangan kwitansi</p>
              </div>
            </div>

            <form action={updateBendahara} className="space-y-6">
              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-brand-primary transition-colors">Nama Lengkap</label>
                <input 
                  name="bendahara_name"
                  type="text" 
                  defaultValue={bendaharaName}
                  className="input-modern"
                  placeholder="Masukkan nama bendahara..."
                />
              </div>
              <button 
                type="submit"
                className="btn-premium w-full bg-brand-primary text-brand-secondary py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-brand-primary/20"
              >
                <Save className="w-5 h-5" />
                SIMPAN PERUBAHAN
              </button>
            </form>
          </section>

          {/* Keamanan Card */}
          <section className="glass-card p-8 rounded-[2.5rem] space-y-8">
            <div className="flex items-center gap-4">
              <div className="bg-rose-100 p-3 rounded-2xl">
                <ShieldCheck className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-black text-brand-secondary text-lg">Keamanan Akun</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Kelola akses dashboard admin</p>
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full p-4 rounded-2xl border-2 border-slate-100 flex items-center justify-between group hover:border-brand-primary transition-all">
                <div className="flex items-center gap-4">
                  <Key className="w-5 h-5 text-slate-400 group-hover:text-brand-primary" />
                  <span className="font-bold text-slate-600">Ganti Password Admin</span>
                </div>
                <div className="bg-slate-100 px-3 py-1 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-tighter">Segera Hadir</div>
              </button>

              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex gap-4">
                <div className="shrink-0 pt-1">
                  <ShieldCheck className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-xs text-orange-700 font-medium leading-relaxed">
                  Untuk keamanan tambahan, pastikan Anda logout setiap kali selesai menggunakan perangkat publik. Sesi admin aktif selama 7 hari.
                </p>
              </div>
            </div>
          </section>

        </div>

        <div className="text-center pt-8 opacity-40">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sistem Kwitansi Otomatis v2.0</p>
          <p className="text-[10px] font-bold text-slate-400">Powered by Neoma Creative Hub</p>
        </div>
      </div>
    </main>
  );
}
