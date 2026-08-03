import { useCallback, useEffect, useRef, useState } from 'react';

import { GEOLOCATION_OPTIONS, GEOLOCATION_ERRORS } from '../constants';

export const GEOLOCATION_STATUS = {
  IDLE: 'idle',
  WAITING: 'waiting',
  TRACKING: 'tracking',
  ERROR: 'error',
  UNSUPPORTED: 'unsupported',
};

const resolveErrorMessage = (code) => {
  switch (code) {
    case 1:
      return GEOLOCATION_ERRORS.PERMISSION_DENIED;
    case 2:
      return GEOLOCATION_ERRORS.POSITION_UNAVAILABLE;
    case 3:
      return GEOLOCATION_ERRORS.TIMEOUT;
    default:
      return GEOLOCATION_ERRORS.UNKNOWN;
  }
};

// Wraps navigator.geolocation.watchPosition() with a safe lifecycle:
// - keeps a single active watch (watchId) at a time;
// - clears the watch on unmount;
// - maps GeolocationPositionError codes to human-readable messages.
export default function useGeolocation({ autoStart = true } = {}) {
  const [position, setPosition] = useState(null); // { lat, lng, accuracy, timestamp }
  const [status, setStatus] = useState(GEOLOCATION_STATUS.IDLE);
  const [error, setError] = useState(null); // { code, message }
  const watchIdRef = useRef(null);

  const start = useCallback(() => {
    // Do not request geolocation again if watchPosition is already running.
    if (watchIdRef.current !== null) return;

    if (!('geolocation' in navigator)) {
      setStatus(GEOLOCATION_STATUS.UNSUPPORTED);
      setError({ code: 'unsupported', message: GEOLOCATION_ERRORS.unsupported });
      return;
    }

    setStatus(GEOLOCATION_STATUS.WAITING);
    setError(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setPosition({
          lat: latitude,
          lng: longitude,
          accuracy: accuracy || 0,
          timestamp: pos.timestamp,
        });
        setStatus(GEOLOCATION_STATUS.TRACKING);
        setError(null);
      },
      (err) => {
        setError({ code: err.code, message: resolveErrorMessage(err.code) });
        setStatus(GEOLOCATION_STATUS.ERROR);
      },
      GEOLOCATION_OPTIONS,
    );
  }, []);

  const stop = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setStatus(GEOLOCATION_STATUS.IDLE);
  }, []);

  useEffect(() => {
    if (autoStart) start();

    return () => {
      // Clear the watch on unmount to release browser resources.
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [autoStart, start]);

  return { position, status, error, start, stop };
}
