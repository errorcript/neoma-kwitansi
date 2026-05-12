import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { id, data } = await request.json();
    
    if (!id || !data) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    await db.updateReceipt(id, data);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating receipt:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
