import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { v4 as uuidv4 } from 'uuid';
// import '../style/mapbox-gl.css';
// import '../mapbox-gl/dist/mapbox-gl.css';
import '../../style/map-panel.css'
import { useMapStore, useMapInfoStore, useAoaStore } from '../../stores/appStore.js';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { imageData } from '../../utils/imageData';

mapboxgl.accessToken = 'pk.eyJ1Ijoia2hlaXJpaGFtemEiLCJhIjoiY2x2ZmU0N2NkMDY4MjJxcW01bXdzaTZyaCJ9.C2imyFkjTQoSgDpdZ-D_BA'; // Replace with your access token

export const MapPanel = () => {
  const mapContainerRef = useRef(null);
  const {
    importMarkers,
    resultMarkers,
    importLineStrings,
    resultLineStrings,
  } = useMapInfoStore();

  const map = useMapStore();

  const { aoa } = useAoaStore();

  useEffect(() => {
    if (map.map)
      return;
    const initial = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11', // You can change the style
      center: [-7.615331, 33.573738], // Coordinates of Casablanca
      zoom: 20,
      attributionControl: false
    });

    map.setMap(initial);
    // return () => { if (map) map.remove() };
  }, [map.map]);


  // useEffect(() => {
  //   if (!map.map)
  //     return;
  //   importMarkers.forEach((p) => {
  //     const m = new mapboxgl.Marker()
  //       .setLngLat([parseFloat(p.long), parseFloat(p.lat)])
  //       .setPopup(new mapboxgl.Popup().setHTML(p.name))
  //       .addTo(map.map);

  //     map.addMarker(m);
  //   })
  //   if (importMarkers && importMarkers.length != 0)
  //     map.map.flyTo({
  //       center: [importMarkers[0].long, importMarkers[1].lat],
  //       zoom: 15
  //     })
  //   // console.log(importMarkers[0])
  // }, [importMarkers, map.map]);

  useEffect(() => {
    function addMarker(m) {

      const markerId = m.name;

      if (map.markers.includes(markerId)){
        console.error('duplicated markerId resource');
        return;
      }

      map.addMarker(markerId);
      map.map.addSource(`source-${m.name}`, {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': [
            {
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': [m.long, m.lat]
              },
              'properties': {
                'title': `${m.name}`,
              }
            }
          ]
        }
      });

      // Add a symbol layer to render the markers
      map.map.addLayer({
        'id': `layer-${m.name}`,
        'type': 'symbol',
        'source': `source-${m.name}`,
        'layout': {
          'icon-image': 'harbor-15', // Default marker icon provided by Mapbox
          'icon-size': 1.2,
          'text-field': ['get', 'title'],
          'text-offset': [0, 1.25],
          'text-anchor': 'top',
          'icon-size': 1,
          'icon-allow-overlap': true,
          'text-allow-overlap': true,
        }
      });
    }
    if (!ma.map)
      return;
    console.log('new::', importMarkers);
    // console.log(importMarkers[0])
    importMarkers.forEach(addMarker);
    if (importMarkers && importMarkers.length != 0)
      map.map.flyTo({
        center: [importMarkers[0].long, importMarkers[1].lat],
        zoom: 15
      })

  }, [importMarkers, map.map]);


  useEffect(() => {
    if (!map.map)
      return;
    resultMarkers.forEach((p) => {
      const m = new mapboxgl.Marker({ color: '#ff0000' })
        .setLngLat(p.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(p.name))
        .addTo(map.map);

      map.addMarker(m);
    })
  }, [resultMarkers, map])

  useEffect(() => {
    console.log('map panel::', resultLineStrings);
    if (!resultLineStrings || resultLineStrings.length === 0 || !map)
      return;

    function addStringLine(lineString) {
      const lineStringCoordinates = lineString.coordinates.map(c => {
        return [parseFloat(c[0]), parseFloat(c[1])];
      })

      const lineStringId = `${lineString.name}`;
      if (map.lineStringsId.includes(lineStringId))
        console.error('duplicated line string recourse');

      map.addLineString(lineStringId); // later

      map.map.addSource(`source-${lineString.name}`, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: lineStringCoordinates
          }
        }
      });

      map.map.addLayer({
        id: `layer-${lineString.name}`,
        type: 'line',
        source: `source-${lineString.name}`,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          
        },
        paint: {
          'line-color': '#00cc00', // Blue color
          'line-width': 2
        }
      });
    }

    const w = resultLineStrings.map(e => ({
      name: `${uuidv4()}`,
      coordinates: e,
    }))
    w.forEach(addStringLine);
    // addStringLine(w[2]);
  }, [resultLineStrings, map.map])

  useEffect(() => {
    if (!importLineStrings || importLineStrings.length === 0 || !map)
      return;

    function addStringLine(lineString) {
      const lineStringCoordinates = lineString.coordinates.map(c => {
        return [parseFloat(c[0]), parseFloat(c[1])];
      })

      const lineStringId = `${lineString.name}`;

      if (map.lineStringsId.includes(lineStringId)){
        console.error('duplicated line string recourse');
        return;
      }

      map.addLineString(lineStringId); // later

      map.map.addSource(`source-${lineString.name}`, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: lineStringCoordinates
          }
        }
      });

      map.map.addLayer({
        id: `layer-${lineString.name}`,
        type: 'line',
        source: `source-${lineString.name}`,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#0000FF', // Blue color
          'line-width': 2
        }
      });
    }

    importLineStrings.forEach(addStringLine);
  }, [importLineStrings, map.map])


  async function downloadPng() {


    // takeScreenshot(map.map).then(async function(data) {
    // const blob = dataURLToBlob(data);
    const blob = await imageData(map);
    const formData = new FormData();
    formData.append('file', blob, `map_screenshot${uuidv4()}.png`);
    formData.append('aoa', aoa);
    try {
      const res = await axios.post('http://localhost:5000/xlsx-handler/createReport', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(res.data);
    } catch (e) {
      console.error(e);
    }
    // });
  }

  return (
    <>
      <div ref={mapContainerRef} className='main-map' style={{ width: '80%', height: '500px', }} />
      <button onClick={downloadPng}> downloadPng</button>
    </>
  )
};

