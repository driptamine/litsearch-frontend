import { call, put, cancelled } from 'redux-saga/effects';
import axios from 'axios';
import { normalize } from 'normalizr';
import { getFetchTypes, verifyCachedData, createAPIUrl } from 'core/utils';
import { getHeaders } from 'core/store';

const CancelToken = axios.CancelToken;

// Generic API call saga
export function* callAPI(endpoint, params, schema, processData, config = {}) {
  const source = CancelToken.source();
  try {
    const url = yield call(createAPIUrl, endpoint, params);
    const response = yield call([axios, "get"], url, { ...config, cancelToken: source.token });
    let { data } = response;
    data = processData ? processData(data) : data;
    data = schema ? normalize(data, schema) : data;
    return data;
  } finally {
    if (yield cancelled()) {
      source.cancel();
    }
  }
}

// Fetch API data saga
export function* fetcherAPISaga({ action, endpoint, params, schema, processData, cachedData }) {
  const { type, payload = {} } = action;
  const { requestType, successType, errorType } = getFetchTypes(type);

  try {
    const verified = yield call(verifyCachedData, cachedData, payload.requiredFields);
    if (!verified) {
      yield put({ type: requestType, payload });
      let data = yield call(callAPI, endpoint, params, schema, processData);
      yield put({ type: successType, payload: { ...payload, response: data } });
    }
  } catch (error) {
    yield put({ type: errorType, payload: { ...payload, error } });
  }
}
