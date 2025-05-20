import { call, put } from "redux-saga/effects";
import { getFetchTypes, verifyCachedData } from "core/utils";
import { callAPIWithHeader, callAPI } from "./apiSaga";

/**
 * Generic fetcherSaga for making API requests with caching and normalization.
 */
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
