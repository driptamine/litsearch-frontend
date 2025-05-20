import { put, delay, fork, all, call, select, takeEvery, takeLatest, cancelled } from "redux-saga/effects";
import { getFetchTypes, verifyCachedData, createUrl, createAPIUrl, createAuthUrl } from "core/utils/index";
import { setAccessToken } from "core/actions";
import * as schemas from "core/schemas";
import * as actions from "core/actions";
import * as service from "../services/UserService";
import { normalize } from "normalizr";
import { selectors } from "core/reducers/index";
import axios from "axios";
import history  from "core/services/history"

const CancelToken = axios.CancelToken;

function* callAPI(endpoint, params, schema, processData, config = {}) {
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

export function* fetcherSaga({ action, endpoint, params, schema, processData, cachedData }) {
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

const authSagas = [
  fork(),
  fork(fetcherSaga),
  fork(),
  fork()
];

export default authSagas;
