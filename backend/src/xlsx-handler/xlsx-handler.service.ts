import { BadRequestException, Injectable } from '@nestjs/common';
import { writeFile, writeFileSync } from 'fs';
import { join } from 'path';
import * as XlsxPopulate from 'xlsx-populate';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';

@Injectable()
export class XlsxHandlerService {
  test() {
    return 'works';
  }

  createReport() {
    return 'report';
  }

  saveFile(file: Express.Multer.File) {
    const filePath = join(__dirname, '..', 'uploads', file.originalname);
    return new Promise((resolve, reject) => {
      writeFile(filePath, file.buffer, (err) => {
        if (err) {
          return reject(err);
        }
        resolve({
          filename: file.originalname,
          path: filePath,
          size: file.size,
          mimetype: file.mimetype,
        });
      });
    });
  }

  s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xFF;
    }

    return buf;
  }

  async createExcelJs(file: Express.Multer.File, body: any) {
    const { title, fileName, date } = body;
    const aoa = [];
    const aoaRes = body.aoa.split(',');
    // console.log('aoa', body.aoa, 'saoa', aoa,);

    for (let i = 0; i < 7 * 3; i += 7) {
      aoa.push(aoaRes.slice(i, i + 7));
    }

    console.log('excel js', 'aoa', aoa, 'title', title, 'date', date);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sheet1');

    // Setting the title and merging the cells
    sheet.getCell('A1').value = title;
    sheet.mergeCells('A1:G1');

    // Adding date
    sheet.getCell('G2').value = date;

    // Adding headers
    const headers = ['Point de départ', 'Long', 'Lat', 'Nom du Tronçon', 'Point d’arrivée', 'Long', 'Lat'];
    sheet.addRow(headers);

    // Adding data from aoa
    aoa.forEach(row => {
      sheet.addRow(row);
    })

    const image = workbook.addImage({
      buffer: file.buffer,
      extension: 'png', // Or the appropriate extension for your image
    });

    // Add image to sheeti
    const sheet2 = workbook.addWorksheet('sheet2');
    sheet2.addImage(image, {
      tl: { col: 1, row: 1 }, // Top-left corner position
      ext: { width: 500, height: 500  }, // Set image dimensions (optional)
    });

    try {
      await workbook.xlsx.writeFile(join(__dirname, '../uploads/test.xlsx'));
      console.log("File saved successfully!");
    } catch (err) {
      console.error("Error generating XLSX:", err);
    }

    try {
      const buffer = workbook.xlsx.writeBuffer();
      return buffer;
    } catch(e) {
      console.error(e);
      throw new BadRequestException('bad request');
    }
  }
}
