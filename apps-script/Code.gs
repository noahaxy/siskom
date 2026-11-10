/* Cara pakai: script.google.com > Proyek baru > tempel kode ini.
   Isi SHEET_ID (ID spreadsheet) dan FOLDER_ID (ID folder Drive untuk PDF LKM).
   Deploy > Penerapan baru > Aplikasi web > Jalankan sebagai: Saya, Akses: Siapa saja.
   Salin URL-nya ke js/config.js */
const SHEET_ID = 'ISI_ID_SPREADSHEET';
const FOLDER_ID = 'ISI_ID_FOLDER_DRIVE';

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.openById(SHEET_ID);
  if (d.type === 'test') {
    tab(ss, d.jenis === 'pre' ? 'Pre-test' : 'Post-test', ['Waktu', 'Nama', 'No. Absen', 'Kelas', 'Skor', 'Jumlah benar'])
      .appendRow([new Date(), d.nama, d.absen, d.kelas, d.skor, d.benar]);
  } else if (d.type === 'lkm') {
    const blob = Utilities.newBlob(Utilities.base64Decode(d.pdf), 'application/pdf', d.filename);
    const file = DriveApp.getFolderById(FOLDER_ID).createFile(blob);
    tab(ss, 'LKM', ['Waktu', 'Kelompok', 'Kelas', 'Anggota dan peran', 'Link PDF'])
      .appendRow([new Date(), d.kelompok, d.kelas, d.anggota, file.getUrl()]);
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}
function tab(ss, name, head) {
  let s = ss.getSheetByName(name);
  if (!s) { s = ss.insertSheet(name); s.appendRow(head); s.setFrozenRows(1); }
  return s;
}
