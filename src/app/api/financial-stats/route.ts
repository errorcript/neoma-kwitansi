import { NextResponse } from 'next/server';
import { sql } from "@vercel/postgres";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const incomeRes = await sql`SELECT SUM(nominal) as total FROM donasi_logs WHERE status = 'active'`;
    const expenseRes = await sql`SELECT SUM(nominal) as total FROM pengeluaran_logs`;

    const totalIncome = Number(incomeRes.rows[0]?.total || 0);
    const totalExpense = Number(expenseRes.rows[0]?.total || 0);
    const balance = totalIncome - totalExpense;

    return NextResponse.json({
      success: true,
      total_income: totalIncome,
      total_expense: totalExpense,
      balance: balance
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
