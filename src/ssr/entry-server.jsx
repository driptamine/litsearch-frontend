import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from 'react-redux';

import App from 'views/components/app';
import ConfigurationProvider from 'views/components/ConfigurationProvider';
import GlobalStyle from 'views/styles/GlobalStyle';

import createStore from 'core/store/storeV6_gemini'; // or factory function

export async function render(url) {
  const context = {};
  const store = createStore();

  // Run sagas to fetch data (implement runSagaToCompletion)
  await store.runSagaToCompletion();

  const appHtml = renderToString(
    <Provider store={store}>
      <ConfigurationProvider>
        <StaticRouter location={url} context={context}>
          <GlobalStyle />
          <App />
        </StaticRouter>
      </ConfigurationProvider>
    </Provider>
  );

  const preloadedState = store.getState();

  return { appHtml, preloadedState };
}
