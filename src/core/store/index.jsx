import rootReducer from "core/reducers/index";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { persistStore } from 'redux-persist';
import axios from "axios";

export const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: [
    ...getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
    sagaMiddleware
  ]
});

// store.runSaga = sagaMiddleware.run;

// export default store;




// const persistedReducer = persistReducer(persistConfig, rootReducer);
// const sagaMiddleware = createSagaMiddleware();
// let store = createStore(persistedReducer, applyMiddleware(sagaMiddleware));
export const persistor = persistStore(store);

export const getState = () => store.getState();

export const getHeaders = () => {
  const headers = new Headers();
  headers.append('Accept-Version', 'v1');

  // if (jsonContentType) {
  //   headers.append('Content-Type', 'application/json');
  // }

  headers.append('Accept', 'application/json');

  // if (getState().users.access_token) {
    headers.append(
      'Authorization',
      `Bearer ${getState().users.access_token}`
    );
  // }

  headers.append(
    'User-Agent',
    'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Mobile Safari/537.36'
  );
  return headers;
};


// export { store, persistor, sagaMiddleware };

// export const getHeaders = () => {
//   const token = getToken();
//   if (!token) return {};
//
//   return {
//     Authorization: `Bearer ${token}`,
//   };
// };
//
// export const apiGet = (path: string, params: object = {}) => {
//   const options = {
//     params,
//     headers:  getHeaders(),
//   };
//
//   return api.get(path, options);
// };

// export const getReq = (endpoint, headers = getHeaders()) =>
//   axios(endpoint, {
//     method: 'GET',
//     headers,
//   })
//   .then(res => res.json().then(json => ({ json, res })))
//   .then(({ json, res }) => checkStatus(json, res))
//   .catch(failure);
