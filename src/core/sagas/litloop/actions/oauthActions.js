export const googleOAuthRequest = () => ({
  type: GOOGLE_OAUTH_REQUEST,
});

export const googleOAuthSuccess = (authData) => ({
  type: GOOGLE_OAUTH_SUCCESS,
  payload: authData,
});

export const googleOAuthFailure = (error) => ({
  type: GOOGLE_OAUTH_FAILURE,
  payload: error,
});

export const googleOAuthCallback = (token) => ({
  type: GOOGLE_OAUTH_CALLBACK,
  payload: { token },
});
