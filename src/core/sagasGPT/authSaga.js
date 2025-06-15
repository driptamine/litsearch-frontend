import { call, put, takeEvery } from 'redux-saga/effects';
import * as actions from 'core/actions';
import { callAPIWithHeader, callPostAPIWithHeader, getAccessToken } from './apiSaga';
import * as schemas from 'core/schemas';
import { getFetchTypes, verifyCachedData, createUrl, createAPIUrl, createAuthUrl, bingAPIurl } from 'core/utils';
import history  from 'core/services/history';



function* fetchCurrentUserSaga(action) {
  yield call(callAPIWithHeader, {
    endpoint: "/users/me/",
    schema: { results: [schemas.authSchema] }
  });
}

function* fetchLogoutSaga() {
  yield put(actions.fetchUserLoggedOut());
}

/**
 * fetcherAuthSaga: Handles authentication API calls, checks for cache, and normalizes data.
 */

 function* fetchAuthUserSagaz({ action, endpoint, params, schema, processData, cachedData }) {
   const { type, payload = {} } = action;
   const { requestType, successType, errorType } = getFetchTypes(type);

   try {
     // If cached data is valid, skip fetching
     const verified = yield call(verifyCachedData, cachedData, payload.requiredFields);
     if (!verified) {
       yield put({ type: requestType, payload });

       const data = yield call(callPostAPIWithHeader, {
         endpoint: "/users/signin/",
         params: action.payload,
         schema: { results: [schemas.authSchema] }
       })

       // const data = yield call(callAPIWithHeader, endpoint, params, schema, processData);

       // Dispatch success action
       yield put({ type: successType, payload: { ...payload, response: data } });

       // Store access token if needed
       yield put(actions.setAccessToken(data));

       // Fetch user details after login
       yield put(actions.fetchCurrentUser());

       // Redirect after successful login
       actions.history.push('/');
     }
   } catch (error) {
     console.error(error);
     yield put({ type: errorType, payload: { ...payload, error } });
   }
 }


function* fetcherAuthSaga({ action, endpoint, params, schema, processData, cachedData }) {
  const { type, payload = {} } = action;
  const { requestType, successType, errorType } = getFetchTypes(type);

  try {
    // If cached data is valid, skip fetching
    const verified = yield call(verifyCachedData, cachedData, payload.requiredFields);
    if (!verified) {
      yield put({ type: requestType, payload });
      // const data = yield call(callAPIWithHeader, endpoint, params, schema, processData);
      const data = yield call(getAccessToken, endpoint, params, schema, processData);

      // Dispatch success action
      yield put({ type: successType, payload: { ...payload, response: data } });

      // Store access token if needed
      yield put(actions.setAccessToken(data));

      // Fetch user details after login
      yield put(actions.fetchCurrentUser());

      // Redirect after successful login
      history.push('/feed');
    }
  } catch (error) {
    console.error(error);
    yield put({ type: errorType, payload: { ...payload, error } });
  }
}




function* fetchAuthUserSaga(action) {
  // const data = yield call(callPostAPIWithHeader, {
  yield call(fetcherAuthSaga, {
    action: action,
    endpoint: "/users/signin/",
    params: action.payload,
    schema: { results: [schemas.authSchema] }
  })

  // yield put(actions.setAccessToken(data));
  //
  // // Fetch user details after login
  // yield put(actions.fetchCurrentUser());
  //
  // // Redirect after successful login
  // actions.history.push('/');
}

export function* watchAuthSagas() {
  yield takeEvery(actions.fetchAuthUser, fetchAuthUserSaga);
  // yield takeEvery(actions.fetchAuthUser, fetcherAuthSaga);

  yield takeEvery(actions.fetchCurrentUser, fetchCurrentUserSaga);
  yield takeEvery(actions.fetchLogout, fetchLogoutSaga);

}
