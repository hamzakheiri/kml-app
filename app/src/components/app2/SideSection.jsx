import { useEffect } from "react";
import { useMapInfoStore, useVisibilityStore } from "../../stores/appStore";
import Button from "./Button";
import Marker from "./Marker";
// import "../style/side-section.css";
export const SideSection = () => {
  
  const {importMarkers} = useMapInfoStore();
  const {downloadWindow, downloadWindowToggle} = useVisibilityStore();

  // useEffect(()=>{
  //   console.log('downloadWindow::', downloadWindow)
  //   // console.log('importMarks::', importMarkers)
  // }, [downloadWindow])

  return (
    <section className='side-section'> 
      <h3 id='markers-title'> Markers </h3>
      <div className='markers-list'>
          { importMarkers && importMarkers.map(m => {
          return <Marker key={`${m.name}-${m.lat}`}
            name={m.name} long={m.long} lat={m.lat} />
        })}
      </div>
      {/* { importMarkers && importMarkers.length != 0 &&  */}
        <Button css="btn-trait" click={() => {downloadWindowToggle()}}> download results </Button> 
     {/* } */}
    </section>
  );
}
