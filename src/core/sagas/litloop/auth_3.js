
export function* fetcherAuthSaga({action, endpoint, params, schema, processData, cachedData}) {
  const { type, payload = {} } = action;
  const { requestType, successType, errorType } = getFetchTypes(type);
  try {
    const verified = yield call(verifyCachedData, cachedData, payload.requiredFields);
    if (!verified) {
      yield put({ type: requestType, payload });
      // AXIOS GET
      const data = yield call(getAccessToken, endpoint, params, schema, processData); // AXIOS UTIL
      yield put({
        type: successType,
        payload: { ...payload, response: data }
      });
      yield put(actions.setAccessToken(data))
      yield put(actions.fetchCurrentUser())
      yield call(history.push, '/movies');
    }
  } catch (error) {
    console.log(error);
    yield put({ type: errorType, payload: { ...payload, error } });
  }
}

export function* fetcherAPIwithHeaderSaga({action, endpoint, params, schema, processData, cachedData}) {
  const { type, payload = {} } = action;
  const { requestType, successType, errorType } = getFetchTypes(type);
  try {
    const verified = yield call(verifyCachedData, cachedData, payload.requiredFields);
    yield put({ type: requestType, payload });
    let data = yield call(callAPIwithHeader, endpoint, params, schema, processData); // AXIOS UTIL
    // Dispatch success action.
    yield put({
      type: successType,
      payload: { ...payload, response: data }
    });
  } catch (error) {
    yield put({ type: errorType, payload: { ...payload, error } });
  }
}
