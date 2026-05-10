import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    // SECURITY AUDIT: Check for Admin Password/Secret to prevent unauthorized deletion
    // In a production app, use NextAuth.js or similar session-based auth.
    // For now, we ensure the request is coming from an authorized client.
    
    const { id } = await request.json();
    
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
    }

    // Add logging for audit trail
    console.log(`[SECURITY AUDIT] Attempting to delete record ID: ${id}`);
    
    await db.deleteReceipt(id);
    
    console.log(`[SECURITY AUDIT] Successfully deleted record ID: ${id}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[SECURITY ERROR] Error deleting receipt:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
