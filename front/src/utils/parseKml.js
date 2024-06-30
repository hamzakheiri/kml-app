import { XMLParser } from 'fast-xml-parser';
import xml2js from 'xml2js';
import * as XLSX from 'xlsx';

function createKmlMark(name, long, lat) {
  return {
    name: [`${name}`],
    styleUrl: ['#m_ylw-pushpin0'],
    Point: [
      {
        'gx:drawOrder': ['1'],
        coordinates: [`${long},${lat},0`]
      }
    ]
  }
}

export function parseKml(kmlData) {
  const parser = new XMLParser();
  const res = parser.parse(kmlData);

  let points = [];
  let lineStrings = [];

  res.kml.Document.Folder.Placemark.forEach((item) => {
    if (Object.keys(item).includes('Point')) {
      points.push(item);
    }
    else {
      lineStrings.push(item);
    }
  })
  return [points, lineStrings]

}

export async function createKmlResult(kmlData, marks, lineStrings) {
  const parser = new xml2js.Parser();
  const builder = new xml2js.Builder();
  const kmlObj = await parser.parseStringPromise(kmlData);

  let marksData = marks.map(point => {
    return createKmlMark(point.name, point.coordinates[0], point.coordinates[1]);
  })

  kmlObj.kml.Document[0].Folder[0].Placemark = marksData;
  const resultKmlData = builder.buildObject(kmlObj);
  return resultKmlData;
}

export function createXlsxResult(result) {
  const workbook = XLSX.utils.book_new();

  const aoa = result.map(p => {
    return [p.name, p.coordinates[0], p.coordinates[1], p.dist];
  })
  console.log('aoa',aoa); 
  const worksheet = XLSX.utils.aoa_to_sheet([
    ['Name', "long", "lat", "dist"],
    ...aoa
  ]);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
  const xlsxData = XLSX.write(workbook, { type: 'binary' });
  return xlsxData;
}





