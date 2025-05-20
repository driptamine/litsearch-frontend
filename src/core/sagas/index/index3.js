import { put, delay, fork, all, call, select, takeEvery, takeLatest, cancelled} from "redux-saga/effects";
import { getFetchTypes, verifyCachedData, createUrl, createAPIUrl, createAuthUrl } from "core/utils";
import { setAccessToken } from "core/actions";
import * as schemas from "core/schemas";
import * as actions from "core/actions";

// import { watchFetchAlbum, watchFetchLikeAlbum } from "./album";
// import { watchFetchArtist, watchFetchArtistAlbums, watchFetchArtistImages } from "./artist";
// import { watchFetchTrack } from "./track";
// import { watchFetchRecommendations, watchFetchMovieCredits, watchFetchMovieVideos, watchFetchMovieImages, watchFetchPopularMovies, watchFetchMovie } from "core/sagas/movie";
// import { watchFetchPopularPeople, watchFetchPerson, watchFetchPersonCredits, watchFetchPersonImages } from "./person";
// import { watchFetchCurrentUser, watchFetchAuthUser } from "./user";
// import { } from "core/sagas/post";

import {
  watchAudioEnded,
  watchAudioVolumeChanged,
  watchInitApp,
  watchPlaySelectedTrack,
} from './player';
import * as service from "../services/UserService";

import { normalize } from "normalizr";
import { selectors } from "core/reducers/index";
import axios from "axios";
import { getReq, getHeaders, getState } from 'store';

import history  from "core/services/history";

import { postAxiosReq, getAxiosReq } from "core/api/rest-helper";

const CancelToken = axios.CancelToken;

// GET request with cancellation
export function* callAPI(endpoint, params, schema, processData, config = {}) {
  const source = CancelToken.source();
  const cancelToken = source.token;
  try {
    const url = yield call(createUrl, endpoint, params);
    const response = yield call([axios, "get"], url, {
      ...config,
      cancelToken
    });
    let { data } = response;
    // Process the data if any additional info is required for reducers or normalization.
    data = processData ? processData(data) : data;
    // Normalize the data, if a schema is given.
    data = schema ? normalize(data, schema) : data;
    return data;
  } finally {
    if (yield cancelled()) {
      source.cancel();
    }
  }
}

export function* callTrackAPI(endpoint, params, schema, processData, config = {}) {
  const source = CancelToken.source();
  const cancelToken = source.token;
  const header = getHeaders();
  try {
    const url = yield call(createAPIUrl, endpoint, params);
    // const response = yield call([axios, "get"], url, {
    //   ...config,
    //   cancelToken
    // });
    const response = yield call([axios, "get"], url, {

    });
    let { data } = response;
    // Process the data if any additional info is required for reducers or normalization.
    // data = processData ? processData(data) : data;
    // Normalize the data, if a schema is given.
    data = schema ? normalize(data, schema) : data;
    return data;
  } finally {
    if (yield cancelled()) {
      source.cancel();
    }
  }
}

export function* callAPIwithHeader(endpoint, params, schema, processData, config = {}) {
  // const source = CancelToken.source();
  // const cancelToken = source.token;
  const headers = getHeaders();
  try {
    const url = yield call(createAPIUrl, endpoint, params);

    // const response = yield call([axios, axios.get], url, {
    //   headers: {
    //     Authorization: `Bearer ${getState().users.access_token}`
    //   }
    // });

    let response = yield call(getAxiosReq, url)
    let { data } = response;
    // // Process the data if any additional info is required for reducers or normalization.
    // data = processData ? processData(data) : data;
    // // Normalize the data, if a schema is given.
    data = schema ? normalize(data, schema) : data;
    return data;
  } finally {
    if (yield cancelled()) {
      // source.cancel();
    }
  }
}

