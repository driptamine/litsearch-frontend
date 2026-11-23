import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';

import bindSelectors from './utils/bindSelectors';

// Traditional Reducers (Files)
import userReducer, * as fromUsers from './userReducer';
import oauthReducer from './oauthReducer';
import postReducer from './postReducer';
import movieReducer from './movieReducer';
import trackReducer from './trackReducer';
import albumReducer from './albumReducer';
import playlistReducer from './playlistReducer';
import websiteReducer from './websiteReducer';
import queryReducer from './queryReducer';
import { playerReducer } from './playerReducer';

// Core/Original Reducers
import entities, * as fromEntities from './entities';
import items, * as fromItems from './items';
import sidebar, * as fromSidebar from './sidebar';
import drawer, * as fromDrawer from './drawer';
import pagination, * as fromPagination from './standard/pagination';
import isFetching, * as fromIsFetching from './standard/isFetching';
import uploadReducer from './uploadReducer';
import { modalSwitchReducer } from './modalSwitchReducer';

const appReducer = combineReducers({
  // Use keys that the application expects
  users: userReducer,
  pagination: pagination,
  isFetching: isFetching,
  entities: entities,
  items: items,
  sidebar: sidebar,
  drawer: drawer,
  playerReducer: playerReducer,
  
  // Additional slices
  oauth: oauthReducer,
  posts: postReducer,
  movies: movieReducer,
  tracks: trackReducer,
  albums: albumReducer,
  playlists: playlistReducer,
  websites: websiteReducer,
  queries: queryReducer,
  upload: uploadReducer,
  modalSwitch: modalSwitchReducer,
});

const rootReducer = (state, action) => {
  // Clear state on logout
  if (action.type === 'USER_LOGGED_OUT' || action.type === 'USER_LOGGEDOUT') {
    state = undefined;
    storage.removeItem('persist:user');
    storage.removeItem('persist:root');
  }

  return appReducer(state, action);
};

export default rootReducer;

// Selectors
export const selectors = {
  ...bindSelectors(state => state.entities, fromEntities.selectors),
  ...bindSelectors(state => state.users, fromUsers.selectors),
  ...bindSelectors(state => state.items, fromItems.selectors),
  ...bindSelectors(state => state.drawer, fromDrawer.selectors),
  ...bindSelectors(state => state.isFetching, fromIsFetching.selectors),
  ...bindSelectors(state => state.pagination, fromPagination.selectors),
};
