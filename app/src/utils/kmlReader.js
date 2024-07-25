import {useEffect, useState} from 'react';

const useReadeKmlFile = () => {
  const [kmlData, setKmlData] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect((start, ) => {
    async function readKml() {
        
    }
  })


  return [kmlData, error, isLoading]
}