export function* getAccessToken(endpoint, body, schema, processData, config = {}) {

  try {

    const url = yield call(createAuthUrl, endpoint);
    const response = yield call([axios, "post"], url, {
      ...body,
    });
    let { data } = response;
    // Process the data if any additional info is required for reducers or normalization.
    // data = processData ? processData(data) : data;
    // Normalize the data, if a schema is given.
    // data = schema ? normalize(data, schema) : data;
    return data;
  } finally {
    if (yield cancelled()) {
      // source.cancel();
    }
  }


  // const { response, error } = yield call(getAccessToken, code);
  //     if (response) {
  //       yield all([
  //         put(setAccessToken(response)),
  //         put(getProfile()),
  //         put(push('/')),
  //       ]);
  //     } else if (error.code === 401) {
  //       // handle it when token is invalid
  //       yield put(push('/auth'));
  //     } else {
  //       yield fork(handleCommonErr, error);
  //     }
}

export function* likeAlbumHeader(endpoint, body, schema, processData, config = {}) {

  try {
    const url = yield call(createAuthUrl, endpoint);
    const headerParams = {
        Authorization: `Bearer ${getState().users.access_token}`
    };

    const response = yield call(axios.put, url, body, {headers:headerParams});
    let { data } = response;
    // Process the data if any additional info is required for reducers or normalization.
    // data = processData ? processData(data) : data;
    // Normalize the data, if a schema is given.
    // data = schema ? normalize(data, schema) : data;
    return data;
  } finally {
    if (yield cancelled()) {
      // source.cancel();
    }
  }


  // const { response, error } = yield call(getAccessToken, code);
  //     if (response) {
  //       yield all([
  //         put(setAccessToken(response)),
  //         put(getProfile()),
  //         put(push('/')),
  //       ]);
  //     } else if (error.code === 401) {
  //       // handle it when token is invalid
  //       yield put(push('/auth'));
  //     } else {
  //       yield fork(handleCommonErr, error);
  //     }
}

export function* likeAlbumSaga(endpoint, body, schema, processData, config = {}) {

  try {
    const url = yield call(createAuthUrl, endpoint);
    const response = yield call(postAxiosReq, url, body);
    let { data } = response;
    // Process the data if any additional info is required for reducers or normalization.
    // data = processData ? processData(data) : data;
    // Normalize the data, if a schema is given.
    // data = schema ? normalize(data, schema) : data;
    return data;
  } finally {
    if (yield cancelled()) {
      // source.cancel();
    }
  }


  // const { response, error } = yield call(getAccessToken, code);
  //     if (response) {
  //       yield all([
  //         put(setAccessToken(response)),
  //         put(getProfile()),
  //         put(push('/')),
  //       ]);
  //     } else if (error.code === 401) {
  //       // handle it when token is invalid
  //       yield put(push('/auth'));
  //     } else {
  //       yield fork(handleCommonErr, error);
  //     }
}




export function* fetcherSaga({ action, endpoint, params, schema, processData, cachedData}) {
  const { type, payload = {} } = action;
  const { requestType, successType, errorType } = getFetchTypes(type);
  try {
    // TODO: Check "isFetching" or group actions like streams in epics. (takeLeadingPerKey etc)
    const verified = yield call(
      verifyCachedData,
      cachedData,
      payload.requiredFields
    );
    // If there is a "verified" cached data, we don't fetch it again.
    if (!verified) {
      yield put({ type: requestType, payload });
      let data = yield call(callAPI, endpoint, params, schema, processData);
      // Dispatch success action.
      yield put({
        type: successType,
        payload: { ...payload, response: data }
      });
    }
  } catch (error) {
    // Dispatch error action.
    yield put({ type: errorType, payload: { ...payload, error } });
  }
}

