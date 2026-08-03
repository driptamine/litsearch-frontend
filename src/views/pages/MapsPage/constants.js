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
