import { db } from "@/lib/db";
import { ReceiptCard } from "@/components/ReceiptCard";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SinglePrintPage({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;
  const data = await db.getReceiptByHash(hash);
  
  if (!data) {
    redirect("/rekap");
  }

  return (
    <main className="min-h-screen bg-white flex items-start justify-center p-0">
      <div className="print-container">
        <ReceiptCard data={data} />
        
        {/* Auto trigger print on load (optional but helpful) */}
        <script dangerouslySetInnerHTML={{ __html: `window.onload = () => { setTimeout(() => window.print(), 500); }` }} />
      </div>
      
      {/* Back button only visible on screen */}
      <div className="fixed bottom-8 right-8 no-print">
        <a 
          href="/rekap" 
          className="bg-brand-secondary text-white px-6 py-3 rounded-xl font-bold shadow-xl hover:opacity-90 transition-all"
        >
          ← Kembali ke Rekap
        </a>
      </div>
    </main>
  );
}
