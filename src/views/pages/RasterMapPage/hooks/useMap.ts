import { useEffect, useRef, useState } from 'react';
import { Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import {
  TILE_STYLE,
  TILE_ERROR_THRESHOLD,
  NO_VECTOR_SOURCES,
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

// Tile/source fetch failures and a watchdog for silent drops both lead here.
const TILE_ERROR_RE = /tile|failed to fetch|network|source/i;
const TILE_WATCHDOG_MS = 10000;

// Creates a MapLibre GL map inside `containerRef` and destroys it on unmount.
// `reload` re-creates the map (e.g. after a transient network failure).
// When the requested `style` (e.g. OpenFreeMap vector tiles) fails to deliver
// tiles, the map falls back to the reliable OSM raster style — unless
// `enableFallback` is false, in which case the load error is shown instead.
//
// `vectorSourceIds` lists the source ids inside `style` that produce vector
// tiles. When non-empty and none of them ever delivered content within the
// watchdog window, the fallback runs. Must be a stable reference (see
// NO_VECTOR_SOURCES) so the effect below doesn't re-run and recreate the map.
export default function useMap(
  containerRef,
  style = TILE_STYLE,
  vectorSourceIds = NO_VECTOR_SOURCES,
  enableFallback = true,
) {
  const mapRef = useRef(null);
  const hasLoadedRef = useRef(false);
  const errorTimerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);
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
    let tileErrorCount = 0;
    let hasVectorContent = false;
    let watchdogTimer = null;
    let fallbackApplied = false;
    try {
      instance = new MapLibreMap({
        container,
        style,
        center: INITIAL_CENTER,
        zoom: INITIAL_ZOOM,
        minZoom: MIN_ZOOM,
        maxZoom: MAX_ZOOM,
        attributionControl: true,
      });
    } catch (err) {
      // Synchronous construction failure (e.g. WebGL context creation failed).
      console.error('[RasterMapPage] map creation failed:', err);
      setLoadError(isWebGLError(err) ? WEBGL2_ERROR_MESSAGE : MAP_LOAD_ERROR_MESSAGE);
      return undefined;
    }

    const onLoad = () => {
      hasLoadedRef.current = true;
      setIsLoaded(true);
      setLoadError(null);

      // Some vector hosts fail silently (no error events) while a raster
      // background source still loads. Watch for that: if none of the vector
      // sources delivered content within the window, fall back to raster.
      if (enableFallback && vectorSourceIds.length > 0) {
        watchdogTimer = setTimeout(() => {
          if (!hasVectorContent) handleTileUnavailable();
        }, TILE_WATCHDOG_MS);
      }
    };

    // With fallback enabled, switch to the reliable raster style once. Guards
    // against re-entrancy. Otherwise surface the load error to the user.
    const handleTileUnavailable = () => {
      if (enableFallback) {
        if (fallbackApplied) return;
        fallbackApplied = true;
        console.error('[RasterMapPage] switching to raster tiles: requested tiles unavailable');
        setIsFallback(true);
        try {
          instance.setStyle(TILE_STYLE);
        } catch (err) {
          console.error('[RasterMapPage] raster fallback failed:', err);
        }
      } else if (!hasLoadedRef.current) {
        setLoadError(MAP_LOAD_ERROR_MESSAGE);
      }
    };

    // A successfully rendered vector tile marks the vector path as working. The
    // failure counter is NOT reset on success: a host that drops most requests
    // must still be detected.
    const onData = (e) => {
      if (e && e.sourceDataType === 'content' && vectorSourceIds.includes(e.sourceId)) {
        hasVectorContent = true;
      }
    };

    // Tile/source fetch failures accumulate; past the threshold we fall back to
    // raster tiles. A fetch failure before the map ever loads is the style/TileJSON
    // fetch itself — fall back immediately. Non-tile errors only surface while the
    // map is still loading.
    const onError = (e) => {
      const err = e && e.error;
      const msg = (err && err.message) || '';
      if (TILE_ERROR_RE.test(msg)) {
        console.error('[RasterMapPage] tile error:', msg);
        if (!hasLoadedRef.current || ++tileErrorCount >= TILE_ERROR_THRESHOLD) {
          handleTileUnavailable();
        }
        return;
      }
      if (!hasLoadedRef.current) {
        console.error('[RasterMapPage] map error:', err);
        setLoadError(isWebGLError(err) ? WEBGL2_ERROR_MESSAGE : MAP_LOAD_ERROR_MESSAGE);
      }
    };

    instance.on('load', onLoad);
    instance.on('error', onError);
    instance.on('data', onData);

    // If the style hasn't loaded within 15s, switch to the reliable raster
    // style — unless a fallback already kicked in. Only if the raster style
    // also fails (no connectivity at all) do we leave the error banner up.
    errorTimerRef.current = setTimeout(() => {
      if (!hasLoadedRef.current && !fallbackApplied) handleTileUnavailable();
    }, 15000);

    mapRef.current = instance;
    setMap(instance);

    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      if (watchdogTimer) clearTimeout(watchdogTimer);
      instance.off('load', onLoad);
      instance.off('error', onError);
      instance.off('data', onData);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      hasLoadedRef.current = false;
      setMap(null);
      setIsLoaded(false);
      setLoadError(null);
      setIsFallback(false);
    };
  }, [containerRef, retryCount, style, vectorSourceIds]);

  return { map, isLoaded, loadError, isFallback, reload };
}
