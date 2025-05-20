import { combineReducers } from "redux";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import bindSelectors from "./utils/bindSelectors";

import entities, * as fromEntities from "./entities";

import users, * as fromUsers from "./users";
import items, * as fromItems from "./items";
import sidebar, * as fromSidebar from "./sidebar";

import pagination, * as fromPagination from "./pagination";
import isFetching, * as fromIsFetching from "./isFetching";
import drawer, * as fromDrawer from "./drawer";

// import playerReducer, * as fromPlayerReducer from "core/reducers/playerReducer";
// import { tracksReducer } from "core/tracks";
// import {playerTimesReducer} from "core/tracks";
// import { tracklistsReducer } from "core/tracklists";
// import { playerTimesReducer } from "core/player";



const persistConfig = {
  key: 'user',
  storage,
};

const appReducer = combineReducers({
  // authorization: authorizationReducer,
  entities: entities,
  pagination: pagination,
  isFetching: isFetching,
  drawer: drawer,
  // playerReducer: playerReducer,
  // player: playerReducer,
  // playerTimes: playerTimesReducer,
  // tracklists: tracklistsReducer,
  // tracks: tracksReducer,
  items: items,
  sidebar: sidebar,
  // soundReducer,
  users: persistReducer(persistConfig, users)
});

// Default export is the "reducer".

const rootReducer = (state, action) => {
  // when a logout action is dispatched it will reset redux state
  if (action.type === 'USER_LOGGED_OUT') {
    state = undefined;
    // const { entities, pagination, isFetching, drawer } = state;
    // state = {entities, pagination, isFetching, drawer}
    storage.removeItem('persist:user')
  }

  if (action.type === 'USER_LOGGED_IN') {

    // const { users, comment, orders } = state;

    // state = { users, comment, orders };
  }

  return appReducer(state, action);
};

export default rootReducer;

// Selectors

// We will use these selectors in out components.
// So, we won't need to update every single of those selector calls if the state shape changes in the future.
// By this usage, the "state" parameter of selectors in the reducer files will be the state slice of the same reducer in that file.
// Because of we are using the same selector name in the reducer file, we can't use same name again.
// Thus, we used "namespace import syntax" (i.e. "* as fromEntities").

export const selectors = {
  ...bindSelectors(state => state.entities, fromEntities.selectors),
  ...bindSelectors(state => state.users, fromUsers.selectors),
  ...bindSelectors(state => state.items, fromItems.selectors),
  ...bindSelectors(state => state.drawer, fromDrawer.selectors),
  ...bindSelectors(state => state.isFetching, fromIsFetching.selectors),
  ...bindSelectors(state => state.pagination, fromPagination.selectors),
  // ...bindSelectors(state => state.playerReducer, fromPlayerReducer.selectors)
  // ...bindSelectors(state => state.authorization, fromPlayerReducer.selectors)
};
