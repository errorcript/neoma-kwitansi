import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from "@vercel/postgres";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start') || undefined;
    const end = searchParams.get('end') || undefined;

    const logs = await db.getAllLogs(start, end);
    const stats = await db.getStats(start, end);
    const bendahara = await db.getSetting("bendahara_name") || "DIDIK SUBIYANTO";
    const signature = await db.getSetting("bendahara_signature") || "";
    
    const expenseLogsRes = await sql`SELECT * FROM pengeluaran_logs ORDER BY tanggal DESC`;
    
    return NextResponse.json({ 
      logs, 
      stats, 
      bendahara, 
      signature,
      expense_logs: expenseLogsRes.rows 
    });
  } catch (error: any) {
    console.error('Error fetching receipts list:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
