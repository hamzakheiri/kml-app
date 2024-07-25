
export function geojsonMarkCreate(point){
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [point.long, point.lat], // Replace with your desired coordinates
        },
        properties: {
          title: point.name, // Optional title for the pin
        },
      },
    ],
  };
}

