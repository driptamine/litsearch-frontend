import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import App from 'views/components/app';
import ConfigurationProvider from 'views/components/ConfigurationProvider';
import GlobalStyle from 'views/styles/GlobalStyle';

import createStore from 'core/store/storeV6_gemini'; // adjust if you export factory
import createHistory from 'history/createBrowserHistory'; // or your custom history
// import history  from 'core/services/history';


const preloadedState = window.__PRELOADED_STATE__;
const store = createStore(preloadedState);
const persistor = /* create persistor if needed with preloaded state */;
const history = createHistory();

hydrateRoot(
  document.getElementById('root'),
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConfigurationProvider>
        <Router history={history}>
          <GlobalStyle />
          <App />
        </Router>
      </ConfigurationProvider>
    </PersistGate>
  </Provider>
);
