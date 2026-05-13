import { NextResponse } from 'next/server';
import { sql } from "@vercel/postgres";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    let query = `SELECT * FROM pengeluaran_logs`;
    const params: any[] = [];

    if (start && end) {
      params.push(start);
      params.push(end + ' 23:59:59');
      query += ` WHERE tanggal >= $1 AND tanggal <= $2`;
    }

    query += ` ORDER BY tanggal DESC`;

    const { rows } = await sql.query(query, params);
    return NextResponse.json({ success: true, logs: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { item_pengeluaran, nominal, kategori, tanggal, keterangan } = await request.json();
    
    await sql`
      INSERT INTO pengeluaran_logs (item_pengeluaran, nominal, kategori, tanggal, keterangan)
      VALUES (${item_pengeluaran}, ${nominal}, ${kategori}, ${tanggal}, ${keterangan});
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
