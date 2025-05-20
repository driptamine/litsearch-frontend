//  https://chatgpt.com/c/6706b167-c398-800c-ab5d-906cf6ace39d
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
// import { composeWithDevTools } from 'redux-devtools-extension'; // Optional for Redux DevTools
import rootReducer from 'core/reducersV2'; // Import your root reducer
import rootSaga from 'core/sagasV2/rootV3'; // Import your root saga

// Create the saga middleware
export const sagaMiddleware = createSagaMiddleware();

// Create and configure the Redux store
export const store = createStore(
  rootReducer,
  // composeWithDevTools(applyMiddleware(sagaMiddleware)) // Apply middleware
);

// Run the root saga
sagaMiddleware.run(rootSaga);

// export default store;
