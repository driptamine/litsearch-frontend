import { call, cancelled } from 'redux-saga/effects';
import axios from 'axios';
import { normalize } from 'normalizr';
import { createUrl, createAPIUrl, createAuthUrl, createAPIUrlPost } from 'core/utils';
import { getHeaders, getState } from 'core/store';
import { postAxiosReq, getAxiosReq } from 'core/api/rest-helper';

const CancelToken = axios.CancelToken;

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
      ...config,
      headers: header,
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

export function* callAPI(endpoint, params, schema, processData, config = {}) {
  const source = CancelToken.source();
  try {
    const url = yield call(createUrl, endpoint, params);
    const response = yield call([axios, "get"], url, { ...config, cancelToken: source.token });
    let { data } = response;
    data = processData ? processData(data) : data;
    return schema ? normalize(data, schema) : data;
  } finally {
    if (yield cancelled()) source.cancel();
  }
}

export function* getAccessToken(endpoint, body, schema, processData, config = {}) {

  try {

    const url = yield call(createAuthUrl, endpoint);
    // console.log('damnurl:', url);
    const response = yield call([axios, "post"], url, {
      ...body,
    });
    let { data } = response;

    return data;
  } finally {
    if (yield cancelled()) {
      // source.cancel();
    }
  }
}

export function* likeAlbumHeader(endpoint, body, schema, processData, config = {}) {
  try {
    const url = yield call(createAuthUrl, endpoint);
    const response = yield call(axios.put, url, body, {headers: authHeader()});
    let { data } = response;
    return data;
  } finally {
    if (yield cancelled()) {
      // source.cancel();
    }
  }
}

export function* callPostAPIWithHeader({endpoint, params, schema, processData}) {
  try {
    const response = yield call(getAccessToken, endpoint, params, schema, processData);
    return response
  } finally {
    if (yield cancelled()) console.log("API call cancelled");
  }
}

export function* callAPIWithHeader({endpoint, params, schema, processData}) {
  try {
    const url = yield call(createAPIUrl, endpoint, params);
    const response = yield call(getAxiosReq, url);
    let { data } = response;
    return schema ? normalize(data, schema) : data;
  } finally {
    if (yield cancelled()) console.log("API call cancelled");
  }
}
