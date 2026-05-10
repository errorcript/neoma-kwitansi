import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const logs = await db.getAllLogs();
    const stats = await db.getStats();
    
    return NextResponse.json({ logs, stats });
  } catch (error: any) {
    console.error('Error fetching receipts list:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
