import { useMapStore } from '../../stores/appStore';
import '../../style/marker.css'

export default function Marker ({name, long, lat}) {
  const coodrinate = `${parseFloat(long).toFixed(5)}, ${parseFloat(lat).toFixed(5)}`;
  const { map } = useMapStore(); 

  function jump() {
    map.flyTo({
      center: [long, lat],
      zoom: 16
    })
  }

  return (
    <div className="marker-container" onClick={jump}>
       <p className="point-name"> {name} </p> 
      <p className='point-coordinates' > {coodrinate} </p >
    </div>
  )
}