export function* fetcherAPISaga({action, endpoint, params, schema, processData, cachedData}) {
  const { type, payload = {} } = action;
  const { requestType, successType, errorType } = getFetchTypes(type);

  try {
    // TODO: Check "isFetching" or group actions like streams in epics. (takeLeadingPerKey etc)
    const verified = yield call(
      verifyCachedData,
      cachedData,
      payload.requiredFields
    );
    // If there is a "verified" cached data, we don't fetch it again.
    if (!verified) {
      yield put({ type: requestType, payload });
      let data = yield call(callTrackAPI, endpoint, params, schema, processData);
      // Dispatch success action.
      yield put({
        type: successType,
        payload: { ...payload, response: data }
      });

    }
  } catch (error) {
    // Dispatch error action.
    yield put({ type: errorType, payload: { ...payload, error } });
  }
}

export function* fetcherAPIwithHeaderSaga({action, endpoint, params, schema, processData, cachedData}) {
  const { type, payload = {} } = action;
  const { requestType, successType, errorType } = getFetchTypes(type);

  try {
    // TODO: Check "isFetching" or group actions like streams in epics. (takeLeadingPerKey etc)
    const verified = yield call(
      verifyCachedData,
      cachedData,
      payload.requiredFields
    );
    // If there is a "verified" cached data, we don't fetch it again.
    // if (!verified) {
    yield put({ type: requestType, payload });
    let data = yield call(callAPIwithHeader, endpoint, params, schema, processData);
    // let data = yield call(callTrackAPI, endpoint, params, schema, processData);
    // Dispatch success action.
    yield put({
      type: successType,
      payload: { ...payload, response: data }
    });

    // }
  } catch (error) {
    // Dispatch error action.
    yield put({ type: errorType, payload: { ...payload, error } });
  }
}

export function* fetcherAuthSaga({action, endpoint, params, schema, processData, cachedData}) {
  const { type, payload = {} } = action;
  const { requestType, successType, errorType } = getFetchTypes(type);
  // const historyPush = useHistoryPush();
  try {
    // TODO: Check "isFetching" or group actions like streams in epics. (takeLeadingPerKey etc)
    const verified = yield call(
      verifyCachedData,
      cachedData,
      payload.requiredFields
    );
    // If there is a "verified" cached data, we don't fetch it again.
    if (!verified) {
      yield put({ type: requestType, payload });
      const data = yield call(getAccessToken, endpoint, params, schema, processData);
      // Dispatch success action.
      yield put({
        type: successType,
        payload: { ...payload, response: data }
      });

      yield put(actions.setAccessToken(data))
      yield put(actions.fetchCurrentUser())
      // yield put(actions.setUserProfile(res))

      // useLocation().push('/movies')
      // historyPush('/');
      // useHistory().push('/')
      // yield put(useHistory.push('/'))
      // yield call(history.push('/movies'))
      // yield call(forwardTo, '/movies');
      yield call(history.push, '/movies');
    }
  } catch (error) {
    console.log(error);
    // Dispatch error action.
    yield put({ type: errorType, payload: { ...payload, error } });
  }
}

export function* likeHeaderSaga({action, endpoint, params, schema, processData, cachedData}) {
  const { type, payload = {} } = action;
  const { requestType, successType, errorType } = getFetchTypes(type);
  // const historyPush = useHistoryPush();
  try {
    // TODO: Check "isFetching" or group actions like streams in epics. (takeLeadingPerKey etc)
    const verified = yield call(
      verifyCachedData,
      cachedData,
      payload.requiredFields
    );
    // If there is a "verified" cached data, we don't fetch it again.
    if (!verified) {
      yield put({ type: requestType, payload });
      const data = yield call(likeAlbumHeader, endpoint, params, schema, processData);
      // Dispatch success action.
      yield put({
        type: successType,
        payload: { ...payload, response: data }
      });

      // yield put(actions.setAccessToken(data))
      // yield put(actions.fetchCurrentUser())
      // yield put(actions.setUserProfile(res))

      const { id } = action.payload;

      // if (data) {

      yield put(actions.updateFieldsOfItem('albums', id, data));
      // }

      // useLocation().push('/movies')
      // historyPush('/');
      // useHistory().push('/')
      // yield put(useHistory.push('/'))
      // yield call(history.push('/movies'))
      // yield call(forwardTo, '/movies');
      // yield call(history.push, '/movies');
    }
  } catch (error) {
    console.log(error);
    // Dispatch error action.
    yield put({ type: errorType, payload: { ...payload, error } });
  }
}

