// api/index.js
import axios from 'axios';
const API_KEY = 'bceb6c0fefae8ee5a3cf9762ec780d63';
const API_BASE_URL = 'https://your-api-url.com';
const BASE_API_URL = "//api.themoviedb.org/3";

export const fetchMovies = async (payload) => {
  // const { id } = payload;
  const response = await axios.get(`${BASE_API_URL}/movie/popular?api_key=${API_KEY}`);
  return response.data; // Assuming the API returns user data in the response body
};

export default {
  fetchMovies: () => axios.get(`${BASE_API_URL}/movie/popular`),

  fetchTracks: () => axios.get(`${API_BASE_URL}/tracks`),
  fetchPlaylists: () => axios.get(`${API_BASE_URL}/playlists`),
  fetchAlbums: () => axios.get(`${API_BASE_URL}/albums`),
};
