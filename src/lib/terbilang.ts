/**
 * Fungsi untuk mengubah angka menjadi teks terbilang Bahasa Indonesia
 * Contoh: 150000 -> "Seratus Lima Puluh Ribu Rupiah"
 */
export function terbilangIndonesia(nominal: number): string {
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
    hasil = terbilangIndonesia(nominal - 10) + " Belas";
  } else if (nominal < 100) {
    hasil =
      terbilangIndonesia(Math.floor(nominal / 10)) +
      " Puluh " +
      terbilangIndonesia(nominal % 10);
  } else if (nominal < 200) {
    hasil = " Seratus " + terbilangIndonesia(nominal - 100);
  } else if (nominal < 1000) {
    hasil =
      terbilangIndonesia(Math.floor(nominal / 100)) +
      " Ratus " +
      terbilangIndonesia(nominal % 100);
  } else if (nominal < 2000) {
    hasil = " Seribu " + terbilangIndonesia(nominal - 1000);
  } else if (nominal < 1000000) {
    hasil =
      terbilangIndonesia(Math.floor(nominal / 1000)) +
      " Ribu " +
      terbilangIndonesia(nominal % 1000);
  } else if (nominal < 1000000000) {
    hasil =
      terbilangIndonesia(Math.floor(nominal / 1000000)) +
      " Juta " +
      terbilangIndonesia(nominal % 1000000);
  }

  return hasil.trim() + " Rupiah";
}
