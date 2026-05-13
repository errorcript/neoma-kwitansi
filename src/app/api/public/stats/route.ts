import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from "@vercel/postgres";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const stats = await db.getStats();
    
    // Fetch expenses
    const expenseRes = await sql`SELECT SUM(nominal) as total FROM pengeluaran_logs`;
    const expenseLogsRes = await sql`SELECT item_pengeluaran, nominal, tanggal, kategori FROM pengeluaran_logs ORDER BY tanggal DESC LIMIT 50`;
    
    const totalIncome = Number(stats.total_amount || 0);
    const totalExpense = Number(expenseRes.rows[0]?.total || 0);
    const balance = totalIncome - totalExpense;

    return new NextResponse(JSON.stringify({
      success: true,
      stats: {
        ...stats,
        total_expense: totalExpense,
        balance: balance
      },
      expense_logs: expenseLogsRes.rows
    }), {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Pragma': 'no-cache',
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error("CRITICAL PUBLIC STATS ERROR:", error.message);
    return NextResponse.json({ 
      success: false, 
      stats: { total_count: 0, total_amount: 0, total_expense: 0, balance: 0 },
      expense_logs: [],
      error: error.message 
    }, { status: 500 });
  }
}