// function* likeHeaderSaga({}){
//   yield call(likeAlbumHeader, )
// }


function* fetchPlaylistSagaOld(action) {
  const { playlistId, page } = action.payload;
  const movieImages = yield select(selectors.selectPlaylist, playlistId);
  yield call(fetcherAPIwithHeaderSaga, {
    action,
    endpoint: `/playlist/${playlistId}/`,
    schema: schemas.playlistSchema,
    page: page,
    cachedData: playlist
  });

  // const { albumId } = action.payload;
  // const album = yield select(selectors.selectAlbum, albumId);
  // yield call(fetcherAPIwithHeaderSaga, {
  //   action,
  //   endpoint: `/album/${albumId}/upd`,
  //   schema: schemas.albumSchema,
  //   cachedData: album
  // });
}

function* fetchlikeAlbumSagaOld(action) {
  const { id, type } = action.payload;
  // yield call(fetcherAuthSaga, {
  const album = yield select(selectors.selectAlbum, id);
  yield call(likeHeaderSaga, {
    action: action,
    endpoint: `/album/${id}/fike/`,
    data: {
      id: id,
      type: type
    },
    // schema: { results: [schemas.authSchema] }
    // schema: { results: [schemas.albumzSchema] }
    // schema: schemas.albumSchema
    schema: schemas.albumzSchema,
    // cachedData: album
  });
}

function* fetchlikeAlbumSaga(action) {
  const { id, type } = action.payload;
  // yield call(fetcherAuthSaga, {
  const album = yield select(selectors.selectAlbum, id);
  yield call(likeHeaderSaga, {
    action: action,
    endpoint: `/album/${id}/fike/`,
    data: {
      id: id,
      type: type
    },
    // schema: { results: [schemas.authSchema] }
    // schema: { results: [schemas.albumzSchema] }
    schema: schemas.albumSchema,
    // schema: schemas.albumzSchema,
    // cachedData: album
  });
}

function* fetchAlbumSaga(action) {
  const { albumId } = action.payload;
  const album = yield select(selectors.selectAlbum, albumId);
  yield call(fetcherAPIwithHeaderSaga, {
    action,
    endpoint: `/album/${albumId}/upd`,
    schema: schemas.albumSchema,
    cachedData: album
  });
}

function* fetchPlaylistSaga(action) {
  const { playlistId, page, offset } = action.payload;
  const playlist = yield select(selectors.selectPlaylist, playlistId);
  yield call(fetcherAPIwithHeaderSaga, {
    action,
    // endpoint: `/playlist/${playlistId}/upd`,
    endpoint: `/playlist/${playlistId}/`,
    schema: schemas.playlistSchema,
    // params: {offset: offset},
    cachedData: playlist
  });
}



// function* fetchAlbumSaga(action) {
//   const { albumId } = action.payload;
//   const album = yield select(selectors.selectAlbum, albumId);
//   yield call(fetcherAPISaga, {
//     action,
//     endpoint: `/album/${albumId}/`,
//     schema: schemas.albumSchema,
//     cachedData: album
//   });
// }


export function* watchFetchAlbum() {
  yield takeEvery(actions.fetchAlbum, fetchAlbumSaga);
}

export function* watchFetchPlaylist() {
  yield takeEvery(actions.fetchPlaylist, fetchPlaylistSaga);
}

export function* watchFetchOffsetPlaylist() {
  yield takeEvery(actions.fetchPlaylistTracks, fetchPlaylistOffsetSaga);
}

export function* watchFetchLikeAlbum() {
  yield takeEvery(actions.fetchLikeAlbum, fetchlikeAlbumSaga);
}
export function* watchFetchUnLikeAlbum() {
  yield takeEvery(actions.fetchUnLikeAlbum, fetchlikeAlbumSaga);
}


