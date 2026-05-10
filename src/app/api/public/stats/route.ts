import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Paksa ambil data paling fresh dari database
    const statsResult = await sql`
      SELECT 
        COUNT(*)::int as total_count, 
        COALESCE(SUM(nominal), 0)::int as total_amount 
      FROM receipts
    `;
    
    const stats = statsResult.rows[0] || { total_count: 0, total_amount: 0 };
    
    console.log("Fetching Public Stats:", stats); // Log untuk audit di Vercel

    return new NextResponse(JSON.stringify({
      success: true,
      stats: stats
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
      stats: { total_count: 0, total_amount: 0 },
      error: error.message 
    }, { status: 500 });
  }
}
