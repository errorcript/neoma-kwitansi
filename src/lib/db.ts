import { sql } from "@vercel/postgres";

let isInitialized = false;

export async function createTable() {
  if (isInitialized) return;
  
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
      CREATE TABLE IF NOT EXISTS pengeluaran_logs (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        item_pengeluaran TEXT NOT NULL,
        nominal BIGINT NOT NULL,
        kategori TEXT DEFAULT 'Operasional',
        tanggal DATE DEFAULT CURRENT_DATE,
        keterangan TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // Add index for performance on status and created_at if they don't exist
    await sql`CREATE INDEX IF NOT EXISTS idx_status_created ON donasi_logs(status, created_at DESC);`;
    
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
    
    isInitialized = true;
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
    const { rows } = await sql`
      SELECT * FROM donasi_logs WHERE unique_hash = ${hash} LIMIT 1;
    `;
    return rows[0];
  },

  getAllLogs: async (start?: string, end?: string) => {
    try {
      await createTable();
      let query = `SELECT * FROM donasi_logs WHERE status = 'active'`;
      const params: any[] = [];
      
      if (start) {
        params.push(start);
        query += ` AND created_at >= $${params.length}`;
      }
      if (end) {
        params.push(end + ' 23:59:59');
        query += ` AND created_at <= $${params.length}`;
      }
      
      query += ` ORDER BY created_at DESC`;
      
      const { rows } = await sql.query(query, params);
      return rows;
    } catch (e) {
      console.error("DB Error in getAllLogs:", e);
      return [];
    }
  },

  getStats: async (start?: string, end?: string) => {
    try {
      await createTable();
      let query = `SELECT COUNT(DISTINCT nama_donatur) as total_count, SUM(nominal) as total_amount FROM donasi_logs WHERE status = 'active'`;
      const params: any[] = [];

      if (start) {
        params.push(start);
        query += ` AND created_at >= $${params.length}`;
      }
      if (end) {
        params.push(end + ' 23:59:59');
        query += ` AND created_at <= $${params.length}`;
      }
      
      const { rows } = await sql.query(query, params);
      const stats = rows[0] || { total_count: 0, total_amount: 0 };
      return {
        total_count: Number(stats.total_count) || 0,
        total_amount: Number(stats.total_amount) || 0
      };
    } catch (e) {
      return { total_count: 0, total_amount: 0 };
    }
  },

  deleteReceipt: async (id: string) => {
    await sql`
      DELETE FROM donasi_logs WHERE id = ${id};
    `;
    console.log(`[DB] Deleted receipt: ${id}`);
  },

  updateReceipt: async (id: string, data: any) => {
    await createTable();
    await sql`
      UPDATE donasi_logs 
      SET 
        nama_donatur = ${data.nama_donatur},
        nominal = ${data.nominal},
        keperluan = ${data.keperluan},
        penyerah = ${data.penyerah}
      WHERE id = ${id};
    `;
    console.log(`[DB] Updated receipt: ${id}`);
  },

  getNextSequenceNumber: async () => {
    try {
      await createTable();
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      
      // Hitung jumlah record di bulan & tahun yang sama
      const { rows } = await sql`
        SELECT COUNT(*) as count 
        FROM donasi_logs 
        WHERE EXTRACT(MONTH FROM created_at) = ${month} 
        AND EXTRACT(YEAR FROM created_at) = ${year};
      `;
      
      const nextNum = (Number(rows[0].count) || 0) + 1;
      // Format 001, 002, dst
      return nextNum.toString().padStart(3, '0');
    } catch (e) {
      return "001";
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
  },

  getUniqueDonators: async () => {
    try {
      await createTable();
      const { rows } = await sql`
        SELECT DISTINCT nama_donatur 
        FROM donasi_logs 
        WHERE status = 'active' 
        ORDER BY nama_donatur ASC;
      `;
      return rows.map(r => r.nama_donatur);
    } catch (e) {
      return [];
    }
  }
};
