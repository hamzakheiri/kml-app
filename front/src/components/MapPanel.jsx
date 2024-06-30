import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import '../style/app1/mapbox-gl.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapInfoStore, useMapStore } from '../stores/appStore'; 
mapboxgl.accessToken = 'pk.eyJ1Ijoia2hlaXJpaGFtemEiLCJhIjoiY2x2ZmU0N2NkMDY4MjJxcW01bXdzaTZyaCJ9.C2imyFkjTQoSgDpdZ-D_BA'; // Replace with your access token

const Map = () => {
  const mapContainerRef = useRef(null);
  const {
    importMarkers,
    resultMarkers,
    importLineStrings
  } = useMapInfoStore();
  const { map , setMap } = useMapStore();
  
 useEffect(() => {
    if (map)
       return;
    const initial = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11', // You can change the style
      center: [-7.615331, 33.573738], // Coordinates of Casablanca
      zoom: 20,
      attributionControl: false
    });
    
    setMap(initial);
    return () => { if (map) map.remove() };
  }, [map])


  useEffect(() => {
    if (!map)
      return;
    importMarkers.forEach((p) => {
      const marker = new mapboxgl.Marker()
        .setLngLat([parseFloat(p.long), parseFloat(p.lat)])
        .setPopup(new mapboxgl.Popup().setHTML(p.name))
        .addTo(map);
    })
  }, [importMarkers, map]);
  
  useEffect(() => {
    if (!map)
      return;
    resultMarkers.forEach((p) => {
      const marker = new mapboxgl.Marker({ color: '#ff0000'})
        .setLngLat(p.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(p.name))
        .addTo(map);
    }) 
  }, [resultMarkers, map])

  useEffect(() => {
    if (!importLineStrings || importLineStrings.length === 0 || !map)
      return;

    function addStringLine(lineString) {
      const lineStringCoordinates = lineString.coordinates.map(c => {
        return [parseFloat(c[0]), parseFloat(c[1])];
      })

      map.addSource(`line-source-${lineString.name}`, {
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

      map.addLayer({
        id: `line-layer-${lineString.name}`,
        type: 'line',
        source: `line-source-${lineString.name}`,
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

  }, [importLineStrings, map])

  return (
    <>
      <div ref={mapContainerRef} style={{ width: '80%', height: '500px', }} />
    </>
  )
};

export default Map;
