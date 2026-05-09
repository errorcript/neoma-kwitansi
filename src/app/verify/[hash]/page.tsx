import { ReceiptCard } from "@/components/ReceiptCard";
import { db } from "@/lib/db";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VerifyPage({ params }: { params: { hash: string } }) {
  const data = await db.getReceiptByHash(params.hash);
  
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-red-100">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-20 h-20 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-brand-secondary mb-2">Kwitansi GAK ADA</h1>
          <p className="text-gray-500 mb-6">Data tidak ditemukan dalam sistem. Pastikan lo scan QR yang bener bre.</p>
          <button 
            className="w-full bg-gray-200 text-brand-secondary py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
            onClick={() => window.location.href = '/'}
          >
            Balik ke Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-green-100">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-brand-secondary mb-2">Kwitansi Terverifikasi</h1>
        <p className="text-gray-500 mb-6">Data ini tercatat secara resmi dalam sistem Neoma Creative Hub x Paguyuban Dharma Putra Mahesa.</p>
        
        <div className="space-y-3 text-left bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Nama Donatur:</span>
            <span className="text-sm font-bold text-brand-secondary uppercase">{data.nama_donatur}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Nominal:</span>
            <span className="text-sm font-bold text-brand-secondary">Rp {Number(data.nominal).toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Status:</span>
            <span className="text-sm font-bold text-green-600">TERVERIFIKASI ASLI</span>
          </div>
        </div>

        <button 
          className="mt-8 w-full bg-brand-primary text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all"
          onClick={() => window.location.href = 'https://mobilsosialdesakalikebo.wordpress.com/'}
        >
          Kembali ke Web Utama
        </button>
      </div>
      
      <p className="mt-8 text-xs text-gray-400">© 2026 Neoma Creative Hub. All rights reserved.</p>
    </div>
  );
}
