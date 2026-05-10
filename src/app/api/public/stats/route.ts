import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const statsResult = await sql`
      SELECT 
        COUNT(*)::int as total_count, 
        SUM(nominal)::int as total_amount 
      FROM receipts
    `;
    
    return NextResponse.json({
      success: true,
      stats: statsResult.rows[0] || { total_count: 0, total_amount: 0 }
    });
  } catch (error) {
    return NextResponse.json({ success: false, stats: { total_count: 0, total_amount: 0 } });
  }
}
