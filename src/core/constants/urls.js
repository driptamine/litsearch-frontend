export const BASE_API_URL = "//api.themoviedb.org/3";
// export const BASE_API_URL = "//api.themoviedb.org/3";
// export const TRACK_API_URL = "//localhost:8000";


export const TRACK_API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:8000' : 'http://13.60.29.145'
export const FRONTEND_URL = import.meta.env.MODE === 'development' ? 'http://localhost:3001' : 'https://litloop.netlify.app'
// export const TRACK_API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:8000' : 'https://api.litloop.co'
// export const TRACK_API_URL = import.meta.env.MODE === 'development' ? 'localhost:8000' : 'api.litloop.co'
export const BING_API_URL = "//api.bing.microsoft.com";
export const TRACK_API_URL_SPOTIFY = "//i.scdn.co/";
