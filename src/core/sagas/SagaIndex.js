import { all } from "redux-saga/effects";

// import authSagas from "./litloop/auth";
import userSagas from "./litloop/user";
import postSagas from "./litloop/post";

import moviesSagas from "./tmdb/movie";
import personSagas from "./tmdb/person";
// import searchSagas from './tmdb/search';

import searchSagas from './litloop/search';

import artistSagas from "./spotify/artist";
import albumSagas from "./spotify/album";
import trackSagas from "./spotify/track";
import playlistSagas from "./spotify/playlist";
import playerSagas from "./spotify/player";

// import routingSagas from "./routing";

export default function* root() {
  yield all([

    // ...authSagas,
    ...userSagas,
    ...postSagas,

    ...moviesSagas,
    ...personSagas,
    ...searchSagas,

    ...artistSagas,
    ...albumSagas,
    ...trackSagas,
    ...playlistSagas,
    ...playerSagas,

    // ...routingSagas
  ]);
}