function* fetchArtistSaga(action) {
  const { artistId } = action.payload;
  const artist = yield select(selectors.selectArtist, artistId);
  yield call(fetcherAPISaga, {
    action,
    endpoint: `/artist/${artistId}/`,
    schema: schemas.artistSchema,
    cachedData: artist
  });
}

function* fetchArtistAlbumsSaga(action) {
  const { artistId } = action.payload;
  const artistAlbums = yield select(
    selectors.selectArtistAlbums,
    artistId
  );
  yield call(fetcherAPISaga, {
    action,
    endpoint: `/artist/${artistId}/albums/old`,
    processData: response => ({ ...response, artistId}),
    // schema: schemas.artistAlbumSchema,
    schema: {results: [schemas.artistAlbumSchema]},
    // schema: {results: schemas.artistAlbumSchema},
    cachedData: artistAlbums
  });
}

function* fetchArtistImagesSaga(action) {
  const { artistId } = action.payload;
  const artistImages = yield select(selectors.selectArtistImages, artistId);
  yield call(fetcherSaga, {
    action,
    endpoint: `/artist/${artistId}/images/`,
    schema: schemas.personImageSchema,
    cachedData: artistImages
  });
}


export function* watchFetchArtist() {
  yield takeEvery(actions.fetchArtist, fetchArtistSaga);
}

export function* watchFetchArtistAlbums() {
  yield takeEvery(actions.fetchArtistAlbums, fetchArtistAlbumsSaga);
}

export function* watchFetchArtistImages() {
  yield takeEvery(actions.fetchArtistImages, fetchArtistImagesSaga);
}

function* fetchMovieCreditsSaga(action) {
  const { movieId } = action.payload;
  const movieCredits = yield select(selectors.selectMovieCredits, movieId);
  yield call(fetcherSaga, {
    action,
    endpoint: `/movie/${movieId}/credits`,
    schema: schemas.movieCreditSchema,
    cachedData: movieCredits
  });
}

function* fetchRecommendationsSaga(action) {
  const { movieId } = action.payload;
  const recommendations = yield select(selectors.selectMovieRecommendations, movieId);
  yield call(fetcherSaga, {
    action,
    endpoint: `/movie/${movieId}/recommendations`,
    processData: response => ({ ...response, movieId }),
    schema: schemas.movieRecommendationSchema,
    cachedData: recommendations
  });
}

function* fetchPlaylistOffsetSaga(action) {
  const { playlistId, page, offset } = action.payload;
  const playlist = yield select(selectors.selectPlaylistTracks, playlistId);
  // yield call(fetcherAPIwithHeaderSaga, {
  yield call(fetcherAPISaga, {
    action,
    // endpoint: `/playlist/${playlistId}/upd`,
    endpoint: `/playlist/${playlistId}/tracks`,
    // processData: response => ({ ...response, playlistId }),
    // schema: schemas.playlistSchema,

    // schema: schemas.playlistTracksSchema,

    // schema: schemas.playlistTrackzSchema,
    // schema: { results: schemas.playlistTracksSchema},
    // schema: { results: schemas.playlistTrackzSchema},
    // schema: { results: [schemas.playlistTrackzSchema]},

    schema: { results: [schemas.playlistTracksSchema]},
    params: { offset: offset},
    // cachedData: playlist
  });
}



function* fetchMovieVideosSaga(action) {
  const { movieId } = action.payload;
  const movieVideos = yield select(selectors.selectMovieVideos, movieId);
  yield call(fetcherSaga, {
    action,
    endpoint: `/movie/${movieId}/videos`,
    schema: schemas.movieVideoSchema,
    cachedData: movieVideos
  });
}

function* fetchMovieImagesSaga(action) {
  const { movieId } = action.payload;
  const movieImages = yield select(selectors.selectMovieImages, movieId);
  yield call(fetcherSaga, {
    action,
    endpoint: `/movie/${movieId}/images`,
    schema: schemas.movieImageSchema,
    cachedData: movieImages
  });
}

