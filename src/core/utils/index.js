import { BASE_API_URL, TRACK_API_URL, TRACK_API_URL_SPOTIFY, BING_API_URL } from 'core/constants/urls';
import queryString from 'query-string';

export { localStorageAdapter } from './local-storage';
export { createShallowEqualSelector } from './selectors';

export function getMovieReleaseYear(movie) {
  const date = movie?.release_date;

  if (!date) {
    return null;
  }

  const year = new Date(movie.release_date).getFullYear();
  return year;
}

// const api_key = import.meta.env.REACT_APP_API_KEY;
const api_key = "bceb6c0fefae8ee5a3cf9762ec780d63";

export const createUrl = (endpoint, params = {}) =>
  `${BASE_API_URL}${endpoint}?${queryString.stringify({
    ...params,
    api_key
  })}`;


// OFFSET

export const createAPIUrl = (endpoint, params = {}) =>
  `${TRACK_API_URL}${endpoint}?${queryString.stringify({
    ...params,

  })}`;
export const createAPIUrlPost = (endpoint, params = {}) => `${TRACK_API_URL}${endpoint}`;

export const createSearchAPIUrl = (endpoint, params = {}) =>
  `${TRACK_API_URL}${endpoint}?${queryString.stringify({
    ...params,

  })}`;


// export const createAPIUrl = (endpoint, params = {}) => (
//   `${TRACK_API_URL}${endpoint}`
// )


export const createAuthUrl = (endpoint, params = {}) => `${TRACK_API_URL}${endpoint}`;

export const bingAPIurl = (endpoint, params = {}) =>
  `${BING_API_URL}/v7.0${endpoint}`;

export const createAPIUrlFromSpotify = (endpoint, params = {}) =>
  `${TRACK_API_URL_SPOTIFY}${endpoint}?${queryString.stringify({
    ...params,

  })}`;

export function getImdbProfileUrl(imdbId) {
  return `https://www.imdb.com/title/${imdbId}`;
}

export function getFetchTypes(fetchType) {
  const requestType = `${fetchType}/requested`;
  const successType = `${fetchType}/succeeded`;
  const errorType = `${fetchType}/failed`;
  const cancelType = `${fetchType}/cancelled`;
  return { requestType, successType, errorType, cancelType };
}

// Checking cached data to see if it exists and has all the required fields
export const verifyCachedData = (cachedData, requiredFields = []) => {
  if (!cachedData) {
    return false;
  }

  return requiredFields.every(key => cachedData.hasOwnProperty(key));
};
