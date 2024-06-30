import '../style/app1/import-component.css';
import { ReactComponent as KmlIcon } from '../kml-icon.svg';
import { ReactComponent as XlsxIcon } from '../xlsx-icon.svg';
import Button from './Button';
import { useKmlDataStore, useMapInfoStore, useVisibilityStore } from '../stores/appStore';
import { downloadFile } from '../utils/downloadFile';
import { createKmlResult, createXlsxResult } from '../utils/parseKml';


export default function ImportComponent() {
  const {exportBox, exportBoxToggle} = useVisibilityStore();
  const { resultMarkers} = useMapInfoStore();
  const { kmlData } = useKmlDataStore();
  const {importLineStrings} = useMapInfoStore();
  
  async function exportKml(){
    downloadFile(await createKmlResult(kmlData, resultMarkers, []), 'result.kml', 'kml');
    exportBoxToggle();
  }

  function exportXlsx() {
    downloadFile(createXlsxResult(resultMarkers), 'result.xlsx', 'xlsx');
    exportBoxToggle();
  }

  return (
    <div className={`import-component ${(exportBox ? 'active' : '')}`}>
      <div className='import-section'>
        <KmlIcon className='import-icon kml-icon'/> 
        <Button css='import-button' click={exportKml}>download as kml</Button>
      </div>
      <div className='import-section'>
        <XlsxIcon className='import-icon xlsx-icon'/>
        <Button css='import-button' click={exportXlsx}>download as xlsx</Button>
      </div>
    </div>
  )
} 
