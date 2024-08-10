import * as turf from '@turf/turf';
import { cloneDeep } from 'lodash';
import { WeightedGraph } from './graphCreation';

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

export function createLinesPoint(markers, lineStrings) {
  const r = lineStrings.map(line => {
    const tLine = turf.lineString(line.coordinates);
    const t = { name: line.name, markers: [] };
    markers.forEach(point => {
      const tPoint = turf.point([point.long, point.lat]);
      const s = turf.nearestPointOnLine(tLine, tPoint, { units: 'kilometers' });
      if (s.properties.dist < 0.01) {
        t.markers.push({
          name: point.name,
          coor: s.geometry.coordinates,
        })
      }
    })
    return t;
  });
  return r;
}

function calcDist(a, b, lineStrings, lineName) {
  // console.log('a', a, 'b', b, 'calc: ', lineStrings, lineName);
  
  
  const ap = turf.point(a.coor);
  const bp = turf.point(b.coor);
  const edgeDef = [];
  const line = lineStrings.find(e => e.name === lineName).coor;
 // console.log('tar line: ', line);
  if (a.index === b.index)
    return {
      dist: turf.distance(ap, bp, { units: 'kilometers' }),
      edgeDef: [a.coor, b.coor]
    };

  let s = a.index;
  edgeDef.push(a.coor);
  // console.log('1:', a, '2: ', line[s]);
  let dist = turf.distance(ap, line[s], { units: 'kilometers' });
  while (s < b.index) {
    const j = turf.point(line[s]);
    const k = turf.point(line[s + 1]);
    edgeDef.push(line[s]);
    dist += turf.distance(j, k, { units: 'kilometers' });
    s++;
  }
  dist += turf.distance(turf.point(line[s - 1]), bp, { units: 'kilometers' });
  edgeDef.push(b.coor);
  return {dist: dist, edgeDef: edgeDef};
}


function distMap(lineStrings, lineM, graph) {
    const res = Object.entries(lineM).forEach(([key, value]) => {
      const ms = value;
      for (let i = 0; i < ms.length - 1; i++) {
        let cur = ms[i];
        let nex = ms[i + 1];
        const {dist, edgeDef} = calcDist(cur, nex, lineStrings, key);
        graph.addEdge(cur.name, nex.name, dist, key);
        graph.addEdgeDef(cur.name, nex.name, edgeDef);
      }
    })
 }


export function createGraph(lineStrings, lineMap, points) {
  const graph = new WeightedGraph();
  let lineM = {};
  const lineMapH = lm => {
    const currentTar = lineStrings.find(e => e.name == lm.name);
    let line = cloneDeep(currentTar.coor);

    let lp = lm.markers.map((m) => {
      return { ...addPointToLine(m.coor, line), name: m.name };
    }).sort((a, b) => {
      if (a.index === b.index)
        return a.dist - b.dist;
      return a.index - b.index;
    })
    lineM[currentTar.name] = lp;
  }

  lineMap.forEach(lineMapH);
  points.forEach(p => {
    graph.addVertex(p.name)
  })
  distMap(lineStrings, lineM, graph);

  return graph;
};

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

export function createAoa(graph, path, imported){
  const aoa = [];
  let current = imported.find(e => e.name  === path[0]);
  let next;

  for (let i=0; i < path.length-1; i++){
    next = imported.find(e => e.name === path[i+1]); 
    aoa.push([
      current.name,
      current.long,
      current.lat,
      graph.source.get([current.name, next.name].sort().join()),
      next.name,
      next.long,
      next.lat,
    ])
    current = next;
  }
  console.log(aoa);
  return aoa;
}

function isPartOfLine(p, line) {
  const po = turf.point(p);
  const coor = [...line];
  for (let i = 0; i < coor.length - 1; i++) {
    const dis1 = turf.distance(po, turf.point([coor[i][0], coor[i][1]]), { units: 'kilometers' });
    const dis2 = turf.distance(po, turf.point([coor[i + 1][0], coor[i + 1][1]]), { units: 'kilometers' });
    const dis = turf.distance(turf.point([coor[i][0], coor[i][1]]), turf.point([coor[i + 1][0], coor[i + 1][1]]), { units: 'kilometers' });
    if (dis1 + dis2 - dis < 0.001)
      return { index: i + 1, dist: dis - dis1 };
  }
  return { index: -1, dist: -1 };
}

function insertAt(ar, index, item) {
  if (ar.some(e => isEqual(e, item)))
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

  const { index, dist } = isPartOfLine(coor, l);
  // console.log('info', index);
  const lineContainS = insertAt(l, index, coor);
  return { coor: coor.map(e => e.toString()), index: index, dis: dist, resLine: lineContainS }; // 0 coordinate of the point // 1 the resulting lineString
}

function lineSlice(l, coor1, coor2) {
  let insert = false;
  const res = [];
  const z = [false, false];
  for (let i = 0; i < l.length; i++) {
    if (isEqual(l[i], coor1)) {
      z[0] = true;
      insert = true;
    }
    if (isEqual(l[i], coor2)) {
      z[1] = true;
      insert = true;
    }
    if (insert)
      res.push(l[i]);

    if (z[0] && z[1])
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
    return e.map(e => e.toString());
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
