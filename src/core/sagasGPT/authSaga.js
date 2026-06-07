import { call, put, takeEvery } from 'redux-saga/effects';
import * as actions from 'core/actions';
import { callAPIWithHeader, callPostAPIWithHeader, getAccessToken, likeAlbumHeader } from './apiSaga';
import * as schemas from 'core/schemas';
import { getFetchTypes, verifyCachedData, createUrl, createAPIUrl, createAuthUrl, bingAPIurl } from 'core/utils';
import history  from 'core/services/history';
import { RemoveCookie } from 'views/utils';



function* fetchCurrentUserSaga(action) {
  const { type, payload = {} } = action;
  const { requestType, successType, errorType } = getFetchTypes(type);

  try {
    yield put({ type: requestType, payload });
    const data = yield call(callAPIWithHeader, {
      endpoint: "/users/me/",
      schema: schemas.authSchema
    });

    yield put({
      type: successType,
      payload: { ...payload, response: data }
    });
  } catch (error) {
    console.error(error);
    yield put({ type: errorType, payload: { ...payload, error } });
  }
}

function* fetchLogoutSaga() {
  yield put(actions.fetchUserLoggedOut());
  
  // Clear cookies
  RemoveCookie('Google-access_token');
  RemoveCookie('Google-refresh_token');
  RemoveCookie('Google-username');
  RemoveCookie('Google-profileImg');
  RemoveCookie('Google-email');
  RemoveCookie('Google-userId');
  RemoveCookie('Twitch-access_token');
  RemoveCookie('Twitch-refresh_token');
  RemoveCookie('Youtube-access_token');
  
  // Redirect to login
  yield call([history, history.push], '/login');
}

export function* likeHeaderSaga({action, endpoint, params, schema, processData, cachedData}) {
  const { type, payload = {} } = action;
  const { requestType, successType, errorType } = getFetchTypes(type);
  try {
    const verified = yield call(verifyCachedData, cachedData, payload.requiredFields);
    if (!verified) {
      yield put({ type: requestType, payload });
      const data = yield call(likeAlbumHeader, endpoint, params, schema, processData);
      yield put({
        type: successType,
        payload: { ...payload, response: data }
      });

      const { id } = action.payload;
      yield put(actions.updateFieldsOfItem('albums', id, data));
    }
  } catch (error) {
    console.log(error);
    yield put({ type: errorType, payload: { ...payload, error } });
  }
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

function* fetchSignUpSaga(action) {
  const { type, payload = {} } = action;
  const { requestType, successType, errorType } = getFetchTypes(type);

  try {
    yield put({ type: requestType, payload });
    const data = yield call(callPostAPIWithHeader, {
      endpoint: "/users/signup/",
      params: action.payload,
      schema: { results: [schemas.authSchema] }
    });

    // Dispatch success action
    yield put({ type: successType, payload: { ...payload, response: data } });

    // Store access token if needed
    yield put(actions.setAccessToken(data));

    // Fetch user details after login
    yield put(actions.fetchCurrentUser());

    // Redirect after successful login
    history.push('/feed');
  } catch (error) {
    console.error(error);
    yield put({ type: errorType, payload: { ...payload, error } });
  }
}

export function* watchAuthSagas() {
  yield takeEvery(actions.fetchAuthUser, fetchAuthUserSaga);
  // yield takeEvery(actions.fetchAuthUser, fetcherAuthSaga);

  yield takeEvery(actions.fetchSignUpUser, fetchSignUpSaga);

  yield takeEvery(actions.fetchCurrentUser, fetchCurrentUserSaga);
  yield takeEvery(actions.fetchLogout, fetchLogoutSaga);

}
