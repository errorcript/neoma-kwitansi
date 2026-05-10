import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Calendar, User, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function VerifyPage({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;
  const data = await db.getReceiptByHash(hash) as any;
  
  if (!data) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-rose-100">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-rose-500" />
          </div>
          <h1 className="text-2xl font-black text-brand-secondary mb-2">Data Tidak Valid</h1>
          <p className="text-gray-500 text-sm mb-8">
            Kwitansi ini tidak terdaftar dalam database resmi kami. Mohon pastikan Anda melakukan scan dari lembar kwitansi yang asli.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 bg-brand-secondary text-white px-8 py-3 rounded-2xl font-bold hover:opacity-90 transition-all uppercase text-xs tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Verification Badge */}
      <div className="mb-8 flex flex-col items-center">
        <div className="w-16 h-16 bg-brand-primary/20 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-lg animate-bounce">
          <ShieldCheck className="w-8 h-8 text-brand-primary" />
        </div>
        <h1 className="text-brand-secondary font-black text-xl tracking-tight uppercase">Neoma Verification Hub</h1>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl max-w-lg w-full overflow-hidden border-8 border-white relative">
        {/* Success Header */}
        <div className="bg-emerald-500 p-8 text-white text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-bold uppercase tracking-widest text-xs">Verified Receipt</span>
          </div>
          <h2 className="text-3xl font-black">KWITANSI ASLI</h2>
          <p className="text-emerald-100 text-xs mt-2 opacity-80 font-mono">HASH: {hash}</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <User className="w-3 h-3" /> Nama Donatur
              </label>
              <p className="text-2xl font-black text-brand-secondary uppercase">{data.nama_donatur}</p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nominal Donasi</label>
              <p className="text-3xl font-black text-emerald-600 leading-none">{formatCurrency(Number(data.nominal))}</p>
            </div>

            <div className="h-px bg-gray-100 w-full" />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Tanggal
                </label>
                <p className="font-bold text-brand-secondary">{new Date(data.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No. Kwitansi</label>
                <p className="font-mono text-xs font-bold text-brand-primary">{data.no_kwitansi}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Keperluan</label>
              <p className="text-sm font-bold text-brand-secondary leading-relaxed">{data.keperluan}</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-gray-50 p-6 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase mb-4 tracking-tighter">
            Data ini tercatat secara resmi dalam sistem Paguyuban Dharma Putra Mahesa
          </p>
          <Link href="/" className="text-xs font-black text-brand-secondary hover:text-brand-primary transition-all uppercase tracking-widest">
            ← Kembali ke Portal
          </Link>
        </div>
      </div>
    </main>
  );
}
