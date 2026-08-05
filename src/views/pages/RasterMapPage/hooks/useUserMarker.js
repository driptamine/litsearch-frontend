import { useEffect, useRef } from 'react';
import { Marker } from 'maplibre-gl';

import { MAX_ACCURACY_CIRCLE_METERS } from '../constants';

const ACCURACY_SOURCE_ID = 'litloop-user-accuracy';
const ACCURACY_LAYER_ID = 'litloop-user-accuracy-layer';

const metersToPixelsAtZoom = (meters, latitude, zoom) => {
  const metersPerPixel =
    (156543.03392 * Math.cos((latitude * Math.PI) / 180)) / Math.pow(2, zoom);
  return meters / metersPerPixel;
};

const makeAccuracyFeature = (position, radiusPx) => ({
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [position.lng, position.lat] },
      properties: { radius: Math.max(3, radiusPx) },
    },
  ],
});

// Renders the user location: a blue dot marker + an accuracy circle layer.
// The marker moves on every position fix and is created as soon as both the
// map and a position exist (it does not depend on the style 'load' event).
// The circle keeps a true meter radius by recomputing on 'zoom'.
export default function useUserMarker(map, position, isLoaded) {
  const markerRef = useRef(null);
  const markerMapRef = useRef(null);
  const lastPositionRef = useRef(null);

  const updateAccuracyCircle = (source, mapInstance) => {
    const current = lastPositionRef.current;
    if (!source || !current) return;
    const { lat, accuracy } = current;
    const meters = Math.min(accuracy, MAX_ACCURACY_CIRCLE_METERS);
    const radiusPx = metersToPixelsAtZoom(meters, lat, mapInstance.getZoom());
    source.setData(makeAccuracyFeature(current, radiusPx));
  };

  // One-time layer setup + zoom listener (requires a loaded style).
  useEffect(() => {
    if (!map || !isLoaded) return undefined;

    if (!map.getSource(ACCURACY_SOURCE_ID)) {
      map.addSource(ACCURACY_SOURCE_ID, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });
      map.addLayer({
        id: ACCURACY_LAYER_ID,
        type: 'circle',
        source: ACCURACY_SOURCE_ID,
        paint: {
          'circle-radius': ['get', 'radius'],
          'circle-color': 'rgba(29, 155, 240, 0.16)',
          'circle-stroke-color': 'rgba(29, 155, 240, 0.5)',
          'circle-stroke-width': 1,
        },
      });
    }

    const source = map.getSource(ACCURACY_SOURCE_ID);
    if (lastPositionRef.current) updateAccuracyCircle(source, map);

    const onZoom = () => updateAccuracyCircle(source, map);
    map.on('zoom', onZoom);

    return () => {
      map.off('zoom', onZoom);
      if (map.getLayer(ACCURACY_LAYER_ID)) map.removeLayer(ACCURACY_LAYER_ID);
      if (map.getSource(ACCURACY_SOURCE_ID)) map.removeSource(ACCURACY_SOURCE_ID);
    };
  }, [map, isLoaded]);

  // Marker moves on every position fix.
  useEffect(() => {
    if (!map || !position) return;

    lastPositionRef.current = position;
    const { lat, lng } = position;

    // The map instance may be re-created (StrictMode remount, retry button).
    // Drop a marker attached to a previous map so it is re-created here.
    if (markerRef.current && markerMapRef.current !== map) {
      markerRef.current.remove();
      markerRef.current = null;
      markerMapRef.current = null;
    }

    if (!markerRef.current) {
      const element = document.createElement('div');
      element.className = 'litloop-user-marker';
      markerMapRef.current = map;
      markerRef.current = new Marker({ element, anchor: 'center' })
        .setLngLat([lng, lat])
        .addTo(map);
    } else {
      markerRef.current.setLngLat([lng, lat]);
    }

    const source = map.getSource(ACCURACY_SOURCE_ID);
    if (source) updateAccuracyCircle(source, map);
  }, [map, position]);

  // Clean up the marker when the page unmounts.
  useEffect(() => {
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
        markerMapRef.current = null;
      }
    };
  }, []);
}
