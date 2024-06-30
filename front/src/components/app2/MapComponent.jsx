import { MapPanel } from './MapPanel';
import {
  useKmlDataStore,
  useMapInfoStore,
  useAoaStore,
  useMapStore
} from '../../stores/appStore';
import { useEffect, useRef } from 'react';
import Button from './Button';
import { parseKml } from '../../utils/kmlHandler';
import { createXlsxAoa, nearestStringLine, lineStringResult } from '../../utils/calc';
import DownloadWindow from './downloadWindow';
import TraitingInfo from './TraitingInfo';
import mapboxgl from 'mapbox-gl';

export const MapComponent = () => {
  const inputFileRef = useRef(null);
  const {
    importMarkers,
    importLineStrings,
    setImportMarkers,
    setImportLineStrings,
    setResultLineStrings,
    resultLineStrings,
    startingMarker,
    endingMarker,
    resetInfo, } = useMapInfoStore();

  const map = useMapStore();

  const { setKmlData } = useKmlDataStore();
  const { setAoa } = useAoaStore();
  const importClick = () => {
    inputFileRef.current.click();
  }

  const fileChange = (e) => {

    console.log('hello', e.target.files);
    if (!e.target.files[0])
      return;
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const kmlContent = e.target.result;
      setKmlData(kmlContent);
      const [points, lineStrings] = parseKml(kmlContent);
      console.log('points::', points, 'lineStrings::', lineStrings);
      setImportMarkers(points.map((p) => {
        return {
          name: p.name,
          long: p.Point.coordinates.split(',')[0],
          lat: p.Point.coordinates.split(',')[1],
        }
      }))

      setImportLineStrings(lineStrings.map((l) => {
        return {
          name: l.name,
          coordinates: l.LineString.coordinates.split(' ').map(c => {
            let res = c.split(',');
            return [res[0], res[1]];
          })
        }
      }))
    }
    reader.readAsText(file);
  }

  function trait() {
    if (!importMarkers || importMarkers.length == 0 ||
      !importLineStrings || importLineStrings.length == 0) {
      console.error('make sure you uploaded the file.');
      return;
    }
    if (!startingMarker || !endingMarker) {
      console.error('please set you starting and ending marker');
      return;
    }
    const path = nearestStringLine(importMarkers, importLineStrings);
    const aoa = createXlsxAoa(path, startingMarker, endingMarker, importLineStrings);
    setAoa(aoa);
    const lineResult = lineStringResult(aoa, importLineStrings);
    console.log('lineRes::', lineResult);
    setResultLineStrings(lineResult);
    // downloadFile(createXlsxResult(aoa), 'res.xlsx', 'xlsx')
  }

  function reset() {
    console.log('what the::', map.markers)
    map.markers.forEach(m => {
      m.remove();
    })

    map.lineStringsId.forEach((id) => {
      const layerId = `layer-${id}`;
      const sourceId = `source-${id}`;
      if (map.map.getLayer(layerId)) {
        map.map.removeLayer(layerId);

        // If the layer has a source, you might want to remove it as well
        if (map.map.getSource(sourceId)) {
          map.map.removeSource(sourceId);
        }
      }
    })

    resetInfo();
  }

  function zoomToRes() {
    if (!resultLineStrings || resultLineStrings.length === 0){
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
    <div className='map-component'>
      {/* <h1> map component </h1> */}
      <MapPanel> </MapPanel>

      {importMarkers && importMarkers.length !== 0 && <div className="start-end-point">
        <TraitingInfo> </TraitingInfo>
      </div>}
      <div className='ctr-section'>
        <Button click={importClick}> IMPORT
          <input
            ref={inputFileRef}
            type='file'
            style={{ display: "none" }}
            accept='.kml'
            onChange={fileChange} />
        </Button>

        <Button click={trait} theme="secondary">
          trait
        </Button>
        <Button click={reset} theme="secondary">
          reset
        </Button>
        <Button click={zoomToRes} theme="secondary">
          bound trait
        </Button>
      </div>
      <DownloadWindow />
    </div>
  );
}

