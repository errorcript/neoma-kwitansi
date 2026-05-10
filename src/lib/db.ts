import { sql } from "@vercel/postgres";

export async function createTable() {
  try {
    // Jalankan satu per satu perintah
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
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `;
    await sql`
      INSERT INTO settings (key, value) 
      VALUES ('bendahara_name', 'DIDIK SUBIYANTO') 
      ON CONFLICT (key) DO NOTHING;
    `;
  } catch (err) {
    console.error("Gagal inisialisasi tabel:", err);
  }
}

export const db = {
  saveReceipts: async (receipts: any[]) => {
    await createTable();
    console.log(`[DB] Menyimpan ${receipts.length} record...`);
    
    // Gunakan loop sederhana dan pastikan setiap await selesai
    for (const r of receipts) {
      try {
        const result = await sql`
          INSERT INTO donasi_logs (
            no_kwitansi, 
            nama_donatur, 
            nominal, 
            penyerah, 
            keperluan, 
            unique_hash, 
            status
          )
          VALUES (
            ${r.no_kwitansi}, 
            ${r.nama_donatur}, 
            ${r.nominal}, 
            ${r.penyerah || ''}, 
            ${r.keperluan}, 
            ${r.unique_hash}, 
            'active'
          )
          ON CONFLICT (no_kwitansi) 
          DO UPDATE SET 
            nama_donatur = EXCLUDED.nama_donatur,
            nominal = EXCLUDED.nominal,
            unique_hash = EXCLUDED.unique_hash;
        `;
        console.log(`[DB] Berhasil simpan: ${r.no_kwitansi}, Rows affected: ${result.rowCount}`);
      } catch (err: any) {
        console.error(`[DB] Gagal simpan ${r.no_kwitansi}:`, err.message);
        throw new Error(`Gagal simpan ${r.no_kwitansi}: ${err.message}`);
      }
    }
  },
  
  getReceiptByHash: async (hash: string) => {
    await createTable();
    const { rows } = await sql`
      SELECT * FROM donasi_logs WHERE unique_hash = ${hash} LIMIT 1;
    `;
    return rows[0];
  },

  getAllLogs: async () => {
    try {
      await createTable();
      const { rows } = await sql`
        SELECT * FROM donasi_logs 
        WHERE status = 'active'
        ORDER BY created_at DESC;
      `;
      return rows;
    } catch (e) {
      console.error("DB Error in getAllLogs:", e);
      return [];
    }
  },

  getStats: async () => {
    try {
      await createTable();
      const { rows } = await sql`
        SELECT 
          COUNT(id) as total_count,
          SUM(nominal) as total_amount
        FROM donasi_logs 
        WHERE status = 'active';
      `;
      const stats = rows[0] || { total_count: 0, total_amount: 0 };
      return {
        total_count: Number(stats.total_count) || 0,
        total_amount: Number(stats.total_amount) || 0
      };
    } catch (e) {
      return { total_count: 0, total_amount: 0 };
    }
  },

  getSetting: async (key: string) => {
    try {
      await createTable();
      const { rows } = await sql`
        SELECT value FROM settings WHERE key = ${key} LIMIT 1;
      `;
      return rows[0]?.value;
    } catch (e) {
      return null;
    }
  },

  updateSetting: async (key: string, value: string) => {
    await createTable();
    await sql`
      INSERT INTO settings (key, value)
      VALUES (${key}, ${value})
      ON CONFLICT (key) DO UPDATE SET value = ${value};
    `;
  }
};
