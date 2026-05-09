/**
 * Fungsi untuk mengubah angka menjadi teks terbilang Bahasa Indonesia
 * Contoh: 100000000 -> "Seratus Juta Rupiah"
 */
function konversi(nominal: number): string {
  const bilangan = [
    "",
    "Satu",
    "Dua",
    "Tiga",
    "Empat",
    "Lima",
    "Enam",
    "Tujuh",
    "Delapan",
    "Sembilan",
    "Sepuluh",
    "Sebelas",
  ];

  let hasil = "";

  if (nominal < 12) {
    hasil = bilangan[nominal];
  } else if (nominal < 20) {
    hasil = konversi(nominal - 10) + " Belas";
  } else if (nominal < 100) {
    hasil =
      konversi(Math.floor(nominal / 10)) +
      " Puluh " +
      konversi(nominal % 10);
  } else if (nominal < 200) {
    hasil = " Seratus " + konversi(nominal - 100);
  } else if (nominal < 1000) {
    hasil =
      konversi(Math.floor(nominal / 100)) +
      " Ratus " +
      konversi(nominal % 100);
  } else if (nominal < 2000) {
    hasil = " Seribu " + konversi(nominal - 1000);
  } else if (nominal < 1000000) {
    hasil =
      konversi(Math.floor(nominal / 1000)) +
      " Ribu " +
      konversi(nominal % 1000);
  } else if (nominal < 1000000000) {
    hasil =
      konversi(Math.floor(nominal / 1000000)) +
      " Juta " +
      konversi(nominal % 1000000);
  } else if (nominal < 1000000000000) {
    hasil =
      konversi(Math.floor(nominal / 1000000000)) +
      " Miliar " +
      konversi(nominal % 1000000000);
  }

  return hasil.trim();
}

export function terbilangIndonesia(nominal: number): string {
  if (nominal === 0) return "Nol Rupiah";
  const hasil = konversi(nominal);
  return hasil + " Rupiah";
}
