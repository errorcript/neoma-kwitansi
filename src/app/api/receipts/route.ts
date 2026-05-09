import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { receipts } = await request.json();
    
    if (!receipts || !Array.isArray(receipts)) {
      return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
    }

    await db.saveReceipts(receipts);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error saving receipts:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
