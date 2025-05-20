//   https://chatgpt.com/c/6706b167-c398-800c-ab5d-906cf6ace39d https://chatgpt.com/c/6755a95b-ea70-800c-bc42-cd570caa8f1f
import { combineReducers } from 'redux';
import userReducer from 'core/reducersV2/userReducer';
import oauthReducer from 'core/reducersV2/oauthReducer';
import postReducer from 'core/reducersV2/postReducer';

import movieReducer from 'core/reducersV2/movieReducer';
import trackReducer from 'core/reducersV2/trackReducer';
import albumReducer from 'core/reducersV2/albumReducer';
import playlistReducer from 'core/reducersV2/playlistReducer';

const rootReducer = combineReducers({
  user: userReducer,
  oauth: oauthReducer,
  posts: postReducer,

  movies: movieReducer,
  tracks: trackReducer,
  albums: albumReducer,
  playlists: playlistReducer,

  sidebar: {},
});

export default rootReducer;
