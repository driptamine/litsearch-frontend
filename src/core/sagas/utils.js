import { put, delay, fork, all, call, select, takeEvery, takeLatest, cancelled } from "redux-saga/effects";
import { getFetchTypes, verifyCachedData, createUrl, createAPIUrl, createAuthUrl } from "core/utils/index";
import { setAccessToken } from "core/actions";
import * as schemas from "core/schemas";
import * as actions from "core/actions";
import * as service from "core/services/UserService";
import { normalize } from "normalizr";
import { selectors } from "core/reducers/index";
import axios from "axios";
import history  from "core/services/history"




import { postAxiosReq, getAxiosReq } from "core/api/rest-helper";

const CancelToken = axios.CancelToken;



// GET request with cancellation
export function* getReqSaga(endpoint, params, schema, processData, config = {}) {
  try {
    // const url = yield call(createUrl, endpoint, params);
    const url = yield call(createAuthUrl, endpoint);
    const res = yield call(getAxiosReq, url)
    let  data  = res;

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


export function* postReqSaga(endpoint, body, schema, processData, config = {}) {

  try {

    const url = yield call(createAuthUrl, endpoint);

    const res = yield call(postAxiosReq, url, body);
    let { data } = res;
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


export function* fetcherGetSaga({ action, endpoint, params, schema, processData, cachedData}) {
  const { type, payload = {} } = action;
  const { requestType, successType, errorType } = getFetchTypes(type);
  try {
    const verified = yield call(verifyCachedData,cachedData,payload.requiredFields);
    if (!verified) {
      yield put({ type: requestType, payload });

      let data = yield call(getReqSaga, endpoint, params, schema, processData);

      yield put({ type: successType, payload: { ...payload, response: data }});
    }
  } catch (error) {
    // Dispatch error action.
    console.log(error);
    yield put({ type: errorType, payload: { ...payload, error } });
  }
}


export function* fetcherPostAuthSaga({action, endpoint, params, schema, processData, cachedData}) {
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
      const data = yield call(postReqSaga, endpoint, params, schema, processData);
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

export function* callTrackAPI(endpoint, params, schema, processData, config = {}) {
  const source = CancelToken.source();
  const cancelToken = source.token;
  // const header = getHeaders();
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
      // let data = yield call(getReqSaga, endpoint, params, schema, processData);
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

const utilsSagas = [
  // fork(watchFetchCurrentUser),
  // fork(watchFetchAuthUser),
  // fork()
];

export default utilsSagas;
