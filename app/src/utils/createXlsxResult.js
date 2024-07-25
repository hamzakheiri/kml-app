import * as XLSX from 'xlsx';
// import XlsxPopulate from 'xlsx-populate';


function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function createXlsxResult(aoa, title, date = null) {
  const workbook = XLSX.utils.book_new();

  console.log('aoa', aoa, 'title', title, 'date', `${date.$D}-${date.month() + 1}-${date.year()}`);
  const worksheet = XLSX.utils.aoa_to_sheet([
    [title],
    ['', '', '', '', '', '', `${date.$D}-${date.month() + 1}-${date.year()}`],
    ['Point de départ', 'Long', 'Lat', 'Nom du Tronçon', 'Point d’arrivée', 'Long', 'Lat'],
    ...aoa
  ]);

  worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }];
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  const xlsxData = XLSX.write(workbook, { type: 'binary' });
  return xlsxData;
}

// export async function createXlxResultI(aoa, title, date, image) {
//   const workbook = await XlsxPopulate.fromBlankAsync();

//   // Get the active sheet
//   const sheet = workbook.sheet(0);

//   // Set the title and date
//   sheet.cell("A1").value(title);
//   sheet.cell("G2").value(`${date.$D}-${date.month() + 1}-${date.year()}`);
//   sheet.range("A1:G1").merged(true);

//   // Set the headers and AoA data
//   const headers = [['Point de départ', 'Long', 'Lat', 'Nom du Tronçon', 'Point d’arrivée', 'Long', 'Lat']];
//   const data = headers.concat(aoa);
//   sheet.cell("A3").value(data);

//   // Convert the workbook to binary data
//   const buffer = await workbook.outputAsync();
//   const binaryData = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
//   return binaryData;
// }
