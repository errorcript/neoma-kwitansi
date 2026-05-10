import { db } from "@/lib/db";
import { CheckCircle, AlertCircle, ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function VerifyPage({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;
  const data = await db.getReceiptByHash(hash);
  
  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-[440px]">
          <div className="bg-white p-10 rounded-3xl text-center border border-rose-100 shadow-xl">
            <div className="flex justify-center mb-6">
              <AlertCircle className="w-16 h-16 text-rose-500" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 mb-2">Data Tidak Valid</h1>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Kwitansi ini tidak terdaftar dalam database resmi kami. Mohon pastikan Anda melakukan scan dari lembar kwitansi yang asli.
            </p>
            <Link 
              href="/"
              className="w-full bg-slate-900 text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest hover:bg-black transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
          </div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-[480px] space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100">
            <img src="/logo-paguyuban.png" alt="Logo" className="w-10 h-10 object-contain" />
          </div>
          <div className="space-y-1">
             <h2 className="text-lg font-bold text-slate-800 tracking-tight uppercase">Verifikasi Kwitansi</h2>
             <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.3em]">Sistem Validasi Resmi Paguyuban</p>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-emerald-100 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
             <ShieldCheck className="w-24 h-24 text-emerald-600" />
          </div>

          <div className="flex justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-emerald-500" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-1 uppercase tracking-tight">Kwitansi Sah</h1>
            <p className="text-emerald-600 font-bold text-[10px] uppercase tracking-widest">Terverifikasi Oleh Sistem</p>
          </div>
          
          <div className="space-y-5 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Nama Donatur</span>
              <span className="text-lg font-bold text-slate-800 uppercase">{data.nama_donatur}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Nominal</span>
              <span className="text-2xl font-bold text-slate-800 tracking-tight">
                 Rp {Number(data.nominal).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">No. Kwitansi</span>
              <span className="text-xs font-mono font-bold text-slate-500">{data.no_kwitansi}</span>
            </div>
          </div>

          <a 
            href="https://mobilsosialdesakalikebo.wordpress.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 w-full bg-brand-primary text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20"
          >
            Kunjungi Website Kami
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        
        <div className="flex flex-col items-center gap-3 opacity-50">
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center max-w-[280px] leading-relaxed">
             Dokumen digital ini merupakan bukti sah transaksi yang tersimpan secara permanen dalam sistem kami.
           </p>
           <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">© 2026 Paguyuban DPM x Neoma Hub</p>
        </div>
      </div>
    </main>
  );
}

