import { takeLatest, call, put } from 'redux-saga/effects';
import { GOOGLE_OAUTH_REQUEST, GOOGLE_OAUTH_CALLBACK } from './actions/actionTypes';
import { googleOAuthSuccess, googleOAuthFailure } from './actions/oauthActions';
import { googleLoginApi } from '../api/authApi';

// Utility function to open Google OAuth window
function openGoogleOAuthWindow(url, name, width = 500, height = 600) {
  const left = (window.screen.width / 2) - (width / 2);
  const top = (window.screen.height / 2) - (height / 2);

  return window.open(url, name, `width=${width},height=${height},top=${top},left=${left}`);
}

// Saga to handle Google OAuth login
function* googleOAuthSaga() {
  try {
    const googleOAuthUrl = 'https://accounts.google.com/o/oauth2/auth?client_id=YOUR_GOOGLE_CLIENT_ID&redirect_uri=http://localhost:3000/oauth-callback&response_type=token&scope=email%20profile';

    // Open OAuth window
    const authWindow = yield call(openGoogleOAuthWindow, googleOAuthUrl, 'GoogleOAuth');

    // Wait for the postMessage from the popup
    const authData = yield new Promise((resolve, reject) => {
      const messageListener = (event) => {
        // Validate message origin
        if (event.origin === window.location.origin) {
          authWindow.close();

          if (event.data && event.data.token) {
            resolve(event.data);
          } else {
            reject(new Error('No token received'));
          }
          window.removeEventListener('message', messageListener);
        }
      };

      window.addEventListener('message', messageListener);
    });

    // Dispatch success action
    yield put(googleOAuthSuccess(authData));
  } catch (error) {
    yield put(googleOAuthFailure(error.message));
  }
}

// Saga to handle OAuth callback and send the token to Django
function* googleOAuthCallbackSaga(action) {
  try {
    const { token } = action.payload;

    // Call the Django API to verify the token and get the JWT
    const response = yield call(googleLoginApi, token);

    yield put(googleOAuthSuccess(response));
  } catch (error) {
    yield put(googleOAuthFailure(error.message));
  }
}

// Watcher saga
function* watchGoogleOAuth() {
  yield takeLatest(GOOGLE_OAUTH_REQUEST, googleOAuthSaga);
  yield takeLatest(GOOGLE_OAUTH_CALLBACK, googleOAuthCallbackSaga);
}

export default [watchGoogleOAuth];
