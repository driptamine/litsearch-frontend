export function* getReqSaga(endpoint, params, schema, processData, config = {}) {
  try {
    const url = yield call(createAuthUrl, endpoint);
    const res = yield call(getAxiosReq, url)
    let  data  = res;
    return data;
  } finally {
    if (yield cancelled()) {
      source.cancel();
    }
  }
}

export function* postReqSaga(endpoint, body, schema, processData, config = {}) {
  try {
    const url = yield call(createAuthUrl, endpoint);
    const res = yield call(postAxiosReq, url, body);
    let { data } = res;
    return data;
  } finally {
    if (yield cancelled()) {
      // source.cancel();
    }
  }
}
