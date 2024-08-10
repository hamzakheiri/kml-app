import '../style/app.css';
import MapCom from '../components/MapCom';
import SuggestedClients from '../components/SuggestedClients';
import { useVisibilityStore } from '../stores/appStore';

export default function App() {
  const { exportBox, exportBoxToggle } = useVisibilityStore();

  const checkToggle = ()=>{
      if(exportBox)
        exportBoxToggle();
  } 

  return (
    <div className="App" onClick={checkToggle}>
           <SuggestedClients>

      </SuggestedClients>
      <main className="main-section"> 
        <MapCom>
        </MapCom>
      </main>
 
   </div>
  );
}
