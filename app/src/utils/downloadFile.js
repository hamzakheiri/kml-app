
function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

export function downloadFile(data, fileName, fileType) {
  
  if (!['kml', 'xlsx'].includes(fileType))
    throw new String("invalide file type");

  const blob = new Blob(data , {
    type: fileType === 'kml' ? 'application/vnd.google-earth.kml+xml' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  const downloadLink = document.createElement('a');
  downloadLink.href = window.URL.createObjectURL(blob);
  downloadLink.download = fileName || 'download.kml';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
