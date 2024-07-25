import React from 'react'
import { useMapStore } from '../stores/appStore';
import '../style/app1/point.css'
function Point ({name, long, lat}) {
  const coodrinate = `${long}, ${lat}`;
  const { map } = useMapStore(); 

  function jump() {
    console.log(long, lat);
    map.flyTo({
      center: [long, lat],
      zoom: 16
    })
  }

  return (
    <div className="search-point" onClick={jump}>
       <p className="point-name"> {name} </p> 
      <p className='point-coordinates' > {coodrinate} </p >
    </div>
  )
}

export default Point
