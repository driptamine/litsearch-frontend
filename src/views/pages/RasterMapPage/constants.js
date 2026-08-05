// Free vector tiles from OpenStreetMap (OpenFreeMap) were evaluated as primary,
// but OpenMapTiles vector tiles only reach zoom 14 and the host proved flaky
// (connection resets). OSM raster tiles are the reliable primary: free, no API
// key, crisp up to zoom 19, labels included, per OSM tile policy.
export const OSM_RASTER_TILES = ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'];

// Primary map style.
export const TILE_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: OSM_RASTER_TILES,
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
      maxzoom: 19,
    },
  },
  layers: [{ id: 'osm-raster', type: 'raster', source: 'osm' }],
};

// Vector style for /mapsv2 (OpenFreeMap). No API key / registration needed.
// Note: openmaptiles vector tiles stop at zoom 14; above that MapLibre
// overzooms the zoom-14 tiles. The host is also prone to connection resets,
// so /mapsv2 shows a load error instead of falling back to raster.
export const VECTOR_TILE_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';

// Inline vector style — same tiles as VECTOR_TILE_STYLE_URL but self-contained
// (own glyphs + a minimal layer set), so nothing depends on the remote style.
export const VECTOR_TILE_STYLE = {
  version: 8,
  glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
  sources: {
    openmaptiles: {
      type: 'vector',
      url: 'https://tiles.openfreemap.org/planet',
      maxzoom: 14,
    },
  },
  layers: [
    { id: 'background', type: 'background', paint: { 'background-color': '#e8eef4' } },
    {
      id: 'water',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'water',
      paint: { 'fill-color': '#9dc3e6' },
    },
    {
      id: 'landcover',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'landcover',
      paint: { 'fill-color': '#e1e1e1' },
    },
    {
      id: 'road',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      paint: { 'line-color': '#ffffff', 'line-width': ['interpolate', ['linear'], ['zoom'], 5, 1, 18, 6] },
    },
    {
      id: 'place-label',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'place',
      layout: {
        'text-field': ['coalesce', ['get', 'name:en'], ['get', 'name']],
        'text-font': ['Noto Sans Regular'],
        'text-size': 12,
      },
      paint: { 'text-color': '#333333', 'text-halo-color': '#ffffff', 'text-halo-width': 1 },
    },
    {
      id: 'housenumber',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'housenumber',
      minzoom: 16,
      layout: {
        'text-field': ['get', 'housenumber'],
        'text-font': ['Noto Sans Regular'],
        'text-size': 11,
        'text-optional': true,
      },
      paint: {
        'text-color': '#333333',
        'text-halo-color': '#ffffff',
        'text-halo-width': 1.2,
      },
    },
  ],
};

// Stable empty array — avoid re-creating a new one per render (would re-run
// the useMap effect and recreate the map).
export const NO_VECTOR_SOURCES = [];

// Tile-load errors reaching this count trigger the raster fallback.
export const TILE_ERROR_THRESHOLD = 6;

export const RASTER_FALLBACK_MESSAGE =
  'Векторные тайлы недоступны в вашей сети — карта переключена на растровый режим.';

// Almaty, Kazakhstan — [lng, lat] as expected by MapLibre.
export const ALMATY_CENTER = { lat: 43.222015, lng: 76.851248 };
export const INITIAL_CENTER = [ALMATY_CENTER.lng, ALMATY_CENTER.lat];
export const INITIAL_ZOOM = 12;
export const MIN_ZOOM = 2;
export const MAX_ZOOM = 19;

// Zoom level used when centering on the user (first fix + "Мое местоположение" button).
export const USER_ZOOM = 16;

// Options passed to navigator.geolocation.watchPosition().
export const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
};

// Cap for the accuracy circle radius (meters) to avoid huge circles on weak fixes.
export const MAX_ACCURACY_CIRCLE_METERS = 2000;

export const GEOLOCATION_ERRORS = {
  unsupported: 'Ваш браузер не поддерживает Geolocation API.',
  PERMISSION_DENIED: 'Доступ к вашему местоположению запрещён. Разрешите доступ в настройках браузера.',
  POSITION_UNAVAILABLE: 'Не удалось определить ваше местоположение. Попробуйте ещё раз.',
  TIMEOUT: 'Превышено время ожидания геолокации. Попробуйте ещё раз.',
  UNKNOWN: 'Произошла неизвестная ошибка геолокации.',
};

export const MAP_LOAD_ERROR_MESSAGE = 'Не удалось загрузить карту. Проверьте подключение к интернету и обновите страницу.';

export const WEBGL2_ERROR_MESSAGE =
  'Ваш браузер не поддерживает WebGL2 — она необходима для отображения карты. ' +
  'Включите аппаратное ускорение в настройках браузера или обновите его.';
