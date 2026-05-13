"use client";

import { useState } from "react";
import { User, Sparkles, Save, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface SettingsFormProps {
  initialName: string;
  initialSignature: string;
  updateAction: (formData: FormData) => Promise<void>;
}

export default function SettingsForm({ initialName, initialSignature, updateAction }: SettingsFormProps) {
  const [signatureBase64, setSignatureBase64] = useState(initialSignature);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignatureBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("bendahara_signature", signatureBase64);
    await updateAction(formData);
    setLoading(false);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="p-12 space-y-10 bg-white/20">
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
            defaultValue={initialName}
            placeholder="Contoh: DIDIK SUBIYANTO"
            className="input-modern w-full !rounded-2xl !py-5 !px-8 text-xl font-black text-slate-900 shadow-xl border-white/80 focus:border-brand-primary outline-none"
          />
        </div>
      </div>

      {/* Digital Signature */}
      <div className="space-y-6 pt-4 border-t border-slate-100/50">
        <div className="flex items-center gap-4 mb-2 ml-1">
          <div className="w-10 h-10 bg-brand-primary/10 rounded-2xl flex items-center justify-center border border-brand-primary/20 shadow-inner">
            <Sparkles className="w-5 h-5 text-brand-primary" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Tanda Tangan Digital</label>
            <p className="text-[10px] text-slate-400 font-bold">Muncul Otomatis di Kwitansi</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          {signatureBase64 && (
            <div className="w-48 h-24 bg-white rounded-2xl border-2 border-dashed border-slate-200 p-2 flex items-center justify-center overflow-hidden">
              <img src={signatureBase64} alt="Signature" className="max-w-full max-h-full object-contain mix-blend-multiply" />
            </div>
          )}
          <div className="flex-grow w-full">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 font-bold mt-2 italic">Upload foto tanda tangan (background putih/transparan)</p>
          </div>
        </div>
      </div>

      <button 
        type="submit"
        disabled={loading}
        className="btn-premium w-full bg-slate-900 text-white py-6 rounded-[1.5rem] flex items-center justify-center gap-4 font-black text-xs uppercase tracking-[0.4em] shadow-2xl group hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
      >
        <Save className="w-5 h-5 text-brand-primary transition-transform group-hover:scale-125" />
        {loading ? "Menyimpan..." : "Simpan Konfigurasi"}
      </button>
    </form>
  );
}
