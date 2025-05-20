import { put, delay, fork, all, call, select, takeEvery, takeLatest, cancelled} from "redux-saga/effects";
import { normalize } from "normalizr";
import axios from "axios";
import { getFetchTypes, verifyCachedData, createUrl, createAPIUrl, createAuthUrl } from "core/utils";
import * as schemas from "core/schemas";
import * as actions from "core/actions";

import { watchFetchAlbum, watchFetchLikeAlbum } from './album';
import { watchFetchArtist, watchFetchArtistAlbums, watchFetchArtistImages } from './artist';
import { watchFetchTrack } from './track';
import { watchFetchMovie, watchFetchRecommendations, watchFetchMovieCredits, watchFetchMovieVideos, watchFetchMovieImages, watchFetchPopularMovies,  } from './movie';
import { watchFetchPopularPeople, watchFetchPerson, watchFetchPersonCredits, watchFetchPersonImages } from './person';
import { watchFetchCurrentUser, watchFetchAuthUser,  } from './user';
import { watchFetchSearch, watchFetchMovieSearch, watchFetchPersonSearch, watchFetchArtistSearch, watchFetchAlbumSearch, watchFetchTrackSearch } from './search';
import { watchFetchGenres } from './genre';
// import {watchFetchNewReleases } from "core/sagas/post";

import * as service from "../services/UserService";

import { selectors } from "core/reducers/index";
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
    const response = yield call([axios, "get"], url, {
      ...config,
      cancelToken
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
    const response = yield call([axios, axios.get], url, {
      headers: {
        Authorization: `Bearer ${getState().users.access_token}`
      }
    });
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
}

export function* likeAlbum(endpoint, body, schema, processData, config = {}) {

  try {
    const url = yield call(createAuthUrl, endpoint);
    const headerParams = {
        Authorization: `Bearer ${getState().users.access_token}`
    };
    const response = yield call(axios.post, url, body, {headers:headerParams});
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
    if (!verified) {
      yield put({ type: requestType, payload });
      let data = yield call(callAPIwithHeader, endpoint, params, schema, processData);
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

export function* fetcherAuthSaga({action, endpoint, params, schema, processData, cachedData}) {
  const { type, payload = {} } = action;
  const { requestType, successType, errorType } = getFetchTypes(type);
  // const historyPush = useHistoryPush();
  try {
    // TODO: Check "isFetching" or group actions like streams in epics. (takeLeadingPerKey etc)
    const verified = yield call(verifyCachedData, cachedData, payload.requiredFields);
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

/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

export default function* root() {
  yield all([
    // fork(watchUserSaga),

    fork(watchFetchAuthUser),
    fork(watchFetchCurrentUser),
    fork(watchLogoutUser),

    fork(watchFetchLikeAlbum),

    fork(watchFetchPopularMovies),
    fork(watchFetchPopularPeople),

    fork(watchFetchMovie),
    fork(watchFetchPerson),
    fork(watchFetchGenres),


    fork(watchFetchArtist),
    fork(watchFetchAlbum),
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
