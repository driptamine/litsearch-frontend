import { put, delay, fork, all, call, select, takeEvery, takeLatest, cancelled } from "redux-saga/effects";
import { getFetchTypes, verifyCachedData, createUrl, createAPIUrl, createAuthUrl } from "core/utils/index";
import { setAccessToken } from "core/actions";
import * as schemas from "core/schemas";
import * as actions from "core/actions";
import * as service from "core/services/UserService";
import { normalize } from "normalizr";
import { selectors } from "core/reducers/index";
import history  from 'core/services/history';

import { getAxiosReq, postAxiosReq } from 'core/api/rest-helper';
import { getReqSaga, postReqSaga } from 'core/sagas/litloop/utils';

// fetcherAPIwithHeaderSaga
function* callAPIwithHeader(endpoint, params, schema, processData, config = {}) {
  const headers = getHeaders();
  try {
    const url = yield call(createAPIUrl, endpoint, params);
    let response = yield call(getAxiosReq, url)
    let { data } = response;
    data = schema ? normalize(data, schema) : data;
    return data;
  } finally {
    if (yield cancelled()) {
      // source.cancel();
    }
  }
}

//NEW
export function* fetcherGetSaga({action, endpoint, params, schema, processData, cachedData}) {
  const { type, payload = {} } = action;
  const { requestType, successType, errorType } = getFetchTypes(type);
  try {
    const verified = yield call(verifyCachedData,cachedData,payload.requiredFields);
    if (!verified) {
      yield put({ type: requestType, payload });
      // GET AXIOS
      let data = yield call(getReqSaga, endpoint, params, schema, processData); // AXIOS UTIL
      yield put({ type: successType, payload: { ...payload, response: data }});
    }
  } catch (error) {
    console.log(error);
    yield put({ type: errorType, payload: { ...payload, error } });
  }
}


export function* fetcherPostAuthSaga({action, endpoint, params, schema, processData, cachedData}) {
  const { type, payload = {} } = action;
  const { requestType, successType, errorType } = getFetchTypes(type);
  try {
    const verified = yield call(verifyCachedData, cachedData, payload.requiredFields);
    if (!verified) {
      yield put({ type: requestType, payload });
      // POST AXIOS
      const data = yield call(postReqSaga, endpoint, params, schema, processData); // AXIOS UTIL
      yield put({type: successType, payload: { ...payload, response: data }});
      yield put(actions.setAccessToken(data))
      yield put(actions.fetchCurrentUser())
      yield call(history.push, '/movies');
    }
  } catch (error) {
    console.log(error);
    yield put({ type: errorType, payload: { ...payload, error } });
  }
}


export function* fetcherAPISaga({action, endpoint, params, schema, processData, cachedData}) {
  const { type, payload = {} } = action;
  const { requestType, successType, errorType } = getFetchTypes(type);
  try {
    const verified = yield call(verifyCachedData, cachedData, payload.requiredFields);
    if (!verified) {
      yield put({ type: requestType, payload });
      let data = yield call(callTrackAPI, endpoint, params, schema, processData);
      yield put({ type: successType, payload: { ...payload, response: data }});
    }
  } catch (error) {
    yield put({ type: errorType, payload: { ...payload, error } });
  }
}


const utilsSagas = [
  // fork(watchFetchCurrentUser),
  // fork(watchFetchAuthUser),
  // fork()
];

export default utilsSagas;