function* fetchPopularMoviesSaga(action) {
  const { page } = action.payload;
  yield call(fetcherSaga, {
    action: action,
    endpoint: "/movie/popular",
    params: { page },
    schema: { results: [schemas.movieSchema] }
  });
}

function* fetchMovieSaga(action) {
  const { movieId } = action.payload;
  const movie = yield select(selectors.selectMovie, movieId);
  yield call(fetcherSaga, {
    action,
    endpoint: `/movie/${movieId}`,
    schema: schemas.movieSchema,
    cachedData: movie
  });
}



export function* watchFetchRecommendations() {
  yield takeEvery(actions.fetchRecommendations, fetchRecommendationsSaga);
}

export function* watchFetchMovieCredits() {
  yield takeEvery(actions.fetchMovieCredits, fetchMovieCreditsSaga);
}

export function* watchFetchMovieVideos() {
  yield takeEvery(actions.fetchMovieVideos, fetchMovieVideosSaga);
}

export function* watchFetchMovieImages() {
  yield takeEvery(actions.fetchMovieImages, fetchMovieImagesSaga);
}

export function* watchFetchPopularMovies() {
  yield takeEvery(actions.fetchPopularMovies, fetchPopularMoviesSaga);
}

// export function* watchFetchPopularAlbums() {
//   yield takeEvery(actions.fetchPopularAlbums, fetchPopularAlbumsSaga);
// }

export function* watchFetchPopularAlbums() {
  yield takeEvery(actions.fetchPopularAlbums, fetchNewReleasesSaga);
}

export function* watchFetchMovie() {
  yield takeEvery(actions.fetchMovie, fetchMovieSaga);
}





function* fetchPopularPeopleSaga(action) {
  const { page } = action.payload;
  yield call(fetcherSaga, {
    action,
    endpoint: "/person/popular",
    params: { page },
    schema: { results: [schemas.personSchema] }
  });
}

function* fetchPersonSaga(action) {
  const { personId } = action.payload;
  const person = yield select(selectors.selectPerson, personId);
  yield call(fetcherSaga, {
    action,
    endpoint: `/person/${personId}`,
    schema: schemas.personSchema,
    cachedData: person
  });
}

function* fetchPersonCreditsSaga(action) {
  const { personId } = action.payload;
  const personCredits = yield select(selectors.selectPersonCredits, personId);
  yield call(fetcherSaga, {
    action,
    endpoint: `/person/${personId}/movie_credits`,
    schema: schemas.personCreditSchema,
    cachedData: personCredits
  });
}

function* fetchPersonImagesSaga(action) {
  const { personId } = action.payload;
  const personImages = yield select(selectors.selectPersonImages, personId);
  yield call(fetcherSaga, {
    action,
    endpoint: `/person/${personId}/images`,
    schema: schemas.personImageSchema,
    cachedData: personImages
  });
}


export function* watchFetchPopularPeople() {
  yield takeEvery(actions.fetchPopularPeople, fetchPopularPeopleSaga);
}

export function* watchFetchPerson() {
  yield takeEvery(actions.fetchPerson, fetchPersonSaga);
}

export function* watchFetchPersonCredits() {
  yield takeEvery(actions.fetchPersonCredits, fetchPersonCreditsSaga);
}

export function* watchFetchPersonImages() {
  yield takeEvery(actions.fetchPersonImages, fetchPersonImagesSaga);
}


function* fetchMovieSearchSaga(action) {
  const { query, page } = action.payload;
  yield call(fetcherSaga, {
    action,
    endpoint: `/search/movie`,
    params: { query, page },
    schema: { results: [schemas.movieSchema] }
  });
}

function* fetchPersonSearchSaga(action) {
  const { query, page } = action.payload;
  yield call(fetcherSaga, {
    action,
    endpoint: `/search/person`,
    params: { query, page },
    schema: { results: [schemas.personSchema] }
  });
}

