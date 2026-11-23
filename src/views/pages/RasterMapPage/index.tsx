import React from 'react';

import MapView from './MapView';
import { TILE_STYLE } from './constants';

// Raster OSM tiles (see constants for rationale).
const RasterMapPage = () => <MapView style={TILE_STYLE} />;

export default RasterMapPage;
