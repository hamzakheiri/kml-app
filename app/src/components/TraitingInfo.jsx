import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from 'react';
import { useMapInfoStore } from '../stores/appStore';

export default function TraitingInfo() {
  // const [age, setAge] = useState(0);
  const { 
    importMarkers,
    startingMarker,
    endingMarker,
    setStartingMarker,
    setEndingMarker,
  } = useMapInfoStore();

  return (
    <div className="traiting-info">
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-label">starting point</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={startingMarker ? startingMarker : 'none'}
          label="starting point"
          onChange={(e) => { setStartingMarker(e.target.value)}}
        >
          {importMarkers && importMarkers.length != 0 && importMarkers.map(m => {
            return <MenuItem key={`starting-${m.name}-${m.long}`} value={m.name}> {m.name} </MenuItem>
          })}
        </Select>
      </FormControl>
      
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-label">ending point</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={endingMarker ? endingMarker : 'none'}
          label="ending point"
          onChange={(e) => {setEndingMarker(e.target.value)}}
        >
          {importMarkers && importMarkers.length != 0 && importMarkers.map(m => {
            return <MenuItem key={`ending-${m.name}-${m.long}`} value={m.name}> {m.name} </MenuItem>
          })}
        </Select>
      </FormControl>
    </div>
  )
}
