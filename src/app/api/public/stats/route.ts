import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Gunakan fungsi stats yang sudah terpusat di db.ts
    const stats = await db.getStats();
    
    console.log("Fetching Public Stats:", stats);

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
