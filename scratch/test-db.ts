import { db } from "./src/lib/db";

async function test() {
  console.log("Memulai test database...");
  try {
    const testData = [{
      no_kwitansi: "TEST-" + Date.now(),
      nama_donatur: "SCRATCH TEST",
      nominal: 50000,
      penyerah: "AGENT",
      keperluan: "Testing",
      unique_hash: "hash-" + Date.now(),
    }];
    
    await db.saveReceipts(testData);
    console.log("Save sukses!");
    
    const logs = await db.getAllLogs();
    const found = logs.find(l => l.nama_donatur === "SCRATCH TEST");
    if (found) {
      console.log("DATA DITEMUKAN DI DATABASE!");
    } else {
      console.log("DATA TIDAK DITEMUKAN MESKIPUN SAVE SUKSES!");
    }
  } catch (err) {
    console.error("ERROR:", err);
  }
}

test();
