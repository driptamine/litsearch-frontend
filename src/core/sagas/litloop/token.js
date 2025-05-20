export function* getAccessTokenF(): any {
  while (true) {
    const { code } = yield take(GE_ACCESS_TOKEN);
    // check code define or not
    if (!code) {
      yield put(push('/auth'));
      return;
    }
    const { response, error } = yield call(getAccessToken, code);
    if (response) {
      yield all([
        put(setAccessToken(response)),
        put(getProfile()),
        put(push('/unsplash')),
      ]);
    } else if (error.code === 401) {
      // handle it when token is invalid
      yield put(push('/auth'));
    } else {
      yield fork(handleCommonErr, error);
    }
  }
}
