import { sql } from "@vercel/postgres";

export async function createTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS donasi_logs (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      no_kwitansi TEXT NOT NULL UNIQUE,
      nama_donatur TEXT NOT NULL,
      nominal BIGINT NOT NULL,
      keperluan TEXT DEFAULT 'Sumbangan Donatur Mobsos',
      unique_hash TEXT NOT NULL UNIQUE,
      status TEXT DEFAULT 'active',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

export const db = {
  saveReceipts: async (receipts: any[]) => {
    // Jalankan create table dulu kalo belum ada
    await createTable();

    for (const r of receipts) {
      await sql`
        INSERT INTO donasi_logs (no_kwitansi, nama_donatur, nominal, keperluan, unique_hash, status)
        VALUES (${r.no_kwitansi}, ${r.nama_donatur}, ${r.nominal}, ${r.keperluan}, ${r.unique_hash}, 'active')
        ON CONFLICT (no_kwitansi) DO NOTHING;
      `;
    }
  },
  getReceiptByHash: async (hash: string) => {
    const { rows } = await sql`
      SELECT * FROM donasi_logs WHERE unique_hash = ${hash} LIMIT 1;
    `;
    return rows[0];
  }
};
