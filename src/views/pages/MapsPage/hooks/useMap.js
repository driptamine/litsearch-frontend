import { useEffect, useRef, useState } from 'react';
import { Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import {
  TILE_STYLE,
  INITIAL_CENTER,
  INITIAL_ZOOM,
  MIN_ZOOM,
  MAX_ZOOM,
  MAP_LOAD_ERROR_MESSAGE,
  WEBGL2_ERROR_MESSAGE,
} from '../constants';

const hasWebGL2 = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2'));
  } catch (e) {
    return false;
  }
};

const isWebGLError = (err) =>
  err && (err.name === 'GPUInitializationError' || /webgl/i.test(err.message || ''));

// Creates a MapLibre GL map inside `containerRef` and destroys it on unmount.
// `reload` re-creates the map (e.g. after a transient network failure).
export default function useMap(containerRef) {
  const mapRef = useRef(null);
  const hasLoadedRef = useRef(false);
  const errorTimerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const reload = () => setRetryCount((count) => count + 1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    // MapLibre v5+ requires WebGL2. Detect it first to show an accurate message
    // instead of a generic "no internet" error.
    if (!hasWebGL2()) {
      setLoadError(WEBGL2_ERROR_MESSAGE);
      return undefined;
    }

    let instance;
    try {
      instance = new MapLibreMap({
        container,
        style: TILE_STYLE,
        center: INITIAL_CENTER,
        zoom: INITIAL_ZOOM,
        minZoom: MIN_ZOOM,
        maxZoom: MAX_ZOOM,
        attributionControl: true,
      });
    } catch (err) {
      // Synchronous construction failure (e.g. WebGL context creation failed).
      console.error('[MapsPage] map creation failed:', err);
      setLoadError(isWebGLError(err) ? WEBGL2_ERROR_MESSAGE : MAP_LOAD_ERROR_MESSAGE);
      return undefined;
    }

    const onLoad = () => {
      hasLoadedRef.current = true;
      setIsLoaded(true);
      setLoadError(null);
    };

    // Surface failures while the map is still loading. Transient errors after
    // load are ignored, and the WebGL case gets its own accurate message.
    const onError = (e) => {
      if (e && e.error && !hasLoadedRef.current) {
        console.error('[MapsPage] map error:', e.error);
        setLoadError(isWebGLError(e.error) ? WEBGL2_ERROR_MESSAGE : MAP_LOAD_ERROR_MESSAGE);
      }
    };

    instance.on('load', onLoad);
    instance.on('error', onError);

    // If the style hasn't loaded within 15s, report it as a failure.
    errorTimerRef.current = setTimeout(() => {
      if (!hasLoadedRef.current) setLoadError(MAP_LOAD_ERROR_MESSAGE);
    }, 15000);

    mapRef.current = instance;
    setMap(instance);

    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      instance.off('load', onLoad);
      instance.off('error', onError);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      hasLoadedRef.current = false;
      setMap(null);
      setIsLoaded(false);
      setLoadError(null);
    };
  }, [containerRef, retryCount]);

  return { map, isLoaded, loadError, reload };
}
