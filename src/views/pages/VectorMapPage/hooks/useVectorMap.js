import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import useGeolocation, { GEOLOCATION_STATUS } from '../../RasterMapPage/hooks/useGeolocation';
import useUserMarker from '../../RasterMapPage/hooks/useUserMarker';

import {
  VECTOR_TILE_STYLE_URL,
  VECTOR_TILE_STYLE,
  INITIAL_CENTER,
  INITIAL_ZOOM,
  MIN_ZOOM,
  MAX_ZOOM,
  USER_ZOOM,
} from '../../RasterMapPage/constants';

// Stable reference so react-map-gl doesn't remount the map on re-render.
const DEFAULT_VIEW_STATE = {
  longitude: INITIAL_CENTER[0],
  latitude: INITIAL_CENTER[1],
  zoom: INITIAL_ZOOM,
};

// Position embedded in the URL query (?lat=..&lng=..&z=..) so map views are
// shareable. Returns null when the params are missing/invalid.
function parseMapPosition(search) {
  const params = new URLSearchParams(search);
  const lat = Number(params.get('lat'));
  const lng = Number(params.get('lng'));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const zoom = Number(params.get('z'));
  return {
    lat,
    lng,
    zoom: Number.isFinite(zoom) ? Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom)) : INITIAL_ZOOM,
  };
}

function round(value, digits) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

// The remote liberty style has no housenumber layer (and being remote it can't
// be edited in place), so it is fetched once, given one (from VECTOR_TILE_STYLE),
// and passed to react-map-gl as a style object.
async function loadVectorStyle() {
  const res = await fetch(VECTOR_TILE_STYLE_URL);
  if (!res.ok) {
    throw new Error(`Failed to load map style (${res.status})`);
  }
  const style = await res.json();
  const housenumberLayer = VECTOR_TILE_STYLE.layers.find((layer) => layer.id === 'housenumber');
  if (housenumberLayer && !style.layers.some((layer) => layer.id === 'housenumber')) {
    style.layers = [...style.layers, housenumberLayer];
  }
  return style;
}

// Vector map built on react-map-gl/maplibre (declarative wrapper around
// MapLibre). Returns the Map component + props for the page to render, plus
// the loaded maplibre instance and geolocation state, mirroring the imperative
// useMap hook used by /maps.
export default function useVectorMap() {
  const location = useLocation();
  const history = useHistory();
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [style, setStyle] = useState(null);
  const hasCenteredRef = useRef(false);

  // Read once on mount — the URL only seeds the initial camera; afterwards the
  // camera follows the user's panning and the URL follows the camera.
  const urlPositionRef = useRef(parseMapPosition(location.search));
  const urlPosition = urlPositionRef.current;

  const initialViewState = urlPosition
    ? { longitude: urlPosition.lng, latitude: urlPosition.lat, zoom: urlPosition.zoom }
    : DEFAULT_VIEW_STATE;

  const { position, status, error, start } = useGeolocation({ autoStart: true });

  useEffect(() => {
    let cancelled = false;
    loadVectorStyle()
      .then((loaded) => {
        if (cancelled) return;
        setStyle(loaded);
        setLoadError(null);
      })
      .catch((err) => {
        console.error('[VectorMapPage] style load failed:', err);
        if (!cancelled) {
          setLoadError('Не удалось загрузить карту. Проверьте подключение к интернету и обновите страницу.');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const onLoad = useCallback((evt) => {
    setMap(evt.target);
    setIsLoaded(true);
    setLoadError(null);
  }, []);

  const onError = useCallback((evt) => {
    console.error('[VectorMapPage] map error:', evt.error);
    setLoadError('Не удалось загрузить карту. Проверьте подключение к интернету и обновите страницу.');
  }, []);

  // Keep the current center in the URL (?lat=..&lng=..&z=..) after every move.
  // history.replace (not push) so panning doesn't spam the back stack.
  const onMoveEnd = useCallback(
    (evt) => {
      const { longitude, latitude, zoom } = evt.viewState;
      history.replace({
        search: `lat=${round(latitude, 6)}&lng=${round(longitude, 6)}&z=${round(zoom, 2)}`,
      });
    },
    [history],
  );

  useUserMarker(map, position, isLoaded);

  // Reset the centering guard when the map instance changes (StrictMode
  // remount) so the fresh map centers on the user again.
  useEffect(() => {
    hasCenteredRef.current = false;
  }, [map]);

  // Center the camera ONLY on the first successful fix — unless the map was
  // opened at a URL position, which takes priority (shareable links).
  // Subsequent updates move the marker but must not move the camera.
  useEffect(() => {
    if (!map || !isLoaded || !position || urlPosition || hasCenteredRef.current) return;
    hasCenteredRef.current = true;
    map.flyTo({ center: [position.lng, position.lat], zoom: USER_ZOOM, essential: true });
  }, [map, isLoaded, position, urlPosition]);

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
      mapStyle: style,
      initialViewState,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      attributionControl: true,
      onLoad,
      onError,
      onMoveEnd,
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
