import { call, put } from 'redux-saga/effects';
import { getFetchTypes, verifyCachedData } from 'core/utils';
import { callAPIWithHeader, callAPI } from './apiSaga';

/**
 * Generic fetcherSaga for making API requests with caching and normalization.
 */
export function* fetcherSaga({ action, endpoint, params, schema, processData, cachedData }) {
  const { type, payload = {} } = action;
  const { requestType, successType, errorType } = getFetchTypes(type);

  try {
    // Check if the data is already cached to avoid redundant API calls
    const verified = yield call(verifyCachedData, cachedData, payload.requiredFields);
    if (!verified) {
      yield put({ type: requestType, payload });

      // Fetch data from API
      // const data = yield call(callAPIWithHeader, endpoint, params, schema, processData);
      const data = yield call(callAPI, endpoint, params, schema, processData);

      // Dispatch success action with the fetched data
      yield put({
        type: successType,
        payload: { ...payload, response: data }
      });
    }
  } catch (error) {
    console.error("FetcherSaga Error:", error);

    // Dispatch error action if API call fails
    yield put({
      type: errorType,
      payload: { ...payload, error }
    });
  }
}
