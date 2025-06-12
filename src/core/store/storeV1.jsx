
import rootReducer from 'core/reducers/index';
import createSagaMiddleware from 'redux-saga';
import rootSaga from 'core/sagas/index';

import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';


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
