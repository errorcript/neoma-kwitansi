import { db } from "@/lib/db";
import { Save, User, ShieldCheck } from "lucide-react";
import { revalidatePath } from "next/cache";

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
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto space-y-8">
        <h2 className="text-3xl font-black text-brand-secondary">Pengaturan Sistem</h2>

        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 space-y-8">
          
          {/* Identitas Bendahara */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-brand-primary">
              <User className="w-6 h-6" />
              <h3 className="font-bold text-lg">Identitas Bendahara</h3>
            </div>
            <form action={updateBendahara} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nama Lengkap Bendahara</label>
                <input 
                  name="bendahara_name"
                  type="text" 
                  defaultValue={bendaharaName}
                  className="block w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-brand-primary p-3 border text-brand-secondary font-bold"
                  placeholder="Masukkan nama bendahara..."
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-brand-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-brand-primary/20"
              >
                <Save className="w-5 h-5" />
                Simpan Perubahan
              </button>
            </form>
          </section>

          <hr className="border-gray-100" />

          {/* Keamanan */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-orange-500">
              <ShieldCheck className="w-6 h-6" />
              <h3 className="font-bold text-lg">Keamanan Dashboard</h3>
            </div>
            <p className="text-sm text-gray-400">Ganti password admin untuk mencegah akses yang tidak diinginkan.</p>
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <p className="text-xs text-orange-700 font-medium">
                Fitur ganti password sedang disiapkan. Untuk sementara gunakan password default di .env
              </p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
