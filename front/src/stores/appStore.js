import { create } from 'zustand';

export const useMapStore = create(set => ({
  map: null,
  markers: [],
  lineStringsId: [],
  markersId: [],

  setMap: (map) => set(() => ({ map: map })),

  addMarker: (m) => set(state => ({ markers: [...state.markers, m] })),
  resetMarkers: () => set(() => ({ markers: [] })),
  addLineString: (l) => set(s => ({ lineStringsId: [...s.lineStringsId, l] })),
  resetLineStrings: () => set(() => ({ lineStringsId: [] })),
}));

export const useDownloadStore = create(set => ({
  title: '',
  date: '',
  aoa: '',

  setTitle: (t) => set(() => ({title: t})),
  setDate: (d) => set(() => ({date: d})),
  setAoa: (a) => set(() => ({aoa: a}))
}))


export const useMapInfoStore = create(set => ({
  importMarkers: [],
  resultMarkers: [],
  importLineStrings: [],
  resultLineStrings: [],
  startingMarker: null,
  endingMarker: null,

  setImportMarkers: (importMarkers) => set(state => ({
    importMarkers: importMarkers
  })),


  setResultMarkers: (resultMarkers) => set(state => ({
    resultMarkers: resultMarkers
  })),

  setImportLineStrings: (lineStrings) => set(state => ({
    importLineStrings: lineStrings
  })),

  setResultLineStrings: (lineStrings) => set(state => ({
    resultLineStrings: lineStrings
  })),
  
  setStartingMarker: (marker) => set(state => ({
    startingMarker: marker
  })),

  setEndingMarker: (marker) => set(state => ({
    endingMarker: marker
  })),

  resetInfo: () => set(() => ({
    importMarkers: [],
    resultMarkers: [],
    importLineStrings: [],
    startingMarker: null,
    endingMarker: null,
  })),
}))

export const useKmlDataStore = create(set => ({
  kmlData: '',
  setKmlData: (kmlData) => set(state => ({ kmlData: kmlData })),
}))

export const useVisibilityStore = create(set => ({
  downloadWindow: false,
  exportBox: false,

  downloadWindowToggle: () => set(state => ({
    downloadWindow: !state.downloadWindow
  })),

  exportBoxToggle: () => set((s) => ({exportBox: !s.exportBox})), 

}))

export const useAoaStore = create(set => ({
  aoa: [],
  imageDatat: '',
  setAoa: (aoa) => set(state => ({ aoa: aoa })),
}))

