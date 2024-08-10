import '../style/download-window.css'
import { TextField, Button, Typography , IconButton} from "@mui/material";
import { useRef, useState } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import {
  useVisibilityStore,
  useAoaStore,
  useMapStore,
  useDownloadStore,
  useMapInfoStore,
  useGraphStore
} from "../stores/appStore"
import { imageData } from '../utils/imageData';
import { v4 } from 'uuid';
import axios from 'axios';

import ClearIcon from '@mui/icons-material/Clear';
import { createAoa } from '../utils/calc';

export default function DownloadWindow() {
  const { downloadWindow, downloadWindowToggle } = useVisibilityStore();
  const documentTitle = useRef(null);
  const fileName = useRef(null);
  const map = useMapStore();
  const {importMarkers} = useMapInfoStore();
  const {graph, path} = useGraphStore(); 
  const down = useDownloadStore();
  const [date, setDate] = useState(dayjs('2021-01-01'))
  const [error, setError] = useState('');

  const download = async () => {
    const title = documentTitle.current.value;
    const tfileName = fileName.current.value;
    
    const aoa = createAoa(graph, path, importMarkers);
    if (title === '') {
      setError('Document Title is required');
      return;
    }

    if (tfileName === '') {
      setError('File Name is required');
      return;
    }

    down.setTitle(title);
    down.setDate(date);
    down.setAoa(aoa);

    const blob = await imageData(map);
    const formData = new FormData();
    formData.append('file', blob, `map_screenshot${v4()}.png`);
    formData.append('aoa', aoa);
    formData.append('title', title);
    const d = `${date.$D}-${date.month() + 1}-${date.year()}`;
    formData.append('date', d);
    formData.append('fileName', tfileName);
    try {
      const response = await axios.post('http://localhost:5000/xlsx-handler/createReport', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'blob',
      });
        const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${tfileName}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
        } catch (e) {
      console.error(e);
    }
    if (error)
      setError('');
  }

  return (
    <div className={`download-window ${downloadWindow ? 'active' : ''}`}>
      {/* <input type='text' id="document-title"/> */}
      <IconButton className="exit-icon" aria-label="delete" onClick={() => {downloadWindowToggle()}}>  
        <ClearIcon/> 
      </IconButton>
      <TextField label="Document Title" variant="outlined" className='document-title' inputRef={documentTitle}></TextField>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Document Date"
          value={date}
          onChange={(date) => setDate(date)}
          required={true}
          className='document-date'
        />
      </LocalizationProvider>
      <TextField label="File Name" variant="outlined" className='document-title' inputRef={fileName}></TextField>
      <Typography variant="body2" color="error">{error}</Typography>
      <Button variant="outlined" onClick={download}>download</Button>

    </div>)
}
