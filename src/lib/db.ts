import { sql } from "@vercel/postgres";

export async function createTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS donasi_logs (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      no_kwitansi TEXT NOT NULL UNIQUE,
      nama_donatur TEXT NOT NULL,
      nominal BIGINT NOT NULL,
      penyerah TEXT,
      keperluan TEXT DEFAULT 'Sumbangan Donatur Mobsos',
      unique_hash TEXT NOT NULL UNIQUE,
      status TEXT DEFAULT 'active',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    -- Insert default bendahara if not exists
    INSERT INTO settings (key, value) VALUES ('bendahara_name', 'DIDIK SUBIYANTO') ON CONFLICT (key) DO NOTHING;
  `;
}

export const db = {
  saveReceipts: async (receipts: any[]) => {
    // Jalankan create table dulu kalo belum ada
    await createTable();

    for (const r of receipts) {
      await sql`
        INSERT INTO donasi_logs (no_kwitansi, nama_donatur, nominal, penyerah, keperluan, unique_hash, status)
        VALUES (${r.no_kwitansi}, ${r.nama_donatur}, ${r.nominal}, ${r.penyerah}, ${r.keperluan}, ${r.unique_hash}, 'active')
        ON CONFLICT (no_kwitansi) DO NOTHING;
      `;
    }
  },
  getReceiptByHash: async (hash: string) => {
    const { rows } = await sql`
      SELECT * FROM donasi_logs WHERE unique_hash = ${hash} LIMIT 1;
    `;
    return rows[0];
  },
  getAllLogs: async () => {
    const { rows } = await sql`
      SELECT * FROM donasi_logs ORDER BY created_at DESC;
    `;
    return rows;
  },
  getStats: async () => {
    const { rows } = await sql`
      SELECT 
        COUNT(id) as total_count,
        SUM(nominal) as total_amount
      FROM donasi_logs 
      WHERE status = 'active';
    `;
    return rows[0];
  }
};