function* fetchArtistSearchSaga(action) {
  const { query, page, offset } = action.payload;
  yield call(fetcherAPISaga, {
    action,
    endpoint: `/posts/search/artist`,
    params: { q: query, offset: offset },
    // params: { q: query, page: page, offset: offset, limit: limit },
    schema: {
      results: [schemas.artistSearchSchema]
    }
  });
}

function* fetchAlbumSearchSaga(action) {
  const { query, page, offset } = action.payload;
  yield call(fetcherAPISaga, {
    action,
    endpoint: `/posts/search/album`,
    params: { q: query, offset: offset },
    // params: { q: query, page: page, offset: offset, limit: limit },
    schema: {
      // results: [schemas.albummSchema]
      // results: [schemas.albumziSchema]
      // results: [schemas.albumzSchema]
      results: [schemas.albumSchema]
    }
  });
}

function* fetchTrackSearchSaga(action) {
  const { query, page, offset } = action.payload;
  yield call(fetcherAPISaga, {
    action,
    endpoint: `/posts/search/track`,
    params: { q: query, offset: offset},
    // params: { q: query, page: page, offset: offset, limit: limit },
    schema: {
      results: [schemas.trackzSchema]
    }
  });
}

function* fetchSearchSaga(action) {
  const { type, payload } = action;
  const { requestType, successType, errorType, cancelType } = getFetchTypes(
    type
  );
  const { query } = payload;
  if (query) {

    yield put({ type: requestType });
    yield delay(800);
    try {
      yield all([
        call(fetchMovieSearchSaga, {
          ...action,
          type: actions.fetchMovieSearch
        }),
        // call(fetchPersonSearchSaga, {
        //   ...action,
        //   type: actions.fetchPersonSearch
        // }),
        // call(fetchArtistSearchSaga, {
        //   ...action,
        //   type: actions.fetchArtistSearch
        // }),
        call(fetchAlbumSearchSaga, {
          ...action,
          type: actions.fetchAlbumSearch
        }),
        // call(fetchTrackSearchSaga, {
        //   ...action,
        //   type: actions.fetchTrackSearch
        // })
      ]);
      yield put({ type: successType });
    } catch (error) {
      yield put({ type: errorType, error });
    }
  } else {
    yield put({ type: cancelType });
  }
}

function* watchFetchMovieSearch() {
  yield takeEvery(actions.fetchMovieSearch, fetchMovieSearchSaga);
}

function* watchFetchArtistSearch() {
  yield takeEvery(actions.fetchArtistSearch, fetchArtistSearchSaga);
}

function* watchFetchAlbumSearch() {
  yield takeEvery(actions.fetchAlbumSearch, fetchAlbumSearchSaga);
}

function* watchFetchTrackSearch() {
  yield takeEvery(actions.fetchTrackSearch, fetchTrackSearchSaga);
}

function* watchFetchPersonSearch() {
  yield takeEvery(actions.fetchPersonSearch, fetchPersonSearchSaga);
}

function* watchFetchSearch() {
  yield takeLatest(actions.fetchSearch, fetchSearchSaga);
}




function* fetchTrackSaga(action) {
  const { trackId } = action.payload;
  const track = yield select(selectors.selectTrack, trackId);
  yield call(fetcherAPISaga, {
    action,
    endpoint: `/track/${trackId}/`,
    schema: schemas.trackSchema,
    cachedData: track
  });
}

export function* watchFetchTrack() {
  yield takeEvery(actions.fetchTrack, fetchTrackSaga);
}


function* fetchAuthUserSaga(action) {
  const { email, password } = action.payload;
  yield call(fetcherAuthSaga, {
    action: action,
    endpoint: "/users/signin/",
    params: {
      email: email,
      password: password
    },
    schema: { results: [schemas.authSchema] }
  });
}

// function* fetchCurrentUserSaga(action) {
//   yield call(fetcherAuthSaga, {
//     action,
//     endpoint: "/me",
//     schema: { results: [schemas.authSchema] }
//   });
// }

