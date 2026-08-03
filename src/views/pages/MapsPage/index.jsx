import React, { useCallback, useEffect, useRef } from 'react';
import { styled } from '@linaria/react';

import useMap from './hooks/useMap';
import useGeolocation, { GEOLOCATION_STATUS } from './hooks/useGeolocation';
import useUserMarker from './hooks/useUserMarker';

import LocateButton from './components/LocateButton';
import StatusBar from './components/StatusBar';
import ErrorBanner from './components/ErrorBanner';

import { USER_ZOOM } from './constants';
import './styles.css';

// Maps page: full-screen MapLibre map (except the Sidebar) centered on Almaty,
// with live user tracking via navigator.geolocation.watchPosition().
const MapsPage = () => {
  const containerRef = useRef(null);
  const { map, isLoaded, loadError, reload } = useMap(containerRef);
  const { position, status, error, start } = useGeolocation({ autoStart: true });
  const hasCenteredRef = useRef(false);

  useUserMarker(map, position, isLoaded);

  // Reset the centering guard when the map instance changes (StrictMode
  // remount, retry) so the fresh map centers on the user again.
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

  return (
    <Root>
      <MapContainer ref={containerRef} />
      <StatusBar status={status} position={position} />
      <LocateButton
        onLocate={handleLocate}
        active={status === GEOLOCATION_STATUS.TRACKING}
        disabled={!map || !isLoaded}
      />
      {error && <ErrorBanner message={error.message} />}
      {!error && loadError && <ErrorBanner message={loadError} onRetry={reload} />}
    </Root>
  );
};

const Root = styled.div`
  position: relative;
  width: 100%;
  height: calc(100vh - 60px);
  overflow: hidden;

  @media screen and (max-width: 768px) {
    height: calc(100vh - 70px);
  }
`;

const MapContainer = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: #1a1a1a;
`;

export default MapsPage;
