import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';

// VIEWS
import App from "views/components/app";
import GlobalStyle from 'views/style/global';
import ConfigurationProvider from "views/components/ConfigurationProvider";
import theme from "views/theme";
import 'views/style/global';
import * as serviceWorker from "./serviceWorker";

// CORE
import { store, persistor, sagaMiddleware } from 'core/store';
import rootSaga from "core/sagas/SagaIndex";
import history  from "core/services/history";


// store.runSaga(rootSaga);
sagaMiddleware.run(rootSaga);

const renderApp = () =>
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <ConfigurationProvider>
            <Router history={history}>
              <App />
            </Router>
          </ConfigurationProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>,
    document.getElementById("root")
  );

// if (import.meta.env.NODE_ENV !== "production" && module.hot) {
//   module.hot.accept("components/App", renderApp);
// 
//   module.hot.accept("components/app/App", renderApp);
// }

renderApp();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