function* fetchCurrentUserSaga(action) {
  yield call(fetcherAPIwithHeaderSaga, {
    action,
    endpoint: "/users/me/",
    schema: { results: [schemas.authSchema] }
    // schema: schemas.authSchema
  });
}
// function* fetchCurrentUserSaga(action) {
//   yield call(fetcherAuthSaga, {
//     action,
//     endpoint: "/users/me/",
//     schema: { results: [schemas.authSchema] }
//   });
// }

function* fetchLogout() {
    // yield call(service.logout)
    // yield put(actions.fetchLogout())
    yield put(actions.fetchUserLoggedOut())
    // history.push('/')
    // useHistory().push('/')
    yield call(history.push, '/login');
}

export function* watchLogoutUser() {
  yield takeEvery(actions.fetchLogout, fetchLogout)
}

export function* watchFetchCurrentUser() {
  yield takeEvery(actions.fetchCurrentUser, fetchCurrentUserSaga);
}

export function* watchFetchAuthUser() {
  yield takeEvery(actions.fetchAuthUser, fetchAuthUserSaga);
}


function* fetchNewReleasesSaga(action) {
  const { page } = action.payload;
  yield call(fetcherAPISaga, {
    action: action,
    endpoint: "/posts/feed/",
    params: { page },
    schema: { results: [schemas.albumzSchema] }
  });
}

function* fetchPlaySong(action) {
  const { song, page } = action.payload;
  yield call(fetcherAPISaga, {
    action: action,
    endpoint: "/posts/feed/",
    params: { page },
    schema: { results: [schemas.albumzSchema] }
  });
}


/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

// function* watchFetchGenres() {
//   yield takeEvery(actions.fetchGenres, fetchGenresSaga);
// }

function* watchFetchNewReleases() {
  yield takeEvery(actions.fetchNewReleases, fetchNewReleasesSaga);
}

function* watchPlaySong() {
  yield takeEvery(actions.playSong, fetchPlaySong);
}

// function* watchPauseSong() {
//   yield takeEvery(actions.pauseSong, fetchPlaySong);
// }

// function* watchResumeSong() {
//   yield takeEvery(actions.resumeSong, fetchPlaySong);
// }

// function* watchStopSong() {
//   yield takeEvery(actions.stopSong, fetchPlaySong);
// }

// function* watchIncreaseSongTime() {
//   yield takeEvery(actions.increaseSongTime, fetchPlaySong);
// }

export default function* root() {
  yield all([
    // fork(watchUserSaga),

    fork(watchFetchNewReleases),

    // fork(watchPlaySong),

    fork(watchFetchPopularAlbums),


    fork(watchFetchAuthUser),
    fork(watchFetchCurrentUser),
    fork(watchLogoutUser),

    fork(watchFetchLikeAlbum),
    fork(watchFetchUnLikeAlbum),

    fork(watchFetchPopularMovies),
    fork(watchFetchPopularPeople),

    fork(watchFetchMovie),
    fork(watchFetchPerson),
    // fork(watchFetchGenres),


    fork(watchFetchArtist),
    fork(watchFetchAlbum),
    fork(watchFetchPlaylist),
    fork(watchFetchOffsetPlaylist),
    fork(watchFetchTrack),


    fork(watchFetchRecommendations),

    fork(watchFetchArtistAlbums),

    fork(watchFetchMovieCredits),
    fork(watchFetchMovieVideos),
    fork(watchFetchPersonCredits),

    fork(watchFetchMovieImages),
    fork(watchFetchPersonImages),
    fork(watchFetchArtistImages),

    fork(watchFetchMovieSearch),
    fork(watchFetchPersonSearch),

    fork(watchFetchArtistSearch),
    fork(watchFetchAlbumSearch),
    fork(watchFetchTrackSearch),

    fork(watchFetchSearch)
  ]);
}

// function forwardTo(location) {
//   history.push(location);
//   // histori = useLocation();
//   // hisotri.push(location);
// }
