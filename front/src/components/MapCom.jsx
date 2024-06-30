import { useRef } from "react";
import "../style/app1/map-com.css";
import Button from "./Button";
import MapPanel from "./MapPanel.jsx";
import { parseKml} from "../utils/parseKml";
import { useKmlDataStore, useMapInfoStore, useVisibilityStore } from "../stores/appStore";
import ImportComponent from "./ImportComponent";

export default function MapCom() {

  const inputFileRef = useRef(null);
  const { 
    setImportMarkers,
    setImportLineStrings
  } = useMapInfoStore();
  const {exportBox, exportBoxToggle} = useVisibilityStore(); 
  const {setKmlData} = useKmlDataStore();

  const importClick = () => {
    inputFileRef.current.click();
  }

  const fileChange = (e) => {
    if(!e.target.files[0])
      return ;
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const kmlContent = e.target.result;
      setKmlData(kmlContent);
      const [points, lineStrings] = parseKml(kmlContent);
      setImportMarkers(points.map((p) => {
        return  {
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
 
    return (
    <>
      <div className="map-section">
        <MapPanel> </MapPanel>
      </div>
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
          exportBoxToggle();
          console.log(exportBox);}
        }>
        
          EXPORT RESULT
        </Button>
        <ImportComponent> </ImportComponent>
      </div>
    </>
  )
}
