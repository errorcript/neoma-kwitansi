import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { ShieldCheck, Users, BarChart3, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TransparansiPage() {
  const stats = await db.getStats();

  return (
    <div className="min-h-screen bg-brand-secondary p-4 md:p-8 flex flex-col items-center justify-center text-white">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <img src="/logo-paguyuban.png" alt="Logo" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter">TRANSPARANSI DONASI</h1>
          <p className="text-gray-400 text-sm md:text-base font-bold uppercase tracking-widest">Paguyuban Dharma Putra Mahesa</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[2rem] text-center space-y-2">
            <div className="bg-brand-primary w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-primary/20">
              <BarChart3 className="w-6 h-6 text-brand-secondary" />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Dana Terkumpul</p>
            <h2 className="text-4xl md:text-5xl font-black text-brand-primary">
              {formatCurrency(Number(stats.total_amount || 0))}
            </h2>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[2rem] text-center space-y-2">
            <div className="bg-white/10 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Donatur</p>
            <h2 className="text-4xl md:text-5xl font-black">
              {stats.total_count} <span className="text-xl font-medium text-gray-400">Orang</span>
            </h2>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center gap-4">
          <ShieldCheck className="w-10 h-10 text-green-400 shrink-0" />
          <p className="text-sm text-gray-300 leading-relaxed">
            Data ini diperbarui secara otomatis setiap kali Bendahara menerbitkan kwitansi resmi. Untuk alasan keamanan, detail nama donatur hanya dapat diakses oleh Admin.
          </p>
        </div>

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-all font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Login Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
