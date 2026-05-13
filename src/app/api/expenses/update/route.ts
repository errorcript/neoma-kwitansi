import { NextResponse } from 'next/server';
import { sql } from "@vercel/postgres";

export async function POST(request: Request) {
  try {
    const { id, data } = await request.json();
    const { item_pengeluaran, nominal, kategori, tanggal, keterangan } = data;
    
    await sql`
      UPDATE pengeluaran_logs 
      SET item_pengeluaran = ${item_pengeluaran}, 
          nominal = ${nominal}, 
          kategori = ${kategori}, 
          tanggal = ${tanggal}, 
          keterangan = ${keterangan}
      WHERE id = ${id};
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
