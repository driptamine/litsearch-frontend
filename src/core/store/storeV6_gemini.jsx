// https://gemini.google.com/app/b93dab88fe4aa585?hl=en
import rootReducer from 'core/reducers/index';
import createSagaMiddleware from 'redux-saga';
import rootSaga from 'core/sagasGPT/index';

import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

// --- START REDUX-PERSIST IMPORTS AND CONFIG ---
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

const persistConfig = {
  key: 'root', // The key for the localStorage object where your state will be stored
  storage,      // The storage engine to use (localStorage)
  whitelist: ['users'], // Specify which reducers you want to persist.
                       // In your case, 'users' is crucial for auth status.
                       // Add other reducer names here if you want them persisted.
  // blacklist: ['someEphemeralReducer'] // Use blacklist if you want to exclude certain reducers
};

// Create a persisted reducer by wrapping your rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);
// --- END REDUX-PERSIST IMPORTS AND CONFIG ---

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  // Use the persistedReducer instead of the original rootReducer
  reducer: persistedReducer,
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
        ignoredPaths: ['_persist'],
      },
      immutableCheck: false
    }),
    sagaMiddleware
  ],
});

sagaMiddleware.run(rootSaga);

// Export persistor along with the store
export const persistor = persistStore(store);

// Export the store (as a named export, since persistor is also named)
export default store;

// If you have a global getState, ensure it looks like this:
// export const getState = () => store.getState();
