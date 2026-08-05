import React from 'react';
import { styled } from '@linaria/react';

import useVectorMap from './hooks/useVectorMap';
import { GEOLOCATION_STATUS } from '../RasterMapPage/hooks/useGeolocation';

import LocateButton from '../RasterMapPage/components/LocateButton';
import StatusBar from '../RasterMapPage/components/StatusBar';
import ErrorBanner from '../RasterMapPage/components/ErrorBanner';

// Vector-tile rendering (OpenFreeMap) via react-map-gl/maplibre — same
// live-tracking layout as /maps.
const VectorMapPage = () => {
  const { Map, mapProps, map, isLoaded, position, status, error, loadError, onLocate } =
    useVectorMap();

  return (
    <Root>
      <Map {...mapProps} />
      <StatusBar status={status} position={position} />
      <LocateButton
        onLocate={onLocate}
        active={status === GEOLOCATION_STATUS.TRACKING}
        disabled={!map || !isLoaded}
      />
      {error && <ErrorBanner message={error.message} />}
      {!error && loadError && <ErrorBanner message={loadError} />}
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

export default VectorMapPage;
