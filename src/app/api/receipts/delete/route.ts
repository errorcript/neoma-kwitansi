import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
    }

    await db.deleteReceipt(id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting receipt:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
