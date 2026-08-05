import { useCallback, useEffect, useRef, useState } from 'react';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import useGeolocation, { GEOLOCATION_STATUS } from '../../RasterMapPage/hooks/useGeolocation';
import useUserMarker from '../../RasterMapPage/hooks/useUserMarker';

import {
  VECTOR_TILE_STYLE_URL,
  INITIAL_CENTER,
  INITIAL_ZOOM,
  MIN_ZOOM,
  MAX_ZOOM,
  USER_ZOOM,
} from '../../RasterMapPage/constants';

// Stable reference so react-map-gl doesn't remount the map on re-render.
const INITIAL_VIEW_STATE = {
  longitude: INITIAL_CENTER[0],
  latitude: INITIAL_CENTER[1],
  zoom: INITIAL_ZOOM,
};

// Vector map built on react-map-gl/maplibre (declarative wrapper around
// MapLibre). Returns the Map component + props for the page to render, plus
// the loaded maplibre instance and geolocation state, mirroring the imperative
// useMap hook used by /maps.
export default function useVectorMap() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const hasCenteredRef = useRef(false);

  const { position, status, error, start } = useGeolocation({ autoStart: true });

  const onLoad = useCallback((evt) => {
    setMap(evt.target);
    setIsLoaded(true);
    setLoadError(null);
  }, []);

  const onError = useCallback((evt) => {
    console.error('[VectorMapPage] map error:', evt.error);
    setLoadError('Не удалось загрузить карту. Проверьте подключение к интернету и обновите страницу.');
  }, []);

  useUserMarker(map, position, isLoaded);

  // Reset the centering guard when the map instance changes (StrictMode
  // remount) so the fresh map centers on the user again.
  useEffect(() => {
    hasCenteredRef.current = false;
  }, [map]);

  // Center the camera ONLY on the first successful fix.
  // Subsequent updates move the marker but must not move the camera.
  useEffect(() => {
    if (!map || !isLoaded || !position || hasCenteredRef.current) return;
    hasCenteredRef.current = true;
    map.flyTo({ center: [position.lng, position.lat], zoom: USER_ZOOM, essential: true });
  }, [map, isLoaded, position]);

  const handleLocate = useCallback(() => {
    if (!map || !isLoaded) return;

    if (position) {
      map.flyTo({ center: [position.lng, position.lat], zoom: USER_ZOOM, essential: true });
      return;
    }

    // No fix yet and tracking not running -> start tracking (first fix will center).
    if (status !== GEOLOCATION_STATUS.TRACKING) {
      start();
    }
  }, [map, isLoaded, position, status, start]);

  return {
    Map,
    mapProps: {
      ref: mapRef,
      mapStyle: VECTOR_TILE_STYLE_URL,
      initialViewState: INITIAL_VIEW_STATE,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      attributionControl: true,
      onLoad,
      onError,
    },
    map,
    isLoaded,
    position,
    status,
    error,
    loadError,
    onLocate: handleLocate,
  };
}
