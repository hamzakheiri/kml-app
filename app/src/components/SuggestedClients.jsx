import "../style/app1/suggested-client.css";
import { IoSearch } from 'react-icons/io5';
import Point from "./Point";
import Button from "./Button";
import { useMapInfoStore } from "../stores/appStore";
import * as turf from '@turf/turf';
import { createGraph, createLinesPoint } from "../utils/calc";

export default function SuggestedClients() {
  let points = [];
  const { 
    importMarkers,
    importLineStrings, 
    setResultMarkers 
    } = useMapInfoStore();

  if (importMarkers && importMarkers.length > 0) {
    points = importMarkers.map((p) => {
      return {
        name: p.name,
        long: p.long,
        lat: p.lat
      }
    });
  }
  
  async function trait() {
    if (!importMarkers || importMarkers.length == 0){
      console.error('no data to trait.');
      return;
    }

    // function calculateTheNesrest(point) {
    //   let res;
    //   let minDistance = Infinity;
    //   const tPoint = turf.point([point.long, point.lat]);

    //   importLineStrings.forEach((lineString) => {
    //     const tLineString = turf.lineString(lineString.coordinates);
    //     const snapped = turf.nearestPointOnLine(tLineString, tPoint, { units: 'kilometers' });
    //     if (snapped.properties.dist < minDistance) {
    //       minDistance = snapped.properties.dist;
    //       res = {
    //         dist: snapped.properties.dist,
    //         coordinates: snapped.geometry.coordinates,
    //         name: `${point.name}-${lineString.name}-${snapped.properties.dist}`
    //       };
    //     }
    //   })
    //   return res;
    // }

    // let res = [];
    // importMarkers.forEach(point => {
    //   res.push(calculateTheNesrest(point, importLineStrings));
    // })
    // setResultMarkers(res);
    //
    const r = createLinesPoint(importMarkers, importLineStrings);
    const w = createGraph(importLineStrings.map(
      l => ({name: l.name, coor: l.coordinates})),
      r,
      importMarkers
    )

    console.log('w:', w);
  }

    return (
      <section className="side-section">
        <h3> Suggested Clients </h3>
        <div className="search-container">
          <input type="text" />
          <IoSearch className="search-icon" />
        </div>
        <div className="map-info">
          { points.map(point => {
              return <Point key={`${point.pointName}-${point.lat}`} 
              {...point}></Point> 
            })
          }
        </div>
        { importMarkers && importMarkers.length != 0 && 
        <Button css="btn-trait" click={trait}> start trait </Button> }
      </section>
    )
  }
