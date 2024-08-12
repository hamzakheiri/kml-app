import { useRef } from "react";
import "../style/app1/map-com.css";
import Button from "./Button";
import MapPanel from "./MapPanel.jsx";
import { parseKml } from "../utils/parseKml";
import mapboxgl from 'mapbox-gl';
import { useGraphStore, useKmlDataStore, useMapInfoStore, useMapStore, useVisibilityStore } from "../stores/appStore";
import ImportComponent from "./ImportComponent";
import { createGraph, createLinesPoint } from "../utils/calc";
import TraitingInfo from "./TraitingInfo";
import DownloadWindow from "./downloadWindow";

export default function MapCom() {

  const inputFileRef = useRef(null);
  const {
    importMarkers,
    importLineStrings,
    setImportMarkers,
    setImportLineStrings,
    startingMarker,
    endingMarker,
    setResultLineStrings,
    resultLineStrings
  } = useMapInfoStore();
  const map = useMapStore();
  const { exportBox, exportBoxToggle } = useVisibilityStore();
  const { setKmlData } = useKmlDataStore();
  const graphStore = useGraphStore();
  const { downloadWindow, downloadWindowToggle } = useVisibilityStore();
  const importClick = () => {
    inputFileRef.current.click();
  }

  const fileChange = (e) => {
    if (!e.target.files[0])
      return;
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const kmlContent = e.target.result;
      setKmlData(kmlContent);
      const [points, lineStrings] = parseKml(kmlContent);

      const markers = points.map((p) => {
        return {
          name: p.name,
          long: p.Point.coordinates.split(',')[0],
          lat: p.Point.coordinates.split(',')[1],
        }
      });

      const lines = lineStrings.map((l) => {
        return {
          name: l.name,
          coordinates: l.LineString.coordinates.split(' ').map(c => {
            let res = c.split(',');
            return [res[0], res[1]];
          })
        }
      })

      setImportMarkers(markers);

      setImportLineStrings(lines);

      const linePoint = createLinesPoint(markers, lines);
      const graph = createGraph(lines.map(
        l => ({ name: l.name, coor: l.coordinates })),
        linePoint,
        markers
      )

      graphStore.setGraph(graph);
      // graphStore.graph.display();

    }
    reader.readAsText(file);
  }

  function trait() {
    const { graph, setPath } = graphStore;
    // graph.display();
    const path = graph.dijkstra(startingMarker, endingMarker);
    setPath(path);
    console.log(path);
    const lineRes = [];
    for (let i = 0; i < path.length - 1; i++) {
      lineRes.push(graph.edgeDef.get([path[i], path[i + 1]].sort().join()));
    }
    setResultLineStrings(lineRes);
  }

  function boundResult() {
    if (resultLineStrings)
      console.log(resultLineStrings);
    if (!resultLineStrings || resultLineStrings.length === 0) {
      console.error('no lineString to bound');
      return;
    }
    let coordinates = [];
    resultLineStrings.forEach(e => {
      coordinates = [...coordinates, ...e];
    });

    // Create a 'LngLatBounds' with both corners at the first coordinate.
    const bounds = new mapboxgl.LngLatBounds(
      coordinates[0],
      coordinates[0]
    );

    // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
    for (const coord of coordinates) {
      bounds.extend(coord);
    }

    map.map.fitBounds(bounds, {
      padding: 20
    });
  };

  return (
    <>
      <div className="map-section">
        <MapPanel> </MapPanel>

        {importLineStrings && importLineStrings.length != 0 &&
          <div className="select-param">
            <TraitingInfo />
            <Button theme="secondary" click={trait}>
              TRAIT
            </Button>
          </div>
        }

        <div className="ctr-section">
          <Button click={importClick}> IMPORT
            <input
              ref={inputFileRef}
              type='file'
              style={{ display: "none" }}
              accept='.kml'
              onChange={fileChange} />
          </Button>



          <Button theme="secondary" click={() => {
            // exportBoxToggle();
            boundResult();
            downloadWindowToggle();
            console.log(exportBox);
          }
          }>
            EXPORT RESULT
          </Button>
          <DownloadWindow />
          {/* <ImportComponent> </ImportComponent> */}
        </div>

      </div>
    </>
  )
}
