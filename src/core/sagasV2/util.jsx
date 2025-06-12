import { put, delay, fork, all, call, select, takeEvery, takeLatest, cancelled} from 'redux-saga/effects';
import axios from 'axios';
import { getFetchTypes, verifyCachedData, createUrl, createAPIUrl, createAuthUrl, bingAPIurl } from 'core/utils';

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


export function* requestWithHeader(endpoint, params, schema, processData, config = {}) {

  try {
    const url = yield call(bingAPIurl, endpoint);
    const headerParams = {
        'Ocp-Apim-Subscription-Key': `23c6c54ede484f7c9586245ad7a0fb18`,
        "Cache-Control": "no-cache",
        "Content-Type": "application/x-www-form-urlencoded",

        // 'Authorization': `Bearer 23c6c54ede484f7c9586245ad7a0fb18`
    };

    // const response = yield call(axios.put, url, params, { headers: headerParams});
    // const response = yield call([axios, "get"], url, { headers: headerParams});

    const urlz = 'http://localhost:8000' + endpoint
    // const response = axios.get(urlz, {
    //   params: params,
    //   headers: headerParams
    // })

    // const response = yield call([axios, "get"], urlz, { params, headers: headerParams});
    const paramz = encodeURIComponent(params);
    const resp = axios.get(urlz, { params }).then((res) => {
      return res.data;
    }).catch((err) => {
      throw err
    })
    // return resp

    // let { data } = response;
    //
    // return data;

    // return response;
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
    yield put({
      type: errorType,
      payload: { ...payload, error }
    });
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

      put(actions.fetchCurrentUser())
      // let data_current = yield put(actions.fetchCurrentUser())
      // yield put(actions.setUserProfile(res))
      // console.log(data_current);


      // useLocation().push('/movies')
      // historyPush('/');
      // useHistory().push('/')
      // yield put(useHistory.push('/'))
      // yield call(history.push('/movies'))
      // yield call(forwardTo, '/movies');

      history.push('/');
      // yield call(history.push, '/movies');
      // yield call(window.location.assign, '/movies');
      // window.location.assign = '/movies';
      // window.location.href = '/movies';
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

export function* requestWithHeaderSaga({ action, endpoint, params, schema, processData, cachedData}) {
  const { type, payload = {} } = action;
  const { requestType, successType, errorType } = getFetchTypes(type);
  // const historyPush = useHistoryPush();
  try {

      yield put({ type: requestType, payload });
      const data = yield call(requestWithHeader, endpoint, params, schema, processData);
      // Dispatch success action.
      yield put({
        type: successType,
        payload: { ...payload, response: data }
      });

      // const { id } = action.payload;
  } catch (error) {
    console.log(error);
    // Dispatch error action.
    yield put({ type: errorType, payload: { ...payload, error } });
  }
}
