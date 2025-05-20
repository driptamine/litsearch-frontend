import createSagaMiddleware from 'redux-saga';

// import rootReducer from 'core/reducers/index';
import rootReducer from 'core/reducersV2/index';

import rootSaga from 'core/sagasV3/rootSaga';

import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";


const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer,
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false
    }),
    sagaMiddleware
  ],
});

sagaMiddleware.run(rootSaga);

export default store;
