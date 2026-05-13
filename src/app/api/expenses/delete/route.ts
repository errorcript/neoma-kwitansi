import { NextResponse } from 'next/server';
import { sql } from "@vercel/postgres";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    
    await sql`DELETE FROM pengeluaran_logs WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
