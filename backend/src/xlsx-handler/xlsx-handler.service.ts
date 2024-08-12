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


  colorCells(worksheet, starting, ending, color, bgcolor) {
    const startCell = worksheet.getCell(starting);
    const endCell = worksheet.getCell(ending);

    // Iterate over the rows and columns in the range
    // console.log('start row: ', startCell.row, 'end row', endCell.row)
    for (let row = startCell.row; row <= endCell.row; row++) {
      for (let col = startCell.col; col <= endCell.col; col++) {
        let cell = worksheet.getRow(row).getCell(col);

        // Set background color (fill color)
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: bgcolor }  // Orange background color
        };

        // Set font color
        cell.font = {
          color: { argb: color }  // Blue font color
        };
      }
    }
  }


  async createExcelJs(file: Express.Multer.File, body: any) {
    const { title, fileName, date } = body;
    const aoa = [];
    const aoaRes = body.aoa.split(',');
    
    console.log('aoa:', aoaRes);
    // console.log('aoa', body.aoa, 'saoa', aoa,);

    for (let i = 0; i < aoaRes.length; i += 7) {
      aoa.push(aoaRes.slice(i, i + 7));
    }

    console.log('excel js', 'aoa', aoa, 'title', title, 'date', date);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sheet1');

    // Setting the title and merging the cells
    sheet.columns = [
      { key: 'A', width: 25 },
      { key: 'B', width: 25 },
      { key: 'C', width: 25 },
      { key: 'D', width: 25 },
      { key: 'E', width: 25 },
      { key: 'F', width: 25 },
      { key: 'G', width: 25 },
    ];

    

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

    const length = aoa.length;
    sheet.getCell('A1').alignment = {
      vertical: 'middle',
      horizontal: 'center'
    }

    this.colorCells(sheet, 'A3', 'G3', '000000', 'CC0099');
    this.colorCells(sheet, 'A1', 'G1', 'FFFFFF', 'CC0099');
    this.colorCells(sheet, 'A4', 'C4', '000000', '92D050');
    this.colorCells(sheet, `E${3+length}`, `G${3+length}`, '000000', '92D050');
    
    const image = workbook.addImage({
      buffer: file.buffer,
      extension: 'png',
    });
    
    // Add image to sheeti
    const sheet2 = workbook.addWorksheet('sheet2');
    sheet2.addImage(image, {
      tl: { col: 1, row: 1 }, // Top-left corner position
      ext: { width: 500, height: 500 }, // Set image dimensions (optional)
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
    } catch (e) {
      console.error(e);
      throw new BadRequestException('bad request');
    }
  }
}
