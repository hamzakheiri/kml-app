import { XMLParser } from 'fast-xml-parser';

export function parseKml(kmlData) {
  const parser = new XMLParser();
  const res = parser.parse(kmlData);

  let points = [];
  let lineStrings = [];
  console.log('res::', res.kml.Document.Folder);
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
