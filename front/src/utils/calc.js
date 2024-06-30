import * as turf from '@turf/turf';

export function nearestStringLine(marks, lineStrings) {
  if (!marks || lineStrings.length == 0) {
    console.error('no data to trait.');
    return;
  }

  function calculateTheNesrest(point) {
    let min = Infinity;
    let min2 = Infinity;
    let l1 = {}, l2 = {};
    let dis = true;
    const tPoint = turf.point([point.long, point.lat]);
    lineStrings.forEach((lineString) => {
      const tLineString = turf.lineString(lineString.coordinates);
      const snapped = turf.nearestPointOnLine(tLineString, tPoint, { units: 'kilometers' });
      if (dis) {
        dis = false;
      }
      if (snapped.properties.dist < 0.03) {
        if (snapped.properties.dist < min) {
          min2 = min;
          l2 = Object.create(l1);
          min = snapped.properties.dist;
          l1 = {
            name: lineString.name,
          };
        }
        else if (snapped.properties.dist < min2 && snapped.properties.dist !== min) {
          min2 = snapped.properties.dist;
          l2 = {
            name: lineString.name,
          }
        }
      }
    })
    return {
      name: point.name,
      long: point.long,
      lat: point.lat,
      lineStringsName: [l1?.name, l2?.name],
    };
  }

  const res = marks.map(point => calculateTheNesrest(point, lineStrings))
  return res;
}


export function createXlsxAoa(info, start, end, lineStrings) {
  let used = [];
  let aoa = [];

  let el = info.find(e => e.name === start);
  used.push(start)
  let currentLineString = el.lineStringsName[0];
  let nextel;

  while (el.name !== end) {
    nextel = info.find(e => (e.lineStringsName.includes(currentLineString) && !used.includes(e.name)));
    aoa.push([
      el.name, el.long, el.lat, currentLineString,
      nextel.name, nextel.long, nextel.lat])

    currentLineString = nextel.lineStringsName.find(e => e != currentLineString);
    used.push(nextel.name);
    el = nextel;
  }
  return aoa;
}

function isPartOfLine(p, line) {
  const po = turf.point(p);
  const coor = [...line];
  for (let i = 0; i < coor.length - 1; i++) {
    const dis1 = turf.distance(po, turf.point([coor[i][0], coor[i][1]]), { units: 'kilometers' });
    const dis2 = turf.distance(po, turf.point([coor[i + 1][0], coor[i + 1][1]]), { units: 'kilometers' });
    const dis = turf.distance(turf.point([coor[i][0], coor[i][1]]), turf.point([coor[i + 1][0], coor[i + 1][1]]), { units: 'kilometers' });
    if (dis1 + dis2 - dis < 0.002)
      return i + 1;
  }
  return -1;
}

function insertAt(ar, index, item) {
  if(ar.some(e => isEqual(e, item)))
    return [...ar];
  return ar.reduce((acc, curr, i) => {
    if (i === index && !isEqual(item, curr)) {
      acc.push(item);
    }
    acc.push(curr);
    return acc;
  }, []);
}

function isEqual(obj1, obj2) {
  if (obj1[0] == obj2[0] && obj2[1] == obj1[1])
    return true;
  return false;
}

function addPointToLine(p, l) {
  const tLineString = turf.lineString(l);
  const snap = turf.nearestPointOnLine(tLineString, turf.point(p));
  const coor = snap.geometry.coordinates;

  const index = isPartOfLine(coor, l);
  const lineContainS = insertAt(l, isPartOfLine(coor, l), coor);
  return { coor: coor.map(e => e.toString()), index: index, resLine: lineContainS }; // 0 coordinate of the point // 1 the resulting lineString
}

function lineSlice(l, coor1, coor2) {
  let insert = false;
  const res = [];
  const z = [false, false];
  for (let i = 0; i < l.length; i++) {
    if (isEqual(l[i], coor1)){
      z[0] = true;
      insert = true;
    }
     if (isEqual(l[i], coor2)){
      z[1] = true;
      insert = true;
    }
    if(insert)
      res.push(l[i]);
    
    if(z[0] && z[1])
      return res;
  }
  console.error('something want wrong.');
  return res;
}

function lineStringSlice(s, e, l) {
  const res1 = addPointToLine(s, l.coordinates);
  const res2 = addPointToLine(e, res1.resLine);
  // console.log('before::', l.coordinates, 'e::', e, 's::', s);
  let lineRes = lineSlice(res2.resLine, res1.coor, res2.coor);
  lineRes = lineRes.map(e => {
    return e.map( e => e.toString());
  });
  // console.log('after::', res2.resLine);
  return lineRes;
}

export function lineStringResult(aoas, lineStrings) {
  const lineRes = [];
  for (const aoa of aoas) {
    lineRes.push(lineStringSlice([aoa[1], aoa[2]], [aoa[5], aoa[6]], lineStrings.find(e => e.name === aoa[3])));
  }
  return lineRes; 
}
