import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start') || undefined;
    const end = searchParams.get('end') || undefined;

    const logs = await db.getAllLogs(start, end);
    const stats = await db.getStats(start, end);
    
    return NextResponse.json({ logs, stats });
  } catch (error: any) {
    console.error('Error fetching receipts list:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
