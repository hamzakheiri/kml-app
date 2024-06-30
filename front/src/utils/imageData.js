function takeScreenshot(map) {
  return new Promise(function(resolve, reject) {
    map.once("render", function() {
      resolve(map.getCanvas().toDataURL());
    });
    map.setBearing(map.getBearing());
  });
}

function dataURLToBlob(dataURL) {
  const parts = dataURL.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

export async function imageData(map) {
  const data = await takeScreenshot(map.map);
  const blob = dataURLToBlob(data);
  return blob; 
}

