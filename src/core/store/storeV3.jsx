import createSagaMiddleware from 'redux-saga';

// import rootReducer from 'core/reducers/index';
import rootReducer from 'core/reducersV2';

import rootSaga from 'core/sagasV2/rootV5_fork';
// import rootSaga from 'core/sagas/index';
// import rootSaga from 'core/sagasV2/rootV3';
// import rootSaga from 'core/sagasV2/rootV4';
// import rootSaga from 'core/sagasV2/rootV5';
// import rootSaga from 'core/sagas/SagaIndex';
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
